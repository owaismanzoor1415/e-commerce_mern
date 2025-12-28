import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { backend_url, currency } from "../../App";
import { useNotification } from "../../Context/NotificationContext";

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const { warning } = useNotification();
  const [selectedSize, setSelectedSize] = useState("");
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!selectedSize) {
      warning("Please select a size");
      return;
    }
    addToCart(product.id, selectedSize); // add product
    navigate("/cart");                   // OPEN Cart.js
  };

  return (
    <div className="productdisplay">
      {/* LEFT SIDE */}
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image.startsWith('http') ? product.image : backend_url + product.image} alt="" />
          <img src={product.image.startsWith('http') ? product.image : backend_url + product.image} alt="" />
          <img src={product.image.startsWith('http') ? product.image : backend_url + product.image} alt="" />
          <img src={product.image.startsWith('http') ? product.image : backend_url + product.image} alt="" />
        </div>

        <div className="productdisplay-img">
          <img
            className="productdisplay-main-img"
            src={product.image.startsWith('http') ? product.image : backend_url + product.image}
            alt=""
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="productdisplay-right">
        <h1>{product.name}</h1>

        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
        </div>

        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">
            {currency}{product.old_price}
          </div>
          <div className="productdisplay-right-price-new">
            {currency}{product.new_price}
          </div>
        </div>

        <p className="productdisplay-right-description">
          {product.description}
        </p>

        {/* SIZE SELECTION */}
        <div className="productdisplay-right-size">
          <h3>Select Size</h3>
          <div className="productdisplay-right-sizes">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div
                key={size}
                className={selectedSize === size ? "active" : ""}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        {/* ADD TO CART */}
        <button onClick={handleAddToCart}>
          ADD TO CART
        </button>

        <p className="productdisplay-right-category">
          <span>Category :</span> Jackets, T-shirt, Crop Top
        </p>
        <p className="productdisplay-right-category">
          <span>Tags :</span> Modern, Latest, Trending
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
