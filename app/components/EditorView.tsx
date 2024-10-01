"use client";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";

export interface EditorViewProps {
  value: string;
  onChange: (text?: string) => void;
}

function EditorView({ value, onChange }: EditorViewProps) {
  const monaco = useMonaco();

  useEffect(() => {}, [monaco]);

  return (
    <Editor
      height="100%"
      language="javascript"
      theme="vs-dark"
      value={value}
      onChange={onChange}
    />
  );
}

export default EditorView;
