'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Repeat, Share, MoreHorizontal, Trash2 } from 'lucide-react';
import { Post } from '@/types';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

import { useRouter } from 'next/navigation';

interface PostCardProps {
    post: Post & { isBookmarked?: boolean };
    isDetail?: boolean;
    onToggleBookmark?: (isBookmarked: boolean) => void;
    onDelete?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post: initialPost, isDetail = false, onToggleBookmark, onDelete }) => {
    const { user: authUser } = useAuth();
    // Initialize state with backend data if available, falling back to old props or false
    const [post, setPost] = useState({
        ...initialPost,
        isLiked: initialPost.isLiked ?? initialPost.hasLiked ?? false,
        isRetweeted: initialPost.isRetweeted ?? initialPost.hasRetweeted ?? false,
        isBookmarked: initialPost.isBookmarked ?? false
    });

    useEffect(() => {
        setPost({
            ...initialPost,
            isLiked: initialPost.isLiked ?? initialPost.hasLiked ?? false,
            isRetweeted: initialPost.isRetweeted ?? initialPost.hasRetweeted ?? false,
            isBookmarked: initialPost.isBookmarked ?? false
        });
    }, [initialPost]);

    const [liking, setLiking] = useState(false);
    const [reposting, setReposting] = useState(false);
    const [bookmarking, setBookmarking] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isOwner = authUser?.id === (post.author._id || (post.author as any).id) ||
        (authUser as any)?._id === post.author._id;

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (deleting) return;

        if (window.confirm('Are you sure you want to delete this post?')) {
            setDeleting(true);
            try {
                await api.delete(`/tweets/${post._id}`);
                if (onDelete) {
                    onDelete(post._id);
                }
                if (isDetail) {
                    router.push('/dashboard');
                }
            } catch (error) {
                console.error('Failed to delete post', error);
                alert('Failed to delete post');
            } finally {
                setDeleting(false);
                setShowMenu(false);
            }
        }
    };

    const handleCardClick = () => {
        if (!isDetail) {
            router.push(`/post/${post._id}`);
        }
    };

    // Derive initial hasLiked/hasRetweeted from prop if available, or assume false
    // ideally backend sends this tailored to user

    const handleLike = async () => {
        if (liking) return;

        // Optimistic update
        const previousState = { ...post };
        const currentlyLiked = post.isLiked;

        setPost(prev => ({
            ...prev,
            likesCount: (prev.isLiked ? prev.likesCount - 1 : prev.likesCount + 1),
            isLiked: !prev.isLiked
        }));

        setLiking(true);
        try {
            if (currentlyLiked) {
                await api.delete(`/tweets/${post._id}/like`);
            } else {
                await api.post(`/tweets/${post._id}/like`);
            }
        } catch (error) {
            // Revert if failed
            setPost(previousState);
            console.error('Failed to like post', error);
        } finally {
            setLiking(false);
        }
    };

    const handleRepost = async () => {
        if (reposting) return;

        // Optimistic update
        const previousState = { ...post };
        setPost(prev => ({
            ...prev,
            retweetsCount: prev.isRetweeted ? prev.retweetsCount - 1 : prev.retweetsCount + 1,
            isRetweeted: !prev.isRetweeted
        }));
        setReposting(true);

        try {
            // Backend might have toggle or separate endpoints. 
            // The provided routes show: router.post('/:id/retweet', ...)
            // It doesn't show delete retweet.
            await api.post(`/tweets/${post._id}/retweet`);
        } catch (error) {
            setPost(previousState);
            console.error('Failed to repost', error);
        } finally {
            setReposting(false);
        }
    };

    const timeAgo = post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 'just now';
    const author = post.author || {};
    const image = post.media && post.media.length > 0 ? `http://localhost:5000/uploads/${post.media[0]}` : null;

    return (
        <div
            onClick={handleCardClick}
            className={`border-b border-gray-200 dark:border-gray-800 p-4 transition-colors ${!isDetail ? 'hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer' : 'bg-white dark:bg-black'}`}
        >
            {post.retweetOf && (
                <div className="flex items-center space-x-2 text-gray-500 text-sm mb-2 ml-12">
                    <Repeat size={14} /> <span>Reposted</span>
                </div>
            )}
            <div className="flex space-x-4">
                <div className="flex-shrink-0">
                    <img
                        src={author.image || 'https://via.placeholder.com/150'}
                        alt={author.name}
                        className="w-12 h-12 rounded-full object-cover bg-gray-300 dark:bg-gray-800"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 truncate">
                            <span className="font-bold text-gray-900 dark:text-white">{author.name || 'Unknown'}</span>
                            <span className="text-gray-500 text-sm">@{author.username || 'user'}</span>
                            <span className="text-gray-500 text-sm whitespace-nowrap">· {timeAgo}</span>
                        </div>
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                                className="text-gray-400 hover:text-blue-500 rounded-full p-2 hover:bg-blue-50 transition-colors"
                            >
                                <MoreHorizontal size={20} />
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden">
                                    {isOwner ? (
                                        <button
                                            onClick={handleDelete}
                                            disabled={deleting}
                                            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                                        >
                                            <Trash2 size={18} />
                                            <span className="font-medium">{deleting ? 'Deleting...' : 'Delete Post'}</span>
                                        </button>
                                    ) : (
                                        <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left font-medium">
                                            <span>Not interested</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <p className={`text-gray-900 dark:text-white mt-1 whitespace-pre-wrap break-words ${isDetail ? 'text-xl mt-4 leading-normal' : 'text-lg'}`}>
                        {post.content}
                    </p>

                    {image && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                            <img src={image} alt="Post content" className="w-full h-auto" />
                        </div>
                    )}

                    <div className="flex justify-between mt-3 text-gray-500 max-w-md w-full">
                        {/* Wrapper div restricted width? Original code had max-w-md, let's keep it but ensure full width for spacing */}

                        <button className="flex items-center space-x-2 hover:text-blue-500 group">
                            <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                                <MessageCircle size={20} />
                            </div>
                            <span className="text-sm">{post.repliesCount > 0 ? post.repliesCount : ''}</span>
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); handleRepost(); }}
                            className={`flex items-center space-x-2 group ${post.isRetweeted ? 'text-green-500' : 'hover:text-green-500'}`}
                        >
                            <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
                                <Repeat size={20} />
                            </div>
                            <span className="text-sm">{post.retweetsCount > 0 ? post.retweetsCount : ''}</span>
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); handleLike(); }}
                            className={`flex items-center space-x-2 group ${post.isLiked ? 'text-pink-600' : 'hover:text-pink-600'}`}
                        >
                            <div className="p-2 rounded-full group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 transition-colors">
                                <Heart size={20} fill={post.isLiked ? 'currentColor' : 'none'} />
                            </div>
                            <span className="text-sm">{post.likesCount > 0 ? post.likesCount : ''}</span>
                        </button>

                        <button className="flex items-center space-x-2 hover:text-blue-500 group">
                            <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                                <Share size={20} />
                            </div>
                        </button>

                        {/* Bookmark Button */}
                        <button
                            onClick={async (e) => {
                                e.stopPropagation();
                                if (bookmarking) return;
                                const prevState = post.isBookmarked;
                                setPost(prev => ({ ...prev, isBookmarked: !prev.isBookmarked }));
                                setBookmarking(true);
                                try {
                                    // Need to import messageService or api service for bookmark
                                    // But PostCard uses `api` direct import.
                                    // Let's use `api` call directly or import `messageService` from existing location if it had it, but `bookmarks` is new.
                                    // I'll use the `messageService` object which I extended in `api.ts` IF I extended `messageService` ... wait.
                                    // I added `toggleBookmark` to `messageService` export in `api.ts` in step 193? 
                                    // No, I added it to `messageService` object in `api.ts`? 
                                    // Let's check `api.ts` update content from last step.
                                    // matches: `    // Bookmarks \n toggleBookmark: ...` inside `messageService = { ... }`.
                                    // So I should import `messageService` from `@/services/api`.

                                    // Wait, PostCard imports `api` from `@/lib/api`. 
                                    // But `api.ts` in `services/api.ts` export `messageService`. 
                                    // `src/lib/api` is different?
                                    // `c:\Users\Acer\Documents\Web project 5th sem\twizzle_webapi\src\services\api.ts` is where I added it.
                                    // `PostCard.tsx` imports `api` from `@/lib/api`.
                                    // I might have mismatch. I'll check `@/lib/api` existence.
                                    // If `@/lib/api` exists, I should use that or update PostCard to use `services/api`.
                                    // Step 155 View File showed `import api from '@/lib/api';`
                                    // Step 31 View File `services/api.ts` showed `export default api;`.
                                    // It seems `lib/api` might be an alias or duplicate?
                                    // I'll check `tsconfig` path or just try to use `services/api` in PostCard logic.
                                    // For now, I'll use the `api` instance available in `PostCard` (which is axios instance) and call endpoint directly
                                    // `/tweets/${post._id}/bookmark`.

                                    const { data } = await api.post(`/tweets/${post._id}/bookmark`);
                                    if (onToggleBookmark) onToggleBookmark(data.data.isBookmarked);
                                } catch (e) {
                                    console.error(e);
                                    setPost(prev => ({ ...prev, isBookmarked: prevState }));
                                } finally {
                                    setBookmarking(false);
                                }
                            }}
                            className={`flex items-center space-x-2 group ${post.isBookmarked ? 'text-blue-500' : 'hover:text-blue-500'}`}
                        >
                            <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill={post.isBookmarked ? "currentColor" : "none"}
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
