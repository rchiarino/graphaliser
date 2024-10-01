import { Edge, MarkerType, Node } from "@xyflow/react";

const defaultNodes: Node[] = [
  { id: "1", position: { x: 100, y: 0 }, data: { label: "A" } }, // If this is a cobegin the x value is the middle of the childrens
  { id: "2", position: { x: 0, y: 100 }, data: { label: "B" } }, // Mantains the same y as the basic
  { id: "3", position: { x: 200, y: 100 }, data: { label: "C" } },
  { id: "4", position: { x: 100, y: 200 }, data: { label: "D" } }, // same as the first
];

const defaultEdges: Edge[] = [
  { id: "1-2", source: "1", target: "2" },
  { id: "1-3", source: "1", target: "3" },
  { id: "2-4", source: "2", target: "4" },
  { id: "3-4", source: "3", target: "4" },
];

export const defaultGraph = {
  initialNodes: transformNodes(defaultNodes),
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

function transformEdges(edges: Edge[]): Edge[] {
  return edges.map((edge) => {
    return {
      ...edge,
      markerEnd: { type: MarkerType.Arrow },
      type: "straight",
    };
  });
}
