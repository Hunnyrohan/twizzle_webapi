'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import api from '@/lib/api';

export const AppearanceSettingsForm: React.FC = () => {
    const { theme, setTheme } = useTheme();

    const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme);
        try {
            await api.patch('/settings/me', { theme: newTheme });
        } catch (error) {
            console.error('Failed to update theme preference', error);
        }
    };

    return (
        <div className="space-y-6 max-w-xl">
            <h2 className="text-xl font-bold mb-4">Appearance</h2>
            <p className="text-gray-500 mb-6">Manage your display preferences and theme.</p>

            <div className="grid grid-cols-3 gap-4">
                <button
                    onClick={() => handleThemeChange('light')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center space-y-2 ${theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}
                >
                    <div className="w-full h-20 bg-white border border-gray-200 rounded-lg shadow-sm"></div>
                    <span className="font-bold">Light</span>
                </button>

                <button
                    onClick={() => handleThemeChange('dark')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center space-y-2 ${theme === 'dark' ? 'border-blue-500 bg-gray-900' : 'border-gray-200 hover:border-blue-200'}`}
                >
                    <div className="w-full h-20 bg-black border border-gray-700 rounded-lg shadow-sm"></div>
                    <span className={`font-bold ${theme === 'dark' ? 'text-white' : ''}`}>Dark</span>
                </button>

                <button
                    onClick={() => handleThemeChange('system')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center space-y-2 ${theme === 'system' ? 'border-blue-500 bg-blue-50 dark:bg-gray-900' : 'border-gray-200 hover:border-blue-200'}`}
                >
                    <div className="w-full h-20 bg-gradient-to-r from-white to-black border border-gray-200 rounded-lg shadow-sm"></div>
                    <span className="font-bold">System</span>
                </button>
            </div>
        </div>
    );
};
