import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../input';

describe('Input Component', () => {
    it('renders label correctly', () => {
        render(<Input label="Username" />);
        expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('handles value changes', () => {
        const handleChange = jest.fn();
        render(<Input label="Username" onChange={handleChange} />);
        const input = screen.getByLabelText('Username');

        fireEvent.change(input, { target: { value: 'testuser' } });
        expect(input).toHaveValue('testuser');
        expect(handleChange).toHaveBeenCalled();
    });

    it('shows error message', () => {
        render(<Input label="Username" error="Required field" />);
        expect(screen.getByText('Required field')).toBeInTheDocument();
        expect(screen.getByText('Username')).toHaveClass('text-red-500');
    });

    it('toggles floating label state on focus/blur', () => {
        render(<Input label="Floating Label" />);
        const input = screen.getByLabelText('Floating Label');
        const label = screen.getByText('Floating Label');

        // Initially not floating (based on class check)
        expect(label).toHaveClass('top-1/2');

        fireEvent.focus(input);
        expect(label).toHaveClass('top-3');
        expect(label).toHaveClass('text-[12px]');

        fireEvent.blur(input);
        expect(label).toHaveClass('top-1/2');
    });

    it('keeps label floating if value is present', () => {
        render(<Input label="Floating Label" defaultValue="Some value" />);
        const label = screen.getByText('Floating Label');

        expect(label).toHaveClass('top-3');
    });

    it('renders in standard variant', () => {
        render(<Input label="Standard" variant="standard" />);
        const label = screen.getByText('Standard');
        expect(label).toHaveClass('text-[13px]');
    });

    it('passes extra props to input element', () => {
        render(<Input label="Email" type="email" placeholder="test@example.com" />);
        const input = screen.getByLabelText('Email') as HTMLInputElement;
        expect(input.type).toBe('email');
        expect(input.placeholder).toBe('test@example.com');
    });
});
