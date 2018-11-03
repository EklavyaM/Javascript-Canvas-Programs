function c_Food(l_pos_x, l_pos_y, l_radius,
                l_boundary_width, l_boundary_height, l_vertical_offset,
                l_timer_color,
                l_frame_rate){
    this.BOUNDARY_WIDTH     = l_boundary_width;
    this.BOUNDARY_HEIGHT    = l_boundary_height;
    this.VERTICAL_OFFSET    = l_vertical_offset;

    this.FRAME_RATE         = l_frame_rate;

    this.RESPAWN_DELAY      = 3;

    this.TOTAL_TIME         = this.FRAME_RATE * this.RESPAWN_DELAY;

    this.TYPE_GROW          = 0;
    this.TYPE_SHRINK        = 1;
    this.TYPE_ACCELERATE    = 2;
    this.TYPE_DECELERATE    = 3;

    this.originalPositionX  = l_pos_x;
    this.originalPositionY  = l_pos_y;

    this.type               = this.TYPE_GROW;
    this.value              = 10;

    this.body               = new c_Cell(l_pos_x, l_pos_y, l_radius, f_getRandomColor());
    this.body.isAlive       = true;

    this.timer              = 0;
    this.colorTimer         = l_timer_color;
    this.timerWidth         = 8;

    this.timerAngleOffset   = 0;
    this.timerDiffPerFrame  = (2 * this.body.PI) / this.TOTAL_TIME;

    this.changePosition     = m_food_change_position;
    this.eaten              = m_food_eaten;
    this.update             = m_food_update;
    this.draw               = m_food_draw;
    this.reset              = m_food_reset;
}

function m_food_change_position(){
    this.body.positionX = parseInt(Math.random() * (this.BOUNDARY_WIDTH - this.body.radius * 4)) + this.body.radius * 2;
    this.body.positionY = parseInt(Math.random() * (this.BOUNDARY_HEIGHT - this.body.radius * 4 - this.VERTICAL_OFFSET)) + this.body.radius * 2 +  this.VERTICAL_OFFSET;
}

function m_food_eaten(){
    this.type = parseInt(Math.random() * 4);
    this.body.color = f_getRandomColor();
    this.changePosition();
    this.timer = 0;
    this.timerAngleOffset = 0;
}

function m_food_update(){
    this.timer++;
    this.timerAngleOffset += this.timerDiffPerFrame;
    if(this.timer > this.RESPAWN_DELAY * this.FRAME_RATE){
        this.timer = 0;
        this.timerAngleOffset = 0;
        this.eaten();
    }
}

function m_food_draw(l_context){
    this.body.draw(l_context);
    l_context.strokeStyle = this.colorTimer;
    l_context.beginPath();
    l_context.arc(this.body.positionX, this.body.positionY, this.body.radius, 0, 2 * this.body.PI - this.timerAngleOffset);
    l_context.lineWidth = this.timerWidth;
    l_context.stroke();
}

function m_food_reset(){
    this.body.positionX = this.originalPositionX;
    this.body.positionY = this.originalPositionY;
    this.timer = 0;
    this.timerAngleOffset = 0;
}
