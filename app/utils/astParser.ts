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
      // Handle parallel blocks
      const parallelEnds: string[] = [];

      // Process each branch of the parallel block
      for (const parallelBranch of child.children) {
        const branchStartNode = parallelBranch.nodeType; // Use the node value directly
        graph.addNode(branchStartNode);
        graph.addEdge(previousNode, branchStartNode); // Connect to the previous node

        // Recursively process the branch to get the end node
        const branchEnd = generateGraph(parallelBranch, graph, branchStartNode);
        parallelEnds.push(branchEnd);
      }

      // If there is a next sequential node, connect the end of each parallel branch to it
      const nextSequentialNode =
        ast.children[ast.children.indexOf(child) + 1]?.nodeType || null;

      if (nextSequentialNode) {
        parallelEnds.forEach((parallelEnd) => {
          graph.addEdge(parallelEnd, nextSequentialNode); // Connect each parallel end to the next node
        });
      }

      // Update previousNode to the last processed parallel branch
      previousNode = parallelEnds[0]; // Use the first parallel end for the next iteration
    } else if (child.nodeType === "SEQ") {
      // Sequential block: process it recursively
      previousNode = generateGraph(child, graph, previousNode);
    } else {
      // Leaf nodes (actual instructions)
      const currentNode = child.nodeType; // Use the node value directly
      graph.addNode(currentNode);
      graph.addEdge(previousNode, currentNode); // Connect to previous node
      previousNode = currentNode; // Update previous node
    }
  }

  return previousNode; // Return the last processed node
}

export { ASTNode, Graph, generateGraph };
