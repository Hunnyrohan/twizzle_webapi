import { Post } from './explore';

export interface BookmarkState {
    isBookmarked: boolean;
}

export interface BookmarksResponse {
    items: (Post & { isBookmarked: boolean })[];
    nextCursor?: string | null;
}
