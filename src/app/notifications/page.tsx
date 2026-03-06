// frontend/src/app/notifications/page.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { Notification, PaginatedNotifications } from '@/types/notifications';
import { NotificationFilters } from '@/components/notifications/NotificationFilters';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { NotificationSkeleton } from '@/components/notifications/NotificationSkeleton';
import { Loader2, AlertCircle } from 'lucide-react';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [unreadCount, setUnreadCount] = useState(0);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    // Fetch unread count
    const fetchUnreadCount = useCallback(async () => {
        try {
            const res = await api.get<{ success: boolean; data: { count: number } }>(
                '/notifications/unread-count'
            );
            if (res.data.success) {
                setUnreadCount(res.data.data.count);
            }
        } catch (err) {
            console.error('Failed to fetch unread count:', err);
        }
    }, []);

    // Fetch notifications
    const fetchNotifications = useCallback(
        async (filter: string, cursor?: string | null) => {
            try {
                const params: any = { type: filter, limit: 10 };
                if (cursor) {
                    params.cursor = cursor;
                }

                const res = await api.get<{ success: boolean; data: PaginatedNotifications }>(
                    '/notifications',
                    { params }
                );

                if (res.data.success) {
                    const { items, nextCursor: newCursor } = res.data.data;

                    if (cursor) {
                        // Loading more
                        setNotifications((prev) => [...prev, ...items]);
                    } else {
                        // Initial load or filter change
                        setNotifications(items);
                    }

                    setNextCursor(newCursor);
                    setHasMore(!!newCursor);
                }
            } catch (err: any) {
                setError(err.response?.data?.error?.message || 'Failed to load notifications');
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        []
    );

    // Initial load
    useEffect(() => {
        setLoading(true);
        setError(null);
        fetchNotifications(activeFilter);
        fetchUnreadCount();
    }, [activeFilter, fetchNotifications, fetchUnreadCount]);

    // Handle filter change
    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        setNotifications([]);
        setNextCursor(null);
        setHasMore(true);
        setLoading(true);
    };

    // Load more
    const handleLoadMore = () => {
        if (!hasMore || loadingMore) return;
        setLoadingMore(true);
        fetchNotifications(activeFilter, nextCursor);
    };

    // Mark all as read
    const handleMarkAllAsRead = async () => {
        try {
            await api.post('/notifications/read-all');

            // Optimistic update
            setNotifications((prev) =>
                prev.map((notif) => ({ ...notif, isRead: true }))
            );
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all as read:', err);
            // Rollback on error
            fetchNotifications(activeFilter);
            fetchUnreadCount();
        }
    };

    // Mark single as read
    const handleMarkAsRead = async (id: string) => {
        try {
            // Optimistic update
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif._id === id ? { ...notif, isRead: true } : notif
                )
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));

            await api.post(`/notifications/${id}/read`);
        } catch (err) {
            console.error('Failed to mark as read:', err);
            // Rollback on error
            fetchNotifications(activeFilter);
            fetchUnreadCount();
        }
    };

    // Retry on error
    const handleRetry = () => {
        setError(null);
        setLoading(true);
        fetchNotifications(activeFilter);
    };

    return (
        <div className="min-h-screen">
            <NotificationFilters
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                unreadCount={unreadCount}
                onMarkAllAsRead={handleMarkAllAsRead}
            />

            {/* Loading State */}
            {loading && (
                <div>
                    {[...Array(5)].map((_, i) => (
                        <NotificationSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="flex flex-col items-center justify-center py-20 px-4">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        Failed to load notifications
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                    <button
                        onClick={handleRetry}
                        className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Notifications List */}
            {!loading && !error && (
                <>
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                <span className="text-3xl">🔔</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                No notifications yet
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-sm">
                                {activeFilter === 'all'
                                    ? "When you get notifications, they'll show up here."
                                    : `No ${activeFilter} notifications to show.`}
                            </p>
                        </div>
                    ) : (
                        <>
                            {notifications.map((notification) => (
                                <NotificationItem
                                    key={notification._id}
                                    notification={notification}
                                    onMarkAsRead={handleMarkAsRead}
                                />
                            ))}

                            {/* Load More */}
                            {hasMore && (
                                <div className="p-4 flex justify-center border-t border-gray-200 dark:border-gray-800">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                        className="px-6 py-2 text-blue-500 font-medium hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-full transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {loadingMore ? 'Loading...' : 'Load more'}
                                    </button>
                                </div>
                            )}

                            {/* End of list */}
                            {!hasMore && notifications.length > 0 && (
                                <div className="p-8 text-center text-gray-400 dark:text-gray-600 text-sm">
                                    You're all caught up!
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
