import React from 'react';
import { Comment } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { resolveImageUrl } from '@/lib/media-utils';
import api from '@/lib/api';

interface CommentItemProps {
    comment: Comment;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
    const author = comment.author || {};
    const timeAgo = comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'just now';

    // Simple like logic (can be expanded like PostCard)
    const handleLike = async () => {
        // Implement if needed
    };

    return (
        <div className="flex space-x-3 p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
            <Link href={`/profile/${author.username}`} className="flex-shrink-0">
                <img
                    src={resolveImageUrl(author.image) || 'https://via.placeholder.com/150'}
                    alt={author.name}
                    className="w-10 h-10 rounded-full object-cover"
                />
            </Link>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                        <Link href={`/profile/${author.username}`} className="font-bold text-gray-900 dark:text-white hover:underline">
                            {author.name}
                        </Link>
                        {author.username && <span className="text-gray-500">@{author.username}</span>}
                        <span className="text-gray-500">· {timeAgo}</span>
                    </div>
                </div>
                <p className="text-gray-900 dark:text-gray-100 mt-1 whitespace-pre-wrap break-words text-base">
                    {comment.content}
                </p>

                {/* Actions (simplified) */}
                <div className="flex items-center space-x-12 mt-2 text-gray-500 text-sm">
                    <button className="flex items-center space-x-2 hover:text-pink-600 group">
                        <div className="p-1 rounded-full group-hover:bg-pink-50">
                            <Heart size={16} fill={comment.isLiked ? 'currentColor' : 'none'} className={comment.isLiked ? 'text-pink-600' : ''} />
                        </div>
                        <span>{comment.likesCount > 0 ? comment.likesCount : ''}</span>
                    </button>
                    {/* Add reply/more buttons if needed */}
                </div>
            </div>
        </div>
    );
};
