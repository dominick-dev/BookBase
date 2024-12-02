import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported
import {Rating} from '@mui/material'
import { getFallbackCover } from '../utils/bookUtils';
import AddToWantToReadBtn from './AddToWantToReadBtn';

// fallback function to get book details
const getBookDetails = (book) => {
  return {
    title: book.title || "No title available",
    author: book.author || "No author available",
    averageRating: book.averageRating || 0,
    image: book.image || getFallbackCover(book.title || "No title available"),
  };
};

// book card component
const BookCard = ({ book }) => {
  // console.log("BookCard component received book:", book);

  // perform some validation on the book object
  if (typeof book !== 'object' || book === null) {
    console.error("Invalid book object:", book);
    return <div>Invalid book object</div>;
  }

  // use the fallback function to get book details
  const { title, author, averageRating, image } = getBookDetails(book);
  // console.log("BookCard component extracted book details:", { title, author, averageRating, image });

  // book card component
  // console.log("BookCard component is returning the following JSX:");
  return (
    <div className='flip-card mx-auto'>
      <div className='flip-card-inner'>
        <div className='flip-card-front'>
          <img 
            src={image}
            alt={`${title} Cover`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '0.25rem',
            }}        
          />
        </div>
        <div className='flip-card-back'>
          <div className='content-container'>
            <h2 className='card-title'>{title}</h2>
            <p className='card-text'>By {author}</p>
            <div className='book-rating'>
              <Rating
                name="read-only"
                value={averageRating} 
                size="large"
                readOnly
                precision={0.1}
              />
            </div>
          </div>
          <AddToWantToReadBtn isbn={book.isbn} />
          <div className='button-container'>
            <a href='#' className='btn-primary'>See More</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;