// frontend/src/types/notifications.ts
export type NotificationType = 'like' | 'follow' | 'mention' | 'comment' | 'repost' | 'message' | 'bookmark';

export interface Actor {
    _id: string;
    name: string;
    username: string;
    image?: string;
}

export interface PostPreview {
    _id: string;
    content: string;
    image?: string;
}

export interface Notification {
    _id: string;
    type: NotificationType;
    isRead: boolean;
    createdAt: string;
    actor: Actor;
    postId?: string;
    postPreview?: PostPreview;
    commentText?: string;
}

export interface PaginatedNotifications {
    items: Notification[];
    nextCursor: string | null;
}
