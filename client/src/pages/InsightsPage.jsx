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
import BookCard from "../components/BookCard";
import Navbar from "../components/Navbar";

// dummy data
const dummyHiddenGems = [
  { title: "Hidden Gem 1", author: "Author A", averageRating: 4.5 },
  { title: "Hidden Gem 2", author: "Author B", averageRating: 4.2 },
  { title: "Hidden Gem 3", author: "Author C", averageRating: 4.8 },
];

const dummyPolarizingBooks = [
  { title: "Polarizing 1", author: "Author D", averageRating: 3.0 },
  { title: "Polarizing 2", author: "Author E", averageRating: 3.5 },
  { title: "Polarizing 3", author: "Author F", averageRating: 2.5 },
];

const dummyTopReviewerFavorites = [
  { title: "Top Favorite 1", author: "Author G", averageRating: 4.9 },
  { title: "Top Favorite 2", author: "Author H", averageRating: 4.7 },
  { title: "Top Favorite 3", author: "Author I", averageRating: 4.8 },
];

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
  const [polarizingBooks, setPolarizingBooks] = useState([]);
  const [topReviewerFavorites, setTopReviewerFavorites] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fill with dummy data
    setHiddenGems(dummyHiddenGems);
    setPolarizingBooks(dummyPolarizingBooks);
    setTopReviewerFavorites(dummyTopReviewerFavorites);

    // fetch insights data after query optimization
    //     const fetchInsights = async () => {
    //       try {
    //         setLoading(true);

    //         // fetch data for hidden gems and polarizing books
    //         const [hiddenGemsRes, polarizingBooksRes] = await Promise.all([
    //           axios.get("/hidden-gems"),
    //           axios.get("/polarizing-books"),
    //         ]);

    //         // update state with fetched data
    //         setHiddenGems(hiddenGemsRes.data);
    //         setPolarizingBooks(polarizingBooksRes.data);

    //         const topReviewerFavoritesRes = await axios.get(
    //           `/top-reviewer-favorites?genre=${selectedGenre}`
    //         );
    //         setTopReviewerFavorites(topReviewerFavoritesRes.data);
    //       } catch (error) {
    //         console.error(error);
    //       } finally {
    //         setLoading(false);
    //       }
    //     };

    //     fetchInsights();
    //   }, [selectedGenre]);
  }, []);

  //   const handleGenreChange = async (event) => {
  //     const genre = event.target.value;
  //     setSelectedGenre(genre);

  //     try {
  //       setLoading(true);
  //       const response = await axios.get(
  //         `/top-reviewer-favorites?genre=${genre}`
  //       );
  //       setTopReviewerFavorites(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (loading) {
  //     return (
  //       <Box
  //         sx={{
  //           padding: "40px",
  //           backgroundColor: "#f5f5f5",
  //           textAlign: "center",
  //         }}
  //       >
  //         <Typography variant="h5" gutterBottom>
  //           Loading...
  //         </Typography>
  //       </Box>
  //     );
  //   }

  return (
    <>
      <Navbar />
      <Box sx={{ padding: "100px", backgroundColor: "#f5f5f5" }}>
        <Typography variant="h3" align="center" gutterBottom>
          Interesting Insights
        </Typography>
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
          <Grid container spacing={3}>
            {hiddenGems.map((book, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <BookCard book={book} />
              </Grid>
            ))}
          </Grid>
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
          <Grid container spacing={3}>
            {polarizingBooks.map((book, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <BookCard book={book} />
              </Grid>
            ))}
          </Grid>
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
              // onChange={handleGenreChange}
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
        </Box>
      </Box>
    </>
  );
};

export default InsightsPage;
