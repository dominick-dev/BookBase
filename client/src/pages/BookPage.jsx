import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Navbar, Nav } from "react-bootstrap";
import BookCard from "../components/BookCard";
import Reviews from "../components/Reviews";

const BookPage = () => {
  console.log("BookPage component is rendering");
  
  const { isbn } = useParams();
  const [bookData, setBookData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const fetchBookData = async () => {
      console.log(`Fetching book data for ISBN: ${isbn}`);
      try {
        const bookResponse = await fetch(`http://localhost:8080/book/${isbn}`);
        if (!bookResponse.ok) {
          setBookData(null);
          console.log("Error fetching book data", bookResponse.statusText);
          return;
        }
        const book = await bookResponse.json();
        setBookData(book);
        console.log("Book data fetched successfully");
      } catch (error) {
        console.log("Error fetching book data", error);
        setBookData(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      console.log(`Fetching reviews for ISBN: ${isbn}`);
      try {
        const reviewsResponse = await fetch(`http://localhost:8080/reviews/${isbn}`);
        if (!reviewsResponse.ok) {
          setReviews([]);
          console.log("Error fetching reviews", reviewsResponse.statusText);
          return;
        }
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
        console.log("Reviews fetched successfully");
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
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>Book App</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Row className="justify-content-center">
          <Col md={5}>
            {loading ? (
              <p>Loading book information...</p>
            ) : book ? (
              <BookCard book={book} />
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
    </>
  );
};

export default BookPage;
