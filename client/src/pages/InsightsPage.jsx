import { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import BookCarousel from "../components/BookCarousel";
import Navbar from "../components/Navbar";

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
  // state variables
  const [hiddenGems, setHiddenGems] = useState([]);
  const [hiddenGemsLoading, setHiddenGemsLoading] = useState(false);

  const [polarizingBooks, setPolarizingBooks] = useState([]);
  const [polarizingBooksLoading, setPolarizingBooksLoading] = useState(false);

  const [topReviewerFavorites, setTopReviewerFavorites] = useState([]);
  const [topReviewerFavoritesLoading, setTopReviewerFavoritesLoading] =
    useState(false);

  const [selectedGenre, setSelectedGenre] = useState("Fiction");
  const [error, setError] = useState(null);

  // helper function to fetch book details
  const fetchBookDetails = async (isbns) => {
    try {
      const bookPromises = isbns.map((isbn) =>
        axios.get(`http://localhost:8080/book/${isbn}`).then((res) => res.data)
      );
      const books = await Promise.all(bookPromises);
      return books;
    } catch (error) {
      console.error("Error fetching book details: ", error);
      throw error;
    }
  };

  useEffect(() => {
    // fetch insights data
    const fetchStaticInsights = async () => {
      try {
        setHiddenGemsLoading(true);
        setPolarizingBooksLoading(true);
        setError(null);

        // fetch data for hidden gems and polarizing books
        const [hiddenGemsRes, polarizingBooksRes] = await Promise.all([
          axios.get("http://localhost:8080/hidden-gems"),
          axios.get("http://localhost:8080/polarizing-books"),
        ]);

        // extract ISBNs from the response data
        const hiddenGemsISBNs = hiddenGemsRes.data.map((book) => book.isbn);
        const polarizingBooksISBNs = polarizingBooksRes.data.map(
          (book) => book.isbn
        );

        console.log(hiddenGemsISBNs, polarizingBooksISBNs);

        // fetch full book details
        const [hiddenGemsBooks, polarizingBooksBooks] = await Promise.all([
          fetchBookDetails(hiddenGemsISBNs),
          fetchBookDetails(polarizingBooksISBNs),
        ]);

        // update state variables
        setHiddenGems(hiddenGemsBooks);
        setPolarizingBooks(polarizingBooksBooks);
      } catch (error) {
        setError("Error fetching insights data: " + error.message);
      } finally {
        setHiddenGemsLoading(false);
        setPolarizingBooksLoading(false);
      }
    };

    fetchStaticInsights();
  }, []);

  useEffect(() => {
    const fetchTopReviewerFavorites = async () => {
      if (!selectedGenre) {
        setTopReviewerFavorites([]);
        return;
      }

      try {
        setTopReviewerFavoritesLoading(true);
        setError(null);

        const response = await axios.get(
          `http://localhost:8080/top-reviewer-favorites?${selectedGenre}`
        );

        // extract ISBNs from the response data
        const topReviewerFavoritesISBNs = response.data.map(
          (book) => book.isbn
        );

        // fetch full book details
        const topReviewerFavoritesBooks = await fetchBookDetails(
          topReviewerFavoritesISBNs
        );

        // update state
        setTopReviewerFavorites(topReviewerFavoritesBooks);
      } catch (error) {
        setError("Error fetching top reviewer favorites: " + error.message);
      } finally {
        setTopReviewerFavoritesLoading(false);
      }
    };

    fetchTopReviewerFavorites();
  }, [selectedGenre]);

  const handleGenreChange = async (event) => {
    setSelectedGenre(event.target.value);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ padding: "100px", backgroundColor: "#f5f5f5" }}>
        <Typography variant="h3" align="center" gutterBottom>
          Interesting Insights
        </Typography>

        {error && (
          <Box
            sx={{ padding: 2, backgroundColor: "#fdd", textAlign: "center" }}
          >
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          </Box>
        )}

        <Typography
          variant="body1"
          align="center"
          gutterBottom
          sx={{ marginBottom: "30px" }}
        >
          Discover hidden gems, polarizing books, and top reviewer favorites
          based on book reviews and ratings.
        </Typography>

        {/* Hidden Gems */}
        <Box sx={{ marginBottom: "40px" }}>
          <Typography variant="h4" gutterBottom>
            Hidden Gems
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Books with high ratings but fewer reviews, making them undiscovered
            treasures.
          </Typography>
          {hiddenGemsLoading ? (
            <Typography variant="body2" align="center">
              Loading hidden gems...
            </Typography>
          ) : hiddenGems.length > 0 ? (
            <BookCarousel books={hiddenGems} />
          ) : (
            <Typography variant="body2" align="center">
              No hidden gems found.
            </Typography>
          )}
        </Box>

        {/* Polarizing Books */}
        <Box sx={{ marginBottom: "40px" }}>
          <Typography variant="h4" gutterBottom>
            Polarizing Books
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Books that spark strong opinions with high and low scores dominating
            the reviews.
          </Typography>
          {polarizingBooksLoading ? (
            <Typography variant="body2" align="center">
              Loading polarizing books...
            </Typography>
          ) : polarizingBooks.length > 0 ? (
            <BookCarousel books={polarizingBooks} />
          ) : (
            <Typography variant="body2" align="center">
              No polarizing books found.
            </Typography>
          )}
        </Box>

        {/* Top Reviewer Favorites */}
        <Box>
          <Typography variant="h4" gutterBottom>
            Top Reviewer Favorites
          </Typography>
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
            <Typography variant="body2" align="center">
              Loading top reviewer favorites...
            </Typography>
          ) : topReviewerFavorites.length > 0 ? (
            <BookCarousel books={topReviewerFavorites} />
          ) : (
            <Typography variant="body2" align="center">
              No top reviewer favorites found for this genre.
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default InsightsPage;
