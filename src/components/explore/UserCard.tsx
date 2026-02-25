import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { exploreService } from '../../services/api';
import VerifiedBadge from '../common/VerifiedBadge';

import Link from 'next/link';

interface UserCardProps {
    user: any; // Using any because backend sends slightly different structure sometimes
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
    const { user: currentUser } = useAuth();
    const [isFollowing, setIsFollowing] = React.useState(user.isFollowing || user.isFollowed);

    // Resolve fields (handling both frontend type and backend response)
    const displayName = user.displayName || user.name || user.username;
    const username = user.username;
    const avatarUrl = user.avatarUrl || user.image || `https://ui-avatars.com/api/?name=${username}`;
    const userId = user.id || user._id;
    const isVerified = user.verified || user.isVerified;

    const isSelf = currentUser?._id === userId || currentUser?.id === userId;

    const handleFollow = async () => {
        try {
            const result = await exploreService.toggleFollow(userId);
            setIsFollowing(result.followed);
        } catch (error) {
            console.error('Error toggling follow:', error);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <Link href={`/profile/${username}`} className="flex items-center space-x-3 flex-1 min-w-0 group">
                <div className="relative flex-shrink-0">
                    <img
                        src={avatarUrl}
                        alt={username}
                        className="w-12 h-12 rounded-full object-cover bg-slate-100 dark:bg-zinc-800 group-hover:brightness-90 transition-all"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${username}`;
                        }}
                    />
                </div>
                <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center group-hover:underline decoration-1 underline-offset-2 truncate">
                        {displayName || username}
                        {isVerified && <VerifiedBadge className="ml-1" size={14} />}
                    </h3>
                    <p className="text-sm text-slate-500 truncate">@{username}</p>
                    {user.bio && <p className="text-xs text-slate-400 mt-1 line-clamp-1">{user.bio}</p>}
                </div>
            </Link>

            {!isSelf && (
                <button
                    onClick={handleFollow}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all flex-shrink-0 ml-2 ${isFollowing
                        ? 'bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700'
                        : 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow-md'
                        }`}
                >
                    {isFollowing ? 'Following' : 'Follow'}
                </button>
            )}
        </div>
    );
};

export default UserCard;
