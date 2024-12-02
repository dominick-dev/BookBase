import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import { Container, Dropdown, DropdownButton } from "react-bootstrap";
import MarkerClusterGroup from "react-leaflet-cluster";
import NavBar from "../components/NavBar";
import '../styles/MapPage.css';


const MapPage = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [markers, setMarkers] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(2);


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
      const reviewResponse = await fetch(`http://localhost:8080/reviewsWithCoordinates/${countryName}`);
      const reviewData = await reviewResponse.json();
      setZoomLevel(2);

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

  const backgroundStyle = {
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    width: '100%',
  }

  };

  return (
    <>
    <NavBar/>
      <div className="map-page-body">
        <Container>
          <DropdownButton
            id="country-dropdown"
            title={selectedCountry || "Select country"}
            onSelect={handleSelect}
            className="my-5"
          >
            <div style={dropdownMenuStyle}>
              {countries && countries.length > 0 ? (  // if countries retrieved
                countries.map((item, index) => (  // display them in dropdpwn
                  <Dropdown.Item key={index} eventKey={item.country}>
                    {item.country}
                  </Dropdown.Item>
                ))
              ) : (
                <Dropdown.Item>Loading countries...</Dropdown.Item>
              )}
            </div>
          </DropdownButton>

          <MapContainer
            key={`${selectedCountry}-${zoomLevel}`}
            center={[0, 0]}
            zoom={zoomLevel}
            style={{height: "60vh", width: "100%"}}
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
      </div>
    </>
  );
};

export default MapPage;
