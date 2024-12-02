import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import BookPage from "./pages/BookPage";
import HomePage from "./pages/HomePage";
import InsightsPage from "./pages/InsightsPage";
import ReviewsPage from "./pages/ReviewsPage";
import SearchPage from "./pages/SearchPage";
import MapPage from "./pages/MapPage"
import AuthPage from "./pages/AuthPage";
import Authenticate from "./components/Authenticate";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/book/:isbn" element={<BookPage />} />
        <Route path="/reviews/:isbn" element={<ReviewsPage />} />
        <Route path="/searchBooks" element={<SearchPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/authenticate" element={<Authenticate />} />
      </Routes>
    </Router>
  );
}

export default App;
