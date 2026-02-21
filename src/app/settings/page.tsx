'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { AccountSettingsForm } from '@/components/settings/AccountSettingsForm';
import { SecuritySettingsForm } from '@/components/settings/SecuritySettingsForm';
import { AppearanceSettingsForm } from '@/components/settings/AppearanceSettingsForm';
import { NotificationSettingsForm } from '@/components/settings/NotificationSettingsForm';
import { PrivacySettingsForm } from '@/components/settings/PrivacySettingsForm';

export default function SettingsPage() {
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
    ];

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="flex flex-col md:flex-row h-full">
            {/* Sidebar for Settings on larger screens, scrollable tabs on smaller */}
            <div className="w-full md:w-64 border-r border-gray-200 dark:border-gray-800 p-4">
                <h1 className="text-2xl font-bold mb-6 px-2">Settings</h1>
                <nav className="space-y-1 flex flex-row md:flex-col overflow-x-auto md:overflow-visible">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 rounded-xl text-left font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
                                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                {activeTab === 'account' && <AccountSettingsForm user={user} onUpdate={(u) => { setUser(u); localStorage.setItem('user', JSON.stringify(u)); }} />}
                {activeTab === 'security' && <SecuritySettingsForm />}
                {activeTab === 'privacy' && <PrivacySettingsForm settings={settings} />}
                {activeTab === 'notifications' && <NotificationSettingsForm settings={settings} />}
                {activeTab === 'appearance' && <AppearanceSettingsForm />}
            </div>
        </div>
    );
}
