import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from '../SearchBar';

// Mock the debounce hook
jest.mock('../../../utils/debounce', () => ({
    useDebounce: (value: any) => value,
}));

describe('SearchBar', () => {
    const mockOnSearch = jest.fn();

    beforeEach(() => {
        mockOnSearch.mockClear();
    });

    it('renders with initial query', () => {
        render(<SearchBar onSearch={mockOnSearch} initialQuery="test" />);
        const input = screen.getByPlaceholderText('Search Twizzle...') as HTMLInputElement;
        expect(input.value).toBe('test');
    });

    it('calls onSearch when input changes', () => {
        render(<SearchBar onSearch={mockOnSearch} />);
        const input = screen.getByPlaceholderText('Search Twizzle...') as HTMLInputElement;

        fireEvent.change(input, { target: { value: 'react' } });

        expect(input.value).toBe('react');
        expect(mockOnSearch).toHaveBeenCalledWith('react');
    });

    it('clears query when clear button is clicked', () => {
        render(<SearchBar onSearch={mockOnSearch} initialQuery="something" />);
        const clearButton = screen.getByRole('button'); // The only button is the clear button

        fireEvent.click(clearButton);

        const input = screen.getByPlaceholderText('Search Twizzle...') as HTMLInputElement;
        expect(input.value).toBe('');
        expect(mockOnSearch).toHaveBeenCalledWith('');
    });

    it('updates internal state when initialQuery prop changes', () => {
        const { rerender } = render(<SearchBar onSearch={mockOnSearch} initialQuery="one" />);
        const input = screen.getByPlaceholderText('Search Twizzle...') as HTMLInputElement;
        expect(input.value).toBe('one');

        rerender(<SearchBar onSearch={mockOnSearch} initialQuery="two" />);
        expect(input.value).toBe('two');
    });
});
