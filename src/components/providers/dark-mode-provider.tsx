"use client";

import { useEffect } from "react";
import { useViewportStore } from "@/stores/viewport";

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useViewportStore();

  useEffect(() => {
    // Initialize dark mode on mount
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return <>{children}</>;
} 