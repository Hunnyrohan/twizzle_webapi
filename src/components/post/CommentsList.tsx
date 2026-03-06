import React, { useEffect, useState } from 'react';
import { Comment, User } from '@/types';
import api from '@/lib/api';
import { CommentItem } from './CommentItem';
import { CommentComposer } from './CommentComposer';
import { Loader2 } from 'lucide-react';

interface CommentsListProps {
    postId: string;
    currentUser: User | null;
}

export const CommentsList: React.FC<CommentsListProps> = ({ postId, currentUser }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);

    const fetchComments = async (cursor?: string) => {
        try {
            const params: any = { limit: 10 };
            if (cursor) params.cursor = cursor;

            const res = await api.get<{ success: boolean; data: { items: Comment[]; nextCursor: string | null } }>(`/tweets/${postId}/comments`, { params });

            if (cursor) {
                setComments(prev => [...prev, ...res.data.data.items]);
            } else {
                setComments(res.data.data.items);
            }
            setNextCursor(res.data.data.nextCursor);
        } catch (error) {
            console.error('Failed to fetch comments', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleLoadMore = () => {
        if (nextCursor) {
            setLoadingMore(true);
            fetchComments(nextCursor);
        }
    };

    const handleCommentAdded = (newComment: Comment) => {
        setComments(prev => [newComment, ...prev]);
    };

    return (
        <div>
            <CommentComposer postId={postId} currentUser={currentUser} onCommentAdded={handleCommentAdded} />

            {loading ? (
                <div className="p-8 text-center flex justify-center">
                    <Loader2 className="animate-spin text-blue-500" />
                </div>
            ) : comments.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No comments yet. Be the first to reply!
                </div>
            ) : (
                <div>
                    {comments.map(comment => (
                        <CommentItem key={comment._id} comment={comment} />
                    ))}

                    {nextCursor && (
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="w-full p-4 text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-center disabled:opacity-50"
                        >
                            {loadingMore ? 'Loading...' : 'Show more replies'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
