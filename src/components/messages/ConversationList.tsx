import React, { useState } from 'react';
import { Conversation } from '@/types/messages';
import { ConversationItem } from './ConversationItem';
import { ConversationSkeleton } from './MessagesSkeleton';
import { Search, MoreHorizontal } from 'lucide-react';

interface ConversationListProps {
    conversations: Conversation[];
    loading: boolean;
    activeId?: string;
    onSelect: (id: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
    conversations,
    loading,
    activeId,
    onSelect
}) => {
    const [filter, setFilter] = useState('');

    const filtered = conversations.filter(c =>
        c.otherUser.name.toLowerCase().includes(filter.toLowerCase()) ||
        c.otherUser.username.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-white dark:bg-black border-r border-gray-100 dark:border-gray-800 shadow-sm relative z-30">
            <div className="p-4 border-b border-gray-50 dark:border-gray-900 sticky top-0 bg-white/95 dark:bg-black/95 backdrop-blur-md z-10">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[22px] font-black tracking-tight text-gray-900 dark:text-gray-100">Messages</h2>
                    <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all text-blue-500">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search Direct Messages"
                        className="w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-black rounded-2xl transition-all outline-none text-[15px] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 shadow-inner"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => <ConversationSkeleton key={i} />)
                ) : filtered.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <p>No conversations found.</p>
                    </div>
                ) : (
                    filtered.map(conversation => (
                        <ConversationItem
                            key={conversation._id || conversation.id}
                            conversation={conversation}
                            isActive={conversation.id === activeId}
                            onClick={() => onSelect(conversation.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
