function c_Dave(l_pos_x, l_pos_y, l_frame_rate){

    this.SPEED_X            = 180 / l_frame_rate;
    this.SPEED_Y            = 6.0;
    this.GRAVITY            = 12 / l_frame_rate;
    this.MAX_GRAVITY        = 150 / l_frame_rate;
    this.DEATH_TIME         = l_frame_rate;
    this.MAX_LIVES          = 3;

    this.originalPositionX  = l_pos_x;
    this.originalPositionY  = l_pos_y;

    this.positionX          = l_pos_x;
    this.positionY          = l_pos_y;

    this.width              = 32;
    this.height             = 32;

    this.imgArray           = new Array();
    this.deathImgArray      = new Array();
    this.bulletImg          = new Image();

    this.currentFrame       = 0;
    this.maxFrames          = 0;
    this.animDelay          = l_frame_rate / 16;
    this.deathAnimDelay     = l_frame_rate / 8;
    this.frameCounter       = 0;
    this.deathFrameCounter  = 0;

    this.velocityX          = 0;
    this.velocityY          = 0;

    this.blockedLeft        = false;
    this.blockedRight       = false;
    this.blockedTop         = false;
    this.blockedBottom      = false;

    this.tempCollisionDir   = 0;
    this.inAir              = false;

    this.score              = 0;
    this.lives              = this.MAX_LIVES;

    this.tookCup            = false;
    this.isDying            = false;
    this.reachedDoor        = false;
    this.canShoot           = false;

    this.mapXOnDeath        = 0;
    this.mapYOnDeath        = 0;

    this.isRespawning       = false;

    this.scaleX             = 1;

    this.bullet             = new c_Bullet(this.bulletImg, 30, 8, l_frame_rate);

    this.draw           = m_dave_draw;
    this.init           = m_dave_init;
    this.update         = m_dave_update;
    this.move           = m_dave_move;
    this.moveScreen     = m_dave_move_screen;
    this.checkCollision = m_dave_check_collision;
    this.resetBlocked   = m_dave_reset_blocked;
    this.respawn        = m_dave_respawn;
    this.die            = m_dave_die;
    this.reset          = m_dave_reset;
}

function m_dave_draw(l_context){
    l_context.save();
    if(this.scaleX == -1)
        l_context.translate(this.positionX + this.width, this.positionY);
    else
        l_context.translate(this.positionX, this.positionY);
    l_context.scale(this.scaleX, 1);

    if(this.isDying) l_context.drawImage(this.deathImgArray[this.currentFrame], 0, 0, this.width, this.height);
    else l_context.drawImage(this.imgArray[this.currentFrame], 0, 0, this.width, this.height);

    l_context.restore();

    if(!this.isRespawning) this.frameCounter++;
    if(!this.isDying){
        if(this.frameCounter >= this.animDelay){
            this.frameCounter = 0;
            this.currentFrame++;
            if(this.currentFrame >= this.maxFrames) this.currentFrame = 0;
        }
    }
    else{
        this.deathFrameCounter++;
        if(this.frameCounter >= this.deathAnimDelay){
            this.frameCounter = 0;
            this.currentFrame++;
            if(this.currentFrame >= this.maxFrames) this.currentFrame = 0;
        }
        if(this.deathFrameCounter > this.DEATH_TIME){
            this.deathFrameCounter = 0;
            this.isDying = false;
            this.maxFrames = this.imgArray.length;
            this.currentFrame = 0;
            this.respawn();
        }
    }

    this.bullet.draw(l_context);
}

function m_dave_init(){
    for(var i=0; i < 4; i++){
        this.imgArray.push(new Image());
        this.imgArray[i].src = "img/dave" + (i+1) +".png";
    }

    for(var i=0; i<2; i++){
        this.deathImgArray.push(new Image());
        this.deathImgArray[i].src = "img/explosion" + (i+1) + ".png";
    }

    this.maxFrames = this.imgArray.length;
    this.currentFrame = 0;

    this.bulletImg.src = "img/monsterBullet.png";

}

function m_dave_update(l_input_array, l_map, l_monster){

    this.bullet.update();
    if((this.bullet.currentDir == this.bullet.DIR_RIGHT && this.bullet.positionX >= l_map.BOUNDARY_WIDTH) || (this.bullet.currentDir == this.bullet.DIR_LEFT && this.bullet.positionX <= -this.bullet.width)) this.bullet.die();

    if(this.isDying) return;

    if(!this.isRespawning){
        this.velocityX = 0;

        if(this.velocityY + this.GRAVITY < this.MAX_GRAVITY) this.velocityY += this.GRAVITY;

        if(l_input_array[0]) {
            this.velocityX += -1;
            this.scaleX = -1;
        }
        if(l_input_array[1]) {
            this.velocityX += 1;
            this.scaleX = 1;
        }

        if(l_input_array[2] && !this.inAir){
            this.velocityY = -this.SPEED_Y;
            this.inAir = true;
        }

        if(l_input_array[3] && this.canShoot){
            if(this.scaleX == 1) this.bullet.shoot(this.positionX + this.width, this.positionY + this.height/2, this.bullet.DIR_RIGHT);
            else if(this.scaleX == -1)this.bullet.shoot(this.positionX, this.positionY + this.height/2, this.bullet.DIR_LEFT);
        }

        if(this.velocityX == 0){
            this.currentFrame = 0;
        }
        if(this.inAir){
            this.currentFrame = 3;
        }
    }

    if(!this.isRespawning) this.move(l_map, l_monster);

    this.moveScreen(l_map, l_monster);
    this.resetBlocked();
}

function m_dave_move(l_map, l_monster){
    for(var i=0; i<this.SPEED_X; i++){
        this.checkCollision(l_map, l_monster);
        if(!(this.blockedLeft && this.velocityX < 0 || this.blockedRight && this.velocityX > 0)){
            this.positionX += this.velocityX;
        }
    }

    for(var i=0; i < Math.abs(this.velocityY); i++){
        this.checkCollision(l_map, l_monster);
        if(!this.blockedBottom && this.velocityY > 0){
            this.positionY += 1;
        }
        else if(!this.blockedTop && this.velocityY < 0){
            this.positionY -= 1;
        }
    }

}

function m_dave_check_collision(l_map, l_monster){
    for(var i=0; i<l_map.objectsLength; i++){
        if(!l_map.objects[i].isAlive) continue;
        this.tempCollisionDir = f_rectangleCollisionCheck(
            l_map.objects[i].positionX, l_map.objects[i].positionY, l_map.objects[i].width, l_map.objects[i].height,
            this.positionX, this.positionY, this.width, this.height
        );
        if(this.tempCollisionDir != 0){
            if(l_map.objects[i].type == l_map.TYPE_RED_TILE || l_map.objects[i].type == l_map.TYPE_PLATFORM_TILE){
                switch(this.tempCollisionDir){
                    case "left":
                        this.blockedLeft = true;
                        break;
                    case "right":
                        this.blockedRight = true;
                        break;
                    case "top":
                        this.blockedTop = true;
                        this.velocityY = 0;
                        this.positionY += 1;
                        break;
                    case "bottom":
                        this.blockedBottom = true;
                        this.inAir = false;
                        break;
                }
            }
            if(l_map.objects[i].type == l_map.TYPE_FIRE || l_map.objects[i].type == l_map.TYPE_WATER){
                this.die(l_map.positionX, l_map.positionY);
            }
            if(l_map.objects[i].type == l_map.TYPE_RED_DIAMOND){
                this.score += 150;
                l_map.objects[i].isAlive = false;
            }
            if(l_map.objects[i].type == l_map.TYPE_BLUE_DIAMOND){
                this.score += 100;
                l_map.objects[i].isAlive = false;
            }
            if(l_map.objects[i].type == l_map.TYPE_SPHERE){
                this.score += 50;
                l_map.objects[i].isAlive = false;
            }
            if(l_map.objects[i].type == l_map.TYPE_CUP){
                this.score += 1000;
                l_map.objects[i].isAlive = false;
                this.tookCup = true;
            }
            if(l_map.objects[i].type == l_map.TYPE_GUN){
                this.score += 200;
                l_map.objects[i].isAlive = false;
                this.canShoot = true;
            }
            if(l_map.objects[i].type == l_map.TYPE_DOOR && this.tookCup){
                this.reachedDoor = true;
            }
        }
    }
    if(!this.blockedBottom) this.inAir = true;

    if(!this.isDying && l_monster.isAlive && !l_monster.isDying && f_rectangleCollisionCheck(
        this.positionX, this.positionY, this.width, this.height,
        l_monster.positionX, l_monster.positionY, l_monster.width, l_monster.height
    )){
        this.die(l_map.positionX, l_map.positionY);
    }

    if(!this.isDying && l_monster.bullet.isAlive && f_rectangleCollisionCheck(
        this.positionX, this.positionY, this.width, this.height,
        l_monster.bullet.positionX, l_monster.bullet.positionY, l_monster.bullet.width, l_monster.height
    )){
        this.die(l_map.positionX, l_map.positionY);
        l_monster.bullet.die();
    }

    if(l_monster.isAlive && !l_monster.isDying && this.bullet.isAlive && f_rectangleCollisionCheck(
        this.bullet.positionX, this.bullet.positionY, this.bullet.width, this.bullet.height,
        l_monster.positionX, l_monster.positionY, l_monster.width, l_monster.height
    )){
        l_monster.die();
        this.bullet.die();
        this.score += 500;
    }

}

function m_dave_move_screen(l_map, l_monster){
    if(l_map.positionX >= l_map.BOUNDARY_WIDTH - l_map.MAP_WIDTH && this.positionX >=  0.55 * l_map.BOUNDARY_WIDTH){
        l_map.shift(-this.SPEED_X);
        if(!l_monster.isDying) l_monster.pathCenterX -= this.SPEED_X;
        else l_monster.positionX -= this.SPEED_X;
        l_monster.bullet.positionX -= this.SPEED_X;
        this.positionX -= this.SPEED_X;
        return;
    }
    if(l_map.positionX <0 && this.positionX <= 0.45 * l_map.BOUNDARY_WIDTH){
        l_map.shift(this.SPEED_X);
        if(!l_monster.isDying) l_monster.pathCenterX += this.SPEED_X;
        else l_monster.positionX += this.SPEED_X;
        l_monster.bullet.positionX += this.SPEED_X;
        this.positionX += this.SPEED_X;
        return;
    }
    if(l_map.positionX == 0) this.isRespawning = false;
}

function m_dave_reset_blocked(){
    this.blockedLeft        = false;
    this.blockedRight       = false;
    this.blockedTop         = false;
    this.blockedBottom      = false;
}

function m_dave_respawn(){
    this.isRespawning = true;
    this.positionX = this.mapXOnDeath + this.originalPositionX;
    this.positionY = this.mapYOnDeath + this.originalPositionY;
    this.lives--;

    this.velocityX          = 0;
    this.velocityY          = 0;
    this.tempCollisionDir   = 0;
    this.inAir              = false;
}

function m_dave_die(l_map_pos_x, l_map_pos_y){
    this.scaleX = 1;
    this.isDying = true;
    this.maxFrames = this.deathImgArray.length;
    this.currentFrame = 0;
    this.mapXOnDeath = l_map_pos_x;
    this.mapYOnDeath = l_map_pos_y;
}

function m_dave_reset(){

    this.positionX          = this.originalPositionX;
    this.positionY          = this.originalPositionY;

    this.currentFrame       = 0;

    this.velocityX          = 0;
    this.velocityY          = 0;

    this.tempCollisionDir   = 0;
    this.inAir              = false;

    this.score              = 0;
    this.lives              = this.MAX_LIVES;

    this.tookCup            = false;
    this.isDying            = false;
    this.reachedDoor        = false;
    this.canShoot           = false;

    this.mapXOnDeath        = 0;
    this.mapYOnDeath        = 0;

    this.isRespawning       = false;

    this.scaleX             = 1;
}
