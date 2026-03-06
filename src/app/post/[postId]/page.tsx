'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Post, User } from '@/types';
import { PostCard } from '@/components/dashboard/PostCard';
import { CommentsList } from '@/components/post/CommentsList';
import { PostDetailSkeleton } from '@/components/post/PostDetailSkeleton';
import { ArrowLeft } from 'lucide-react';

export default function PostDetailPage() {
    const params = useParams();
    const router = useRouter();
    const postId = params.postId as string;

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        // Load current user from local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setCurrentUser(JSON.parse(storedUser));
            } catch (e) { console.error('Failed to parse user', e); }
        }

        const fetchPost = async () => {
            setLoading(true);
            try {
                const res = await api.get<{ success: boolean; data: Post }>(`/tweets/${postId}`);
                setPost(res.data.data);
            } catch (err: any) {
                console.error('Failed to fetch post', err);
                setError(err.response?.status === 404 ? 'Post not found' : 'Failed to load post');
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            fetchPost();
        }
    }, [postId]);

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-100 dark:border-gray-800">
                    <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
                        {error === 'Post not found' ? 'Hmm... this post doesn’t exist.' : 'Something went wrong.'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Try searching for something else.
                    </p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-600 transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            {/* Header */}
            <div className="sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-md px-4 py-3 border-b border-gray-200 dark:border-gray-800 z-10 flex items-center space-x-4 text-gray-900 dark:text-white">
                <Link
                    href="/dashboard"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors flex items-center justify-center text-gray-900 dark:text-white"
                    aria-label="Back"
                    onClick={(e) => {
                        // If we have history, use it to preserve scroll pos, 
                        // otherwise let the Link handle navigation to /dashboard
                        if (typeof window !== 'undefined' && window.history.length > 1) {
                            e.preventDefault();
                            router.back();
                        }
                    }}
                >
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-xl font-bold">Post</h1>
            </div>

            {loading ? (
                <PostDetailSkeleton />
            ) : post ? (
                <>
                    <PostCard post={post} isDetail={true} />
                    <CommentsList postId={post._id} currentUser={currentUser} />
                </>
            ) : null}
        </div>
    );
}
