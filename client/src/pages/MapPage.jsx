import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import { Container, Dropdown, DropdownButton } from "react-bootstrap";
import MarkerClusterGroup from "react-leaflet-cluster";


const MapPage = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryCoordinates, setCountryCoordinates] = useState({
    avg_latitude: 40.7,
    avg_longitude: -74.0
  });
  const [markers, setMarkers] = useState([]);

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
    maxHeight: "400px",  // height of dropdown menu itself
    overflowY: "auto",  // scroll
  };

  const handleSelect = async (countryName) => {
    setSelectedCountry(countryName);  // set in the dropdown

    try {
      // search database based on country name
      const countryResponse = await fetch(`http://localhost:8080/countryCoordinates/${countryName}`);
      const countryData = await countryResponse.json();

      if (countryData.length > 0) {
        setCountryCoordinates(countryData[0]);  // set based on query result
      } else {
        console.log("No lat/long found");
      }
    } catch (error) {
      console.error("Error fetching lat/long:", error);
    }

    try {
      // search database based on country name
      const reviewResponse = await fetch(`http://localhost:8080/reviewsWithCoordinates/${countryName}`);
      const reviewData = await reviewResponse.json();

      if (reviewData.length > 0) {

        const fetchedMarkers = reviewData.map(item => ({
          geocode: [item.latitude, item.longitude],
          city: item.city,
          state: item.state,
          userId: item.userid,
          title: item.title,
          author: item.author,
          score: item.score,
          link: `http://localhost:3000/book/${item.isbn}`
        }));

        setMarkers(fetchedMarkers);  // set based on query result
      } else {
        console.log("No markers found");
      }
    } catch (error) {
      console.error("Error fetching markers:", error);
    }


  };

  return (
    <Container>
      <DropdownButton
        id="country-dropdown"
        title={selectedCountry || "Select country"}
        onSelect={handleSelect}
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

      <MapContainer
        key={`${countryCoordinates.avg_latitude}-${countryCoordinates.avg_longitude}`} // map moves based on selection
        center={[countryCoordinates.avg_latitude, countryCoordinates.avg_longitude]} 
        zoom={5}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup>
          {markers.map(marker =>
            <Marker position={marker.geocode}>
              <Popup>
                <div>
                  User #{marker.userId} in {marker.city}, {marker.state}<br />
                  <br />
                  <a href={marker.link} target="_blank">{marker.title}</a><br />
                  By {marker.author}<br />
                  <br />
                  Score: {marker.score}/10
                </div>
              </Popup>
            </Marker>
          )}
        </MarkerClusterGroup>

      </MapContainer>
    </Container>
  );
};

export default MapPage;
