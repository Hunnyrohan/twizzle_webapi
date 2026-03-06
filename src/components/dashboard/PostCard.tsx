'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Repeat, Share, MoreHorizontal, Trash2, Link as LinkIcon, Send, Share2, Ban } from 'lucide-react';
import { Post } from '@/types';
import api, { blockService } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import VerifiedBadge from '../common/VerifiedBadge';
import { ShareDirectMessageModal } from './ShareDirectMessageModal';
import { resolveImageUrl } from '@/lib/media-utils';

interface PostCardProps {
    post: Post & { isBookmarked?: boolean };
    isDetail?: boolean;
    onToggleBookmark?: (isBookmarked: boolean) => void;
    onDelete?: (postId: string) => void;
    onBlockUser?: (userId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post: initialPost, isDetail = false, onToggleBookmark, onDelete, onBlockUser }) => {
    const { user: authUser } = useAuth();

    const [post, setPost] = useState({
        ...initialPost,
        isLiked: initialPost.isLiked ?? (initialPost as any).hasLiked ?? false,
        isRetweeted: initialPost.isRetweeted ?? (initialPost as any).hasRetweeted ?? false,
        isBookmarked: initialPost.isBookmarked ?? false
    });

    useEffect(() => {
        // Preserve locally-tracked interaction flags so optimistic updates
        // are NOT reverted when the parent re-renders with the same data.
        setPost(prev => ({
            ...initialPost,
            isLiked: prev.isLiked,
            isRetweeted: prev.isRetweeted,
            isBookmarked: prev.isBookmarked,
        }));
    }, [initialPost]);

    const [liking, setLiking] = useState(false);
    const [reposting, setReposting] = useState(false);
    const [bookmarking, setBookmarking] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [showShareDMModal, setShowShareDMModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const shareMenuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
            if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
                setShowShareMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // For retweets: display the ORIGINAL tweet's content, author, and media.
    const isRetweet = !!(post as any).retweetOf;
    const originalTweet = isRetweet ? (post as any).retweetOf : null;
    const retweeter = (post.author || {}) as any;

    const displayedAuthor = (isRetweet && originalTweet?.author) ? originalTweet.author : retweeter;
    const displayedContent = (isRetweet && originalTweet) ? originalTweet.content : (post as any).content;
    const displayedMedia: string[] = (isRetweet && originalTweet?.media) ? originalTweet.media : (post.media || []);
    const displayedCreatedAt = (isRetweet && originalTweet?.createdAt) ? originalTweet.createdAt : post.createdAt;

    const timeAgo = displayedCreatedAt
        ? formatDistanceToNow(new Date(displayedCreatedAt), { addSuffix: true })
        : 'just now';
    const image = displayedMedia.length > 0 ? resolveImageUrl(displayedMedia[0]) : null;

    const safePostId = post._id || (post as any).id;

    const isOwner = authUser?.id === (post.author._id || (post.author as any).id) ||
        (authUser as any)?._id === post.author._id;

    const handleCardClick = () => {
        if (!isDetail && safePostId) {
            router.push(`/post/${safePostId}`);
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (deleting || !safePostId) return;
        if (window.confirm('Are you sure you want to delete this post?')) {
            setDeleting(true);
            try {
                await api.delete(`/tweets/${safePostId}`);
                if (onDelete) onDelete(safePostId);
            } catch (error) {
                console.error('Failed to delete post', error);
                alert('Failed to delete post');
            } finally {
                setDeleting(false);
            }
        }
    };

    const handleBlock = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!safePostId || !post.author._id) return;
        if (window.confirm(`Are you sure you want to block @${displayedAuthor.username}?`)) {
            try {
                await blockService.toggleBlock(post.author._id);
                alert(`User @${displayedAuthor.username} blocked.`);
                setShowMenu(false);
                if (onBlockUser) {
                    onBlockUser(post.author._id);
                } else if (onDelete) {
                    onDelete(safePostId);
                }
            } catch (error) {
                console.error('Failed to block user', error);
                alert('Failed to block user');
            }
        }
    };

    const handleCopyLink = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(`${window.location.origin}/post/${safePostId}`);
        setShowShareMenu(false);
    };

    const handleSystemShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await (navigator as any).share({ url: `${window.location.origin}/post/${safePostId}`, title: 'Check out this post on Twizzle' });
        } catch { }
        setShowShareMenu(false);
    };

    const handleLike = async () => {
        if (liking) return;
        const previousState = { ...post };
        const currentlyLiked = post.isLiked;
        setPost(prev => ({ ...prev, likesCount: prev.isLiked ? prev.likesCount - 1 : prev.likesCount + 1, isLiked: !prev.isLiked }));
        setLiking(true);
        try {
            if (currentlyLiked) {
                await api.delete(`/tweets/${safePostId}/like`);
            } else {
                await api.post(`/tweets/${safePostId}/like`);
            }
        } catch (error) {
            setPost(previousState);
            console.error('Failed to like post', error);
        } finally {
            setLiking(false);
        }
    };

    const handleRepost = async () => {
        if (reposting) return;
        const previousState = { ...post };
        setPost(prev => ({
            ...prev,
            retweetsCount: prev.isRetweeted ? prev.retweetsCount - 1 : prev.retweetsCount + 1,
            isRetweeted: !prev.isRetweeted
        }));
        setReposting(true);
        try {
            // Backend toggle: POST handles both retweet & unretweet
            await api.post(`/tweets/${safePostId}/retweet`);
        } catch (error) {
            setPost(previousState);
            console.error('Failed to repost', error);
        } finally {
            setReposting(false);
        }
    };

    return (
        <div
            onClick={handleCardClick}
            className={`border-b border-gray-200 dark:border-gray-800 p-4 transition-colors ${!isDetail ? 'hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer' : 'bg-white dark:bg-black'}`}
        >
            {/* Retweet header: shows who retweeted */}
            {isRetweet && (
                <div className="flex items-center space-x-2 text-gray-500 text-sm mb-2 ml-12">
                    <Repeat size={14} />
                    <span>
                        <Link href={`/profile/${retweeter.username}`} onClick={(e) => e.stopPropagation()} className="font-semibold hover:underline">
                            {retweeter.name || `@${retweeter.username}`}
                        </Link>
                        {' '}Reposted
                    </span>
                </div>
            )}
            <div className="flex space-x-4">
                {/* Original author avatar */}
                <div className="flex-shrink-0">
                    <Link href={`/profile/${displayedAuthor.username}`} onClick={(e) => e.stopPropagation()} className="block group">
                        <img
                            src={resolveImageUrl(displayedAuthor.image || displayedAuthor.avatarUrl) || 'https://via.placeholder.com/150'}
                            alt={displayedAuthor.name}
                            className="w-12 h-12 rounded-full object-cover bg-gray-300 dark:bg-gray-800 group-hover:brightness-90 transition-all"
                        />
                    </Link>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 truncate">
                            {/* Original author name */}
                            <Link href={`/profile/${displayedAuthor.username}`} onClick={(e) => e.stopPropagation()} className="flex items-center space-x-1 hover:underline decoration-1 underline-offset-2 truncate">
                                <span className="font-bold text-gray-900 dark:text-white truncate">
                                    {displayedAuthor.name || displayedAuthor.displayName || 'Unknown'}
                                </span>
                                {displayedAuthor.isVerified && <VerifiedBadge className="ml-1" size={16} />}
                            </Link>
                            <Link href={`/profile/${displayedAuthor.username}`} onClick={(e) => e.stopPropagation()} className="text-gray-500 text-sm truncate">
                                @{displayedAuthor.username || 'user'}
                            </Link>
                            <span className="text-gray-500 text-sm whitespace-nowrap">· {timeAgo}</span>
                        </div>
                        <div className="relative" ref={menuRef}>
                            <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="text-gray-400 hover:text-blue-500 rounded-full p-2 hover:bg-blue-50 transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden">
                                    {isOwner ? (
                                        <button onClick={handleDelete} disabled={deleting} className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left">
                                            <Trash2 size={18} />
                                            <span className="font-medium">{deleting ? 'Deleting...' : 'Delete Post'}</span>
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowMenu(false);
                                                    if (onDelete) onDelete(safePostId);
                                                }}
                                                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left font-medium"
                                            >
                                                <span>Not interested</span>
                                            </button>
                                            <button onClick={handleBlock} className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left font-medium">
                                                <Ban size={18} />
                                                <span>Block account</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Original tweet content */}
                    <p className={`text-gray-900 dark:text-white mt-1 whitespace-pre-wrap break-words ${isDetail ? 'text-xl mt-4 leading-normal' : 'text-lg'}`}>
                        {displayedContent}
                    </p>

                    {image && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                            <img src={image} alt="Post content" className="w-full h-auto" />
                        </div>
                    )}

                    <div className="flex justify-between mt-3 text-gray-500 max-w-md w-full">
                        <button className="flex items-center space-x-2 hover:text-blue-500 group cursor-pointer">
                            <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                                <MessageCircle size={20} />
                            </div>
                            <span className="text-sm">{post.repliesCount > 0 ? post.repliesCount : ''}</span>
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); handleRepost(); }}
                            className={`flex items-center space-x-2 group cursor-pointer ${post.isRetweeted ? 'text-green-500' : 'hover:text-green-500'}`}
                        >
                            <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
                                <Repeat size={20} />
                            </div>
                            <span className="text-sm">{post.retweetsCount > 0 ? post.retweetsCount : ''}</span>
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); handleLike(); }}
                            className={`flex items-center space-x-2 group cursor-pointer ${post.isLiked ? 'text-pink-600' : 'hover:text-pink-600'}`}
                        >
                            <div className="p-2 rounded-full group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 transition-colors">
                                <Heart size={20} fill={post.isLiked ? 'currentColor' : 'none'} />
                            </div>
                            <span className="text-sm">{post.likesCount > 0 ? post.likesCount : ''}</span>
                        </button>

                        <div className="relative" ref={shareMenuRef}>
                            <button onClick={(e) => { e.stopPropagation(); setShowShareMenu(!showShareMenu); }} className="flex items-center space-x-2 hover:text-blue-500 group cursor-pointer">
                                <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                                    <Share size={20} />
                                </div>
                            </button>
                            {showShareMenu && (
                                <div className="absolute left-0 bottom-full mb-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 z-[60] overflow-hidden py-1">
                                    <button onClick={handleCopyLink} className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
                                        <LinkIcon size={18} className="text-gray-500" />
                                        <span className="text-gray-900 dark:text-white font-medium">Copy link to post</span>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); setShowShareMenu(false); setShowShareDMModal(true); }} className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left cursor-pointer">
                                        <Send size={18} className="text-gray-500" />
                                        <span className="text-gray-900 dark:text-white font-medium">Send via Direct Message</span>
                                    </button>
                                    {typeof navigator !== 'undefined' && (navigator as any).share && (
                                        <button onClick={handleSystemShare} className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
                                            <Share2 size={18} className="text-gray-500" />
                                            <span className="text-gray-900 dark:text-white font-medium">Share post via...</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bookmark Button */}
                        <button
                            onClick={async (e) => {
                                e.stopPropagation();
                                if (bookmarking) return;
                                const prevState = post.isBookmarked;
                                setPost(prev => ({ ...prev, isBookmarked: !prev.isBookmarked }));
                                setBookmarking(true);
                                try {
                                    const { data } = await api.post(`/tweets/${post._id}/bookmark`);
                                    if (onToggleBookmark) onToggleBookmark(data.data.isBookmarked);
                                } catch (e) {
                                    console.error(e);
                                    setPost(prev => ({ ...prev, isBookmarked: prevState }));
                                } finally {
                                    setBookmarking(false);
                                }
                            }}
                            className={`flex items-center space-x-2 group cursor-pointer ${post.isBookmarked ? 'text-blue-500' : 'hover:text-blue-500'}`}
                        >
                            <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill={post.isBookmarked ? "currentColor" : "none"}
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                >
                                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            {showShareDMModal && (
                <ShareDirectMessageModal
                    postUrl={`${window.location.origin}/post/${safePostId}`}
                    onClose={() => setShowShareDMModal(false)}
                />
            )}
        </div>
    );
};
