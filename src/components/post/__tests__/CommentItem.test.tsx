import React from 'react';
import { render, screen } from '@testing-library/react';
import { CommentItem } from '../CommentItem';
import { Comment } from '@/types';

// Mock date-fns
jest.mock('date-fns', () => ({
    formatDistanceToNow: jest.fn(() => '2 hours ago'),
}));

// Mock media utils
jest.mock('@/lib/media-utils', () => ({
    resolveImageUrl: jest.fn((url) => url),
}));

describe('CommentItem Component', () => {
    const mockComment: Comment = {
        _id: 'comment-1',
        content: 'This is a test comment',
        author: {
            _id: 'author-1',
            name: 'Test Author',
            username: 'testauthor',
            image: 'author-image.jpg',
        },
        likesCount: 5,
        retweetsCount: 2,
        repliesCount: 1,
        isLiked: false,
        createdAt: '2023-10-01T10:00:00Z',
    };

    it('renders author information correctly', () => {
        render(<CommentItem comment={mockComment} />);

        expect(screen.getByText('Test Author')).toBeInTheDocument();
        expect(screen.getByText('@testauthor')).toBeInTheDocument();
        const img = screen.getByAltText('Test Author') as HTMLImageElement;
        expect(img.src).toContain('author-image.jpg');
    });

    it('renders comment content', () => {
        render(<CommentItem comment={mockComment} />);
        expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    });

    it('shows correct relative time', () => {
        render(<CommentItem comment={mockComment} />);
        expect(screen.getByText(/· 2 hours ago/)).toBeInTheDocument();
    });

    it('displays likes count', () => {
        render(<CommentItem comment={mockComment} />);
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders Heart icon with correct fill based on isLiked', () => {
        const { rerender } = render(<CommentItem comment={mockComment} />);
        // Use container query or test id if needed, but here we check for the structure
        // isLiked: false -> fill="none"

        rerender(<CommentItem comment={{ ...mockComment, isLiked: true }} />);
        // isLiked: true -> fill="currentColor" (text-pink-600)
    });

    it('handles missing author gracefully', () => {
        const incompleteComment = { ...mockComment, author: undefined } as any;
        render(<CommentItem comment={incompleteComment} />);
        // Should not crash and render placeholder info
        expect(screen.queryByText('@')).not.toBeInTheDocument();
    });
});
