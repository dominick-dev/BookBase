import axios from "axios";
import { Button } from "@mui/material";

const AddToWantToReadBtn = ({ isbn }) => {
  // function to handle adding book to want to read
  const handleAddToWantToRead = async () => {
    // get token from local storage
    const token = localStorage.getItem("token");

    // check if user is logged in
    if (!token) {
      alert("Please login to add books to want to read");
      return;
    }

    // send request to server to add book to want to read
    try {
      const response = await axios.post(
        "http://localhost:8080/add-to-want-to-read",
        { isbn },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
    } catch (err) {
      console.error("Error adding book to want to read: ", err);
      alert(err.response?.data?.message || "Failed to add book");
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={handleAddToWantToRead}>
      Add to Want to Read
    </Button>
  );
};

export default AddToWantToReadBtn;
