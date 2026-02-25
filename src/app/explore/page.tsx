'use client';

import React, { useCallback } from 'react';
import SearchBar from '@/components/explore/SearchBar';
import ExploreTabs from '@/components/explore/ExploreTabs';
import TrendingTags from '@/components/explore/TrendingTags';
import SuggestedCreators from '@/components/explore/SuggestedCreators';
import HotPosts from '@/components/explore/HotPosts';
import SearchResults from '@/components/explore/SearchResults';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ExplorePage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // URL is the source of truth
    const query = searchParams.get('q') || '';
    const filter = searchParams.get('f') || 'top';

    const updateUrl = useCallback((newQuery: string, newFilter: string) => {
        const params = new URLSearchParams();
        if (newQuery) params.set('q', newQuery);
        if (newFilter !== 'top') params.set('f', newFilter);

        const queryString = params.toString();
        router.push(queryString ? `/explore?${queryString}` : '/explore', { scroll: false });
    }, [router]);

    const handleSearch = (newQuery: string) => {
        if (newQuery === query) return;
        updateUrl(newQuery, filter);
    };

    const handleTabChange = (newFilter: string) => {
        if (newFilter === filter) return;
        updateUrl(query, newFilter);
    };

    const handleTagClick = (tag: string) => {
        if (tag === query) return;
        updateUrl(tag, filter);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <SearchBar onSearch={handleSearch} initialQuery={query} />

            <ExploreTabs activeTab={filter} onTabChange={handleTabChange} />

            <div className="mt-2">
                {!query ? (
                    // Content Block A: Empty Search (Discover mode)
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {(filter === 'top' || filter === 'tags') && (
                            <TrendingTags onTagClick={handleTagClick} />
                        )}
                        {(filter === 'top' || filter === 'people') && (
                            <SuggestedCreators />
                        )}
                        {(filter === 'top' || filter === 'latest' || filter === 'media') && (
                            <HotPosts />
                        )}
                    </div>
                ) : (
                    // Content Block B: Search Results
                    <SearchResults query={query} filter={filter} />
                )}
            </div>
        </div>
    );
}
