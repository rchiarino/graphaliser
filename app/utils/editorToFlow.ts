import { Edge, Node } from "@xyflow/react";

function parsePseudocode(pseudocode: string): string[] {
  return pseudocode
    .trim()
    .split("\n")
    .map((line) => line.trim());
}

function generateNodes(commands: string[]): Node[] {
  let nodes: Node[] = [];
  let yPos = 100;
  const xPos = 100;

  commands.forEach((command) => {
    if (
      command !== "BEGIN" &&
      command !== "END" &&
      command !== "COBEGIN" &&
      command !== "COEND" &&
      !command.startsWith("//")
    ) {
      nodes.push({
        id: command,
        position: { x: xPos, y: yPos },
        data: { label: command },
      });
      yPos += 100;
    }
  });

  return nodes;
}

function generateEdges(commands: string[]): Edge[] {
  const edges: Edge[] = [];
  const stack: string[] = [];
  const parallelNodes: string[] = [];
  let lastSequentialNode: string | null = null;

  for (const command of commands) {
    if (command === "BEGIN") {
      stack.push(lastSequentialNode ? lastSequentialNode : "");
      lastSequentialNode = null;
    } else if (command === "COBEGIN") {
      parallelNodes.length = 0;
    } else if (command === "COEND") {
      if (lastSequentialNode) {
        parallelNodes.forEach((node) => {
          edges.push({
            id: `${lastSequentialNode}-${node}`,
            source: lastSequentialNode!,
            target: node,
          });
        });
      }
      lastSequentialNode = stack.pop() || null;
    } else if (command !== "END") {
      if (lastSequentialNode) {
        edges.push({
          id: `${lastSequentialNode}-${command}`,
          source: lastSequentialNode,
          target: command,
        });
      }
      lastSequentialNode = command;
      if (parallelNodes.length > 0) {
        parallelNodes.push(command);
      } else {
        parallelNodes.push(command);
      }
    }
  }

  return edges;
}

export default function processPseudoCode(pseudocode: string) {
  const commands = parsePseudocode(pseudocode);
  console.log(commands);

  const nodes = generateNodes(commands);
  const edges = generateEdges(commands);

  return { nodes, edges };
}
