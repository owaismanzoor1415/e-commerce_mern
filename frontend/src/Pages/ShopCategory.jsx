import React, { useEffect, useState } from "react";
import "./ShopCategory.css";
import Item from "../Components/Item/Item";
import { Link } from "react-router-dom";
import { backend_url } from "../App";

const ShopCategory = (props) => {
  const [allProducts, setAllProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(0);

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

  /* ---- exact lower-case match – NO fallback ---- */
  const cat = String(props.category || "").toLowerCase().trim();
  const bannerText = {
    men: { title: "Men’s Streetwear", sub: "Fresh drops, fearless style." },
    women: { title: "Women’s Collection", sub: "Trend-led looks you’ll love." },
    kids: { title: "Kid’s Corner", sub: "Cute, comfy, colourful." }, // ✅ FIXED
  }[cat] || { title: cat, sub: "" };

  return (
    <div className="shopcategory-max">
      {/* always show banner so we SEE the real value */}
      <div className="hero-banner">
        <div className="hero-text">
          <h1>{bannerText.title}</h1>
          <p>{bannerText.sub}</p>
        </div>
      </div>

      <div className="shopcategory-header">
        <h1 className="whitish-text">Showing Items</h1>
        <div className="count-pill">{visibleCount}</div>
      </div>

      <div className="shopcategory-products">
        {filtered.map((item, i) => (
          <div
            key={item.id}
            className="product-card"
            style={{ "--delay": i * 0.1 }}
          >
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

      <div className="shopcategory-loadmore">
        <Link to="/" className="shimmer-btn">
          <span>Explore More</span>
        </Link>
      </div>
    </div>
  );
};

export default ShopCategory;
