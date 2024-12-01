import React, { useState, useEffect } from "react";
import BookCarousel from "../components/BookCarousel";
import HomePageHero from "../components/HomePageHero";
import TopAuthors from '../components/TopAuthors'
import GenreFacts from "../components/GenreFacts";
import NavBar from "../components/NavBar";
import { Routes, Route } from "react-router-dom";
import RandomBook from "../components/RandomBook";
import { Container, Grid, Typography } from '@mui/material';

const HomePage = () => {
  console.log("HomePage component is rendering");

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
                <BookCarousel />
                <Container sx={{ backgroundColor: 'wheat', padding: '20px', mt: 4 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={5}>
                            <TopAuthors/>
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <GenreFacts/>
                        </Grid>
                    </Grid>
                </Container>
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
