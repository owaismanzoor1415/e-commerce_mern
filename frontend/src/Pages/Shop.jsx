import React, { useEffect, useState } from 'react';
import Hero from '../Components/Hero/Hero';
import Popular from '../Components/Popular/Popular';
import NewCollections from '../Components/NewCollections/NewCollections';
import Subscribe from '../Components/Subscribe/Subscribe';
import { backend_url } from '../App';
import { motion } from 'framer-motion';

const Shop = () => {
  const [popular, setPopular] = useState([]);
  const [newcollection, setNewCollection] = useState([]);

  const fetchInfo = () => {
    fetch(`${backend_url}/popularinwomen`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setPopular(data.products);
        else if (Array.isArray(data)) setPopular(data);
      });
    fetch(`${backend_url}/newcollections`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setNewCollection(data.products);
        else if (Array.isArray(data)) setNewCollection(data);
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  /* Stagger reveal for each section */
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="shop-page">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <Hero />
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        transition={{ delay: 0.15 }}
      >
        {/* Skeleton fallback until data arrives */}
        {popular.length ? (
          <Popular data={popular} />
        ) : (
          <SkeletonGrid />
        )}
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        transition={{ delay: 0.3 }}
      >
        {newcollection.length ? (
          <NewCollections data={newcollection} />
        ) : (
          <SkeletonGrid />
        )}
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        transition={{ delay: 0.45 }}
      >
        <Subscribe />
      </motion.div>

      <style jsx global>{`
        .shop-page {
          --accent: #ff4141;
          --radius: 12px;
          --shadow: 0 8px 20px -6px rgba(0, 0, 0, 0.15);
          font-family: "Inter", system-ui, sans-serif;
        }
        /* Skeleton card grid */
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
          padding: 2rem;
        }
        .skeleton-card {
          background: #e2e2e2;
          border-radius: var(--radius);
          height: 280px;
          animation: pulse 1.2s infinite;
        }
        @keyframes pulse {
          0%   { opacity: 1; }
          50%  { opacity: 0.5; }
          100% { opacity: 1; }
        }
        /* Lift on hover for every product card */
        .product-item:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow);
          transition: transform 0.25s, box-shadow 0.25s;
        }
      `}</style>
    </div>
  );
};

/* Simple skeleton until data loads */
const SkeletonGrid = () => (
  <div className="skeleton-grid">
    {Array.from({ length: 8 }).map((_, i) => (
      <div className="skeleton-card" key={i} />
    ))}
  </div>
);

export default Shop;