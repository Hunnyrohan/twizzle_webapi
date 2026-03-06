'use client';

import React, { useEffect, useState } from 'react';
import { exploreService } from '@/services/api';
import { HashtagTrend, User } from '@/types/explore';
import VerifiedBadge from '../common/VerifiedBadge';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { resolveImageUrl } from '@/lib/media-utils';

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
            <form onSubmit={handleSearch} className="sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-md pt-1 pb-3 z-10 -mx-3 px-3 mb-2">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search Twizzle"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-100 dark:bg-zinc-900 border border-transparent rounded-full py-3 pl-12 pr-5 text-[15px] text-gray-900 dark:text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-black focus:ring-1 focus:ring-blue-500 shadow-sm transition-all duration-300"
                    />
                </div>
            </form>

            {/* Trends Section */}
            <div className="bg-gray-50/80 dark:bg-zinc-900/60 rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 transition-colors shadow-sm mb-4">
                <h2 className="font-extrabold text-[19px] px-4 py-3.5 text-gray-900 dark:text-gray-100 tracking-tight">Trends for you</h2>
                <div className="flex flex-col">
                    {trends.slice(0, 5).map((trend) => (
                        <Link
                            key={trend.tag}
                            href={`/explore?q=${encodeURIComponent('#' + trend.tag)}`}
                            className="block px-4 py-3 hover:bg-gray-200/50 dark:hover:bg-zinc-800/50 transition-colors duration-200 group relative"
                        >
                            <div className="flex justify-between items-start">
                                <div className="min-w-0 flex-1 pr-4">
                                    <p className="text-gray-500 dark:text-gray-400 text-[13px] font-medium tracking-wide">Trending</p>
                                    <p className="font-bold text-[15px] text-gray-900 dark:text-gray-100 truncate mt-0.5 mb-0.5">#{trend.tag}</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-[13px]">{trend.count} posts</p>
                                </div>
                                <button className="p-2 -mr-2 hover:bg-blue-500/10 rounded-full text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-colors shrink-0">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></svg>
                                </button>
                            </div>
                        </Link>
                    ))}
                    <Link href="/explore" className="block px-4 py-4 text-blue-500 hover:bg-gray-200/50 dark:hover:bg-zinc-800/50 transition-colors text-[14px] font-medium rounded-b-2xl">
                        Show more
                    </Link>
                </div>
            </div>

            {/* Who to follow Section */}
            <div className="bg-gray-50/80 dark:bg-zinc-900/60 rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 transition-colors shadow-sm mb-4">
                <h2 className="font-extrabold text-[19px] px-4 py-3.5 text-gray-900 dark:text-gray-100 tracking-tight">Who to follow</h2>
                <div className="flex flex-col">
                    {suggestions.slice(0, 3).map((user) => (
                        <div key={user.id} className="px-4 py-3.5 hover:bg-gray-200/50 dark:hover:bg-zinc-800/50 transition-colors duration-200 cursor-pointer" onClick={() => router.push(`/profile/${user.username}`)}>
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center space-x-3 min-w-0 flex-1">
                                    <div className="relative shrink-0">
                                        <img
                                            src={resolveImageUrl(user.avatarUrl || (user as any).image) || `https://ui-avatars.com/api/?name=${user.displayName}`}
                                            alt={user.displayName}
                                            className="w-11 h-11 rounded-full bg-gray-200 dark:bg-zinc-800 object-cover border border-white dark:border-zinc-900 shadow-sm transition-transform hover:opacity-90"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center space-x-1 truncate">
                                            <p className="font-bold text-[15px] text-gray-900 dark:text-gray-100 hover:underline truncate">
                                                {user.displayName}
                                            </p>
                                            {user.verified && <VerifiedBadge size={14} />}
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 truncate text-[14px]">@{user.username}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        try {
                                            const result = await exploreService.toggleFollow(user.id);
                                            // Update local state to reflect follow status
                                            setSuggestions(prev => prev.map(s =>
                                                s.id === user.id ? { ...s, isFollowing: result.followed } : s
                                            ));
                                        } catch (error) {
                                            console.error('Failed to toggle follow', error);
                                        }
                                    }}
                                    className={`text-sm font-semibold px-4 py-1.5 rounded-full active:scale-95 transition-all outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black shrink-0 ${user.isFollowing
                                            ? "bg-transparent border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-gray-100 hover:border-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 group/btn"
                                            : "bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                                        }`}
                                >
                                    <span className={user.isFollowing ? "group-hover/btn:hidden" : ""}>
                                        {user.isFollowing ? 'Following' : 'Follow'}
                                    </span>
                                    {user.isFollowing && (
                                        <span className="hidden group-hover/btn:inline text-red-600 dark:text-red-500">
                                            Unfollow
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                    <Link href="/explore?filter=people" className="block px-4 py-4 text-blue-500 hover:bg-gray-200/50 dark:hover:bg-zinc-800/50 transition-colors text-[14px] font-medium rounded-b-2xl">
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
