import Link from "next/link";
import type { Settings } from "@/lib/types";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";

export function MainHeader({ settings }: { settings: Settings }) {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3">
            <Logo logo={settings.logo} className="w-8 h-8 text-lg" />
            <h1 className="text-xl font-bold font-headline tracking-tight">{settings.title}</h1>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
