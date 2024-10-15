enum NodeType {
  SEQ = "SEQ",
  PAR = "PAR",
  VALUE = "VALUE",
}

type ValueNode = {
  type: NodeType.VALUE;
  value: string;
};

type StructureNode = {
  type: NodeType.SEQ | NodeType.PAR;
  children: ASTNode[];
};

type ASTNode = ValueNode | StructureNode;

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

function createValueNode(value: string): ValueNode {
  if (value === NodeType.SEQ || value === NodeType.PAR)
    throw new Error(`Node value cannot be a structure node: ${value}`);
  return { type: NodeType.VALUE, value };
}

function createStructureNode(
  type: NodeType.SEQ | NodeType.PAR,
  children: ASTNode[] = []
): StructureNode {
  return { type, children };
}

function generateGraph(
  ast: ASTNode,
  graph: Graph,
  startNode: string
): string[] {
  switch (ast.type) {
    case NodeType.SEQ:
      return handleSequentialBlock(ast, graph, startNode);
    case NodeType.PAR:
      return handleParallelBlock(ast, graph, startNode);
    case NodeType.VALUE:
      graph.addNode(ast.value);
      graph.addEdge(startNode, ast.value);
      return [ast.value];
    default:
      throw new Error(`Unexpected node type`);
  }
}

function handleSequentialBlock(
  ast: StructureNode,
  graph: Graph,
  startNode: string
): string[] {
  if (ast.children.length === 0) return [startNode];

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
  ast: StructureNode,
  graph: Graph,
  startNode: string
): string[] {
  if (ast.children.length === 0) return [startNode];

  const endNodes: string[] = [];

  for (const child of ast.children) {
    const childEndNodes = generateGraph(child, graph, startNode);
    endNodes.push(...childEndNodes);
  }

  return endNodes;
}

function generateCodeFromAST(ast: ASTNode, indent: string = ""): string {
  switch (ast.type) {
    case NodeType.VALUE:
      return `${indent}${ast.value}`;
    case NodeType.SEQ:
      if (ast.children.length === 1) {
        return generateCodeFromAST(ast.children[0], indent);
      }
      return `${indent}BEGIN\n${ast.children
        .map((child) => generateCodeFromAST(child, indent + "    "))
        .join("\n")}\n${indent}END`;
    case NodeType.PAR:
      if (ast.children.length === 1) {
        return generateCodeFromAST(ast.children[0], indent);
      }
      return `${indent}COBEGIN\n${ast.children
        .map((child) => generateCodeFromAST(child, indent + "       "))
        .join("\n")}\n${indent}COEND`;
    default:
      throw new Error(`Unexpected node type: ${ast}`);
  }
}

export {
  NodeType,
  type ASTNode,
  type ValueNode,
  type StructureNode,
  Graph,
  generateGraph,
  generateCodeFromAST,
  createValueNode,
  createStructureNode,
};
