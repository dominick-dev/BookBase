import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col} from "react-bootstrap";

const BookPage = () => {
  const { isbn } = useParams();
  const [bookData, setBookData] = useState(null);
  const [reviewData, setReviewData] = useState(null);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const bookResponse = await fetch(`http://localhost:8080/book/${isbn}`);
        const book = await bookResponse.json();
        setBookData(book);

        const reviewResponse = await fetch(`http://localhost:8080/reviews/${isbn}`);
        const reviews = await reviewResponse.json();
        setReviewData(reviews);
        } catch (error) {
            console.error("Error fetching book/review data", error);
        }
    };

    fetchBookData();
  
  }, [isbn]);

  return (
    <Container>
      <Row>
        <Col md={4}>
          {bookData ? (
              <img src={bookData[0].image} alt={bookData[0].title} />
          ) : (
            <p>Loading...</p>
          )}
        </Col>
        <Col md={8}>
          {bookData ? (
            <Container>
                <p><strong>{bookData[0].title}</strong></p>
                <p><strong>Author:</strong> {bookData[0].author}</p>
                <p><strong>ISBN:</strong> {bookData[0].isbn}</p>
                <p><strong>Publisher:</strong> {bookData[0].publisher}</p>
                <p><strong>Published Date:</strong> {bookData[0].published_date}</p>
                <p><strong>Description:</strong> {bookData[0].description}</p>
                <p><strong><a href={bookData[0].info_link}>Preview</a></strong></p>
            </Container>
          ) : (
            <p>Loading...</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BookPage;
