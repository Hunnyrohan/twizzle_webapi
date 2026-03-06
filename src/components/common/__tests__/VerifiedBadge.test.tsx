import React from 'react';
import { render, screen } from '@testing-library/react';
import VerifiedBadge from '../VerifiedBadge';

describe('VerifiedBadge', () => {
    it('renders the verified badge rosette path', () => {
        const { container } = render(<VerifiedBadge />);
        const rosette = container.querySelector('path[fill="url(#twizzle-premium-gradient)"]');
        expect(rosette).toBeInTheDocument();
    });

    it('renders the checkmark path', () => {
        const { container } = render(<VerifiedBadge />);
        const checkmark = container.querySelector('path[d="M8.5 12.5L10.5 14.5L15.5 9.5"]');
        expect(checkmark).toBeInTheDocument();
    });
});
