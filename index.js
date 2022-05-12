const grid = document.getElementById("grid");
const startButton = document.getElementById("button");
const setWallButton = document.getElementById("setWall");
const setInitialButton = document.getElementById("setInitial");
const setTargetButton = document.getElementById("setTarget");
const setMoreTime = document.getElementById("setMoreTime");
const deleteButton = document.getElementById("deleteButton");
const restart = document.getElementById("restart");
let gridWidth = Math.floor(grid.offsetWidth / 30);
let gridHeight = Math.floor(grid.offsetHeight / 30);
const graph = new Graph(gridWidth, gridHeight);

class Modes {
  static setInitial = 0;
  static setTarget = 1;
  static setWall = 2;
  static setMoreTime = 3;
  static delete = 4;

  static classNames = ["initial", "target", "wall", "moreTime", ""];
}

let mode = Modes.setInitial;
let drag = false;
let initalNode;
let finalNode;

startButton.onclick = () => {
  start();
};

setInitialButton.onclick = () => {
  selectMode(Modes.setInitial, setInitialButton);
};

setTargetButton.onclick = () => {
  selectMode(Modes.setTarget, setTargetButton);
};

setWallButton.onclick = () => {
  selectMode(Modes.setWall, setWallButton);
};

setMoreTime.onclick = () => {
  selectMode(Modes.setMoreTime, setMoreTime);
};

deleteButton.onclick = () => {
  selectMode(Modes.delete, deleteButton);
};

restart.onclick = () => {
  restartMatrix();
  removeInitial();
  removePath();
  removeMapElements();
};

async function start() {
  removePath();
  const result = djikstra(graph, initalNode, finalNode);
  const shortestPath = getShortestPath(result?.pop());

  await delay(10);

  for (let node of result) {
    if (node.id == initalNode.id) continue;
    const cell = document.getElementById(node.id);
    cell.classList.add("visited");
    await delay(10);
  }

  for (let node of shortestPath) {
    if (node.id == initalNode.id || node.id == finalNode.id) continue;
    const cell = document.getElementById(node.id);
    cell.classList.add("shortest");
    await delay(10);
  }
}

function renderGrid() {
  grid.innerHTML = "";
  let nodeId = 0;
  for (let i = 0; i < gridHeight; i++) {
    const col = document.createElement("div");
    col.className = "grid-col";
    for (let j = 0; j < gridWidth; j++) {
      const row = document.createElement("div");
      row.classList.add("grid-row");
      row.id = nodeId;
      row.x = j;
      row.y = i;
      row.addEventListener("mousemove", (e) => {
        e.preventDefault();
        if (drag) onCellClick(row, j, i);
      });

      row.addEventListener("mousedown", (e) => {
        e.preventDefault();
        drag = true;
      });

      row.addEventListener("click", (e) => {
        e.preventDefault();
        onCellClick(row, j, i);
      });

      col.appendChild(row);
      graph.addNode(new Node(nodeId++, j, i));
    }
    grid.appendChild(col);
  }
}

function onCellClick(row, x, y) {
  const className = Modes.classNames[mode];
  const currentNode = graph.getNode(x, y);
  resetNode(currentNode);

  switch (mode) {
    case Modes.setInitial:
      document.querySelector(`.${className}`)?.classList.remove(className);
      initalNode = currentNode;
      break;
    case Modes.setTarget:
      document.querySelector(`.${className}`)?.classList.remove(className);
      finalNode = currentNode;
      break;
    case Modes.setWall:
      currentNode.isWall = true;
      break;
    case Modes.setMoreTime:
      currentNode.extraTime = 10;
      break;
    case Modes.delete:
      deleteMapElement(currentNode);
      break;
  }

  row.className = "grid-row " + className;
}

function resetNode(node) {
  node.extraTime = 0;
  node.isWall = false;
}

function deleteMapElement(node) {
  if (node == initalNode) initalNode = null;
  if (node == finalNode) finalNode = null;
}

function calculateGridSize() {
  gridWidth = Math.floor(grid.offsetWidth / 30);
  gridHeight = Math.floor(grid.offsetHeight / 30);
}

function restartMatrix() {
  let nodeId = 0;
  for (let i = 0; i < gridHeight; i++) {
    for (let j = 0; j < gridWidth; j++) {
      graph.addNode(new Node(nodeId++, j, i));
    }
  }
}

function removeInitial() {
  document.querySelector(`.initial`)?.classList.remove("initial");
  document.querySelector(`.target`)?.classList.remove("target");
}

function removePath() {
  document
    .querySelectorAll(".visited")
    ?.forEach((e) => e.classList.remove("visited"));
  document
    .querySelectorAll(".shortest")
    ?.forEach((e) => e.classList.remove("shortest"));
}

function removeMapElements() {
  document
    .querySelectorAll(".wall")
    ?.forEach((e) => e.classList.remove("wall"));
  document
    .querySelectorAll(".moreTime")
    ?.forEach((e) => e.classList.remove("moreTime"));
}

function selectMode(newMode, button) {
  document
    .querySelector(`.lighten-3`)
    ?.classList.replace("lighten-3", "lighten-1");
  mode = newMode;
  button.classList.remove("lighten-1");
  button.classList.add("lighten-3");
}

function delay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

document.addEventListener("mouseup", () => {
  drag = false;
});

grid.addEventListener("touchstart", (e) => {
  e.preventDefault();
  drag = true;
  const { clientX, clientY } = e.changedTouches[0];
  const cell = document.elementFromPoint(clientX, clientY);
  if (cell.x != undefined && cell.y != undefined && drag)
    onCellClick(cell, cell.x, cell.y);
});

document.addEventListener("touchend", (e) => {
  drag = false;
});

document.addEventListener("touchmove", (e) => {
  const { clientX, clientY } = e.changedTouches[0];
  const cell = document.elementFromPoint(clientX, clientY);
  if (cell.x != undefined && cell.y != undefined && drag)
    onCellClick(cell, cell.x, cell.y);
});

renderGrid();
