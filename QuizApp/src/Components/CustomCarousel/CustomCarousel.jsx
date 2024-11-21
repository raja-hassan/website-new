import React, { useState } from "react";
import "./CustomCarousel.scss";

const Carousel = () => {
  const images = [
    "https://img.freepik.com/free-vector/maths-chalkboard_23-2148178220.jpg",
    "https://images.pexels.com/photos/9785613/pexels-photo-9785613.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/954585/pexels-photo-954585.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2402926/pexels-photo-2402926.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2653362/pexels-photo-2653362.jpeg?auto=compress&cs=tinysrgb&w=600",
  ];


  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const getVisibleImages = () => {
    return [
      images[currentIndex],
      images[(currentIndex + 1) % images.length],
      images[(currentIndex + 2) % images.length],
    ];
  };

  return (
    <>
      <div className="text-center mb-4">
        <h5
          className="mb-2 mt-5"
          style={{ fontWeight: "bold", fontSize: "1.8rem", color: "#2C3E50" }}
        >
          Discover & Learn
        </h5>
        <p
          className="text-muted"
          style={{ fontSize: "1.1rem", color: "#7F8C8D" }}
        >
          <span style={{ fontWeight: "bold", color: "#E74C3C" }}>
            Explore exciting quizzes
          </span>{" "}
          designed to
          <span style={{ fontWeight: "bold", color: "#3498DB" }}>
            {" "}
            entertain
          </span>
          ,
          <span style={{ fontWeight: "bold", color: "#2ECC71" }}> educate</span>
          , and
          <span style={{ fontWeight: "bold", color: "#F39C12" }}>
            {" "}
            challenge
          </span>{" "}
          you.
          <span style={{ fontWeight: "bold", color: "#8E44AD" }}>
            {" "}
            Start your journey
          </span>{" "}
          to fun learning today!
        </p>
      </div>

      <div className="carousel-container">
        <button className="prev-btn" onClick={prevImage}>
          ❮
        </button>
        <div className="carousel">
          {getVisibleImages().map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`carousel-${index}`}
              className="carousel-image"
            />
          ))}
        </div>
        <button className="next-btn" onClick={nextImage}>
          ❯
        </button>
      </div>
    </>
  );
};

export default Carousel;