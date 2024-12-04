import React from 'react';
import bookshelf from '../assets/bookshelf.png';
import '../styles/HomePageHero.css';

const HomePageHero = () => {
  return (
    <div
      className="hero-section"
      style={{
        height: '60vh',
        backgroundImage: `url(${bookshelf})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="hero-content">
        <h1>Welcome to BookBase</h1>
        <p>Stay a little and explore all things books</p>
      </div>
    </div>
  );
};

export default HomePageHero;
