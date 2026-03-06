export interface User {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    bio?: string;
    verified: boolean;
    isFollowing?: boolean;
}

export interface Post {
    id: string;
    userId: string;
    user: User; // Expanded user object usually comes with post
    content: string;
    imageUrl?: string;
    likes: number;
    reposts: number;
    comments: number;
    createdAt: string; // ISO date string
    hashtags: string[];
}

export interface HashtagTrend {
    tag: string;
    count: number;
}

export interface SearchResult {
    items: (Post | User | HashtagTrend)[]; // Mixed content based on filter
    nextCursor?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: {
        items: T[];
        nextCursor?: string;
    };
}

export interface APIResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code: string;
    };
}
