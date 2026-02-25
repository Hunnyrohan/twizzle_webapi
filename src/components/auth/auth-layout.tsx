"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode, useState, useRef } from "react";
import Scene3D from "./Scene3D";
import ResonanceOrb from "./ResonanceOrb";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

interface AuthLayoutProps {
    children: ReactNode;
    closeUrl?: string;
}

export default function AuthLayout({ children, closeUrl = "/" }: AuthLayoutProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const mX = (event.clientX - rect.left) / rect.width - 0.5;
        const mY = (event.clientY - rect.top) / rect.height - 0.5;
        x.set(mX);
        y.set(mY);
        setMousePosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-y-auto bg-transparent">
            <Scene3D />

            {/* Subtle illumination */}
            <motion.div
                className="pointer-events-none fixed w-[800px] h-[800px] rounded-full bg-[#1d9bf0] blur-[140px] opacity-[0.03] z-0"
                animate={{
                    x: mousePosition.x - 400,
                    y: mousePosition.y - 400,
                }}
                transition={{ type: "spring", stiffness: 40, damping: 25 }}
            />

            <AnimatePresence>
                <motion.div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={handleMouseLeave}
                    initial={{ opacity: 0, scale: 0.98, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: 20 }}
                    transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                    style={{
                        perspective: "1200px",
                        transformStyle: "preserve-3d",
                        rotateX: isHovered ? rotateX : 0,
                        rotateY: isHovered ? rotateY : 0,
                    }}
                    className="relative bg-zinc-950/60 backdrop-blur-[40px] border border-white/10 w-full max-w-[1100px] min-h-[650px] rounded-[48px] flex flex-col md:flex-row shadow-2xl overflow-hidden"
                >
                    {/* LEFT PANEL: MINIMAL BRANDING */}
                    <div className="hidden md:flex flex-1 relative flex-col justify-center items-center p-12 border-r border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
                        <motion.div
                            style={{ translateZ: "60px" }}
                            className="relative flex flex-col items-center text-center w-full"
                        >
                            <div className="w-full h-64 relative mb-6">
                                <ResonanceOrb />
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-6xl font-black text-white tracking-tighter">
                                    Twizzle
                                </h2>
                                <p className="text-lg text-white/40 font-medium tracking-tight max-w-[280px] mx-auto leading-snug">
                                    Join the pulse of the world, <br />
                                    <span className="text-[#1d9bf0] font-bold">synchronized</span> in real-time.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT PANEL: INTERACTIVE FORMS */}
                    <div className="flex-1 flex flex-col relative z-10 w-full bg-black/10">
                        {/* Header Actions */}
                        <div className="px-8 h-[80px] flex items-center justify-between">
                            <div className="md:hidden flex items-center">
                                <Image src="/twizzle-logo.png" alt="Logo" width={40} height={40} />
                            </div>
                            <div className="hidden md:block w-10" />

                            <Link href={closeUrl} className="p-3 rounded-full hover:bg-white/10 transition-all group active:scale-95">
                                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white/40 group-hover:text-white fill-current">
                                    <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                                </svg>
                            </Link>
                        </div>

                        {/* Form Container */}
                        <div className="flex-1 flex flex-col px-8 sm:px-12 overflow-y-auto pb-12 custom-scrollbar">
                            <div className="w-full max-w-[380px] mx-auto flex flex-col justify-center min-h-full py-4">
                                {children}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
