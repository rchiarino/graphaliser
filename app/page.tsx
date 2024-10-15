"use client";
import "@xyflow/react/dist/style.css";
import React, { useState } from "react";
import { useNodesState, useEdgesState, ReactFlowProvider } from "@xyflow/react";
import { useDebounce, useLocalStorage } from "react-use";
import { Node, Edge } from "@xyflow/react";
import { CodeError, EditorConfigProps, GraphViewProps } from "./utils/types";
import { defaultGraph, transformEdges } from "./utils/flowConfig";
import EditorView from "./components/EditorView";
import { defaultValue } from "./utils/editorConfig";
import { ParserError, parseProgram } from "./utils/editorToAST";
import { Graph, generateGraph } from "./utils/astParser";
import LayoutFlow from "./components/GraphView";
import { Toaster } from "sonner";
import { useTheme } from "next-themes";
import BetaAlert from "./components/BetaAlert";
import EditorControls from "./components/EditorControls";

export default function Home() {
  const [nodes, setNodes] = useNodesState(defaultGraph.initialNodes);
  const [edges, setEdges] = useEdgesState(defaultGraph.initialEdges);

  const [editorVisible, setEditorVisible] = useState(true);

  const [storedEditorValue, setStoredEditorValue] = useLocalStorage(
    "editor.value",
    defaultValue
  );

  const [codeErrors, setCodeErrors] = useState<CodeError[]>([]);

  const [code, setText] = useState(storedEditorValue!);

  const toggleEditor = async () => {
    setEditorVisible((state) => !state);
  };

  //TODO: Refactor this code
  const processCode = async () => {
    try {
      const astOutput = parseProgram(code);
      setCodeErrors([]);
      setStoredEditorValue(code);
      const graphModel = new Graph();
      generateGraph(astOutput, graphModel, "ROOT");

      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];

      const noDuplicatedEdges = graphModel
        .getEdges()
        .filter(
          (edge, index, self) =>
            index ===
            self.findIndex((t) => t[0] === edge[0] && t[1] === edge[1])
        );

      graphModel.getNodes().forEach((node) => {
        newNodes.push({
          id: node,
          data: { label: node },
          position: { x: 0, y: 0 },
        });
      });

      noDuplicatedEdges.forEach((edge) => {
        newEdges.push({
          id: `${edge[0]}-${edge[1]}`,
          source: edge[0],
          target: edge[1],
        });
      });

      setNodes(newNodes);
      setEdges(transformEdges(newEdges));
    } catch (error) {
      if (error instanceof ParserError) {
        const { line, message, startColumn, endColumn } = error;
        setCodeErrors([{ row: line, reason: message, startColumn, endColumn }]);
      } else {
        console.error(error);
      }
    }
  };

  useDebounce(processCode, 1000, [code]);

  const graphConfig: GraphViewProps = {
    nodes: nodes,
    edges: edges,
  };

  const EditorConfig: EditorConfigProps = {
    toggleEditor: toggleEditor,
    isShown: editorVisible,
  };

  const theme = useTheme();

  return (
    <main>
      <section className="w-screen h-screen grid grid-cols-3">
        {editorVisible && (
          <div className="h-screen bg-[#141414]">
            <EditorView
              value={code}
              errors={codeErrors}
              onChange={(value) => {
                setText(value!);
              }}
            />
            <EditorControls
              code={code}
              defaultCode={defaultValue}
              setStoredEditorValue={setText}
            />
          </div>
        )}
        <div className={editorVisible ? "col-span-2" : "col-span-full"}>
          <ReactFlowProvider>
            <LayoutFlow setCurrentCode={setText} currentCode={code} graph={graphConfig} editor={EditorConfig} />
          </ReactFlowProvider>
        </div>
      </section>
      <Toaster theme={theme.resolvedTheme === "light" ? "light" : "dark"} />
      <BetaAlert />
    </main>
  );
}
