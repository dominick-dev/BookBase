import React, { useState, useEffect } from "react";
import BookCarousel from "../components/BookCarousel";
import HomePageHero from "../components/HomePageHero";
import TopAuthors from "../components/TopAuthors";
import GenreFacts from "../components/GenreFacts";
import NavBar from "../components/NavBar";
import { Routes, Route, Navigate } from "react-router-dom";
import RandomBook from "../components/RandomBook";
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

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
              <Typography variant="h6" align="center" gutterBottom>
                Click on the book cards to learn more about the books!
              </Typography>
              <BookCarousel books={books} />
              <RandomBook />
              <Container
                sx={{ backgroundColor: "wheat", padding: "20px", mt: 4 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={5}>
                    <TopAuthors />
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <GenreFacts />
                  </Grid>
                </Grid>
              </Container>
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
