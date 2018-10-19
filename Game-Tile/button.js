function c_Button(l_pos_x, l_pos_y, l_size_x, l_size_y, l_callback, l_text = "Default",
                l_bg_color = "white", l_hover_bg_color = "black",
                l_font_size = 48, l_font_style = "serif",
                l_font_color = "black", l_hover_font_color = "white",
                l_font_stroke_width = 2){

    this.NORMAL_BG_COLOR    = l_bg_color;
    this.NORMAL_FONT_COLOR  = l_font_color;

    this.HOVER_BG_COLOR     = l_hover_bg_color;
    this.HOVER_FONT_COLOR   = l_hover_font_color;

    this.positionX      = l_pos_x;
    this.positionY      = l_pos_y;
    this.sizeX          = l_size_x;
    this.sizeY          = l_size_y;
    this.callback       = l_callback;
    this.text           = l_text;
    this.bgColor        = this.NORMAL_BG_COLOR;
    this.fontSize       = l_font_size;
    this.fontStyle      = l_font_style;
    this.fontColor      = this.NORMAL_FONT_COLOR;
    this.fontStroke     = l_font_stroke_width;

    this.isActive       = true;

    this.hit            = m_button_hit;
    this.click          = m_button_click;
    this.draw           = m_button_draw;
    this.setActive      = m_button_set_active;
    this.setHovering    = m_button_set_hovering;
}

function m_button_hit(l_pos_x, l_pos_y){
    if(l_pos_x >= this.positionX && l_pos_x <= this.positionX + this.sizeX
    && l_pos_y >= this.positionY && l_pos_y <= this.positionY + this.sizeY){
        return true;
    }
    return false;
}

function m_button_click(){
    if(!this.isActive) return;
    this.callback();
}

function m_button_draw(l_context){
    if(!this.isActive) return;
    l_context.fillStyle = this.bgColor;
    l_context.fillRect(this.positionX, this.positionY, this.sizeX, this.sizeY);

    l_context.strokeStyle = this.fontColor;
    l_context.lineWidth = this.fontStroke;
    l_context.strokeRect(this.positionX, this.positionY, this.sizeX, this.sizeY);

    l_context.font = this.fontSize.toString() + "px " + this.fontStyle;
    l_context.textAlign = "center";
    l_context.textBaseline = "middle";
    l_context.fillStyle = this.fontColor;
    l_context.fillText(this.text, this.positionX + this.sizeX/2, this.positionY + this.sizeY/2);
}

function m_button_set_active(l_bool){
    this.isActive = l_bool;
}

function m_button_set_hovering(l_bool){
    if(!l_bool){
        this.bgColor = this.NORMAL_BG_COLOR;
        this.fontColor = this.NORMAL_FONT_COLOR;
    }
    else{
        this.bgColor = this.HOVER_BG_COLOR;
        this.fontColor = this.HOVER_FONT_COLOR;
    }
}
