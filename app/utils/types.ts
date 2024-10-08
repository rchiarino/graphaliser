import { Node, Edge } from "@xyflow/react";

export interface GraphViewProps {
  nodes: Node[];
  edges: Edge[];
}

export interface EditorConfigProps {
  toggleEditor(): void;
  isShown: boolean;
}

export interface ContextMenuProps {
  id: string;
  top: string | number;
  left: string | number;
  right: string | number;
  bottom: string | number;
}

export interface CodeError {
  reason: string;
  row: number;
  startColumn: number;
  endColumn: number;
}
