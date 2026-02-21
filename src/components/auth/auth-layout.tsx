import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
    closeUrl?: string; // Where the 'x' button goes
}

export default function AuthLayout({ children, closeUrl = "/" }: AuthLayoutProps) {
    return (
        <div className="fixed inset-0 bg-[#242d34]/40 flex items-center justify-center p-4 z-50 overflow-y-auto">
            {/* Modal Container */}
            <div className="bg-white dark:bg-black w-full max-w-[600px] min-h-[400px] sm:min-h-[600px] rounded-2xl flex flex-col shadow-xl">
                {/* Header / Top Bar */}
                <div className="px-4 h-[53px] flex items-center justify-between shrink-0">
                    <div className="w-[56px] flex justify-start">
                        <Link href={closeUrl} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 text-[#0f1419] dark:text-[#eff3f4] fill-current">
                                <g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g>
                            </svg>
                        </Link>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="w-[40px] h-[40px] relative">
                            {/* Twizzle Logo */}
                            <Image
                                src="/twizzle-logo.png"
                                alt="Twizzle Logo"
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                        </div>
                    </div>
                    <div className="w-[56px]"></div> {/* Spacer */}
                </div>

                {/* Content Body */}
                <div className="flex-1 flex flex-col px-8 sm:px-20 overflow-y-auto pb-10">
                    <div className="w-full max-w-[364px] mx-auto flex flex-col">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
