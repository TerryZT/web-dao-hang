import Link from "next/link";
import type { Settings } from "@/lib/types";
import Image from "next/image";

export function MainHeader({ settings }: { settings: Settings }) {
  return (
    <header className="py-8 md:py-12 text-center relative">
        <div className="absolute top-4 right-4">
            <Link href="/admin" className="text-sm bg-white text-black px-4 py-2 rounded shadow hover:bg-gray-100 transition-colors">
            管理入口
            </Link>
        </div>
        <div className="container mx-auto px-4">
            <div className="flex justify-center items-center mb-6">
                {settings.logo && (
                    <Image
                        src={settings.logo}
                        alt="Logo"
                        width={600}
                        height={200}
                        className="object-contain"
                        priority
                    />
                )}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold font-headline tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient">{settings.title}</h1>
            <p className="mt-3 text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 bg-clip-text text-transparent animate-gradient">Welcome to All-Subject English Enlightenment</p>
            <p className="mt-4 text-sm max-w-2xl mx-auto bg-gradient-to-r from-red-400 via-orange-500 to-indigo-500 bg-clip-text text-transparent animate-gradient">系统 (平台) 由 Erin 英语全科启蒙团队独立开发完成</p>
        </div>
    </header>
  );
}
