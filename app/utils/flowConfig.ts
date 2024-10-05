import { Edge, MarkerType, Node } from "@xyflow/react";
const position = { x: 0, y: 0 };

const defaultNodes: Node[] = [
  { id: "A", position, data: { label: "A" } }, // If this is a cobegin the x value is the middle of the childrens
  { id: "B", position, data: { label: "B" } }, // Mantains the same y as the basic
  { id: "C", position, data: { label: "C" } },
  { id: "D", position, data: { label: "D" } }, // same as the first
];

const defaultEdges: Edge[] = [
  { id: "A-B", source: "A", target: "B" },
  { id: "A-C", source: "A", target: "C" },
  { id: "B-D", source: "B", target: "D" },
  { id: "C-D", source: "C", target: "D" },
];

export const defaultGraph = {
  initialNodes: defaultNodes,
  initialEdges: transformEdges(defaultEdges),
};

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
