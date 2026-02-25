import React from 'react';

interface AvatarProps {
    src?: string;
    alt?: string;
    fallback: string;
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback, className = "" }) => {
    return (
        <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
            {src ? (
                <img src={src} alt={alt || "Avatar"} className="aspect-square h-full w-full object-cover" />
            ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-muted bg-gray-200 dark:bg-zinc-800 font-bold text-gray-500">
                    {fallback.substring(0, 2).toUpperCase()}
                </div>
            )}
        </div>
    );
};

export const AvatarImage: React.FC<{ src?: string; alt?: string; className?: string }> = ({ src, alt, className = "" }) => (
    <img src={src} alt={alt} className={`aspect-square h-full w-full ${className}`} />
);

export const AvatarFallback: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
    <div className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}>
        {children}
    </div>
);
