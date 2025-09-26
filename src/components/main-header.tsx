import Link from "next/link";
import type { Settings } from "@/lib/types";
import { ThemeToggle } from "./theme-toggle";

export function MainHeader({ settings }: { settings: Settings }) {
  return (
    <header className="py-12 md:py-20 text-center">
        <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">{settings.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">聚合全网优质网址，助你工作学习更高效！</p>
            <div className="absolute top-4 right-4">
              <ThemeToggle />
            </div>
        </div>
    </header>
  );
}
