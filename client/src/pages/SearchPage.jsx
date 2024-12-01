import React from 'react';
import Modal from 'react-modal';
import NavBar from '../components/NavBar';
import SearchComponent_nav from '../components/SearchComponent_nav';
import '../styles/BookCard.css';

Modal.setAppElement('#root');

const SearchPage = () => {
  return (
    <div>
      <NavBar />
      <div className="container py-4">
        <h1 className="text-center mb-4">Book Search</h1>
        <SearchComponent_nav />
      </div>
    </div>
  );
};

export default SearchPage;
