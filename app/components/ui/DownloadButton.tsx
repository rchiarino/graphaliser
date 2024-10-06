import { toPng } from "html-to-image";
import React from "react";
import {
  ControlButton,
  useReactFlow,
  getViewportForBounds,
  getNodesBounds,
} from "@xyflow/react";

const downloadImage = (dataUrl: string) => {
  const a = document.createElement("a");

  a.setAttribute("download", `graphaliser-${Date.now()}.png`);
  a.setAttribute("href", dataUrl);
  a.click();
};

function DownloadButton() {
  const { getNodes } = useReactFlow();
  const onClick = () => {
    const nodesBounds = getNodesBounds(getNodes());
    const { height: imageHeight, width: imageWidth } = nodesBounds;
    const transform = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      1,
      4,
      2
    );
    const viewport: HTMLDivElement = document.querySelector(
      ".react-flow__viewport"
    )!;

    toPng(viewport, {
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth as any,
        height: imageHeight as any,
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
      },
    })
      .then(downloadImage)
      .catch(console.error);
  };

  return (
    <ControlButton title="Download as PNG" onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={3}
        stroke="currentColor"
        className="size-6 !fill-none"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
    </ControlButton>
  );
}

export default DownloadButton;
