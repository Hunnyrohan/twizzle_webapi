'use client';

import React, { useEffect, useState } from 'react';
import { ConversationList } from '@/components/messages/ConversationList';
import { ChatWindow } from '@/components/messages/ChatWindow';
import { messageService } from '@/services/api';
import { Conversation, User } from '@/types/messages';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { RightSidebar } from '@/components/dashboard/RightSidebar';

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

    const handleMessageSent = () => {
        // Refresh conversations to update order/preview
        messageService.getConversations().then(data => setConversations(data));
    };

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* Left Sidebar (Standard) */}
            <Sidebar user={currentUser ? { name: currentUser.name, username: currentUser.username } : undefined} />

            {/* Center Content - Split for Messages */}
            <main className="flex-1 flex border-r border-gray-200 max-w-5xl">
                {/* Conversation List Column */}
                <div className={`w-full md:w-[320px] lg:w-[380px] border-r border-gray-200 flex flex-col h-full ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
                    <ConversationList
                        conversations={conversations}
                        loading={loading}
                        activeId={activeConversationId}
                        onSelect={handleSelectConversation}
                    />
                </div>

                {/* Chat Window Column */}
                <div className={`flex-1 flex flex-col h-full ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
                    {activeConversation && currentUser ? (
                        <ChatWindow
                            conversation={activeConversation}
                            currentUserId={(currentUser as any)._id || currentUser.id}
                            onBack={() => setActiveConversationId(undefined)}
                            onMessageSent={handleMessageSent}
                        />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                            <div className="text-center p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a message</h2>
                                <p className="text-gray-500 mb-6">Choose from your existing conversations, start a new one, or just keep swimming.</p>
                                <button className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-600 transition-colors">
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
                <RightSidebar />
            </div>
        </div>
    );
}
