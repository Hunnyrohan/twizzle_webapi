'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut, ShieldAlert, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export const SecuritySettingsForm: React.FC = () => {
    const router = useRouter();
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            alert("New passwords don't match");
            return;
        }
        setIsLoading(true);
        try {
            await api.patch('/auth/change-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            alert('Password changed successfully');
            setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogoutAll = async () => {
        if (!confirm('Are you sure you want to log out from all devices? You will be redirected to login.')) return;
        try {
            await api.post('/auth/logout-all');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
        } catch (error) {
            alert('Failed to logout from all devices');
        }
    };

    return (
        <div className="max-w-2xl space-y-6">
            <section className="space-y-4">
                <div className="pb-3 border-b border-gray-100 dark:border-zinc-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security Settings</h2>
                    <p className="text-xs text-gray-500">Update your password and manage account security.</p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                    <div className="space-y-3">
                        <Input
                            type="password"
                            label="Current Password"
                            name="currentPassword"
                            value={passwords.currentPassword}
                            onChange={handleChange}
                            variant="standard"
                        />
                        <Input
                            type="password"
                            label="New Password"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            variant="standard"
                        />
                        <Input
                            type="password"
                            label="Confirm New Password"
                            name="confirmNewPassword"
                            value={passwords.confirmNewPassword}
                            onChange={handleChange}
                            variant="standard"
                        />
                    </div>
                    <div className="pt-1">
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            disabled={isLoading}
                            className="h-9 px-8 rounded-md bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold text-sm shadow-sm transition-all active:scale-95"
                        >
                            Update Password
                        </Button>
                    </div>
                </form>
            </section>

            <section className="pt-6 border-t border-gray-100 dark:border-zinc-800">
                <h3 className="text-lg font-bold text-red-500 mb-3 flex items-center gap-2">
                    Danger Zone
                </h3>
                <div className="border border-red-100/50 dark:border-red-900/20 p-4 rounded-xl bg-red-50/30 dark:bg-red-900/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <h4 className="border-0 font-bold text-gray-900 dark:text-white mb-0.5 text-sm">Log out of all other sessions</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">This will sign you out of all devices except for this one.</p>
                    </div>
                    <Button
                        onClick={handleLogoutAll}
                        variant="outline"
                        className="h-9 px-5 rounded-md border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all font-bold text-sm"
                    >
                        Logout All Sessions
                    </Button>
                </div>
            </section>
        </div>
    );
};
