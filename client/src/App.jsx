import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BookPage from "./pages/BookPage";
import HomePage from "./pages/HomePage";
import ReviewsPage from "./pages/ReviewsPage";
import AuthPage from "./pages/AuthPage";
import Authenticate from "./components/Authenticate";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book/:isbn" element={<BookPage />} />
        <Route path="/reviews/:isbn" element={<ReviewsPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/authenticate" element={<Authenticate />} />
      </Routes>
    </Router>
  );
}

export default App;
