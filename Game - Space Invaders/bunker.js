function c_Bunker(l_pos_x = 0, l_pos_y = 0){

    this.NUM_BRICKS     = 5;

    this.positionX      = l_pos_x;
    this.positionY      = l_pos_y;

    this.bricks         = new Array(this.NUM_BRICKS);

    this.init           = m_bunker_init;
    this.draw           = m_bunker_draw;
    this.checkCollision = m_bunker_check_collision;
    this.update         = m_bunker_update;
}

function m_bunker_init(){
    for(var i=0; i<3; i++){
        this.bricks[i] = new c_Brick(this.positionX + i * 32, this.positionY);
    }
    this.bricks[3] = new c_Brick(this.positionX, this.positionY + 32);
    this.bricks[4] = new c_Brick(this.positionX + 64, this.positionY + 32);
}

function m_bunker_check_collision(l_bullet){
    for(var i = 0; i < this.NUM_BRICKS; i++){
        if(!this.bricks[i].isAlive) continue;
        if(f_rectangleCollisionCheck(
            this.bricks[i].positionX, this.bricks[i].positionY, this.bricks[i].WIDTH, this.bricks[i].HEIGHT,
            l_bullet.positionX, l_bullet.positionY, l_bullet.WIDTH, l_bullet.HEIGHT
        )){
            this.bricks[i].hit();
            l_bullet.die();
            return;
        }
    }
}

function m_bunker_draw(l_context){
    for(var i=0; i<this.NUM_BRICKS; i++){
        this.bricks[i].draw(l_context);
    }
}

function m_bunker_update(l_spaceship, l_alien_horde){

    if(l_spaceship.bullet.isAlive && !l_spaceship.bullet.isDying) this.checkCollision(l_spaceship.bullet);

    for(var i=0; i < l_alien_horde.NUM_BULLETS; i++){
        if(!l_alien_horde.bulletArray[i].isAlive || l_alien_horde.bulletArray[i].isDying) continue;
        this.checkCollision(l_alien_horde.bulletArray[i]);
    }
}
