'use client';

import React from 'react';
import { Home, Hash, Bell, Mail, User, Settings, LogOut, MoreHorizontal, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { messageService, notificationService } from '@/services/api';
import { useModal } from '@/context/ModalContext';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { resolveImageUrl } from '@/lib/media-utils';

interface SidebarProps {
    user?: { name: string; username: string };
}

export const Sidebar: React.FC<SidebarProps> = () => {
    // Always read directly from AuthContext — never use local state for user data
    const { user } = useAuth();
    const [unreadMessages, setUnreadMessages] = React.useState(0);
    const [unreadNotifications, setUnreadNotifications] = React.useState(0);
    const { openPostModal } = useModal();
    const pathname = usePathname();

    React.useEffect(() => {
        const fetchUnread = async () => {
            try {
                const [msgCount, notifCount] = await Promise.all([
                    messageService.getUnreadCount(),
                    notificationService.getUnreadCount()
                ]);
                setUnreadMessages(msgCount);
                setUnreadNotifications(notifCount);
            } catch (err) {
                console.error('Failed to fetch unread counts', err);
            }
        };

        fetchUnread();
        const interval = setInterval(fetchUnread, 30000);
        return () => clearInterval(interval);
    }, []);

    const navItems = [
        { icon: Home, label: 'Home', href: '/dashboard' },
        { icon: Hash, label: 'Explore', href: '/explore' },
        { icon: Bell, label: 'Notifications', href: '/notifications' },
        { icon: Mail, label: 'Messages', href: '/messages' },
        { icon: Bookmark, label: 'Bookmarks', href: '/bookmarks' },
        { icon: User, label: 'Profile', href: '/profile' },
        { icon: Settings, label: 'Settings', href: '/settings' },
    ];

    const avatarUrl = resolveImageUrl((user as any)?.image) ||
        (user ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}` : undefined);

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-gray-200 dark:border-gray-800 px-4 py-6 bg-white dark:bg-black">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-blue-500 px-4">Twizzle</h1>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center space-x-4 px-4 py-3 text-xl font-medium rounded-full transition-colors ${pathname === item.href
                            ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/10'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900'
                            }`}
                    >
                        <item.icon className="w-7 h-7" />
                        <span className="relative">
                            {item.label}
                            {item.label === 'Messages' && unreadMessages > 0 && (
                                <span className="absolute -top-1 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[11px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-black">
                                    {unreadMessages > 9 ? '9+' : unreadMessages}
                                </span>
                            )}
                            {item.label === 'Notifications' && unreadNotifications > 0 && (
                                <span className="absolute -top-1 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[11px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-black">
                                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                </span>
                            )}
                        </span>
                    </Link>
                ))}
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                    }}
                    className="flex items-center space-x-4 px-4 py-3 text-xl font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors w-full text-left cursor-pointer"
                >
                    <LogOut className="w-7 h-7" />
                    <span>Logout</span>
                </button>
            </nav>

            <button
                onClick={openPostModal}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg text-lg w-full mb-8 cursor-pointer transition-all active:scale-95"
            >
                Post
            </button>

            {user && (
                <Link
                    href={`/profile/${user.username}`}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full cursor-pointer mt-auto transition-colors"
                >
                    <img
                        src={avatarUrl}
                        alt={user.name}
                        className="w-10 h-10 rounded-full flex-shrink-0 object-cover bg-gray-200 dark:bg-gray-800 border dark:border-gray-700"
                        onError={(e) => {
                            // Fallback if image fails to load
                            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;
                        }}
                    />
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-gray-500 truncate text-sm">@{user.username}</p>
                    </div>
                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </Link>
            )}
        </aside>
    );
};
