function c_Bitmap(l_pos_x = 0, l_pos_y = 0, l_rows = 16, l_columns = 16, l_cell_size = 2, l_cell_color = "#000000"){
    this.width      = l_columns;
    this.height     = l_rows;
    this.totalCells = l_rows * l_columns;
    this.cellSize   = l_cell_size;
    this.cellColor  = l_cell_color;

    this.grid       = new Array(this.totalCells);
    this.data       = null;

    this.tempData   = null;

    this.init           = m_bitmap_init;
    this.draw           = m_bitmap_draw;
    this.setBitmap      = m_bitmap_set_bitmap;
    this.setPosition    = m_bitmap_set_position;
    this.setColor       = m_bitmap_set_color;

    this.init(l_pos_x, l_pos_y);
}

function m_bitmap_init(l_pos_x, l_pos_y){
    for(var i=0; i<this.totalCells;i++){
        this.grid[i] = new c_Cell(l_pos_x + (i % this.width) * this.cellSize,
                                l_pos_y + Math.floor(i/ this.width) * this.cellSize,
                                this.cellSize, this.cellColor);
    }
}

function m_bitmap_draw(l_context){
    if(this.data == null) return;
    for(var i=0; i<this.totalCells; i++){
        if(this.data[i] == 1) this.grid[i].draw(l_context);
    }
}

function m_bitmap_set_bitmap(l_bitmap_string){
    this.tempData   = l_bitmap_string.split(",");
    if(this.tempData.length != this.totalCells){
        console.log("setBitmap Error. Incorrect length");
        return;
    }

    for(var i=0; i<this.totalCells; i++){
        this.tempData[i] = parseInt(this.tempData[i]);
    }
    this.data = this.tempData;
}

function m_bitmap_set_position(l_pos_x, l_pos_y){
    for(var i=0; i<this.totalCells; i++){
        this.grid[i].positionX = l_pos_x + (i % this.width) * this.cellSize;
        this.grid[i].positionY = l_pos_y + Math.floor(i / this.width) * this.cellSize;
    }
}

function m_bitmap_set_color(l_color){
    for(var i=0; i<this.totalCells; i++){
        this.grid[i].color = l_color;
    }
}
