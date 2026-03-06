import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Sidebar } from '../Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { usePathname } from 'next/navigation';
import { messageService, notificationService } from '@/services/api';

// Mock dependencies
jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
}));

jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('@/context/ModalContext', () => ({
    useModal: jest.fn(),
}));

jest.mock('@/services/api', () => ({
    messageService: {
        getUnreadCount: jest.fn(),
    },
    notificationService: {
        getUnreadCount: jest.fn(),
    },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    Home: () => <div data-testid="icon-home" />,
    Hash: () => <div data-testid="icon-explore" />,
    Bell: () => <div data-testid="icon-notifications" />,
    Mail: () => <div data-testid="icon-messages" />,
    User: () => <div data-testid="icon-profile" />,
    Settings: () => <div data-testid="icon-settings" />,
    LogOut: () => <div data-testid="icon-logout" />,
    MoreHorizontal: () => <div data-testid="icon-more" />,
    Bookmark: () => <div data-testid="icon-bookmark" />,
}));

describe('Sidebar', () => {
    const mockUser = {
        _id: '123',
        name: 'Test User',
        username: 'testuser',
        image: 'avatar.jpg',
    };

    const mockOpenPostModal = jest.fn();

    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
        (useModal as jest.Mock).mockReturnValue({ openPostModal: mockOpenPostModal });
        (usePathname as jest.Mock).mockReturnValue('/dashboard');
        (messageService.getUnreadCount as jest.Mock).mockResolvedValue(5);
        (notificationService.getUnreadCount as jest.Mock).mockResolvedValue(3);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with user data', async () => {
        render(<Sidebar />);

        await waitFor(() => {
            expect(screen.getByText('Twizzle')).toBeInTheDocument();
            expect(screen.getByText('Home')).toBeInTheDocument();
            expect(screen.getByText('Test User')).toBeInTheDocument();
            expect(screen.getByText('@testuser')).toBeInTheDocument();
        });
    });

    it('shows unread counts for messages and notifications', async () => {
        render(<Sidebar />);

        await waitFor(() => {
            expect(screen.getByText('5')).toBeInTheDocument(); // Messages unread
            expect(screen.getByText('3')).toBeInTheDocument(); // Notifications unread
        });
    });

    it('calls openPostModal when Post button is clicked', async () => {
        render(<Sidebar />);
        await waitFor(() => expect(screen.getByText('Post')).toBeInTheDocument());
        const postButton = screen.getByText('Post');
        fireEvent.click(postButton);
        expect(mockOpenPostModal).toHaveBeenCalled();
    });

    it('highlights the active link based on pathname', async () => {
        (usePathname as jest.Mock).mockReturnValue('/explore');
        render(<Sidebar />);
        await waitFor(() => expect(screen.getByText('Explore')).toBeInTheDocument());
        const exploreLink = screen.getByText('Explore').closest('a');
        expect(exploreLink).toHaveClass('text-blue-500');
    });

    it('handles logout clicking', async () => {
        const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

        render(<Sidebar />);
        await waitFor(() => expect(screen.getByText('Logout')).toBeInTheDocument());
        const logoutButton = screen.getByText('Logout');

        // JSDOM throws "Not implemented: navigation" when setting window.location.href
        // We catch it to ensure the test continues to verify side effects
        try {
            fireEvent.click(logoutButton);
        } catch (e) {
            // Ignore navigation error
        }

        expect(removeItemSpy).toHaveBeenCalledWith('token');
        expect(removeItemSpy).toHaveBeenCalledWith('user');

        removeItemSpy.mockRestore();
    });
});
