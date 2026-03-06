import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../button';

describe('Button Component', () => {
    it('renders with children correctly', () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('applies default variant classes', () => {
        render(<Button>Default</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-black');
    });

    it('applies twitter variant classes', () => {
        render(<Button variant="twitter">Twitter</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-[#1d9bf0]');
        expect(button).toHaveClass('rounded-full');
    });

    it('handles click events', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click Me</Button>);
        fireEvent.click(screen.getByText('Click Me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('shows loading spinner and is disabled when isLoading is true', () => {
        render(<Button isLoading>Loading</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button.querySelector('svg')).toHaveClass('animate-spin');
    });

    it('respects the disabled prop', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('applies custom className', () => {
        render(<Button className="custom-class">Custom</Button>);
        expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('applies correct size classes', () => {
        const { rerender } = render(<Button size="sm">Small</Button>);
        expect(screen.getByRole('button')).toHaveClass('h-9');

        rerender(<Button size="lg">Large</Button>);
        expect(screen.getByRole('button')).toHaveClass('h-11');

        rerender(<Button size="full">Full</Button>);
        expect(screen.getByRole('button')).toHaveClass('w-full');
    });
});
