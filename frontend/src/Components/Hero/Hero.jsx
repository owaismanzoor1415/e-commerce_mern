import React, { useEffect, useState, useRef } from 'react';
import './Hero.css';

const slides = [
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1800&auto=format&fit=crop",
  },
  {
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1800&auto=format&fit=crop",
  },
  {
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1800&auto=format&fit=crop",
  },
  {
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1800&auto=format&fit=crop",
  },
  {
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1800&auto=format&fit=crop",
  },
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1800&auto=format&fit=crop",
  },
  {
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1800&auto=format&fit=crop",
  },
  {
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1800&auto=format&fit=crop",
  },
  {
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1800&auto=format&fit=crop",
  },
  {
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1800&auto=format&fit=crop",
  },
];

const DURATION = 5000;

const Hero = () => {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  const nextIndex = (index + 1) % slides.length;

  const autoRef = useRef(null);
  const progRef = useRef(null);

  const startProgress = () => {
    setProgress(0);
    clearInterval(progRef.current);
    const start = Date.now();
    progRef.current = setInterval(() => {
      const p = Math.min(((Date.now() - start) / DURATION) * 100, 100);
      setProgress(p);
      if (p >= 100) clearInterval(progRef.current);
    }, 40);
  };

  const goTo = (next) => {
    if (next === index || transitioning) return;
    setPrevIndex(index);
    setTransitioning(true);
    setIndex(next);
    setTimeout(() => { setPrevIndex(null); setTransitioning(false); }, 1000);
    clearInterval(autoRef.current);
    startProgress();
    autoRef.current = setInterval(() => tick(), DURATION);
  };

  const tick = () => {
    setIndex(curr => {
      const next = (curr + 1) % slides.length;
      setPrevIndex(curr);
      setTransitioning(true);
      setTimeout(() => { setPrevIndex(null); setTransitioning(false); }, 1000);
      return next;
    });
    startProgress();
  };

  useEffect(() => {
    startProgress();
    autoRef.current = setInterval(tick, DURATION);
    return () => { clearInterval(autoRef.current); clearInterval(progRef.current); };
  }, []);

  const slide = slides[index];
  const prev = prevIndex !== null ? slides[prevIndex] : null;
  const thumbSlide = slides[nextIndex];

  return (
    <div className="hp-root">

      {/* BG layers */}
      {prev && (
        <div className="hp-bg hp-bg-out" style={{ backgroundImage: `url(${prev.image})` }} />
      )}
      <div key={index} className="hp-bg hp-bg-in" style={{ backgroundImage: `url(${slide.image})` }} />

      {/* Overlays */}
      <div className="hp-overlay-bottom" />
      <div className="hp-overlay-left" />
      <div className="hp-noise" />

      {/* Top-left brandmark */}
      <div className="hp-brandmark">
        <div className="hp-brandmark-line" />
        <span className="hp-brandmark-text">Est. 2006</span>
      </div>

      {/* Top-right counter */}
      <div className="hp-counter">
        <span className="hp-counter-idx">0{index + 1}</span>
        <div className="hp-counter-track">
          <div className="hp-counter-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="hp-counter-total">{slides.length}</span>
      </div>

      {/* Dot navigation */}
      <div className="hp-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hp-dot${i === index ? ' hp-dot-active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* BOTTOM RIGHT: single thumbnail = next slide */}
      <button
        className="hp-thumb"
        onClick={() => goTo(nextIndex)}
        aria-label={`View next slide`}
      >
        <div className="hp-thumb-img" style={{ backgroundImage: `url(${thumbSlide.image})` }} />
        <div className="hp-thumb-veil" />
        <div className="hp-thumb-meta">
          <span className="hp-thumb-label">Next</span>
        </div>
        <div className="hp-thumb-bar">
          <div className="hp-thumb-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </button>

    </div>
  );
};

export default Hero;