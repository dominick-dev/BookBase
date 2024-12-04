import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/BookCard.css';
import { getBookDetails } from '../utils/bookUtils';
import AddToWantToReadBtn from './AddToWantToReadBtn';

// book card component
const BookCard = ({ book }) => {
  // console.log("BookCard component is rendering with book:", book);
  const navigate = useNavigate();

  if (typeof book !== 'object' || book === null) {
    console.error("Invalid book object:", book);
    return <div>Invalid book object</div>;
  }

  const { title, author, averageRating, image, isbn } = getBookDetails(book);

  const handleCardClick = () => {
    // console.log("Navigating to book with ISBN:", isbn);
    if (isbn && typeof isbn === 'string') {
      navigate(`/book/${isbn}`);
    } else {
      console.error("Invalid ISBN:", isbn);
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
            <h2 className='card-title' style={{color: 'wheat'}}>{title}</h2>
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
          <AddToWantToReadBtn isbn={book.isbn} />
        </div>
      </div>
    </div>
  );
};

export default BookCard;