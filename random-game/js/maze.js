import {Point}  from "./geom.js";
import {getRandomFromRange} from "./lib.js";

export class Maze {
    rows;
    cols;
    cells;
    enter;
    exit;
    constructor(rows, cols) {
        //test
        rows = 5;
        cols = 5;

        this.rows = 2 * rows + 1;
        this.cols = 2 * cols + 1;

        this.cells = Array(this.rows);

        this.cells[0] = Array(this.cols).fill(1);

        for (let row = 1; row < this.rows - 1; row++) {
            this.cells[row] = Array(this.cols).fill(0);
            this.cells[row][0] = 1;
            this.cells[row][this.cols - 1] = 1;
        }
        this.cells[this.rows - 1] = Array(this.cols).fill(1);

        // test
        this.cells = [
        [1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1,0,0,0,1],
        [1,1,1,0,1,0,1,0,1,0,1],
        [1,0,0,0,1,0,1,0,1,0,1],
        [1,0,1,0,1,0,1,0,1,0,1],
        [1,0,1,0,0,0,1,0,1,0,1],
        [1,0,1,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,1,0,1],
        [1,0,0,0,1,0,1,1,1,0,1],
        [1,0,0,0,1,0,0,0,1,0,1],
        [1,1,1,1,1,1,1,1,1,1,1]
        ];
        if(getRandomFromRange(0,1)){
            //on left edge
            this.enter = new Point(getRandomFromRange(0, (this.rows - 1) / 2 - 1) * 2 + 1, 0);
            this.exit  = new Point(getRandomFromRange(0, (this.rows - 1) / 2 - 1) * 2 + 1, this.cols - 1);
        }else{
            //on top edge
            this.enter = new Point(0,               getRandomFromRange(0, (this.cols - 1) / 2 - 1) * 2 + 1);
            this.exit  = new Point(this.cols - 1,   getRandomFromRange(0, (this.rows - 1) / 2 - 1) * 2 + 1);
        }
        this.cells[this.enter.row][this.enter.col] = 0;
        this.cells[this.exit.row][this.exit.col] = 0;
    }
    cell(point){
        return this.cells[point.row][point.col];
    }
    get rows() {
        return this.rows;
    }
    get cols() {
        return this.cols;
    }
    get walls() {
        return this.cells;
    }
    canRight(point){
        if(point.col > this.cols - 1 - 2){
            return false;
        }
        if(this.cells[point.row][point.col + 1]){
            return false;
        }
        if(this.cells[point.row][point.col + 2]){
            return false;
        }
        return true;
    }
    canLeft(point){
        if(point.col < 2){
            return false;
        }
        if(this.cells[point.row][point.col - 1]){
            return false;
        }
        if(this.cells[point.row][point.col - 2]){
            return false;
        }
        return true;
    }
    canDown(point){
        if(point.row > this.row - 1 - 2){
            return false;
        }
        if(this.cells[point.row + 1][point.col]){
            return false;
        }
        if(this.cells[point.row + 2][point.col]){
            return false;
        }
        return true;
    }
    canUp(point){
        if(point.row < 2){
            return false;
        }
        if(this.cells[point.row - 1][point.col]){
            return false;
        }
        if(this.cells[point.row - 2][point.col]){
            return false;
        }
        return true;
    }
    toString() {
        function isWallUp(arr, row, col){
    
            if(row === 0){
                return false;
            }
            return arr[row - 1][col];
        }
        function isWallDown(arr, row, col){
            if(row === arr.length - 1){
                return false;
            }
            return arr[row + 1][col];
        }
        function isWallLeft(arr, row, col){
            if(col === 0){
                return false;
            }
            return arr[row][col - 1];
        }
        function isWallRight(arr, row, col){
            if(col === arr[row].length - 1){
                return false;
            }
            return arr[row][col + 1];
        }

        let str = '';
        for (let row = 0; row < this.cells.length; row++) {
            for (let col = 0; col < this.cells[row].length; col++) {
                if (this.cells[row][col]) {
                    if(row % 2 === 0 && col % 2 !== 0 && col !== 0 && col != this.cells[row].length - 1){
                        str += '─';
                        continue
                    } 
                    if(col % 2 === 0 && row % 2 !== 0 && row !== 0 && row !== this.cells.length - 1){
                        str += '│';
                        continue
                    } 
                    if( isWallUp(this.cells, row, col)){
                        if(isWallDown(this.cells, row, col)){
                            if(isWallLeft(this.cells, row, col)){
                                if(isWallRight(this.cells, row, col)){
                                    str += '┼'
                                }else{
                                    str += '┤';
                                }
                            }else{
                                if(isWallRight(this.cells, row, col)){
                                    str += '├'
                                }else{
                                    str += '│';
                                }
                            }
                        }else{
                            if(isWallLeft(this.cells, row, col)){
                                if(isWallRight(this.cells, row, col)){
                                    str += '┴'
                                }else{
                                    str += '┘';
                                }
                            }else{
                                if(isWallRight(this.cells, row, col)){
                                    str += '└'
                                }else{
                                    str += '╵';
                                }
                            }
                        }
                    }else{
                        if(isWallDown(this.cells, row, col)){
                            if(isWallLeft(this.cells, row, col)){
                                if(isWallRight(this.cells, row, col)){
                                    str += '┬'
                                }else{
                                    str += '┐';
                                }
                            }else{
                                if(isWallRight(this.cells, row, col)){
                                    str += '┌'
                                }else{
                                    str += '╷';
                                }
                            }
                        }else{
                            if(isWallLeft(this.cells, row, col)){
                                if(isWallRight(this.cells, row, col)){
                                    str += '─'
                                }else{
                                    str += '╴';
                                }
                            }else{
                                if(isWallRight(this.cells, row, col)){
                                    str += '╶'
                                }else{
                                    str += '‧';
                                }
                            }
                        }
                    }
                } else {
                    if (row % 2 === 0) {
                        str += ' ';
                    } else {
                        str += 'X';
                    }
                }
            }
            str += '\n';
        }
        return str;
    }
}
