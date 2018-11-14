function c_Alien(l_pos_x = 0, l_pos_y = 0, l_type, l_score, l_bmp_rows, l_bmp_columns, l_bmp_cell_size, l_bmp_cell_color, l_frame_rate = 30){

    this.WIDTH              = l_bmp_columns * l_bmp_cell_size;
    this.HEIGHT             = l_bmp_rows * l_bmp_cell_size;
    this.COLOR              = l_bmp_cell_color;

    this.DEATH_TIME         = l_frame_rate / 2;

    this.positionX          = l_pos_x;
    this.positionY          = l_pos_y;

    this.type               = l_type;
    this.score              = l_score;
    this.isAlive            = true;
    this.isDying            = false;
    this.deathFrameCounter  = 0;

    this.bitmap             = new c_Bitmap(l_pos_x, l_pos_y, l_bmp_rows, l_bmp_columns, l_bmp_cell_size, l_bmp_cell_color);

    this.draw           = m_alien_draw;
    this.update         = m_alien_update;
    this.setBitmap      = m_alien_set_bitmap;
    this.setPosition    = m_alien_set_position;
    this.move           = m_alien_move;
    this.die            = m_alien_die;
}


function m_alien_draw(l_context){
    if(!this.isAlive) return;
    if(this.isAlive && this.isDying){
        f_drawText( this.positionX + this.WIDTH/2, this.positionY + this.HEIGHT/2,
                    this.score, 20, this.COLOR);
        return;
    }
    this.bitmap.draw(l_context);
}

function m_alien_update(){
    if(this.isAlive && this.isDying) {
        this.deathFrameCounter++;
        if(this.deathFrameCounter >= this.DEATH_TIME){
            this.isAlive = false;
            this.isDying = false;
        }
    }
}

function m_alien_set_bitmap(l_bitmap_string){
    if(!this.isAlive) return;
    this.bitmap.setBitmap(l_bitmap_string);
}

function m_alien_move(l_offset_x, l_offset_y){
    if(!this.isAlive || this.isDying) return;

    this.positionX = this.positionX + l_offset_x;
    this.positionY = this.positionY + l_offset_y;
    this.bitmap.setPosition(this.positionX, this.positionY);
}

function m_alien_die(){
    if(!this.isAlive || this.isDying) return;
    this.deathFrameCounter = 0;
    this.isDying = true;
}

function m_alien_set_position(l_pos_x, l_pos_y){
    if(!this.isAlive || this.isDying) return;
    this.positionX = l_pos_x;
    this.positionY = l_pos_y;
    this.bitmap.setPosition(this.positionX, this.positionY);
}
