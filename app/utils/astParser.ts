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
    nodes: Set<string>;  // Set of unique nodes (statements)
    edges: [string, string][];  // Array of edges, each being a pair of connected nodes

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
}

// Helper function to generate a unique node ID
let nodeId = 0;
function generateNodeId() {
    return `Node${nodeId++}`;
}

/**
 * Traverse the AST and generate the graph.
 * 
 * @param ast The AST representing the program structure.
 * @param graph The graph to which nodes and edges are added.
 * @param startNode The starting node of the current block.
 * @returns The last node of the current block.
 */
function generateGraph(ast: ASTNode, graph: Graph, startNode: string): string {
    let previousNode = startNode;

    for (const child of ast.children) {
        if (child.nodeType === "PAR") {
            // Handle parallel block
            const startParallel = previousNode;

            // Create a placeholder for the end of the parallel branches
            let parallelEnds: string[] = [];

            for (const parallelBranch of child.children) {
                const branchEnd = generateGraph(parallelBranch, graph, startParallel);
                parallelEnds.push(branchEnd);
            }
            // console.log();
            
            // Find the last node in parallel and connect it to the next part of the sequence
            // const convergenceNode = child.children[child.children.length - 1].nodeType;
            const convergenceNode = generateNodeId();
            graph.addNode(convergenceNode);

            // Connect all parallel ends to this convergence node
            for (const parallelEnd of parallelEnds) {
                graph.addEdge(parallelEnd, convergenceNode);
            }

            previousNode = convergenceNode;
        } else if (child.nodeType === "SEQ") {
            // Sequential block: Connect nodes one after another
            const startSeq = previousNode;
            const endSeq = generateGraph(child, graph, startSeq);
            previousNode = endSeq;
        } else {
            // Leaf node (actual instruction, e.g., A, B, etc.)
            const currentNode = child.nodeType;
            graph.addNode(currentNode);  // Ensure the node is added to the set
            graph.addEdge(previousNode, currentNode);  // Create the edge
            previousNode = currentNode;
        }
    }

    return previousNode;
}

// Example AST from pseudocode
const ast = new ASTNode("SEQ", [
    new ASTNode("A"),
    new ASTNode("PAR", [
        new ASTNode("B"),
        new ASTNode("D")
    ]),
    new ASTNode("F")
]);

// Create the graph and generate the graph structure from the AST
export const graph = new Graph();
const startNode = generateNodeId();
graph.addNode(startNode);
generateGraph(ast, graph, startNode);

// Display the generated graph
graph.display();
