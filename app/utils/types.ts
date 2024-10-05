import { Node, Edge, OnConnect } from "@xyflow/react";

export interface GraphViewProps {
  nodes: Node[];
  onNodesChange: (changes: any) => void;
  edges: Edge[];
  onEdgesChange: (changes: any) => void;
  onConnect: OnConnect;
}

export interface EditorConfigProps {
  toggleEditor(): void;
  isShown: boolean;
}
