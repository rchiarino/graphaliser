import { generateGraph, Graph, ASTNode } from "./astParser";

test("generates a begin end flow", () => {
  const ast = new ASTNode("SEQ", [new ASTNode("A"), new ASTNode("B")]);

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
  const ast = new ASTNode("SEQ", [
    new ASTNode("A"),
    new ASTNode("B"),
    new ASTNode("C"),
    new ASTNode("D"),
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

test("generates cobegin coend flow", () => {
  const ast = new ASTNode("PAR", [new ASTNode("A"), new ASTNode("B")]);

  const graph = new Graph();
  const startNode = "Node0";
  graph.addNode(startNode);
  generateGraph(ast, graph, startNode);

  console.log(graph.getNodes());
  console.log(graph.getEdges());

  const expectedNodes = new Set(["Node0", "A", "B"]);
  expect(graph.getNodes()).toEqual(expectedNodes);

  const expectedEdges = [
    ["Node0", "A"],
    ["Node0", "B"],
  ];
  expect(graph.getEdges()).toEqual(expectedEdges);
});
