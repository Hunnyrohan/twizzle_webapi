'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';

interface AccountSettingsFormProps {
    user: any;
}

import { useAuth } from '@/context/AuthContext';

export const AccountSettingsForm: React.FC<AccountSettingsFormProps> = ({ user }) => {
    const { updateUser } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        username: user?.username || '',
        email: user?.email || '',
        bio: user?.bio || '',
        location: user?.location || '',
        website: user?.website || ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.put('/users/profile', formData);
            updateUser(res.data.data);
            alert('Account updated successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to update account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl space-y-5">
            <div className="pb-3 border-b border-gray-100 dark:border-zinc-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Account Information</h2>
                <p className="text-xs text-gray-500">Update your account details and public profile.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                    <Input label="Name" name="name" value={formData.name} onChange={handleChange} variant="standard" />
                    <Input label="Username" name="username" value={formData.username} onChange={handleChange} variant="standard" />
                    <Input label="Email" name="email" value={formData.email} onChange={handleChange} variant="standard" />
                    <Textarea label="Bio" name="bio" value={formData.bio} onChange={handleChange} variant="standard" />
                    <Input label="Location" name="location" value={formData.location} onChange={handleChange} variant="standard" />
                    <Input label="Website" name="website" value={formData.website} onChange={handleChange} variant="standard" />
                </div>

                <div className="pt-3">
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        disabled={isLoading}
                        className="h-9 px-8 rounded-md bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold text-sm shadow-sm transition-all active:scale-95"
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
};
