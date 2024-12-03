import React, { useState, useEffect } from "react";
import BookCarousel from "../components/BookCarousel";
import Navbar from "../components/NavBar";
import { CircularProgress, Box, Typography } from "@mui/material";
import axios from "axios";

const ProfilePage = () => {
  // state variables
  const [wantToReadISBNs, setWantToReadISBNs] = useState([]);
  const [books, setBooks] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [error, setError] = useState(null);

  // fetch users want to read list
  useEffect(() => {
    const fetchWantToReadList = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your Want to Read List");
        setLoadingList(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8080/get-want-to-read",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWantToReadISBNs(response.data.want_to_read);
      } catch (err) {
        console.error("Error retrieving Want to Read List: ", err);
        setError("Error retrieving Want to Read List");
      } finally {
        setLoadingList(false);
      }
    };

    fetchWantToReadList();
  }, []);

  // fetch book details for each ISBN
  useEffect(() => {
    const fetchBookDetails = async () => {
      if (wantToReadISBNs.length === 0) {
        setLoadingBooks(false);
        return;
      }

      try {
        const bookPromises = wantToReadISBNs.map((isbn) =>
          axios
            .get(`http://localhost:8080/book/${isbn}`)
            .then((response) => response.data)
        );

        const booksData = await Promise.all(bookPromises);
        const books = booksData.map((bookArray) => bookArray[0]);
        setBooks(books);
      } catch (err) {
        console.error("Error retrieving book details: ", err);
        setError("Error retrieving book details");
      } finally {
        setLoadingBooks(false);
      }
    };

    if (!loadingList && wantToReadISBNs.length > 0) {
      fetchBookDetails();
    } else if (!loadingList) {
      setLoadingBooks(false);
    }
  }, [loadingList, wantToReadISBNs]);

  // loading state
  if (loadingList || loadingBooks) {
    return (
      <>
        <Navbar />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="300px"
        >
          <CircularProgress />
          <Typography variant="h6" align="center" gutterBottom>
            Loading your Want to Read list...
          </Typography>
        </Box>
      </>
    );
  }

  // error state
  if (error) {
    return (
      <>
        <Navbar />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="300px"
        >
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      </>
    );
  }

  // success state
  return (
    <>
      <Navbar />
      <Typography variant="h4" align="center" gutterBottom>
        Your Want to Read List
      </Typography>
      {books.length > 0 ? (
        <BookCarousel books={books} />
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="300px"
        >
          <Typography variant="h6" align="center">
            You have no books in your Want to Read list. Check out the other
            pages and add some!
          </Typography>
        </Box>
      )}
    </>
  );
};

export default ProfilePage;
