import React, { useContext } from 'react';
import './RelatedProducts.css';
import Item from '../Item/Item';
import { ShopContext } from '../../Context/ShopContext';

const RelatedProducts = ({ category }) => {
  const { products } = useContext(ShopContext);
  const related = products.filter(p => p.category === category).slice(0, 4);
  return (
    <section className="relatedproducts">
      <p className="relatedproducts-eyebrow">You May Also Like</p>
      <h2>Related Products</h2>
      <div className="relatedproducts-grid">
        {related.map(item => <Item key={item._id} {...item} />)}
      </div>
    </section>
  );
};

export default RelatedProducts;
