import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserCard from '../UserCard';
import { useAuth } from '@/context/AuthContext';
import { exploreService } from '@/services/api';

// Mock dependencies
jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('@/services/api', () => ({
    exploreService: {
        toggleFollow: jest.fn(),
    },
}));

// Mock VerifiedBadge
jest.mock('../../common/VerifiedBadge', () => () => <div data-testid="verified-badge" />);

describe('UserCard', () => {
    const mockUser = {
        id: 'user-1',
        name: 'Target User',
        username: 'targetuser',
        isFollowing: false,
        verified: true,
        bio: 'Test bio info',
    };

    const currentUser = {
        _id: 'me-123',
        name: 'My Name',
    };

    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({ user: currentUser });
        (exploreService.toggleFollow as jest.Mock).mockResolvedValue({ followed: true });
    });

    it('renders user information correctly', () => {
        render(<UserCard user={mockUser} />);

        expect(screen.getByText('Target User')).toBeInTheDocument();
        expect(screen.getByText('@targetuser')).toBeInTheDocument();
        expect(screen.getByText('Test bio info')).toBeInTheDocument();
        expect(screen.getByTestId('verified-badge')).toBeInTheDocument();
    });

    it('shows "Follow" button if not following', () => {
        render(<UserCard user={mockUser} />);
        expect(screen.getByText('Follow')).toBeInTheDocument();
    });

    it('shows "Following" button if user.isFollowing is true', () => {
        render(<UserCard user={{ ...mockUser, isFollowing: true }} />);
        expect(screen.getByText('Following')).toBeInTheDocument();
    });

    it('toggles follow state when clicked', async () => {
        render(<UserCard user={mockUser} />);
        const button = screen.getByText('Follow');

        fireEvent.click(button);

        expect(exploreService.toggleFollow).toHaveBeenCalledWith('user-1');
        await waitFor(() => {
            expect(screen.getByText('Following')).toBeInTheDocument();
        });
    });

    it('does not show follow button for self', () => {
        render(<UserCard user={{ ...mockUser, id: 'me-123' }} />);
        expect(screen.queryByText('Follow')).not.toBeInTheDocument();
        expect(screen.queryByText('Following')).not.toBeInTheDocument();
    });
});
