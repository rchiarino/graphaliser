"use client";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";

import * as cobeginEndLanguage from "../language/cobegin-end/cobegin-end";
import { useTheme } from "next-themes";

export interface EditorViewProps {
  value: string;
  onChange: (text?: string) => void;
}

function EditorView({ value, onChange }: EditorViewProps) {
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
