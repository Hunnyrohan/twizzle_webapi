'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Image, Smile, MapPin, Calendar, X, Clock } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import api from '@/lib/api';
import { Post } from '@/types';
import { useAuth } from '@/context/AuthContext';
import MentionSuggestions from '../common/MentionSuggestions';
import { User as UserType } from '@/types/explore';
import { resolveImageUrl } from '@/lib/media-utils';

interface ComposeBoxProps {
    onPostCreated: (post: Post) => void;
    user?: { avatarUrl?: string, image?: string, username?: string, name?: string };
    isModal?: boolean;
}

export const ComposeBox: React.FC<ComposeBoxProps> = ({ onPostCreated, user: propUser, isModal = false }) => {
    const { user: authUser } = useAuth();
    const user = propUser || authUser;
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [scheduledDate, setScheduledDate] = useState<string>('');
    const [showSchedulePicker, setShowSchedulePicker] = useState(false);
    const [location, setLocation] = useState<string>("");
    const [isLocating, setIsLocating] = useState(false);

    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const schedulePickerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Mention state
    const [mentionQuery, setMentionQuery] = useState("");
    const [showMentions, setShowMentions] = useState(false);
    const [mentionStartIndex, setMentionStartIndex] = useState(-1);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        const selectionStart = e.target.selectionStart;
        setContent(value);

        // Mention detection logic
        const lastAtIndex = value.lastIndexOf('@', selectionStart - 1);
        if (lastAtIndex !== -1) {
            const textAfterAt = value.substring(lastAtIndex + 1, selectionStart);
            const charBeforeAt = lastAtIndex > 0 ? value[lastAtIndex - 1] : ' ';

            if (charBeforeAt === ' ' || charBeforeAt === '\n') {
                if (!textAfterAt.includes(' ')) {
                    setMentionQuery(textAfterAt);
                    setMentionStartIndex(lastAtIndex);
                    setShowMentions(true);
                    return;
                }
            }
        }
        setShowMentions(false);
    };

    const handleSelectUser = (selectedUser: UserType) => {
        const beforeMention = content.substring(0, mentionStartIndex);
        const afterMention = content.substring(textareaRef.current?.selectionStart || content.length);
        const newContent = `${beforeMention}@${selectedUser.username} ${afterMention}`;
        setContent(newContent);
        setShowMentions(false);

        // Focus back to textarea
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                const newPos = beforeMention.length + selectedUser.username.length + 2; // +1 for @, +1 for space
                textareaRef.current.setSelectionRange(newPos, newPos);
            }
        }, 0);
    };

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

    const addEmoji = (emojiData: EmojiClickData) => {
        setContent(prev => prev + emojiData.emoji);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
            if (schedulePickerRef.current && !schedulePickerRef.current.contains(event.target as Node)) {
                setShowSchedulePicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLocationClick = () => {
        if (location) {
            setLocation("");
            return;
        }

        if ("geolocation" in navigator) {
            setIsLocating(true);

            const locationTimeout = setTimeout(() => {
                if (isLocating) {
                    setIsLocating(false);
                    alert("Location request timed out. Please check permissions.");
                }
            }, 10000);

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    clearTimeout(locationTimeout);
                    setLocation(`Current Location (${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)})`);
                    setIsLocating(false);
                },
                (error) => {
                    clearTimeout(locationTimeout);
                    setIsLocating(false);
                    let msg = "Could not get location.";
                    if (error.code === 1) msg = "Permission denied.";
                    alert(msg);
                },
                { timeout: 10000, enableHighAccuracy: true }
            );
        } else {
            alert("Geolocation is not supported.");
        }
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
                setScheduledDate('');
                setLocation('');
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
        <div
            className={`${isModal ? '' : 'border-b border-gray-200 dark:border-gray-800'} p-4 flex space-x-4 !bg-white dark:!bg-[#15181c] relative z-30`}
        >
            <div className="flex-shrink-0">
                <img
                    src={resolveImageUrl(user?.image) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Guest'}`}
                    alt={user?.name || 'User'}
                    className="w-14 h-14 rounded-full object-cover bg-gray-200 dark:bg-gray-800 ring-2 ring-gray-100 dark:ring-gray-900 shadow-sm transition-transform hover:scale-105"
                />
            </div>
            <div className="flex-1">
                <div className="relative">
                    <textarea
                        ref={textareaRef}
                        className="w-full text-2xl placeholder-gray-500 border-none focus:ring-0 outline-none resize-none min-h-[160px] bg-transparent text-gray-900 dark:text-white font-medium lead-relaxed"
                        placeholder="What's happening?"
                        value={content}
                        onChange={handleContentChange}
                    />
                    {showMentions && (
                        <MentionSuggestions
                            query={mentionQuery}
                            onSelect={handleSelectUser}
                            onClose={() => setShowMentions(false)}
                        />
                    )}
                </div>

                {/* Status Indicators */}
                <div className="flex flex-col gap-2 mb-2">
                    {scheduledDate && (
                        <div className="flex items-center gap-2 text-blue-500 text-sm py-1 px-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg w-fit">
                            <Clock className="w-4 h-4" />
                            <span>Schedule: {new Date(scheduledDate).toLocaleString()}</span>
                            <button onClick={() => setScheduledDate("")} className="ml-1 text-blue-300 hover:text-blue-500 cursor-pointer">
                                <X size={14} />
                            </button>
                        </div>
                    )}
                    {location && (
                        <div className="flex items-center gap-2 text-blue-500 text-sm py-1 px-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg w-fit">
                            <MapPin className="w-4 h-4" />
                            <span>{location}</span>
                            <button onClick={() => setLocation("")} className="ml-1 text-blue-300 hover:text-blue-500 cursor-pointer">
                                <X size={14} />
                            </button>
                        </div>
                    )}
                </div>

                {imagePreview && (
                    <div className="relative mt-2 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                        <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-80 object-cover" />
                        <button
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                <div className={`flex items-center justify-between mt-6 ${isModal ? '' : 'border-t border-gray-100 dark:border-gray-800 pt-2'} relative`}>
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
                            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors cursor-pointer"
                        >
                            <Image size={20} />
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowEmojiPicker(!showEmojiPicker);
                                    setShowSchedulePicker(false);
                                }}
                                className={`p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors cursor-pointer ${showEmojiPicker ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                            >
                                <Smile size={20} />
                            </button>
                            {showEmojiPicker && (
                                <div ref={emojiPickerRef} className="absolute bottom-12 left-0 z-[100] shadow-2xl">
                                    <EmojiPicker
                                        onEmojiClick={addEmoji}
                                        theme={'auto' as any}
                                        width={320}
                                        height={450}
                                        previewConfig={{ showPreview: false }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowSchedulePicker(!showSchedulePicker);
                                    setShowEmojiPicker(false);
                                }}
                                className={`p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors cursor-pointer ${scheduledDate ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                            >
                                <Calendar size={20} />
                            </button>
                            {showSchedulePicker && (
                                <div ref={schedulePickerRef} className="absolute bottom-12 left-0 z-[100] p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl min-w-[280px]">
                                    <div className="flex flex-col gap-3 text-gray-900 dark:text-white">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold">Schedule post</span>
                                            <button onClick={() => setShowSchedulePicker(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer transition-colors">
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <input
                                            type="datetime-local"
                                            value={scheduledDate}
                                            onChange={(e) => setScheduledDate(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1d9bf0] cursor-pointer"
                                        />
                                        <button
                                            className="w-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold py-2 px-4 rounded-full mt-2 cursor-pointer transition-all disabled:opacity-50"
                                            onClick={() => setShowSchedulePicker(false)}
                                            disabled={!scheduledDate}
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleLocationClick}
                            disabled={isLocating}
                            className={`p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors cursor-pointer ${location ? 'bg-blue-50 dark:bg-blue-900/20' : ''} ${isLocating ? 'animate-pulse' : ''}`}
                        >
                            <MapPin size={20} />
                        </button>
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
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
