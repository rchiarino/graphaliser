"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Check, Copy, RotateCcw, TextQuote } from "lucide-react";
import { parseProgram } from "../utils/editorToAST";
import { generateCodeFromAST } from "../utils/astParser";

function EditorControls({
  code,
  defaultCode,
  setCode,
  setStoredEditorValue,
}: {
  code: string;
  defaultCode: string;
  setCode: (value: string) => void;
  setStoredEditorValue: (value: string) => void;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code to clipboard", error);
    }
  };

  const handleFormatCode = () => {
    setCode(generateCodeFromAST(parseProgram(code)));
  };

  return (
    <div className="absolute bottom-4 flex justify-center items-center w-1/3">
      <Button
        variant="outline"
        className="mr-4 transition-all duration-300 ease-in-out"
        onClick={handleFormatCode}
      >
        <TextQuote className="mr-2 h-4 w-4" />
        Format
      </Button>
      <Button
        onClick={handleCopyCode}
        variant="outline"
        className="mr-4 transition-all duration-300 ease-in-out"
      >
        {isCopied ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </>
        )}
      </Button>
      <Button
        variant="outline"
        className="mr-4"
        onClick={() => {
          setStoredEditorValue(defaultCode);
        }}
      >
        <RotateCcw className="mr-2 h-4 w-4" /> Reset
      </Button>
    </div>
  );
}

export default EditorControls;
