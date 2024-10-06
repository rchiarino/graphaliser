import { EditorConfigProps, GraphViewProps } from "../utils/types";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Background,
  Node,
  MarkerType,
  FinalConnectionState,
  Edge,
  addEdge,
  Connection,
} from "@xyflow/react";
import ELK, { ElkExtendedEdge, ElkNode } from "elkjs";

import { Menu } from "./Menu";
import { useTheme } from "next-themes";
import ToggleEditor from "./ToggleEditor";
import NodeContextMenu from "./NodeContextMenu";
import { isValidNewEdge } from "../utils/edgeValidator";
import { toast } from "sonner";

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
  const theme = useTheme();
  const emptyNodes: Node[] = [];
  const emptyEdges: Edge[] = [];
  const [nodes, setNodes, onNodesChange] = useNodesState(emptyNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(emptyEdges);
  const { fitView, screenToFlowPosition } = useReactFlow();
  const [nodeMenu, setNodeMenu] = useState(null);
  const ref = useRef(null);

  const onNodeContextMenu = useCallback(
    (event: MouseEvent, node: Node) => {
      event.preventDefault();

      //@ts-expect-error - workarround needed
      const pane = ref.current?.getBoundingClientRect();

      // translate the position of the context menu if the editor is open or the window is resized
      const widthDiff = window.innerWidth - pane.width;
      const translatedClientX = event.clientX - widthDiff;

      // Calculate position of the context menu. We want to make sure it doesn't get positioned off-screen.
      setNodeMenu({
        // @ts-expect-error - is part of ContextMenuProps
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && translatedClientX,
        right:
          event.clientX >= pane.width - 200 && pane.width - translatedClientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
      });
    },
    [setNodeMenu]
  );

  const onLayout = useCallback(() => {
    const ns = graph.nodes;
    const es = graph.edges;

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
    (params: Connection) => {
      const newEdge = {
        id: `${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
      };

      const { isValid, message, reason } = isValidNewEdge(
        nodes,
        edges,
        newEdge
      );

      if (isValid) {
        setEdges((eds) => addEdge(params, eds));
      } else {
        console.warn(reason);
        toast.warning(message, { description: reason });
      }
    },
    [nodes, edges]
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

        //@ts-expect-error - TODO:Need to implement a encoder for the edges
        getLayoutedElements(updatedNodes, updatedEdges, elkOptions).then(
          // @ts-expect-error layoutedNodes and layoutedEdges are empty if the graph is empty
          ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
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

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setNodeMenu(null), [setNodeMenu]);

  return (
    <ReactFlow
      fitView
      ref={ref}
      colorMode={theme.resolvedTheme === "light" ? "light" : "dark"}
      nodes={nodes}
      edges={edges}
      snapToGrid={true}
      onConnect={onConnect}
      onConnectEnd={addNode}
      onNodesChange={onNodesChange}
      // @ts-expect-error - workarround needed
      onNodeContextMenu={onNodeContextMenu}
      onPaneClick={onPaneClick}
      onPaneContextMenu={(event) => {
        event.preventDefault();
        toast.info("Panel context menu not implemented yet");
      }}
      onEdgesChange={onEdgesChange}
      proOptions={{ hideAttribution: true }}
    >
      <Menu />
      <ToggleEditor isOpen={editor.isShown} onClick={editor.toggleEditor} />
      {
        // @ts-expect-error - the object is not null is a valid value
        nodeMenu && <NodeContextMenu {...nodeMenu} />
      }
      <Background />
    </ReactFlow>
  );
}

export default LayoutFlow;
