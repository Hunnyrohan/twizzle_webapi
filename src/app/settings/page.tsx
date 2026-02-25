'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { AccountSettingsForm } from '@/components/settings/AccountSettingsForm';
import { SecuritySettingsForm } from '@/components/settings/SecuritySettingsForm';
import { AppearanceSettingsForm } from '@/components/settings/AppearanceSettingsForm';
import { NotificationSettingsForm } from '@/components/settings/NotificationSettingsForm';
import { PrivacySettingsForm } from '@/components/settings/PrivacySettingsForm';
import { VerificationSettingsForm } from '@/components/settings/VerificationSettingsForm';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
    const { updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('account');
    const [settings, setSettings] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Fetch basic user profile
                const storedUser = localStorage.getItem('user');
                if (storedUser) setUser(JSON.parse(storedUser));

                // Fetch expanded settings
                const res = await api.get('/settings/me');
                setSettings(res.data.data);

                // Refresh core user data (fixes stale verification status)
                if (res.data.data.user) {
                    setUser(res.data.data.user);
                    updateUser(res.data.data.user);
                }
            } catch (error: any) {
                console.error('Settings load error:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const tabs = [
        { id: 'account', label: 'Account' },
        { id: 'security', label: 'Security' },
        { id: 'privacy', label: 'Privacy' },
        { id: 'notifications', label: 'Notifications' },
        { id: 'appearance', label: 'Appearance' },
        { id: 'verification', label: 'Verification' },
    ];

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-black flex flex-col md:flex-row h-full">
            {/* Sidebar for Settings */}
            <div className="w-full md:w-80 border-r border-gray-200 dark:border-zinc-800 p-8 md:p-12 overflow-y-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Settings</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Manage your experience.</p>
                </div>

                <nav className="space-y-2 flex flex-row md:flex-col overflow-x-auto md:overflow-visible custom-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3.5 rounded-2xl text-left font-bold transition-all whitespace-nowrap group relative flex items-center justify-between
                                ${activeTab === tab.id
                                    ? 'bg-white dark:bg-zinc-900 text-black dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/5'
                                    : 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-900/50'
                                }`}
                        >
                            <span>{tab.label}</span>
                            {activeTab === tab.id && (
                                <motion.div layoutId="tab-active" className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#1d9bf0]" />
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content Area */}
            <main className="flex-1 p-8 md:p-16 lg:p-24 overflow-y-auto bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                <div className="max-w-3xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'account' && <AccountSettingsForm user={user} onUpdate={(u) => { setUser(u); localStorage.setItem('user', JSON.stringify(u)); }} />}
                            {activeTab === 'security' && <SecuritySettingsForm />}
                            {activeTab === 'privacy' && <PrivacySettingsForm settings={settings} />}
                            {activeTab === 'notifications' && <NotificationSettingsForm settings={settings} />}
                            {activeTab === 'appearance' && <AppearanceSettingsForm />}
                            {activeTab === 'verification' && <VerificationSettingsForm user={user} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
