import Link from "next/link";
import type { Settings } from "@/lib/types";
import Image from "next/image";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";

export function MainHeader({ settings }: { settings: Settings }) {
  return (
    <header className="py-8 md:py-12 text-center relative">
        <div className="absolute top-4 right-4 flex items-center gap-2">
            <ThemeSwitcher />
            <Button asChild variant="outline" size="sm">
              <Link href="/admin">
                管理入口
              </Link>
            </Button>
        </div>
        <div className="container mx-auto px-4">
            <div className="flex justify-center items-center mb-6 h-[100px]">
                {settings.logo && (
                    <Image
                        src={settings.logo}
                        alt="Logo"
                        width={600}
                        height={200}
                        sizes="100vw"
                        className="object-contain h-full w-auto"
                        priority
                    />
                )}
            </div>
            <h1 style={{fontFamily: "'Caveat', cursive"}} className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient">{settings.title}</h1>
            <p className="mt-3 text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 bg-clip-text text-transparent animate-gradient">Welcome to All-Subject English Enlightenment</p>
            <p className="mt-4 text-2xl max-w-2xl mx-auto bg-gradient-to-r from-red-400 via-orange-500 to-indigo-500 bg-clip-text text-transparent animate-gradient">系统 (平台) 由 Erin 英语全科启蒙团队独立开发完成</p>
        </div>
    </header>
  );
}
