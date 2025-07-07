"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useViewportStore } from "@/stores/viewport";
import { useEffect } from "react";

export function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useViewportStore();

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDarkMode}
      className="w-full justify-start gap-3 px-3 py-2 hover:bg-muted transition-colors"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun size={16} className="text-muted-foreground" />
      ) : (
        <Moon size={16} className="text-muted-foreground" />
      )}
      <span className="font-medium text-sm text-foreground">
        {isDarkMode ? "Light Mode" : "Dark Mode"}
      </span>
    </Button>
  );
} 