export interface User {
    _id: string;
    username: string;
    name: string;
    image?: string; // MongoDB model uses 'image'
    coverImage?: string;
    bio?: string;
    location?: string;
    website?: string;
    followersCount?: number;
    followingCount?: number;
    isFollowing?: boolean;
    isVerified?: boolean;
}

export interface Post {
    _id: string; // MongoDB uses _id
    author: User; // Populated author
    content: string;
    media?: string[]; // Backend uses 'media' array
    createdAt: string;
    likesCount: number;
    retweetsCount: number;
    repliesCount: number;
    hasLiked?: boolean; // These might need to be computed or fetched separately if not in scan
    hasRetweeted?: boolean;
    isLiked?: boolean; // Backend returns this key
    isRetweeted?: boolean; // Backend returns this key
    parentTweet?: Post | string;
    retweetOf?: Post | string;
}

export interface Comment extends Post {
    // Comment is essentially a Post with a parent
    // But we might want specific fields if they diverge
}

export interface Trend {
    id: string;
    name: string;
    posts: string;
}

export interface Suggestion extends User { }

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedPosts {
    docs: Post[];
    nextPage?: number | null;
}

// Re-export notification types
export * from './notifications';
