import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { ContextMenuProps } from "../utils/types";

function NodeContextMenu({ id, top, left, right, bottom }: ContextMenuProps) {
  return (
    <div
      style={{ top, left, right, bottom }}
      className="absolute z-10 w-48 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
    >
      <div className="px-2 py-1.5 text-sm font-semibold">Node: {id}</div>
      <div className="h-px bg-border my-1" />
      <button
        disabled
        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground w-full disabled:text-muted-foreground disabled:hover:bg-popover disabled:hover:text-muted-foreground"
      >
        <Edit className="mr-2 h-4 w-4" />
        Edit
      </button>
      <button
        disabled
        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground w-full disabled:text-muted-foreground disabled:hover:bg-popover disabled:hover:text-muted-foreground"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Remove
      </button>
    </div>
  );
}

export default NodeContextMenu;
