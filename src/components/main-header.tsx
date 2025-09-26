import Link from "next/link";
import type { Settings } from "@/lib/types";

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
              <svg width="250" height="80" viewBox="0 0 280 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="24.5" y="4" width="34" height="34" rx="5" fill="#F44336"/>
                <text fill="white" xmlSpace="preserve" style={{whiteSpace: "pre"}} fontFamily="Poppins" fontSize="30" fontWeight="bold" letterSpacing="0em"><tspan x="30" y="32">K</tspan></text>
                
                <rect x="73.5" y="10" width="34" height="34" rx="5" fill="#FFC107"/>
                <circle cx="84.5" cy="23" r="2" fill="white"/>
                <circle cx="95.5" cy="23" r="2" fill="white"/>
                <path d="M86.5 31 C 86.5 29, 93.5 29, 93.5 31" stroke="white" strokeWidth="2" fill="none"/>

                <rect x="115.5" y="10" width="34" height="34" rx="5" fill="#8BC34A"/>
                <text fill="white" xmlSpace="preserve" style={{whiteSpace: "pre"}} fontFamily="Poppins" fontSize="30" fontWeight="bold" letterSpacing="0em"><tspan x="123" y="38">T</tspan></text>

                <text fill="#42A5F5" xmlSpace="preserve" style={{whiteSpace: "pre"}} fontFamily="Poppins" fontSize="30" fontWeight="bold" letterSpacing="0em"><tspan x="25" y="70">E</tspan></text>
                <text fill="#FF7043" xmlSpace="preserve" style={{whiteSpace: "pre"}} fontFamily="Poppins" fontSize="30" fontWeight="bold" letterSpacing="0em"><tspan x="55" y="70">r</tspan></text>
                <text fill="#FFEE58" xmlSpace="preserve" style={{whiteSpace: "pre"}} fontFamily="Poppins" fontSize="30" fontWeight="bold" letterSpacing="0em"><tspan x="78" y="70">i</tspan></text>
                <text fill="#FFB74D" xmlSpace="preserve" style={{whiteSpace: "pre"}} fontFamily="Poppins" fontSize="30" fontWeight="bold" letterSpacing="0em"><tspan x="95" y="70">n</tspan></text>

                <text fill="black" xmlSpace="preserve" style={{whiteSpace: "pre"}} fontFamily="Microsoft YaHei" fontSize="36" fontWeight="bold" letterSpacing="0.1em"><tspan x="160" y="45">全科启蒙</tspan></text>
                <text fill="#888" xmlSpace="preserve" style={{whiteSpace: "pre"}} fontFamily="Microsoft YaHei" fontSize="14" letterSpacing="0em"><tspan x="200" y="70">0-12岁</tspan></text>
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold font-headline tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient">Hello</h1>
            <p className="mt-3 text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 bg-clip-text text-transparent animate-gradient">Welcome to All-Subject English Enlightenment</p>
            <p className="mt-4 text-sm max-w-2xl mx-auto bg-gradient-to-r from-red-400 via-orange-500 to-indigo-500 bg-clip-text text-transparent animate-gradient">系统 (平台) 由 Erin 英语全科启蒙团队独立开发完成</p>
        </div>
    </header>
  );
}