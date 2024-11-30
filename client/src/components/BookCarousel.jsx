import React, { useEffect, useState } from "react";
//import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import BookCard from './BookCard';

import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

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
    <div className="carousel" style={{backgroundColor: '#333', paddingTop: '12px', paddingBottom: '12px'}}>
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
          depth: 50,
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
    
    
    {/* <Carousel
    additionalTransfrom={0}
    arrows
    autoPlaySpeed={3000}
    centerMode
    className=""
    containerClass="container"
    dotListClass=""
    draggable
    focusOnSelect={false}
    infinite
    itemClass=""
    keyBoardControl
    minimumTouchDrag={80}
    pauseOnHover
    renderArrowsWhenDisabled={false}
    renderButtonGroupOutside={false}
    renderDotsOutside={false}
    responsive={{
        desktop: {
        breakpoint: {
            max: 3000,
            min: 1024
        },
        items: 3,
        partialVisibilityGutter: 40
        },
        mobile: {
        breakpoint: {
            max: 464,
            min: 0
        },
        items: 1,
        partialVisibilityGutter: 30
        },
        tablet: {
        breakpoint: {
            max: 1024,
            min: 464
        },
        items: 2,
        partialVisibilityGutter: 30
        }
    }}
    rewind={false}
    rewindWithAnimation={false}
    rtl={false}
    shouldResetAutoplay
    showDots={false}
    sliderClass=""
    slidesToSlide={1}
    swipeable
    >
        {books.map((book, index) => (
            book ? (
                <BookCard book={book}/>
        ) : null
    ))}
    </Carousel> */}


    {/* <div className="container mt-5" style={{padding: '0'}}>
        <h1 className="text-center mb-4">Book Carousel</h1>
        <Carousel style={{width:'100%'}}>
            {books.map((book, index) => (
            book ? ( // Check if book is not null or undefined
                <Carousel.Item key={index}>
                <BookCard book={book} />
                </Carousel.Item>
            ) : null // Do not render if book is invalid
            ))}
        </Carousel>
    </div> */}
    </>
  );
};

export default BookCarousel;

