'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, MessageSquare, Ban, UserX, ChevronDown } from 'lucide-react';

interface PrivacySettingsFormProps {
    settings: any;
}

export const PrivacySettingsForm: React.FC<PrivacySettingsFormProps> = ({ settings }) => {
    const [privacy, setPrivacy] = useState(settings?.privacy || {
        profileVisibility: 'public',
        messagePermission: 'everyone',
        mutedWords: [],
        blockedUsers: []
    });
    const [blocks, setBlocks] = useState<any[]>([]);

    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                const res = await api.get('/blocks');
                setBlocks(res.data.data);
            } catch (error: any) {
                console.error('Failed to fetch blocks', error.response?.data || error.message);
            }
        };
        fetchBlocks();
    }, []);

    const handleChange = async (key: string, value: any) => {
        const newPrivacy = { ...privacy, [key]: value };
        setPrivacy(newPrivacy);
        try {
            await api.patch('/settings/me', { privacy: { [key]: value } });
        } catch (error) {
            console.error('Failed to update privacy', error);
        }
    };

    const handleUnblock = async (userId: string) => {
        try {
            await api.post(`/blocks/${userId}/toggle`);
            setBlocks(blocks.filter(b => b._id !== userId));
        } catch (error) {
            console.error('Failed to unblock', error);
        }
    };

    return (
        <div className="max-w-2xl space-y-6">
            <div className="pb-3 border-b border-gray-100 dark:border-zinc-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Privacy Controls</h2>
                <p className="text-xs text-gray-500 mt-1">Control your visibility and interactions.</p>
            </div>

            <div className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                    <label className="block text-[13px] font-medium text-gray-700 dark:text-zinc-400">
                        Profile Visibility
                    </label>
                    <div className="relative">
                        <select
                            value={privacy.profileVisibility}
                            onChange={(e) => handleChange('profileVisibility', e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 rounded-md px-3.5 h-9 text-sm text-gray-900 dark:text-white focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0]/20 transition-all outline-none appearance-none cursor-pointer"
                        >
                            <option value="public">Everyone (Public)</option>
                            <option value="private">Followers Only (Private)</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="block text-[13px] font-medium text-gray-700 dark:text-zinc-400">
                        Direct Messages
                    </label>
                    <div className="relative">
                        <select
                            value={privacy.messagePermission}
                            onChange={(e) => handleChange('messagePermission', e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 rounded-md px-3.5 h-9 text-sm text-gray-900 dark:text-white focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0]/20 transition-all outline-none appearance-none cursor-pointer"
                        >
                            <option value="everyone">Everyone</option>
                            <option value="following">Following Only</option>
                            <option value="nobody">No one</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-zinc-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Blocked Accounts</h3>

                <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                        {blocks.length > 0 ? (
                            blocks.map(user => (
                                <motion.div
                                    key={user._id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center justify-between p-3 border border-gray-100 dark:border-zinc-800/50 rounded-lg bg-gray-50/30 dark:bg-zinc-900/10"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-9 h-9 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{user.name}</p>
                                            <p className="text-xs text-gray-400">@{user.username}</p>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 px-4 rounded-md border-red-100 text-red-500 hover:bg-red-50 text-xs font-bold"
                                        onClick={() => handleUnblock(user._id)}
                                    >
                                        Unblock
                                    </Button>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-10 bg-gray-50/20 dark:bg-zinc-900/5 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl"
                            >
                                <UserX size={32} className="text-gray-300 dark:text-zinc-800 mb-2" />
                                <p className="text-gray-400 font-medium text-xs">No blocked accounts.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
