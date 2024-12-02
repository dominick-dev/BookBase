import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import { Container, Dropdown, DropdownButton } from "react-bootstrap";


const MapPage = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, handleSelect] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("http://localhost:8080/countriesList");
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const dropdownMenuStyle = {
    maxHeight: "200px",
    overflowY: "auto",  // scroll
  };

  return (
    <Container>
      <h1>HELLOO!!!!</h1>
    <DropdownButton
      id="country-dropdown"
      title={selectedCountry || "Select country"}
      onSelect={handleSelect}
      drop="down" // Optional, ensures dropdown is positioned correctly
    >
      <div style={dropdownMenuStyle}>
        {countries && countries.length > 0 ? (  // if countries retrieved
          countries.map((item, index) => (  // display them in dropdpwn
            <Dropdown.Item key={index} eventKey={item.country}>
              {item.country}
            </Dropdown.Item>
          ))
        ) : (
          <Dropdown.Item>Error: no countries available</Dropdown.Item>  // provide display error
        )}
      </div>
    </DropdownButton>

      <MapContainer center={[48.8566, 2.3522]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </Container>
  );
};

export default MapPage;
