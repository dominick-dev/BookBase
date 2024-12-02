import React, { useState } from 'react';
import Modal from 'react-modal';
import BookCard from '../components/BookCard';
import SearchField from '../components/SearchField';
import '../styles/BookCard.css';

Modal.setAppElement('#root');

const SearchPage = () => {
  const [searchParams, setSearchParams] = useState({
    author: '',
    title: '',
    genre: '',
    isbn: '',
    limit: '',
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [randomBook, setRandomBook] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  // handle when a search is initiated 
  const initiateSearch = () => {
    setModalIsOpen(true);
    setSearchResults([]);
    setRandomBook(null);
    console.log("Initiating search...");
  };

  // handle when a search is executed
  const executeSearch = async () => {
    initiateSearch();
    setIsLoading(true);
    try {
      const results = await fetchBooks(searchParams);
      setSearchResults(results);
      console.log("Search results obtained: ", results);
    } catch (error) {
      console.error("Error fetching search results: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // handle when a random book is fetched
  const fetchRandomBookHandler = async () => {
    initiateSearch();
    setIsLoading(true);
    try {
      const book = await fetchRandomBook();
      console.log("Random book fetched: ", book);
      setRandomBook(book);
      setSearchParams({ author: '', title: '', genre: '', isbn: '', limit: '' });
    } catch (error) {
      console.error("Error fetching random book: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // handle when a search is executed by pressing enter from within any input field
  // or at any point when on the search page
  // or when the modal is open
  // for mac, this is cmd + enter
  const handleKeyDown = (e) => {
    console.log(`Key pressed: ${e.key}, Meta key: ${e.metaKey}`);
    if (e.key === 'Enter' || (e.metaKey && e.key === 'Enter')) {
      console.log("Executing search...");
      executeSearch();
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Book Search</h1>
      <div className="row g-3 mb-3">
        {['author', 'title', 'isbn', 'limit'].map((field) => (
          <div className="col-md-3" key={field}>
            <SearchField
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={searchParams[field]}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        ))}
        <div className="col-md-3">
          <select
            className="form-select"
            name="genre"
            value={searchParams.genre}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          >
            <option value="">Select Genre</option>
            {[
              "Fiction", "Non-Fiction", "Biography & Autobiography", "History",
              "Science", "Arts & Music", "Business", "Education", "Children",
              "Travel", "Health & Wellness", "Technology & Engineering",
              "Language", "Social Sciences", "Spirituality & Religion", "Other"
            ].map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="text-center mb-3">
        <button className="btn btn-primary me-2" onClick={executeSearch}>
          Search
        </button>
        <button className="btn btn-secondary" onClick={fetchRandomBookHandler}>
          Give me a random book
        </button>
      </div>
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
          {isLoading ? (
            <div className="text-center text-muted">Fetching results...</div>
          ) : randomBook ? (
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

const fetchBooks = async (params) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`http://localhost:8080/search?${queryString}`);
    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Failed to fetch books:", errorDetails);
      throw new Error(`Failed to fetch books: ${errorDetails.message}`);
    }
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
