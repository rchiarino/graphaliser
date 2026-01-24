import { isValidNewEdge } from "../edgeValidator";
import { Node, Edge, MarkerType } from "@xyflow/react";

describe("isValidNewEdge - N-shape prevention", () => {
  const createNode = (id: string): Node => ({
    id,
    data: { label: id },
    position: { x: 0, y: 0 },
  });

  const createEdge = (source: string, target: string): Edge => ({
    id: `${source}-${target}`,
    source,
    target,
    markerEnd: { type: MarkerType.Arrow },
  });

  test("allows single-input nodes to branch", () => {
    const nodes = [createNode("A"), createNode("B"), createNode("D"), createNode("E")];
    const edges = [
      createEdge("A", "B"),    // A→B (B has 1 incoming)
      createEdge("B", "D")     // B→D (1 outgoing from B)
    ];
    const newEdge = createEdge("B", "E"); // B→E (B has 1 incoming, gets 2 outgoing - allowed)

    const result = isValidNewEdge(nodes, edges, newEdge);
    expect(result.isValid).toBe(true); // Single-input nodes can branch
  });

  test("allows valid parallel convergence to end node", () => {
    const nodes = [createNode("A"), createNode("B"), createNode("End")];
    const edges = [
      createEdge("A", "End"), // A→End exists, End has 0 or 1 outgoing edge
    ];
    const newEdge = createEdge("B", "End"); // B→End (valid convergence)

    const result = isValidNewEdge(nodes, edges, newEdge);
    expect(result.isValid).toBe(true);
  });

  test("allows convergence points with single outgoing", () => {
    // B is a convergence point (2 incoming), can have 1 outgoing
    const nodes = [createNode("A"), createNode("C"), createNode("B"), createNode("D")];
    const edges = [
      createEdge("A", "B"), // A→B
      createEdge("C", "B")  // C→B (B converges A and C)
    ];
    const newEdge = createEdge("B", "D"); // B→D (B has 2 incoming, 1 outgoing - allowed)

    const result = isValidNewEdge(nodes, edges, newEdge);
    expect(result.isValid).toBe(true);
  });

  test("prevents nodes feeding into convergence from branching elsewhere", () => {
    const nodes = [createNode("A"), createNode("B"), createNode("C"), createNode("D"), createNode("E")];
    const edges = [
      createEdge("A", "C"), // A→C
      createEdge("A", "B"), // A→B
      createEdge("C", "D"), // C→D
      createEdge("B", "D")  // B→D (D has 2 incoming - convergence)
    ];
    const newEdge = createEdge("B", "E"); // B→E (B feeds into convergence D, cannot branch to E)

    const result = isValidNewEdge(nodes, edges, newEdge);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe("Invalid concurrent structure.");
    expect(result.reason).toContain("feeds into a convergence point");
  });

  test("allows single-input nodes to branch", () => {
    const nodes = [createNode("A"), createNode("C"), createNode("D"), createNode("E")];
    const edges = [
      createEdge("A", "C"), // A→C (C has 1 incoming)
      createEdge("C", "D")  // C→D (1 outgoing from C)
    ];
    const newEdge = createEdge("C", "E"); // C→E (C has 1 incoming, gets 2 outgoing - should be allowed)

    const result = isValidNewEdge(nodes, edges, newEdge);
    expect(result.isValid).toBe(true); // Single-input nodes can branch
  });


});