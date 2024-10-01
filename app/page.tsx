"use client";
import React, { useCallback } from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  Node,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import GraphView from "./components/GraphView";
import { GraphViewProps } from "./utils/types";
import { defaultGraph } from "./utils/flowConfig";

export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    defaultGraph.initialNodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    defaultGraph.initialEdges
  );

  const onConnect = useCallback(
    (params: any) => setEdges((eds: any) => addEdge(params, eds)),
    [setEdges]
  );

  const graphConfig: GraphViewProps = {
    nodes: nodes,
    onNodesChange: onNodesChange,
    edges: edges,
    onEdgesChange: onEdgesChange,
    onConnect: onConnect,
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <GraphView {...graphConfig} />
    </div>
  );
}
