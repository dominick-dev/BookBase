import { useState, useEffect } from "react";
import { Typography, Grid, Box } from "@mui/material";
import BookCard from "../components/BookCard";

// dummy data 
const dummyHiddenGems = [
    { title: "Hidden Gem 1", author: "Author A", averageRating: 4.5 },
    { title: "Hidden Gem 2", author: "Author B", averageRating: 4.2 },
    { title: "Hidden Gem 3", author: "Author C", averageRating: 4.8 },
];

const dummyPolarizingBooks = [
    { title: "Polarizing Book 1", author: "Author D", averageRating: 3.0 },
    { title: "Polarizing Book 2", author: "Author E", averageRating: 3.5 },
    { title: "Polarizing Book 3", author: "Author F", averageRating: 2.5 },
];

const dummyTopReviewerFavorites = [
    { title: "Top Favorite 1", author: "Author G", averageRating: 4.9 },
    { title: "Top Favorite 2", author: "Author H", averageRating: 4.7 },
    { title: "Top Favorite 3", author: "Author I", averageRating: 4.8 },
];

const InsightsPage = () => {
    const [hiddenGems, setHiddenGems] = useState([]);
    const [polarizingBooks, setPolarizingBooks] = useState([]);
    const [topReviewerFavorites, setTopReviewerFavorites] = useState([]);

    useEffect(() => {
        setHiddenGems(dummyHiddenGems);
        setPolarizingBooks(dummyPolarizingBooks);
        setTopReviewerFavorites(dummyTopReviewerFavorites);
    }, []);

    return (
        <Box sx={{ padding: "40px", backgroundColor: "#f5f5f5" }}>
            <Typography variant="h3" align="center" gutterBottom>
                Interesting Insights
            </Typography>
            <Typography variant="body1" align="center" gutterBottom sx={{ marginBottom: "30px" }}>
                Discover hidden gems, polarizing books, and top reviewer favorites based on book reviews and ratings.
            </Typography>

            {/* Hidden Gems */}
            <Box sx={{ marginBottom: "40px" }}>
                <Typography variant="h4" gutterBottom>
                    Hidden Gems
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Books with high ratings but fewer reviews, making them undiscovered treasures.
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
                    Books that spark strong opinions with high and low scores dominating the reviews.
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
                <Grid container spacing={3}>
                    {topReviewerFavorites.map((book, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <BookCard book={book} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default InsightsPage;
