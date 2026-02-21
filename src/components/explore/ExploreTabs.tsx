import React from 'react';

interface ExploreTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const tabs = [
    { id: 'top', label: 'Top' },
    { id: 'latest', label: 'Latest' },
    { id: 'people', label: 'People' },
    { id: 'media', label: 'Media' },
    { id: 'tags', label: 'Tags' },
];

const ExploreTabs: React.FC<ExploreTabsProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-black scrollbar-hide">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex-1 min-w-[80px] py-4 text-sm font-medium transition-colors relative whitespace-nowrap px-4 ${activeTab === tab.id
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'
                        }`}
                >
                    {tab.label}
                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full mx-3" />
                    )}
                </button>
            ))}
        </div>
    );
};

export default ExploreTabs;
