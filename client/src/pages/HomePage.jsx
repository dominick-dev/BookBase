import React from "react";
import BookCarousel from "../components/BookCarousel";
import HomePageHero from "../components/HomePageHero";
import TopAuthors from '../components/TopAuthors'
import GenreFacts from "../components/GenreFacts";
import NavBar from "../components/NavBar";
import { Routes, Route } from "react-router-dom";
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'
import RandomBook from "../components/RandomBook";

const HomePage = () => {
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
                <Box sx={{flexGrow: 1, bgcolor: 'wheat', padding: 4}}>
                <Grid container spacing={2}>
                    <Grid size={5}>
                        <TopAuthors/>
                    </Grid>
                    <Grid size={7}>
                        <GenreFacts/>
                    </Grid>
                </Grid>
                </Box>
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
