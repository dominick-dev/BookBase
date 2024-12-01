import React, { useState, useEffect } from "react";
import BookCarousel from "../components/BookCarousel";
import HomePageHero from "../components/HomePageHero";
import TopAuthors from '../components/TopAuthors'
import GenreFacts from "../components/GenreFacts";
import NavBar from "../components/NavBar";
import { Routes, Route } from "react-router-dom";
import RandomBook from "../components/RandomBook";;

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
        console.log("Fetched data:", data);
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
    <NavBar />
    <Routes>
        <Route
          path="/"
          element={
            <>
                <HomePageHero />
                <BookCarousel />
                <div className="container mt-4" style={{ backgroundColor: 'wheat', padding: '20px' }}>
                    <div className="row">
                        <div className="col-md-5">
                            <TopAuthors/>
                        </div>
                        <div className="col-md-7">
                            <GenreFacts/>
                        </div>
                    </div>
                </div>
                <RandomBook/>
                
            </>
          }
        />
        <Route path="/books" element={<h1>BOOKS PAGE</h1>} />
        <Route path="/search" element={<h1>SEARCH</h1>} />
        <Route path="/insights" element={<h1>INTERESTING INSIGHTS</h1>} />
    </Routes>
    </>
  );
};

export default HomePage;
