import React, { useState } from 'react';
import './DescriptionBox.css';
import { motion, AnimatePresence } from 'framer-motion';

const DescriptionBox = () => {
  const [active, setActive] = useState('Description');
  const [userStars, setUserStars] = useState(0);

  const reviews = [
    { id: 1, name: 'Aisha', stars: 5, text: 'Fabric feels premium, stitching is clean. Definitely worth the price!' },
    { id: 2, name: 'Rohan', stars: 4, text: 'Color is slightly different from photos, but fit is perfect.' },
    { id: 3, name: 'Priya', stars: 5, text: 'Super comfy and got compliments the first day I wore it.' },
    { id: 4, name: 'Karan', stars: 3, text: 'Good quality, but delivery took a week longer than expected.' },
  ];

  const TABS = ['Description', 'Reviews'];

  return (
    <div className="descriptionbox-new">
      <div className="tab-header">
        {TABS.map((t) => (
          <button
            key={t}
            className={active === t ? 'active' : ''}
            onClick={() => setActive(t)}
          >
            {t}
          </button>
        ))}
        <motion.div className="underline" layoutId="underline" />
      </div>

      <AnimatePresence mode="wait">
        {active === 'Description' ? (
          <motion.div
            key="desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="content-panel"
          >
            <details open>
              <summary>Product Details</summary>
              <ul>
                <li>Lightweight, breathable cotton-poly blend.</li>
                <li>Pre-shrunk fabric to minimise shrinkage.</li>
                <li>Reinforced seams for extra durability.</li>
                <li>Machine wash cold, tumble dry low.</li>
              </ul>
            </details>

            <details>
              <summary>Size & Fit</summary>
              <p>Regular fit – true to size. Model is 6'0" and wears size M.</p>
            </details>

            <details>
              <summary>Shipping & Returns</summary>
              <p>Free shipping on orders over ₹499. 30-day hassle-free returns.</p>
            </details>
          </motion.div>
        ) : (
          <motion.div
            key="rev"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="content-panel reviews"
          >
            {/* user rating */}
            <div className="user-rating">
              <span>Your rating:</span>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={i < userStars ? 'filled' : ''}
                    onClick={() => setUserStars(i + 1)}
                  >
                    ★
                  </span>
                ))}
              </div>
              {userStars > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="star-thanks"
                >
                  Thanks for {userStars} stars!
                </motion.div>
              )}
            </div>

            {/* existing reviews */}
            <div className="review-list">
              {reviews.map((r, idx) => (
                <motion.div
                  key={r.id}
                  className="review-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="review-header">
                    <div className="avatar" style={{ '--color': `hsl(${r.id * 60}, 70%, 60%)` }}>
                      {r.name[0]}
                    </div>
                    <div>
                      <div className="name">{r.name}</div>
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < r.stars ? 'filled' : ''}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p>{r.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DescriptionBox;