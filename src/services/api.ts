import axios from 'axios';
import { PaginatedResponse, SearchResult, HashtagTrend, Post, User } from '../types/explore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const exploreService = {
    getTrending: async () => {
        const response = await api.get<{ success: boolean; data: HashtagTrend[] }>('/explore/trending');
        return response.data.data;
    },
    getSuggestions: async () => {
        const response = await api.get<{ success: boolean; data: User[] }>('/explore/suggestions');
        return response.data.data;
    },
    getHotPosts: async () => {
        const response = await api.get<{ success: boolean; data: Post[] }>('/explore/hot');
        return response.data.data;
    },
    search: async (q: string, filter: string, cursor?: string) => {
        const response = await api.get<{ success: boolean; data: SearchResult }>('/search', {
            params: { q, filter, cursor },
        });
        return response.data.data;
    },
    toggleFollow: async (userId: string) => {
        const response = await api.post<{ success: boolean; data: { followed: boolean } }>(`/users/${userId}/follow`);
        return response.data.data;
    },
};

import { Conversation, Message, PaginatedMessageResponse } from '../types/messages';

export const messageService = {
    getConversations: async () => {
        const response = await api.get<{ success: boolean; data: Conversation[] }>('/messages/conversations');
        return response.data.data;
    },
    getConversationById: async (id: string) => {
        const response = await api.get<{ success: boolean; data: Conversation }>('/messages/conversations/' + id);
        return response.data.data;
    },
    getMessages: async (conversationId: string, cursor?: string, limit: number = 20) => {
        const response = await api.get<{ success: boolean; data: PaginatedMessageResponse<Message> }>(
            '/messages/conversations/' + conversationId + '/messages',
            { params: { cursor, limit } }
        );
        return response.data.data;
    },
    sendMessage: async (conversationId: string, formData: FormData) => {
        const response = await api.post<{ success: boolean; data: Message }>(
            '/messages/conversations/' + conversationId + '/messages',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data.data;
    },
    markAsRead: async (conversationId: string) => {
        const response = await api.post<{ success: boolean; data: { unreadCount: 0 } }>(
            '/messages/conversations/' + conversationId + '/read'
        );
        return response.data.data;
    },
    startConversation: async (userId: string) => {
        const response = await api.post<{ success: boolean; data: Conversation }>('/messages/conversations', { userId });
        return response.data.data;
    },
    getUnreadCount: async () => {
        const response = await api.get<{ success: boolean; data: { unreadCount: number } }>('/messages/unread-count');
        return response.data.data.unreadCount;
    },
    mockLogin: async () => {
        const response = await api.post<{ success: boolean; data: { token: string; user: any } }>('/auth/mock-login');
        if (response.data.success) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data.data;
    },
    // Bookmarks
    toggleBookmark: async (postId: string) => {
        const response = await api.post<{ success: boolean; data: { isBookmarked: boolean } }>(
            '/tweets/' + postId + '/bookmark'
        );
        return response.data.data;
    },
    getBookmarks: async (cursor?: string, limit: number = 10) => {
        const response = await api.get<{ success: boolean; data: any }>( // using any for simplicity or import BookmarksResponse
            '/bookmarks',
            { params: { cursor, limit } }
        );
        return response.data.data;
    }
};

export const notificationService = {
    getUnreadCount: async () => {
        const response = await api.get<{ success: boolean; data: { count: number } }>('/notifications/unread-count');
        return response.data.data.count;
    }
};

export default api;
