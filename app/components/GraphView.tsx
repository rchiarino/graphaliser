import { FlowViewProps, GraphViewProps } from "../utils/types";
import React, { useCallback, useLayoutEffect } from 'react';
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
} from '@xyflow/react';
import ELK  from 'elkjs';


const elk = new ELK();

const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': '80',
  'elk.spacing.nodeNode': '30',
  'org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
};

const getLayoutedElements = (nodes:Node[], edges:Edge[], options = {}) => {
  const graph = {
    id: 'root',
    layoutOptions: options,
    children: nodes.map((node:Node) => ({
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      targetPosition: 'top',
      sourcePosition: 'bottom',

      // Hardcode a width and height for elk to use when layouting.
      width: 50,
      height: 50,
    })),
    edges: edges,
  };

  return elk
    .layout(graph)
    .then((layoutedGraph:any) => ({
      nodes: layoutedGraph.children.map((node:Node) => ({
        ...node,
        // React Flow expects a position property on the node instead of `x`
        // and `y` fields.
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
  const [nodes, setNodes, onNodesChange] = useNodesState(graph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graph.edges);
  const { fitView } = useReactFlow();

  const onConnect = useCallback(
    (params:any) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onLayout = useCallback(
    ({ direction, useInitialNodes = false }) => {
      const opts = { 'elk.direction': direction, ...elkOptions };
      const ns = useInitialNodes ? graph.nodes : nodes;
      const es = useInitialNodes ? graph.edges : edges;

      getLayoutedElements(ns, es, opts).then(
        ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);

          window.requestAnimationFrame(() => fitView());
        },
      );
    },
    [nodes, edges],
  );


  // Calculate the initial layout on mount.
  useLayoutEffect(() => {
    onLayout({ direction: 'DOWN', useInitialNodes: true });
  }, []);

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


export default LayoutFlow
