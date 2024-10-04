"use client";
import React, { useCallback, useState } from "react";
import { useNodesState, useEdgesState, addEdge } from "@xyflow/react";
import { useDebounce, useLocalStorage } from "react-use";

import "@xyflow/react/dist/style.css";
import { Node, Edge } from "@xyflow/react";
import GraphView from "./components/GraphView";
import { FlowViewProps, GraphViewProps } from "./utils/types";
import { defaultGraph } from "./utils/flowConfig";
import EditorView from "./components/EditorView";
import { defaultValue } from "./utils/editorConfig";
import { parseProgram } from "./utils/editorToAST";
import { Graph, generateGraph } from "./utils/astParser";

export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    defaultGraph.initialNodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    defaultGraph.initialEdges
  );

  const [editorVisible, setEditorVisible] = useState(true);

  const [storedEditorValue, setStoredEditorValue] = useLocalStorage(
    "editor.value",
    defaultValue
  );

  const [code, setText] = useState(storedEditorValue!);

  const onConnect = useCallback(
    (params: any) => setEdges((eds: any) => addEdge(params, eds)),
    [setEdges]
  );

  const toggleEditor = () => {
    setEditorVisible((state) => !state);
  };

  const processCode = async () => {
    setStoredEditorValue(code);
    let astOutput = parseProgram(code);
    const graphModel = new Graph();
    generateGraph(astOutput, graphModel, "ROOT");

    // console.log(graphModel.getNodes());
    // console.log(graphModel.getEdges());

    let newNodes: Node[] = [];
    let newEdges: Edge[] = [];

    graphModel.getNodes().forEach((node) => {
      newNodes.push({
        id: node,
        data: { label: node },
        position: { x: 0, y: 0 },
      });
    });

    graphModel.getEdges().forEach((edge) => {
      newEdges.push({
        id: `${edge[0]}-${edge[1]}`,
        source: edge[0],
        target: edge[1],
      });
    });

    setNodes(newNodes);
    console.log(nodes);

    setEdges(newEdges);
    console.log(edges);
  };

  useDebounce(processCode, 1000, [code]);

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
            <EditorView
              value={code}
              onChange={(value) => {
                setText(value!);
              }}
            />
          </div>
        )}
        <div className={editorVisible ? "col-span-2" : "col-span-full"}>
          <GraphView graph={graphConfig} view={flowConfig} />
        </div>
      </section>
    </main>
  );
}
