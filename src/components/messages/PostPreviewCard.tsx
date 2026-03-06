'use client';

import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Repeat, ExternalLink } from 'lucide-react';
import { resolveImageUrl } from '@/lib/media-utils';
import api from '@/lib/api';
import { Post } from '@/types';

interface PostPreviewCardProps {
    postId: string;
    isMe: boolean;
}

export const PostPreviewCard: React.FC<PostPreviewCardProps> = ({ postId, isMe }) => {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            // Validation: Ensure ID is a 24-char hex string
            if (!/^[a-f\d]{24}$/i.test(postId)) {
                console.warn(`Invalid postId for preview: ${postId}`);
                setError(true);
                setLoading(false);
                return;
            }

            try {
                const res = await api.get<{ success: boolean; data: Post }>(`/tweets/${postId}`);
                if (res.data?.success) {
                    setPost(res.data.data);
                } else {
                    setError(true);
                }
            } catch (e: any) {
                // If 404, just set error state silently (post was likely deleted)
                if (e.response?.status === 404) {
                    console.log(`Post preview 404: Post ${postId} no longer exists.`);
                } else {
                    console.error('Failed to fetch preview post', e);
                }
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (postId) fetchPost();
        else setLoading(false);
    }, [postId]);

    const handleOpen = () => {
        window.open(`/post/${postId}`, '_blank');
    };

    if (loading) {
        return (
            <div className={`mt-1 rounded-xl overflow-hidden border animate-pulse ${isMe ? 'border-blue-400/40' : 'border-gray-200 dark:border-gray-700'}`} style={{ width: '100%' }}>
                <div className={`p-3 ${isMe ? 'bg-blue-400/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600" />
                        <div>
                            <div className="w-24 h-3 bg-gray-300 dark:bg-gray-600 rounded" />
                            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded mt-1" />
                        </div>
                    </div>
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-700 rounded mt-1.5" />
                </div>
            </div>
        );
    }

    if (error || !post) return null;

    const author = post.author;
    const avatarUrl = resolveImageUrl(author?.image) || `https://ui-avatars.com/api/?name=${author?.name || 'U'}`;

    const mediaUrl = post.media && post.media.length > 0
        ? resolveImageUrl(post.media[0])
        : null;

    return (
        <div
            onClick={handleOpen}
            className={`mt-1 rounded-xl overflow-hidden border cursor-pointer transition-all hover:opacity-90 active:scale-[0.98] ${isMe
                ? 'border-blue-400/40 bg-blue-500/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70'
                }`}
        >
            <div className="p-3">
                {/* Author */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <img
                            src={avatarUrl}
                            alt={author?.name}
                            className="w-7 h-7 rounded-full object-cover bg-gray-200 dark:bg-gray-700 flex-shrink-0"
                        />
                        <div>
                            <p className={`text-xs font-bold leading-tight ${isMe ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                {author?.name}
                            </p>
                            <p className={`text-[10px] ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                                @{author?.username}
                            </p>
                        </div>
                    </div>
                    <ExternalLink size={12} className={isMe ? 'text-blue-100' : 'text-gray-400'} />
                </div>

                {/* Content */}
                {post.content && (
                    <p className={`text-xs leading-relaxed line-clamp-3 ${isMe ? 'text-white/90' : 'text-gray-700 dark:text-gray-300'}`}>
                        {post.content}
                    </p>
                )}

                {/* Media Preview */}
                {mediaUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden">
                        <img
                            src={mediaUrl}
                            alt="post media"
                            className="w-full max-h-36 object-cover"
                        />
                    </div>
                )}

                {/* Stats */}
                <div className={`flex items-center gap-3 mt-2 pt-2 border-t ${isMe ? 'border-blue-400/30' : 'border-gray-200 dark:border-gray-700'}`}>
                    <span className={`flex items-center gap-1 text-[10px] ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                        <Heart size={10} />
                        {post.likesCount ?? 0}
                    </span>
                    <span className={`flex items-center gap-1 text-[10px] ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                        <MessageCircle size={10} />
                        {post.repliesCount ?? 0}
                    </span>
                    <span className={`flex items-center gap-1 text-[10px] ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                        <Repeat size={10} />
                        {post.retweetsCount ?? 0}
                    </span>
                </div>
            </div>
        </div>
    );
};
