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

function generateGraph(ast: ASTNode, graph: Graph, startNode: string): string[] {
  if (ast.nodeType === "SEQ") {
    return handleSequentialBlock(ast, graph, startNode);
  } else if (ast.nodeType === "PAR") {
    return handleParallelBlock(ast, graph, startNode);
  } else {
    // Leaf node
    graph.addNode(ast.nodeType);
    graph.addEdge(startNode, ast.nodeType);
    return [ast.nodeType];
  }
}

function handleSequentialBlock(ast: ASTNode, graph: Graph, startNode: string): string[] {
  let currentNodes = [startNode];
  
  for (const child of ast.children) {
    const endNodes = generateGraph(child, graph, currentNodes[0]);
    currentNodes = endNodes;
  }
  
  return currentNodes;
}

function handleParallelBlock(ast: ASTNode, graph: Graph, startNode: string): string[] {
  let endNodes: string[] = [];
  
  for (const child of ast.children) {
    const childEndNodes = generateGraph(child, graph, startNode);
    endNodes = endNodes.concat(childEndNodes);
  }
  
  return endNodes;
}

export { ASTNode, Graph, generateGraph };