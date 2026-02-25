import React from 'react';

export const PostDetailSkeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex space-x-4">
                    <div className="rounded-full bg-gray-200 dark:bg-gray-800 h-12 w-12"></div>
                    <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex space-x-4">
                        <div className="rounded-full bg-gray-200 dark:bg-gray-800 h-10 w-10"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/6"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
