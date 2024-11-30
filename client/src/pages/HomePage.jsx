import React from "react";
import BookCarousel from "../components/BookCarousel";
import HomePageHero from "../components/HomePageHero";
import NavBar from "../components/NavBar";
import { Routes, Route } from "react-router-dom";

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
