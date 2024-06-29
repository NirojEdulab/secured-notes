"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function SwitchThemeToggle({styleClass}: {styleClass: string}) {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className={cn("flex items-center space-x-2 justify-center", styleClass)}>
      <Sun className="h-5 w-5 text-yellow-500" />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={handleThemeChange}
      />
      <Moon className="h-5 w-5 text-gray-900" />
    </div>
  );
}
