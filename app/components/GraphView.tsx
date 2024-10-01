import { ReactFlow, Background, Controls } from "@xyflow/react";
import { GraphViewProps } from "../utils/types";

function GraphView({ ...props }: GraphViewProps) {
  return (
    <ReactFlow
      colorMode="dark"
      nodes={props.nodes}
      onNodesChange={props.onNodesChange}
      edges={props.edges}
      onEdgesChange={props.onEdgesChange}
      onConnect={props.onConnect}
      fitView
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
}

export default GraphView;
