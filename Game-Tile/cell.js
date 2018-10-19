function c_Cell(l_grid_i, l_grid_j, l_pos_x, l_pos_y, l_cell_size = 48, l_cell_value = "D", l_cell_stroke_width = 2, l_font_style = "serif", l_font_color = "#333333"){

    this.gridI      = l_grid_i;
    this.gridJ      = l_grid_j;

    this.positionX  = l_pos_x;
    this.positionY  = l_pos_y;

    this.cellSize   = l_cell_size;
    this.cellValue  = l_cell_value;
    this.cellStroke = l_cell_stroke_width;

    this.fontSize   = this.cellSize/1.4;
    this.fontStyle  = l_font_style;
    this.fontColor  = l_font_color;

    this.isHovering = false;

    this.draw           = m_cell_draw;
    this.empty          = m_cell_empty;
    this.hit            = m_cell_hit;
    this.setHovering    = m_cell_set_hovering;
    this.setPosition    = m_cell_set_position;
    this.setValue       = m_cell_set_value;
}

function m_cell_draw(l_context){

    if(this.isHovering){
        l_context.strokeStyle = "#0000002f";
        l_context.lineWidth = 15;
        l_context.strokeRect(this.positionX - 6, this.positionY - 6, this.cellSize + 12, this.cellSize + 12);
    }

    if(this.cellValue != ""){
        l_context.strokeStyle = this.fontColor;
        l_context.lineWidth = this.cellStroke;
        l_context.strokeRect(this.positionX, this.positionY, this.cellSize, this.cellSize);

        l_context.font = this.fontSize.toString() + "px " + this.fontStyle;
        l_context.textAlign = "center";
        l_context.textBaseline = "middle";
        l_context.fillStyle = this.fontColor;
        l_context.fillText(this.cellValue, this.positionX + this.cellSize/2, this.positionY + this.cellSize/2);
    }
    else{
        l_context.fillStyle = "black";
        l_context.fillRect(this.positionX, this.positionY, this.cellSize, this.cellSize);

        l_context.strokeStyle = "white";
        l_context.lineWidth = this.cellStroke;
        l_context.strokeRect(this.positionX + 3, this.positionY + 3, this.cellSize -6, this.cellSize -6);
    }

}

function m_cell_empty(){
    this.cellValue = "";
}

function m_cell_hit(l_pos_x, l_pos_y){
    if(l_pos_x >= this.positionX && l_pos_x <= this.positionX + this.cellSize
    && l_pos_y >= this.positionY && l_pos_y <= this.positionY + this.cellSize){
        return true;
    }
    return false;
}

function m_cell_set_hovering(l_bool){
    this.isHovering = l_bool;
}

function m_cell_set_position(l_pos_x, l_pos_y){
    this.positionX = l_pos_x;
    this.positionY = l_pos_y;
}

function m_cell_set_value(l_val){
    this.cellValue = l_val;
}
