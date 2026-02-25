'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Bell, Heart, MessageCircle, UserPlus, AtSign, Mail } from 'lucide-react';

const RefinedSwitch = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (c: boolean) => void }) => (
    <div
        onClick={() => onCheckedChange(!checked)}
        className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ease-in-out
            ${checked ? 'bg-[#1d9bf0]' : 'bg-gray-200 dark:bg-zinc-800'}`}
    >
        <motion.div
            animate={{ x: checked ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="bg-white w-5 h-5 rounded-full shadow-md"
        />
    </div>
);

interface NotificationSettingsFormProps {
    settings: any;
}

const iconMap: Record<string, any> = {
    likes: Heart,
    comments: MessageCircle,
    follows: UserPlus,
    mentions: AtSign,
    messages: Mail
};

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
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 max-w-2xl"
        >
            <div className="space-y-1">
                <div className="flex items-center space-x-2.5 text-[#1d9bf0] mb-1">
                    <Bell size={20} strokeWidth={3} />
                    <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Push Notifications</h2>
                </div>
                <p className="text-sm text-gray-500 font-medium tracking-tight">Stay updated with real-time alerts.</p>
            </div>

            <div className="space-y-4">
                {Object.keys(notifications).map((key) => {
                    const Icon = iconMap[key] || Bell;
                    return (
                        <div key={key} className="flex items-center justify-between p-5 bg-gray-50/50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-2xl hover:bg-white dark:hover:bg-zinc-900 transition-all group">
                            <div className="flex items-center space-x-4 text-gray-400 group-hover:text-[#1d9bf0] transition-colors">
                                <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm group-hover:border-[#1d9bf0]/20 transition-all">
                                    <Icon size={18} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <span className="capitalize font-bold text-gray-900 dark:text-white tracking-tight">{key}</span>
                                    <p className="text-xs text-gray-400 font-medium tracking-wide">Relevant updates about your {key}</p>
                                </div>
                            </div>
                            <RefinedSwitch
                                checked={notifications[key]}
                                onCheckedChange={() => handleToggle(key)}
                            />
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};
