import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Conversation, Message } from '@/types/messages';
import { messageService } from '@/services/api';
import { MessageBubble } from './MessageBubble';
import { MessageComposer } from './MessageComposer';
import { MessageSkeleton } from './MessagesSkeleton';
import VerifiedBadge from '../common/VerifiedBadge';
import { ArrowLeft, Info, MoreHorizontal, Video, Phone } from 'lucide-react';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { resolveImageUrl } from '@/lib/media-utils';
import Link from 'next/link';

interface ChatWindowProps {
    conversation: Conversation;
    currentUserId: string;
    onBack?: () => void;
    onMessageSent: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
    conversation,
    currentUserId,
    onBack,
    onMessageSent
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingOlder, setLoadingOlder] = useState(false);
    const [cursor, setCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const { socket, initiateCall } = useSocket();
    const { user } = useAuth();

    const bottomRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const scrollHeightRef = useRef<number>(0);

    useEffect(() => {
        if (socket && user?.id) {
            socket.emit('join', user.id);
        }
    }, [socket, user?.id]);

    const fetchMessages = async (isLoadOlder = false) => {
        try {
            if (isLoadOlder) setLoadingOlder(true);
            else setLoading(true);

            const response = await messageService.getMessages(
                conversation.id,
                isLoadOlder ? (cursor || undefined) : undefined
            );

            if (isLoadOlder) {
                setMessages(prev => [...prev, ...response.items]);

                // Maintain scroll position
                if (messagesContainerRef.current) {
                    const newScrollHeight = messagesContainerRef.current.scrollHeight;
                    const diff = newScrollHeight - scrollHeightRef.current;
                    messagesContainerRef.current.scrollTop = diff;
                }

            } else {
                setMessages(response.items);
            }

            setCursor(response.nextCursor || null);
            setHasMore(!!response.nextCursor);
        } catch (error) {
            console.error('Failed to load messages', error);
        } finally {
            setLoading(false);
            setLoadingOlder(false);
        }
    };

    useEffect(() => {
        setMessages([]);
        setCursor(null);
        setHasMore(true);
        fetchMessages();
        markAsRead();
    }, [conversation.id]);

    const markAsRead = async () => {
        try {
            if (conversation.unreadCount > 0) {
                await messageService.markAsRead(conversation.id);
                onMessageSent(); // To update conversation list unread count
            }
        } catch (error) {
            console.error('Failed to mark read', error);
        }
    };

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!loading && !loadingOlder) {
            // Only scroll to bottom on initial load or new message sent by me
            // Currently simple logic: if just loaded invalidating sort
            if (!cursor) scrollToBottom();
        }
    }, [messages.length, loading]);

    const handleSend = async (text: string, files: File[]) => {
        const formData = new FormData();
        if (text) formData.append('text', text);
        files.forEach(file => {
            formData.append('images', file);
        });

        // Optimistic update
        const tempId = 'temp_' + Date.now();
        const tempMsg: Message = {
            id: tempId,
            conversationId: conversation.id,
            senderId: currentUserId,
            text,
            attachments: files.map(f => URL.createObjectURL(f)),
            createdAt: new Date().toISOString(),
            status: 'sent'
        };

        setMessages(prev => [tempMsg, ...prev]);

        try {
            const sentMsg = await messageService.sendMessage(conversation.id, formData);
            setMessages(prev => {
                const realId = sentMsg._id || sentMsg.id;
                // Check if the real message was already added by the WebSocket
                const alreadyAddedBySocket = prev.some(m => (m._id || m.id) === realId && m.id !== tempId);

                if (alreadyAddedBySocket) {
                    // Socket already added it, just remove our optimistic temp
                    return prev.filter(m => m.id !== tempId);
                } else {
                    // Replace temp with the real message
                    return prev.map(m => m.id === tempId ? sentMsg : m);
                }
            });
            onMessageSent();
        } catch (error) {
            console.error('Failed to send', error);
            setMessages(prev => prev.filter(m => m.id !== tempId));
        }
    };

    const handleLoadOlder = () => {
        if (messagesContainerRef.current) {
            scrollHeightRef.current = messagesContainerRef.current.scrollHeight;
        }
        fetchMessages(true);
    };

    const handleCall = async (type: 'audio' | 'video') => {
        await initiateCall(conversation.otherUser.id, conversation.otherUser.name, type, conversation.id, conversation.otherUser.isVerified, conversation.otherUser.image);
    };

    // Helper to safely get string ID from senderId (which can be populated object or string)
    const getSenderId = useCallback((msg: any) => {
        if (!msg || !msg.senderId) return '';
        if (typeof msg.senderId === 'string') return msg.senderId;
        if (typeof msg.senderId === 'object') return msg.senderId._id || msg.senderId.id || '';
        return String(msg.senderId);
    }, []);

    // Socket Listener for new messages
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (payload: any) => {
            const newMessage = payload.message || payload;
            console.log('ChatWindow: Incoming socket message:', newMessage);

            if (newMessage.conversationId === conversation.id) {
                setMessages(prev => {
                    const msgId = newMessage._id || newMessage.id;
                    // Check for duplicates
                    const isDuplicate = prev.some(m => {
                        const existingId = m._id || m.id;
                        return existingId === msgId;
                    });

                    if (isDuplicate) {
                        console.log('ChatWindow: Duplicate message ignored:', msgId);
                        return prev;
                    }

                    console.log('ChatWindow: Adding new message from socket to state');
                    return [newMessage, ...prev];
                });

                messageService.markAsRead(conversation.id);
            }
        };

        socket.on('new_message', handleNewMessage);

        const handleMessageDeleted = (payload: any) => {
            const { messageId, type, userId: deletedByUserId } = payload;
            console.log('ChatWindow: Message deleted event:', payload);

            setMessages(prev => {
                if (type === 'everyone') {
                    // Update the message to show "Removed"
                    return prev.map(m => {
                        const mid = m._id || m.id;
                        if (mid === messageId) {
                            return { ...m, text: 'This message was removed', isDeletedEveryone: true, attachments: [] };
                        }
                        return m;
                    });
                } else if (type === 'me' && deletedByUserId === currentUserId) {
                    // Remove from local state if it was deleted for current user
                    return prev.filter(m => (m._id || m.id) !== messageId);
                }
                return prev;
            });
        };

        socket.on('message_deleted', handleMessageDeleted);

        return () => {
            socket.off('new_message', handleNewMessage);
            socket.off('message_deleted', handleMessageDeleted);
        };
    }, [socket, conversation.id, currentUserId]);

    // Render order: 
    // We have [Newest, ..., Oldest]. 
    // In UI, we want Oldest at Top, Newest at Bottom.
    // So we should reverse simple map or use flex-col-reverse.
    // flex-col-reverse is easier for "scroll to bottom" behavior but "load older" involves scrolling UP.
    // Let's use flex-col-reverse.
    // So:
    // Container: flex flex-col-reverse
    // Items: messages (which are Newest...Oldest)
    // This means index 0 (Newest) is at bottom. Index N (Oldest) is at top. Perfect.

    return (
        <div className="flex flex-col h-full bg-white dark:bg-black relative">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-20 h-[64px]">
                <div className="flex items-center">
                    {onBack && (
                        <button onClick={onBack} className="mr-2 md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors">
                            <ArrowLeft size={20} className="dark:text-gray-100" />
                        </button>
                    )}
                    <Link
                        href={`/profile/${conversation.otherUser.username}`}
                        className="flex items-center p-1.5 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-colors cursor-pointer group"
                    >
                        <div className="relative">
                            <img
                                src={resolveImageUrl(conversation.otherUser.image) || `https://ui-avatars.com/api/?name=${conversation.otherUser.name}`}
                                alt={conversation.otherUser.name}
                                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 object-cover shadow-sm ring-2 ring-white dark:ring-black"
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-black rounded-full shadow-xs"></div>
                        </div>
                        <div className="ml-3">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover:text-blue-500 transition-colors flex items-center gap-1">
                                {conversation.otherUser.name}
                                {conversation.otherUser.isVerified && <VerifiedBadge size={16} />}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">@{conversation.otherUser.username}</p>
                        </div>
                    </Link>
                </div>
                <div className="flex items-center space-x-1">
                    <button onClick={() => handleCall('audio')} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all">
                        <Phone size={20} />
                    </button>
                    <button onClick={() => handleCall('video')} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all">
                        <Video size={20} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all">
                        <Info size={22} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all">
                        <MoreHorizontal size={22} />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div
                className="flex-1 overflow-y-auto px-4 py-4 flex flex-col-reverse scrollbar-none bg-white dark:bg-black"
                ref={messagesContainerRef}
            >
                <div ref={bottomRef} />

                {loading ? (
                    <MessageSkeleton />
                ) : (
                    <>
                        {messages.map((msg, index) => {
                            const senderId = getSenderId(msg);
                            const isMe = senderId === currentUserId;
                            const prevMsg = messages[index + 1];
                            const showAvatar = !isMe && (!prevMsg || getSenderId(prevMsg) !== senderId);

                            // Date separator (optional)
                            // If index is last (oldest), show date. 
                            // If prevMsg (older) date is different from current, show date.
                            let showDate = false;
                            if (!prevMsg) showDate = true;
                            else if (new Date(msg.createdAt).toDateString() !== new Date(prevMsg.createdAt).toDateString()) showDate = true;

                            return (
                                <div key={msg._id || (msg as any).id}>
                                    {showDate && (
                                        <div className="flex justify-center my-6">
                                            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900/50 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-800 shadow-xs">
                                                {format(new Date(msg.createdAt), 'MMMM d, yyyy')}
                                            </span>
                                        </div>
                                    )}
                                    <MessageBubble
                                        message={msg}
                                        isMe={isMe}
                                        showAvatar={showAvatar}
                                        onDelete={(id, type) => {
                                            if (type === 'me') {
                                                setMessages(prev => prev.filter(m => (m._id || m.id) !== id));
                                            } else {
                                                setMessages(prev => prev.map(m => {
                                                    if ((m._id || m.id) === id) {
                                                        return { ...m, text: 'This message was removed', isDeletedEveryone: true, attachments: [] };
                                                    }
                                                    return m;
                                                }));
                                            }
                                        }}
                                    />
                                </div>
                            );
                        })}

                        {hasMore && (
                            <div className="flex justify-center py-4">
                                <button
                                    onClick={handleLoadOlder}
                                    disabled={loadingOlder}
                                    className="text-blue-500 text-sm hover:underline disabled:opacity-50"
                                >
                                    {loadingOlder ? 'Loading...' : 'Load older messages'}
                                </button>
                            </div>
                        )}

                        {messages.length === 0 && !loading && (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <p>No messages yet.</p>
                                <p className="text-sm">Say hello! 👋</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Composer */}
            <MessageComposer onSend={handleSend} />
        </div >
    );
};
