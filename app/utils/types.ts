import { Node, Edge } from "@xyflow/react";

export interface GraphViewProps {
  nodes: Node[];
  edges: Edge[];
}

export interface EditorConfigProps {
  toggleEditor(): void;
  isShown: boolean;
}
