import React, { useEffect, useRef, useState } from 'react';
import './Popular.css';
import Item from '../Item/Item';
import { Link } from 'react-router-dom';

const Popular = ({ data }) => {
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
      className={`popular ${visible ? 'popular--visible' : ''}`}
      ref={sectionRef}
      onMouseMove={handleMouseMove}
    >
      {/* Magnetic spotlight that follows cursor */}
      <div
        className="popular__spotlight"
        style={{ '--mx': `${mousePos.x}%`, '--my': `${mousePos.y}%` }}
      />

      {/* Floating decorative orbs */}
      <div className="popular__orb popular__orb--1" />
      <div className="popular__orb popular__orb--2" />
      <div className="popular__orb popular__orb--3" />

      <div className="popular__inner">
        {/* Header */}
        <div className="popular__header">
          <div className="popular__title-block">
            <div className="popular__eyebrow">
              <span className="popular__pulse" />
              <span>Trending Now</span>
            </div>
            <h2 className="popular__title">
              <span className="popular__title-line">Popular</span>
              <span className="popular__title-line popular__title-line--accent">in Women</span>
            </h2>
            <p className="popular__subtitle">
              Curated picks loved by thousands this season
            </p>
          </div>

          <div className="popular__meta">
            <div className="popular__count">
              <span className="popular__count-num">{data?.length || 0}</span>
              <span className="popular__count-label">Items</span>
            </div>
            <Link to="/womens" className="popular__cta">
              <span className="popular__cta-text">View All</span>
              <span className="popular__cta-arrow">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* Progress bar / divider */}
        <div className="popular__divider">
          <div className="popular__divider-track">
            <div className="popular__divider-fill" />
          </div>
          <span className="popular__divider-label">
            {data?.length || 0} of {data?.length || 0} items
          </span>
        </div>

        {/* Grid */}
        <div className="popular__grid">
          {data?.map((item, index) => (
            <div
              key={item._id}
              className={`popular__item-wrap ${visible ? 'popular__item-wrap--in' : ''}`}
              style={{ '--delay': `${index * 80}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Rank badge */}
              {index < 3 && (
                <div className={`popular__rank popular__rank--${index + 1}`}>
                  #{index + 1}
                </div>
              )}
              {/* Hot badge */}
              {index === 0 && (
                <div className="popular__badge popular__badge--hot">🔥 HOT</div>
              )}

              <div className={`popular__item-inner ${hoveredIndex === index ? 'popular__item-inner--hovered' : ''}`}>
                <Item {...item} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="popular__footer">
          <div className="popular__footer-line" />
          <Link to="/womens" className="popular__footer-cta">
            Explore the full women's collection
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3.75 9H14.25M14.25 9L10.5 5.25M14.25 9L10.5 12.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <div className="popular__footer-line" />
        </div>
      </div>
    </section>
  );
};

export default Popular;