'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import api from '@/lib/api';
import { Moon, Sun } from 'lucide-react';

export const AppearanceSettingsForm: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    const handleToggle = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        toggleTheme();
        try {
            await api.patch('/settings/me', { theme: newTheme });
        } catch (error) {
            console.error('Failed to update theme preference', error);
        }
    };

    return (
        <div className="max-w-2xl space-y-5">
            <div className="pb-3 border-b border-gray-100 dark:border-zinc-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Appearance</h2>
                <p className="text-xs text-gray-500">Manage how the app looks on this device.</p>
            </div>

            <div className="bg-white dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                <button
                    onClick={handleToggle}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-900/40 transition-colors group"
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-[#1d9bf0]/10 text-[#1d9bf0]' : 'bg-gray-100 text-gray-500'}`}>
                            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                        </div>
                        <div className="text-left">
                            <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">Dark Mode</h3>
                            <p className="text-xs text-gray-500">Switch between light and dark themes</p>
                        </div>
                    </div>

                    <div className={`w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${theme === 'dark' ? 'bg-[#1d9bf0]' : 'bg-gray-200 dark:bg-zinc-800'}`}>
                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                </button>
            </div>

            <p className="text-[11px] text-gray-500 font-medium tracking-tight px-1">
                Your preference is automatically saved to your profile and synced across devices.
            </p>
        </div>
    );
};
