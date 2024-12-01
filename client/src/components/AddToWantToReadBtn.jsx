import axios from 'axios';
import { Button } from "@mui/material";

const AddToWantToReadBtn = ({ isbn }) => {
    const handleAddToWantToRead = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login to add books to want to read");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/add-to-want-to-read", { isbn }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert(response.data.message);
        } catch (err) {
            console.error("Error adding book to want to read: ", err);
            alert(err.response?.data?.message || "Failed to add book");
        }
    }

    return (
        <Button variant="contained" color="primary" onClick={handleAddToWantToRead}>
            Add to Want to Read
        </Button>
    )
}

export default AddToWantToReadBtn;