"use client";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";

import * as cobeginEndLanguage from "../language/cobegin-end/cobegin-end";
import { useTheme } from "next-themes";
import { CodeError } from "../utils/types";

export interface EditorViewProps {
  value: string;
  onChange: (text?: string) => void;
  errors: CodeError[];
}

function EditorView({ value, onChange, errors }: EditorViewProps) {
  const monaco = useMonaco();
  const theme = useTheme();

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

  useEffect(() => {
    if (!monaco) return;
    const squigglyErrors = errors.map((error) => ({
      message: error.reason,
      startLineNumber: error.row,
      endLineNumber: error.row,
      startColumn: error.startColumn,
      endColumn: error.endColumn + 1,
      severity: monaco.MarkerSeverity.Error,
    }));
    console.log(squigglyErrors);

    const [model] = monaco.editor.getModels();

    monaco.editor.setModelMarkers(model!, "cobegin-end", squigglyErrors);
  }, [monaco, errors]);

  return (
    <Editor
      height="100%"
      language="cobegin-end"
      theme={theme.resolvedTheme === "dark" ? "vs-dark" : "light"}
      value={value}
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        smoothScrolling: true,
        cursorSmoothCaretAnimation: "on",
        scrollBeyondLastLine: false,
      }}
    />
  );
}

export default EditorView;
