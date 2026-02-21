// frontend/src/components/notifications/NotificationItem.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Notification } from '@/types/notifications';
import { formatRelativeTime } from '@/utils/time';
import {
    Heart,
    UserPlus,
    AtSign,
    MessageCircle,
    Repeat,
    Send,
    Bookmark
} from 'lucide-react';

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    onMarkAsRead,
}) => {
    const router = useRouter();

    const getActionText = () => {
        switch (notification.type) {
            case 'like':
                return 'liked your post';
            case 'follow':
                return 'followed you';
            case 'mention':
                return 'mentioned you in a post';
            case 'comment':
                return 'commented on your post';
            case 'repost':
                return 'reposted your post';
            case 'message':
                return 'sent you a message';
            case 'bookmark':
                return 'bookmarked your post';
            default:
                return 'interacted with you';
        }
    };

    const getIcon = () => {
        const iconClass = "w-4 h-4";
        switch (notification.type) {
            case 'like':
                return <Heart className={`${iconClass} text-red-500`} fill="currentColor" />;
            case 'follow':
                return <UserPlus className={`${iconClass} text-blue-500`} />;
            case 'mention':
                return <AtSign className={`${iconClass} text-purple-500`} />;
            case 'comment':
                return <MessageCircle className={`${iconClass} text-green-500`} />;
            case 'repost':
                return <Repeat className={`${iconClass} text-blue-400`} />;
            case 'message':
                return <Send className={`${iconClass} text-sky-500`} />;
            case 'bookmark':
                return <Bookmark className={`${iconClass} text-orange-500`} />;
            default:
                return null; // Or a default icon if preferred
        }
    };

    const handleClick = () => {
        if (!notification.isRead) {
            onMarkAsRead(notification._id);
        }

        // Navigate based on type
        if (notification.type === 'follow') {
            router.push(`/profile/${notification.actor.username}`);
        } else if (notification.type === 'message') {
            router.push('/messages');
        } else if (notification.postPreview) {
            router.push(`/post/${notification.postPreview._id}`);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`p-4 border-b border-gray-200 dark:border-gray-800 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                }`}
        >
            <div className="flex gap-3">
                {/* Actor Avatar */}
                <div className="flex-shrink-0">
                    {notification.actor.image ? (
                        <img
                            src={notification.actor.image}
                            alt={notification.actor.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                            {notification.actor.name[0].toUpperCase()}
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                        <div className="mt-1">{getIcon()}</div>
                        <div className="flex-1">
                            <p className="text-sm">
                                <span className="font-bold text-black dark:text-white">
                                    {notification.actor.name}
                                </span>{' '}
                                <span className="text-gray-600 dark:text-gray-400">
                                    @{notification.actor.username}
                                </span>{' '}
                                <span className="text-gray-700 dark:text-gray-300">
                                    {getActionText()}
                                </span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatRelativeTime(notification.createdAt)}
                            </p>

                            {/* Post Preview */}
                            {notification.postPreview && (
                                <div className="mt-2 p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                        {notification.postPreview.content}
                                    </p>
                                    {notification.postPreview.image && (
                                        <img
                                            src={`http://localhost:5000/uploads/${notification.postPreview.image}`}
                                            alt="Post preview"
                                            className="mt-2 rounded-lg w-20 h-20 object-cover"
                                        />
                                    )}
                                </div>
                            )}

                            {/* Comment Text */}
                            {notification.commentText && (
                                <div className="mt-2 p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                        "{notification.commentText}"
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Unread indicator */}
                    {!notification.isRead && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
