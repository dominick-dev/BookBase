import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Rating } from '@mui/material';
import { getFallbackCover } from '../utils/bookUtils';
import { useNavigate } from 'react-router-dom';

const getBookDetails = (book) => {
  return {
    title: book.title || "No title available",
    author: book.author || "No author available",
    averageRating: book.avg_review || 0,
    image: book.image || getFallbackCover(book.title || "No title available"),
    isbn: book.isbn || "No ISBN available",
  };
};

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  if (typeof book !== 'object' || book === null) {
    console.error("Invalid book object:", book);
    return <div>Invalid book object</div>;
  }

  const { title, author, averageRating, image, isbn } = getBookDetails(book);

  const handleCardClick = () => {
    if (isbn) {
      navigate(`/book/${isbn}`);
    }
  };

  return (
    <div className='flip-card mx-auto' onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className='flip-card-inner'>
        <div className='flip-card-front'>
          <img 
            src={image}
            alt={`${title} Cover`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
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
                sx={{ color: '#ffb400' }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;