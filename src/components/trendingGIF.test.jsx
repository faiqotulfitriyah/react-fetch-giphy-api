import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import TrendGifs from './trendingGIF';
import axios from 'axios';

jest.mock("axios");

test('TrendGifs snapshot', () => {
    const {asFragment} = render(<TrendGifs />);
    expect(asFragment()).toMatchSnapshot();
});

describe('TrendGifs Component', () => {
    it('renders correctly', async () => {
        const mockTrendData = {
            data: [
                { id: '1', images: { fixed_height: { url: 'https://example.com/1.gif' } }, title: 'GIF 1' },
                { id: '2', images: { fixed_height: { url: 'https://example.com/2.gif' } }, title: 'GIF 2' }
            ],
        };
        axios.get.mockResolvedValue({ data: mockTrendData });

        render(<TrendGifs />);

        // Note By Ka Andika: waitFor udh default sama expect
        await waitFor(() => screen.findByTestId('Trend-GIF'));
        expect(screen.getByText('Trending GIFs')).toBeTruthy();
        fireEvent.click(screen.getByText('Trending GIFs'));      
        expect(axios.get).toHaveBeenCalledWith(
            'https://api.giphy.com/v1/gifs/trending?api_key=CQ4jUWnYsaX3DnV1r4ihtdbHVz74LUF4'
        );

    });
});
