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

import { useTheme } from "next-themes";
import { GraphMenuProps } from "../utils/types";
import { Switch } from "./ui/switch";
import {
  useReactFlow,
} from "@xyflow/react";

import downloadGraph from "../utils/downloadGraph";




export function Menu({ reRender, setReRender }: GraphMenuProps) {
  const { setTheme, theme } = useTheme();
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();

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
              onClick={() => downloadGraph({ getNodes, getEdges, setNodes, setEdges })}
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
