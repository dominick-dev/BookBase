import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ReviewsPage from '../pages/ReviewsPage';
import '@testing-library/jest-dom';
import { act } from 'react';

const validIsbn = '0786243767';
const invalidIsbn = '12';

describe('ReviewsPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders reviews given a valid ISBN', async () => {
    const validIsbn = '0786243767';

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          username: "Midwest Book Review",
          score: 5,
          helpfulness: "3/3",
          summary: "Great book!",
          text: "Great book x100!",
          time: "2024-01-01",
          isbn: validIsbn,
          userid: "1234567890",
          review_id: "1234567890",
          price: 10,
        },
      ],
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={[`/reviews/${validIsbn}?limit=10`]}>
          <Routes>
            <Route path="/reviews/:isbn" element={<ReviewsPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Review by Midwest Book Review/i)).toBeInTheDocument();
      expect(screen.getByText(/Rating: 5\/10/i)).toBeInTheDocument();
      expect(screen.getByText(/Helpfulness: 3\/3/i)).toBeInTheDocument();
      expect(screen.getByText(/Great book!/i)).toBeInTheDocument();
    });
  });

  test('renders no reviews given an invalid ISBN', async () => {
    const invalidIsbn = '12';

    global.fetch.mockResolvedValueOnce({
      ok: false,
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={[`/reviews/${invalidIsbn}?limit=10`]}>
          <Routes>
            <Route path="/reviews/:isbn" element={<ReviewsPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/No reviews found/i)).toBeInTheDocument();
    });
  });
});
