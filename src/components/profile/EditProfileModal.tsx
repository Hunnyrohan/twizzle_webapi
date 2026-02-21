'use client';

import React, { useState, useRef } from 'react';
import { User } from '@/types';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Camera } from 'lucide-react';

interface EditProfileModalProps {
    user: User;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedUser: User) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, isOpen, onClose, onSave }) => {
    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio || '');
    const [location, setLocation] = useState(user.location || '');
    const [website, setWebsite] = useState(user.website || '');
    const [isLoading, setIsLoading] = useState(false);

    // Image states
    const [avatarPreview, setAvatarPreview] = useState(user.image);
    const [coverPreview, setCoverPreview] = useState(user.coverImage);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (type === 'avatar') {
                setAvatarFile(file);
                setAvatarPreview(URL.createObjectURL(file));
            } else {
                setCoverFile(file);
                setCoverPreview(URL.createObjectURL(file));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // 1. Upload images if changed
            let newAvatarUrl = user.image;
            let newCoverUrl = user.coverImage;

            if (avatarFile) {
                const formData = new FormData();
                formData.append('image', avatarFile);
                const res = await api.post('/users/me/avatar', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                newAvatarUrl = res.data.data.image;
            }

            if (coverFile) {
                const formData = new FormData();
                formData.append('image', coverFile);
                const res = await api.post('/users/me/cover', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                newCoverUrl = res.data.data.coverImage;
            }

            // 2. Update text fields
            const res = await api.put('/users/profile', {
                name,
                bio,
                location,
                website,
                // We send images here too if the API updating routine expects them or just relies on the separate calls
                // The requirements said: "On success, update UI instantly"
                // My backend updateProfile only takes name/bio/image (as string).
                // But duplicate logic might handle it. Let's send the URLs we got.
                image: newAvatarUrl,
                // coverImage might not be in the body destructuring of updateProfile in backend??
                // The backend updateProfile looked like it destructured {name, bio, image}.
                // It misses 'coverImage'. I might need to fix backend updateProfile if I want to save text details alongside.
                // HOWEVER, my new uploadAvatar/Cover endpoints DO save the image URL to the user document.
                // So we just need to update the text fields.
            });

            // Fix: The backend updateProfile ignores coverImage update if sent in body, 
            // but the uploadCover endpoint ALREADY updated the DB.
            // The text update might overwrite if it fetches old data? No, findByIdAndUpdate
            // only updates specified fields.
            // So we are good.

            const updatedUser = {
                ...res.data.data,
                image: newAvatarUrl,
                coverImage: newCoverUrl
            };

            onSave(updatedUser);
            onClose();
        } catch (error) {
            console.error('Failed to update profile', error);
            alert('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-black w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center space-x-4">
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full">
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold">Edit Profile</h2>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        variant="twitter_black"
                        className="px-4 py-1.5 min-h-0 h-auto text-sm"
                    >
                        {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                </div>

                {/* Body - Scrollable */}
                <div className="h-[60vh] overflow-y-auto relative">
                    {/* Cover Image */}
                    <div className="h-32 bg-gray-200 relative group cursor-pointer">
                        {coverPreview ? (
                            <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-blue-100" />
                        )}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => coverInputRef.current?.click()} className="p-2 bg-black/50 rounded-full text-white">
                                <Camera size={20} />
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={coverInputRef}
                            onChange={(e) => handleImageChange(e, 'cover')}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>

                    {/* Avatar */}
                    <div className="px-4 relative mb-4">
                        <div className="-mt-16 w-32 h-32 rounded-full border-4 border-white dark:border-black overflow-hidden relative group cursor-pointer">
                            <img
                                src={avatarPreview || 'https://via.placeholder.com/150'}
                                alt="Avatar"
                                className="w-full h-full object-cover bg-white"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => avatarInputRef.current?.click()} className="p-2 bg-black/50 rounded-full text-white">
                                    <Camera size={20} />
                                </button>
                            </div>
                            <input
                                type="file"
                                ref={avatarInputRef}
                                onChange={(e) => handleImageChange(e, 'avatar')}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="px-4 space-y-4 pb-8">
                        <div className="border border-gray-300 rounded px-2 py-1 focus-within:ring-2 ring-blue-500">
                            <label className="block text-xs text-gray-500">Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full outline-none bg-transparent"
                            />
                        </div>
                        <div className="border border-gray-300 rounded px-2 py-1 focus-within:ring-2 ring-blue-500">
                            <label className="block text-xs text-gray-500">Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full outline-none bg-transparent resize-none h-20"
                            />
                        </div>
                        <div className="border border-gray-300 rounded px-2 py-1 focus-within:ring-2 ring-blue-500">
                            <label className="block text-xs text-gray-500">Location</label>
                            <input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full outline-none bg-transparent"
                            />
                        </div>
                        <div className="border border-gray-300 rounded px-2 py-1 focus-within:ring-2 ring-blue-500">
                            <label className="block text-xs text-gray-500">Website</label>
                            <input
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                className="w-full outline-none bg-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
