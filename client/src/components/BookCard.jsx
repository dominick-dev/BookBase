import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported
import {Rating} from '@mui/material'

const BookCard = ({book}) => {

  const fallBackCover = `https://placehold.co/100x150?text=${encodeURIComponent(book.title)}&font=Lato.png`;
  return (
    <div className='flip-card mx-auto'>
      <div className='flip-card-inner'>
        <div className='flip-card-front'>
        <img 
          src={book.image || fallBackCover}
          alt={`${book.title} Cover`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '0.25rem',
          }}        
        />
        </div>
        <div className ='flip-card-back'>
          <div 
            className='content-container'
          >
            <h2 className='card-title'>{book.title}</h2>
            <p className='card-text'>By {book.author}</p>

            <div className='book-rating'>
              <Rating
                name="read-only"
                value={book.averageRating || 0} 
                size="large"
                readOnly
                precision={0.1}
              />
            </div>
            </div>
            <div className='button-container'>
              <a href='#' className='btn-primary'>See More</a>
            </div>
          </div>
      </div>
    </div>
  );
};

export default BookCard