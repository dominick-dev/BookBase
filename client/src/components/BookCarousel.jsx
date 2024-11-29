import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import BookCard from './BookCard';


const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("HomePage component is rendering");

  useEffect(() => {
    // Fetch books from the /20books route
    const fetchBooks = async () => {
      try {
        console.log("Attempting to fetch books...")
        const response = await fetch("http://localhost:8080/20books");
        const data = await response.json();
        console.log(`Fetched ${data.length} books.`);
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
    <div className="container mt-5">
        <h1 className="text-center mb-4">Book Carousel</h1>
        <Carousel>
            {books.map((book, index) => (
            book ? ( // Check if book is not null or undefined
                <Carousel.Item key={index}>
                <BookCard book={book} />
                </Carousel.Item>
            ) : null // Do not render if book is invalid
            ))}
        </Carousel>
    </div>
    </>
  );
};

export default HomePage;

