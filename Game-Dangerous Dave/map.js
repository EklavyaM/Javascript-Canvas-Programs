function c_Map(l_rows, l_columns, l_canvas_width, l_canvas_height, l_frame_rate){

    this.BOUNDARY_WIDTH         = l_canvas_width;
    this.BOUNDARY_HEIGHT        = l_canvas_height;

    this.MAP_ROWS               = l_rows;
    this.MAP_COLUMNS            = l_columns;
    this.MAP_CELLS              = l_rows * l_columns;

    this.MAP_CELL_WIDTH         = 48;
    this.MAP_CELL_HEIGHT        = 48;

    this.MAP_WIDTH              = this.MAP_COLUMNS * this.MAP_CELL_WIDTH

    this.TYPE_NONE              = 0;
    this.TYPE_RED_TILE          = 1;
    this.TYPE_RED_DIAMOND       = 2;
    this.TYPE_BLUE_DIAMOND      = 3;
    this.TYPE_PLATFORM_TILE     = 4;
    this.TYPE_FIRE              = 5;
    this.TYPE_CUP               = 6;
    this.TYPE_SPHERE            = 7;
    this.TYPE_WATER             = 8;
    this.TYPE_DOOR              = 9;
    this.TYPE_WEED              = 10;
    this.TYPE_GUN               = 11;

    this.ANIM_SPEED_RED_TILE        = 0;
    this.ANIM_SPEED_RED_DIAMOND     = 0;
    this.ANIM_SPEED_BLUE_DIAMOND    = 0;
    this.ANIM_SPEED_PLATFORM_TILE   = 0;
    this.ANIM_SPEED_FIRE            = l_frame_rate / 6;
    this.ANIM_SPEED_CUP             = l_frame_rate / 6;
    this.ANIM_SPEED_SPHERE          = 0;
    this.ANIM_SPEED_WATER           = l_frame_rate / 6;
    this.ANIM_SPEED_DOOR            = 0;
    this.ANIM_SPEED_WEED            = l_frame_rate / 6;
    this.ANIM_SPEED_GUN             = 0;


    this.img_red_tile_array     = new Array();
    this.img_red_diamond_array  = new Array();
    this.img_blue_diamond_array = new Array();
    this.img_platform_array     = new Array();
    this.img_fire_array         = new Array();
    this.img_cup_array          = new Array();
    this.img_sphere_array       = new Array();
    this.img_water_array        = new Array();
    this.img_door_array         = new Array();
    this.img_weed_array         = new Array();
    this.img_gun_array          = new Array();

    this.objects            = null;
    this.objectsLength      = -1;

    this.mapData            = null;

    this.tempMapData        = null;
    this.tempObjCounter     = 0;

    this.tempObj            = null;

    this.positionX          = 0;
    this.positionY          = 0;

    this.init               = m_map_init;
    this.initSrc            = m_map_init_img_src;
    this.setMap             = m_map_set_map;
    this.setTiles           = m_map_set_tiles;
    this.draw               = m_map_draw;
    this.shift              = m_map_shift;
    this.reset              = m_map_reset;
}

function m_map_init(l_map_string){
    this.initSrc();
    this.setMap(l_map_string);
    this.setTiles();
}

function m_map_init_img_src(){
    // red tile images
    this.img_red_tile_array.push(new Image());
    this.img_red_tile_array[0].src = "img/redTile.png";

    this.img_red_diamond_array.push(new Image());
    this.img_red_diamond_array[0].src = "img/redDiamonds.png";

    this.img_blue_diamond_array.push(new Image());
    this.img_blue_diamond_array[0].src = "img/diamonds.png";

    this.img_platform_array.push(new Image());
    this.img_platform_array[0].src = "img/platformTile.png";

    for(var i=0; i<4; i++){
        this.img_fire_array.push(new Image());
        this.img_fire_array[i].src = "img/fire" + (i+1) + ".png";
    }

    for(var i=0; i<4; i++){
        this.img_cup_array.push(new Image());
        this.img_cup_array[i].src = "img/cup" + (i+1) + ".png";
    }

    this.img_sphere_array.push(new Image());
    this.img_sphere_array[0].src = "img/sphere.png";

    for(var i=0; i<4; i++){
        this.img_water_array.push(new Image());
        this.img_water_array[i].src = "img/water" + (i+1) + ".png";
    }

    this.img_door_array.push(new Image());
    this.img_door_array[0].src = "img/door.png";

    for(var i=0; i<4; i++){
        this.img_weed_array.push(new Image());
        this.img_weed_array[i].src = "img/weed" + (i+1) + ".png";
    }

    this.img_gun_array.push(new Image());
    this.img_gun_array[0].src = "img/gun.png";
}

function m_map_set_map(l_map_string){
    this.tempMapData   = l_map_string.split(",");
    if(this.tempMapData.length != this.MAP_CELLS){
        console.log("setBitmap Error. Incorrect length");
        return;
    }

    this.tempObjCounter = 0;
    for(var i=0; i<this.MAP_CELLS; i++){
        this.tempMapData[i] = parseInt(this.tempMapData[i]);
        if(this.tempMapData[i] != this.TYPE_NONE) this.tempObjCounter++;
    }
    this.mapData = this.tempMapData;
    this.objectsLength = this.tempObjCounter;
    this.objects = new Array(this.objectsLength);
}

function m_map_set_tiles(){
    this.tempObjCounter = 0;
    for(var i=0; i<this.MAP_CELLS; i++){
        switch(this.mapData[i]){
            case this.TYPE_RED_TILE:
                this.objects[this.tempObjCounter++] = new c_Tile(this.positionX + (i % this.MAP_COLUMNS) * this.MAP_CELL_WIDTH,
                                                                this.positionY + Math.floor(i / this.MAP_COLUMNS) * this.MAP_CELL_HEIGHT,
                                                                this.MAP_CELL_WIDTH, this.MAP_CELL_HEIGHT,
                                                                this.img_red_tile_array, this.TYPE_RED_TILE, this.ANIM_SPEED_RED_TILE);
                break;

            case this.TYPE_RED_DIAMOND:
                this.objects[this.tempObjCounter++] = new c_Tile(this.positionX + (i % this.MAP_COLUMNS) * this.MAP_CELL_WIDTH + this.MAP_CELL_WIDTH/6,
                                                                this.positionY + Math.floor(i / this.MAP_COLUMNS) * this.MAP_CELL_HEIGHT + this.MAP_CELL_HEIGHT/6,
                                                                2 * this.MAP_CELL_WIDTH / 3, 1.7 * this.MAP_CELL_HEIGHT / 3,
                                                                this.img_red_diamond_array, this.TYPE_RED_DIAMOND, this.ANIM_SPEED_RED_DIAMOND);
                break;

            case this.TYPE_BLUE_DIAMOND:
                this.objects[this.tempObjCounter++] = new c_Tile(this.positionX + (i % this.MAP_COLUMNS) * this.MAP_CELL_WIDTH + this.MAP_CELL_WIDTH/6,
                                                                this.positionY + Math.floor(i / this.MAP_COLUMNS) * this.MAP_CELL_HEIGHT + this.MAP_CELL_HEIGHT/6,
                                                                2 * this.MAP_CELL_WIDTH / 3, 1.7 * this.MAP_CELL_HEIGHT / 3,
                                                                this.img_blue_diamond_array, this.TYPE_BLUE_DIAMOND, this.ANIM_SPEED_BLUE_DIAMOND);
                break;

            case this.TYPE_PLATFORM_TILE:
                this.objects[this.tempObjCounter++] = new c_Tile(this.positionX + (i % this.MAP_COLUMNS) * this.MAP_CELL_WIDTH,
                                                                this.positionY + Math.floor(i / this.MAP_COLUMNS) * this.MAP_CELL_HEIGHT,
                                                                this.MAP_CELL_WIDTH, this.MAP_CELL_HEIGHT/1.5,
                                                                this.img_platform_array, this.TYPE_PLATFORM_TILE, this.ANIM_SPEED_PLATFORM_TILE);
                break;

            case this.TYPE_FIRE:
                this.objects[this.tempObjCounter++] = new c_Tile(this.positionX + (i % this.MAP_COLUMNS) * this.MAP_CELL_WIDTH,
                                                                this.positionY + Math.floor(i / this.MAP_COLUMNS) * this.MAP_CELL_HEIGHT + 2*this.MAP_CELL_HEIGHT/3,
                                                                this.MAP_CELL_WIDTH, this.MAP_CELL_HEIGHT/3,
                                                                this.img_fire_array, this.TYPE_FIRE, this.ANIM_SPEED_FIRE);
                break;

            case this.TYPE_CUP:
                this.objects[this.tempObjCounter++] = new c_Tile(this.positionX + (i % this.MAP_COLUMNS) * this.MAP_CELL_WIDTH,
                                                                this.positionY + Math.floor(i / this.MAP_COLUMNS) * this.MAP_CELL_HEIGHT,
                                                                this.MAP_CELL_WIDTH, this.MAP_CELL_HEIGHT,
                                                                this.img_cup_array, this.TYPE_CUP, this.ANIM_SPEED_CUP);
                break;

            case this.TYPE_SPHERE:
                this.objects[this.tempObjCounter++] = new c_Tile(this.positionX + (i % this.MAP_COLUMNS) * this.MAP_CELL_WIDTH + this.MAP_CELL_WIDTH/6,
                                                                this.positionY + Math.floor(i / this.MAP_COLUMNS) * this.MAP_CELL_HEIGHT + this.MAP_CELL_HEIGHT/6,
                                                                2 * this.MAP_CELL_WIDTH/3, 1.8 * this.MAP_CELL_HEIGHT / 3,
                                                                this.img_sphere_array, this.TYPE_SPHERE, this.ANIM_SPEED_SPHERE);
                break;

            case this.TYPE_WATER:
                this.objects[this.tempObjCounter++] = new c_Tile(this.positionX + (i % this.MAP_COLUMNS) * this.MAP_CELL_WIDTH,
                                                                this.positionY + Math.floor(i / this.MAP_COLUMNS) * this.MAP_CELL_HEIGHT + 2 * this.MAP_CELL_HEIGHT/3,
                                                                this.MAP_CELL_WIDTH, this.MAP_CELL_HEIGHT/3,
                                                                this.img_water_array, this.TYPE_WATER, this.ANIM_SPEED_WATER);
                break;

            case this.TYPE_DOOR:
                this.objects[this.tempObjCounter++] = new c_Tile(this.positionX + (i % this.MAP_COLUMNS) * this.MAP_CELL_WIDTH,
                                                                this.positionY + Math.floor(i / this.MAP_COLUMNS) * this.MAP_CELL_HEIGHT,
                                                                this.MAP_CELL_WIDTH, this.MAP_CELL_HEIGHT,
                                                                this.img_door_array, this.TYPE_DOOR, this.ANIM_SPEED_DOOR);
                break;

            case this.TYPE_WEED:
                this.objects[this.tempObjCounter++] = new c_Tile(this.positionX + (i % this.MAP_COLUMNS) * this.MAP_CELL_WIDTH,
                                                                this.positionY + Math.floor(i / this.MAP_COLUMNS) * this.MAP_CELL_HEIGHT,
                                                                this.MAP_CELL_WIDTH, this.MAP_CELL_HEIGHT,
                                                                this.img_weed_array, this.TYPE_WEED, this.ANIM_SPEED_WEED);
                break;
            case this.TYPE_GUN:
                this.objects[this.tempObjCounter++] = new c_Tile(this.positionX + (i % this.MAP_COLUMNS) * this.MAP_CELL_WIDTH + this.MAP_CELL_WIDTH/6,
                                                                this.positionY + Math.floor(i / this.MAP_COLUMNS) * this.MAP_CELL_HEIGHT + this.MAP_CELL_HEIGHT/2.2,
                                                                2 * this.MAP_CELL_WIDTH/3, 1.5 * this.MAP_CELL_HEIGHT / 3,
                                                                this.img_gun_array, this.TYPE_GUN, this.ANIM_SPEED_GUN);
        }
    }
}

function m_map_draw(l_context){
    for(var i=0; i<this.objectsLength; i++){
        this.objects[i].draw(l_context);
    }
}

function m_map_shift(l_val){
    for(var i=0; i<this.objectsLength; i++){
        this.objects[i].positionX += l_val;
    }
    this.positionX += l_val;
}

function m_map_reset(){
    for(var i=0; i<this.objectsLength; i++){
        this.objects[i].isAlive = true;
    }

    this.positionX = 0;
    this.positionY = 0;

    this.tempObjCounter = 0;
    for(var i=0; i<this.MAP_CELLS; i++){
        if(this.mapData[i] == this.TYPE_RED_TILE || this.mapData[i] == this.TYPE_PLATFORM_TILE || this.mapData[i] == this.TYPE_CUP || this.mapData[i] == this.TYPE_DOOR || this.mapData[i] == this.TYPE_WEED){
            this.tempObj = this.objects[this.tempObjCounter++];
            this.tempObj.positionX = this.positionX + (i % this.MAP_COLUMNS) * this.MAP_CELL_WIDTH;
            this.tempObj.positionY = this.positionY + Math.floor(i / this.MAP_COLUMNS) * this.MAP_CELL_HEIGHT;
        }

        else if(this.mapData[i] == this.TYPE_RED_DIAMOND || this.mapData[i] == this.TYPE_BLUE_DIAMOND || this.mapData[i] == this.TYPE_SPHERE){
            this.tempObj = this.objects[this.tempObjCounter++];
            this.tempObj.positionX = this.positionX + (i % this.MAP_COLUMNS) * this.MAP_CELL_WIDTH + this.MAP_CELL_WIDTH/6;
            this.tempObj.positionY = this.positionY + Math.floor(i / this.MAP_COLUMNS) * this.MAP_CELL_HEIGHT + this.MAP_CELL_HEIGHT/6;
        }

        else if(this.mapData[i] == this.TYPE_FIRE || this.mapData[i] == this.TYPE_WATER){
            this.tempObj = this.objects[this.tempObjCounter++];
            this.tempObj.positionX = this.positionX + (i % this.MAP_COLUMNS) * this.MAP_CELL_WIDTH;
            this.tempObj.positionY = this.positionY + Math.floor(i / this.MAP_COLUMNS) * this.MAP_CELL_HEIGHT + 2 * this.MAP_CELL_HEIGHT/3;
        }
        else if(this.mapData[i] == this.TYPE_GUN){
            this.tempObj = this.objects[this.tempObjCounter++];
            this.tempObj.positionX = this.positionX + (i % this.MAP_COLUMNS) * this.MAP_CELL_WIDTH + this.MAP_CELL_WIDTH/6;
            this.tempObj.positionY = this.positionY + Math.floor(i / this.MAP_COLUMNS) * this.MAP_CELL_HEIGHT + this.MAP_CELL_HEIGHT/2.2;
        }

    }
}
