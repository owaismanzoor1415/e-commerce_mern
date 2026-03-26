import React, { useEffect, useState } from 'react';
import './Hero.css';

const images = [
  "https://plus.unsplash.com/premium_photo-1682146662576-900a71864a11?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=80", 
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800&auto=format", 
  "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1800&auto=format",
  "https://cdn.pixabay.com/photo/2016/11/22/19/08/hangers-1850082_1280.jpg" 
];

const Hero = () => {
  const [index, setIndex] = useState(0);

  // 🔥 auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className="hero-new"
      style={{ backgroundImage: `url(${images[index]})` }}
    >

      {/* ARROWS */}
      <div className="slider-arrow left" onClick={prevSlide}>❮</div>
      <div className="slider-arrow right" onClick={nextSlide}>❯</div>

      {/* DOTS */}
      <div className="slider-dots">
        {images.map((_, i) => (
          <div
            key={i}
            className={`slider-dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          ></div>
        ))}
      </div>

    </div>
  );
};

export default Hero;