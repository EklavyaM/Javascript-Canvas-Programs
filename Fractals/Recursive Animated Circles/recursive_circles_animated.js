function c_RecursiveCirclesAnimated(l_pos_x, l_pos_y, l_radius, l_anim_speed, l_stroke_color,
                                    l_timePerFrame, l_size_factor = 0.75, l_limit = 1){ //dont change limit
    this.MAX_LIMIT      = 7;
    this.level          = l_limit;
    this.sprite         = new c_AnimatedCircle(l_pos_x, l_pos_y, l_radius, l_anim_speed, l_stroke_color, l_timePerFrame);
    this.neighbors      = null;
    this.shouldDraw     = false;

    this.draw               = m_recursive_circles_animated_draw;
    this.drawNeighbors      = m_recursive_circles_animated_draw_neighbors;

    if(this.level < this.MAX_LIMIT){
        this.neighbors = new Array(4);
        this.neighbors[0] = new c_RecursiveCirclesAnimated(l_pos_x + l_radius,
                                                            l_pos_y,
                                                            l_radius * l_size_factor,
                                                            l_anim_speed, l_stroke_color,
                                                            l_timePerFrame, l_size_factor, l_limit + 1);
        this.neighbors[1] = new c_RecursiveCirclesAnimated(l_pos_x - l_radius,
                                                            l_pos_y,
                                                            l_radius * l_size_factor,
                                                            l_anim_speed, l_stroke_color,
                                                            l_timePerFrame, l_size_factor, l_limit + 1);
        this.neighbors[2] = new c_RecursiveCirclesAnimated(l_pos_x,
                                                            l_pos_y  + l_radius,
                                                            l_radius * l_size_factor,
                                                            l_anim_speed, l_stroke_color,
                                                            l_timePerFrame, l_size_factor, l_limit + 1);
        this.neighbors[3] = new c_RecursiveCirclesAnimated(l_pos_x,
                                                            l_pos_y - l_radius,
                                                            l_radius * l_size_factor,
                                                            l_anim_speed, l_stroke_color,
                                                            l_timePerFrame, l_size_factor, l_limit + 1);
    }
    else{
        this.shouldDraw = true;
    }
}

function m_recursive_circles_animated_draw(l_context){
    this.sprite.draw(l_context);
    if(this.sprite.animFinished){
        this.drawNeighbors(l_context);
    }
}

function m_recursive_circles_animated_draw_neighbors(l_context){
    if(this.neighbors == null) return;
    for(var i = 0; i < 4; i++){
        this.neighbors[i].draw(l_context);
    }
}
