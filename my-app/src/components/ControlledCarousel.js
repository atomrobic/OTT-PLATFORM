import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './carousel.css';

const ControlledCarousel = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        <img
          className="d-block w-100 carousel-image"
          src="https://anniehaydesign.weebly.com/uploads/9/5/4/6/95469676/landscape-poster-2_orig.jpg"
          alt="First slide"
        />
        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 carousel-image"
          src="https://anniehaydesign.weebly.com/uploads/9/5/4/6/95469676/landscape-poster-3_orig.jpg"
          alt="Second slide"
        />
        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 carousel-image"
          src="https://external-preview.redd.it/2nViidY6n0gg2T5WVYtJR9tVMM69F-ZGNE_0cdeQFzs.jpg?auto=webp&s=01d970bf000fe8e03825dca7d2e415598ae17a06"
          alt="Third slide"
        />
        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default ControlledCarousel;
