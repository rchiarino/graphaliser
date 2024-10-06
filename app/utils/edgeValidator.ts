import { Node, Edge } from "@xyflow/react";
import { getOutgoers } from "@xyflow/react";

function findRootNode(nodes: Node[], edges: Edge[]): Node | undefined {
  return nodes.find((node) => {
    return !edges.some((edge) => edge.target === node.id);
  });
}

function findEndNode(nodes: Node[], edges: Edge[]): Node | undefined {
  return nodes.find((node) => {
    return !edges.some((edge) => edge.source === node.id);
  });
}

function getAllPaths(
  start: Node,
  nodes: Node[],
  edges: Edge[],
  currentPath: string[] = [],
  allPaths: string[][] = [],
  visited: Set<string> = new Set()
) {
  currentPath.push(start.id);
  visited.add(start.id);

  const outgoers = getOutgoers(start, nodes, edges);

  if (outgoers.length === 0) {
    allPaths.push([...currentPath]);
  } else {
    for (const outgoer of outgoers) {
      if (!visited.has(outgoer.id)) {
        getAllPaths(outgoer, nodes, edges, currentPath, allPaths, visited);
      }
    }
  }

  currentPath.pop();
  visited.delete(start.id);
  return allPaths;
}

export function isValidNewEdge(
  nodes: Node[],
  existingEdges: Edge[],
  newEdge: Edge
): { isValid: boolean; message?: string; reason?: string } {
  const rootNode = findRootNode(nodes, existingEdges);
  if (!rootNode) {
    return { isValid: false, message: "No valid root node found" };
  }

  const endNode = findEndNode(nodes, existingEdges);
  const tempEdges = [...existingEdges, newEdge];

  // Basic cycle detection
  function findPath(
    start: string,
    end: string,
    edges: Edge[],
    visited: Set<string> = new Set(),
    path: string[] = []
  ): string[] | null {
    if (start === end) return [...path, start];

    visited.add(start);
    path.push(start);

    const currentNode = nodes.find((n) => n.id === start);
    if (!currentNode) return null;

    const outgoers = getOutgoers(currentNode, nodes, edges);

    for (const outgoer of outgoers) {
      if (!visited.has(outgoer.id)) {
        const result = findPath(outgoer.id, end, edges, visited, path);
        if (result) return result;
      }
    }

    path.pop();
    return null;
  }

  // Check for cycles
  const pathBackToSource = findPath(newEdge.target, newEdge.source, tempEdges);
  if (pathBackToSource) {
    return {
      isValid: false,
      message: "Edge would create a cycle.",
      reason: `${[newEdge.source, ...pathBackToSource].join(" -> ")}`,
    };
  }

  // Get all nodes that are part of the COBEGIN/COEND structure
  const allPaths = rootNode ? getAllPaths(rootNode, nodes, existingEdges) : [];
  const allNodesInStructure = new Set(allPaths.flat());

  // If the target is not the current end node and not in the structure, it's invalid
  if (
    endNode &&
    newEdge.target !== endNode.id &&
    !allNodesInStructure.has(newEdge.target)
  ) {
    return {
      isValid: false,
      message: "Edge creates a diverging path.",
      reason: `All paths must converge to node ${endNode.id}.`,
    };
  }

  // Check if source has other outgoing edges to a different target
  const sourceOutgoers = getOutgoers(
    nodes.find((n) => n.id === newEdge.source)!,
    nodes,
    existingEdges
  );

  const hasOtherEndTarget = sourceOutgoers.some(
    (outgoer) => outgoer.id !== newEdge.target && outgoer.id !== endNode?.id
  );

  if (hasOtherEndTarget) {
    return {
      isValid: false,
      message: "Source node already has a different target.",
      reason: `Node ${newEdge.source} already connects to a different end point.`,
    };
  }

  return { isValid: true };
}
