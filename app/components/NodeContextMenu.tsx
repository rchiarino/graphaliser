import { Edit, Save, Trash2 } from "lucide-react";
import React from "react";
import { ContextMenuProps } from "../utils/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

function NodeContextMenu({ node, top, left, right, bottom }: ContextMenuProps) {
  const [nodeId, setNodeId] = React.useState(node!.id);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeId(e.target.value);
    node!.data.lable = nodeId;
  };

  return (
    <Dialog>
      <div
        style={{ top, left, right, bottom }}
        className="absolute z-10 w-48 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
      >
        <div className="px-2 py-1.5 text-sm font-semibold">
          Node: {node!.id}
        </div>
        <div className="h-px bg-border my-1" />

        <DialogTrigger asChild>
          <button
            disabled
            className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground w-full disabled:text-muted-foreground disabled:hover:bg-popover disabled:hover:text-muted-foreground disabled:cursor-default"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </button>
        </DialogTrigger>

        <button
          disabled
          className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground w-full disabled:text-muted-foreground disabled:hover:bg-popover disabled:hover:text-muted-foreground"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Remove
        </button>
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editing the node values</DialogTitle>
          <DialogDescription>
            Make changes to the node values and click save to apply the changes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="id" className="text-right">
              Id:
            </Label>
            <Input
              id="id"
              defaultValue={nodeId}
              className="col-span-3"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onSubmit={() => alert("aa")}>
            <Save className="mr-2 h-4 w-4" />
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NodeContextMenu;
