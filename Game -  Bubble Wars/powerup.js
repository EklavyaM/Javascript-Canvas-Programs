function c_Powerup(l_total_time, l_body_radius, l_timer_width, l_body_color){

    this.TYPES                  = {
        MACHINE_GUN     : "Machine Gun",
        SHOT_GUN        : "Shot Gun"
    }
    
    this.STATES                 = [
        {
            TYPE    : this.TYPES.MACHINE_GUN,
            COLOR   : "red"
        },
        {
            TYPE    : this.TYPES.SHOT_GUN,
            COLOR   : "blue"
        }
    ];

    this.PI                     = 3.14;
    this.TOTAL_TIME             = l_total_time;
    this.RADIUS                 = l_body_radius;
    this.COLOR                  = l_body_color;
    this.TIMER_WIDTH            = l_timer_width;
    this.isAlive                = false;

    this.timer                  = 0;

    this.state                  = this.STATES[0];
    
    this.positionX              = 0;
    this.positionY              = 0;

    this.timerAngleOffset       = 0;
    this.timerDiffPerFrame      = (2 * this.PI) / this.TOTAL_TIME;

    this.update             = m_powerup_update;
    this.draw               = m_powerup_draw;
    this.set                = m_powerup_set;
    this.hit                = m_powerup_hit;
}

function m_powerup_update(){
    if(!this.isAlive) return;
    this.timer++;
    this.timerAngleOffset += this.timerDiffPerFrame;
    if(this.timer > this.TOTAL_TIME){
        this.timer = 0;
        this.timerAngleOffset = 0;
        this.isAlive = false;
    }
}

function m_powerup_draw(l_context){
    if(!this.isAlive) return;

    // draw body
    l_context.fillStyle = this.COLOR;
    l_context.beginPath();
    l_context.arc(this.positionX, this.positionY, this.RADIUS, 0, 2 * this.PI);
    l_context.fill();

    // draw timer loop
    l_context.strokeStyle = this.state.COLOR;
    l_context.beginPath();
    l_context.arc(this.positionX, this.positionY, this.RADIUS, 0, 2 * this.PI - this.timerAngleOffset);
    l_context.lineWidth = this.TIMER_WIDTH;
    l_context.stroke();
}

function m_powerup_set(l_posX, l_posY)
{
    if(this.isAlive) return;    
    this.isAlive = true;
    this.state = this.STATES[parseInt(Math.random() * this.STATES.length)];
    this.positionX = l_posX;
    this.positionY = l_posY;
    this.timer = 0;
    this.timerAngleOffset = 0;
}

function m_powerup_hit(){
    this.isAlive = false;
}
