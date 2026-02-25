'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Send, Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { messageService, exploreService } from '@/services/api';
import { Conversation, User } from '@/types/messages';
import VerifiedBadge from '../common/VerifiedBadge';

interface ShareDirectMessageModalProps {
    postUrl: string;
    onClose: () => void;
}

export const ShareDirectMessageModal: React.FC<ShareDirectMessageModalProps> = ({ postUrl, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [sendingId, setSendingId] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchConversations = async () => {
            setLoading(true);
            try {
                const data = await messageService.getConversations();
                setConversations(data);
            } catch (error) {
                console.error('Failed to fetch conversations', error);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

    useEffect(() => {
        const searchUsers = async () => {
            if (searchQuery.length < 2) {
                setSearchResults([]);
                return;
            }
            try {
                const data = await exploreService.search(searchQuery, 'users');
                // The search result from exploreService returns a mixed structure
                // Adjust based on the actual SearchResult type
                const users = (data as any).items.filter((item: any) => item.username) as User[];
                setSearchResults(users);
            } catch (error) {
                console.error('Search failed', error);
            }
        };

        const timeoutId = setTimeout(searchUsers, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleShareToUser = async (user: User) => {
        const userId = user.id || (user as any)._id;
        if (sendingId) return;

        setSendingId(userId);
        try {
            // Find or start conversation
            const convo = await messageService.startConversation(userId);

            const formData = new FormData();
            formData.append('text', `Check out this post: ${postUrl}`);

            await messageService.sendMessage(convo.id, formData);

            // Redirect to messages
            router.push('/messages');
            onClose();
        } catch (error: any) {
            console.error('Failed to send message', error);
            const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to send message. Please try again.';
            alert(errorMessage);
            setSendingId(null);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div
                ref={modalRef}
                className="bg-white dark:bg-black w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-200 dark:border-gray-800"
            >
                <div className="p-4 border-b border-gray-100 dark:border-gray-900 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors cursor-pointer">
                            <X size={20} className="dark:text-white" />
                        </button>
                        <h2 className="text-xl font-bold dark:text-white">Send Post</h2>
                    </div>
                </div>

                <div className="p-4 border-b border-gray-100 dark:border-gray-900">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search people"
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-black rounded-full transition-all outline-none text-[15px] dark:text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {searchQuery.length >= 2 ? (
                        <div className="p-2">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-3 py-2">Search Results</h3>
                            {searchResults.length > 0 ? (
                                searchResults.map(user => (
                                    <RecipientItem
                                        key={user.id || (user as any)._id}
                                        user={user}
                                        isSending={sendingId === (user.id || (user as any)._id)}
                                        onSelect={() => handleShareToUser(user)}
                                    />
                                ))
                            ) : (
                                <p className="p-4 text-center text-gray-500">No users found</p>
                            )}
                        </div>
                    ) : (
                        <div className="p-2">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-3 py-2">Recent Messages</h3>
                            {loading ? (
                                <div className="p-4 text-center text-gray-500">Loading...</div>
                            ) : conversations.length > 0 ? (
                                conversations.map(convo => (
                                    <RecipientItem
                                        key={convo.id}
                                        user={convo.otherUser}
                                        isSending={sendingId === (convo.otherUser.id || (convo.otherUser as any)._id)}
                                        onSelect={() => handleShareToUser(convo.otherUser)}
                                    />
                                ))
                            ) : (
                                <p className="p-4 text-center text-gray-500">No recent conversations</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface RecipientItemProps {
    user: User;
    isSending: boolean;
    onSelect: () => void;
}

const RecipientItem: React.FC<RecipientItemProps> = ({ user, isSending, onSelect }) => {
    return (
        <div
            onClick={onSelect}
            className={`flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer rounded-xl mx-1 ${isSending ? 'opacity-50 pointer-events-none' : ''}`}
        >
            <div className="flex items-center gap-3">
                <img
                    src={user.image || `https://ui-avatars.com/api/?name=${user.name}`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover bg-gray-200 dark:bg-gray-800"
                />
                <div>
                    <div className="flex items-center gap-1 font-bold dark:text-white">
                        {user.name}
                        {user.isVerified && <VerifiedBadge size={14} />}
                    </div>
                    <div className="text-sm text-gray-500">@{user.username}</div>
                </div>
            </div>
            {isSending && (
                <div className="w-6 h-6 flex items-center justify-center">
                    <Loader2 size={16} className="animate-spin text-blue-500" />
                </div>
            )}
        </div>
    );
};
