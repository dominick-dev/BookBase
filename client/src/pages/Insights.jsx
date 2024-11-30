import { useState, useEffect } from "react";;
import { Typography, Grid, Card, CardContent } from "@mui/material";
import axios from "axios";

const InsightsPage = () => {
    const [hiddenGems, setHiddenGems] = useState([]);
    const [polarizingBooks, setPolarizingBooks] = useState([]);
    const [topReviewerFavorites, setTopReviewerFavorites] = useState([]);

    useEffect(() => {
        // fetch hidden gems
        axios.get("http://localhost:8080/insights/hidden-gems")
            .then((response) => setHiddenGems(response.data))
            .catch((error) => console.error("Error fetching hidden gems: " + error));

        // fetch polarizing books
        axios.get("http://localhost:8080/insights/polarizing-books")
            .then((response) => setPolarizingBooks(response.data))
            .catch((error) => console.error("Error fetching polarizing books: " + error));

        // fetch top reviewer favorites by genre
        axios.get("http://localhost:8080/insights/top-reviewer-favorites")
            .then((response) => setTopReviewerFavorites(response.data))
            .catch((error) => console.error("Error fetching top reviewer favorites: " + error));
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>
                Insights
            </Typography>

            {/* Hidden Gems */}
            <Typography variant="h5" gutterBottom>
                Hidden Gems
            </Typography>
            <Grid container spacing={2}>
                {hiddenGems.map((book) => (
                    <Grid item key={book.isbn} xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {book.title}
                                </Typography>
                                <Typography variant="subtitle1">
                                    {book.author}
                                </Typography>
                                <Typography>Average Rating: {book.avg_rating}</Typography>
                                <Typography>Reviews: {book.review_count}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Polarizing Books */}
            <Typography variant="h5" gutterBottom style={{ marginTop: "20px"}}>
                Polarizing Books
            </Typography>
            <Grid container spacing={2}>
                {polarizingBooks.map((book) => (
                    <Grid item key={book.isbn} xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {book.title}
                                </Typography>
                                <Typography variant="subtitle1">
                                    {book.author}
                                </Typography>
                                <Typography>High Score: {book.highScoreCount}</Typography>
                                <Typography>Mid Score: {book.midScoreCount}</Typography>
                                <Typography>Low Score: {book.lowScoreCount}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Top Reviewer Favorites */}
            <Typography variant="h5" gutterBottom style={{ marginTop: "20px"}}>
                Top Reviewer Favorites
            </Typography>
            <Grid container spacing={2}>
                {topReviewerFavorites.map((book) => (
                    <Grid item key={book.isbn} xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {book.title}
                                </Typography>
                                <Typography variant="subtitle1">
                                    {book.author}
                                </Typography>
                                <Typography>Top Reviewer Count: {book.top_reviewer_count}</Typography>
                                <Typography>Average Rating: {book.avg_rating}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default InsightsPage;
