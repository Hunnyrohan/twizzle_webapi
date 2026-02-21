'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
        <div className="space-y-8 max-w-xl">
            <form onSubmit={handleChangePassword} className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Change Password</h2>
                <Input
                    type="password"
                    label="Current Password"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handleChange}
                />
                <Input
                    type="password"
                    label="New Password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handleChange}
                />
                <Input
                    type="password"
                    label="Confirm New Password"
                    name="confirmNewPassword"
                    value={passwords.confirmNewPassword}
                    onChange={handleChange}
                />
                <Button type="submit" variant="twitter_black" isLoading={isLoading} disabled={isLoading}>
                    Update Password
                </Button>
            </form>

            <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold mb-4 text-red-600">Danger Zone</h2>
                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg flex items-center justify-between">
                    <div>
                        <h3 className="font-bold">Log out all devices</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Log out of all other active sessions.</p>
                    </div>
                    <Button onClick={handleLogoutAll} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                        <LogOut size={16} className="mr-2" />
                        Logout All
                    </Button>
                </div>
            </div>
        </div>
    );
};
