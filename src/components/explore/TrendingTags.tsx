import React, { useEffect, useState } from 'react';
import { exploreService } from '../../services/api';
import { HashtagTrend } from '../../types/explore';
import TagCard from './TagCard';
import ExploreSkeleton from './ExploreSkeleton';

interface TrendingTagsProps {
    onTagClick: (tag: string) => void;
}

const TrendingTags: React.FC<TrendingTagsProps> = ({ onTagClick }) => {
    const [trends, setTrends] = useState<HashtagTrend[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const data = await exploreService.getTrending();
                setTrends(data);
            } catch (error) {
                console.error('Failed to fetch trends', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrends();
    }, []);

    if (loading) return <ExploreSkeleton />;

    return (
        <div className="p-4">
            <h3 className="text-xl font-bold mb-4 px-2 text-slate-900 dark:text-white">Trending for you</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trends.map((tag) => (
                    <TagCard key={tag.tag} tag={tag} onClick={onTagClick} />
                ))}
            </div>
        </div>
    );
};

export default TrendingTags;
