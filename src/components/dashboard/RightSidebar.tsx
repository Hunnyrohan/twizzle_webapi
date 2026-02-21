"use client";

import { Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RightSidebar() {
    return (
        <div className="hidden lg:flex flex-col h-full w-[350px] px-4 py-4 space-y-4">
            {/* Search */}
            <div className="sticky top-0 bg-white dark:bg-black z-10 pb-2">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 peer-focus:text-[#1d9bf0]" />
                    <input
                        type="text"
                        placeholder="Search Twizzle"
                        className="w-full bg-gray-100 dark:bg-gray-900 rounded-full py-3 pl-12 pr-4 outline-none focus:bg-white dark:focus:bg-black focus:ring-1 focus:ring-[#1d9bf0] transition-all"
                    />
                </div>
            </div>

            {/* What's Happening */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden">
                <h2 className="text-xl font-bold px-4 py-3">What's happening</h2>

                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors relative"
                    >
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Trending in Tech</span>
                            <button className="hover:bg-blue-100 dark:hover:bg-blue-900/20 p-1 rounded-full text-[#1d9bf0] transition-colors">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="font-bold my-0.5">#TwizzleLaunch</div>
                        <div className="text-xs text-gray-500">50.4K Tweets</div>
                    </div>
                ))}

                <div className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors text-[#1d9bf0] text-sm">
                    Show more
                </div>
            </div>

            {/* Who to follow */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden">
                <h2 className="text-xl font-bold px-4 py-3">Who to follow</h2>

                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Follow${i}`}
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold truncate hover:underline">Suggested User {i}</div>
                            <div className="text-gray-500 text-sm truncate">@suggested{i}</div>
                        </div>
                        <Button
                            size="sm"
                            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full font-bold h-8 px-4"
                        >
                            Follow
                        </Button>
                    </div>
                ))}

                <div className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors text-[#1d9bf0] text-sm">
                    Show more
                </div>
            </div>

            <div className="px-4 text-xs text-gray-500 leading-relaxed">
                <span className="hover:underline cursor-pointer mr-2">Terms of Service</span>
                <span className="hover:underline cursor-pointer mr-2">Privacy Policy</span>
                <span className="hover:underline cursor-pointer mr-2">Cookie Policy</span>
                <span className="hover:underline cursor-pointer mr-2">Accessibility</span>
                <span className="hover:underline cursor-pointer mr-2">Ads info</span>
                <span>© 2026 Twizzle, Inc.</span>
            </div>
        </div>
    );
}
