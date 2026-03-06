import React, { useState } from 'react';
import { Message } from '@/types/messages';
import { format } from 'date-fns';
import { Check, CheckCheck, Phone, Video as VideoIcon, PhoneMissed, MoreVertical, Trash2 } from 'lucide-react';
import { PostPreviewCard } from './PostPreviewCard';
import { messageService } from '@/services/api';
import Link from 'next/link';
import { resolveImageUrl } from '@/lib/media-utils';

interface MessageBubbleProps {
    message: Message;
    isMe: boolean;
    showAvatar?: boolean;
    onDelete?: (messageId: string, type: 'me' | 'everyone') => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe, showAvatar, onDelete }) => {
    // Helper to get sender info
    const sender = typeof message.senderId === 'object' ? message.senderId : null;
    const senderName = (sender as any)?.name || 'User';
    const senderUsername = (sender as any)?.username || 'user';
    const senderImage = (sender as any)?.image;
    const [showMenu, setShowMenu] = useState(false);

    // Detect shared post link
    const sharedPostId = (() => {
        const match = message.text?.match(/\/post\/([a-f0-9]{24})/i);
        return match ? match[1] : null;
    })();

    const handleDeleteClick = async (type: 'me' | 'everyone') => {
        const confirmMsg = type === 'everyone'
            ? "Unsend this message for everyone?"
            : "Remove this message for you?";

        if (window.confirm(confirmMsg)) {
            try {
                const messageId = message._id || message.id;
                await messageService.deleteMessage(messageId, type);
                if (onDelete) onDelete(messageId, type);
                setShowMenu(false);
            } catch (err) {
                console.error('Failed to delete message:', err);
                alert('Failed to delete message');
            }
        }
    };

    if (message.type === 'call') {
        const isMissed = message.callData?.status === 'missed';
        const isVideo = message.callData?.type === 'video';
        const duration = message.callData?.duration;

        const formatDuration = (s: number) => {
            const mins = Math.floor(s / 60);
            const secs = s % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        };

        return (
            <div className={`flex w-full mb-3 justify-center`}>
                <div className="bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-full flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    {isMissed ? (
                        <PhoneMissed size={16} className="text-red-500" />
                    ) : (
                        isVideo ? <VideoIcon size={16} className="text-blue-500" /> : <Phone size={16} className="text-blue-500" />
                    )}
                    <span>
                        {isVideo ? 'Video' : 'Voice'} call {isMissed ? 'missed' : 'ended'}
                        {duration && !isMissed && ` • ${formatDuration(duration)}`}
                    </span>
                    <span className="text-[10px] opacity-60 ml-2">
                        {format(new Date(message.createdAt), 'h:mm a')}
                    </span>
                </div>
            </div>
        );
    }

    if (message.isDeletedEveryone) {
        return (
            <div className={`flex w-full mb-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[75%] px-4 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 italic text-gray-400 text-sm">
                    This message was removed
                </div>
            </div>
        );
    }

    return (
        <div className={`flex w-full mb-3 group ${isMe ? 'justify-end' : 'justify-start items-end gap-2'}`}>
            {!isMe && (
                <div className="w-8 h-8 flex-shrink-0">
                    {showAvatar && (
                        <Link href={`/profile/${senderUsername}`}>
                            <img
                                src={resolveImageUrl(senderImage) || `https://ui-avatars.com/api/?name=${senderName}`}
                                alt={senderName}
                                className="w-8 h-8 rounded-full object-cover hover:opacity-80 transition-opacity"
                            />
                        </Link>
                    )}
                </div>
            )}
            <div className={`flex items-center gap-1 ${isMe ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Menu trigger - only visible on hover */}
                <div className={`relative ${showMenu ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400"
                    >
                        <MoreVertical size={16} />
                    </button>

                    {showMenu && (
                        <div className={`absolute bottom-full mb-2 z-50 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl py-1 min-w-[160px] ${isMe ? 'right-0' : 'left-0'}`}>
                            <button
                                onClick={() => handleDeleteClick('me')}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2"
                            >
                                <Trash2 size={14} /> Remove for me
                            </button>
                            {isMe && (
                                <button
                                    onClick={() => handleDeleteClick('everyone')}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-red-500 flex items-center gap-2"
                                >
                                    <Trash2 size={14} /> Unsend for everyone
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div
                    className={`max-w-[100%] px-4 py-2.5 rounded-2xl break-words relative shadow-sm transition-all hover:shadow-md ${isMe
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-bl-none'
                        }`}
                >
                    {message.attachments && message.attachments.length > 0 && (
                        <div className={`grid gap-1 mb-2 ${message.attachments.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {message.attachments.map((url, i) => (
                                <img
                                    key={i}
                                    src={resolveImageUrl(url)}
                                    alt="attachment"
                                    className="rounded-xl w-full object-cover max-h-64 cursor-pointer hover:opacity-95 transition-opacity"
                                />
                            ))}
                        </div>
                    )}
                    {message.text && !sharedPostId && (
                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap selection:bg-blue-200 selection:text-blue-900">
                            {message.text}
                        </p>
                    )}

                    {sharedPostId && (
                        <PostPreviewCard postId={sharedPostId} isMe={isMe} />
                    )}

                    <div className={`flex items-center justify-end space-x-1 mt-1 opacity-70 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                        <span className="text-[10px] font-medium uppercase tracking-tighter">
                            {format(new Date(message.createdAt), 'h:mm a')}
                        </span>
                        {isMe && (
                            <span className="ml-0.5">
                                {message.status === 'seen'
                                    ? <CheckCheck size={12} className="text-white" />
                                    : <Check size={12} className="text-blue-100" />
                                }
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
