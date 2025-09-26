import Link from "next/link";
import type { Settings } from "@/lib/types";
import { ThemeToggle } from "./theme-toggle";

export function MainHeader({ settings }: { settings: Settings }) {
  return (
    <header className="py-12 md:py-20 text-center relative">
        <div className="container mx-auto px-4">
            <div className="flex justify-center items-center mb-8">
              {/* Logo Placeholder */}
              <div className="w-48 h-24 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="96" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">Hello</h1>
            <p className="mt-4 text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 animate-gradient">Welcome to All-Subject English Enlightenment</p>
            <p className="mt-4 text-sm text-muted-foreground max-w-2xl mx-auto">系统 (平台) 由 Erin 英语全科启蒙团队独立开发完成</p>
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                管理
              </Link>
              <ThemeToggle />
            </div>
        </div>
    </header>
  );
}
