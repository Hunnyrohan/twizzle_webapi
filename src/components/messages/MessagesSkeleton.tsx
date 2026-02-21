import React from 'react';

export const ConversationSkeleton = () => (
    <div className="flex items-center p-4 space-x-3 border-b border-gray-100 animate-pulse">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-2">
            <div className="w-1/2 h-4 bg-gray-200 rounded" />
            <div className="w-3/4 h-3 bg-gray-100 rounded" />
        </div>
    </div>
);

export const MessageSkeleton = () => (
    <div className="space-y-4 p-4 animate-pulse">
        <div className="flex items-end space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="w-1/2 h-10 bg-gray-100 rounded-2xl rounded-bl-none" />
        </div>
        <div className="flex items-end justify-end space-x-2">
            <div className="w-1/3 h-10 bg-blue-100 rounded-2xl rounded-br-none" />
        </div>
        <div className="flex items-end space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="w-2/3 h-12 bg-gray-100 rounded-2xl rounded-bl-none" />
        </div>
    </div>
);
