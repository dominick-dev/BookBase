import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import { Container } from "react-bootstrap";


const MapPage = () => {


  // useEffect(() => {
  //   const fetchBookData = async () => {
  //     console.log(`Fetching book data for ISBN: ${isbn}`);
  //     try {
  //       const bookResponse = await fetch(`http://localhost:8080/book/${isbn}`);
  //       if (!bookResponse.ok) {
  //         setBookData(null);
  //         console.log("Error fetching book data", bookResponse.statusText);
  //         return;
  //       }
  //       const book = await bookResponse.json();
  //       setBookData(book);
  //       console.log("Book data fetched successfully");
  //     } catch (error) {
  //       console.log("Error fetching book data", error);
  //       setBookData(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchBookData();
  // }, [isbn]);

  return (
    // <Container>
    //   <Col md={8}>
        <MapContainer center={[48.8566, 2.3522]} zoom={13}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
    //   </Col>
    // </Container>

  );
};

export default MapPage;
