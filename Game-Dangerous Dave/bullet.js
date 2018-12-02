function c_Bullet(l_img, l_sizeX, l_sizeY, l_frame_rate){

    this.MAX_VEL    = 400 / l_frame_rate;
    this.DIR_LEFT   = 1;
    this.DIR_RIGHT  = 2;

    this.img        = l_img;

    this.positionX  = 0;
    this.positionY  = 0;
    this.width      = l_sizeX;
    this.height      = l_sizeY;
    this.isAlive    = false;

    this.currentDir = this.DIR_LEFT;
    this.scaleX     = 1;

    this.draw       = m_bullet_draw;
    this.update     = m_bullet_update;
    this.shoot      = m_bullet_shoot;
    this.die        = m_bullet_die;
}

function m_bullet_draw(l_context){
    if(!this.isAlive) return;

    l_context.save();
    if(this.scaleX == 1) l_context.translate(this.positionX, this.positionY);
    else l_context.translate(this.positionX + this.width, this.positionY);
    l_context.scale(this.scaleX, 1);
    l_context.drawImage(this.img, 0, 0, this.width, this.height);
    l_context.restore();

}

function m_bullet_update(){
    if(!this.isAlive) return;
    if(this.currentDir == this.DIR_RIGHT) this.positionX += this.MAX_VEL;
    else if(this.currentDir == this.DIR_LEFT) this.positionX -= this.MAX_VEL;
}

function m_bullet_shoot(l_posX, l_posY, l_dir){
    if(this.isAlive) return;
    this.currentDir = l_dir;
    this.positionX = l_posX;
    this.positionY = l_posY;
    this.isAlive = true;
    if(l_dir == this.DIR_RIGHT) this.scaleX = -1;
    else if(l_dir == this.DIR_LEFT) this.scaleX = 1;
}

function m_bullet_die(){
    this.isAlive = false;
}
