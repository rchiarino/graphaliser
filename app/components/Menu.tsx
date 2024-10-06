import { Download, Moon, Palette, Sun, SunMoon } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
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

const downloadImage = (dataUrl: string) => {
  const a = document.createElement("a");

  a.setAttribute("download", `graphaliser-${Date.now()}.png`);
  a.setAttribute("href", dataUrl);
  a.click();
};

export function Menu() {
  const { setTheme } = useTheme();
  const { getNodes } = useReactFlow();

  const downloadGraph = () => {
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
        width: `${imageWidth}`,
        height: `${imageHeight}`,
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
      },
    })
      .then(downloadImage)
      .catch(console.error);
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
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <span>Menu item</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Palette className="mr-2 h-4 w-4" />
                <span>Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <SunMoon className="mr-2 h-4 w-4" />
                    <span>Auto</span>
                  </DropdownMenuItem>
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
