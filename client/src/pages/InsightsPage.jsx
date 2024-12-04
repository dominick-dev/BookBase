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
import fam from "../assets/fam.png";

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

const ageOptions = ["Under 18", "18-30", "31-50", "51-65", "65+"];

const InsightsPage = () => {
  // state variables for modals
  const [openHiddenGemsModal, setOpenHiddenGemsModal] = useState(false);
  const [openPolarizingBooksModal, setOpenPolarizingBooksModal] =
    useState(false);
  const [openTopReviewerFavoritesModal, setOpenTopReviewerFavoritesModal] =
    useState(false);
  const [openAgeBooksModal, setOpenAgeBooksModal] = useState(false);

  // state variables for Hidden Gems
  const [hiddenGems, setHiddenGems] = useState([]);
  const [hiddenGemsLoading, setHiddenGemsLoading] = useState(false);
  const [hiddenGemsError, setHiddenGemsError] = useState(null);

  // state variables for Polarizing Books
  const [polarizingBooks, setPolarizingBooks] = useState([]);
  const [polarizingBooksLoading, setPolarizingBooksLoading] = useState(false);
  const [polarizingBooksError, setPolarizingBooksError] = useState(null);

  // state variables for Top Reviewer Favorites
  const [topReviewerFavorites, setTopReviewerFavorites] = useState([]);
  const [topReviewerFavoritesLoading, setTopReviewerFavoritesLoading] =
    useState(false);
  const [topReviewerFavoritesError, setTopReviewerFavoritesError] =
    useState(null);
  const [selectedGenre, setSelectedGenre] = useState("Fiction");

  // state variables for Age Books
  const [ageBooks, setAgeBooks] = useState([]);
  const [ageBooksLoading, setAgeBooksLoading] = useState(false);
  const [ageBooksError, setAgeBooksError] = useState(null);
  const [selectedAge, setSelectedAge] = useState("Under 18");

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

  const handleOpenAgeBooks = () => setOpenAgeBooksModal(true);
  const handleCloseAgeBooks = () => {
    setOpenAgeBooksModal(false);
    setAgeBooks([]);
    setAgeBooksError(null);
  };

  // handle genre change
  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  // handle age change
  const handleAgeChange = (event) => {
    setSelectedAge(event.target.value);
  };

  // fetch hidden gems when modal opens
  useEffect(() => {
    const fetchHiddenGems = async () => {
      if (!openHiddenGemsModal) return;

      try {
        setHiddenGemsLoading(true);
        setHiddenGemsError(null);

        // fetch hidden gems data
        const response = await axios.get("http://localhost:8080/hidden-gems");

        // extract ISBNs
        const hiddenGemsISBNs = response.data.map((book) => book.isbn);

        // fetch full book details using batch fetching
        const hiddenGemsBooks = await fetchBookDetails(hiddenGemsISBNs);

        // update state variables
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

  // fetch polarizing books when modal opens
  useEffect(() => {
    const fetchPolarizingBooks = async () => {
      if (!openPolarizingBooksModal) return;

      try {
        setPolarizingBooksLoading(true);
        setPolarizingBooksError(null);

        // fetch polarizing books data
        const response = await axios.get(
          "http://localhost:8080/polarizing-books"
        );

        // extract ISBNs
        const polarizingBooksISBNs = response.data.map((book) => book.isbn);

        // fetch full book details using batch fetching
        const polarizingBooksBooks = await fetchBookDetails(
          polarizingBooksISBNs
        );

        // update state variables
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

  // fetch top reviewer favorites when modal opens or selectedGenre changes
  useEffect(() => {
    const fetchTopReviewerFavorites = async () => {
      if (!openTopReviewerFavoritesModal) return;

      try {
        setTopReviewerFavoritesLoading(true);
        setTopReviewerFavoritesError(null);

        // fetch top reviewer favorite data
        const response = await axios.get(
          `http://localhost:8080/top-reviewer-favorites/${selectedGenre}`
        );

        // extract ISBNs
        const topReviewerFavoritesISBNs = response.data.map(
          (book) => book.isbn
        );

        // fetch full book details using batch fetching
        const topReviewerFavoritesBooks = await fetchBookDetails(
          topReviewerFavoritesISBNs
        );

        // update state variables
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

  // fetch age books when modal opens or selectedAge changes
  useEffect(() => {
    const fetchAgeBooks = async () => {
      if (!openAgeBooksModal) return;

      try {
        setAgeBooksLoading(true);
        setAgeBooksError(null);

        // fetch age books data
        const response = await axios.get(
          `http://localhost:8080/by-age-group/${selectedAge}`
        );

        // extract ISBNs
        const ageBooksISBNs = response.data.map((book) => book.isbn);

        // Fetch full book details using batch fetching
        const ageBooksBooks = await fetchBookDetails(ageBooksISBNs);

        // Update state variables
        setAgeBooks(ageBooksBooks);
      } catch (error) {
        console.error("Error fetching age books: ", error);
        setAgeBooksError("Error fetching age books: " + error.message);
      } finally {
        setAgeBooksLoading(false);
      }
    };
    fetchAgeBooks();
  }, [openAgeBooksModal, selectedAge]);

  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <Box
        sx={{
          gutterBottom: true,
          backgroundColor: "var(--primary-color)",
          color: "white",
          padding: 4,
          textAlign: "center",
          marginTop: 7.5,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Interesting Insights 🔎
        </Typography>
      </Box>

      <Box
        sx={{
          padding: "0 20px",
          maxWidth: "1000px",
          textAlign: "center",
          marginTop: 2,
          marginBottom: 2,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom></Typography>
        <Typography variant="body1" align="center">
          Explore interesting book insights from our carefully curated data.
          Discover hidden gems that deserve more attention, uncover polarizing
          books that spark heated debates, and see what the top reviewers in the
          community love the most!
        </Typography>
      </Box>
      <div className="insights-page">
        <div className="insights-container">
          {/* hidden gems button */}
          <Box
            sx={{
              textAlign: "center",
              margin: 2,
            }}
          >
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

          {/* polarizing books button */}
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

          {/* top reviewer favorites button */}
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

          {/* age book button */}
          <Box sx={{ textAlign: "center", margin: 2 }}>
            <img
              src={fam}
              alt="Top Books by Age Group"
              style={{ width: "50px", marginBottom: "10px" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenAgeBooks}
              className="insight-button"
            >
              View Top Books by Age Group
            </Button>
            <img
              src={fam}
              alt="Top Books by Age Group"
              style={{ width: "50px", marginBottom: "10px" }}
            />
          </Box>
        </div>

        {/* hidden gems modal */}
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

        {/* polarizing books modal */}
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

        {/* top reviewer favorites modal */}
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

        {/* age book modal */}
        <Dialog
          open={openAgeBooksModal}
          onClose={handleCloseAgeBooks}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Top Books By Age Group</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Books that are enjoyed by readers of different age groups.
            </Typography>

            <FormControl fullWidth sx={{ marginBottom: "20px" }}>
              <InputLabel id="genre-select-label">Age Range</InputLabel>
              <Select
                labelId="genre-select-label"
                value={selectedAge}
                onChange={handleAgeChange}
              >
                {ageOptions.map((age) => (
                  <MenuItem key={age} value={age}>
                    {age}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {ageBooksLoading ? (
              <Box
                sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
              >
                <CircularProgress />
              </Box>
            ) : ageBooksError ? (
              <Typography variant="body2" color="error" align="center">
                {ageBooksError}
              </Typography>
            ) : ageBooks.length > 0 ? (
              <BookCarousel books={ageBooks} />
            ) : (
              <Typography variant="body2" align="center">
                No books found in selected age range.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAgeBooks} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default InsightsPage;
