import React from 'react';
import { Message } from '@/types/messages';
import { format } from 'date-fns';
import { Check, CheckCheck, Phone, Video as VideoIcon, PhoneMissed } from 'lucide-react';
import { PostPreviewCard } from './PostPreviewCard';

interface MessageBubbleProps {
    message: Message;
    isMe: boolean;
    showAvatar?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe, showAvatar }) => {
    // Detect shared post link: capture the 24-character hex ID at the end of a /post/ URL
    const sharedPostId = (() => {
        // Look for /post/ followed by exactly 24 hex characters
        const match = message.text?.match(/\/post\/([a-f0-9]{24})/i);
        return match ? match[1] : null;
    })();
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

    return (
        <div className={`flex w-full mb-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl break-words relative shadow-sm transition-all hover:shadow-md ${isMe
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-bl-none'
                    }`}
            >
                {message.attachments && message.attachments.length > 0 && (
                    <div className={`grid gap-1 mb-2 ${message.attachments.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {message.attachments.map((url, i) => (
                            <img
                                key={i}
                                src={url.startsWith('blob:') ? url : `http://localhost:5000/uploads/${url}`}
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

                {/* Post preview card for shared posts */}
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
    );
};
