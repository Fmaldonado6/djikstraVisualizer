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

function djikstra(graph, firstNode, targetNode) {
  if (!graph || !firstNode || !targetNode) return null;

  const newGraph = copyGraph(graph);
  const newFirstNode = newGraph.getNode(firstNode.x, firstNode.y);
  const newTargetNode = newGraph.getNode(targetNode.x, targetNode.y);

  newFirstNode.distance = 0;

  let queue = newGraph.getAllNodes();
  const visitedNodesInOrder = [];

  while (queue.length > 0) {
    queue = sortQueue(queue);

    const closestNode = queue.shift();

    if (closestNode.isWall) continue;

    if (closestNode.distance == Infinity) return visitedNodesInOrder;

    closestNode.visited = true;

    visitedNodesInOrder.push(closestNode);

    if (closestNode.id == newTargetNode.id) return visitedNodesInOrder;

    newGraph.updateNeighbors(closestNode);
  }

  return null;
}
