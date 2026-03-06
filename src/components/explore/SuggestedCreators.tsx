import React, { useEffect, useState } from 'react';
import { exploreService } from '../../services/api';
import { User } from '../../types/explore';
import UserCard from './UserCard';
import ExploreSkeleton from './ExploreSkeleton';

const SuggestedCreators: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const data = await exploreService.getSuggestions();
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch suggestions', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSuggestions();
    }, []);

    if (loading) return <ExploreSkeleton />;

    return (
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Suggested for you</h3>
            <div className="space-y-4">
                {users.map((user: any) => (
                    <UserCard key={user._id || user.id} user={user} />
                ))}
            </div>
        </div>
    );
};

export default SuggestedCreators;
