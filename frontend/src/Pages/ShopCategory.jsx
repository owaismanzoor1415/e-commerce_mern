import React, { useEffect, useState } from "react";
import "./ShopCategory.css";
import Item from "../Components/Item/Item";
import { Link } from "react-router-dom";
import { backend_url } from "../App";

const ShopCategory = (props) => {
  const [allProducts, setAllProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [index, setIndex] = useState(0);

  // 🔥 category-wise images
  const banners = {
    men: [
      "https://plus.unsplash.com/premium_photo-1661436770201-31243a668d1f?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1664702603058-2c1b6b45da3a?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1673644093493-07d0a0336516?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    women: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1753161024534-bdd13c6b37b0?q=80&w=1031&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1760304585521-be57e52623bb?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    kids: [
      "https://images.unsplash.com/photo-1711086340856-73591afb5d39?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1662022613148-35cd22218ab7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE3OHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1725147874578-fc76e0d865e1?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ]
  };

  const cat = String(props.category || "").toLowerCase().trim();
  const images = banners[cat] || [];

  // 🔥 auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  const fetchInfo = () => {
    fetch(`${backend_url}/allproducts`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setAllProducts(data.products);
        else if (Array.isArray(data)) setAllProducts(data);
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  useEffect(() => {
    const count = allProducts.filter(
      (p) => p.category === props.category
    ).length;
    setVisibleCount(count);
  }, [allProducts, props.category]);

  const filtered = allProducts.filter(
    (item) => item.category === props.category
  );

  return (
    <div className="shopcategory-max">

      {/* 🔥 AUTO IMAGE BANNER */}
      <div
        className="hero-banner"
        style={{ backgroundImage: `url(${images[index]})` }}
      >
        <div className="hero-overlay" />
      </div>

      {/* HEADER */}
      <div className="shopcategory-header">
        <h1 className="whitish-text">Showing Items</h1>
        <div className="count-pill">{visibleCount}</div>
      </div>

      {/* PRODUCTS */}
      <div className="shopcategory-products">
        {filtered.map((item, i) => (
          <div
            key={item._id}
            className="product-card"
            style={{ "--delay": i * 0.1 }}
          >
            <div className="glow-edge" />
            <Item {...item} />
          </div>
        ))}
      </div>

      <div className="shopcategory-loadmore">
        <Link to="/" className="shimmer-btn">
          <span>Explore More</span>
        </Link>
      </div>
    </div>
  );
};

export default ShopCategory;