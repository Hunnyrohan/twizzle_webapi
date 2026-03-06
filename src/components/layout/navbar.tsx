"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user, loading } = useAuth();

    return (
        <nav className="fixed w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-4 md:px-6 h-[70px] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Image
                        src="/twizzle-logo-new.png"
                        alt="Twizzle Logo"
                        width={40}
                        height={40}
                        className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-full"
                    />
                    <span className="text-xl font-bold tracking-tight hidden sm:block">Twizzle</span>
                </div>

                {!loading && !user && (
                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" className="font-semibold text-gray-600 dark:text-gray-300 hover:text-[#1d9bf0]">Log in</Button>
                        </Link>
                        <Link href="/signup">
                            <Button variant="twitter" className="px-6 py-2">Sign up</Button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
