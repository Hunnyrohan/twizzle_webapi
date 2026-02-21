// frontend/src/components/notifications/NotificationFilters.tsx
'use client';

import React from 'react';
import { NotificationType } from '@/types/notifications';

interface NotificationFiltersProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
    unreadCount: number;
    onMarkAllAsRead: () => void;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
    activeFilter,
    onFilterChange,
    unreadCount,
    onMarkAllAsRead,
}) => {
    const filters = [
        { id: 'all', label: 'All' },
        { id: 'mentions', label: 'Mentions' },
        { id: 'likes', label: 'Likes' },
        { id: 'follows', label: 'Follows' },
        { id: 'comments', label: 'Comments' },
        { id: 'bookmarks', label: 'Bookmarks' },
    ];

    return (
        <div className="sticky top-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 z-10">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">Notifications</h1>
                    {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-xs font-bold text-white bg-blue-500 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={onMarkAllAsRead}
                        className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex overflow-x-auto scrollbar-hide">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => onFilterChange(filter.id)}
                        className={`flex-shrink-0 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeFilter === filter.id
                            ? 'border-blue-500 text-blue-500'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
