import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';
import { backend_url, currency } from '../../App';
import { useNotification } from '../../Context/NotificationContext';

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const ProductDisplay = ({ product }) => {
  const { addToCart, removeFromCart } = useContext(ShopContext);
  const { warning, success } = useNotification();
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [mainIdx, setMainIdx] = useState(0);
  const navigate = useNavigate();

  const thumbnails = [product.image, product.image, product.image, product.image];
  const imgSrc = (img) => img?.startsWith('http') ? img : backend_url + img;

  const handleAddToCart = () => {
    if (!selectedSize) return warning('Please select a size');
    addToCart(product._id, qty, selectedSize, true);
    success('Added to cart!');
    setTimeout(() => navigate('/cart'), 600);
  };

  return (
    <div className="productdisplay">
      {/* LEFT – Gallery */}
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {thumbnails.map((img, idx) => (
            <img
              key={idx}
              src={imgSrc(img)}
              alt=""
              className={idx === mainIdx ? 'active' : ''}
              onClick={() => setMainIdx(idx)}
            />
          ))}
        </div>
        <div className="productdisplay-img">
          <img className="productdisplay-main-img" src={imgSrc(thumbnails[mainIdx])} alt={product.name} />
        </div>
      </div>

      {/* RIGHT – Info */}
      <div className="productdisplay-right">
        <p className="productdisplay-right-category">{product.category}</p>
        <h1 className="productdisplay-right-name">{product.name}</h1>

        <div className="productdisplay-right-star">
          {[...Array(4)].map((_, i) => <img key={i} src={star_icon} alt="" />)}
          <img src={star_dull_icon} alt="" />
          <span>(122 reviews)</span>
        </div>

        <div className="productdisplay-right-prices">
          <span className="productdisplay-right-price-new">{currency}{product.new_price}</span>
          <span className="productdisplay-right-price-old">{currency}{product.old_price}</span>
        </div>

        <div className="productdisplay-right-size">
          <h2>Select Size</h2>
          <div className="productdisplay-right-sizes">
            {sizes.map(s => (
              <div
                key={s}
                className={selectedSize === s ? 'selected' : ''}
                onClick={() => setSelectedSize(s)}
              >{s}</div>
            ))}
          </div>
        </div>

        <div className="pd-qty-row">
          <span className="pd-qty-label">Quantity</span>
          <div className="pd-qty-stepper">
            <button onClick={() => { if (qty > 1) { setQty(q => q - 1); removeFromCart(product._id, selectedSize); } }}>−</button>
            <span>{qty}</span>
            <button onClick={() => { setQty(q => q + 1); addToCart(product._id, 1, selectedSize); }}>+</button>
          </div>
        </div>

        <button className="add-btn" onClick={handleAddToCart}>Add to Cart</button>

        <p className="productdisplay-right-category-tag">
          <span>Category: </span>{product.category} &nbsp;·&nbsp; <span>Tags: </span>Modern, Latest, Trending
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
