"use client";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";

import * as cobeginEndLanguage from "../language/cobegin-end/cobegin-end";

export interface EditorViewProps {
  value: string;
  onChange: (text?: string) => void;
}

function EditorView({ value, onChange }: EditorViewProps) {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.languages.register({ id: "cobegin-end" });
      monaco.languages.setLanguageConfiguration(
        "cobegin-end",
        cobeginEndLanguage.configuration
      );
      monaco.languages.setMonarchTokensProvider(
        "cobegin-end",
        cobeginEndLanguage.language
      );
    }
  }, [monaco]);

  return (
    <Editor
      height="100%"
      language="cobegin-end"
      theme="vs-dark"
      value={value}
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        smoothScrolling: true,
        cursorSmoothCaretAnimation: "on",
        scrollBeyondLastLine: true,
      }}
    />
  );
}

export default EditorView;
