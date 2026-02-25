'use client';

import React from 'react';
import { User } from '@/types';
import { ArrowLeft, Calendar, Link as LinkIcon, MapPin, Mail } from 'lucide-react';
import Link from 'next/link';
import VerifiedBadge from '../common/VerifiedBadge';

interface ProfileHeaderProps {
    user: User;
    currentUser: User | null;
    postCount: number;
    onFollow: () => void;
    onEditProfile: () => void;
    onShowFollowers: () => void;
    onShowFollowing: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, currentUser, postCount, onFollow, onEditProfile, onShowFollowers, onShowFollowing }) => {
    const isOwnProfile = currentUser?.username === user.username;

    return (
        <div>
            {/* Header */}
            <div className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md px-4 py-3 border-b border-gray-200 dark:border-zinc-800 z-40 flex items-center space-x-4">
                <Link href="/dashboard" className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <div className="flex items-center space-x-1">
                        <h1 className="text-xl font-bold leading-tight text-gray-900 dark:text-white">{user.name}</h1>
                        {user.isVerified && <VerifiedBadge size={18} />}
                    </div>
                    <p className="text-gray-500 text-sm">{postCount} posts</p>
                </div>
            </div>

            {/* Banner */}
            <div className="h-48 bg-gray-200 relative">
                {user.coverImage ? (
                    <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-blue-100 dark:bg-gray-800" />
                )}
            </div>

            {/* Profile Info */}
            <div className="px-4 pb-4 border-b border-gray-200 relative">
                <div className="flex justify-between items-start">
                    <div className="-mt-16 mb-4">
                        <img
                            src={user.image || 'https://via.placeholder.com/150'}
                            alt={user.name}
                            className="w-32 h-32 rounded-full border-4 border-white dark:border-black bg-white dark:bg-zinc-900 object-cover"
                        />
                    </div>
                    <div className="mt-4">
                        {isOwnProfile ? (
                            <button
                                onClick={onEditProfile}
                                className="px-4 py-2 border border-gray-300 dark:border-zinc-700 font-bold rounded-full hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors dark:text-white"
                            >
                                Edit profile
                            </button>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={onFollow}
                                    className={`px-6 py-2 font-bold rounded-full transition-colors ${user.isFollowing
                                        ? 'border border-gray-300 dark:border-zinc-700 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/30 group dark:text-white'
                                        : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'}`}
                                >
                                    <span className={user.isFollowing ? 'group-hover:hidden' : ''}>{user.isFollowing ? 'Following' : 'Follow'}</span>
                                    <span className={`hidden ${user.isFollowing ? 'group-hover:inline' : ''}`}>Unfollow</span>
                                </button>
                                <button
                                    onClick={() => (window as any).handleMessage && (window as any).handleMessage()}
                                    className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                                    title="Message"
                                >
                                    <Mail size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <div className="flex items-center space-x-1">
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            {user.isVerified && <VerifiedBadge size={20} />}
                        </div>
                        <p className="text-gray-500">@{user.username}</p>
                    </div>

                    {user.bio && <p className="whitespace-pre-wrap">{user.bio}</p>}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-500 text-sm">
                        {user.location && (
                            <div className="flex items-center space-x-1">
                                <MapPin size={16} />
                                <span>{user.location}</span>
                            </div>
                        )}
                        {user.website && (
                            <div className="flex items-center space-x-1">
                                <LinkIcon size={16} />
                                <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{user.website}</a>
                            </div>
                        )}
                        <div className="flex items-center space-x-1">
                            <Calendar size={16} />
                            <span>Joined recently</span>
                        </div>
                    </div>

                    <div className="flex space-x-4 text-sm">
                        <div onClick={onShowFollowing} className="hover:underline cursor-pointer group">
                            <span className="font-bold text-gray-900 dark:text-white group-hover:underline">{user.followingCount || 0}</span> <span className="text-gray-500">Following</span>
                        </div>
                        <div onClick={onShowFollowers} className="hover:underline cursor-pointer group">
                            <span className="font-bold text-gray-900 dark:text-white group-hover:underline">{user.followersCount || 0}</span> <span className="text-gray-500">Followers</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
