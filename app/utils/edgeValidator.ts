import { Node, Edge } from "@xyflow/react";
import { getOutgoers } from "@xyflow/react";

function findRootNode(nodes: Node[], edges: Edge[]): Node | undefined {
  return nodes.find((node) => {
    return !edges.some((edge) => edge.target === node.id);
  });
}

export function isValidNewEdge(
  nodes: Node[],
  existingEdges: Edge[],
  newEdge: Edge
): { isValid: boolean; reason?: string } {
  const rootNode = findRootNode(nodes, existingEdges);
  if (!rootNode) {
    return { isValid: false, reason: "No valid root node found" };
  }

  function findPath(
    start: string,
    end: string,
    visited: Set<string> = new Set(),
    path: string[] = []
  ): string[] | null {
    if (start === end) return [...path, start];

    visited.add(start);
    path.push(start);

    const currentNode = nodes.find((n) => n.id === start);
    if (!currentNode) return null;

    const outgoers = getOutgoers(currentNode, nodes, existingEdges);

    for (const outgoer of outgoers) {
      if (!visited.has(outgoer.id)) {
        const result = findPath(outgoer.id, end, visited, path);
        if (result) return result;
      }
    }

    path.pop();
    return null;
  }

  const existingPath = findPath(newEdge.source, newEdge.target);
  if (existingPath) {
    return {
      isValid: false,
      reason: `Edge would create a shortcut. Existing path: ${existingPath.join(
        " -> "
      )}`,
    };
  }

  const pathBackToSource = findPath(newEdge.target, newEdge.source);
  if (pathBackToSource) {
    return {
      isValid: false,
      reason: `Edge would create a cycle: ${[
        newEdge.source,
        ...pathBackToSource,
      ].join(" -> ")}`,
    };
  }

  return { isValid: true };
}
