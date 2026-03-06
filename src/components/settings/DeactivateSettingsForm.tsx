'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { resolveImageUrl } from '@/lib/media-utils';
import { useAuth } from '@/context/AuthContext';

export const DeactivateSettingsForm: React.FC = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleDeactivate = async () => {
        if (!confirm('Are you sure you want to deactivate your account? You will be logged out and your account will be hidden until you log in again.')) return;
        setIsLoading(true);
        try {
            await api.post('/auth/deactivate');
            localStorage.clear();
            sessionStorage.clear();
            router.push('/login');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to deactivate account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="space-y-6">
                <div className="pb-4 border-b border-gray-100 dark:border-zinc-800">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Deactivate Account</h2>
                    <p className="text-sm text-gray-500 mt-1 font-medium">This will deactivate your Twizzle account.</p>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-red-50/50 dark:bg-red-900/10 border border-red-100/50 dark:border-red-900/20">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold text-gray-900 dark:text-white">You're about to deactivate your account</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            Your display name, @username, and public profile will no longer be viewable on Twizzle.
                            You can reactivate your account at any time by logging back in.
                        </p>
                    </div>
                </div>

                {user && (
                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                        <img
                            src={resolveImageUrl(user.image) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-zinc-800"
                            alt={user.name}
                        />
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-sm text-gray-500 font-medium">@{user.username}</p>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">What else you should know</h4>
                    <ul className="space-y-3">
                        {[
                            "Your data won't be deleted, but it will be hidden from other users.",
                            "Some information may still be visible in search engines.",
                            "If you want to change your username, you don't need to deactivate."
                        ].map((text, i) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-zinc-700 mt-1.5 shrink-0" />
                                {text}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="pt-8">
                    <Button
                        onClick={handleDeactivate}
                        isLoading={isLoading}
                        className="w-full md:w-auto h-12 px-10 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-base shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02] active:scale-95"
                    >
                        Deactivate Account
                    </Button>
                </div>
            </section>
        </div>
    );
};
