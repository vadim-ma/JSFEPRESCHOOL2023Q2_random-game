import { Point } from "./geom.js";
import { Game } from "./game.js";

const mazeVisual = document.querySelector(".maze");

const sizeC = "tiny"; // initial size
const size = convertSize(sizeC);
const config = { size: size, perfect: false, sizeC: sizeC }; //initial config;
let game = new Game(config, mazeVisual, onWin);
let records;
let recordIndex;
game.display();

const reset = document.querySelector(".reset");
reset.addEventListener("click", () => alert("not implemented yet"));

const configDialog = document.querySelector(".dialog-config");
const configure = document.querySelector(".configure");
configure.addEventListener("click", onConfigure);

function convertSize(sizeC) {
  const mazeVisual = document.querySelector(".maze");
  let rows;
  switch (sizeC) {
    case "tiny":
      rows = 4;
      break;
    case "small":
      rows = 8;
      break;
    case "medium":
      rows = 16;
      break;
    case "large":
      rows = 32;
      break;
  }
  let cols = Math.round(
    (rows * mazeVisual.clientWidth) / mazeVisual.clientHeight
  );
  return new Point(rows, cols);
}
function onConfigure() {
  game.isModalOpen = true;
  configDialog.showModal();
}
configDialog.addEventListener("close", () => {
  game.isModalOpen = false;
});

configDialog.addEventListener("submit", () => {
  if (configDialog.returnValue === "cancel") {
    return;
  }
  const newSizeC = document.forms.config.size.value;
  const newPerfect = document.forms.config.perfect.checked;

  const size = convertSize(newSizeC);
  config.size = size;
  config.sizeC = newSizeC;
  config.perfect = newPerfect;
  game = new Game(config, mazeVisual, onWin);
  game.display();
});

document.querySelectorAll("form button").forEach((element) => {
  element.addEventListener("click", (event) => {
    const btn = event.target.closest("button");
    event.target.closest("dialog").close(btn.value);
  });
});

const winDialog = document.querySelector(".dialog-win");
winDialog.addEventListener("close", () => {
  game.isModalOpen = false;
});

winDialog.addEventListener("submit", () => {
  if (recordIndex !== -1) {
    const winners = winDialog.querySelector('fieldset[name="winners"] ol');
    const winner = winners.children[recordIndex];
    const input = winner.querySelector("input");
    records[recordIndex].winner = input.value;
    game.saveRecords(records);
  }
  if (winDialog.returnValue === "default") {
    game = new Game(config, mazeVisual, onWin);
    game.display();
  }
});

document
  .querySelectorAll(".dialog--close-button")
  .forEach((element) =>
    element.addEventListener("click", (event) =>
      event.target.closest("dialog").close()
    )
  );

function onWin() {
  const steps = winDialog.querySelector(".dialog-win--steps");
  steps.textContent = this.steps;
  const visited = winDialog.querySelector(".dialog-win--visited");
  visited.textContent = mazeVisual.querySelectorAll(".cell--visited").length;

  recordIndex = this.getRecordIndex();
  records = this.getRecords();

  const recordMessage = winDialog.querySelector(".record-mesage");
  const winnersFieldSet = winDialog.querySelector('fieldset[name="winners"]');
  const winners = winDialog.querySelector('fieldset[name="winners"] ol');
  if (recordIndex === -1) {
    recordMessage.classList.add("hidden");
    winnersFieldSet.disabled = true;
    const continueBtn = document.querySelector(
      '.dialog-win button[value="cancel"]'
    );
    continueBtn.focus();
  } else {
    records.pop();
    records.splice(recordIndex, 0, { winner: "", score: this.steps });
    recordMessage.classList.remove("hidden");
    winnersFieldSet.disabled = false;
  }

  let winner = winners.firstElementChild;
  let curIndex = 0;
  records.forEach((record) => {
    if (winner) {
      const input = winner.querySelector("input");
      if (curIndex === recordIndex) {
        input.classList.add("active");
        input.disabled = false;
        input.focus();
      } else {
        input.classList.remove("active");
        input.disabled = true;
      }
      input.value = record.winner;

      winner = winner.nextElementSibling;
    }
    curIndex++;
  });

  this.isModalOpen = true;
  winDialog.showModal();
}
