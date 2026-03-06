"use client";

import { useState, useRef, useEffect } from "react";
import { Image as ImageIcon, Smile, Calendar, MapPin, BarChart2, X, Clock } from "lucide-react";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import MentionSuggestions from '../common/MentionSuggestions';
import { User as UserType } from '@/types/explore';
import { resolveImageUrl } from '@/lib/media-utils';

export function PostComposer() {
    const { user } = useAuth();
    const [content, setContent] = useState("");
    const [scheduledDate, setScheduledDate] = useState<string>("");
    const [showSchedulePicker, setShowSchedulePicker] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Mention state
    const [mentionQuery, setMentionQuery] = useState("");
    const [showMentions, setShowMentions] = useState(false);
    const [mentionStartIndex, setMentionStartIndex] = useState(-1);

    const [location, setLocation] = useState<string>("");
    const [isLocating, setIsLocating] = useState(false);

    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const schedulePickerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        const selectionStart = e.target.selectionStart;
        setContent(value);

        // Mention detection logic
        const lastAtIndex = value.lastIndexOf('@', selectionStart - 1);
        if (lastAtIndex !== -1) {
            const textAfterAt = value.substring(lastAtIndex + 1, selectionStart);
            // Check if there's a space or another trigger character before the @
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

    const handleSubmit = async () => {
        // TODO: Implement post creation logic with scheduledDate and location
        console.log("Posting:", { content, scheduledDate, location });
        setContent("");
        setScheduledDate("");
        setLocation("");
        setShowSchedulePicker(false);
        setShowEmojiPicker(false);
    };

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setContent((prev) => prev + emojiData.emoji);
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

            // Timeout after 10 seconds
            const locationTimeout = setTimeout(() => {
                if (isLocating) {
                    setIsLocating(false);
                    alert("Location request timed out. Please check your browser permissions.");
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
                    console.error("Error getting location:", error);
                    setIsLocating(false);
                    let message = "Could not get location.";
                    if (error.code === 1) message = "Permission denied. Please allow location access in your browser settings.";
                    else if (error.code === 2) message = "Location unavailable.";
                    else if (error.code === 3) message = "Location request timed out.";
                    alert(message);
                },
                { timeout: 10000, enableHighAccuracy: true }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    return (
        <div className="border-b border-gray-200 dark:border-gray-800 p-4">
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    <img
                        src={resolveImageUrl(user?.image) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Guest'}`}
                        alt={user?.name || 'User'}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1">
                    <div className="relative">
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={handleContentChange}
                            placeholder="What is happening?!"
                            className="w-full bg-transparent text-xl placeholder-gray-500 border-none outline-none resize-none min-h-[50px] py-2"
                            rows={2}
                        />

                        {showMentions && (
                            <MentionSuggestions
                                query={mentionQuery}
                                onSelect={handleSelectUser}
                                onClose={() => setShowMentions(false)}
                            />
                        )}
                    </div>

                    {/* Schedule Display */}
                    {scheduledDate && (
                        <div className="flex items-center gap-2 text-blue-500 text-sm mb-2 px-1">
                            <Clock className="w-4 h-4" />
                            <span>Will post on {new Date(scheduledDate).toLocaleString()}</span>
                            <button onClick={() => setScheduledDate("")} className="ml-auto p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-red-500">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Location Display */}
                    {location && (
                        <div className="flex items-center gap-2 text-blue-500 text-sm mb-2 px-1">
                            <MapPin className="w-4 h-4" />
                            <span>{location}</span>
                            <button onClick={() => setLocation("")} className="ml-auto p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-red-500">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {content && (
                        <div className="border-b border-gray-200 dark:border-gray-800 my-2"></div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-[#1d9bf0] relative">
                            {/* Emoji Picker Popover */}
                            {showEmojiPicker && (
                                <div ref={emojiPickerRef} className="absolute bottom-12 left-0 z-[100] shadow-2xl">
                                    <EmojiPicker
                                        onEmojiClick={onEmojiClick}
                                        theme={'auto' as any}
                                        lazyLoadEmojis={false}
                                        width={320}
                                        height={450}
                                        searchDisabled={false}
                                        skinTonesDisabled={true}
                                        previewConfig={{ showPreview: false }}
                                    />
                                </div>
                            )}

                            {/* Schedule Picker Popover */}
                            {showSchedulePicker && (
                                <div ref={schedulePickerRef} className="absolute bottom-12 left-0 z-[100] p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl min-w-[280px]">
                                    <div className="flex flex-col gap-3 text-gray-900 dark:text-white">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold">Schedule post</span>
                                            <button onClick={() => setShowSchedulePicker(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer transition-colors">
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500">Select date and time</p>
                                            <input
                                                type="datetime-local"
                                                value={scheduledDate}
                                                onChange={(e) => setScheduledDate(e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1d9bf0] cursor-pointer"
                                            />
                                        </div>
                                        <Button
                                            size="sm"
                                            className="w-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold h-10 rounded-full mt-2 cursor-pointer"
                                            onClick={() => setShowSchedulePicker(false)}
                                            disabled={!scheduledDate}
                                        >
                                            Confirm
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors relative group cursor-pointer">
                                <ImageIcon className="w-5 h-5" />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Media</span>
                            </button>
                            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors relative group cursor-pointer">
                                <span className="border border-current rounded-sm text-[10px] w-5 h-5 flex items-center justify-center font-bold">GIF</span>
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">GIF</span>
                            </button>
                            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors relative group cursor-pointer">
                                <BarChart2 className="w-5 h-5" />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">Poll</span>
                            </button>
                            <button
                                onClick={() => {
                                    setShowEmojiPicker(!showEmojiPicker);
                                    setShowSchedulePicker(false);
                                }}
                                className={`p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors relative group cursor-pointer ${showEmojiPicker ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                            >
                                <Smile className="w-5 h-5" />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">Emoji</span>
                            </button>
                            <button
                                onClick={() => {
                                    setShowSchedulePicker(!showSchedulePicker);
                                    setShowEmojiPicker(false);
                                }}
                                className={`p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors relative group cursor-pointer ${scheduledDate ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                            >
                                <Calendar className="w-5 h-5" />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">Schedule</span>
                            </button>

                            <button
                                onClick={handleLocationClick}
                                disabled={isLocating}
                                className={`p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors relative group cursor-pointer ${location ? 'bg-blue-50 dark:bg-blue-900/20' : ''} ${isLocating ? 'animate-pulse' : ''}`}
                            >
                                <MapPin className={`w-5 h-5 ${isLocating ? 'text-gray-400' : ''}`} />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                    {isLocating ? 'Locating...' : 'Location'}
                                </span>
                            </button>
                        </div>
                        <Button
                            onClick={handleSubmit}
                            className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white rounded-full font-bold px-6 py-1.5 h-auto opacity-100 disabled:opacity-50"
                            disabled={!content.trim()}
                        >
                            Post
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
