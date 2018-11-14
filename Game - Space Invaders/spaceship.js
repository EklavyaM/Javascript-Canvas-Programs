function c_Spaceship(l_pos_x = 0, l_pos_y = 0, l_boundary_width, l_boundary_height, l_frame_rate = 30){

    this.BOUNDARY_WIDTH     = l_boundary_width;
    this.BOUNDARY_HEIGHT    = l_boundary_height

    this.ERR_DIED           = 2;

    this.MAX_LIVES          = 3;

    this.DIR_LEFT           = 0;
    this.DIR_RIGHT          = 1;
    this.SHOOTING           = 2;

    this.FRAME_RATE         = l_frame_rate;

    this.SPEED              = 300 / l_frame_rate;

    this.INV_TIME           = l_frame_rate * 2;
    this.HIT_FLASH_TIME     = this.INV_TIME / 10;

    this.BMP_ROWS           = 16;
    this.BMP_COLS           = 15;
    this.BMP_CELL_SIZE      = 3;
    this.BMP_CELL_COLOR     = "#8C8FAD";

    this.HIT_COLOR          = "#ff5555";

    this.WIDTH              = this.BMP_COLS * this.BMP_CELL_SIZE;
    this.HEIGHT             = this.BMP_ROWS * this.BMP_CELL_SIZE;

    this.BULLET_SPEED       = -600 / l_frame_rate;

    this.POSITION_OFFSET    = 50;

    this.positionX          = l_pos_x;
    this.positionY          = l_pos_y;
    this.tempPositionX      = 0;
    this.currentDirX        = 0;

    this.score              = 0;
    this.lives              = this.MAX_LIVES;

    this.isAlive            = true;

    this.gotHit             = false;
    this.tempValue          = 0;

    this.bulletFrameCounter = 0;
    this.hitFrameCounter    = 0;
    this.bulletFrames = [
                            "0, 1, 0," +
                            "0, 1, 0," +
                            "0, 1, 0," +
                            "0, 0, 0",

                            "0, 0, 0," +
                            "1, 0, 1," +
                            "0, 0, 0," +
                            "1, 0, 1"
                        ];

    this.bullet             =  new c_Bullet(-200, -200, this.BULLET_SPEED, this.bulletFrames, 4, 3, 6, this.BMP_CELL_COLOR, this.FRAME_RATE);
    this.bitmap             = new c_Bitmap(l_pos_x, l_pos_y, this.BMP_ROWS, this.BMP_COLS, this.BMP_CELL_SIZE, this.BMP_CELL_COLOR);

    this.bitmapString       =   "0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0," +
                                "0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0," +
                                "0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0," +
                                "0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0," +
                                "0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0," +
                                "0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0," +
                                "0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0," +
                                "0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0," +
                                "1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1," +
                                "1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1," +
                                "1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1," +
                                "1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1," +
                                "1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1," +
                                "1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1," +
                                "1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1," +
                                "1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1";

    this.bitmap.setBitmap(this.bitmapString);

    this.update         = m_spaceship_update;
    this.draw           = m_spaceship_draw;
    this.move           = m_spaceship_move;
    this.shoot          = m_spaceship_shoot;
    this.addScore       = m_spaceship_add_score;
    this.hit            = m_spaceship_hit;

}

function m_spaceship_draw(l_context){
    this.bitmap.draw(l_context);
    this.bullet.draw(l_context);
}

function m_spaceship_update(l_input_array){
    if(!this.isAlive) return this.ERR_DIED;
    this.currentDirX = 0;

    if(l_input_array[this.DIR_LEFT]) this.currentDirX += -1;
    if(l_input_array[this.DIR_RIGHT]) this.currentDirX += 1;

    this.move();
    this.shoot(l_input_array[this.SHOOTING]);

    if(this.gotHit){
        this.hitFrameCounter++;
        if(this.hitFrameCounter >= this.INV_TIME) {
            this.gotHit = false;
            this.hitFrameCounter = 0;
            this.bitmap.setColor(this.BMP_CELL_COLOR);
            this.tempValue = 0;
        }
        else{
            if(this.hitFrameCounter >= this.tempValue * this.HIT_FLASH_TIME
                && this.hitFrameCounter < (this.tempValue + 1) * this.HIT_FLASH_TIME){
                    if(this.tempValue % 2 == 0) this.bitmap.setColor(this.HIT_COLOR);
                    else this.bitmap.setColor(this.BMP_CELL_COLOR);
                }
            else{
                this.tempValue++;
            }
        }
    }
}

function m_spaceship_move(){
    this.tempPositionX = this.positionX + this.currentDirX * this.SPEED;
    if(this.tempPositionX <= this.BOUNDARY_WIDTH - this.WIDTH - this.POSITION_OFFSET
        && this.tempPositionX >= this.POSITION_OFFSET){
            this.positionX = this.tempPositionX;
            this.bitmap.setPosition(this.positionX, this.positionY);

        }

    this.bullet.move();
    if(this.bullet.positionY <= this.POSITION_OFFSET) this.bullet.die();
}

function m_spaceship_shoot(l_shooting){
    if(l_shooting && !this.bullet.isAlive){
        this.bullet.isAlive = true;
        this.bullet.setPosition(this.positionX + this.WIDTH/2 - 10, this.positionY);
    }
}

function m_spaceship_add_score(l_points){
    this.score += l_points;
}

function m_spaceship_hit(){
    if(this.gotHit) return;
    this.lives--;
    this.gotHit = true;
    if(this.lives <= 0) this.isAlive = false;

}
