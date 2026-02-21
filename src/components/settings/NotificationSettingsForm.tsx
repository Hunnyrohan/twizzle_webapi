'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { Switch } from '@/components/ui/switch'; // Assuming we have a Switch component or will create simple toggle

// Simple Switch implementation if not exists
const SimpleSwitch = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (c: boolean) => void }) => (
    <div
        onClick={() => onCheckedChange(!checked)}
        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
    >
        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${checked ? 'translate-x-5' : ''}`} />
    </div>
);

interface NotificationSettingsFormProps {
    settings: any;
}

export const NotificationSettingsForm: React.FC<NotificationSettingsFormProps> = ({ settings }) => {
    const [notifications, setNotifications] = useState(settings?.notifications || {
        likes: true,
        comments: true,
        follows: true,
        mentions: true,
        messages: true
    });

    const handleToggle = async (key: string) => {
        const newState = { ...notifications, [key]: !notifications[key] };
        setNotifications(newState);
        try {
            await api.patch('/settings/me', { notifications: newState });
        } catch (error) {
            console.error('Failed to update notifications', error);
        }
    };

    return (
        <div className="space-y-6 max-w-xl">
            <h2 className="text-xl font-bold mb-4">Notifications</h2>
            <div className="space-y-4">
                {Object.keys(notifications).map((key) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                        <span className="capitalize font-medium">{key}</span>
                        <SimpleSwitch
                            checked={notifications[key]}
                            onCheckedChange={() => handleToggle(key)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
