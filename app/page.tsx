"use client";
import React, { useCallback, useState } from "react";
import { useNodesState, useEdgesState, addEdge } from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import GraphView from "./components/GraphView";
import { FlowViewProps, GraphViewProps } from "./utils/types";
import { defaultGraph } from "./utils/flowConfig";
import EditorView from "./components/EditorView";
import { defaultValue } from "./utils/editorConfig";

export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    defaultGraph.initialNodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    defaultGraph.initialEdges
  );

  const [editorVisible, setEditorVisible] = useState(true);

  const onConnect = useCallback(
    (params: any) => setEdges((eds: any) => addEdge(params, eds)),
    [setEdges]
  );

  const toggleEditor = () => {
    setEditorVisible((state) => !state);
  };

  const graphConfig: GraphViewProps = {
    nodes: nodes,
    onNodesChange: onNodesChange,
    edges: edges,
    onEdgesChange: onEdgesChange,
    onConnect: onConnect,
  };

  const flowConfig: FlowViewProps = {
    toggleEditor: toggleEditor,
    isShown: editorVisible,
  };

  return (
    <main>
      <section className="w-screen h-screen grid grid-cols-3">
        {editorVisible && (
          <div className="h-screen bg-[#141414]">
            <EditorView value={defaultValue} onChange={() => {}} />
          </div>
        )}
        <div className={editorVisible ? "col-span-2" : "col-span-full"}>
          <GraphView graph={graphConfig} view={flowConfig} />
        </div>
      </section>
    </main>
  );
}
