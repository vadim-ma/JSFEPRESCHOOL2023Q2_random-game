import { Point } from "./geom.js";
import { Maze } from "./maze.js";
import { getElementChildIndex } from "./lib.js";

export class Game {
  config;
  visual;
  onWin;
  maze;
  hero;
  steps;
  visited;
  isModalOpen;
  constructor(config, visual, onWin) {
    this.config = config;
    this.visual = visual;
    this.onWin = onWin;
    this.steps = 0;
    this.isModalOpen = false;

    this.maze = new Maze(config.size.row, config.size.col, config.perfect);
    this.hero = new Point();

    if (this.maze.enter.row === 0) {
      this.hero.row = this.maze.enter.row + 1;
      this.hero.col = this.maze.enter.col;
    } else if (this.maze.enter.row === this.maze.rows - 1) {
      this.hero.row = this.maze.enter.row - 1;
      this.hero.col = this.maze.enter.col;
    } else {
      if (this.maze.enter.col === 0) {
        this.hero.row = this.maze.enter.row;
        this.hero.col = this.maze.enter.col + 1;
      } else if (this.maze.enter.col === this.maze.cols - 1) {
        this.hero.row = this.maze.enter.row;
        this.hero.col = this.maze.enter.col - 1;
      }
    }

    document.addEventListener("keydown", this.onKeyDown.bind(this));
    this.visual.addEventListener("click", this.onClick.bind(this));
  }
  onClick(ev) {
    const cell = ev.target.closest(".cell");
    const col = getElementChildIndex(cell);
    const row = getElementChildIndex(cell.parentNode);

    if (this.hero.row === row) {
      if (this.hero.col - col > 0 && this.hero.col - col < 3) {
        this.toLeft();
      } else if (col - this.hero.col > 0 && col - this.hero.col < 3) {
        this.toRight();
      }
    } else if (this.hero.col === col) {
      if (this.hero.row - row > 0 && this.hero.row - row < 3) {
        this.toUp();
      } else if (row - this.hero.row > 0 && row - this.hero.row < 3) {
        this.toDown();
      }
    }
  }
  saveRecords(records) {
    localStorage.setItem(
      `records-${this.config.sizeC}`,
      JSON.stringify(records)
    );
  }
  getRecords() {
    const records = localStorage.getItem(`records-${this.config.sizeC}`);
    if (!records) {
      const initRecords = Array(10).fill({ winner: "", score: null });
      this.saveRecords(initRecords);
      return initRecords;
    }
    return JSON.parse(records);
  }
  getRecordIndex() {
    const records = this.getRecords();
    const newIndex = records.findIndex(
      (record, idx) => !record.score || this.steps < record.score
    );
    return newIndex;
  }

  onKeyDown(ev) {
    if (this.isModalOpen) {
      return;
    }
    switch (ev.code) {
      case "ArrowRight":
        this.toRight();
        break;
      case "ArrowLeft":
        this.toLeft();
        break;
      case "ArrowDown":
        this.toDown();
        break;
      case "ArrowUp":
        this.toUp();
        break;

      default:
        break;
    }
  }
  moveHeroTo(newPoint) {
    let movementClass;
    if (this.hero.row > newPoint.row) {
      movementClass = "cell--up";
    } else if (this.hero.row < newPoint.row) {
      movementClass = "cell--down";
    } else if (this.hero.col > newPoint.col) {
      movementClass = "cell--left";
    } else if (this.hero.col < newPoint.col) {
      movementClass = "cell--right";
    } else {
      // ???
    }

    this.visual.children[this.hero.row].children[
      this.hero.col
    ].classList.remove("cell--hero");
    this.hero.row = newPoint.row;
    this.hero.col = newPoint.col;
    this.visual.children[this.hero.row].children[this.hero.col].classList.add(
      "cell--hero"
    );

    for (let r = -1; r < 2; r++) {
      for (let c = -1; c < 2; c++) {
        const cell =
          this.visual.children[this.hero.row + r].children[this.hero.col + c];
        cell.classList.remove("cell--hidden");
      }
    }
    this.visual.children[this.hero.row].children[
      this.hero.col
    ].classList.remove("cell--right");
    this.visual.children[this.hero.row].children[
      this.hero.col
    ].classList.remove("cell--down");
    this.visual.children[this.hero.row].children[
      this.hero.col
    ].classList.remove("cell--left");
    this.visual.children[this.hero.row].children[
      this.hero.col
    ].classList.remove("cell--up");
    this.visual.children[this.hero.row].children[this.hero.col].classList.add(
      "cell--visited",
      movementClass
    );
    this.steps++;
  }
  display() {
    this.visual.innerHTML = "";
    for (let row = 0; row < this.maze.rows; row++) {
      const rowEl = document.createElement("div");
      rowEl.className = "row";
      if (row % 2 === 0) {
        rowEl.classList.add("row--wallSize");
      }

      for (let col = 0; col < this.maze.cols; col++) {
        const cellEl = document.createElement("div");
        cellEl.className = "cell";
        if (col % 2 === 0) {
          cellEl.classList.add("cell--thin");
        }

        if (this.maze.cells[row][col]) {
          cellEl.classList.add("cell--wall");
          if (
            row > 0 &&
            row < this.maze.rows - 1 &&
            col > 0 &&
            col < this.maze.cols - 1
          ) {
            cellEl.classList.add("cell--hidden");
          }
        }
        rowEl.append(cellEl);
      }
      this.visual.append(rowEl);
    }

    const tmp = this.hero.clone();
    this.hero.setTo(this.maze.enter);
    this.moveHeroTo(tmp);

    this.visual.children[this.maze.exit.row].children[
      this.maze.exit.col
    ].classList.add("cell--exit");
  }
  checkGameOver(newPoint) {
    if (newPoint.isEqual(this.maze.exit)) {
      this.onWin();
    }
  }
  toRight() {
    this.checkGameOver(new Point(this.hero.row, this.hero.col + 1));
    if (this.maze.canRight(this.hero)) {
      this.moveHeroTo(new Point(this.hero.row, this.hero.col + 2));
    }
  }
  toLeft() {
    this.checkGameOver(new Point(this.hero.row, this.hero.col - 1));
    if (this.maze.canLeft(this.hero)) {
      this.moveHeroTo(new Point(this.hero.row, this.hero.col - 2));
    }
  }
  toDown() {
    this.checkGameOver(new Point(this.hero.row + 1, this.hero.col));
    if (this.maze.canDown(this.hero)) {
      this.moveHeroTo(new Point(this.hero.row + 2, this.hero.col));
    }
  }
  toUp() {
    this.checkGameOver(new Point(this.hero.row - 1, this.hero.col));
    if (this.maze.canUp(this.hero)) {
      this.moveHeroTo(new Point(this.hero.row - 2, this.hero.col));
    }
  }
}
