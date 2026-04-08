import React, { useState } from 'react';
import './DescriptionBox.css';

const DescriptionBox = () => {
  const [tab, setTab] = useState('description');
  return (
    <div className="descriptionbox">
      <div className="descriptionbox-nav">
        <div className={`descriptionbox-nav-box ${tab === 'description' ? 'active' : ''}`} onClick={() => setTab('description')}>Description</div>
        <div className={`descriptionbox-nav-box ${tab === 'reviews' ? 'active' : ''}`} onClick={() => setTab('reviews')}>Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        {tab === 'description' ? (
          <p>An e-commerce website is a digital marketplace where products and services are bought and sold over the internet. It provides a seamless shopping experience with features like a searchable product catalog, detailed listings, a shopping cart, and secure checkout. Our platform is built with quality craftsmanship in mind — every piece curated for style, comfort, and lasting value.</p>
        ) : (
          <p>Customer reviews coming soon. Be the first to share your experience!</p>
        )}
      </div>
    </div>
  );
};

export default DescriptionBox;
