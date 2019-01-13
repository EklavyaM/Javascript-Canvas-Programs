function c_AnimatedCircle(l_pos_x, l_pos_y, l_radius, l_anim_speed, l_stroke_color, l_timePerFrame){
    this.PI             = Math.PI;
    this.START_ANGLE    = Math.random() * 2 * this.PI//-Math.PI/2;
    this.FINISH_ANGLE   = 2 * Math.PI + this.START_ANGLE;
    this.TIME_PER_FRAME = l_timePerFrame;
    this.positionX      = l_pos_x;
    this.positionY      = l_pos_y;
    this.radius         = l_radius;
    this.animSpeed      = l_anim_speed;
    this.strokeColor    = l_stroke_color;
    this.arcAngle       = this.START_ANGLE;
    this.animFinished   = false;

    this.draw = m_animated_circle_draw;
}

function m_animated_circle_draw(l_context){
    l_context.strokeStyle = this.strokeColor;
    l_context.beginPath();
    if(this.animFinished){
        l_context.arc(this.positionX, this.positionY, this.radius, this.START_ANGLE, this.FINISH_ANGLE);
    }
    else{
        l_context.arc(this.positionX, this.positionY, this.radius, this.START_ANGLE, this.arcAngle);
        this.arcAngle += this.animSpeed * this.TIME_PER_FRAME;
        if(this.arcAngle >= this.FINISH_ANGLE) {
            this.animFinished = true;
        }
    }
    l_context.stroke();
}
