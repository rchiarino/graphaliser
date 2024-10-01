"use client";
import React, { useCallback, useState } from "react";
import { useNodesState, useEdgesState, addEdge } from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import GraphView from "./components/GraphView";
import { FlowViewProps, GraphViewProps } from "./utils/types";
import { defaultGraph } from "./utils/flowConfig";
import EditorView from "./components/EditorView";
import { useMonaco } from "@monaco-editor/react";

export default function Home() {
  const monaco = useMonaco();
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
      <section className="w-screen h-screen flex flex-row items-start">
        {editorVisible && (
          <div className="flex w-full h-screen">
            <EditorView value="//Something on js" onChange={() => {}} />
          </div>
        )}
        <GraphView graph={graphConfig} view={flowConfig} />
      </section>
    </main>
  );
}
