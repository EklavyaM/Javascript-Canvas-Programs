function c_Brick(l_pos_x = 0, l_pos_y = 0){


    this.BMP_ROWS       = 8;
    this.BMP_COLS       = 8;
    this.BMP_CELL_SIZE  = 4;
    this.BMP_CELL_COLOR = "#8C8FAD";

    this.WIDTH          = this.BMP_COLS * this.BMP_CELL_SIZE;
    this.HEIGHT         = this.BMP_ROWS * this.BMP_CELL_SIZE;

    this.positionX      = l_pos_x;
    this.positionY      = l_pos_y;

    this.lives          = 3;
    this.isAlive        = true;

    this.bitmapArray    = [
        "1, 1, 1, 1, 1, 1, 1, 1," +
        "1, 1, 1, 1, 1, 1, 1, 1," +
        "1, 1, 1, 1, 1, 1, 1, 1," +
        "1, 1, 1, 1, 1, 1, 1, 1," +
        "1, 1, 1, 1, 1, 1, 1, 1," +
        "1, 1, 1, 1, 1, 1, 1, 1," +
        "1, 1, 1, 1, 1, 1, 1, 1," +
        "1, 1, 1, 1, 1, 1, 1, 1",

        "1, 0, 1, 1, 0, 0, 1, 1,"  +
        "1, 1, 1, 1, 1, 1, 1, 1," +
        "1, 1, 1, 1, 1, 0, 0, 1," +
        "1, 0, 1, 1, 1, 1, 1, 1," +
        "1, 0, 1, 1, 1, 1, 1, 1," +
        "1, 1, 1, 1, 1, 1, 1, 1," +
        "1, 0, 0, 1, 1, 1, 1, 1," +
        "0, 0, 1, 1, 1, 1, 1, 1",

        "0, 0, 1, 1, 0, 0, 0, 1,"  +
        "1, 0, 1, 1, 0, 0, 1, 1," +
        "1, 0, 1, 1, 0, 1, 0, 1," +
        "0, 1, 0, 1, 1, 0, 1, 1," +
        "1, 0, 0, 1, 0, 0, 0, 1," +
        "1, 1, 1, 0, 0, 1, 0, 1," +
        "0, 0, 0, 1, 1, 1, 0, 1," +
        "0, 0, 1, 1, 1, 0, 1, 0"
    ];

    this.bitmap         = new c_Bitmap(l_pos_x, l_pos_y, this.BMP_ROWS, this.BMP_COLS, this.BMP_CELL_SIZE, this.BMP_CELL_COLOR);
    this.bitmap.setBitmap(this.bitmapArray[0]);

    this.hit            = m_brick_hit;
    this.draw           = m_brick_draw;
}

function m_brick_hit(){
    this.lives--;
    if(this.lives == 2){
        this.bitmap.setBitmap(this.bitmapArray[1]);
    }
    else if(this.lives == 1){
        this.bitmap.setBitmap(this.bitmapArray[2]);
    }
    if(this.lives <= 0) this.isAlive = false;
}

function m_brick_draw(l_context){
    if(!this.isAlive) return;
    this.bitmap.draw(l_context);
}
