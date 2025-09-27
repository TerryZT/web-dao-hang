"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Palette, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"

const themes = [
    { name: "默认", value: "default" },
    { name: "玫瑰", value: "rose" },
    { name: "薄荷", value: "mint" },
    { name: "日落", value: "sunset" },
]

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
            <Palette className="h-[1.2rem] w-[1.2rem]"/>
            <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          亮色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          暗色
        </DropdownMenuItem>
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <Palette className="mr-2 h-4 w-4" />
                <span>主题颜色</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    {themes.map((t) => (
                        <DropdownMenuItem key={t.value} onClick={() => setTheme(`theme-${t.value}`)}>
                             <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: `hsl(var(--primary))` }}></div>
                            {t.name}
                            {theme === `theme-${t.value}` && <Check className="ml-auto h-4 w-4" />}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
