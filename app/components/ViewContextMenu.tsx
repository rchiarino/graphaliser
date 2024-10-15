import { Fullscreen, Download } from "lucide-react";
import React from "react";
import { ContextMenuProps } from "../utils/types";
import {
    useReactFlow
} from "@xyflow/react";

import downloadGraph from "../utils/downloadGraph";


function ViewContexMenu({ top, left, right, bottom }: ContextMenuProps) {
    const { getNodes, getEdges, setNodes, setEdges, fitView } = useReactFlow();

    return (
        <div
            style={{ top, left, right, bottom }}
            className="absolute z-10 w-48 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        >
            <button onClick={()=> {
                fitView({padding: 0.2});
            }} className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground w-full disabled:text-muted-foreground disabled:hover:bg-popover disabled:hover:text-muted-foreground">
                <Fullscreen className="mr-2 h-4 w-4" />
                Fit to view
            </button>
            <div className="h-px bg-border my-1" />
            <button onClick={() => downloadGraph({getNodes, getEdges, setNodes, setEdges})} className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground w-full disabled:text-muted-foreground disabled:hover:bg-popover disabled:hover:text-muted-foreground">
                <Download className="mr-2 h-4 w-4" />
                Download graph
            </button>
        </div>
    );
}

export default ViewContexMenu;
