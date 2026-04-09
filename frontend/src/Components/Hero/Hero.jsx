import React, { useEffect, useState, useRef } from 'react';
import './Hero.css';

const slides = [
  { image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1800&auto=format&fit=crop" },
  { image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1800&auto=format&fit=crop" },
  { image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1800&auto=format&fit=crop" },
  { image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1800&auto=format&fit=crop" },
  { image: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=1800&auto=format&fit=crop" },
  { image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=1800&auto=format&fit=crop" },
  { image: "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?q=80&w=1800&auto=format&fit=crop" },
  { image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1800&auto=format&fit=crop" },
];

const DURATION = 5000;

const Hero = () => {
  const [index, setIndex]           = useState(0);
  const [prevIndex, setPrevIndex]   = useState(null);
  const [progress, setProgress]     = useState(0);

  // Refs so interval callbacks always read the freshest values
  const indexRef = useRef(0);
  const transRef = useRef(false);
  const autoRef  = useRef(null);
  const progRef  = useRef(null);

  // ── Progress bar ────────────────────────────────
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

  // ── Core advance (always reads from ref) ────────
  const advance = (curr) => {
    if (transRef.current) return;
    const next = (curr + 1) % slides.length;
    transRef.current = true;
    setPrevIndex(curr);
    setIndex(next);
    indexRef.current = next;
    setTimeout(() => {
      setPrevIndex(null);
      transRef.current = false;
    }, 1000);
    startProgress();
  };

  // ── Manual jump ─────────────────────────────────
  const goTo = (next) => {
    if (next === indexRef.current || transRef.current) return;
    clearInterval(autoRef.current);
    const curr = indexRef.current;
    transRef.current = true;
    setPrevIndex(curr);
    setIndex(next);
    indexRef.current = next;
    setTimeout(() => {
      setPrevIndex(null);
      transRef.current = false;
    }, 1000);
    startProgress();
    autoRef.current = setInterval(() => advance(indexRef.current), DURATION);
  };

  useEffect(() => {
    startProgress();
    autoRef.current = setInterval(() => advance(indexRef.current), DURATION);
    return () => { clearInterval(autoRef.current); clearInterval(progRef.current); };
  }, []);

  const slide      = slides[index];
  const prev       = prevIndex !== null ? slides[prevIndex] : null;
  const nextIndex  = (index + 1) % slides.length;
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

      {/* Top-right counter */}
      <div className="hp-counter">
        <span className="hp-counter-idx">0{index + 1}</span>
        <div className="hp-counter-track">
          <div className="hp-counter-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="hp-counter-total">{slides.length}</span>
      </div>

      {/* BOTTOM RIGHT: thumbnail — key=nextIndex forces remount on every slide change */}
      <button
        className="hp-thumb"
        onClick={() => goTo(nextIndex)}
        aria-label="View next slide"
      >
        <div
          key={nextIndex}
          className="hp-thumb-img"
          style={{ backgroundImage: `url(${thumbSlide.image})` }}
        />
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