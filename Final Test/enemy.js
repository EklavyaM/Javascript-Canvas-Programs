function c_Enemy(){

    this.STATE      = {
        DEFAULT : 0,
        REVERSE : 1
    };

    this.SPEED      = 0;
    this.REV_SPEED  = 0;
    this.RADIUS     = 0;
    this.PI         = 3.14;
    this.DIE_SPEED  = 0;
    this.COLOR      = "black";
    this.REV_WIDTH  = 4;
    this.positionX  = 0;
    this.positionY  = 0;
    this.dirX       = 0;
    this.dirY       = 0;
    
    this.isAlive    = false;
    this.isDying    = false;

    this.state      = this.STATE.DEFAULT;
    
    this.update             = m_enemy_update;
    this.move               = m_enemy_move;
    this.moveDefault        = m_enemy_move_default;
    this.moveReverse        = m_enemy_move_reverse;
    this.draw               = m_enemy_draw;
    this.drawDefault        = m_enemy_draw_default;
    this.drawReverse        = m_enemy_draw_reverse;
    this.set                = m_enemy_set;
    this.setPos             = m_enemy_set_pos;
    this.setSpeed           = m_enemy_set_speed;
    this.setRadius          = m_enemy_set_radius;
    this.setDieSpeed        = m_enemy_set_die_speed;
    this.setDir             = m_enemy_set_dir;
    this.setDefault         = m_enemy_set_state_default;
    this.setReverse         = m_enemy_set_state_reverse;
    this.hit                = m_enemy_hit;
}

function m_enemy_update(){
    if(!this.isAlive) return;
    if(this.isDying){
        this.RADIUS -= this.DIE_SPEED;
        if(this.RADIUS < 0) {
            this.isAlive = false;
            this.isDying = false;
            this.RADIUS = 0;
        }
    }
    this.move();
}

function m_enemy_move(){
    if(!this.isAlive) return;
    if(this.state == this.STATE.DEFAULT){
        this.moveDefault();
    }
    else if(this.state == this.STATE.REVERSE){
        this.moveReverse();
    }
}

function m_enemy_move_default(){
    this.positionX += this.dirX * this.SPEED;
    this.positionY += this.dirY * this.SPEED;
}

function m_enemy_move_reverse(){
    this.positionX += -this.dirX * this.REV_SPEED;
    this.positionY += -this.dirY * this.REV_SPEED;
}

function m_enemy_draw(l_context){
    if(!this.isAlive) return;
    if(this.state == this.STATE.DEFAULT){
        this.drawDefault(l_context);
    }
    if(this.state == this.STATE.REVERSE){
        this.drawReverse(l_context);
    }
}

function m_enemy_draw_default(l_context){
    l_context.fillStyle = this.COLOR;
    l_context.beginPath();
    l_context.arc(this.positionX, this.positionY, this.RADIUS, 0, 2 * this.PI);
    l_context.fill();
}

function m_enemy_draw_reverse(l_context){
    l_context.strokeStyle = this.COLOR;
    l_context.beginPath();
    l_context.arc(this.positionX, this.positionY, this.RADIUS, 0, 2 * this.PI);
    l_context.lineWidth = this.REV_WIDTH;
    l_context.stroke();
}

function m_enemy_set(l_posX, l_posY, l_speed, l_radius, l_dieSpeed, l_dirX, l_dirY){
    if(this.isAlive) return;
    this.setPos(l_posX, l_posY);
    this.setSpeed(l_speed);
    this.setRadius(l_radius);
    this.setDieSpeed(l_dieSpeed);
    this.setDir(l_dirX, l_dirY);
    this.isAlive = true;
}

function m_enemy_set_pos(l_posX, l_posY){
    this.positionX = l_posX;
    this.positionY = l_posY;
}

function m_enemy_set_speed(l_speed){
    this.SPEED = l_speed;
    this.REV_SPEED = l_speed * 0.7;
}

function m_enemy_set_radius(l_radius){
    this.RADIUS = l_radius;
}

function m_enemy_set_die_speed(l_dieSpeed){
    this.DIE_SPEED = l_dieSpeed;
}

function m_enemy_set_dir(l_dirX, l_dirY){
    this.dirX = l_dirX;
    this.dirY = l_dirY;
}

function m_enemy_set_state_default(){
    this.state = this.STATE.DEFAULT;
}

function m_enemy_set_state_reverse(){
    this.state = this.STATE.REVERSE;
}

function m_enemy_hit(){
    this.isDying = true;
}