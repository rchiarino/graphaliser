import {
  generateGraph,
  Graph,
  createValueNode,
  createStructureNode,
  NodeType,
} from "../astParser";

test("throws error when creating a value node with a structure node value", () => {
  expect(() => createValueNode(NodeType.SEQ)).toThrow(
    "Node value cannot be a structure node: SEQ"
  );
  expect(() => createValueNode(NodeType.PAR)).toThrow(
    "Node value cannot be a structure node: PAR"
  );
});

test("ignores SEQ statement", () => {
  const ast = createStructureNode(NodeType.SEQ);

  const graph = new Graph();
  const startNode = "Node0";
  graph.addNode(startNode);
  generateGraph(ast, graph, startNode);

  const expectedNodes = new Set(["Node0"]);
  expect(graph.getNodes()).toEqual(expectedNodes);

  const expectedEdges: [string, string][] = [];
  expect(graph.getEdges()).toEqual(expectedEdges);
});

test("ignores PAR statement", () => {
  const ast = createStructureNode(NodeType.PAR);

  const graph = new Graph();
  const startNode = "Node0";
  graph.addNode(startNode);
  generateGraph(ast, graph, startNode);

  const expectedNodes = new Set(["Node0"]);
  expect(graph.getNodes()).toEqual(expectedNodes);

  const expectedEdges: [string, string][] = [];
  expect(graph.getEdges()).toEqual(expectedEdges);
});

test("generates a single node", () => {
  const ast = createValueNode("A");

  const graph = new Graph();
  const startNode = "Node0";
  graph.addNode(startNode);
  generateGraph(ast, graph, startNode);

  const expectedNodes = new Set(["Node0", "A"]);
  expect(graph.getNodes()).toEqual(expectedNodes);

  const expectedEdges = [["Node0", "A"]];
  expect(graph.getEdges()).toEqual(expectedEdges);
});

test("generates a begin end flow", () => {
  const ast = createStructureNode(NodeType.SEQ, [
    createValueNode("A"),
    createValueNode("B"),
  ]);

  const graph = new Graph();
  const startNode = "Node0";
  graph.addNode(startNode);
  generateGraph(ast, graph, startNode);

  const expectedNodes = new Set(["Node0", "A", "B"]);
  expect(graph.getNodes()).toEqual(expectedNodes);

  const expectedEdges = [
    ["Node0", "A"],
    ["A", "B"],
  ];
  expect(graph.getEdges()).toEqual(expectedEdges);
});

test("generates multiple nodes from a begin end flow", () => {
  const ast = createStructureNode(NodeType.SEQ, [
    createValueNode("A"),
    createValueNode("B"),
    createValueNode("C"),
    createValueNode("D"),
  ]);

  const graph = new Graph();
  const startNode = "Node0";
  graph.addNode(startNode);
  generateGraph(ast, graph, startNode);

  const expectedNodes = new Set(["Node0", "A", "B", "C", "D"]);
  expect(graph.getNodes()).toEqual(expectedNodes);

  const expectedEdges = [
    ["Node0", "A"],
    ["A", "B"],
    ["B", "C"],
    ["C", "D"],
  ];
  expect(graph.getEdges()).toEqual(expectedEdges);
});

test("generates a single node from a cobegin coend flow", () => {
  const ast = createStructureNode(NodeType.PAR, [createValueNode("A")]);

  const graph = new Graph();
  const startNode = "Node0";
  graph.addNode(startNode);
  generateGraph(ast, graph, startNode);

  const expectedNodes = new Set(["Node0", "A"]);
  expect(graph.getNodes()).toEqual(expectedNodes);

  const expectedEdges = [["Node0", "A"]];
  expect(graph.getEdges()).toEqual(expectedEdges);
});

test("generates cobegin coend flow", () => {
  const ast = createStructureNode(NodeType.PAR, [
    createValueNode("A"),
    createValueNode("B"),
  ]);

  const graph = new Graph();
  const startNode = "Node0";
  graph.addNode(startNode);
  generateGraph(ast, graph, startNode);

  const expectedNodes = new Set(["Node0", "A", "B"]);
  expect(graph.getNodes()).toEqual(expectedNodes);

  const expectedEdges = [
    ["Node0", "A"],
    ["Node0", "B"],
  ];
  expect(graph.getEdges()).toEqual(expectedEdges);
});

test("generates parallel flow with nested sequential", () => {
  const ast = createStructureNode(NodeType.PAR, [
    createValueNode("A"),
    createStructureNode(NodeType.SEQ, [
      createValueNode("B"),
      createValueNode("C"),
    ]),
  ]);

  const graph = new Graph();
  const startNode = "Node0";
  graph.addNode(startNode);
  generateGraph(ast, graph, startNode);

  const expectedNodes = new Set(["Node0", "A", "B", "C"]);
  expect(graph.getNodes()).toEqual(expectedNodes);

  const expectedEdges = [
    ["Node0", "A"],
    ["Node0", "B"],
    ["B", "C"],
  ];
  expect(graph.getEdges()).toEqual(expectedEdges);
});

test("generates complex nested sequential and parallel flow", () => {
  const ast = createStructureNode(NodeType.SEQ, [
    createValueNode("A"),
    createValueNode("B"),
    createStructureNode(NodeType.PAR, [
      createStructureNode(NodeType.SEQ, [
        createValueNode("C"),
        createValueNode("D"),
      ]),
      createValueNode("E"),
    ]),
    createValueNode("F"),
  ]);

  const graph = new Graph();
  const startNode = "Node0";
  graph.addNode(startNode);
  generateGraph(ast, graph, startNode);

  const expectedNodes = new Set(["Node0", "A", "B", "C", "D", "E", "F"]);
  expect(graph.getNodes()).toEqual(expectedNodes);

  const expectedEdges = [
    ["Node0", "A"],
    ["A", "B"],
    ["B", "C"],
    ["C", "D"],
    ["B", "E"],
    ["D", "F"],
    ["E", "F"],
  ];
  expect(graph.getEdges()).toEqual(expectedEdges);
});

test("generates complex nested parallel and sequential flow", () => {
  const ast = createStructureNode(NodeType.SEQ, [
    createValueNode("A"),
    createValueNode("B"),
    createStructureNode(NodeType.PAR, [
      createStructureNode(NodeType.SEQ, [
        createValueNode("C"),
        createValueNode("D"),
      ]),
      createStructureNode(NodeType.SEQ, [
        createValueNode("E"),
        createValueNode("F"),
      ]),
    ]),
    createValueNode("G"),
  ]);

  const graph = new Graph();
  const startNode = "Node0";
  graph.addNode(startNode);
  generateGraph(ast, graph, startNode);

  const expectedNodes = new Set(["Node0", "A", "B", "C", "D", "E", "F", "G"]);
  expect(graph.getNodes()).toEqual(expectedNodes);

  const expectedEdges = [
    ["Node0", "A"],
    ["A", "B"],
    ["B", "C"],
    ["C", "D"],
    ["B", "E"],
    ["E", "F"],
    ["D", "G"],
    ["F", "G"],
  ];
  expect(graph.getEdges()).toEqual(expectedEdges);
});
