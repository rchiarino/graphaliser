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
  MarkerType,
  FinalConnectionState,
  Edge,
  addEdge,
  Connection,
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
  const flow = {
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

  console.log(flow);

  return elk
    .layout(flow)
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
  const emptyNodes: Node[] = [];
  const emptyEdges: Edge[] = [];
  const [nodes, setNodes, onNodesChange] = useNodesState(emptyNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(emptyEdges);
  const { fitView, screenToFlowPosition } = useReactFlow();

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

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const addNode = useCallback(
    (event: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
      // when a connection is dropped on the pane it's not valid
      if (!connectionState.isValid) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = `${nodes.length + 1}`;
        const { clientX, clientY } =
          "changedTouches" in event ? event.changedTouches[0] : event;
        const newNode: Node = {
          id,
          data: { label: `${id}` },
          width: 50,
          height: 50,
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          origin: [0.5, 0.0],
        };

        const updatedNodes = nodes.concat(newNode);
        const updatedEdges = edges.concat({
          id,
          source: connectionState.fromNode!.id,
          target: id,
          markerEnd: { type: MarkerType.Arrow },
        });

        console.log("re layouting from addNode");
        console.log(updatedNodes, updatedEdges);

        //@ts-expect-error - TODO:Need to implement a encoder for the edges
        getLayoutedElements(updatedNodes, updatedEdges, elkOptions).then(
          // @ts-expect-error layoutedNodes and layoutedEdges are empty if the graph is empty
          ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);

            console.log(layoutedNodes, layoutedEdges);
          }
        );
        window.requestAnimationFrame(() => fitView());
      }
    },
    [screenToFlowPosition, nodes, edges]
  );

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
      onEdgesChange={onEdgesChange}
      snapToGrid={true}
      onConnect={onConnect}
      onConnectEnd={addNode}
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
