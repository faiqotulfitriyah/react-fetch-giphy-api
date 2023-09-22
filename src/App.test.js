import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import App from "./App";
import axios from "axios";

jest.mock("axios");

describe('App Component', () => {

    it('renders correctly', () => {
        const { container } = render(<App />);
        expect(container).toMatchSnapshot();
    });
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('switches to TrendGIF component when "Trending" button is clicked', async () => {
        
        render(<App />);       
        const trendButton = screen.getByText('Trending');
        fireEvent.click(trendButton);

        await waitFor(() => {
            const trendComponent = screen.queryByTestId('Trend-GIF');
            expect(trendComponent).toBeTruthy();
        });

        await screen.findByTestId('Trend-GIF');

        const searchComponent = screen.queryByTestId('Search-GIF');
        expect(searchComponent).toBeNull();
    });

    it('switches to SearchGIF component when "Search" button is clicked', async () => {
        render(<App />);

        const searchButton = screen.getByText('Search');
        fireEvent.click(searchButton);

        await waitFor(() => {
            const searchComponent = screen.queryByTestId('Search-GIF');
            expect(searchComponent).toBeTruthy();
        });

        await screen.findByTestId('Search-GIF');
    
        const trendComponent = screen.queryByTestId('Trend-GIF');
        expect(trendComponent).not.toBeNull();
    });

    it('makes an Axios call when "Search" button is clicked', async () => {
        const mockSearchData = {
            data: [
                { id: '3', images: { fixed_height: { url: 'https://example.com/3.gif' } }, title: 'GIF 3' }
            ],
        };

        axios.get.mockResolvedValue({ data: mockSearchData});

        render(<App />);
        const searchInput = screen.getByTestId('search-input');
        const searchButton = screen.getByTestId('search-button');

        fireEvent.change(searchInput, { target: { value: 'test' } });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(screen.getByTestId('search-result')).toBeTruthy();
        });
        
        expect(axios.get).toHaveBeenCalledWith('https://api.giphy.com/v1/gifs/search?api_key=CQ4jUWnYsaX3DnV1r4ihtdbHVz74LUF4&q=test');
    });

    it('makes an Axios call when "Trending" button is clicked', async () => {
        const mockTrendData = {
            data: [
                { id: '1', images: { fixed_height: { url: 'https://example.com/1.gif' } }, title: 'GIF 1' },
                { id: '2', images: { fixed_height: { url: 'https://example.com/2.gif' } }, title: 'GIF 2' },
            ]
        }

        axios.get.mockResolvedValue({ data: mockTrendData });

        render(<App />);

        await waitFor(() => {
            expect(screen.getByTestId('Trend-GIF')).toBeTruthy();
        });

        expect(axios.get).toHaveBeenCalledWith('https://api.giphy.com/v1/gifs/trending?api_key=CQ4jUWnYsaX3DnV1r4ihtdbHVz74LUF4')
    });
});