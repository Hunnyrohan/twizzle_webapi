'use client';

import React, { useState, useRef } from 'react';
import { Image, Smile, MapPin, Calendar, X } from 'lucide-react';
import api from '@/lib/api';
import { Post } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface ComposeBoxProps {
    onPostCreated: (post: Post) => void;
    user?: { avatarUrl?: string, image?: string, username?: string, name?: string };
}

export const ComposeBox: React.FC<ComposeBoxProps> = ({ onPostCreated, user: propUser }) => {
    const { user: authUser } = useAuth();
    const user = propUser || authUser;
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const charLimit = 280;
    const isOverLimit = content.length > charLimit;
    const isEmpty = content.trim().length === 0 && !image;

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const addEmoji = (emoji: string) => {
        setContent(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    const handleSubmit = async () => {
        if (isEmpty || isOverLimit) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('content', content);
            if (image) {
                formData.append('media', image);
            }

            const res = await api.post<{ success: boolean, data: Post }>('/tweets', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data.success) {
                onPostCreated(res.data.data);
                setContent('');
                handleRemoveImage();
            }
        } catch (error) {
            console.error('Failed to create post', error);
            alert('Failed to post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex space-x-4 bg-white dark:bg-black">
            <div className="flex-shrink-0">
                <img
                    src={user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Guest'}`}
                    alt={user?.name || 'User'}
                    className="w-12 h-12 rounded-full object-cover bg-gray-200 dark:bg-gray-800"
                />
            </div>
            <div className="flex-1">
                <textarea
                    className="w-full text-xl placeholder-gray-500 border-none focus:ring-0 resize-none h-24 bg-transparent text-gray-900 dark:text-white"
                    placeholder="What's happening?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                {imagePreview && (
                    <div className="relative mt-2 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                        <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-80 object-cover" />
                        <button
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-between mt-2 border-t border-gray-100 dark:border-gray-800 pt-2 relative">
                    <div className="flex space-x-2 text-blue-400">
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageSelect}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                        >
                            <Image size={20} />
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                            >
                                <Smile size={20} />
                            </button>
                            {showEmojiPicker && (
                                <div className="absolute bottom-full left-0 mb-2 p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl flex flex-wrap w-48 z-50">
                                    {['😀', '😂', '😍', '🤔', '🔥', '🚀', '💯', '✨', '🙏', '🙌', '💙', '✅'].map(emoji => (
                                        <button
                                            key={emoji}
                                            onClick={() => addEmoji(emoji)}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-xl"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"><Calendar size={20} /></button>
                        <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"><MapPin size={20} /></button>
                    </div>
                    <div className="flex items-center space-x-4">
                        {content.length > 0 && (
                            <div className="flex items-center">
                                <span className={`text-sm ${isOverLimit ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                    {charLimit - content.length}
                                </span>
                                <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-3"></div>
                            </div>
                        )}
                        <button
                            onClick={handleSubmit}
                            disabled={isEmpty || isOverLimit || loading}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
