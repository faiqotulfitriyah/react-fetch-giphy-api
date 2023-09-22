import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import SearchGifs from './searchGIF';
import axios from 'axios';

jest.mock("axios");

test('SearchGifs snapshot', () => {
    const {asFragment} = render(<SearchGifs />);
    expect(asFragment()).toMatchSnapshot();
});

describe('SearchGifs Component', () => {
    it('renders correctly', () => {
        render(<SearchGifs />);
        const searchInput = screen.getByTestId('search-input');
        expect(searchInput).toBeTruthy();
    });

    it('displays trending GIFs initially', async () => {
        const mockTrendingData = {
        data: [
            { id: '1', images: { fixed_height: { url: 'https://example.com/1.gif' } }, title: 'GIF 1' },
            { id: '2', images: { fixed_height: { url: 'https://example.com/2.gif' } }, title: 'GIF 2' },
        ],
        };
        
        axios.get.mockResolvedValue({ data: mockTrendingData});

        render(<SearchGifs />);

        await waitFor(() => {
            expect(screen.getByText('Trending GIFs')).toBeTruthy();
        });
    });

    it('displays search results when a search is performed', async () => {
        const mockSearchData = {
            data: [
                { id: '3', images: { fixed_height: { url: 'https://example.com/3.gif' } }, title: 'GIF 3' },
            ],
        };
        axios.get.mockResolvedValue({ data: mockSearchData});

        render(<SearchGifs />);
        const searchInput = screen.getByTestId('search-input');
        const searchButton = screen.getByTestId('search-button');
        fireEvent.change(searchInput, { target: { value: 'pokemon' } });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(screen.getByTestId('search-result')).toBeTruthy();
        });
    });
});
