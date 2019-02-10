function c_Bullet(l_pos_x, l_pos_y, l_screen_size_x, l_screen_size_y, l_bullet_color, l_frameRate){
    this.RADIUS     = 8;
    this.SPEED      = 480 / l_frameRate;
    this.COLOR      = l_bullet_color;
    this.PI         = 3.14;
    this.SCREEN_X   = l_screen_size_x;
    this.SCREEN_Y   = l_screen_size_y;
    this.positionX  = l_pos_x;
    this.positionY  = l_pos_y;
    this.isAlive    = false;

    this.shotOriginX            = 0;
    this.shotOriginY            = 0;
    this.shotOffset             = 0;
    this.shotAngle              = 0;
    this.shotDistanceCovered    = 0;

    this.update                     = m_bullet_update;
    this.draw                       = m_bullet_draw;
    this.fire                       = m_bullet_fire;
    this.move                       = m_bullet_move;
    this.checkBoundary              = m_bullet_check_boundary_collision;
    this.setColor                   = m_bullet_set_color;
    this.hit                        = m_bullet_hit;
}

function m_bullet_update(){
    this.move();
    this.checkBoundary();
}

function m_bullet_check_boundary_collision(){
    if(!this.isAlive) return;
    if(this.positionX < 0 || this.positionX > this.SCREEN_X) this.isAlive = false;
    if(this.positionY < 0 || this.positionY > this.SCREEN_Y) this.isAlive = false;
}

function m_bullet_move(){
    if(!this.isAlive) return;
    this.positionX = this.shotOriginX + (this.shotOffset + this.RADIUS + this.shotDistanceCovered) * Math.cos(this.shotAngle);
    this.positionY = this.shotOriginY + (this.shotOffset + this.RADIUS + this.shotDistanceCovered) * Math.sin(this.shotAngle);
    this.shotDistanceCovered += this.SPEED;
}

function m_bullet_fire(l_shot_origin_x, l_shot_origin_y, l_shot_offset, l_shot_angle){
    this.isAlive = true;
    this.shotDistanceCovered = 0;
    this.shotOriginX = l_shot_origin_x;
    this.shotOriginY = l_shot_origin_y;
    this.shotOffset = l_shot_offset;
    this.shotAngle = l_shot_angle;
    // this.move();
}

function m_bullet_draw(l_context){
    if(!this.isAlive) return;
    l_context.beginPath();
    l_context.fillStyle = this.COLOR;
    l_context.arc(this.positionX, this.positionY, this.RADIUS, 0, 2 * this.PI);
    l_context.fill();
}

function m_bullet_set_color(l_color){
    this.COLOR = l_color;
}

function m_bullet_hit(){
    this.isAlive = false;
}
