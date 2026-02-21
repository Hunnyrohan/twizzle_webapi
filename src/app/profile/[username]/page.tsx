'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api, { exploreService, messageService } from '@/services/api';
import { User, Post } from '@/types';
import { PostCard } from '@/components/dashboard/PostCard';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { FollowListModal } from '@/components/profile/FollowListModal';

export default function UserProfilePage() {
    const params = useParams();
    const router = useRouter();
    const username = params.username as string;

    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'media' | 'likes'>('posts');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Follow Modal State
    const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
    const [followModalType, setFollowModalType] = useState<'followers' | 'following'>('followers');
    const [followModalUsers, setFollowModalUsers] = useState<any[]>([]);
    const [followModalLoading, setFollowModalLoading] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            try {
                // 1. Get User Profile
                const userRes = await api.get<{ success: boolean, data: User }>(`/users/${username}`);
                const userData = userRes.data.data;
                setUser(userData);

                // 2. Get User Posts (Initial load)
                if (userData._id) {
                    fetchPosts(userData._id, 'posts');
                }

                // 3. Get Current User for auth check
                const storedUser = localStorage.getItem('user');
                if (storedUser) setCurrentUser(JSON.parse(storedUser));

            } catch (error) {
                console.error('Failed to load profile', error);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            loadProfile();
        }
    }, [username]);

    const fetchPosts = async (userId: string, tab: string) => {
        try {
            // Determine endpoint or params based on tab
            // For now, only 'posts' and 'likes' might fetch different things
            let endpoint = '/tweets';
            let params: any = { author: userId };

            if (tab === 'likes') {
                endpoint = `/users/${username}/likes`;
                params = {}; // Likes endpoint usually gets user by username/id from path
            } else if (tab === 'media') {
                // params.hasMedia = true; // If supported
            }

            const postsRes = await api.get<{ success: boolean, data: Post[] }>(endpoint, { params });
            setPosts(postsRes.data.data || []);
        } catch (error) {
            console.error('Failed to fetch posts', error);
        }
    };

    const handleTabChange = (tab: 'posts' | 'replies' | 'media' | 'likes') => {
        setActiveTab(tab);
        if (user) {
            fetchPosts(user._id, tab);
        }
    };

    const handleFollow = async () => {
        if (!user || !currentUser) return;
        try {
            const userId = user._id || (user as any).id;
            const result = await exploreService.toggleFollow(userId);
            setUser(prev => prev ? {
                ...prev,
                isFollowing: result.followed,
                followersCount: result.followed ? (prev.followersCount || 0) + 1 : Math.max(0, (prev.followersCount || 0) - 1)
            } : null);
        } catch (error) {
            console.error('Follow action failed', error);
        }
    };

    const handleMessage = async () => {
        if (!user || !currentUser) return;
        try {
            const userId = user._id || (user as any).id;
            const conversation = await messageService.startConversation(userId);
            router.push(`/messages?id=${conversation.id || (conversation as any)._id}`);
        } catch (error: any) {
            alert(error.response?.data?.error || error.message || 'Failed to start conversation');
        }
    };

    useEffect(() => {
        (window as any).handleMessage = handleMessage;
        return () => {
            delete (window as any).handleMessage;
        };
    }, [user, currentUser]);

    const handleProfileUpdate = (updatedUser: User) => {
        setUser(updatedUser);
        // Also update current user in local storage if it's own profile
        if (currentUser && currentUser.username === updatedUser.username) {
            setCurrentUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    const handleShowFollowers = async () => {
        setFollowModalType('followers');
        setIsFollowModalOpen(true);
        setFollowModalLoading(true);
        try {
            const res = await api.get(`/users/${username}/followers`);
            setFollowModalUsers(res.data.data);
        } catch (error) {
            console.error('Failed to load followers', error);
        } finally {
            setFollowModalLoading(false);
        }
    };

    const handleShowFollowing = async () => {
        setFollowModalType('following');
        setIsFollowModalOpen(true);
        setFollowModalLoading(true);
        try {
            const res = await api.get(`/users/${username}/following`);
            setFollowModalUsers(res.data.data);
        } catch (error) {
            console.error('Failed to load following', error);
        } finally {
            setFollowModalLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
    }

    if (!user) {
        return <div className="text-center py-20">User not found</div>;
    }

    return (
        <div className="min-h-screen pb-20">
            <ProfileHeader
                user={user}
                currentUser={currentUser}
                postCount={posts.length}
                onFollow={handleFollow}
                onEditProfile={() => setIsEditModalOpen(true)}
                onShowFollowers={handleShowFollowers}
                onShowFollowing={handleShowFollowing}
            />

            <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />

            {/* Feed */}
            <div>
                {posts.length > 0 ? (
                    posts.map(post => <PostCard key={post._id} post={post} />)
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No items to display here yet.
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <EditProfileModal
                user={user}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleProfileUpdate}
            />

            <FollowListModal
                isOpen={isFollowModalOpen}
                onClose={() => setIsFollowModalOpen(false)}
                title={followModalType === 'followers' ? 'Followers' : 'Following'}
                users={followModalUsers}
                loading={followModalLoading}
            />
        </div>
    );
}
