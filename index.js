const grid = document.getElementById("grid");
const startButton = document.getElementById("button");
const setWallButton = document.getElementById("setWall");
const setInitialButton = document.getElementById("setInitial");
const setTargetButton = document.getElementById("setTarget");
const setMoreTime = document.getElementById("setMoreTime");
const restart = document.getElementById("restart");
const gridWidth = 35;
const gridHeight = 25;
const graph = new Graph(gridWidth, gridHeight);

class Modes {
  static setInitial = 0;
  static setTarget = 1;
  static setWall = 2;
  static setMoreTime = 3;

  static classNames = ["initial", "target", "wall", "moreTime"];
}

let mode = Modes.setInitial;
let drag = false;
let initalNode;
let finalNode;

startButton.onclick = () => {
  start();
};

setInitialButton.onclick = () => {
  selectMode(Modes.setInitial,setInitialButton)
};

setTargetButton.onclick = () => {
  selectMode(Modes.setTarget,setTargetButton)
};

setWallButton.onclick = () => {
  selectMode(Modes.setWall,setWallButton)
};

setMoreTime.onclick = () => {
  selectMode(Modes.setMoreTime,setMoreTime)
};

function selectMode(newMode,button){
  document.querySelector(`.lighten-3`)?.classList.replace("lighten-3","lighten-1");
  mode = newMode;
  button.classList.remove("lighten-1")
  button.classList.add("lighten-3")
}

restart.onclick = () => {
  restartMatrix();
  document.querySelector(`.initial`)?.classList.remove("initial");
  document.querySelector(`.target`)?.classList.remove("target");
  document
    .querySelectorAll(".visited")
    ?.forEach((e) => e.classList.remove("visited"));
  document
    .querySelectorAll(".shortest")
    ?.forEach((e) => e.classList.remove("shortest"));
  document
    .querySelectorAll(".wall")
    ?.forEach((e) => e.classList.remove("wall"));
  document
    .querySelectorAll(".moreTime")
    ?.forEach((e) => e.classList.remove("moreTime"));
};

async function start() {
  const result = djikstra(graph, initalNode, finalNode);
  const shortestPath = getShortestPath(result?.pop());

  await delay(10);

  for (let node of result) {
    if (node == initalNode) continue;
    const cell = document.getElementById(node.id);
    cell.className = "grid-row visited";
    await delay(10);
  }

  for (let node of shortestPath) {
    if (node == initalNode || node == finalNode) continue;
    const cell = document.getElementById(node.id);
    cell.className = "grid-row shortest";
    await delay(10);
  }
}

function delay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

function renderGrid() {
  let nodeId = 0;
  for (let i = 0; i < gridHeight; i++) {
    const col = document.createElement("div");
    col.className = "grid-col";
    for (let j = 0; j < gridWidth; j++) {
      const row = document.createElement("div");
      row.className = "grid-row";
      row.id = nodeId;
      row.addEventListener("mousemove", (e) => {
        e.preventDefault()
        if (drag) onCellClick(row, j, i);
      });
      row.addEventListener("mousedown", (e) => {
        e.preventDefault()
        drag = true;
      });

      row.addEventListener("click", (e) => {
        e.preventDefault()
        onCellClick(row, j, i);
      });

      col.appendChild(row);
      graph.addNode(new Node(nodeId++, j, i));
    }
    grid.appendChild(col);
  }

  document.addEventListener("mouseup", () => {
    drag = false;
  });
}

function restartMatrix() {
  let nodeId = 0;
  for (let i = 0; i < gridHeight; i++) {
    for (let j = 0; j < gridWidth; j++) {
      graph.addNode(new Node(nodeId++, j, i));
    }
  }
}

function onCellClick(row, x, y) {
  const className = Modes.classNames[mode];
  const currentNode = graph.getNode(x, y);

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
  }

  row.className = "grid-row " + className;
}

renderGrid();
