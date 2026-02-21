'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { RightSidebar } from '@/components/dashboard/RightSidebar';
import { PostCard } from '@/components/dashboard/PostCard';
import { messageService } from '@/services/api';
import { Post } from '@/types'; // Import generic Post
import { Bookmark } from 'lucide-react';

// Extended type for this page
type BookmarkedPost = Post & { isBookmarked: boolean };

export default function BookmarksPage() {
    const [posts, setPosts] = useState<BookmarkedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [cursor, setCursor] = useState<string | null>(null);
    const [username, setUsername] = useState('user');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUsername(JSON.parse(storedUser).username);
            } catch (e) { }
        }
    }, []);

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const fetchBookmarks = async () => {
        try {
            setLoading(true);
            const data = await messageService.getBookmarks();
            setPosts(data.items);
            setCursor(data.nextCursor || null);
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
        <div className="flex min-h-screen bg-white">
            <Sidebar />

            <main className="flex-1 border-r border-gray-200 max-w-[600px]">
                <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-200 px-4 py-3">
                    <h1 className="text-xl font-bold text-gray-900">Bookmarks</h1>
                    <p className="text-sm text-gray-500">@{username}</p>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading saved posts...</div>
                ) : posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                        <div className="bg-blue-50 p-4 rounded-full mb-4 text-blue-500">
                            <Bookmark size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Save posts for later</h2>
                        <p className="text-gray-500 mb-8 max-w-xs">
                            Don’t let the good ones fly away! Bookmark Tweets to easily find them again in the future.
                        </p>
                    </div>
                ) : (
                    <div>
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
            </main>

            <div className="hidden lg:block w-[350px]">
                <RightSidebar />
            </div>
        </div>
    );
}
