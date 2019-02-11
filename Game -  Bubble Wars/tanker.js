function c_Tanker(l_pos_x, l_pos_y, l_screen_size_x, l_screen_size_y, l_tanker_color, l_paddingTop = 0, l_frameRate){

    this.FRAME_RATE                 = l_frameRate;
    this.MAX_BULLETS                = 30;

    this.TURRET_TYPES               = {
        MACHINE_GUN                 : "Machine Gun",
        SHOT_GUN                    : "Shot Gun",
        DEFAULT                     : "Default"
    }
        this.TURRET_STATES      = [
        {
            TYPE                    : this.TURRET_TYPES.DEFAULT,
            COLOR                   : "red"
        },
        {
            TYPE                    : this.TURRET_TYPES.MACHINE_GUN,
            COLOR                   : "black"
        },
        {
            TYPE                    : this.TURRET_TYPES.SHOT_GUN,
            COLOR                   : "black"
        }
    ];

    this.CODE_DIDNT_MOVE            = -1;
    this.CODE_DEAD                  = -2;
    
    this.SCREEN_WIDTH               = l_screen_size_x;
    this.SCREEN_HEIGHT              = l_screen_size_y;
    this.PADDING_TOP                = l_paddingTop;
    this.ORIGINAL_RADIUS            = 16;
    this.ORIGINAL_POS_X             = l_pos_x;
    this.ORIGINAL_POS_Y             = l_pos_y;
    this.TANKER_RADIUS              = 16;
    this.TURRET_SIZE_X              = 22;
    this.TURRET_SIZE_Y              = 10;
    this.TANKER_COLOR               = l_tanker_color;
    this.PI                         = 3.14;
    this.ROTATION_SPEED             = 6 / l_frameRate; // 0.03
    this.MOVE_SPEED                 = 90 / l_frameRate; // 0.5
    this.MAX_RADIUS                 = l_screen_size_x * 1.5;
    this.DIE_SPEED                  = (this.MAX_RADIUS - this.TANKER_RADIUS) / l_frameRate;
   
    this.MACHINE_GUN_SHOOT_DELAY    = 0.1 * l_frameRate;
    this.SHOT_GUN_SHOOT_DELAY       = 0.5 * l_frameRate;
    this.SHOT_GUN_BURST_COUNT       = 7;

    this.positionX                  = l_pos_x;
    this.positionY                  = l_pos_y;
    this.tempPositionX              = 0;
    this.tempPositionY              = 0;

    this.turretState                = this.TURRET_STATES[0];
    
    this.isAlive                    = true;
    this.isDying                    = false;
    
    this.rotation                   = -this.PI/2;
    this.rotationDirection          = 0; //1 for clockwise -1 for anticlockwise 0 for stop
    
    this.bullets                    = new Array(this.MAX_BULLETS); 
    
    this.shootFrameCounter          = 0;
    this.shotBurstCounter           = 0;
    this.canShoot                   = true;

    this.init                   = m_tanker_init;
    this.update                 = m_tanker_update;
    this.updateBullets          = m_tanker_update_bullets;
    this.draw                   = m_tanker_draw;
    this.drawBullets            = m_tanker_draw_bullets;
    this.drawTanker             = m_tanker_draw_tanker;
    this.drawTurret             = m_tanker_draw_turret;
    this.move                   = m_tanker_move;
    this.rotate                 = m_tanker_rotate;
    this.shoot                  = m_tanker_shoot;
    this.reset                  = m_tanker_reset;
    this.setDefault             = m_tanker_set_default;
    this.setMachineGun          = m_tanker_set_machine_gun;
    this.setShotGun             = m_tanker_set_shot_gun;
    this.fireDefault            = m_tanker_fire_default;
    this.fireMachineGun         = m_tanker_fire_machine_gun;
    this.fireShotGun            = m_tanker_fire_shot_gun;
    this.setBulletColor         = m_tanker_set_bullet_color;
    this.hit                    = m_tanker_hit;
    this.checkIfDying           = m_tanker_check_if_dying;
    this.checkMachineGunTimer   = m_tanker_check_machine_gun_timer;
    this.checkShotGunTimer      = m_tanker_check_shot_gun_timer;
}

function m_tanker_init(){
    for(var i=0; i<this.MAX_BULLETS; i++){
        this.bullets[i] = new c_Bullet(this.positionX, this.positionY, this.SCREEN_WIDTH, this.SCREEN_HEIGHT, this.turretState.COLOR, this.FRAME_RATE);
    }
}

function m_tanker_update(l_moveDirX, l_moveDirY){

    this.checkIfDying();
    this.updateBullets();

    if(this.turretState.TYPE == this.TURRET_TYPES.MACHINE_GUN) this.checkMachineGunTimer();
    else if(this.turretState.TYPE == this.TURRET_TYPES.SHOT_GUN) this.checkShotGunTimer();

    if(!this.move(l_moveDirX, l_moveDirY)) return this.CODE_DIDNT_MOVE;
    if(this.isDying) return this.CODE_DEAD;

}

function m_tanker_update_bullets(){
    for(var i=0; i<this.MAX_BULLETS; i++){
        this.bullets[i].update();
    }
}

function m_tanker_draw(l_context){
    this.drawBullets(l_context);
    this.drawTanker(l_context);
    this.drawTurret(l_context);
}

function m_tanker_draw_bullets(l_context){
    for(var i=0; i<this.MAX_BULLETS; i++){
        this.bullets[i].draw(l_context);
    }
}

function m_tanker_draw_tanker(l_context){
    l_context.fillStyle = this.TANKER_COLOR;
    l_context.beginPath();
    l_context.arc(this.positionX, this.positionY, this.TANKER_RADIUS, 0, 2 * this.PI);
    l_context.fill();
}

function m_tanker_draw_turret(l_context){
    if(this.isDying) return;
    l_context.save();
    l_context.translate(this.positionX, this.positionY);
    l_context.rotate(this.rotation);
    l_context.translate(-this.positionX, -this.positionY);
    l_context.fillStyle = this.turretState.COLOR;
    l_context.fillRect(this.positionX - 8, this.positionY - 8, 16, 16);
    l_context.fillRect(this.positionX, this.positionY - this.TURRET_SIZE_Y/2, this.TURRET_SIZE_X, this.TURRET_SIZE_Y);
    l_context.restore();
}

function m_tanker_move(l_moveDirX, l_moveDirY){
    // move self returns false if didnt move
    if(l_moveDirX == 0 && l_moveDirY == 0) return false;
    this.tempPositionX = this.positionX + this.MOVE_SPEED * l_moveDirX;
    this.tempPositionY = this.positionY + this.MOVE_SPEED * l_moveDirY;

    if(this.tempPositionX > this.TANKER_RADIUS && this.tempPositionX < this.SCREEN_WIDTH - this.TANKER_RADIUS) this.positionX = this.tempPositionX;
    if(this.tempPositionY > this.PADDING_TOP + this.TANKER_RADIUS && this.tempPositionY < this.SCREEN_HEIGHT - this.TANKER_RADIUS) this.positionY = this.tempPositionY;
    return true;
}

function m_tanker_rotate(l_rotateDir){
    // rotate self
    this.rotationDirection = l_rotateDir;
    this.rotation += this.ROTATION_SPEED * this.rotationDirection;
    if(Math.abs(this.rotation) >= 2 * this.PI) this.rotation = 0;
}

function m_tanker_shoot(){
    switch(this.turretState.TYPE){
        case this.TURRET_TYPES.DEFAULT:
            this.fireDefault();
            break;
        case this.TURRET_TYPES.MACHINE_GUN:
            this.fireMachineGun();
            break;
        case this.TURRET_TYPES.SHOT_GUN:
            this.fireShotGun();
            break;
    }
}

function m_tanker_reset(){
    this.isAlive = true;
    this.isDying = false;
    this.TANKER_RADIUS = this.ORIGINAL_RADIUS;
    this.positionX = this.ORIGINAL_POS_X;
    this.positionY = this.ORIGINAL_POS_Y;
    this.rotation = -this.PI/2;

    for(var i=0; i<this.MAX_BULLETS; i++) this.bullets[i].isAlive = false;
    this.setDefault();
}

function m_tanker_set_default(){
    this.turretState = this.TURRET_STATES[0];
    this.setBulletColor(this.turretState.COLOR);
}

function m_tanker_set_machine_gun(){
    this.turretState = this.TURRET_STATES[1];
    this.setBulletColor(this.turretState.COLOR);

}

function m_tanker_set_shot_gun(){
    this.turretState = this.TURRET_STATES[2];
    this.setBulletColor(this.turretState.COLOR);
}

function m_tanker_fire_default(){
    if(this.bullets[0].isAlive || this.isDying) return;
    this.bullets[0].fire(this.positionX, this.positionY, this.TURRET_SIZE_X, this.rotation);
}

function m_tanker_fire_machine_gun(){
    if(!this.canShoot || this.isDying) return;
    this.canShoot = false;
    for(var i=0; i<this.MAX_BULLETS; i++){
        if(!this.bullets[i].isAlive){
            this.bullets[i].fire(this.positionX, this.positionY, this.TURRET_SIZE_X, this.rotation);
            return;
        }
    }
}

function m_tanker_fire_shot_gun(){
    if(!this.canShoot || this.isDying) return;
    this.canShoot = false;

    // check if we have the necessary amount of shots
    this.shotBurstCounter = 0;
    for(var i=0; i<this.MAX_BULLETS; i++){
        if(!this.bullets[i].isAlive){
            this.shotBurstCounter++;
            this.bullets[i].fire(this.positionX, this.positionY, this.TURRET_SIZE_X, this.rotation + (Math.random() * 0.6- 0.3));
            if(this.shotBurstCounter > this.SHOT_GUN_BURST_COUNT) return;
        }
    }
    // if(this.shotBurstCounter < this.SHOT_GUN_BURST_COUNT) return;

    // // shoot if yes
    // this.shotBurstCounter = 0;
    // for(var i=0; i<this.MAX_BULLETS; i++){
    //     if(!this.bullets[i].isAlive){
    //         this.shotBurstCounter++;
        
    //         if(this.shotBurstCounter >= this.SHOT_GUN_BURST_COUNT) return;
    //     }
    // }
}

function m_tanker_set_bullet_color(l_color){
    for(var i=0; i < this.MAX_BULLETS; i++){
        this.bullets[i].setColor(l_color);
    }
}

function m_tanker_hit(){
    this.isDying = true;
}

function m_tanker_check_if_dying(){
    if(this.isDying){
        this.TANKER_RADIUS += this.DIE_SPEED;
        if(this.TANKER_RADIUS >= this.MAX_RADIUS){
            this.isAlive = false;
        }
    }
}

function m_tanker_check_machine_gun_timer(){
    if(!this.canShoot){
        this.shootFrameCounter++;
        if(this.shootFrameCounter >= this.MACHINE_GUN_SHOOT_DELAY){
            this.shootFrameCounter = 0;
            this.canShoot = true;
        }
    }
}

function m_tanker_check_shot_gun_timer(){
    if(!this.canShoot){
        this.shootFrameCounter++;
        if(this.shootFrameCounter >= this.SHOT_GUN_SHOOT_DELAY){
            this.shootFrameCounter = 0;
            this.canShoot = true;
        }
    }
}