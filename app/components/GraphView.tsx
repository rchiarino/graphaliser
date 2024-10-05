import { FlowViewProps, GraphViewProps } from "../utils/types";
import React, { use, useCallback, useEffect, useLayoutEffect } from "react";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ControlButton,
  Controls,
  Background,
  Node,
  Edge,
} from "@xyflow/react";
import ELK, { ElkExtendedEdge } from "elkjs";

import { defaultGraph as DG } from "../utils/flowConfig";

const elk = new ELK();

const elkOptions = {
  "elk.direction": "DOWN",
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "30",
  "elk.spacing.nodeNode": "30",
  "org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED",
};

const getLayoutedElements = (
  nodes: Node[],
  edges: ElkExtendedEdge[],
  options = {}
) => {
  const graph = {
    id: "root",
    layoutOptions: options,
    children: nodes.map((node: Node) => ({
      ...node,
      targetPosition: "top",
      sourcePosition: "bottom",
      width: 50,
      height: 50,
    })),
    edges: edges,
  };

  return elk
    .layout(graph)
    .then((layoutedGraph: any) => ({
      nodes: layoutedGraph.children.map((node: Node) => ({
        ...node,
        position: { x: node.x, y: node.y },
      })),

      edges: layoutedGraph.edges,
    }))
    .catch(console.error);
};

function LayoutFlow({
  graph,
  view,
}: {
  graph: GraphViewProps;
  view: FlowViewProps;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(DG.initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(DG.initialEdges);
  const { fitView } = useReactFlow();

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onLayout = useCallback(() => {
    const ns = graph.nodes;
    const es = graph.edges;
    console.log("re layouting");

    getLayoutedElements(ns, es, elkOptions).then(
      ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);

        window.requestAnimationFrame(() => fitView());
      }
    );
  }, [nodes, edges]);

  useLayoutEffect(() => {
    onLayout();
  }, []);

  //Re-layout when the graph changes
  useEffect(() => {
    getLayoutedElements(graph.nodes, graph.edges, elkOptions).then(
      ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      }
    );
    window.requestAnimationFrame(() => fitView());
  }, [graph]);

  return (
    <ReactFlow
      colorMode="dark"
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Background />
      <Controls />

      <Controls
        className="relative"
        position="top-left"
        showZoom={false}
        showFitView={false}
        showInteractive={false}
      >
        <ControlButton
          title={view.isShown ? "Hide Editor" : "Show Editor"}
          onClick={view.toggleEditor}
        >
          {view.isShown ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={4}
              stroke="currentColor"
              className="size-6 !fill-none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={4}
              stroke="currentColor"
              className="size-6 !fill-none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          )}
        </ControlButton>
      </Controls>
    </ReactFlow>
  );
}

export default LayoutFlow;
