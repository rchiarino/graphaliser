import type { languages } from "monaco-editor";

export const configuration: languages.LanguageConfiguration = {
  comments: {
    lineComment: "//",
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"', notIn: ["string", "comment"] },
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
  ],
  folding: {
    offSide: true,
  },
};

// Based on .m3 language, edited to mach COBEGIN-END | https://github.com/microsoft/monaco-editor/blob/main/src/basic-languages/m3/m3.ts
export const language: languages.IMonarchLanguage = {
  keywords: ["BEGIN", "END", "COBEGIN", "COEND"],
  reservedConstNames: [],
  reservedTypeNames: [],
  operators: [":", "-", "*", "+", "&", "^", "."],
  relations: ["=", "#", "<", "<=", ">", ">=", "<:", ":"],
  delimiters: ["|", "..", "=>", ",", ";", ":="],
  symbols: /[>=<#.,:;+\-*/&^]+/,
  escapes: /\\(?:[\\fnrt"']|[0-7]{3})/,

  tokenizer: {
    root: [
      // Identifiers and keywords
      [/_\w*/, "invalid"],
      [
        /[a-zA-Z][a-zA-Z0-9_]*/,
        {
          cases: {
            "@keywords": { token: "keyword.$0" },
            "@reservedConstNames": { token: "constant.reserved.$0" },
            "@reservedTypeNames": { token: "type.reserved.$0" },
            "@default": "identifier",
          },
        },
      ],

      // Whitespace
      { include: "@whitespace" },
      [/[{}()\[\]]/, "@brackets"],

      // Integer- and real literals
      [/[0-9]+\.[0-9]+(?:[DdEeXx][\+\-]?[0-9]+)?/, "number.float"],
      [/[0-9]+(?:\_[0-9a-fA-F]+)?L?/, "number"],

      // Operators, relations, and delimiters
      [
        /@symbols/,
        {
          cases: {
            "@operators": "operators",
            "@relations": "operators",
            "@delimiters": "delimiter",
            "@default": "invalid",
          },
        },
      ],

      // Character literals
      [/'[^\\']'/, "string.char"],
      [/(')(@escapes)(')/, ["string.char", "string.escape", "string.char"]],
      [/'/, "invalid"],

      // Text literals
      [/"([^"\\]|\\.)*$/, "invalid"],
      [/"/, "string.text", "@text"],
    ],

    text: [
      [/[^\\"]+/, "string.text"],
      [/@escapes/, "string.escape"],
      [/\\./, "invalid"],
      [/"/, "string.text", "@pop"],
    ],

    comment: [
      [/[^\/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[\/*]/, "comment"],
    ],

    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/\/\/.*$/, "comment"],
    ],
  },
};
