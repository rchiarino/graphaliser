import { toPng } from "html-to-image";
import React from "react";
import {
    Node,
    Edge,
    getViewportForBounds,
    getNodesBounds,
} from "@xyflow/react";

const downloadImage = (dataUrl: string) => {
    const a = document.createElement("a");

    a.setAttribute("download", `graphaliser-${Date.now()}.png`);
    a.setAttribute("href", dataUrl);
    a.click();
};

function downloadGraph({ getNodes, getEdges, setNodes, setEdges }: {getNodes: () => Node[], getEdges: () => Edge[], setNodes: (nodes: Node[]) => void, setEdges: (edges: Edge[]) => void}) {

    const nodes = getNodes();
    const edges = getEdges();

    const originalNodes = nodes.map((node) => ({ ...node }));
    const originalEdges = edges.map((edge) => ({ ...edge }));

    const cleanNodes = nodes.map((node) => ({
        ...node,
        selected: false,
    }));

    const cleanEdges = edges.map((edge) => ({
        ...edge,
        selected: false,
    }));

    setNodes(cleanNodes);
    setEdges(cleanEdges);

    const nodesBounds = getNodesBounds(cleanNodes);
    const { height: imageHeight, width: imageWidth } = nodesBounds;
    const transform = getViewportForBounds(
        nodesBounds,
        imageWidth,
        imageHeight,
        1,
        2,
        0.5
    );

    const viewport: HTMLElement | null = document.querySelector(
        ".react-flow__viewport"
    );

    if (viewport) {
        toPng(viewport, {
            width: imageWidth,
            height: imageHeight,
            style: {
                width: `${imageWidth}`,
                height: `${imageHeight}`,
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
            },
        })
            .then(downloadImage)
            .catch(console.error)
            .finally(() => {
                setNodes(originalNodes);
                setEdges(originalEdges);
            });
    }
}

export default downloadGraph;