'use client';

import React, { useEffect, useState } from 'react';
import { exploreService } from '@/services/api';
import { HashtagTrend, User } from '@/types/explore';
import VerifiedBadge from '../common/VerifiedBadge';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search } from 'lucide-react';

export const RightPanel: React.FC = () => {
    const [trends, setTrends] = useState<HashtagTrend[]>([]);
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [trendsData, suggestionsData] = await Promise.all([
                    exploreService.getTrending(),
                    exploreService.getSuggestions()
                ]);
                setTrends(trendsData);
                setSuggestions(suggestionsData);
            } catch (error) {
                console.error('Failed to load right panel data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    if (loading) {
        return (
            <aside className="hidden lg:block w-80 sticky top-0 h-screen p-4 space-y-4">
                <div className="bg-gray-50/50 dark:bg-zinc-900/30 rounded-2xl p-4 h-48 animate-pulse border border-gray-100 dark:border-zinc-800/50 backdrop-blur-sm"></div>
                <div className="bg-gray-50/50 dark:bg-zinc-900/30 rounded-2xl p-4 h-48 animate-pulse border border-gray-100 dark:border-zinc-800/50 backdrop-blur-sm"></div>
            </aside>
        );
    }

    return (
        <aside className="hidden lg:block w-[350px] sticky top-0 h-screen p-3 space-y-4 overflow-y-auto custom-scrollbar">
            {/* Search Header */}
            <form onSubmit={handleSearch} className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl py-1 z-10 -mx-3 px-3 mb-3">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search Twizzle"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#EFF3F4] dark:bg-[#202327] border-none rounded-full py-3 pl-12 pr-5 text-[15px] text-gray-900 dark:text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white dark:focus:bg-black transition-all duration-200"
                    />
                </div>
            </form>

            {/* Trends Section */}
            <div className="bg-[#F7F9F9] dark:bg-[#16181C] rounded-2xl overflow-hidden border border-transparent dark:border-zinc-800/30">
                <h2 className="font-extrabold text-xl px-4 py-3 text-gray-900 dark:text-[#E7E9EA]">Trends for you</h2>
                <div className="flex flex-col">
                    {trends.slice(0, 5).map((trend) => (
                        <Link
                            key={trend.tag}
                            href={`/explore?q=${encodeURIComponent('#' + trend.tag)}`}
                            className="block px-4 py-3 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-all duration-200 group relative"
                        >
                            <div className="flex justify-between items-start">
                                <div className="min-w-0">
                                    <p className="text-[#536471] dark:text-[#71767B] text-[13px]">Trending</p>
                                    <p className="font-bold text-[15px] text-gray-900 dark:text-[#E7E9EA] truncate">#{trend.tag}</p>
                                    <p className="text-[#536471] dark:text-[#71767B] text-[13px]">{trend.count} posts</p>
                                </div>
                                <button className="p-2 hover:bg-blue-500/10 rounded-full text-[#536471] hover:text-blue-500 transition-colors shrink-0">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></svg>
                                </button>
                            </div>
                        </Link>
                    ))}
                    <Link href="/explore" className="block px-4 py-4 text-blue-500 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors text-[15px]">
                        Show more
                    </Link>
                </div>
            </div>

            {/* Who to follow Section */}
            <div className="bg-[#F7F9F9] dark:bg-[#16181C] rounded-2xl overflow-hidden border border-transparent dark:border-zinc-800/30">
                <h2 className="font-extrabold text-xl px-4 py-3 text-gray-900 dark:text-[#E7E9EA]">Who to follow</h2>
                <div className="flex flex-col">
                    {suggestions.slice(0, 3).map((user) => (
                        <div key={user.id} className="px-4 py-3 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-all duration-200">
                            <div className="flex items-center justify-between gap-3">
                                <Link href={`/profile/${user.username}`} className="flex items-center space-x-3 min-w-0 group flex-1">
                                    <div className="relative shrink-0">
                                        <img
                                            src={user.avatarUrl || 'https://via.placeholder.com/150'}
                                            alt={user.displayName}
                                            className="w-10 h-10 rounded-full bg-gray-300 dark:bg-zinc-800 object-cover border border-black/5 dark:border-white/5 transition-opacity group-hover:opacity-90"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center space-x-1 truncate">
                                            <p className="font-bold text-[15px] text-gray-900 dark:text-[#E7E9EA] group-hover:underline truncate">
                                                {user.displayName}
                                            </p>
                                            {user.verified && <VerifiedBadge size={14} />}
                                        </div>
                                        <p className="text-[#536471] dark:text-[#71767B] truncate text-[15px]">@{user.username}</p>
                                    </div>
                                </Link>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        exploreService.toggleFollow(user.id);
                                    }}
                                    className="bg-black dark:bg-white text-white dark:text-black text-sm font-bold px-4 py-1.5 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shrink-0"
                                >
                                    Follow
                                </button>
                            </div>
                        </div>
                    ))}
                    <Link href="/explore?filter=people" className="block px-4 py-4 text-blue-500 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors text-[15px]">
                        Show more
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 text-[13px] text-[#536471] dark:text-[#71767B] leading-relaxed flex flex-wrap gap-x-3 gap-y-1">
                <span className="hover:underline cursor-pointer">Terms of Service</span>
                <span className="hover:underline cursor-pointer">Privacy Policy</span>
                <span className="hover:underline cursor-pointer">Cookie Policy</span>
                <span className="hover:underline cursor-pointer">Accessibility</span>
                <span className="hover:underline cursor-pointer">Ads info</span>
                <span className="mt-1 w-full block">© 2026 Twizzle, Inc.</span>
            </div>
        </aside>
    );
};
