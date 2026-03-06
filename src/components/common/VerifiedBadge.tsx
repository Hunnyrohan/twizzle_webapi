import React from 'react';
import { BadgeCheck } from 'lucide-react';

interface VerifiedBadgeProps {
    className?: string;
    size?: number;
}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ className = '', size = 18 }) => {
    return (
        <div className={`relative inline-flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
            <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: size, height: size }}
                className="relative z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] transition-transform hover:scale-110 active:scale-95 duration-200"
            >
                <defs>
                    <linearGradient id="twizzle-premium-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1DA1F2" /> {/* Primary Twitter/Twizzle Blue */}
                        <stop offset="50%" stopColor="#0E71C8" />
                        <stop offset="100%" stopColor="#085A9D" />
                    </linearGradient>

                    <filter id="inner-glow">
                        <feFlood floodColor="white" floodOpacity="0.4" result="color" />
                        <feComposite in2="SourceGraphic" operator="out" />
                        <feGaussianBlur stdDeviation="0.5" result="blur" />
                        <feComposite in2="SourceGraphic" operator="atop" />
                    </filter>
                </defs>

                {/* The 12-point Rosette / Starburst Shape */}
                <path
                    d="M12 2L14.8 3.5L18 2.5L18.5 5.5L21.5 6L20.5 9.2L22 12L20.5 14.8L21.5 18L18.5 18.5L18 21.5L14.8 20.5L12 22L9.2 20.5L6 21.5L5.5 18.5L2.5 18L3.5 14.8L2 12L3.5 9.2L2.5 6L5.5 5.5L6 2.5L9.2 3.5L12 2Z"
                    fill="url(#twizzle-premium-gradient)"
                    stroke="#0D8BD9"
                    strokeWidth="0.5"
                />

                {/* Inner highlights for metallic feel */}
                <path
                    d="M12 2L14.8 3.5L18 2.5L18.5 5.5L21.5 6L20.5 9.2L22 12L20.5 14.8L21.5 18L18.5 18.5L18 21.5L14.8 20.5L12 22L9.2 20.5L6 21.5L5.5 18.5L2.5 18L3.5 14.8L2 12L3.5 9.2L2.5 6L5.5 5.5L6 2.5L9.2 3.5L12 2Z"
                    fill="white"
                    fillOpacity="0.1"
                    filter="url(#inner-glow)"
                />

                {/* Clean White Checkmark */}
                <path
                    d="M8.5 12.5L10.5 14.5L15.5 9.5"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Outer Halo */}
            <div className="absolute inset-0 bg-blue-500 opacity-10 blur-[4px] rounded-full scale-110"></div>
        </div>
    );
};

export default VerifiedBadge;
