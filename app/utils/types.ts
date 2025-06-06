import { Node, Edge } from "@xyflow/react";

export interface GraphViewProps {
  nodes: Node[];
  edges: Edge[];
}

export interface EditorConfigProps {
  toggleEditor(): Promise<void>;
  isShown: boolean;
}

export interface ContextMenuProps {
  node?: Node;
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

export interface GraphMenuProps {
  reRender: boolean;
  setReRender(value: boolean): void;
}
