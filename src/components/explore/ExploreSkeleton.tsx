import React from 'react';

const ExploreSkeleton = () => {
    return (
        <div className="space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-slate-200 dark:bg-slate-800 h-32 rounded-2xl w-full" />
            ))}
        </div>
    );
};

export default ExploreSkeleton;
