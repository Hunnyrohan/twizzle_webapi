import React from 'react';
import { User } from '../../types/explore';
import { exploreService } from '../../services/api';

interface UserCardProps {
    user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
    const [isFollowing, setIsFollowing] = React.useState(user.isFollowing);

    const handleFollow = async () => {
        try {
            const userId = (user as any)._id || user.id;
            const result = await exploreService.toggleFollow(userId);
            setIsFollowing(result.followed);
        } catch (error) {
            console.error('Error toggling follow:', error);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
                <img
                    src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}`}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center">
                        {user.displayName}
                        {user.verified && <span className="ml-1 text-blue-500">✓</span>}
                    </h3>
                    <p className="text-sm text-slate-500">@{user.username}</p>
                    {user.bio && <p className="text-xs text-slate-400 mt-1 line-clamp-1">{user.bio}</p>}
                </div>
            </div>
            <button
                onClick={handleFollow}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${isFollowing
                    ? 'bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-700 dark:text-white'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
            >
                {isFollowing ? 'Following' : 'Follow'}
            </button>
        </div>
    );
};

export default UserCard;
