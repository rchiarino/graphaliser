"use client";
import { TestTubeDiagonal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

export default function BetaAlert() {
  const [closed, setClose] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setClose(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (closed) return null;
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div>
        <Alert className="w-full shadow-lg">
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
