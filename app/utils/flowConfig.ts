import { Edge, MarkerType, Node } from "@xyflow/react";
const position = { x: 0, y: 0 };

const defaultNodes: Node[] = [
  { id: "1", position, data: { label: "A" } }, // If this is a cobegin the x value is the middle of the childrens
  { id: "2", position, data: { label: "B" } }, // Mantains the same y as the basic
  { id: "3", position, data: { label: "C" } },
  { id: "4", position, data: { label: "X" } },
  { id: "5", position, data: { label: "Y" } },
  { id: "6", position, data: { label: "Z" } },
  { id: "7", position, data: { label: "D" } }, // same as the first
];

const defaultEdges: Edge[] = [
  { id: "1-2", source: "1", target: "2" },
  { id: "1-3", source: "1", target: "3" },
  { id: "2-4", source: "2", target: "4" },
  { id: "4-5", source: "4", target: "5" },
  { id: "5-6", source: "5", target: "6" },
  { id: "6-7", source: "6", target: "7" },
  { id: "3-7", source: "3", target: "7" },
];

export const defaultGraph = {
  initialNodes: defaultNodes,
  initialEdges: transformEdges(defaultEdges),
};

function transformNodes(nodes: Node[]): Node[] {
  return nodes.map((node) => {
    if (nodes.indexOf(node) === 0) {
      return {
        ...node,
        type: "input",
      };
    }
    if (nodes.indexOf(node) === nodes.length - 1) {
      return {
        ...node,
        type: "output",
      };
    }
    return { ...node };
  });
}

function removeRootEdges(edges: Edge[]): Edge[] {
  return edges.filter((edge) => edge.source !== "ROOT");
}

export function transformEdges(edges: Edge[]): Edge[] {
  return removeRootEdges(edges).map((edge) => {
    return {
      ...edge,
      markerEnd: { type: MarkerType.Arrow },
      //   type: "straight",
    };
  });
}
