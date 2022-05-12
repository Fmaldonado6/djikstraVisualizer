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

function getShortestPath(finishNode) {
  const nodesInShortestPath = [];
  let currentNode = finishNode;
  while (currentNode != null) {
    nodesInShortestPath.unshift(currentNode);
    currentNode = currentNode.previous;
  }

  return nodesInShortestPath.map((e) => {
    e.previous = null;

    return e;
  });
}

function sortQueue(queue) {
  return queue.sort((a, b) => a.distance - b.distance);
}

function djikstra(graph, firstNode, targetNode) {
  if (!graph || !firstNode || !targetNode) return null;

  firstNode.distance = 0;
  const newGraph = Object.assign(new Graph(), graph);
  let queue = newGraph.getAllNodes();
  const visitedNodesInOrder = [];

  while (queue.length > 0) {
    queue = sortQueue(queue);
    const closestNode = queue.shift();

    if (closestNode.isWall) continue;

    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    closestNode.visited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode.id == targetNode.id) return visitedNodesInOrder;

    newGraph.updateNeighbors(closestNode);
  }

  return null;
}
