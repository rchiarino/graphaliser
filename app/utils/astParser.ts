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

function generateGraph(
  ast: ASTNode,
  graph: Graph,
  startNode: string
): string[] {
  if (ast.children.length === 0) {
    if (ast.nodeType === "SEQ" || ast.nodeType === "PAR") {
      return [startNode];
    }
    graph.addNode(ast.nodeType);
    graph.addEdge(startNode, ast.nodeType);
    return [ast.nodeType];
  }

  if (ast.nodeType === "SEQ") {
    return handleSequentialBlock(ast, graph, startNode);
  } else if (ast.nodeType === "PAR") {
    return handleParallelBlock(ast, graph, startNode);
  }

  return [startNode];
}

function handleSequentialBlock(
  ast: ASTNode,
  graph: Graph,
  startNode: string
): string[] {
  let lastNodes = [startNode];

  for (const child of ast.children) {
    const newLastNodes = [];
    for (const node of lastNodes) {
      const endNodes = generateGraph(child, graph, node);
      newLastNodes.push(...endNodes);
    }
    lastNodes = newLastNodes;
  }

  return lastNodes;
}

function handleParallelBlock(
  ast: ASTNode,
  graph: Graph,
  startNode: string
): string[] {
  const endNodes: string[] = [];

  for (const child of ast.children) {
    const childEndNodes = generateGraph(child, graph, startNode);
    endNodes.push(...childEndNodes);
  }

  return endNodes;
}

export { ASTNode, Graph, generateGraph };
