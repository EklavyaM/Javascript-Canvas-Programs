function c_Grid(l_pos_x, l_pos_y, l_rows, l_columns, l_cell_size){
    this.positionX                  = l_pos_x;
    this.positionY                  = l_pos_y;

    this.numberOfHorizontalCells    = l_columns;
    this.numberOfVerticalCells      = l_rows;
    this.cellSize                   = l_cell_size;

    this.width                      = l_columns * l_cell_size;
    this.height                     = l_rows * l_cell_size;

    this.cells                      = new Array(this.numberOfVerticalCells);

    this.tempCharCode               = 65;

    this.cellBeingHoveredOn         = null;

    this.tempCell                   = null;
    this.tempPositionX              = 0;
    this.tempPositionY              = 0;
    this.tempGridI                  = -1;
    this.tempGridJ                  = -1;

    this.draw               = m_grid_draw;
    this.mouseIn            = m_grid_mouse_in;
    this.hit                = m_grid_hit;
    this.swap               = m_grid_swap;
    this.click              = m_grid_click;
    this.getNeighbors       = m_grid_get_neighbors;
    this.checkBlankInList   = m_grid_check_blank_in_list;
    this.shuffle            = m_grid_shuffle;
    this.findBlank          = m_grid_find_blank;
    this.isSolved           = m_grid_is_solved;
    this.reset              = m_grid_reset;

    for(var i=0; i<this.numberOfVerticalCells; i++){
        this.cells[i] = new Array(this.numberOfHorizontalCells);
    }

    for(var i=0; i<this.numberOfVerticalCells; i++){
        for(var j=0;j<this.numberOfHorizontalCells; j++){
            this.cells[i][j] = new c_Cell(i, j, this.positionX + j*this.cellSize, this.positionY + i*this.cellSize, this.cellSize, String.fromCharCode(this.tempCharCode));
            this.tempCharCode++;
        }
    }

    this.cells[this.numberOfVerticalCells-1][this.numberOfHorizontalCells-1].empty();

}

function m_grid_draw(l_context){
    for(var i=0; i<this.numberOfVerticalCells; i++){
        for(var j=0; j<this.numberOfHorizontalCells; j++){
            this.cells[i][j].draw(l_context);
        }
    }
    if(this.cellBeingHoveredOn) this.cellBeingHoveredOn.draw(l_context);
}

function m_grid_hit(l_pos_x, l_pos_y){
    for(var i=0; i<this.numberOfVerticalCells; i++){
        for(var j=0; j<this.numberOfHorizontalCells; j++){
            if(this.cells[i][j].hit(l_pos_x, l_pos_y)){
                if(this.cellBeingHoveredOn) this.cellBeingHoveredOn.setHovering(false);
                this.cellBeingHoveredOn = this.cells[i][j];
                break;
            }
        }
    }
    this.cellBeingHoveredOn.setHovering(true);
}

function m_grid_mouse_in(l_pos_x, l_pos_y){
    if(l_pos_x >= this.positionX && l_pos_x <= this.positionX + this.width
    && l_pos_y >= this.positionY && l_pos_y <= this.positionY + this.height){
        return true;
    }
    return false;
}

function m_grid_swap(l_i1, l_j1, l_i2, l_j2){
    if(l_i1 < 0 || l_i1 > this.numberOfVerticalCells - 1 ||
        l_i2 < 0 || l_i2 > this.numberOfVerticalCells - 1 ||
        l_j1 < 0 || l_j1 > this.numberOfHorizontalCells - 1 ||
        l_j2 < 0 || l_j2 > this.numberOfHorizontalCells - 1) return -1;

    this.tempPositionX = this.cells[l_i1][l_j1].positionX;
    this.tempPositionY = this.cells[l_i1][l_j1].positionY;
    this.tempGridI = l_i1;
    this.tempGridJ = l_j1;

    this.cells[l_i1][l_j1].positionX = this.cells[l_i2][l_j2].positionX;
    this.cells[l_i1][l_j1].positionY = this.cells[l_i2][l_j2].positionY;
    this.cells[l_i1][l_j1].gridI = l_i2;
    this.cells[l_i1][l_j1].gridJ = l_j2;

    this.cells[l_i2][l_j2].positionX = this.tempPositionX;
    this.cells[l_i2][l_j2].positionY = this.tempPositionY;
    this.cells[l_i2][l_j2].gridI = this.tempGridI;
    this.cells[l_i2][l_j2].gridJ = this.tempGridJ;

    this.tempCell = this.cells[l_i1][l_j1];
    this.cells[l_i1][l_j1] = this.cells[l_i2][l_j2];
    this.cells[l_i2][l_j2] = this.tempCell;
}

function m_grid_click(){
    var l_temp_neighbor_list = this.getNeighbors(this.cellBeingHoveredOn.gridI, this.cellBeingHoveredOn.gridJ);
    var l_index_pair = this.checkBlankInList(l_temp_neighbor_list);

    if(l_index_pair != -1){
        this.swap(this.cellBeingHoveredOn.gridI, this.cellBeingHoveredOn.gridJ, l_index_pair.indexI, l_index_pair.indexJ);
    }

    this.cellBeingHoveredOn.setHovering(false);
    this.cellBeingHoveredOn = null;
}

function m_grid_get_neighbors(l_i, l_j){
    var l_neighbors = new Array();
    if(l_i != 0) l_neighbors.push(this.cells[l_i - 1][l_j]);
    if(l_i != this.numberOfVerticalCells - 1) l_neighbors.push(this.cells[l_i + 1][l_j]);
    if(l_j != 0) l_neighbors.push(this.cells[l_i][l_j - 1]);
    if(l_j != this.numberOfHorizontalCells - 1) l_neighbors.push(this.cells[l_i][l_j + 1]);
    return l_neighbors;
}

function m_grid_check_blank_in_list(l_cell_list){
    for(var i=0; i<l_cell_list.length; i++){
        if(l_cell_list[i].cellValue == ""){
            return {indexI: l_cell_list[i].gridI, indexJ:l_cell_list[i].gridJ};
        }
    }
    return -1;
}

function m_grid_shuffle(l_moves){

    for(var i=0; i < l_moves; i++){
        var l_blank = this.findBlank();
        var l_temp_neighbor_list = this.getNeighbors(l_blank.indexI, l_blank.indexJ);
        var l_randomNeighbor = l_temp_neighbor_list[parseInt(Math.random() * l_temp_neighbor_list.length)];
        this.swap(l_blank.indexI, l_blank.indexJ, l_randomNeighbor.gridI, l_randomNeighbor.gridJ);
    }
}

function m_grid_find_blank(){
    for(var i=0; i < this.numberOfVerticalCells; i++){
        for(var j=0; j < this.numberOfHorizontalCells; j++){
            if(this.cells[i][j].cellValue == ""){
                return {indexI: i, indexJ: j};
            }
        }
    }
}

function m_grid_is_solved(){
    var l_is_solved = true;
    for(var i=0; i<this.numberOfVerticalCells; i++){
        for(var j=0; j<this.numberOfHorizontalCells; j++){
            if(i == 0 && j == 0) continue;
            if(i == this.numberOfVerticalCells-1 && j == this.numberOfHorizontalCells -1) continue;
            if(i != 0 && j == 0){
                if(this.cells[i-1][this.numberOfHorizontalCells-1].cellValue > this.cells[i][j].cellValue){
                    l_is_solved = false;
                    break;
                }
            }
            if(i !=0 && j !=0){
                if(this.cells[i][j-1].cellValue > this.cells[i][j].cellValue){
                    l_is_solved = false;
                    break;
                }
            }
        }
    }
    return l_is_solved;
}

function m_grid_reset(){
    this.tempCharCode = 65;

    for(var i=0; i<this.numberOfVerticalCells; i++){
        for(var j=0;j<this.numberOfHorizontalCells; j++){
            this.cells[i][j].setValue(String.fromCharCode(this.tempCharCode));
            this.tempCharCode++;
        }
    }

    this.cells[this.numberOfVerticalCells-1][this.numberOfHorizontalCells-1].empty();
}
