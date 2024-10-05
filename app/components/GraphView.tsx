import { EditorConfigProps, GraphViewProps } from "../utils/types";
import React, { useCallback, useEffect, useLayoutEffect } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ControlButton,
  Controls,
  Background,
  Node,
} from "@xyflow/react";
import ELK, { ElkExtendedEdge, ElkNode } from "elkjs";

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
    .then((layoutedGraph) => ({
      nodes:
        layoutedGraph.children?.map((node: ElkNode) => ({
          ...node,
          position: { x: node.x, y: node.y },
        })) ?? [],

      edges: layoutedGraph.edges,
    }))
    .catch(console.error);
};

function LayoutFlow({
  graph,
  editor,
}: {
  graph: GraphViewProps;
  editor: EditorConfigProps;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const onLayout = useCallback(() => {
    const ns = graph.nodes;
    const es = graph.edges;
    console.log("re layouting");

    //@ts-expect-error - TODO:Need to implement a encoder for the edges
    getLayoutedElements(ns, es, elkOptions).then(
      // @ts-expect-error layoutedNodes and layoutedEdges are empty if the graph is empty
      ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);

        window.requestAnimationFrame(() => fitView());
      }
    );
  }, []);

  useLayoutEffect(() => {
    onLayout();
  }, []);

  //Re-layout when the graph changes
  useEffect(() => {
    //@ts-expect-error - TODO:Need to implement a encoder for the edges
    getLayoutedElements(graph.nodes, graph.edges, elkOptions).then(
      // @ts-expect-error layoutedNodes and layoutedEdges are empty if the graph is empty
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
      onNodesChange={onNodesChange}
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
          title={editor.isShown ? "Hide Editor" : "Show Editor"}
          onClick={editor.toggleEditor}
        >
          {editor.isShown ? (
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
