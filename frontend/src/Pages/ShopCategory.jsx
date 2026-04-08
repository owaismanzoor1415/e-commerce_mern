import React, { useEffect, useState } from "react";
import "./ShopCategory.css";
import Item from "../Components/Item/Item";
import { Link } from "react-router-dom";
import { backend_url } from "../App";

const categoryLabels = { men: "Men's Collection", women: "Women's Collection", kids: "Kids' Collection" };
const categoryBanners = {
  men: "https://plus.unsplash.com/premium_photo-1661436770201-31243a668d1f?q=80&w=1600&auto=format&fit=crop",
  women: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80",
  kids: "https://images.unsplash.com/photo-1711086340856-73591afb5d39?q=80&w=1600&auto=format&fit=crop"
};

const ShopCategory = (props) => {
  const [allProducts, setAllProducts] = useState([]);
  const cat = String(props.category || "").toLowerCase().trim();

  useEffect(() => {
    fetch(`${backend_url}/allproducts`)
      .then(res => res.json())
      .then(data => {
        if (data.products) setAllProducts(data.products);
        else if (Array.isArray(data)) setAllProducts(data);
      });
  }, []);

  const filtered = allProducts.filter(item => item.category === props.category);

  return (
    <div className="shopcategory">
      <div className="shopcategory-banner-wrapper">
        <img src={categoryBanners[cat]} alt={cat} />
        <div className="shopcategory-banner-text">
          <p>Collection</p>
          <h1>{categoryLabels[cat] || "Shop"}</h1>
        </div>
      </div>

      <div className="shopcategory-products">
        <div className="shopcategory-products-header">
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Showing <span style={{ color: 'var(--accent)' }}>{filtered.length}</span> items
          </p>
          <div className="shopcategory-sort">
            <span>Sort by:</span>
            <select>
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        <div className="shopcategory-grid">
          {filtered.map(item => <Item key={item._id} {...item} />)}
        </div>

        <div className="shopcategory-loadmore">
          <Link to="/"><span>Explore All Collections</span></Link>
        </div>
      </div>
    </div>
  );
};

export default ShopCategory;
