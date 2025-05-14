
// This file now re-exports from the hooks/use-toast.ts file
// The issue is that we're trying to use hooks from a non-React component

import * as React from "react";
import { useToast as useToastOriginal, toast as toastOriginal } from "@/hooks/use-toast";

// Re-export the hooks properly with React context
export const useToast = () => {
  // Ensure we're in a React component context
  if (!React.useState) {
    throw new Error('useToast must be used within a React component');
  }
  return useToastOriginal();
};

export const toast = toastOriginal;
