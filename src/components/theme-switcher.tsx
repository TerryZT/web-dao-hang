"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Palette, Monitor, Pipette, Sunrise, Leaf } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeSwitcher() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
            <Palette className="h-[1.2rem] w-[1.2rem]"/>
            <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          跟随系统
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          暗色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          亮色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("theme-rose")}>
          <Pipette className="mr-2 h-4 w-4" />
          玫瑰
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("theme-sunset")}>
          <Sunrise className="mr-2 h-4 w-4" />
          日落
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("theme-mint")}>
          <Leaf className="mr-2 h-4 w-4" />
          薄荷
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
