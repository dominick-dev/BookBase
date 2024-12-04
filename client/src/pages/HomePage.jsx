import React, { useState, useEffect } from "react";
import BookCarousel from "../components/BookCarousel";
import HomePageHero from "../components/HomePageHero";
import TopAuthors from "../components/TopAuthors";
import GenreFacts from "../components/GenreFacts";
import NavBar from "../components/NavBar";
import { Routes, Route, Navigate } from "react-router-dom";
import RandomBook from "../components/RandomBook";
import {
  CircularProgress,
  Box,
} from "@mui/material";
import Grid from '@mui/material/Grid2'
import HomePageCarouselHeader from "../components/HomePageCarouselHeader";

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // console.log("HomePage component is rendering");

  useEffect(() => {
    // Fetch books from the /20books route
    const fetchBooks = async () => {
      try {
        // console.log("Attempting to fetch books...");
        const response = await fetch("http://localhost:8080/20books");
        const data = await response.json();
        // console.log(`Fetched ${data.length} books.`);
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="300px"
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HomePageHero />
              <HomePageCarouselHeader />
              <BookCarousel books={books} />
              <RandomBook />
              <Box sx={{flexGrow: 1, bgcolor: 'wheat', paddingRight:'20px', paddingLeft: '20px', paddingBottom: '40px'}}>
                <Grid container spacing={2}>
                    <Grid size={5}>
                        <TopAuthors/>
                    </Grid>
                    <Grid size={7}>
                        <GenreFacts/>
                    </Grid>
                </Grid>
                </Box>
            </>
          }
        />
        <Route path="/search" element={<Navigate to="/searchBooks" />} />
        <Route path="/insights" element={<h1>INTERESTING INSIGHTS</h1>} />
      </Routes>
    </>
  );
};

export default HomePage;
