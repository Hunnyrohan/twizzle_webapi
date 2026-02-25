'use client';

import React, { useEffect, useState } from 'react';
import { PostCard } from '@/components/dashboard/PostCard';
import { messageService } from '@/services/api';
import { Post } from '@/types';
import { Bookmark, Loader2 } from 'lucide-react';

// Extended type for this page
type BookmarkedPost = Post & { isBookmarked: boolean };

export default function BookmarksPage() {
    const [posts, setPosts] = useState<BookmarkedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('user');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUsername(JSON.parse(storedUser).username);
            } catch (e) { }
        }
        fetchBookmarks();
    }, []);

    const fetchBookmarks = async () => {
        try {
            setLoading(true);
            const data = await messageService.getBookmarks();
            setPosts(data.items);
        } catch (error) {
            console.error('Failed to fetch bookmarks', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnbookmark = (postId: string) => {
        // Immediate removal from list
        setPosts(prev => prev.filter(p => p._id !== postId));
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <div className="sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-md z-10 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Bookmarks</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">@{username}</p>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-8 text-center max-w-sm mx-auto">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-full mb-6">
                        <Bookmark size={48} className="text-blue-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Save posts for later</h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Don’t let the good ones fly away! Bookmark Tweets to easily find them again in the future.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {posts.map(post => (
                        <PostCard
                            key={post._id}
                            post={post}
                            onToggleBookmark={(isBookmarked) => {
                                if (!isBookmarked) handleUnbookmark(post._id);
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
