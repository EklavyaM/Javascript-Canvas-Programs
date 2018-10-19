function c_Timer(l_pos_x, l_pos_y, l_frame_rate = 60, l_font_size = 48, l_font_style = "serif", l_font_color = "black", l_font_stroke_width = 2) {

    // currently limited to counting till an hour because  of game constraints

    this.frameRate  = l_frame_rate

    this.isRunning  = true;

    this.positionX  = l_pos_x;
    this.positionY  = l_pos_y;

    this.fontSize   = l_font_size;
    this.fontStyle  = l_font_style;
    this.fontColor  = l_font_color;
    this.fontStroke = l_font_stroke_width;

    this.centiSeconds = 0;
    this.seconds = 0;
    this.minutes = 0;
    this.tickValue = 100 / this.frameRate;

    this.timeString = "";

    this.tick       = m_timer_tick;
    this.getTime    = m_timer_get_time;
    this.draw       = m_timer_draw;
    this.stop       = m_timer_stop;
    this.reset      = m_timer_reset;
}

function m_timer_tick() {
    if(!this.isRunning) return;
    this.centiSeconds += this.tickValue;
    if (this.centiSeconds >= 100) {
        this.seconds++;
        this.centiSeconds = 0;
    }
    if (this.seconds >= 60) {
        this.minutes++;
        this.seconds = 0;
    }
}

function m_timer_get_time() {
    this.timeString = "";
    if (this.minutes < 10) this.timeString += "0";
    this.timeString += parseInt(this.minutes) + " : ";
    if (this.seconds < 10) this.timeString += "0";
    this.timeString += parseInt(this.seconds) + " : ";
    if (this.centiSeconds < 10) this.timeString += "0";
    this.timeString += parseInt(this.centiSeconds);
    return this.timeString;
}

function m_timer_draw(l_context) {
    l_context.font = this.fontSize.toString() + "px " + this.fontStyle;
    l_context.textAlign = "center";
    l_context.textBaseline = "middle";
    l_context.strokeStyle = this.fontColor;
    l_context.lineWidth = this.fontStroke;
    l_context.strokeText(this.getTime(), this.positionX, this.positionY);
}

function m_timer_stop(){
    this.isRunning = false;
}

function m_timer_reset(){
    this.isRunning = true;
    this.centiSeconds = 0;
    this.seconds = 0;
    this.minutes = 0;
}
