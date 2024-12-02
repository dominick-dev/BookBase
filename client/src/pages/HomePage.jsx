import React, { useState, useEffect } from "react";
import BookCarousel from "../components/BookCarousel";
import HomePageHero from "../components/HomePageHero";
import TopAuthors from '../components/TopAuthors'
import GenreFacts from "../components/GenreFacts";
import NavBar from "../components/NavBar";
import { Routes, Route, Navigate } from "react-router-dom";
import RandomBook from "../components/RandomBook";
import { Container, Grid, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
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
        <Route path="/search" element={<Navigate to="/searchBooks" />} />
        <Route path="/insights" element={<h1>INTERESTING INSIGHTS</h1>} />
    </Routes>
    </>
  );
};

export default HomePage;
