import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import BookPage from "./pages/BookPage";
import HomePage from "./pages/HomePage";
import InsightsPage from "./pages/InsightsPage";
import ReviewsPage from "./pages/ReviewsPage";
import SearchPage from "./pages/SearchPage";
import MapPage from "./pages/MapPage";
import AuthPage from "./pages/AuthPage";
import Authenticate from "./components/Authenticate";
import ProfilePage from "./pages/ProfilePage";
import "./styles/App.css";

function App() {
  // create protected route to ensure user is logged in before accessing protected page
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You need to login to access this page");
      return <Navigate to="/auth" />;
    }

    return children;
  };

  return (
    <Router>
      <Routes>
        {/* public routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/authenticate" element={<Authenticate />} />

        {/* protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:isbn"
          element={
            <ProtectedRoute>
              <BookPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews/:isbn"
          element={
            <ProtectedRoute>
              <ReviewsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insights"
          element={
            <ProtectedRoute>
              <InsightsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <MapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        {/* undefined routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
