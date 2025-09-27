"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Palette, Monitor } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const themes = [
    { name: "玫瑰", value: "rose" },
    { name: "薄荷", value: "mint" },
    { name: "日落", value: "sunset" },
    { name: "默认", value: "default" },
]

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()
  const [colorTheme, setColorTheme] = React.useState('default');

  React.useEffect(() => {
    const storedColorTheme = localStorage.getItem('color-theme');
    if (storedColorTheme && themes.some(t => t.value === storedColorTheme)) {
        setColorTheme(storedColorTheme);
        document.body.classList.forEach(className => {
            if (className.startsWith('theme-')) {
                document.body.classList.remove(className);
            }
        });
        if (storedColorTheme !== 'default') {
          document.body.classList.add(`theme-${storedColorTheme}`);
        }
    }
  }, []);

  const handleColorChange = (newColor: string) => {
      setColorTheme(newColor);
      localStorage.setItem('color-theme', newColor);
      document.body.classList.forEach(className => {
            if (className.startsWith('theme-')) {
                document.body.classList.remove(className);
            }
      });
       if (newColor !== 'default') {
          document.body.classList.add(`theme-${newColor}`);
       }
  }

  return (
    <div className="flex gap-2">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Palette className="h-[1.2rem] w-[1.2rem]"/>
                    <span className="sr-only">切换颜色主题</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {themes.map((t) => (
                    <DropdownMenuItem key={t.value} onClick={() => handleColorChange(t.value)}>
                        {t.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">切换亮暗模式</span>
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
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    跟随系统
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <div className="text-xs text-muted-foreground self-center">
            模式: {theme} / 颜色: {colorTheme}
        </div>
    </div>
  )
}
