import React from 'react';
import { HashtagTrend } from '../../types/explore';

interface TagCardProps {
    tag: HashtagTrend;
    onClick?: (tag: string) => void;
}

const TagCard: React.FC<TagCardProps> = ({ tag, onClick }) => {
    return (
        <button
            onClick={() => onClick?.(tag.tag)}
            className="flex flex-col p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
        >
            <span className="font-bold text-lg text-slate-900 dark:text-white">#{tag.tag}</span>
            <span className="text-sm text-slate-500">{tag.count.toLocaleString()} posts</span>
        </button>
    );
};

export default TagCard;
