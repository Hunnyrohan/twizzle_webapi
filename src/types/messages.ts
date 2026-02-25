export interface User {
    id: string;
    _id?: string;
    name: string;
    username: string;
    image?: string;
    isVerified?: boolean;
}

export interface Message {
    id: string;
    _id?: string;
    conversationId: string;
    senderId: string;
    text?: string;
    type?: 'text' | 'call';
    attachments?: string[];
    callData?: {
        type: 'audio' | 'video';
        status: 'missed' | 'ended' | 'started';
        duration?: number;
    };
    createdAt: string; // ISO string
    status: 'sent' | 'seen';
}

export interface Conversation {
    id: string;
    _id?: string;
    participantIds: string[];
    otherUser: User;
    lastMessage?: Message;
    unreadCount: number;
    updatedAt: string; // ISO string
}

export interface PaginatedMessageResponse<T> {
    items: T[];
    nextCursor?: string | null;
}
