import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { evaluate } from 'mathjs';

// Review component to display individual review
const Review = ({ review }) => {
    // console.log("review: ", review);

    // extract the values from the review object
    let { helpfulness, isbn, price, review_id, score, summary, text, time, userid, username } = review;

    // check if the review object is valid
    if (typeof review !== 'object' || review === null) {
        console.error("Invalid review object:", review);
        return <div>Invalid review object</div>;
    }

    // clean the values if needed
    // make sure score is between 0 and 10
    score = score !== undefined ? Math.max(0, Math.min(10, score)) : null;

    // make sure helpfulness is in the format of "x/x"
    const helpfulness_string = helpfulness ? helpfulness.replace(/\//g, '/') : "No helpfulness available"; 
    // evaluate the helpfulness string
    try {
        helpfulness = helpfulness_string !== "No helpfulness available" ? evaluate(helpfulness_string).toString() : null;
    } catch (error) {
        console.error("Error evaluating helpfulness:", error);
        helpfulness = null;
    }

    // get the summary or text from the review object
    const reviewerName = username || "Anonymous";
    summary = summary || "No summary available";
    const rating_string = score + "/10" || "No rating available";

    // state to manage flip state
    const [isFlipped, setIsFlipped] = useState(false);

    // render the review card
    return (
        <Card className="mb-3">
            <Card.Body>
                <div>   
                    <h3>Review by {reviewerName}</h3>
                    <p style={{ color: score >= 7 ? 'green' : score >= 4 ? 'orange' : 'red' }}>Rating: {rating_string}</p>
                    <p style={{ color: helpfulness >= 0.8 ? 'green' : helpfulness >= 0.5 ? 'orange' : 'red' }}>Helpfulness: {helpfulness_string}</p>
                    <p>{summary}</p>
                    {text && (
                        <Button variant="link" onClick={() => setIsFlipped(!isFlipped)}>
                            {isFlipped ? 'Hide Full Review' : 'Read Full Review'}
                        </Button>
                    )}
                </div>
                {isFlipped && <Card.Text>"{text}"</Card.Text>}
            </Card.Body>
        </Card>
    );
};

// Reviews component to display a list of reviews
const Reviews = ({ reviews }) => {
    // perform some validation on the reviews array
    if (!Array.isArray(reviews)) {
        console.error("Invalid reviews array:", reviews);
        return <div>Invalid reviews array</div>;
    }

    return (
    <div>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <Review key={index} review={review} />
        ))
      ) : (
        <p>No reviews available.</p>
      )}
    </div>
    );
};

export default Reviews; 