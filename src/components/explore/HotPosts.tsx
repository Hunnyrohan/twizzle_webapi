import React, { useEffect, useState } from 'react';
import { exploreService } from '../../services/api';
import { Post } from '../../types/explore';
import { PostCard } from '../dashboard/PostCard'; // Reuse existing
import ExploreSkeleton from './ExploreSkeleton';

const HotPosts: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHot = async () => {
            try {
                const data = await exploreService.getHotPosts();
                setPosts(data);
            } catch (error) {
                console.error('Failed to fetch hot posts', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHot();
    }, []);

    if (loading) return <ExploreSkeleton />;

    return (
        <div className="pb-20">
            <h3 className="text-xl font-bold p-4 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800">
                Hot Posts
            </h3>
            <div>
                {posts.map((post) => (
                    // @ts-ignore - Assuming Post types match or are compatible enough
                    <PostCard key={post._id || (post as any).id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default HotPosts;
