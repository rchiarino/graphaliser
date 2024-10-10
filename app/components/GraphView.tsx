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
import { useLocalStorage } from "react-use";

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
  const [reRenderEnabled, setReRenderEnabled] = useLocalStorage(
    "graph.reRender",
    false
  );
  const { fitView, screenToFlowPosition } = useReactFlow();
  const [nodeMenu, setNodeMenu] = useState(null);
  const ref = useRef(null);

  const reRender = useCallback(
    (nodes: Node[], edges: Edge[]) => {
      //@ts-expect-error - TODO:Need to implement a encoder for the edges
      getLayoutedElements(nodes, edges, elkOptions).then(
        // @ts-expect-error layoutedNodes and layoutedEdges are empty if the graph is empty
        ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);

          window.requestAnimationFrame(() => fitView());
        }
      );
    },
    [setNodes, setEdges, fitView]
  );

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
        node: graph.nodes.find((n) => n.id === node.id),
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && translatedClientX,
        right:
          event.clientX >= pane.width - 200 && pane.width - translatedClientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
      });
    },
    [setNodeMenu, graph]
  );

  const onLayout = useCallback(() => {
    const ns = graph.nodes;
    const es = graph.edges;
    reRender(ns, es);
  }, [reRender, graph]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        id: `${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
        markerEnd: { type: MarkerType.Arrow },
      };

      const { isValid, message, reason } = isValidNewEdge(
        nodes,
        edges,
        newEdge
      );

      if (isValid) {
        setEdges((eds) => addEdge(newEdge, eds));
      } else {
        console.warn(reason);
        toast.warning(message, { description: reason });
      }
    },
    [nodes, edges]
  );

  const addNode = useCallback(
    (event: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
      if (!connectionState.isValid) {
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

        if (reRenderEnabled) {
          reRender(updatedNodes, updatedEdges);
        } else {
          setNodes(updatedNodes);
          setEdges(updatedEdges);
        }
      }
    },
    [screenToFlowPosition, nodes, edges, reRender, reRenderEnabled]
  );

  useLayoutEffect(() => {
    onLayout();
  }, []);

  //Re-layout when the graph changes
  useEffect(() => {
    reRender(graph.nodes, graph.edges);
  }, [graph, reRender]);

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
      onEdgeContextMenu={(event) => {
        event.preventDefault();
      }}
      nodesFocusable={false}
      edgesFocusable={false}
      proOptions={{ hideAttribution: true }}
    >
      <Menu
        reRender={reRenderEnabled ?? false}
        setReRender={setReRenderEnabled}
      />
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
