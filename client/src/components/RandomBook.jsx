import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Card, CardContent, CircularProgress, Alert, Container, Rating } from "@mui/material";
import BookCard from './BookCard';
import '../styles/BookCard.css';
import { getBookDetails } from '../utils/bookUtils';

const RandomBook = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
//   console.log("RandomBook component is rendering");

  const fetchRandomBook = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("http://localhost:8080/random");
            if (!response.ok) throw new Error("Failed to fetch random book");
            const data = await response.json();
            setBook(data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch random book");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRandomBook();
    }, []);

    if (loading) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px" bgcolor="wheat">
            <CircularProgress sx={{ color: "#333" }} />
        </Box>
    );
    }

    if (error) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px" bgcolor="wheat">
            <Alert severity="error">{error}</Alert>
        </Box>
    );
    }

    const { title, author, description, averageRating, image } = getBookDetails(book);

    return (
    <>
    <Container
        maxWidth={false}
        sx={{
            bgcolor: 'wheat',
            padding: 4
        }}    
    >
    <Container
        maxWidth="md"
        sx={{
        bgcolor: "#333",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        padding: 4,
        marginY: 4,
        }}
    >
        <Typography variant="h4" align="center" gutterBottom style={{color: 'white', fontFamily:'lato, sans-serif', textDecoration: 'underline', fontWeight: 'bold'}}>
        Discover a Random Book
        </Typography>
        <Card
        sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            padding: 3,
            bgcolor: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
        }}
        >
        <BookCard book={book} />

        {/* Book Information */}
        <CardContent
            sx={{
            flex: 1,
            textAlign: { xs: "center", md: "left" },
            }}
        >
            <Typography variant="h5" gutterBottom>
            {title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            By: {author}
            </Typography>
            <Rating
            name="read-only"
            value={averageRating}
            readOnly
            precision={0.1}
            sx={{ color: "#ffb400", marginY: 2 }}
            />
            <Typography variant="body2" color="text.secondary" paragraph>
            {description}
            </Typography>
            <Box display="flex" justifyContent={{ xs: "center", md: "flex-start" }} gap={2} mt={3}>
            <Button
                variant="contained"
                onClick={fetchRandomBook}
                sx={{
                bgcolor: "#333",
                color: "white",
                "&:hover": { bgcolor: "#555" },
                }}
            >
                Get Another Book
            </Button>
            <Button
                variant="outlined"
                href={`/search/${book.isbn}`}
                sx={{
                color: "#333",
                borderColor: "#333",
                "&:hover": {
                    bgcolor: "#f5f5f5",
                    borderColor: "#555",
                },
                }}
            >
                Learn More
            </Button>
            </Box>
        </CardContent>
        </Card>
    </Container>
    </Container>
    </>
  );
};

export default RandomBook;
