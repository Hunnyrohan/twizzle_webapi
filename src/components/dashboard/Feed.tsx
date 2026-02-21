'use client';

import React, { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { Post } from '@/types';
import { PostCard } from './PostCard';
import { ComposeBox } from './ComposeBox';
import { Loader2 } from 'lucide-react';

export const Feed: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);

    const fetchPosts = useCallback(async (pageNum: number) => {
        try {
            // Backend uses page & limit
            const res = await api.get<{ success: boolean, data: Post[] }>('/tweets', {
                params: { page: pageNum, limit: 10 }
            });
            return res.data.data;
        } catch (err: any) {
            throw new Error(err.message || 'Failed to fetch posts');
        }
    }, []);

    // Initial load
    useEffect(() => {
        const loadInitial = async () => {
            try {
                const data = await fetchPosts(1);
                setPosts(data);
                if (data.length < 10) setHasMore(false);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadInitial();
    }, [fetchPosts]);

    const loadMore = async () => {
        if (!hasMore || fetchingMore) return;

        setFetchingMore(true);
        const nextPage = page + 1;
        try {
            const data = await fetchPosts(nextPage);
            if (data.length === 0) {
                setHasMore(false);
            } else {
                setPosts(prev => [...prev, ...data]);
                setPage(nextPage);
                if (data.length < 10) setHasMore(false);
            }
        } catch (err: any) {
            console.error('Failed to load more', err);
        } finally {
            setFetchingMore(false);
        }
    };

    const handlePostCreated = (newPost: Post) => {
        setPosts(prev => [newPost, ...prev]);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-8 rounded-lg text-center m-4">
                <p className="font-bold">Error loading feed</p>
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-red-100 px-4 py-2 rounded-full hover:bg-red-200 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="border-x border-gray-200 dark:border-gray-800 min-h-screen bg-white dark:bg-black">
            <div className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-4 z-10">
                <h2 className="text-xl font-bold cursor-pointer text-gray-900 dark:text-white" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</h2>
            </div>

            <ComposeBox onPostCreated={handlePostCreated} />

            <div>
                {posts.map((post) => (
                    <PostCard
                        key={post._id}
                        post={post}
                        onDelete={(postId) => setPosts(prev => prev.filter(p => p._id !== postId))}
                    />
                ))}
            </div>

            {posts.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-xl font-bold">Welcome to Twizzle!</p>
                    <p>Be the first to post something.</p>
                </div>
            )}

            {hasMore && (
                <div className="p-4 flex justify-center border-t border-gray-100">
                    <button
                        onClick={loadMore}
                        disabled={fetchingMore}
                        className="text-blue-500 font-bold hover:bg-blue-50 px-6 py-2 rounded-full transition-colors flex items-center disabled:opacity-50"
                    >
                        {fetchingMore ? <Loader2 className="animate-spin mr-2" /> : null}
                        {fetchingMore ? 'Loading...' : 'Show more'}
                    </button>
                </div>
            )}

            {!hasMore && posts.length > 0 && (
                <div className="p-8 text-center text-gray-400 text-sm">
                    You've reached the end!
                </div>
            )}
        </div>
    );
};
