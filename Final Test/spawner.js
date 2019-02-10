function c_Spawner(l_tankerPosX, l_tankerPosY, l_width, l_height, l_frameRate){
    this.PI                     = 3.14;
    this.FRAME_RATE             = l_frameRate;
    this.MAX_ENEMIES            = 70;
    this.ENEMY_SPAWN_DELAY      = 0.8 * l_frameRate;
    
    this.POWERUP_TIMER          = 5 * l_frameRate;
    this.POWERUP_RADIUS         = 10;
    this.POWERUP_WIDTH          = 8;
    this.POWERUP_BODY_COL       = "black";
    this.POWERUP_SPAWN_DELAY    = 20 * l_frameRate; // 25

    this.POWERUP_DURATION       = 4 * l_frameRate; // 4
    
    this.BOUNDARY_WIDTH         = l_width;
    this.BOUNDARY_HEIGHT        = l_height;

    this.CODE_POWERUP_ENDED     = 1;
    
    this.enemies                = new Array(this.MAX_ENEMIES);
    this.powerup                = new c_Powerup(this.POWERUP_TIMER, this.POWERUP_RADIUS, this.POWERUP_WIDTH, this.POWERUP_BODY_COL);

    this.tankerPosX             = l_tankerPosX;
    this.tankerPosY             = l_tankerPosY;
    
    this.tempPosX               = 0;
    this.tempPosY               = 0;
    this.tempAngle              = 0;
    this.tempSpeed              = 0;
    this.tempRadius             = 0;
    
    this.enemySpawnTimer        = 0;
    this.powerupSpawnTimer      = 0;
    this.powerupEffectTimer     = 0;

    this.powerupTaken           = false;
    
    this.init                       = m_spawner_init;
    this.update                     = m_spawner_update;
    this.draw                       = m_spawner_draw;
    this.setEnemiesReverse          = m_spawner_set_enemies_reverse;
    this.spawnEnemy                 = m_spawner_spawn_enemy;
    this.setTarget                  = m_spawner_set_target;
    this.reset                      = m_spawner_reset;
    this.spawnPowerup               = m_spawner_spawn_powerup;

    this.updateEnemies              = m_spawner_update_enemies;
    this.checkEnemySpawnTimer       = m_spawner_check_enemy_spawn_timer;
    this.checkPowerupSpawnTimer     = m_spawner_check_powerup_spawn_timer;
    this.checkPowerupEffectTimer    = m_spawner_check_powerup_effect_timer;

}

function m_spawner_init(){
    for(var i=0; i<this.MAX_ENEMIES; i++) this.enemies[i] = new c_Enemy();
}

function m_spawner_update(){
    this.updateEnemies();
    this.powerup.update();
    
    this.checkEnemySpawnTimer();
    this.checkPowerupSpawnTimer();
    if(this.checkPowerupEffectTimer()) return this.CODE_POWERUP_ENDED;
}

function m_spawner_draw(l_context){
    // draw enemies
    for(var i=0; i<this.MAX_ENEMIES; i++) this.enemies[i].draw(l_context);
    // draw powerup
    this.powerup.draw(l_context);
}

function m_spawner_spawn_enemy(){
    for(var i=0; i<this.MAX_ENEMIES; i++){
        if(this.enemies[i].isAlive) continue;
        switch(parseInt(Math.random() * 4)){
            case 0: //left
            this.tempPosX = -this.tempRadius;
            this.tempPosY = parseInt(Math.random() * this.BOUNDARY_HEIGHT + this.tempRadius) - this.tempRadius;
            break;
            case 1: //top
            this.tempPosX = parseInt(Math.random() * this.BOUNDARY_WIDTH + this.tempRadius) - this.tempRadius;
            this.tempPosY = -this.tempRadius;
            break;
            case 2: //right
            this.tempPosX = this.BOUNDARY_WIDTH + this.tempRadius;
            this.tempPosY = parseInt(Math.random() * this.BOUNDARY_HEIGHT + this.tempRadius) - this.tempRadius;
            break;
            case 3: //bottom
            this.tempPosX = parseInt(Math.random() * this.BOUNDARY_WIDTH + this.tempRadius) - this.tempRadius;
            this.tempPosY = this.BOUNDARY_HEIGHT + this.tempRadius;
            break;
        }
        this.tempRadius = parseInt(Math.random() * 20 + 5);
        this.tempSpeed = parseInt(Math.random() * 17 + 3) / 20; // 5
        this.tempAngle = Math.atan2(this.tankerPosY - this.tempPosY, this.tankerPosX - this.tempPosX);
        this.enemies[i].set(this.tempPosX, this.tempPosY, 
                            this.tempSpeed,
                            this.tempRadius,
                            this.tempRadius * 2 / this.FRAME_RATE,
                            Math.cos(this.tempAngle), Math.sin(this.tempAngle));
        break;
    }
}

function m_spawner_spawn_powerup()
{
    this.powerup.set(Math.random() * (this.BOUNDARY_WIDTH - 4 * this.POWERUP_RADIUS) + 2 * this.POWERUP_RADIUS, 
                    Math.random() * (this.BOUNDARY_HEIGHT - 6 * this.POWERUP_RADIUS) + 3 * this.POWERUP_RADIUS);
}

function m_spawner_set_target(l_posX, l_posY)
{
    this.tankerPosX = l_posX;
    this.tankerPosY = l_posY;

    for(var i=0; i<this.MAX_ENEMIES; i++)
    {
        this.tempAngle = Math.atan2(this.tankerPosY - this.enemies[i].positionY, this.tankerPosX - this.enemies[i].positionX);
        this.enemies[i].setDir(Math.cos(this.tempAngle), Math.sin(this.tempAngle));
    }
}

function m_spawner_reset(){
    this.enemySpawnTimer = 0;
    this.powerupSpawnTimer = 0;
    this.powerupEffectTimer = 0;
    this.powerupTaken = false;
    this.powerup.isAlive = false;
    for(var i=0; i<this.MAX_ENEMIES; i++) {
        this.enemies[i].isAlive = false;
        this.enemies[i].setDefault();
    }
}

function m_spawner_set_enemies_reverse(l_powerupTaken)
{
    this.powerupTaken = l_powerupTaken;
    if(l_powerupTaken){
        this.powerup.isAlive = false;
        this.powerupEffectTimer = 0;
    }

    for(var i=0; i<this.MAX_ENEMIES; i++)
    {
        if(l_powerupTaken){
            this.enemies[i].setReverse();
        }
        else{
            this.enemies[i].setDefault();
        }
    }
}

function m_spawner_update_enemies(){
    for(var i=0; i<this.MAX_ENEMIES; i++) this.enemies[i].update();
}

function m_spawner_check_enemy_spawn_timer(){
    this.enemySpawnTimer++;
    if(this.enemySpawnTimer >= this.ENEMY_SPAWN_DELAY) {
        this.spawnEnemy();
        this.enemySpawnTimer = 0;
    }
}

function m_spawner_check_powerup_spawn_timer(){
    if(!this.powerup.isAlive) this.powerupSpawnTimer++;
    if(this.powerupSpawnTimer >= this.POWERUP_SPAWN_DELAY){
        this.spawnPowerup();
        this.powerupSpawnTimer = 0;
    }
}

function m_spawner_check_powerup_effect_timer(){
    // returns true if effect ended
    if(this.powerupTaken) this.powerupEffectTimer++;
    if(this.powerupEffectTimer >= this.POWERUP_DURATION){
        this.setEnemiesReverse(false);
        this.powerupEffectTimer = 0;
        return true;
    }
    return false;
}