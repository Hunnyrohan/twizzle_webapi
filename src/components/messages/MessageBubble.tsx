import React from 'react';
import { Message } from '@/types/messages';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
    message: Message;
    isMe: boolean;
    showAvatar?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe, showAvatar }) => {
    return (
        <div className={`flex w-full mb-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl break-words relative shadow-sm transition-all hover:shadow-md ${isMe
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-bl-none'
                    }`}
            >
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap selection:bg-blue-200 selection:text-blue-900">
                    {message.text}
                </p>

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
