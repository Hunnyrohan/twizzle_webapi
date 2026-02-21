'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';

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
        // Fetch blocked users details
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
        <div className="space-y-8 max-w-xl">
            <div>
                <h2 className="text-xl font-bold mb-4">Privacy</h2>
                <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                        <label className="font-medium">Profile Visibility</label>
                        <select
                            value={privacy.profileVisibility}
                            onChange={(e) => handleChange('profileVisibility', e.target.value)}
                            className="border border-gray-300 rounded p-2 dark:bg-black dark:border-gray-700"
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="font-medium">Direct Messages</label>
                        <select
                            value={privacy.messagePermission}
                            onChange={(e) => handleChange('messagePermission', e.target.value)}
                            className="border border-gray-300 rounded p-2 dark:bg-black dark:border-gray-700"
                        >
                            <option value="everyone">Everyone</option>
                            <option value="following">Following</option>
                            <option value="nobody">No one</option>
                        </select>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">Blocked Users</h2>
                <div className="space-y-2">
                    {blocks.length > 0 ? (
                        blocks.map(user => (
                            <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full" />
                                    <div>
                                        <p className="font-bold text-sm">{user.name}</p>
                                        <p className="text-xs text-gray-500">@{user.username}</p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 text-xs border-red-200 text-red-600 hover:bg-red-50"
                                    onClick={() => handleUnblock(user._id)}
                                >
                                    Unblock
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">You haven't blocked anyone.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
