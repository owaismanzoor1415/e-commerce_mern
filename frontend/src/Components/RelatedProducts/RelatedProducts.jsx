import React, { useEffect, useState } from 'react';
import './RelatedProducts.css';
import Item from '../Item/Item';
import { backend_url } from '../../App';

const RelatedProducts = ({ category, id }) => {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    fetch(`${backend_url}/relatedproducts`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ category }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setRelated(data.products);
        else if (Array.isArray(data)) setRelated(data);
      });
  }, [category]);

  const filtered = related.filter((item) => item.id !== id);

  return (
    <div className="relatedproducts-max">
      <h1 className="whitish-title">Related Products</h1>
      <div className="related-grid">
        {filtered.map((item, i) => (
          <div
            key={item.id}
            className="related-card"
            style={{ '--delay': i * 0.08 }}
          >
            <div className="hologram-badge">NEW</div>
            <div className="glow-edge" />
            <Item
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;