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
  nodes: Set<string>; // Set of unique nodes (statements)
  edges: [string, string][]; // Array of edges, each being a pair of connected nodes

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

  display() {
    console.log("Nodes:");
    console.log(this.nodes);
    console.log("Edges:");
    console.log(this.edges);
  }

  getNodes() {
    return this.nodes;
  }

  getEdges() {
    return this.edges;
  }
}

function generateGraph(ast: ASTNode, graph: Graph, startNode: string): string {
  let previousNode = startNode;

  for (const child of ast.children) {
    if (child.nodeType === "PAR") {
      // Handle the parallel block and return the last nodes of each parallel branch
      const parallelEnds = handleParallelBlock(child, graph, previousNode);

      // Update the previousNode to handle sequential flow after the parallel block
      previousNode = parallelEnds.length > 0 ? parallelEnds[0] : previousNode;
    } else {
      // Sequential block or leaf node
      const currentNode = child.nodeType;
      graph.addNode(currentNode);
      graph.addEdge(previousNode, currentNode);
      previousNode = currentNode;
    }
  }

  return previousNode;
}

function handleParallelBlock(
  parNode: ASTNode,
  graph: Graph,
  previousNode: string
): string[] {
  const parallelEnds: string[] = [];

  for (const parallelBranch of parNode.children) {
    const branchStartNode = parallelBranch.nodeType;
    graph.addNode(branchStartNode);
    graph.addEdge(previousNode, branchStartNode); // Connect each branch to the previousNode (Node0)

    // Process the parallel branch and get its end node
    const branchEnd = generateGraph(parallelBranch, graph, branchStartNode);
    parallelEnds.push(branchEnd);
  }

  return parallelEnds; // Return all the parallel end nodes
}




export { ASTNode, Graph, generateGraph };
