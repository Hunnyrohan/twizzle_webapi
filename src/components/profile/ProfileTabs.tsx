'use client';

import React from 'react';

interface ProfileTabsProps {
    activeTab: 'posts' | 'replies' | 'media' | 'likes';
    onTabChange: (tab: 'posts' | 'replies' | 'media' | 'likes') => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'posts', label: 'Posts' },
        { id: 'replies', label: 'Replies' },
        { id: 'media', label: 'Media' },
        { id: 'likes', label: 'Likes' },
    ] as const;

    return (
        <div className="flex border-b border-gray-200 dark:border-gray-800">
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex-1 text-center py-4 font-medium cursor-pointer transition-colors relative hover:bg-gray-50 dark:hover:bg-gray-900 ${activeTab === tab.id
                            ? 'text-black dark:text-white font-bold'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    {tab.label}
                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-blue-500 rounded-full" />
                    )}
                </div>
            ))}
        </div>
    );
};
