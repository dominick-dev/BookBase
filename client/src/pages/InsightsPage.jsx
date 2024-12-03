import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import BookCarousel from "../components/BookCarousel";
import Navbar from "../components/Navbar";
import "../styles/InsightsPage.css";
import stars from "../assets/stars.png";
import scale from "../assets/scale.png";
import diamond from "../assets/diamond.png";

const genreOptions = [
  "Fiction",
  "Non-Fiction",
  "Biography & Autobiography",
  "History",
  "Science",
  "Arts & Music",
  "Business",
  "Education",
  "Children",
  "Travel",
  "Health & Wellness",
  "Technology & Engineering",
  "Language",
  "Social Sciences",
  "Spirituality & Religion",
  "Other",
];

const InsightsPage = () => {
  // State variables for modals
  const [openHiddenGemsModal, setOpenHiddenGemsModal] = useState(false);
  const [openPolarizingBooksModal, setOpenPolarizingBooksModal] =
    useState(false);
  const [openTopReviewerFavoritesModal, setOpenTopReviewerFavoritesModal] =
    useState(false);

  // State variables for Hidden Gems
  const [hiddenGems, setHiddenGems] = useState([]);
  const [hiddenGemsLoading, setHiddenGemsLoading] = useState(false);
  const [hiddenGemsError, setHiddenGemsError] = useState(null);

  // State variables for Polarizing Books
  const [polarizingBooks, setPolarizingBooks] = useState([]);
  const [polarizingBooksLoading, setPolarizingBooksLoading] = useState(false);
  const [polarizingBooksError, setPolarizingBooksError] = useState(null);

  // State variables for Top Reviewer Favorites
  const [topReviewerFavorites, setTopReviewerFavorites] = useState([]);
  const [topReviewerFavoritesLoading, setTopReviewerFavoritesLoading] =
    useState(false);
  const [topReviewerFavoritesError, setTopReviewerFavoritesError] =
    useState(null);
  const [selectedGenre, setSelectedGenre] = useState("Fiction");

  // Helper function to fetch book details
  const fetchBookDetails = async (isbns) => {
    try {
      const response = await axios.post("http://localhost:8080/books/batch", {
        isbns,
      });
      return response.data.books;
    } catch (error) {
      console.error("Error fetching book details: ", error);
      throw error;
    }
  };

  // Functions to handle modal open/close
  const handleOpenHiddenGems = () => setOpenHiddenGemsModal(true);
  const handleCloseHiddenGems = () => {
    setOpenHiddenGemsModal(false);
    setHiddenGems([]);
    setHiddenGemsError(null);
  };

  const handleOpenPolarizingBooks = () => setOpenPolarizingBooksModal(true);
  const handleClosePolarizingBooks = () => {
    setOpenPolarizingBooksModal(false);
    setPolarizingBooks([]);
    setPolarizingBooksError(null);
  };

  const handleOpenTopReviewerFavorites = () =>
    setOpenTopReviewerFavoritesModal(true);
  const handleCloseTopReviewerFavorites = () => {
    setOpenTopReviewerFavoritesModal(false);
    setTopReviewerFavorites([]);
    setTopReviewerFavoritesError(null);
  };

  // Handle genre change
  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  // Fetch hidden gems when modal opens
  useEffect(() => {
    const fetchHiddenGems = async () => {
      if (!openHiddenGemsModal) return;

      try {
        setHiddenGemsLoading(true);
        setHiddenGemsError(null);

        // Fetch hidden gems data
        const response = await axios.get("http://localhost:8080/hidden-gems");

        // Extract ISBNs
        const hiddenGemsISBNs = response.data.map((book) => book.isbn);

        // Fetch full book details using batch fetching
        const hiddenGemsBooks = await fetchBookDetails(hiddenGemsISBNs);

        // Update state variables
        setHiddenGems(hiddenGemsBooks);
      } catch (error) {
        console.error("Error fetching hidden gems: ", error);
        setHiddenGemsError("Error fetching hidden gems: " + error.message);
      } finally {
        setHiddenGemsLoading(false);
      }
    };

    fetchHiddenGems();
  }, [openHiddenGemsModal]);

  // Fetch polarizing books when modal opens
  useEffect(() => {
    const fetchPolarizingBooks = async () => {
      if (!openPolarizingBooksModal) return;

      try {
        setPolarizingBooksLoading(true);
        setPolarizingBooksError(null);

        // Fetch polarizing books data
        const response = await axios.get(
          "http://localhost:8080/polarizing-books"
        );

        // Extract ISBNs
        const polarizingBooksISBNs = response.data.map((book) => book.isbn);

        // Fetch full book details using batch fetching
        const polarizingBooksBooks = await fetchBookDetails(
          polarizingBooksISBNs
        );

        // Update state variables
        setPolarizingBooks(polarizingBooksBooks);
      } catch (error) {
        console.error("Error fetching polarizing books: ", error);
        setPolarizingBooksError(
          "Error fetching polarizing books: " + error.message
        );
      } finally {
        setPolarizingBooksLoading(false);
      }
    };

    fetchPolarizingBooks();
  }, [openPolarizingBooksModal]);

  // Fetch top reviewer favorites when modal opens or selectedGenre changes
  useEffect(() => {
    const fetchTopReviewerFavorites = async () => {
      if (!openTopReviewerFavoritesModal) return;

      try {
        setTopReviewerFavoritesLoading(true);
        setTopReviewerFavoritesError(null);

        // Fetch top reviewer favorite data
        const response = await axios.get(
          `http://localhost:8080/top-reviewer-favorites/${selectedGenre}`
        );

        // Extract ISBNs
        const topReviewerFavoritesISBNs = response.data.map(
          (book) => book.isbn
        );

        // Fetch full book details using batch fetching
        const topReviewerFavoritesBooks = await fetchBookDetails(
          topReviewerFavoritesISBNs
        );

        // Update state variables
        setTopReviewerFavorites(topReviewerFavoritesBooks);
      } catch (error) {
        console.error("Error fetching top reviewer favorites: ", error);
        setTopReviewerFavoritesError(
          "Error fetching top reviewer favorites: " + error.message
        );
      } finally {
        setTopReviewerFavoritesLoading(false);
      }
    };

    fetchTopReviewerFavorites();
  }, [openTopReviewerFavoritesModal, selectedGenre]);

  return (
    <>
      <Navbar />
      <Box sx={{ textAlign: "center", marginTop: 4, marginBottom: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Interesting Insights 🔎
        </Typography>
        <Typography variant="body1" align="left">
          Explore fascinating book insights from our carefully curated data.
          Discover hidden gems that deserve more attention, uncover polarizing
          books that spark heated debates, and see what the top reviewers in the
          community love the most!
        </Typography>
      </Box>
      <div className="insights-page">
        <Box sx={{ textAlign: "center", margin: 2 }}>
          <img
            src={diamond}
            alt="Hidden Gems"
            style={{ width: "50px", marginBottom: "10px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenHiddenGems}
            className="insight-button"
          >
            View Hidden Gems
          </Button>
          <img
            src={diamond}
            alt="Hidden Gems"
            style={{ width: "50px", marginBottom: "10px" }}
          />
        </Box>

        <Box sx={{ textAlign: "center", margin: 2 }}>
          <img
            src={scale}
            alt="Polarizing Books"
            style={{ width: "50px", marginBottom: "10px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenPolarizingBooks}
            className="insight-button"
          >
            View Polarizing Books
          </Button>
          <img
            src={scale}
            alt="Polarizing Books"
            style={{ width: "50px", marginBottom: "10px" }}
          />
        </Box>

        <Box sx={{ textAlign: "center", margin: 2 }}>
          <img
            src={stars}
            alt="Top Reviewer Favorites"
            style={{ width: "50px", marginBottom: "10px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenTopReviewerFavorites}
            className="insight-button"
          >
            View Top Reviewer Favorites
          </Button>
          <img
            src={stars}
            alt="Top Reviewer Favorites"
            style={{ width: "50px", marginBottom: "10px" }}
          />
        </Box>

        {/* Hidden Gems Modal */}
        <Dialog
          open={openHiddenGemsModal}
          onClose={handleCloseHiddenGems}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Hidden Gems</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Books with high ratings but fewer reviews, making them
              undiscovered treasures.
            </Typography>
            {hiddenGemsLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 6,
                }}
              >
                <CircularProgress />
              </Box>
            ) : hiddenGemsError ? (
              <Typography variant="body2" color="error" align="center">
                {hiddenGemsError}
              </Typography>
            ) : hiddenGems.length > 0 ? (
              <BookCarousel books={hiddenGems} />
            ) : (
              <Typography variant="body2" align="center">
                No hidden gems found.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseHiddenGems} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Polarizing Books Modal */}
        <Dialog
          open={openPolarizingBooksModal}
          onClose={handleClosePolarizingBooks}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Polarizing Books</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Books that spark strong opinions with high and low scores
              dominating the reviews.
            </Typography>
            {polarizingBooksLoading ? (
              <Box
                sx={{ display: "flex", justifyContent: "center", marginTop: 6 }}
              >
                <CircularProgress />
              </Box>
            ) : polarizingBooksError ? (
              <Typography variant="body2" color="error" align="center">
                {polarizingBooksError}
              </Typography>
            ) : polarizingBooks.length > 0 ? (
              <BookCarousel books={polarizingBooks} />
            ) : (
              <Typography variant="body2" align="center">
                No polarizing books found.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePolarizingBooks} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Top Reviewer Favorites Modal */}
        <Dialog
          open={openTopReviewerFavoritesModal}
          onClose={handleCloseTopReviewerFavorites}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Top Reviewer Favorites</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Books loved by the most active reviewers in the community.
            </Typography>

            <FormControl fullWidth sx={{ marginBottom: "20px" }}>
              <InputLabel id="genre-select-label">Genre</InputLabel>
              <Select
                labelId="genre-select-label"
                value={selectedGenre}
                onChange={handleGenreChange}
              >
                {genreOptions.map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {topReviewerFavoritesLoading ? (
              <Box
                sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
              >
                <CircularProgress />
              </Box>
            ) : topReviewerFavoritesError ? (
              <Typography variant="body2" color="error" align="center">
                {topReviewerFavoritesError}
              </Typography>
            ) : topReviewerFavorites.length > 0 ? (
              <BookCarousel books={topReviewerFavorites} />
            ) : (
              <Typography variant="body2" align="center">
                No top reviewer favorites found.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseTopReviewerFavorites} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default InsightsPage;
