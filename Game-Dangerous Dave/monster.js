function c_Monster(l_centerX, l_centerY, l_radius, l_frame_rate){

    this.PI             = Math.PI;
    this.DEATH_TIME     = l_frame_rate;

    this.img            = new Image();
    this.deathImgArray  = new Array();

    this.pathCenterX    = l_centerX;
    this.pathCenterY    = l_centerY;
    this.orgPathCenterX = l_centerX;
    this.orgPathCenterY = l_centerY;
    this.pathRadius     = l_radius;
    this.pathAngle      = 0;
    this.pathSpeed      = 0.05;

    this.positionX      = 0;
    this.positionY      = 0;
    this.width          = 36;
    this.height         = 18;

    this.bulletImg      = new Image();
    this.bullet         = new c_Bullet(this.bulletImg, 30, 8, l_frame_rate);

    this.isAlive        = true;
    this.isDying        = false;

    this.currentFrame       = 0;
    this.maxFrames          = 0;
    this.deathAnimDelay     = l_frame_rate / 8;
    this.deathFrameCounter  = 0;
    this.frameCounter       = 0;

    this.maxFrames          = 0;

    this.init           = m_monster_init;
    this.draw           = m_monster_draw;
    this.update         = m_monster_update;
    this.shoot          = m_monster_shoot;
    this.die            = m_monster_die;
    this.reset          = m_monster_reset;
}

function m_monster_init(){
    this.img.src = "img/monster.png";
    for(var i=0; i<2; i++){
        this.deathImgArray.push(new Image());
        this.deathImgArray[i].src = "img/explosion" + (i+1) + ".png";
    }
    this.bulletImg.src = "img/monsterBullet.png";
    this.maxFrames = this.deathImgArray.length;
}

function m_monster_draw(l_context){
    this.bullet.draw(l_context);
    if(!this.isAlive) return;
    if(!this.isDying) l_context.drawImage(this.img, this.positionX, this.positionY, this.width, this.height);
    else{
        l_context.drawImage(this.deathImgArray[this.currentFrame], this.positionX, this.positionY, this.width - 4, this.width - 4);
        this.frameCounter++;
        this.deathFrameCounter++;
        if(this.frameCounter >= this.deathAnimDelay){
            this.frameCounter = 0;
            this.currentFrame++;
            if(this.currentFrame >= this.maxFrames) this.currentFrame = 0;
        }
        if(this.deathFrameCounter > this.DEATH_TIME){
            this.deathFrameCounter = 0;
            this.isDying = false;
            this.isAlive = false;
            this.currentFrame = 0;
        }
    }
}

function m_monster_update(){
    this.bullet.update();
    if(!this.bullet.isAlive && this.isAlive && !this.isDying) this.bullet.shoot(this.positionX, this.positionY, this.bullet.DIR_LEFT);
    else if(this.bullet.positionX <= -this.bullet.width) this.bullet.die();

    if(!this.isAlive || this.isDying) return;

    this.positionX = this.pathCenterX + Math.cos(this.pathAngle) * this.pathRadius;
    this.positionY = this.pathCenterY + Math.sin(this.pathAngle) * this.pathRadius;
    if(this.pathAngle >= 2 * this.PI) this.pathAngle = 0;
    this.pathAngle += this.pathSpeed;
}

function m_monster_shoot(){

}

function m_monster_die(){
    this.isDying = true;
}

function m_monster_reset(){
    this.pathCenterX = this.orgPathCenterX;
    this.pathCenterY = this.orgPathCenterY;
    this.isAlive = true;
}
