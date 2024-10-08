"use client";
import { TestTubeDiagonal } from "lucide-react";
import React, { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

export default function BetaAlert() {
  const [closed, setClose] = useState(false);

  setTimeout(() => {
    setClose(true);
  }, 5000);

  if (closed) return null;
  return (
    <div className="absolute bottom-0 flex justify-center items-center w-full pb-2">
      <div>
        <Alert>
          <TestTubeDiagonal className="h-4 w-4" />
          <AlertTitle>This is a beta version</AlertTitle>
          <AlertDescription>
            <small>
              The current version of Graphaliser is on beta. Some features may
              not work as intended.
            </small>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
