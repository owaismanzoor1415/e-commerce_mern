import React, { useState, useRef, useEffect } from 'react';
import './Subscribe.css';

const Subscribe = () => {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
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

  const handleSubmit = () => {
    if (email.trim()) setDone(true);
  };

  return (
    <section
      className={`sub ${visible ? 'sub--visible' : ''}`}
      ref={sectionRef}
      onMouseMove={handleMouseMove}
    >
      {/* Cursor spotlight */}
      <div
        className="sub__spotlight"
        style={{ '--mx': `${mousePos.x}%`, '--my': `${mousePos.y}%` }}
      />

      {/* Orbs */}
      <div className="sub__orb sub__orb--1" />
      <div className="sub__orb sub__orb--2" />
      <div className="sub__orb sub__orb--3" />

      {/* Decorative large text */}
      <div className="sub__watermark" aria-hidden="true">SUBSCRIBE</div>

      <div className="sub__inner">

        {/* Eyebrow */}
        <div className="sub__eyebrow">
          <span className="sub__pulse" />
          <span>Stay in the Loop</span>
        </div>

        {/* Title */}
        <h2 className="sub__title">
          <span className="sub__title-line">Exclusive Access,</span>
          <span className="sub__title-line sub__title-line--accent">Early Drops</span>
        </h2>

        {/* Description */}
        <p className="sub__desc">
          Subscribe for curated style edits, exclusive offers,<br />
          and early access to new collections.
        </p>

        {/* Perks row */}
        <div className="sub__perks">
          {['Free Shipping', 'Early Access', 'Members Deals'].map((perk) => (
            <div key={perk} className="sub__perk">
              <span className="sub__perk-dot" />
              {perk}
            </div>
          ))}
        </div>

        {/* Form or success */}
        {done ? (
          <div className="sub__success">
            <span className="sub__success-icon">✦</span>
            <p className="sub__success-text">You're on the list — welcome to SwiftCart.</p>
          </div>
        ) : (
          <div className={`sub__form-wrap ${focused ? 'sub__form-wrap--focused' : ''}`}>
            <input
              type="email"
              className="sub__input"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            <button className="sub__btn" onClick={handleSubmit}>
              <span className="sub__btn-text">Subscribe</span>
              <span className="sub__btn-arrow">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
          </div>
        )}

        {/* Fine print */}
        <p className="sub__fine">No spam, ever.Unsubscribe anytime.</p>

      </div>
    </section>
  );
};

export default Subscribe;