function c_AlienHorde(l_pos_x = 0, l_pos_y = 0, l_boundary_width, l_boundary_height, l_frame_rate = 30){

    this.FRAME_RATE         = l_frame_rate;

    this.BOUNDARY_WIDTH     = l_boundary_width;
    this.BOUNDARY_HEIGHT    = l_boundary_height;

    this.TYPE_CRAB          = 0;
    this.TYPE_SQUID         = 1;
    this.TYPE_OCTOPUS       = 2;
    this.TYPE_UFO           = 3;

    this.NUM_ALIENS         = 52;
    this.POSITION_GAP       = 60;
    this.HORDE_WIDTH        = 13;

    this.SPEED              = 2000 / l_frame_rate;
    this.UFO_SPEED          = 100 / l_frame_rate;

    this.NUM_BULLETS        = 10;
    this.BULLET_SPEED       = 300 / l_frame_rate;

    this.HORIZONTAL_TIME    = 6 * l_frame_rate;
    this.VERTICAL_TIME      = 1 * l_frame_rate;

    this.ANIMATION_DELAY    = 0.4 * l_frame_rate;
    this.MOVE_DELAY         = 1 * l_frame_rate;
    this.SHOOT_DELAY        = 1 * l_frame_rate;
    this.UFO_DELAY          = 8 * l_frame_rate;

    this.POSITION_OFFSET    = 60;

    this.ORIGINAL_X         = l_pos_x;
    this.ORIGINAL_Y         = l_pos_y;

    this.WIDTH              = this.HORDE_WIDTH * this.POSITION_GAP;
    this.HEIGHT             = Math.floor((this.NUM_ALIENS / this.HORDE_WIDTH)) * this.POSITION_GAP;

    this.INFO_WON           = 1;

    this.positionX          = l_pos_x;
    this.positionY          = l_pos_y;

    this.moveOffsetX        = this.SPEED;
    this.moveOffsetY        = 0;

    this.randomIndex        = -1;

    this.aliens             = new Array(this.NUM_ALIENS);

    this.crabRows           = 8;
    this.crabColumns        = 11;
    this.crabCellSize       = 4;
    this.crabCellColor      = "#5B5D92";
    this.crabScore          = 20;
    this.crabBitmapArray    =   [

                                "0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0," +
                                "0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0," +
                                "0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0," +
                                "0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0," +
                                "1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1," +
                                "1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1," +
                                "1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1," +
                                "0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0",

                                "0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0," +
                                "1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1," +
                                "1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1," +
                                "1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1," +
                                "1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1," +
                                "0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0," +
                                "0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0," +
                                "0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0"

                            ];

    this.squidRows          = 8;
    this.squidColumns       = 8;
    this.squidCellSize      = 4;
    this.squidCellColor     = "#2A3BF7";
    this.squidScore         = 40;
    this.squidBitmapArray   =   [

                                "0, 0, 0, 1, 1, 0, 0, 0," +
                                "0, 0, 1, 1, 1, 1, 0, 0," +
                                "0, 1, 1, 1, 1, 1, 1, 0," +
                                "1, 1, 0, 1, 1, 0, 1, 1," +
                                "1, 1, 1, 1, 1, 1, 1, 1," +
                                "0, 1, 0, 1, 1, 0, 1, 0," +
                                "1, 0, 0, 0, 0, 0, 0, 1," +
                                "0, 1, 0, 0, 0, 0, 1, 0",

                                "0, 0, 0, 1, 1, 0, 0, 0," +
                                "0, 0, 1, 1, 1, 1, 0, 0," +
                                "0, 1, 1, 1, 1, 1, 1, 0," +
                                "1, 1, 0, 1, 1, 0, 1, 1," +
                                "1, 1, 1, 1, 1, 1, 1, 1," +
                                "0, 0, 1, 0, 0, 1, 0, 0," +
                                "0, 1, 0, 1, 1, 0, 1, 0," +
                                "1, 0, 1, 0, 0, 1, 0, 1"

                            ];

    this.octopusRows          = 8;
    this.octopusColumns       = 12;
    this.octopusCellSize      = 4;
    this.octopusCellColor     = "#8C8FAD";
    this.octopusScore         = 10;
    this.octopusBitmapArray   =   [

                                "0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0," +
                                "0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0," +
                                "1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1," +
                                "1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1," +
                                "1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1," +
                                "0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0," +
                                "0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0," +
                                "1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1",

                                "0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0," +
                                "0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0," +
                                "1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1," +
                                "1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1," +
                                "1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1," +
                                "0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0," +
                                "0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0," +
                                "0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0"

                            ];

    this.bulletArray        = new Array(this.NUM_BULLETS);
    this.bulletFrameCounter = 0;
    this.bulletFrames = [
                            "0, 1, 0," +
                            "0, 1, 0," +
                            "0, 1, 0," +
                            "0, 0, 0",

                            "0, 0, 0," +
                            "1, 0, 1," +
                            "0, 0, 0," +
                            "1, 0, 1"
                        ];

    this.ufoRows            = 7;
    this.ufoColumns         = 16;
    this.ufoCellSize        = 4;
    this.ufoCellColor       = "#ff5555";
    this.ufoScore           = 100;
    this.ufoBitmap          =   "0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0," +
                                "0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0," +
                                "0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0," +
                                "0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0," +
                                "1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1," +
                                "0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0," +
                                "0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0";
    this.ufo                = null;
    this.ufoMoveOffset      = 0;

    this.animationCounter   = 0;
    this.moveCounter        = 0;
    this.moveTimer          = 0;
    this.ufoTimer           = 0;

    this.tempUfoDirVal      = 0;

    this.hordeDefeated      = false;

    this.init           = m_alien_horde_init;
    this.update         = m_alien_horde_update;
    this.draw           = m_alien_horde_draw;
    this.move           = m_alien_horde_move;
    this.animate        = m_alien_horde_animate;
    this.setDirection   = m_alien_horde_set_direction;
    this.checkCollision = m_alien_horde_check_collision;
    this.shoot          = m_alien_horde_shoot;
    this.spawnUfo       = m_alien_horde_spawn_ufo;
    this.reset          = m_alien_horde_reset;
    this.isDefeated     = m_alien_horde_is_defeated;

}

function m_alien_horde_init(){

    for(var i=0; i<this.NUM_ALIENS; i++){
        if(i >= 0 && i < 1 * this.HORDE_WIDTH){
            this.aliens[i] = new c_Alien(this.ORIGINAL_X + (i % this.HORDE_WIDTH) * this.POSITION_GAP,
                                        this.ORIGINAL_Y + Math.floor(i / this.HORDE_WIDTH) * this.POSITION_GAP,
                                        this.TYPE_SQUID, this.squidScore,
                                        this.squidRows, this.squidColumns,
                                        this.squidCellSize, this.squidCellColor, this.FRAME_RATE);
            this.aliens[i].setBitmap(this.squidBitmapArray[0]);

        }
        else if(i >= 1 * this.HORDE_WIDTH && i < 2 * this.HORDE_WIDTH){
            this.aliens[i] = new c_Alien(this.ORIGINAL_X + (i % this.HORDE_WIDTH) * this.POSITION_GAP,
                                        this.ORIGINAL_Y + Math.floor(i / this.HORDE_WIDTH) * this.POSITION_GAP,
                                        this.TYPE_CRAB, this.crabScore,
                                        this.crabRows, this.crabColumns,
                                        this.crabCellSize, this.crabCellColor, this.FRAME_RATE);
            this.aliens[i].setBitmap(this.crabBitmapArray[0]);
        }
        else{
            this.aliens[i] = new c_Alien(this.ORIGINAL_X + (i % this.HORDE_WIDTH) * this.POSITION_GAP,
                                        this.ORIGINAL_Y + Math.floor(i / this.HORDE_WIDTH) * this.POSITION_GAP,
                                        this.TYPE_OCTOPUS, this.octopusScore,
                                        this.octopusRows, this.octopusColumns,
                                        this.octopusCellSize, this.octopusCellColor, this.FRAME_RATE);
            this.aliens[i].setBitmap(this.octopusBitmapArray[0]);
        }
    }

    for(var i=0; i<this.NUM_BULLETS; i++){
        this.bulletArray[i] = new c_Bullet(-200, -200, this.BULLET_SPEED, this.bulletFrames, 4, 3, 8, this.squidCellColor, this.FRAME_RATE);
    }

    this.ufo = new c_Alien(-100, -100, this.TYPE_UFO, this.ufoScore, this.ufoRows, this.ufoColumns, this.ufoCellSize, this.ufoCellColor, this.FRAME_RATE);
    this.ufo.setBitmap(this.ufoBitmap);
    this.ufo.isAlive = false;
}

function m_alien_horde_update(l_spaceship){

    if(this.isDefeated()) return this.INFO_WON;
    
    this.moveTimer++;
    this.animationCounter++;
    this.moveCounter++;
    this.bulletFrameCounter++;
    this.ufoTimer++;

    this.setDirection();
    this.move(l_spaceship);
    this.animate();
    this.checkCollision(l_spaceship);
    this.shoot();

    for(var i=0; i<this.NUM_ALIENS; i++){
        this.aliens[i].update();
    }

    this.ufo.update();

    if(this.moveCounter > this.MOVE_DELAY){
        this.moveCounter = 0;
        this.positionX += this.moveOffsetX;
        this.positionY += this.moveOffsetY;
    }

    if(this.ufoTimer > this.UFO_DELAY){
        this.ufoTimer = 0;
        if(!this.ufo.isAlive) this.spawnUfo();
    }

}

function m_alien_horde_draw(l_context){
    for(var i=0; i<this.NUM_ALIENS; i++){
        this.aliens[i].draw(l_context);
    }
    for(var i=0; i<this.NUM_BULLETS; i++){
        this.bulletArray[i].draw(l_context);
    }

    this.ufo.draw(l_context);
}

function m_alien_horde_move(l_spaceship){
    for(var i=0; i<this.NUM_ALIENS; i++){
        if(this.moveCounter > this.MOVE_DELAY){
            this.aliens[i].move(this.moveOffsetX, this.moveOffsetY);
        }
    }

    for(var i=0; i<this.NUM_BULLETS; i++){
        this.bulletArray[i].move();
        if(this.bulletArray[i].positionY >= this.BOUNDARY_HEIGHT - this.POSITION_OFFSET) this.bulletArray[i].die();
        if(this.bulletArray[i].isDying) continue;
        if(f_rectangleCollisionCheck(
            this.bulletArray[i].positionX, this.bulletArray[i].positionY, this.bulletArray[i].WIDTH, this.bulletArray[i].HEIGHT,
            l_spaceship.positionX, l_spaceship.positionY, l_spaceship.WIDTH, l_spaceship.HEIGHT
        )){
            this.bulletArray[i].die();
            l_spaceship.hit();
        }
    }

    if(this.ufo.isAlive){
        this.ufo.move(this.ufoMoveOffset, 0);
        if(this.ufoMoveOffset < 0 && this.ufo.positionX < -this.POSITION_GAP){
            this.ufo.die();
        }
        else if(this.ufoMoveOffset > 0 && this.ufo.positionX > this.BOUNDARY_WIDTH + this.POSITION_GAP){
            this.ufo.die();
        }
    }
}

function m_alien_horde_animate(){
    for(var i=0; i<this.NUM_ALIENS; i++){
        if(this.animationCounter == this.ANIMATION_DELAY){
            if(this.aliens[i].type == this.TYPE_CRAB) this.aliens[i].setBitmap(this.crabBitmapArray[1]);
            else if(this.aliens[i].type == this.TYPE_SQUID) this.aliens[i].setBitmap(this.squidBitmapArray[1]);
            else if(this.aliens[i].type == this.TYPE_OCTOPUS) this.aliens[i].setBitmap(this.octopusBitmapArray[1]);
        }
        else if(this.animationCounter == 2 * this.ANIMATION_DELAY){
            if(this.aliens[i].type == this.TYPE_CRAB) this.aliens[i].setBitmap(this.crabBitmapArray[0]);
            else if(this.aliens[i].type == this.TYPE_SQUID) this.aliens[i].setBitmap(this.squidBitmapArray[0]);
            else if(this.aliens[i].type == this.TYPE_OCTOPUS) this.aliens[i].setBitmap(this.octopusBitmapArray[0]);
            if(i == this.NUM_ALIENS -1) this.animationCounter = 0;
        }
    }
}

function m_alien_horde_set_direction(){
    if(this.moveTimer >= 0 && this.moveTimer < this.HORIZONTAL_TIME){
        this.moveOffsetX = this.SPEED;
        this.moveOffsetY = 0;
    }
    else if(this.moveTimer >= this.HORIZONTAL_TIME
        && this.moveTimer < this.HORIZONTAL_TIME + this.VERTICAL_TIME){
        this.moveOffsetX = 0;
        this.moveOffsetY = this.SPEED;
    }
    else if(this.moveTimer >= this.HORIZONTAL_TIME + this.VERTICAL_TIME
         && this.moveTimer < 2 * this.HORIZONTAL_TIME + this.VERTICAL_TIME){
        this.moveOffsetX = -this.SPEED;
        this.moveOffsetY = 0;
    }
    else if(this.moveTimer >= 2 * this.HORIZONTAL_TIME + this.VERTICAL_TIME
         && this.moveTimer < 2 * (this.HORIZONTAL_TIME + this.VERTICAL_TIME)){
        this.moveOffsetX = 0;
        this.moveOffsetY = this.SPEED;
    }
    else{
        this.moveTimer = 0;
    }
}

function m_alien_horde_check_collision(l_spaceship){
    if(l_spaceship.bullet.isDying) return;
    for(var i=0; i<this.NUM_ALIENS; i++){
        if(!this.aliens[i].isAlive || this.aliens[i].isDying) continue;
        if(f_rectangleCollisionCheck(
            this.aliens[i].positionX, this.aliens[i].positionY, this.aliens[i].WIDTH, this.aliens[i].HEIGHT,
            l_spaceship.bullet.positionX, l_spaceship.bullet.positionY, l_spaceship.bullet.WIDTH, l_spaceship.bullet.HEIGHT
        )){
            l_spaceship.bullet.die();
            this.aliens[i].die();
            l_spaceship.addScore(this.aliens[i].score);
            break;
        }
    }

    if(this.ufo.isAlive && !this.ufo.isDying){
        if(f_rectangleCollisionCheck(
            this.ufo.positionX, this.ufo.positionY, this.ufo.WIDTH, this.ufo.HEIGHT,
            l_spaceship.bullet.positionX, l_spaceship.bullet.positionY, l_spaceship.bullet.WIDTH, l_spaceship.bullet.HEIGHT
        )){
            l_spaceship.bullet.die();
            this.ufo.die();
            l_spaceship.addScore(this.ufo.score);
        }
    }

    if(f_rectangleCollisionCheck(
        this.positionX, this.positionY, this.WIDTH, this.HEIGHT,
        l_spaceship.positionX, l_spaceship.positionY, l_spaceship.WIDTH, l_spaceship.HEIGHT
    )){
        this.reset();
        l_spaceship.hit();
    }
}

function m_alien_horde_shoot(){
    if(this.bulletFrameCounter >= this.SHOOT_DELAY){
        for(var i=0; i<this.NUM_BULLETS; i++){
            if(!this.bulletArray[i].isAlive){
                this.randomIndex = parseInt(Math.random() * this.NUM_ALIENS);
                if(!this.aliens[this.randomIndex].isAlive) continue;
                this.bulletArray[i].isAlive = true;
                this.bulletArray[i].setPosition(this.aliens[this.randomIndex].positionX + this.aliens[this.randomIndex].WIDTH/2,
                                                this.aliens[this.randomIndex].positionY + this.aliens[this.randomIndex].HEIGHT/2);
                this.bulletArray[i].setColor(this.aliens[this.randomIndex].COLOR);
                break;
            }
        }
        this.bulletFrameCounter = 0;
    }
}

function m_alien_horde_spawn_ufo(){
    this.tempUfoDirVal = parseInt(Math.random() * 2);
    this.ufo.isAlive = true;
    if(this.tempUfoDirVal == 0){
        // goes left
        this.ufoMoveOffset = -this.UFO_SPEED;
        this.ufo.setPosition(this.BOUNDARY_WIDTH + this.POSITION_GAP, 100);
    }
    else{
        //right
        this.ufoMoveOffset = this.UFO_SPEED;
        this.ufo.setPosition(-this.ufo.WIDTH - this.POSITION_GAP, 100);
    }
}

function m_alien_horde_reset(){
    this.animationCounter   = 0;
    this.moveCounter        = 0;
    this.moveTimer          = 0;

    this.positionX = this.ORIGINAL_X;
    this.positionY = this.ORIGINAL_Y;

    for(var i=0; i<this.NUM_ALIENS; i++){
        this.aliens[i].setPosition(this.positionX + (i % this.HORDE_WIDTH) * this.POSITION_GAP,
                                    this.positionY + Math.floor(i / this.HORDE_WIDTH) * this.POSITION_GAP);
        if(i >= 0 && i < 1 * this.HORDE_WIDTH){
            this.aliens[i].setBitmap(this.squidBitmapArray[0]);
        }
        else if(i >= 1 * this.HORDE_WIDTH && i < 2 * this.HORDE_WIDTH){
            this.aliens[i].setBitmap(this.crabBitmapArray[0]);
        }
        else{
            this.aliens[i].setBitmap(this.octopusBitmapArray[0]);
        }
    }
}

function m_alien_horde_is_defeated(){
    for(var i=0; i<this.NUM_ALIENS; i++){
        if(this.aliens[i].isAlive) return false;
    }

    if(this.ufo.isAlive) return false;

    return true;
}
