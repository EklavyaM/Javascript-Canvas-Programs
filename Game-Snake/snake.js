function c_Snake(l_pos_x, l_pos_y, l_radius, l_color, l_boundary_width, l_boundary_height, l_verticalOffset){

    this.NORMAL_SPEED               = 2 * l_radius + 1;
    this.MAX_SPEED                  = this.NORMAL_SPEED * 1.5;
    this.MIN_SPEED                  = this.NORMAL_SPEED / 1.5;;

    this.MAX_LENGTH                 = 500;
    this.MIN_LENGTH                 = 5;

    this.DIR_LEFT                   = 0;
    this.DIR_RIGHT                  = 1;
    this.DIR_UP                     = 2;
    this.DIR_DOWN                   = 3;

    this.BOUNDARY_WIDTH             = l_boundary_width;
    this.BOUNDARY_HEIGHT            = l_boundary_height;
    this.VERTICAL_OFFSET            = l_verticalOffset;

    this.COLLISION_HEAD_TO_HEAD     = 1;
    this.COLLISION_HEAD_TO_TAIL     = 2;
    this.COLLISION_NONE             = 0;

    this.ERROR_DEAD                 = 404;
    this.isAlive                    = true;

    this.tempColorObj               = {r: 0, g:0, b:0};
    this.originalColorObj           = {r: 0, g:0, b:0};
    this.originalColorString        = l_color;
    this.tempLighterPercent         = 0;

    this.originalPositionX          = l_pos_x;
    this.originalPositionY          = l_pos_y;

    this.body                       = new Array(this.MAX_LENGTH);
    this.currentLength              = this.MIN_LENGTH;
    this.currentSpeed               = this.NORMAL_SPEED;
    this.currentDirectionX          = 0;
    this.currentDirectionY          = 0;

    this.lastKnownPositionsLength   = this.MAX_LENGTH * l_radius * 2;
    this.lastKnownPositionsX        = new Array(this.lastKnownPositionsLength);
    this.lastKnownPositionsY        = new Array(this.lastKnownPositionsLength);

    this.restrictedDirectionX       = 0;
    this.restrictedDirectionY       = 0;

    this.score                      = 0;

    this.init                       = m_snake_init;
    this.draw                       = m_snake_draw;

    this.speedUp                    = m_snake_speed_up;
    this.slowDown                   = m_snake_slow_down;
    this.grow                       = m_snake_grow;
    this.shrink                     = m_snake_shrink;

    this.eat                        = m_snake_eat;
    this.move                       = m_snake_move;
    this.die                        = m_snake_die;

    this.isCollidingWithBoundary    = m_snake_is_colliding_with_boundary;
    this.isCollidingWithSelf        = m_snake_is_colliding_with_self;
    this.isCollidingWithEnemy       = m_snake_is_colliding_with_enemy;
    this.isCollidingWithFood        = m_snake_is_colliding_with_food;

    this.setColors                  = m_snake_set_colors;

    this.reset                      = m_snake_reset;

    this.init(l_pos_x, l_pos_y, l_radius, l_color);

}

function m_snake_init(l_pos_x, l_pos_y, l_radius, l_color){
    f_colorStringToObj(this.originalColorObj, this.originalColorString);

    for ( var i = 0; i < this.MAX_LENGTH; i++ ){
        this.body[i] = new c_Cell(l_pos_x, l_pos_y, l_radius, l_color);
    }

    for ( var i = 0; i < this.currentLength; i++){
        this.body[i].isAlive = true;
    }

    this.setColors();
}

function m_snake_draw(l_context){
    for ( var i = 0; i < this.currentLength; i++ ){
        this.body[i].draw(l_context);
    }
}

function m_snake_speed_up(){
    if (this.currentSpeed == this.NORMAL_SPEED
        || this.currentSpeed == this.MAX_SPEED) this.currentSpeed = this.MAX_SPEED;
    else this.currentSpeed = this.NORMAL_SPEED;
}

function m_snake_slow_down(){
    if (this.currentSpeed == this.NORMAL_SPEED
        || this.currentSpeed == this.MIN_SPEED) this.currentSpeed = this.MIN_SPEED;
    else this.currentSpeed = this.NORMAL_SPEED;
}

function m_snake_grow(l_value){
    for ( var i = 0; i < l_value; i++){
        if (this.currentLength >= this.MAX_LENGTH) return;
        this.body[this.currentLength].isAlive = true;
        this.body[this.currentLength].positionX = this.lastKnownPositionsX[this.currentLength * this.body[this.currentLength].radius];
        this.body[this.currentLength].positionY = this.lastKnownPositionsY[this.currentLength * this.body[this.currentLength].radius];
        this.currentLength++;
    }
    this.setColors();
}

function m_snake_shrink(l_value){
    for ( var i = 0; i < l_value; i++){
        if (this.currentLength <= this.MIN_LENGTH) return;
        this.body[this.currentLength].isAlive = false;
        this.currentLength--;
    }
    this.setColors();
}

function m_snake_eat(l_food){
    this.score += l_food.value;
    switch(l_food.type){
        case l_food.TYPE_GROW:
            this.grow(10);
            break;
        case l_food.TYPE_SHRINK:
            this.shrink(10);
            break;
        case l_food.TYPE_ACCELERATE:
            this.speedUp();
            break;
        case l_food.TYPE_DECELERATE:
            this.slowDown();
            break;
    }
}

function m_snake_move(l_input_array, l_enemy_snake, l_food){

    if (!this.isAlive) return this.ERROR_DEAD;

    this.currentDirectionX = 0;
    this.currentDirectionY = 0;

    if(l_input_array[this.DIR_LEFT]) this.currentDirectionX += -1;
    if(l_input_array[this.DIR_RIGHT]) this.currentDirectionX += 1;
    if(l_input_array[this.DIR_UP]) this.currentDirectionY += -1;
    if(l_input_array[this.DIR_DOWN]) this.currentDirectionY += 1;

    if (this.currentDirectionX == 0 && this.currentDirectionY == 0) return;
    if (this.currentDirectionX == this.restrictedDirectionX && this.currentDirectionY == this.restrictedDirectionY) return;

    for ( var j = 0; j < this.currentSpeed; j++ ) {
        this.lastKnownPositionsX[0] = this.body[0].positionX;
        this.lastKnownPositionsY[0] = this.body[0].positionY;

        for ( var i = this.lastKnownPositionsLength - 1; i > 0; i--){
            this.lastKnownPositionsX[i] = this.lastKnownPositionsX[i-1];
            this.lastKnownPositionsY[i] = this.lastKnownPositionsY[i-1];
        }

        for ( var i = 1; i < this.currentLength; i++){
            this.body[i].positionX = this.lastKnownPositionsX[i * 2 * this.body[i].radius];
            this.body[i].positionY = this.lastKnownPositionsY[i * 2 * this.body[i].radius];
        }


        this.body[0].positionX += this.currentDirectionX;
        this.body[0].positionY += this.currentDirectionY;

        if(this.isCollidingWithBoundary()){
            console.log("Boundary Touched");
            this.die();
        }

        if(this.isCollidingWithSelf()){
            console.log("Self Tail Touched");
            this.die();
        }

        switch(this.isCollidingWithEnemy(l_enemy_snake)){
            case this.COLLISION_HEAD_TO_HEAD:
                this.die();
                l_enemy_snake.die();
                break;
            case this.COLLISION_HEAD_TO_TAIL:
                this.die();
                break;
            case this.COLLISION_NONE:
                break;
        }

        if(this.isCollidingWithFood(l_food)){
            this.eat(l_food);
            l_food.eaten();
        }

    }

    this.restrictedDirectionX = -this.currentDirectionX;
    this.restrictedDirectionY = -this.currentDirectionY;


}

function m_snake_die(){
    this.isAlive = false;
}

function m_snake_is_colliding_with_boundary(){
    if (this.body[0].positionX <= this.body[0].radius
        || this.body[0].positionX >= this.BOUNDARY_WIDTH - this.body[0].radius
        || this.body[0].positionY <= this.VERTICAL_OFFSET + this.body[0].radius
        || this.body[0].positionY >= this.BOUNDARY_HEIGHT - this.body[0].radius)
            return true;

    return false;
}

function m_snake_is_colliding_with_self(){
    if(this.currentLength < 3) return false;
    for ( var i = 3; i < this.currentLength; i++ ){
        if(f_circleToCircleCollision(this.body[0].positionX, this.body[0].positionY, this.body[0].radius,
                                    this.body[i].positionX, this.body[i].positionY, this.body[i].radius))
                                    return true;
    }
    return false;
}

function m_snake_is_colliding_with_enemy(l_enemy_snake){
    if(f_circleToCircleCollision(this.body[0].positionX, this.body[0].positionY, this.body[0].radius,
                                l_enemy_snake.body[0].positionX, l_enemy_snake.body[0].positionY, l_enemy_snake.body[0].radius))
                                return this.COLLISION_HEAD_TO_HEAD;
    for ( var i = 1; i < l_enemy_snake.currentLength; i++){
        if(f_circleToCircleCollision(this.body[0].positionX, this.body[0].positionY, this.body[0].radius,
                                    l_enemy_snake.body[i].positionX, l_enemy_snake.body[i].positionY, l_enemy_snake.body[i].radius))
                                    return this.COLLISION_HEAD_TO_TAIL;
    }
    return this.COLLISION_NONE;
}

function m_snake_is_colliding_with_food(l_food){
    return f_circleToCircleCollision(this.body[0].positionX, this.body[0].positionY, this.body[0].radius,
                                    l_food.body.positionX, l_food.body.positionY, l_food.body.radius);
}

function m_snake_set_colors(){
    for ( var i = 0; i < this.currentLength; i++){
        this.tempLighterPercent = ((i+1) * (100/(this.currentLength + 4)))/100;

        this.tempColorObj.r = 255 - this.originalColorObj.r;
        this.tempColorObj.g = 255 - this.originalColorObj.g;
        this.tempColorObj.b = 255 - this.originalColorObj.b;

        this.tempColorObj.r = parseInt(this.tempColorObj.r * this.tempLighterPercent);
        this.tempColorObj.g = parseInt(this.tempColorObj.g * this.tempLighterPercent);
        this.tempColorObj.b = parseInt(this.tempColorObj.b * this.tempLighterPercent);


        this.body[i].color = f_valueToColorString(this.originalColorObj.r + this.tempColorObj.r,
                                                this.originalColorObj.g + this.tempColorObj.g,
                                                this.originalColorObj.b + this.tempColorObj.b);

    }
    this.body[0].color = this.originalColorString;
}

function m_snake_reset(){

    for ( var i = 0; i < this.currentLength; i++){
        this.body[i].isAlive = false;
    }

    this.isAlive                    = true;
    this.currentLength              = this.MIN_LENGTH;
    this.currentSpeed               = this.NORMAL_SPEED;
    this.currentDirectionX          = 0;
    this.currentDirectionY          = 0;

    this.restrictedDirectionX       = 0;
    this.restrictedDirectionY       = 0;

    this.score                      = 0;

    for ( var i = 0; i < this.lastKnownPositionsLength; i++){
        this.lastKnownPositionsX[i] = null;
        this.lastKnownPositionsY[i] = null;
    }

    for ( var i = 0; i < this.currentLength; i++){
        this.body[i].isAlive = true;
        this.body[i].positionX = this.originalPositionX;
        this.body[i].positionY = this.originalPositionY;
    }

    this.setColors();

}
