function c_Bullet(l_pos_x = 0, l_pos_y = 0, l_bullet_speed, l_bmp_frames, l_bmp_rows, l_bmp_cols, l_bmp_cell_size, l_bmp_cell_color, l_frame_rate = 30){

    this.SPEED              = l_bullet_speed;

    this.WIDTH              = l_bmp_cols * l_bmp_cell_size;
    this.HEIGHT             = l_bmp_rows * l_bmp_cell_size;

    this.DEATH_TIME         = l_frame_rate / 8;

    this.positionX          = l_pos_x;
    this.positionY          = l_pos_y;
    this.isAlive            = false;
    this.isDying            = false;

    this.deathFrameCounter  = 0;

    this.bitmapArray        = l_bmp_frames;

    this.bitmap             = new c_Bitmap(l_pos_x, l_pos_y, l_bmp_rows, l_bmp_cols, l_bmp_cell_size, l_bmp_cell_color);
    this.bitmap.setBitmap(this.bitmapArray[0]);

    this.move           = m_bullet_move;
    this.draw           = m_bullet_draw;
    this.die            = m_bullet_die;
    this.reset          = m_bullet_reset;
    this.setPosition    = m_bullet_set_position;
    this.setColor       = m_bullet_set_color;
}

function m_bullet_move(){

    if(!this.isAlive) return;

    if(this.isAlive && this.isDying) {
        this.deathFrameCounter++;
        if(this.deathFrameCounter >= this.DEATH_TIME){
            this.reset();
        }
        return;
    }

    this.positionY += this.SPEED;
    this.bitmap.setPosition(this.positionX, this.positionY);
}

function m_bullet_draw(l_context){
    if(!this.isAlive) return;
    this.bitmap.draw(l_context);
}

function m_bullet_die(){
    if(!this.isAlive || this.isDying) return;
    this.deathFrameCounter = 0;
    this.isDying = true;
    this.bitmap.setBitmap(this.bitmapArray[1]);
}

function m_bullet_reset(){
    this.isAlive = false;
    this.isDying = false;
    this.deathFrameCounter = 0;
    this.positionX = -200;
    this.positionY = -200;
    this.bitmap.setBitmap(this.bitmapArray[0]);
    this.bitmap.setPosition(this.positionX, this.positionY);
}

function m_bullet_set_position(l_pos_x, l_pos_y){
    this.positionX = l_pos_x;
    this.positionY = l_pos_y;
}

function m_bullet_set_color(l_color){
    this.bitmap.setColor(l_color);
}
