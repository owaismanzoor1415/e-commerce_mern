import React, { useState } from 'react';
import './NewsLetter.css';
import { useNotification } from '../../Context/NotificationContext';

const NewsLetter = () => {
  const { warning, success, error } = useNotification();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = async () => {
    if (!email) {
      warning('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      success(data.message || 'Subscribed!');
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      error('Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div className="news-wheel-wrapper">
      <div className={`news-wheel ${submitted ? 'done' : ''}`}>
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
          <button onClick={handleSubscribe} disabled={loading}>
            {loading ? 'Locking...' : 'Lock In'}
          </button>
        </div>
      </div>

      {submitted && (
        <div className="comet">
          <div className="comet-tail" />
          <div className="comet-head" />
        </div>
      )}
    </div>
  );
};

export default NewsLetter;