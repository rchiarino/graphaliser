import { Node, Edge } from "@xyflow/react";
import { getOutgoers } from "@xyflow/react";



export function isValidNewEdge(
  nodes: Node[],
  existingEdges: Edge[],
  newEdge: Edge
): { isValid: boolean; message?: string; reason?: string } {
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

  // Prevent N-shape: nodes feeding into convergence points cannot branch elsewhere
  const sourceOutgoingEdgesInTemp = tempEdges.filter((edge) => edge.source === newEdge.source);

  // Check if source feeds into any convergence point (node with 2+ incoming in temp)
  const feedsIntoConvergencePoint = sourceOutgoingEdgesInTemp.some(outgoing => {
    const targetIncoming = tempEdges.filter(edge => edge.target === outgoing.target);
    return targetIncoming.length >= 2;
  });

  if (feedsIntoConvergencePoint && sourceOutgoingEdgesInTemp.length > 1) {
    return {
      isValid: false,
      message: "Invalid concurrent structure.",
      reason: `Node ${newEdge.source} feeds into a convergence point and cannot branch to multiple successors.`,
    };
  }

  // Skip structural validation for interactive editing
  // Focus on preventing invalid concurrent programming constructs

  // Removed: Check if source has other outgoing edges to a different target
  // This was blocking valid parallel branching during UI construction

  return { isValid: true };
}
