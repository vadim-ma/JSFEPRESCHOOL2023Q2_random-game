export class Point{
    row;
    col;
    constructor(row, col){
        this.row = row;
        this.col = col;
    }
    isEqual(point){
        return this.row === point.row && this.col === point.col;
    }
    clone(){
        return new Point(this.row, this.col);
    }
    setTo(point){
        this.row = point.row;
        this.col = point.col;
    }
}