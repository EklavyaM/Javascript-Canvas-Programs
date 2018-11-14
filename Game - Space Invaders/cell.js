function c_Cell(l_pos_x = 0, l_pos_y = 0, l_size = 5, l_color = "white"){

    this.positionX  = l_pos_x;
    this.positionY  = l_pos_y;
    this.size       = l_size;
    this.color      = l_color;

    this.draw           = m_cell_draw;
}

function m_cell_draw(l_context){
    l_context.fillStyle = this.color;
    l_context.fillRect(this.positionX, this.positionY, this.size, this.size);
}
