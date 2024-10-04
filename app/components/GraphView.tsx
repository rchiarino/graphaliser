import { ReactFlow, Background, Controls, ControlButton } from "@xyflow/react";
import { FlowViewProps, GraphViewProps } from "../utils/types";
import { ElkNode } from "elkjs/lib/elk.bundled";

function GraphView({
  graph,
  view,
}: {
  graph: GraphViewProps;
  view: FlowViewProps;
}) {
  return (
    <ReactFlow
      colorMode="dark"
      nodes={graph.nodes}
      onNodesChange={graph.onNodesChange}
      edges={graph.edges}
      onEdgesChange={graph.onEdgesChange}
      onConnect={graph.onConnect}
      fitView
    >
      <Background />
      <Controls />

      <Controls
        className="relative"
        position="top-left"
        showZoom={false}
        showFitView={false}
        showInteractive={false}
      >
        <ControlButton
          title={view.isShown ? "Hide Editor" : "Show Editor"}
          onClick={view.toggleEditor}
        >
          {view.isShown ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={4}
              stroke="currentColor"
              className="size-6 !fill-none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={4}
              stroke="currentColor"
              className="size-6 !fill-none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          )}
        </ControlButton>
      </Controls>
    </ReactFlow>
  );
}

export default GraphView;
