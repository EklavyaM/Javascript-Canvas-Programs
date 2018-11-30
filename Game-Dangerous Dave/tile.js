function c_Tile(l_pos_x, l_pos_y, l_width, l_height, l_img_array, l_type, l_animation_delay, l_first_frame = -1){
    this.positionX      = l_pos_x;
    this.positionY      = l_pos_y;
    this.width          = l_width;
    this.height         = l_height;
    this.frames         = l_img_array;
    this.type           = l_type;

    this.isAlive        = true;

    this.max_frames     = this.frames.length;
    this.anim_delay     = l_animation_delay;
    this.frameCounter   = 0;

    if(l_first_frame == -1) this.currentFrame   = parseInt(Math.random() * this.max_frames);
    else this.currentFrame = l_first_frame;

    this.tempImgData    = null;

    this.draw           = m_tile_draw;
    this.setPosition    = m_tile_set_position;
    this.move           = m_tile_move;
}

function m_tile_draw(l_context){
    if(!this.isAlive) return;
    l_context.drawImage(this.frames[this.currentFrame],
                        this.positionX, this.positionY,
                        this.width, this.height);

    // l_context.fillStyle = "#ff000055";
    // l_context.fillRect(this.positionX, this.positionY, this.width, this.height);

    if(this.anim_delay == 0) return;
    this.frameCounter++;
    if(this.frameCounter >= this.anim_delay){
        this.frameCounter = 0;
        this.currentFrame++;
        if(this.currentFrame >= this.max_frames) this.currentFrame = 0;
    }
}

function m_tile_set_position(l_pos_x, l_pos_y){
    this.positionX = l_pos_x;
    this.positionY = l_pos_y;
}

function m_tile_move(l_offset_x, l_offset_y){
    this.positionX += l_offset_x;
    this.positionY += l_offset_y;
}
