import "bootstrap/dist/css/bootstrap.min.css";
import BookCard from "./BookCard";
import "../styles/BookCard.css";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Navigation, Mousewheel } from "swiper/modules";
import { Box } from "@mui/material";

const BookCarousel = ({ books }) => {
  console.log("HomePage component is rendering");

  if (!books || books.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <h2>No books to display</h2>
      </Box>
    );
  }

  return (
    <>
      <div
        className="carousel"
        style={{
          backgroundColor: "#333",
          paddingTop: "30px",
          paddingBottom: "30px",
          border: "30px solid wheat",
        }}
      >
        <Swiper
          direction="horizontal"
          effect={"coverflow"}
          loop={true}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"4"}
          mousewheel={true}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          pagination={true}
          modules={[EffectCoverflow, Mousewheel, Navigation]}
          className="mySwiper"
        >
          {books.map((book, index) =>
            book ? (
              <SwiperSlide key={index}>
                <BookCard book={book} />
              </SwiperSlide>
            ) : null
          )}
        </Swiper>
      </div>
    </>
  );
};

export default BookCarousel;
