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

  const [selectedGenre, setSelectedGenre] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // fetch insights data
    const fetchStaticInsights = async () => {
      try {
        setHiddenGemsLoading(true);
        setPolarizingBooksLoading(true);
        setError(null);
        // fetch data for hidden gems and polarizing books
        const [hiddenGemsRes, polarizingBooksRes] = await Promise.all([
          axios.get("/hidden-gems"),
          axios.get("/polarizing-books"),
        ]);

        // update state with fetched data
        setHiddenGems(hiddenGemsRes.data);
        setPolarizingBooks(polarizingBooksRes.data);
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
          `/top-reviewer-favorites?genre=${selectedGenre}`
        );
        setTopReviewerFavorites(response.data);
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
          ) : (
            <Grid container spacing={3}>
              {hiddenGems.map((book, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <BookCard book={book} />
                </Grid>
              ))}
            </Grid>
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
          ) : (
            <Grid container spacing={3}>
              {polarizingBooks.map((book, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <BookCard book={book} />
                </Grid>
              ))}
            </Grid>
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
          {topReviewerFavoritesLoading ? (
            <Typography variant="body2" align="center">
              Loading top reviewer favorites...
            </Typography>
          ) : (
            <>
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
              <Grid container spacing={3}>
                {topReviewerFavorites.map((book, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4}>
                    <BookCard book={book} />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default InsightsPage;
