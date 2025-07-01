import React, { useState } from "react";
import "./Carousel.css";

const data = [
  {
    title: "Xcaret- Playa del Carmen, Q. R.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    background: require("./img/fondo1.png"),
    images: [
      require("./img/hotel1.png"),
      require("./img/hotel2.png"),
      require("./img/hotel3.png"),
    ],
  },
  {
    title: "Cancún - Zona Hotelera",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    background: require("./img/fondo2.png"),
    images: [
      require("./img/hotel2.png"),
      require("./img/hotel3.png"),
      require("./img/hotel1.png"),
    ],
  },
  {
    title: "Tulum - Riviera Maya",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    background: require("./img/fondo3.png"),
    images: [
      require("./img/hotel3.png"),
      require("./img/hotel1.png"),
      require("./img/hotel2.png"),
    ],
  },
];

const Carousel = () => {
  const [index, setIndex] = useState(0);
  const current = data[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % data.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + data.length) % data.length);
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <h2 className="carousel-title" style={{ paddingLeft: '90px' }}>Hoteles Recomendados</h2>
      <div
        className="carousel-container"
        style={{
          backgroundImage: `url(${current.background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "220px",
        }}
      >
        <div className="carousel-content">
          <div className="carousel-text">
            <h1>{current.title}</h1>
            <p>{current.description}</p>
          </div>

          <div className="carousel-slider" style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            {current.images.map((img, i) => (
              <img key={i} src={img} alt={`hotel-${i}`} className="carousel-image" />
            ))}
            <button className="arrow left" onClick={handlePrev} style={{ left: '-650px' }}>
              ‹
            </button>
            <button className="arrow right" onClick={handleNext}>
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
