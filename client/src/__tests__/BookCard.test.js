import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookCard from '../components/BookCard';

describe('BookCard Component', () => {
  // test that the book card renders correctly with valid book data
  const validBook = {
    title: 'Test Book',
    author: 'Test Author',
    averageRating: 4.5,
    image: 'https://example.com/test-image.jpg',
  };

  // test that the book card renders correctly with incomplete book data
  // and the site does not crash
  const incompleteBook = {
    title: 'Test Book',
    author: 'Test Author',
  };

  const invalidBook = null;

  test('renders correctly with valid book data', () => {
    render(<BookCard book={validBook} />);
    
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('By Test Author')).toBeInTheDocument();
    expect(screen.getByAltText('Test Book Cover')).toHaveAttribute('src', validBook.image);
    
    // Check for the presence of the rating component
    const ratingElement = screen.getByRole('img', { name: /stars/i });
    expect(ratingElement).toBeInTheDocument();
  });

  test('renders fallback content with invalid book data', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<BookCard book={invalidBook} />);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid book object:', invalidBook);
    expect(screen.queryByText('No title available')).not.toBeInTheDocument();
    
    consoleErrorSpy.mockRestore();
  });

  test('renders correctly with incomplete book data', () => {
    const incompleteBook = {
      author: 'Test Author',
      averageRating: 0,
      image: 'https://placehold.co/100x150?text=Test%20Book&font=Lato.png'
    };
  
    render(<BookCard book={incompleteBook} />);
    
    // Ensure the fallback title is rendered
    expect(screen.getByText('No title available')).toBeInTheDocument();
  });

});