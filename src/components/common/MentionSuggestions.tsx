"use client";

import React, { useEffect, useState } from 'react';
import { exploreService } from '@/services/api';
import { User } from '@/types/explore';
import VerifiedBadge from './VerifiedBadge';
import { Loader2 } from 'lucide-react';

interface MentionSuggestionsProps {
    query: string;
    onSelect: (user: User) => void;
    onClose: () => void;
}

const MentionSuggestions: React.FC<MentionSuggestionsProps> = ({ query, onSelect, onClose }) => {
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            setLoading(true);
            try {
                const data = await exploreService.search(query, 'people');
                // Filter out results that are not users if needed, though 'people' filter should return users
                const users = data.items.filter((item: any) => item.username) as User[];
                setSuggestions(users);
                setSelectedIndex(0);
            } catch (error) {
                console.error('Failed to fetch mention suggestions:', error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (suggestions.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % suggestions.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                onSelect(suggestions[selectedIndex]);
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [suggestions, selectedIndex, onSelect, onClose]);

    if (!query || (suggestions.length === 0 && !loading)) return null;

    return (
        <div className="absolute z-[110] bottom-full left-0 mb-2 w-64 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="p-2 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">People</span>
                {loading && <Loader2 className="w-3 h-3 animate-spin text-blue-500" />}
            </div>
            <div className="max-h-64 overflow-y-auto overflow-x-hidden p-1 custom-scrollbar">
                {loading && suggestions.length === 0 && (
                    <div className="p-4 text-center text-sm text-slate-500">Searching...</div>
                )}
                {suggestions.map((user, index) => (
                    <div
                        key={user.id}
                        onClick={() => onSelect(user)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${index === selectedIndex
                            ? 'bg-blue-50 dark:bg-blue-900/20'
                            : 'hover:bg-slate-50 dark:hover:bg-zinc-800/50'
                            }`}
                    >
                        <img
                            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}`}
                            alt={user.username}
                            className="w-10 h-10 rounded-full object-cover bg-slate-100 dark:bg-zinc-800"
                        />
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                    {user.displayName || user.username}
                                </span>
                                {user.verified && <VerifiedBadge size={14} />}
                            </div>
                            <div className="text-xs text-slate-500 truncate">@{user.username}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MentionSuggestions;
