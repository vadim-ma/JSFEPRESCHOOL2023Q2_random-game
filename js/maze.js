import { Point } from "./geom.js";
import { getRandomFromRange } from "./lib.js";

export class Maze {
  rows;
  cols;
  perfect;
  cells;
  enter;
  exit;
  constructor(rows, cols, perfect) {
    this.rows = 2 * rows + 1;
    this.cols = 2 * cols + 1;
    this.perfect = perfect;

    //алгоритм генерации лабиринта

    //создадим стены вокруг области построения лабиринта
    //добавим вход и выход
    //заполним внутренную область сгенерированным лабиринтом

    //определим (случайно) способ деления текущей области:
    // - либо одной стеной на два блока
    //      - либо горизонтальной стеной
    //      - либо вертикальной стеной
    // - либо двумя пересекающимися стенами - вертикальной и гозонтальной на четыре блока
    //проверить на возможность деления

    //создать новые стены в случайных координатах

    // в новых созданных стенах создадим проходы
    // при делении блока одной стеной - создадим один проход в случайном месте
    // при делении блока двумя пересекающимися стенам добавим
    //  - либо 3 прохода (гарантирует достижимость выхода)
    //  - либо 4 прохода (дополнительно гарантирует образование петель)

    // в новых областях отметим входы и выходы в местах образования новых проходов
    // вызовем алгоритм генерации для новых блоков

    //создадим пустую область для всего лабиринта

    this.cells = Array(this.rows);
    for (let row = 0; row < this.rows; row++) {
      this.cells[row] = Array(this.cols).fill(0);
    }
    const s = new Point(0, 0);
    const e = new Point(this.rows - 1, this.cols - 1);

    //создадим стены по границам всей области
    this.fillRowWall(s, e, 0);
    this.fillRowWall(s, e, e.row);
    this.fillColWall(s, e, 0);
    this.fillColWall(s, e, e.col);
    //добавим стены в углах
    this.cells[s.row][s.col] = 1;
    this.cells[s.row][e.col] = 1;
    this.cells[e.row][s.col] = 1;
    this.cells[e.row][e.col] = 1;

    //случайным образом определим вход и выход
    const enterLeftorTop = getRandomFromRange(0, 1);
    if (enterLeftorTop) {
      //on left edge
      this.enter = new Point(Maze.getRandomRowPass(s, e), s.col);
      this.exit = new Point(Maze.getRandomRowPass(s, e), e.col);
    } else {
      //on top edge
      this.enter = new Point(s.row, Maze.getRandomColPass(s, e));
      this.exit = new Point(e.row, Maze.getRandomColPass(s, e));
    }
    this.cells[this.enter.row][this.enter.col] = 0;
    this.cells[this.exit.row][this.exit.col] = 0;

    this.generate(s, e);
  }
  fillRowWall(s, e, fillRow) {
    for (let col = s.col + 1; col < e.col; col++) {
      this.cells[fillRow][col] = 1;
    }
  }
  fillColWall(s, e, fillCol) {
    for (let row = s.row + 1; row < e.row; row++) {
      this.cells[row][fillCol] = 1;
    }
  }
  static getRandomCell(s, e, wallOrPass, rowOrCol) {
    const freeCount =
      (e.getRowOrCol(rowOrCol) - s.getRowOrCol(rowOrCol)) / 2 -
      (wallOrPass ? 1 : 0);
    const val = getRandomFromRange(1, freeCount);
    return (
      s.getRowOrCol(rowOrCol) +
      (wallOrPass ? 0 : 1) +
      (val - (wallOrPass ? 0 : 1)) * 2
    );
  }
  static getRandomRow(s, e, wallOrPass) {
    return Maze.getRandomCell(s, e, wallOrPass, true);
  }
  static getRandomCol(s, e, wallOrPass) {
    return Maze.getRandomCell(s, e, wallOrPass, false);
  }
  static getRandomColWall(s, e) {
    return Maze.getRandomCol(s, e, true);
  }
  static getRandomColPass(s, e) {
    return Maze.getRandomCol(s, e, false);
  }
  static getRandomRowWall(s, e) {
    return Maze.getRandomRow(s, e, true);
  }
  static getRandomRowPass(s, e) {
    return Maze.getRandomRow(s, e, false);
  }
  static canSplit(s, e, split4or2, splitCorR) {
    if (split4or2) {
      return e.col - s.col > 2 && e.row - s.row > 2;
    } else {
      if (splitCorR) {
        return e.col - s.col > 2;
      }
      return e.row - s.row > 2;
    }
  }

  generate(s /* start point */, e /* end point */) {
    //определим (случайно) способ деления текущей области:
    // - либо одной стеной на два блока
    //      - либо горизонтальной стеной
    //      - либо вертикальной стеной
    // - либо двумя пересекающимися стенами - вертикальной и гозонтальной на четыре блока
    const split4or2 = getRandomFromRange(0, 1); // 1 - делим на 4 части, 0 - делим на 2 части
    const splitCorR = getRandomFromRange(0, 1); // 1 - делим вертикальной стеной, 0 -  горизонтальной

    //проверить на возможность деления
    if (!Maze.canSplit(s, e, split4or2, splitCorR)) {
      return;
    }
    //создать новые стены в случайных координатах
    const newRowWall = Maze.getRandomRowWall(s, e);
    const newColWall = Maze.getRandomColWall(s, e);
    if (split4or2 || splitCorR) {
      this.fillColWall(s, e, newColWall);
    }
    if (split4or2 || !splitCorR) {
      this.fillRowWall(s, e, newRowWall);
    }

    // в новых созданных стенах создадим проходы
    if (split4or2) {
      // при делении блока двумя пересекающимися стенам добавим
      //  - либо 3 прохода (гарантирует достижимость выхода)
      //  - либо 4 прохода (дополнительно гарантирует образование петель)

      const pass3or4 = this.perfect ? 1 : getRandomFromRange(0, 1);
      const noPass = getRandomFromRange(1, 4);

      // define start and end of new quadrants
      const s1 = new Point(s.row, s.col);
      const e1 = new Point(newRowWall, newColWall);
      const s2 = new Point(s.row, newColWall);
      const e2 = new Point(newRowWall, e.col);
      const s3 = new Point(newRowWall, newColWall);
      const e3 = new Point(e.row, e.col);
      const s4 = new Point(newRowWall, s.col);
      const e4 = new Point(e.row, newColWall);

      //make pass in top new wall
      if (!pass3or4 || noPass !== 1) {
        const newPass = Maze.getRandomRowPass(s1, e2);
        this.cells[newPass][newColWall] = 0;
      }
      //make pass in right new wall
      if (!pass3or4 || noPass !== 2) {
        const newPass = Maze.getRandomColPass(s2, e3);
        this.cells[newRowWall][newPass] = 0;
      }
      //make pass in bottom new wall
      if (!pass3or4 || noPass !== 3) {
        const newPass = Maze.getRandomRowPass(s4, e3);
        this.cells[newPass][newColWall] = 0;
      }
      //make pass in right new wall
      if (!pass3or4 || noPass !== 4) {
        const newPass = Maze.getRandomColPass(s1, e4);
        this.cells[newRowWall][newPass] = 0;
      }

      // 1 квадрант
      this.generate(s1, e1);
      // 2 квадрант
      this.generate(s2, e2);
      // 3 квадрант
      this.generate(s3, e3);
      // 4 квадрант
      this.generate(s4, e4);
    } else {
      // при делении блока одной стеной - создадим один проход в случайном месте
      if (splitCorR) {
        const newPass = Maze.getRandomRowPass(s, e);
        this.cells[newPass][newColWall] = 0;
        this.generate(s, new Point(e.row, newColWall));
        this.generate(new Point(s.row, newColWall), e);
      } else {
        const newPass = Maze.getRandomColPass(s, e);
        this.cells[newRowWall][newPass] = 0;
        this.generate(s, new Point(newRowWall, e.col));
        this.generate(new Point(newRowWall, s.col), e);
      }
    }

    // в новых областях отметим входы и выходы в местах образования новых проходов
    // вызовем алгоритм генерации для новых блоков
  }
  cell(point) {
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
  canRight(point) {
    if (point.col > this.cols - 1 - 2) {
      return false;
    }
    if (this.cells[point.row][point.col + 1]) {
      return false;
    }
    if (this.cells[point.row][point.col + 2]) {
      return false;
    }
    return true;
  }
  canLeft(point) {
    if (point.col < 2) {
      return false;
    }
    if (this.cells[point.row][point.col - 1]) {
      return false;
    }
    if (this.cells[point.row][point.col - 2]) {
      return false;
    }
    return true;
  }
  canDown(point) {
    if (point.row > this.rows - 1 - 2) {
      return false;
    }
    if (this.cells[point.row + 1][point.col]) {
      return false;
    }
    if (this.cells[point.row + 2][point.col]) {
      return false;
    }
    return true;
  }
  canUp(point) {
    if (point.row < 2) {
      return false;
    }
    if (this.cells[point.row - 1][point.col]) {
      return false;
    }
    if (this.cells[point.row - 2][point.col]) {
      return false;
    }
    return true;
  }
  toString() {
    //this function simplifies debugging
    function isWallUp(arr, row, col) {
      if (row === 0) {
        return false;
      }
      return arr[row - 1][col];
    }
    function isWallDown(arr, row, col) {
      if (row === arr.length - 1) {
        return false;
      }
      return arr[row + 1][col];
    }
    function isWallLeft(arr, row, col) {
      if (col === 0) {
        return false;
      }
      return arr[row][col - 1];
    }
    function isWallRight(arr, row, col) {
      if (col === arr[row].length - 1) {
        return false;
      }
      return arr[row][col + 1];
    }

    let str = "";
    for (let row = 0; row < this.cells.length; row++) {
      for (let col = 0; col < this.cells[row].length; col++) {
        if (this.cells[row][col]) {
          if (
            row % 2 === 0 &&
            col % 2 !== 0 &&
            col !== 0 &&
            col != this.cells[row].length - 1
          ) {
            str += "─";
            continue;
          }
          if (
            col % 2 === 0 &&
            row % 2 !== 0 &&
            row !== 0 &&
            row !== this.cells.length - 1
          ) {
            str += "│";
            continue;
          }
          if (isWallUp(this.cells, row, col)) {
            if (isWallDown(this.cells, row, col)) {
              if (isWallLeft(this.cells, row, col)) {
                if (isWallRight(this.cells, row, col)) {
                  str += "┼";
                } else {
                  str += "┤";
                }
              } else {
                if (isWallRight(this.cells, row, col)) {
                  str += "├";
                } else {
                  str += "│";
                }
              }
            } else {
              if (isWallLeft(this.cells, row, col)) {
                if (isWallRight(this.cells, row, col)) {
                  str += "┴";
                } else {
                  str += "┘";
                }
              } else {
                if (isWallRight(this.cells, row, col)) {
                  str += "└";
                } else {
                  str += "╵";
                }
              }
            }
          } else {
            if (isWallDown(this.cells, row, col)) {
              if (isWallLeft(this.cells, row, col)) {
                if (isWallRight(this.cells, row, col)) {
                  str += "┬";
                } else {
                  str += "┐";
                }
              } else {
                if (isWallRight(this.cells, row, col)) {
                  str += "┌";
                } else {
                  str += "╷";
                }
              }
            } else {
              if (isWallLeft(this.cells, row, col)) {
                if (isWallRight(this.cells, row, col)) {
                  str += "─";
                } else {
                  str += "╴";
                }
              } else {
                if (isWallRight(this.cells, row, col)) {
                  str += "╶";
                } else {
                  str += "‧";
                }
              }
            }
          }
        } else {
          if (row % 2 === 0) {
            str += " ";
          } else {
            str += "X";
          }
        }
      }
      str += "\n";
    }
    return str;
  }
}
