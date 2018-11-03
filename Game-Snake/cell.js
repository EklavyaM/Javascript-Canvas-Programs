function c_Cell(l_pos_x = 0, l_pos_y = 0, l_radius = 5, l_color = "white"){
    this.PI         = Math.PI;

    this.positionX  = l_pos_x;
    this.positionY  = l_pos_y;
    this.radius     = l_radius;
    this.color      = l_color;
    this.isAlive    = false;

    this.__diff_x   = 0;
    this.__diff_y   = 0;
    this.__dist     = 0;

    this.draw           = m_cell_draw;
}

function m_cell_draw(l_context){
    if(!this.isAlive) return;
    l_context.fillStyle = this.color;
    l_context.beginPath();
    l_context.arc(this.positionX, this.positionY, this.radius, 0, 2*this.PI);
    l_context.closePath();
    l_context.fill();
}
