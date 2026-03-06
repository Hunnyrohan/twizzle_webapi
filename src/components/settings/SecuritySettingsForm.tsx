'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, KeyRound, Globe, Monitor, ArrowRight, ShieldAlert, History } from 'lucide-react';
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
            await api.post('/auth/change-password', {
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
        <div className="max-w-2xl space-y-8">
            {/* Hero Section */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white shadow-xl shadow-blue-500/20">
                <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck size={16} className="shrink-0" />
                    <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">Account Protection</span>
                </div>
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight leading-tight mb-2">Security &amp; Account Access</h2>
                        <p className="text-blue-100/80 text-sm font-medium leading-relaxed">
                            Manage your protection, sign-in methods, and active sessions.
                        </p>
                    </div>
                    <ShieldAlert size={48} className="text-white/30 shrink-0" />
                </div>
            </div>

            {/* Change Password */}
            <motion.section
                whileHover={{ y: -2 }}
                className="group bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-all"
            >
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <KeyRound size={20} />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-gray-900 dark:text-white">Update Password</h3>
                        <p className="text-xs text-gray-500">Keep your account secure with a strong password</p>
                    </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <Input
                        type="password"
                        label="Current Password"
                        name="currentPassword"
                        value={passwords.currentPassword}
                        onChange={handleChange}
                        variant="standard"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            className="h-10 px-8 rounded-full bg-black dark:bg-white text-white dark:text-black font-black text-sm shadow-md hover:opacity-90 active:scale-95 transition-all"
                        >
                            Change Password
                        </Button>
                    </div>
                </form>
            </motion.section>

            {/* Active Sessions */}
            <motion.section
                whileHover={{ y: -2 }}
                className="group bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-all"
            >
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Globe size={20} />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-gray-900 dark:text-white">Active Sessions</h3>
                        <p className="text-xs text-gray-500">Manage devices where you're signed in</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-500">
                                <Monitor size={18} />
                            </div>
                            <div>
                                <p className="font-bold text-sm text-gray-900 dark:text-white">This Device</p>
                                <p className="text-xs text-gray-500">Active now</p>
                            </div>
                        </div>
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Live
                        </span>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/5 border border-blue-100/50 dark:border-blue-900/10">
                        <div className="flex items-start gap-3">
                            <History className="text-blue-500 shrink-0 mt-0.5" size={16} />
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                Suspect unauthorized access? Log out all other devices to protect your account.
                            </p>
                        </div>
                        <button
                            onClick={handleLogoutAll}
                            className="mt-3 text-xs font-black text-red-600 dark:text-red-400 hover:underline"
                        >
                            Log out all other sessions →
                        </button>
                    </div>
                </div>
            </motion.section>

            {/* 2FA Teaser */}
            <div className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900 dark:bg-zinc-950 text-white border border-zinc-800">
                <div>
                    <p className="font-black text-sm">Two-factor authentication</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Add an extra layer of security</p>
                </div>
                <button className="shrink-0 flex items-center gap-1.5 text-xs font-black bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors">
                    Set up <ArrowRight size={12} />
                </button>
            </div>
        </div>
    );
};
