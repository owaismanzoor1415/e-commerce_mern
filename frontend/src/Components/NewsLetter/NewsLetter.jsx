import React, { useState } from 'react';
import './NewsLetter.css';
import { useNotification } from '../../Context/NotificationContext';

const NewsLetter = () => {
  const { warning, success } = useNotification();
  const [email, setEmail] = useState('');

  // simple & safe email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubscribe = () => {
    if (!email) {
      warning('Please enter your email');
      return;
    }

    if (!isValidEmail(email)) {
      warning('Please enter a valid email address');
      return;
    }

    // Open user's email app ONLY if email is valid
    window.location.href =
      `mailto:${email}?subject=SwiftCart Newsletter&body=I want to subscribe to SwiftCart updates.`;

    success('Opening email app...');
    setEmail('');
  };

  return (
    <div className="news-wheel-wrapper">
      <div className="news-wheel">
        <div className="wheel-spokes">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="spoke" style={{ '--i': i }} />
          ))}
        </div>

        <div className="wheel-center">
          <h2>Join the Orbit</h2>
          <p>Lock in exclusive deals</p>

          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
          />

          <button onClick={handleSubscribe}>
            Lock In
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
