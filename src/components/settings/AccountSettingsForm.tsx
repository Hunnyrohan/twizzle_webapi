'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AccountSettingsFormProps {
    user: any;
    onUpdate: (user: any) => void;
}

export const AccountSettingsForm: React.FC<AccountSettingsFormProps> = ({ user, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || ''
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
            onUpdate(res.data.data);
            alert('Account updated successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to update account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <h2 className="text-xl font-bold mb-4">Account Information</h2>
            <Input label="Name" name="name" value={formData.name} onChange={handleChange} />
            <Input label="Username" name="username" value={formData.username} onChange={handleChange} />
            <Input label="Email" name="email" value={formData.email} onChange={handleChange} />
            <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium">Bio</label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md p-2 dark:bg-black dark:border-gray-700 w-full resize-none h-24"
                />
            </div>
            <Input label="Location" name="location" value={formData.location} onChange={handleChange} />
            <Input label="Website" name="website" value={formData.website} onChange={handleChange} />

            <Button type="submit" variant="twitter" isLoading={isLoading} disabled={isLoading}>
                Save Changes
            </Button>
        </form>
    );
};
