import React, { useEffect, useState, useCallback } from 'react';
import { exploreService } from '../../services/api';
import { Post, User, HashtagTrend, SearchResult } from '../../types/explore';
import { PostCard } from '../dashboard/PostCard';
import UserCard from './UserCard';
import TagCard from './TagCard';
import ExploreSkeleton from './ExploreSkeleton';
import { Loader2 } from 'lucide-react';

interface SearchResultsProps {
    query: string;
    filter: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query, filter }) => {
    const [items, setItems] = useState<(Post | User | HashtagTrend)[]>([]);
    const [loading, setLoading] = useState(true);
    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const [hasMore, setHasMore] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);

    // Reset when query or filter changes
    useEffect(() => {
        setItems([]);
        setCursor(undefined);
        setHasMore(true);
        setLoading(true);

        const fetchInitial = async () => {
            try {
                const data = await exploreService.search(query, filter);
                setItems(data.items);
                setCursor(data.nextCursor);
                setHasMore(!!data.nextCursor);
            } catch (error) {
                console.error('Search failed', error);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchInitial();
        } else {
            setLoading(false);
        }
    }, [query, filter]);

    const loadMore = async () => {
        if (!cursor || fetchingMore) return;
        setFetchingMore(true);
        try {
            const data = await exploreService.search(query, filter, cursor);
            setItems((prev) => [...prev, ...data.items]);
            setCursor(data.nextCursor);
            setHasMore(!!data.nextCursor);
        } catch (error) {
            console.error('Load more failed', error);
        } finally {
            setFetchingMore(false);
        }
    };

    if (loading) return <ExploreSkeleton />;

    if (items.length === 0 && !loading) {
        return (
            <div className="p-8 text-center text-slate-500">
                No results found for "{query}"
            </div>
        )
    }

    return (
        <div className="pb-20">
            <div className={filter === 'tags' || filter === 'people' ? 'space-y-4 p-4' : ''}>
                {items.map((item: any) => {
                    const id = item._id || item.id || item.tag;

                    // If it's the people tab, always render UserCard
                    if (filter === 'users' || filter === 'people') {
                        return <UserCard key={id} user={item} />;
                    }

                    // If it's the tags tab, always render TagCard
                    if (filter === 'tags') {
                        return <TagCard key={id} tag={item} />;
                    }

                    // For 'top' or 'latest', it could be mixed (case of 'top')
                    // Check if it's a user by looking for username
                    if (item.username && !item.content) {
                        return <UserCard key={id} user={item} />;
                    }

                    // Check if it's a hashtag
                    if (item.tag && !item.content) {
                        return <TagCard key={id} tag={item} />;
                    }

                    // Default to PostCard
                    return <PostCard key={id} post={item} />;
                })}
            </div>

            {hasMore && (
                <div className="p-4 flex justify-center">
                    <button
                        onClick={loadMore}
                        disabled={fetchingMore}
                        className="flex items-center space-x-2 text-blue-500 font-medium hover:bg-blue-50 px-4 py-2 rounded-full transition-colors"
                    >
                        {fetchingMore && <Loader2 className="animate-spin h-4 w-4" />}
                        <span>{fetchingMore ? 'Loading...' : 'Load more'}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
