import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Navbar, Nav } from "react-bootstrap";
import BookCard from "../components/BookCard";

const BookPage = () => {
  console.log("BookPage component is rendering");
  
  const { isbn } = useParams();
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);

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

    fetchBookData();
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
          <Col md={4}>
            {loading ? (
              <p>Loading book information...</p>
            ) : book ? (
              <BookCard book={book} />
            ) : (
              <p>No book found</p>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BookPage;
