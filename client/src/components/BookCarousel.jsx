import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import BookCard from './BookCard';

import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import { EffectCoverflow, Navigation, Mousewheel} from 'swiper/modules'

const BookCarousel = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("HomePage component is rendering");

  useEffect(() => {
    // Fetch books from the /20books route
    const fetchBooks = async () => {
      try {
        console.log("Attempting to fetch books...")
        const response = await fetch("http://localhost:8080/20books");
        const data = await response.json();
        console.log(`Fetched ${data.length} books.`);
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
    <div className="carousel" style={{backgroundColor: '#333', paddingTop: '20px', paddingBottom: '20px'}}>
    <Swiper
        direction="horizontal"
        effect={'coverflow'}
        loop={true}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'4'}
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
        {books.map((book, index) => (
            book ? (
                <SwiperSlide key={index}>
                <BookCard book={book}/>
                </SwiperSlide>
        ) : null
    ))}
    </Swiper>
    </div>
    </>
  );
};

export default BookCarousel;

