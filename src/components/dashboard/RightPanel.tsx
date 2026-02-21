'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Trend, Suggestion } from '@/types';

export const RightPanel: React.FC = () => {
    const [trends, setTrends] = useState<Trend[]>([]);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // 1. Fetch Trends (Public)
            try {
                const trendsRes = await api.get('/trends');
                setTrends(trendsRes.data.data);
            } catch (error) {
                console.error('Failed to load trends', error);
            }

            // 2. Fetch Suggestions (Protected)
            try {
                const suggestionsRes = await api.get('/users/suggestions');
                setSuggestions(suggestionsRes.data.data);
            } catch (error) {
                // If 401, just ignore (user not logged in)
                console.log('Failed to load suggestions (likely auth)', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <aside className="hidden lg:block w-80 sticky top-0 h-screen p-4 space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 h-48 animate-pulse"></div>
                <div className="bg-gray-50 rounded-xl p-4 h-48 animate-pulse"></div>
            </aside>
        );
    }

    return (
        <aside className="hidden lg:block w-80 sticky top-0 h-screen p-4 space-y-4 overflow-y-auto">
            {/* Search Layout Placeholder */}
            <div className="sticky top-0 bg-white py-2 z-10">
                <input
                    type="text"
                    placeholder="Search Twizzle"
                    className="w-full bg-gray-100 border-none rounded-full py-3 px-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
                <h2 className="font-bold text-xl mb-4">Trends for you</h2>
                <div className="space-y-4">
                    {trends.slice(0, 5).map((trend) => (
                        <div key={trend.id} className="cursor-pointer hover:bg-gray-200 p-2 rounded-lg transition-colors">
                            <p className="text-gray-500 text-sm">Trending</p>
                            <p className="font-bold text-gray-900">{trend.name}</p>
                            <p className="text-gray-500 text-sm">{trend.posts} posts</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
                <h2 className="font-bold text-xl mb-4">Who to follow</h2>
                <div className="space-y-4">
                    {suggestions.slice(0, 3).map((user) => (
                        <div key={user._id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <img
                                    src={user.image || 'https://via.placeholder.com/150'}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full bg-gray-300 object-cover"
                                />
                                <div className="min-w-0">
                                    <p className="font-bold text-gray-900 truncate text-sm">{user.name}</p>
                                    <p className="text-gray-500 truncate text-sm">@{user.username}</p>
                                </div>
                            </div>
                            <button className="bg-black text-white text-sm font-bold px-4 py-1.5 rounded-full hover:bg-gray-800">
                                Follow
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};
