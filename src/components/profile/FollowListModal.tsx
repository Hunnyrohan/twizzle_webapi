'use client';

import React from 'react';
import { X } from 'lucide-react';
import { User } from '@/types';
import Link from 'next/link';

interface FollowListModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    users: any[];
    loading: boolean;
}

export const FollowListModal: React.FC<FollowListModalProps> = ({ isOpen, onClose, title, users, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-black w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : users.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {users.map((user) => (
                                <div key={user._id || user.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                    <Link
                                        href={`/profile/${user.username}`}
                                        className="flex items-center space-x-3"
                                        onClick={onClose}
                                    >
                                        <img
                                            src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                                            alt={user.name}
                                            className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
                                        />
                                        <div>
                                            <p className="font-bold hover:underline">{user.name}</p>
                                            <p className="text-sm text-slate-500">@{user.username}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-slate-500">
                            No users found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
