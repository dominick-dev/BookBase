import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchPage from '../pages/SearchPage';

describe('SearchPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders SearchPage component', async () => {
    render(<SearchPage />);
    expect(await screen.findByText('Book Search')).toBeInTheDocument();
  });
});

afterAll(() => {
  const root = document.getElementById('root');
  if (root) {
    document.body.removeChild(root);
  }
});
