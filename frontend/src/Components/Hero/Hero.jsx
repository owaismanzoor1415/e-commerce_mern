import React, { useState } from 'react';
import './Hero.css';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [ripple, setRipple] = useState(false);

  const cards = [
    { id: 1, label: 'Hoodies', color: '#ff4141' },
    { id: 2, label: 'Sweaters', color: '#4141ff' },
    { id: 3, label: 'Jackets', color: '#41ff41' },
    { id: 4, label: 'Tops', color: '#ff41ff' },
  ];

  const handleShopNow = () => {
    setRipple(true);
    setTimeout(() => setRipple(false), 600);
    navigate('/mens'); // or any route
  };

  return (
    <div className="hero-new">
      <div className="hero-left-new">
        <h1 className="glitch" data-text="DRESS DIFFERENT">
          DRESS DIFFERENT
        </h1>
        <p className="sub">Street-ready drops. Zero compromises.</p>
        <button className={`shop-now ${ripple ? 'ripple' : ''}`} onClick={handleShopNow}>
          <span>Shop The Drop</span>
        </button>
      </div>

      <div className="hero-right-new">
        {cards.map((c, i) => (
          <div
            key={c.id}
            className="float-card"
            style={{ '--delay': i * 0.2, '--color': c.color }}
          >
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;