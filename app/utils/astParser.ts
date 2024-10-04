class ASTNode {
  nodeType: string;
  children: ASTNode[];
  constructor(nodeType: string, children: ASTNode[] = []) {
    this.nodeType = nodeType;
    this.children = children;
  }
  addChild(child: ASTNode): void {
    this.children.push(child);
  }
}

class Graph {
  nodes: Set<string>;
  edges: [string, string][];
  constructor() {
    this.nodes = new Set();
    this.edges = [];
  }
  addNode(node: string) {
    this.nodes.add(node);
  }
  addEdge(from: string, to: string) {
    this.edges.push([from, to]);
  }
  getNodes() {
    return this.nodes;
  }
  getEdges() {
    return this.edges;
  }
}

function generateGraph(ast: ASTNode, graph: Graph, startNode: string): string {
  if (ast.nodeType === "SEQ") {
    return handleSequentialBlock(ast, graph, startNode);
  } else if (ast.nodeType === "PAR") {
    return handleParallelBlock(ast, graph, startNode);
  } else {
    // Leaf node
    graph.addNode(ast.nodeType);
    graph.addEdge(startNode, ast.nodeType);
    return ast.nodeType;
  }
}

function handleSequentialBlock(ast: ASTNode, graph: Graph, startNode: string): string {
  let currentNode = startNode;
  for (const child of ast.children) {
    currentNode = generateGraph(child, graph, currentNode);
  }
  return currentNode;
}

function handleParallelBlock(ast: ASTNode, graph: Graph, startNode: string): string {
  const endNodes: string[] = [];
  for (const child of ast.children) {
    const endNode = generateGraph(child, graph, startNode);
    endNodes.push(endNode);
  }
  // For simplicity, we're returning the first end node
  // In a more complex implementation, you might want to create a join node
  return endNodes[0] || startNode;
}

export { ASTNode, Graph, generateGraph };