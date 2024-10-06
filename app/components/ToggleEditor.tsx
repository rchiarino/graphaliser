import React from "react";
import { Button } from "@/app/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function ToggleEditor({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="z-[4] absolute top-4 left-4 ">
      <Button
        variant="outline"
        size="icon"
        onClick={onClick}
        title={isOpen ? "Close Editor" : "Open Editor"}
      >
        {isOpen ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}

export default ToggleEditor;
