class Node {
  id;
  x;
  y;
  distance = Infinity;
  previous;
  extraTime = 0;
  isWall = false;
  visited;
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
}

class Graph {
  list = [];
  width;
  heigth;

  constructor(width, heigth) {
    this.width = width;
    this.heigth = heigth;
    for (let i = 0; i < heigth; i++) {
      const col = [];
      for (let j = 0; j < width; j++) {
        col.push(null);
      }
      this.list.push(col);
    }
  }

  addNode(node) {
    this.list[node.y][node.x] = node;
  }

  getNodeNeighbors(node) {
    const neighbors = [];

    if (node.x > 0) {
      neighbors.push(this.list[node.y][node.x - 1]);
    }

    if (node.y > 0) {
      neighbors.push(this.list[node.y - 1][node.x]);
    }

    if (node.y < this.heigth - 1) {
      neighbors.push(this.list[node.y + 1][node.x]);
    }
    if (node.x < this.width - 1) {
      neighbors.push(this.list[node.y][node.x + 1]);
    }

    return neighbors.filter((e) => !e.visited);
  }

  getNode(x, y) {
    return this.list[y][x];
  }

  getAllNodes() {
    let nodes = [];

    for (let element of this.list) {
      for (let cell of element) {
        nodes.push(cell);
      }
    }
    return nodes;
  }

  updateNeighbors(node) {
    const neighbors = this.getNodeNeighbors(node);

    for (let neighbor of neighbors) {
      neighbor.distance = node.distance + 1 + neighbor.extraTime;
      neighbor.previous = node;
    }
  }
}

function copyGraph(graph) {
  const newGraph = Object.assign(
    new Graph(),
    JSON.parse(JSON.stringify(graph))
  );

  newGraph.getAllNodes().forEach((e) => (e.distance = Infinity));
  return newGraph;
}

function sortQueue(queue) {
  return queue.sort((a, b) => a.distance - b.distance);
}
