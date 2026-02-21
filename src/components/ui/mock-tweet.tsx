"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// I need to create avatar component or use standard img. I will use standard div/img for now to avoid dependency hell if I haven't made avatar.
// I'll stick to raw HTML/Tailwind for the mock to be safe and self-contained.

export function MockTweet({
    name,
    handle,
    content,
    time = "2m",
    likes = "1.2k",
    comments = "234",
    image
}: {
    name: string;
    handle: string;
    content: string;
    time?: string;
    likes?: string;
    comments?: string;
    image?: string;
}) {
    return (
        <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 p-4 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-[#080808] transition-colors cursor-pointer">
            <div className="flex gap-3">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${handle}`} alt={name} className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-[15px]">
                        <span className="font-bold text-black dark:text-white truncate">{name}</span>
                        <span className="text-gray-500 truncate">@{handle}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500 hover:underline">{time}</span>
                    </div>
                    <p className="text-[15px] text-black dark:text-[#e7e9ea] mt-0.5 whitespace-pre-wrap leading-normal">
                        {content}
                    </p>
                    {image && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                            <img src={image} alt="Post image" className="w-full h-auto object-cover max-h-[300px]" />
                        </div>
                    )}

                    <div className="flex justify-between mt-3 max-w-md text-gray-500">
                        <div className="group flex items-center gap-2 hover:text-[#1d9bf0] transition-colors">
                            <div className="p-2 -ml-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current"><g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g></svg>
                            </div>
                            <span className="text-xs group-hover:text-[#1d9bf0]">{comments}</span>
                        </div>
                        <div className="group flex items-center gap-2 hover:text-[#00ba7c] transition-colors">
                            <div className="p-2 -ml-2 rounded-full group-hover:bg-[#00ba7c]/10 transition-colors">
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current"><g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g></svg>
                            </div>
                            <span className="text-xs group-hover:text-[#00ba7c]">{likes}</span> // Using likes/RTs vaguely
                        </div>
                        <div className="group flex items-center gap-2 hover:text-[#f91880] transition-colors">
                            <div className="p-2 -ml-2 rounded-full group-hover:bg-[#f91880]/10 transition-colors">
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current"><g><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.5 4.798 2.01 1.429-1.51 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.605 3.01.896 1.81.846 4.17-.514 6.67z"></path></g></svg>
                            </div>
                            <span className="text-xs group-hover:text-[#f91880]">24.5K</span>
                        </div>
                        <div className="group flex items-center gap-2 hover:text-[#1d9bf0] transition-colors">
                            <div className="p-2 -ml-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current"><g><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path></g></svg>
                            </div>
                            <span className="text-xs group-hover:text-[#1d9bf0]">892</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
