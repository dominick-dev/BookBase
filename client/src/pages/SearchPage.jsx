import React, { useState } from 'react';
import Modal from 'react-modal';
import BookCard from '../components/BookCard';
import SearchField from '../components/SearchField';

Modal.setAppElement('#root');

const SearchPage = () => {
  const [searchParams, setSearchParams] = useState({
    author: '',
    title: '',
    genre: '',
    isbn: '',
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [randomBook, setRandomBook] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSearch = async () => {
    const results = await fetchBooks(searchParams);
    setModalIsOpen(true); // Open the modal immediately
    setSearchResults(results);
    setRandomBook(null); // Clear random book if any
  };

  const handleRandomBook = async () => {
    setRandomBook({ title: 'Loading random book...' });
    setSearchResults([]); // Clear previous search results
    setModalIsOpen(true); // Open the modal immediately

    const book = await fetchRandomBook();
    setRandomBook(book);
  };

  return (
    <div className="container py-4">
        <h1 className="text-center mb-4">Book Search</h1>
        {/* Book Search Inputs */}
        <div className="row g-3 mb-3">
        {['author', 'title', 'genre', 'isbn'].map((field) => (
          <div className="col-md-3" key={field}>
            <SearchField
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={searchParams[field]}
              onChange={handleInputChange}
            />
          </div>
        ))}
      </div>
      <div className="text-center mb-3">
        {/* Book Search Buttons */}
        <button className="btn btn-primary me-2" onClick={handleSearch}>
          Search
        </button>
        <button className="btn btn-secondary" onClick={handleRandomBook}>
          Give me a random book
        </button>
      </div>

      {/* Book Search Results Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="modal-content"
        overlayClassName="modal-overlay"
        contentLabel="Search Results"
      >
        <div className="modal-header">
          <h5 className="modal-title">Search Results</h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setModalIsOpen(false)}
          ></button>
        </div>
        <div className="modal-body">
          {randomBook ? (
            <BookCard book={randomBook} />
          ) : searchResults.length > 0 ? (
            <ul className="list-group">
              {searchResults.map((book, index) => (
                <li key={index} className="list-group-item">
                  <BookCard book={book} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-muted">No results found.</div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setModalIsOpen(false)}>
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

// Functions to make API calls
const fetchBooks = async (params) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`http://localhost:8080/search?${queryString}`);
    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Failed to fetch books:", errorDetails);
      throw new Error(`Failed to fetch books: ${errorDetails.message}`);
    }
    console.log("response: ", response);
    return await response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

const fetchRandomBook = async () => {
  try {
    const response = await fetch('http://localhost:8080/random');
    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Failed to fetch random book:", errorDetails);
      throw new Error(`Failed to fetch random book: ${errorDetails.message}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching random book:', error);
    return null;
  }
};

export default SearchPage;
