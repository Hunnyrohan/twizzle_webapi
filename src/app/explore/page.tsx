'use client';

import React, { useState } from 'react';
import SearchBar from '@/components/explore/SearchBar';
import ExploreTabs from '@/components/explore/ExploreTabs';
import TrendingTags from '@/components/explore/TrendingTags';
import SuggestedCreators from '@/components/explore/SuggestedCreators';
import HotPosts from '@/components/explore/HotPosts';
import SearchResults from '@/components/explore/SearchResults';

export default function ExplorePage() {
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('top');

    const handleSearch = (newQuery: string) => {
        setQuery(newQuery);
    };

    const handleTabChange = (newFilter: string) => {
        setFilter(newFilter);
    };

    const handleTagClick = (tag: string) => {
        setQuery(tag);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <SearchBar onSearch={handleSearch} initialQuery={query} />

            <ExploreTabs activeTab={filter} onTabChange={handleTabChange} />

            <div className="mt-2">
                {!query ? (
                    // Content Block A: Empty Search
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        <TrendingTags onTagClick={handleTagClick} />
                        <SuggestedCreators />
                        <HotPosts />
                    </div>
                ) : (
                    // Content Block B: Search Results
                    <SearchResults query={query} filter={filter} />
                )}
            </div>
        </div>
    );
}
