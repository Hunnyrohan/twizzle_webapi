'use client';

import React, { useEffect, useState } from 'react';
import { ConversationList } from '@/components/messages/ConversationList';
import { ChatWindow } from '@/components/messages/ChatWindow';
import { messageService } from '@/services/api';
import { Conversation, User } from '@/types/messages';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { RightPanel } from '@/components/dashboard/RightPanel';
import { useSocket } from '@/context/SocketContext';

export default function MessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | undefined>();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Ensure we are logged in (mock login for testing if no token)
                const token = localStorage.getItem('token');
                if (!token) {
                    await messageService.mockLogin();
                }

                const userStr = localStorage.getItem('user');
                if (userStr) {
                    setCurrentUser(JSON.parse(userStr));
                }

                const data = await messageService.getConversations();
                setConversations(data);

                if (data.length > 0 && !activeConversationId) {
                    // setActiveConversationId(data[0].id); // Optional: auto-select first
                }
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSelectConversation = (id: string) => {
        setActiveConversationId(id);
    };

    const handleMessageSent = async () => {
        // Refresh conversations to update order/preview
        const data = await messageService.getConversations();
        setConversations(data);
    };

    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const { socket } = useSocket();

    // Socket Listener for global conversation updates
    useEffect(() => {
        if (!socket) return;

        const handleNewMessageGlobal = (payload: any) => {
            console.log('MessagesPage: New message received globally:', payload);
            const newMessage = payload.message || payload;

            setConversations(prev => {
                const existingIndex = prev.findIndex(c => c.id === newMessage.conversationId);

                if (existingIndex !== -1) {
                    const updatedConversations = [...prev];
                    const targetConv = updatedConversations[existingIndex];

                    // Don't update if we already have a more recent message (sanity check)
                    if (targetConv.lastMessage && new Date(targetConv.lastMessage.createdAt) > new Date(newMessage.createdAt)) {
                        return prev;
                    }

                    updatedConversations[existingIndex] = {
                        ...targetConv,
                        lastMessage: newMessage,
                        updatedAt: newMessage.createdAt,
                        unreadCount: (targetConv.id === activeConversationId) ? 0 : (targetConv.unreadCount + 1)
                    };

                    const movedConv = updatedConversations.splice(existingIndex, 1)[0];
                    return [movedConv, ...updatedConversations];
                } else {
                    messageService.getConversations().then(data => setConversations(data));
                    return prev;
                }
            });
        };

        socket.on('new_message', handleNewMessageGlobal);
        return () => {
            socket.off('new_message', handleNewMessageGlobal);
        };
    }, [socket, activeConversationId]);

    return (
        <div className="flex h-screen bg-white dark:bg-black overflow-hidden transition-colors duration-300">
            {/* Left Sidebar (Standard) */}
            <Sidebar user={currentUser ? { name: currentUser.name, username: currentUser.username } : undefined} />

            {/* Center Content - Split for Messages */}
            <main className="flex-1 flex border-r border-gray-100 dark:border-zinc-800/50 max-w-5xl relative">
                {/* Conversation List Column */}
                <div className={`w-full md:w-[320px] lg:w-[380px] border-r border-gray-100 dark:border-zinc-800/50 flex flex-col h-full bg-white dark:bg-black ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
                    <ConversationList
                        conversations={conversations}
                        loading={loading}
                        activeId={activeConversationId}
                        onSelect={handleSelectConversation}
                    />
                </div>

                {/* Chat Window Column */}
                <div className={`flex-1 flex flex-col h-full bg-white dark:bg-black ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
                    {activeConversation && currentUser ? (
                        <ChatWindow
                            conversation={activeConversation}
                            currentUserId={(currentUser as any)._id || currentUser.id}
                            onBack={() => setActiveConversationId(undefined)}
                            onMessageSent={handleMessageSent}
                        />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50/50 dark:bg-zinc-900/20">
                            <div className="text-center p-8 max-w-sm">
                                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">Select a message</h2>
                                <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed text-[15px]">Choose from your existing conversations, start a new one, or just keep swimming.</p>
                                <button className="bg-blue-500 text-white px-8 py-3.5 rounded-full font-bold hover:bg-blue-600 transition-colors shadow-sm active:scale-95">
                                    New Message
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Right Sidebar (Optional / Reused) */}
            {/* We can hide it on smaller screens or if we want full width chat */}
            <div className="hidden xl:block w-[350px]">
                <RightPanel />
            </div>
        </div>
    );
}
