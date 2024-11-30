import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BookPage from '../pages/BookPage';
import '@testing-library/jest-dom';

const validIsbn = '0140366792';

describe('BookPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // check that the book component renders assuming the isbn server fetch call was successful
  test('renders book data assuming fetch call to server is successful', async () => {
    // mock the fetch response for the book data
    const mockBookData = [{ title: 'Heidi (Puffin Classics)', author: 'Johanna Spyri', isbn: validIsbn }];
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBookData,
    });

    // render the book page with the valid isbn
    render(
      <MemoryRouter initialEntries={[`/book/${validIsbn}`]}>
        <Routes>
          <Route path="/book/:isbn" element={<BookPage />} />
        </Routes>
      </MemoryRouter>
    );

    // check that the BookCard component is rendered with the correct book data
    await waitFor(() => {
      expect(screen.getByText('Heidi (Puffin Classics)')).toBeInTheDocument();
      expect(screen.getByText((content, element) => content.includes('Johanna Spyri'))).toBeInTheDocument();
    });
  });
});
