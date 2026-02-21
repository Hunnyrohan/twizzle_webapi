import React, { useState } from 'react';
import api from '@/lib/api';
import { Loader2, Send } from 'lucide-react';
import { User, Comment } from '@/types';

interface CommentComposerProps {
    postId: string;
    currentUser: User | null;
    onCommentAdded: (comment: Comment) => void;
}

export const CommentComposer: React.FC<CommentComposerProps> = ({ postId, currentUser, onCommentAdded }) => {
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const maxLength = 280;
    const isOverLimit = content.length > maxLength;
    const isEmpty = content.trim().length === 0;

    const handleSubmit = async () => {
        if (isEmpty || isOverLimit || submitting) return;

        setSubmitting(true);
        try {
            const res = await api.post<{ success: boolean; data: Comment }>(`/tweets/${postId}/comments`, { content });
            onCommentAdded(res.data.data);
            setContent('');
        } catch (error) {
            console.error('Failed to post comment', error);
            // Could add toast error here
        } finally {
            setSubmitting(false);
        }
    };

    if (!currentUser) {
        return (
            <div className="p-4 border-b border-gray-200 bg-gray-50 text-center text-gray-500">
                Please login to comment.
            </div>
        );
    }

    return (
        <div className="p-4 border-b border-gray-200 flex space-x-3">
            <div className="flex-shrink-0">
                <img
                    src={currentUser.image || 'https://via.placeholder.com/150'}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                />
            </div>
            <div className="flex-1">
                <textarea
                    className="w-full border-none focus:ring-0 resize-none text-lg placeholder-gray-500 min-h-[80px]"
                    placeholder="Post your reply"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="flex justify-between items-center mt-2 border-t border-gray-100 pt-2">
                    <div className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-gray-400'}`}>
                        {content.length}/{maxLength}
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={isEmpty || isOverLimit || submitting}
                        className="bg-blue-500 text-white px-4 py-1.5 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors flex items-center"
                    >
                        {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Reply'}
                    </button>
                </div>
            </div>
        </div>
    );
};
