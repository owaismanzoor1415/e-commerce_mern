import React, { useEffect, useRef, useState } from 'react';
import './NewCollections.css';
import Item from '../Item/Item';
import { Link } from 'react-router-dom';

const NewCollections = ({ data }) => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    }
  };

  return (
    <section
      className={`nc ${visible ? 'nc--visible' : ''}`}
      ref={sectionRef}
      onMouseMove={handleMouseMove}
    >
      {/* Cursor spotlight */}
      <div
        className="nc__spotlight"
        style={{ '--mx': `${mousePos.x}%`, '--my': `${mousePos.y}%` }}
      />

      {/* Decorative orbs */}
      <div className="nc__orb nc__orb--1" />
      <div className="nc__orb nc__orb--2" />
      <div className="nc__orb nc__orb--3" />

      <div className="nc__inner">

        {/* ── Header ── */}
        <div className="nc__header">
          <div className="nc__title-block">
            <div className="nc__eyebrow">
              <span className="nc__spark">✦</span>
              <span>Fresh Arrivals</span>
            </div>
            <h2 className="nc__title">
              <span className="nc__title-line">New</span>
              <span className="nc__title-line nc__title-line--accent">Collections</span>
            </h2>
            <p className="nc__subtitle">The latest styles, just landed this season</p>
          </div>

          <div className="nc__meta">
            <div className="nc__count">
              <span className="nc__count-num">{data?.length || 0}</span>
              <span className="nc__count-label">New Pieces</span>
            </div>
            <Link to="/" className="nc__cta">
              <span className="nc__cta-text">Explore All</span>
              <span className="nc__cta-arrow">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="nc__divider">
          <div className="nc__divider-track">
            <div className="nc__divider-fill" />
          </div>
          <span className="nc__divider-label">{data?.length || 0} items</span>
        </div>

        {/* ── Grid ── */}
        <div className="nc__grid">
          {data?.map((item, index) => (
            <div
              key={item._id}
              className={`nc__item-wrap ${visible ? 'nc__item-wrap--in' : ''}`}
              style={{ '--delay': `${index * 75}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* NEW badge on first 4 */}
              {index < 4 && (
                <div className="nc__badge">NEW</div>
              )}
              {/* SALE badge randomly */}
              {item.new_price && item.old_price && (
                <div className="nc__badge nc__badge--sale">
                  -{Math.round(((item.old_price - item.new_price) / item.old_price) * 100)}%
                </div>
              )}

              <div className={`nc__item-inner ${hoveredIndex === index ? 'nc__item-inner--hovered' : ''}`}>
                <Item {...item} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <div className="nc__footer">
          <div className="nc__footer-line" />
          <Link to="/" className="nc__footer-cta">
            Browse the full new collection
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3.75 9H14.25M14.25 9L10.5 5.25M14.25 9L10.5 12.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <div className="nc__footer-line" />
        </div>

      </div>
    </section>
  );
};

export default NewCollections;