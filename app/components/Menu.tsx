import { Download, Moon, Palette, Sun, SunMoon } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { toPng } from "html-to-image";
import React from "react";
import {
  useReactFlow,
  getViewportForBounds,
  getNodesBounds,
} from "@xyflow/react";

import { useTheme } from "next-themes";
import { GraphMenuProps } from "../utils/types";
import { Switch } from "./ui/switch";

const downloadImage = (dataUrl: string) => {
  const a = document.createElement("a");

  a.setAttribute("download", `graphaliser-${Date.now()}.png`);
  a.setAttribute("href", dataUrl);
  a.click();
};

export function Menu({ reRender, setReRender }: GraphMenuProps) {
  const { setTheme, theme } = useTheme();
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();

  const downloadGraph = () => {
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
  };
  return (
    <div className="z-[4] absolute top-4 right-4 ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={downloadGraph}
            >
              <Download className="mr-2 h-4 w-4" />
              <span>Download graph</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={(event) => {
                event.preventDefault();
              }}
              title="Rearange the graph to prevent overlapping nodes"
            >
              <span>Auto layout nodes</span>
              <Switch
                className="ml-auto"
                checked={reRender}
                onCheckedChange={() => setReRender(!reRender)}
              />
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled
              onClick={(event) => {
                event.preventDefault();
              }}
              title="Display bounding boxes around structures"
            >
              <span>Show bounding boxes</span>
              <Switch
                className="ml-auto"
                checked={false}
                onCheckedChange={() => alert("Not implemented yet")}
              />
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Palette className="mr-2 h-4 w-4" />
                <span>Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuCheckboxItem
                    checked={theme === "light"}
                    onClick={() => setTheme("light")}
                    className="cursor-pointer"
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={theme === "dark"}
                    onClick={() => setTheme("dark")}
                    className="cursor-pointer"
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={theme === "system"}
                    onClick={() => setTheme("system")}
                    className="cursor-pointer"
                  >
                    <SunMoon className="mr-2 h-4 w-4" />
                    <span>Auto</span>
                  </DropdownMenuCheckboxItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>
            <span>{`Graphaliser v${process.env.NEXT_PUBLIC_APP_VERSION}`}</span>
          </DropdownMenuLabel>
          <DropdownMenuLabel>
            <span className="font-light">
              by{" "}
              <a
                href="https://rchiarino.com"
                target="_blank"
                className="underline"
              >
                rchiarino
              </a>
            </span>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
