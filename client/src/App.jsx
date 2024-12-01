import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BookPage from "./pages/BookPage";import { BrowserRouter, Routes, Route} from 'react-router-dom'

import HomePage from "./pages/HomePage";
import ReviewsPage from "./pages/ReviewsPage";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book/:isbn" element={<BookPage />} />
        <Route path="/reviews/:isbn" element={<ReviewsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
