import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../utils/debounce';

interface SearchBarProps {
    onSearch: (query: string) => void;
    initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialQuery = '' }) => {
    const [query, setQuery] = useState(initialQuery);
    const debouncedQuery = useDebounce(query, 300);

    // Sync internal state with prop if prop changes (e.g. redirected or clicked a trend)
    useEffect(() => {
        if (initialQuery !== query) {
            setQuery(initialQuery);
        }
    }, [initialQuery]);

    useEffect(() => {
        // Notify parent of new search term (debounced)
        // Guard prevents infinite loops when syncing with URL state
        if (debouncedQuery !== initialQuery) {
            onSearch(debouncedQuery);
        }
    }, [debouncedQuery, onSearch, initialQuery]);

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-10 py-2.5 border-none rounded-full leading-5 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all"
                    placeholder="Search Twizzle..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                        <X className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded-full p-0.5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
