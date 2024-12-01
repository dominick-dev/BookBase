import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Reviews from "../components/Reviews";

const ReviewsPage = () => {
  console.log("ReviewsPage component is rendering");
  const { isbn } = useParams();
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      console.log(`Fetching review data for ISBN: ${isbn}`);
      try {
        console.log(`Fetching review data for ISBN: ${isbn}`);
        const reviewResponse = await fetch(`http://localhost:8080/reviews/${isbn}?limit=10`);
        if (!reviewResponse || !reviewResponse.ok) {
          setReviewData(null);
          return;
        }
        const reviews = await reviewResponse.json();
        setReviewData(reviews);
        console.log("Review data fetched successfully");
      } catch (error) {
        console.log("Error fetching review data", error);
        setReviewData(null);
      } finally {
        setLoading(false);
      }
    };

    console.log("Fetching reviews...");
    fetchReviews();
  }, [isbn]);

  console.log("Review data:", reviewData);
  return (
    <Container>
      <Row>
        <Col md={12}>
          <h2>Reviews</h2>
          {loading ? (
            <p>Loading reviews...</p>
          ) : reviewData ? (
            <Reviews reviews={reviewData} />
          ) : (
            <p>No reviews found</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ReviewsPage;
