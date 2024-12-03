import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import BookCard from "../components/BookCard";
import Reviews from "../components/Reviews";
import NavBar from "../components/NavBar";
import '../styles/BookCard.css';

const BookPage = () => {
  // console.log("BookPage component is rendering");
  
  const { isbn } = useParams();
  const [bookData, setBookData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const fetchBookData = async () => {
      // console.log(`Fetching book data for ISBN: ${isbn}`);
      try {
        const bookResponse = await fetch(`http://localhost:8080/book/${isbn}`);
        if (!bookResponse.ok) {
          setBookData(null);
          console.log("Error fetching book data", bookResponse.statusText);
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
        const reviewsResponse = await fetch(`http://localhost:8080/reviews/${isbn}`);
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

  const book = bookData ? bookData[0] : null;

  return (
    <>
      <NavBar />
      <div style={{ marginTop: '100px' }}>
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
                      {book.title && <h4><strong>{book.title}</strong></h4>}
                      {book.author && <h5>{book.author}</h5>}
                      <br></br>
                      {book.isbn && <p><strong>ISBN: </strong>{book.isbn}</p>}
                      {book.num_pages && <p><strong>Number of Pages: </strong>{book.num_pages}</p>}
                      {book.published_date && <p><strong>Published: </strong>{book.published_date}</p>}
                      {book.description && <p><strong>Description: </strong>{book.description}</p>}
                      {book.preview_link && (<p><a href={book.preview_link} target="_blank" rel="noopener noreferrer">Preview</a></p>)}
                      {book.info_link && (<p><a href={book.info_link} target="_blank" rel="noopener noreferrer">More info</a></p>)}
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
      </div>
    </>
  );
};

export default BookPage;
