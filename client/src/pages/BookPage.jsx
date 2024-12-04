import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import BookCard from "../components/BookCard";
import Reviews from "../components/Reviews";
import NavBar from "../components/NavBar";
import "../styles/BookCard.css";

const BookPage = () => {
  // console.log("BookPage component is rendering");

  const { isbn } = useParams();
  const [bookData, setBookData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [magnumOpusBook, setMagnumOpusBook] = useState(null);

  const author = bookData ? bookData[0]?.author : null;

  useEffect(() => {
    const fetchBookData = async () => {
      // console.log(`Fetching book data for ISBN: ${isbn}`);
      try {
        const bookResponse = await fetch(`http://localhost:8080/book/${isbn}`);
        if (!bookResponse.ok) {
          setBookData(null);
          // console.log("Error fetching book data", bookResponse.statusText);
          return;
        }
        const book = await bookResponse.json();
        setBookData(book);
        // console.log("Book data fetched successfully");
      } catch (error) {
        // console.log("Error fetching book data", error);
        setBookData(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      // console.log(`Fetching reviews for ISBN: ${isbn}`);
      try {
        const reviewsResponse = await fetch(
          `http://localhost:8080/reviews/${isbn}`
        );
        if (!reviewsResponse.ok) {
          setReviews([]);
          console.log("Error fetching reviews", reviewsResponse.statusText);
          return;
        }
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
        // console.log("Reviews fetched successfully");
      } catch (error) {
        console.log("Error fetching reviews", error);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchBookData();
    fetchReviews();
  }, [isbn]);

  const fetchMagnumOpusBook = async (author) => {
    try {
      const opusResponse = await fetch(
        `http://localhost:8080/magnum-opus/${author}`
      );
      if (!opusResponse.ok) {
        console.error("Error fetching magnum opus", opusResponse.statusText);
        setMagnumOpusBook(null);
        return;
      }
      const opusData = await opusResponse.json();

      const opusIsbn = opusData?.[0]?.isbn;
      if (!opusIsbn) {
        console.error("No ISBN found for magnum opus");
        setMagnumOpusBook(null);
        return;
      }

      const bookResponse = await fetch(
        `http://localhost:8080/book/${opusIsbn}`
      );

      if (!bookResponse.ok) {
        console.error(
          "Error fetching magnum opus book",
          bookResponse.statusText
        );
        setMagnumOpusBook(null);
        return;
      }
      const book = await bookResponse.json();

      setMagnumOpusBook(book[0] || null);
    } catch (error) {
      console.error("Error fetching magnum opus", error);
      setMagnumOpusBook(null);
    }
  };

  const handleModalOpen = async () => {
    if (bookData && bookData[0]?.author) {
      await fetchMagnumOpusBook(bookData[0].author);
    }
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setMagnumOpusBook(null);
  };

  const book = bookData ? bookData[0] : null;

  return (
    <>
      <NavBar />
      <div style={{ marginTop: "100px" }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={5}>
              {loading ? (
                <p>Loading book information...</p>
              ) : book ? (
                <>
                  <Container>
                    <BookCard book={book} />
                    <div className="book-details my-5 mx-3">
                      {/* render each if not null */}
                      {book.title && (
                        <h4>
                          <strong>{book.title}</strong>
                        </h4>
                      )}
                      {book.author && <h5>{book.author}</h5>}
                      <Button
                        variant="secondary"
                        onClick={handleModalOpen}
                        className="my-1"
                      >
                        Magnum Opus
                      </Button>
                      {book.isbn && (
                        <p>
                          <strong>ISBN: </strong>
                          {book.isbn}
                        </p>
                      )}
                      {book.num_pages && (
                        <p>
                          <strong>Number of Pages: </strong>
                          {book.num_pages}
                        </p>
                      )}
                      {book.published_date && (
                        <p>
                          <strong>Published: </strong>
                          {book.published_date}
                        </p>
                      )}
                      {book.description && (
                        <p>
                          <strong>Description: </strong>
                          {book.description}
                        </p>
                      )}
                      {book.preview_link && (
                        <p>
                          <a
                            href={book.preview_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Preview
                          </a>
                        </p>
                      )}
                      {book.info_link && (
                        <p>
                          <a
                            href={book.info_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            More info
                          </a>
                        </p>
                      )}
                    </div>
                  </Container>
                </>
              ) : (
                <p>No book found</p>
              )}
            </Col>
            <Col md={7}>
              <h3>Reviews</h3>
              {reviewsLoading ? (
                <p>Loading reviews...</p>
              ) : (
                <Reviews reviews={reviews} />
              )}
            </Col>
          </Row>
        </Container>
        <Modal show={modalOpen} onHide={handleModalClose} centered>
          <Modal.Header>
            <Modal.Title>{author}&apos;s Magnum Opus</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {magnumOpusBook ? (
              <BookCard book={magnumOpusBook} />
            ) : (
              <p>No magnum opus found.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default BookPage;
