import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';
import { backend_url, currency } from '../../App';
import { useNotification } from '../../Context/NotificationContext';
import { motion } from 'framer-motion';

const ProductDisplay = ({ product }) => {

  const { addToCart, removeFromCart } = useContext(ShopContext);
  const { warning, success } = useNotification();

  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [mainIdx, setMainIdx] = useState(0);

  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!selectedSize) return warning('Please select a size');

    addToCart(product._id, qty, selectedSize, true);

    success('Added to cart!');
    setTimeout(() => navigate('/cart'), 600);
  };

  const thumbnails = [product.image, product.image, product.image, product.image];

  const sectionAnim = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className="productdisplay"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
    >

      {/* LEFT – gallery */}

      <motion.div className="productdisplay-left" variants={sectionAnim}>

        <div className="productdisplay-img-list">

          {thumbnails.map((img, idx) => (

            <motion.img
              key={idx}
              src={img.startsWith('http') ? img : backend_url + img}
              alt=""
              className={idx === mainIdx ? 'active' : ''}
              onClick={() => setMainIdx(idx)}
              whileTap={{ scale: 0.92 }}
            />

          ))}

        </div>

        <div className="productdisplay-img">

          <motion.img
            className="productdisplay-main-img"
            src={thumbnails[mainIdx].startsWith('http') ? thumbnails[mainIdx] : backend_url + thumbnails[mainIdx]}
            alt={product.name}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.3 }}
          />

        </div>

      </motion.div>


      {/* RIGHT – info */}

      <motion.div className="productdisplay-right" variants={sectionAnim}>

        <motion.h1>{product.name}</motion.h1>

        <div className="productdisplay-right-stars">
          {[...Array(5)].map((_, i) => (
            <img key={i} src={i < 4 ? star_icon : star_dull_icon} alt="star" />
          ))}
        </div>

        <motion.div className="productdisplay-right-prices" variants={sectionAnim}>
          <div className="productdisplay-right-price-old">{currency}{product.old_price}</div>
          <div className="productdisplay-right-price-new">{currency}{product.new_price}</div>
        </motion.div>

        <motion.p className="productdisplay-right-description" variants={sectionAnim}>
          {product.description}
        </motion.p>


        {/* SIZE */}

        <motion.div className="productdisplay-right-size" variants={sectionAnim}>

          <h3>Select Size</h3>

          <div className="productdisplay-right-sizes">

            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (

              <motion.div
                key={size}
                className={selectedSize === size ? 'active' : ''}
                onClick={() => setSelectedSize(size)}
                whileTap={{ scale: 0.92 }}
              >
                {size}
              </motion.div>

            ))}

          </div>

        </motion.div>


        {/* QTY + ADD */}

        <motion.div className="productdisplay-qty-add" variants={sectionAnim}>

          <div className="qty-stepper">

            <button
              onClick={() => {
                if (qty === 1) return;
                setQty((q) => q - 1);
                removeFromCart(product._id, selectedSize);
              }}
            >
              -
            </button>

            <span>{qty}</span>

            <button
              onClick={() => {
                setQty((q) => q + 1);
                addToCart(product._id, 1, selectedSize);
              }}
            >
              +
            </button>

          </div>

          <motion.button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            whileTap={{ scale: 0.96 }}
          >
            ADD TO CART
          </motion.button>

        </motion.div>


        <motion.p className="productdisplay-right-category" variants={sectionAnim}>
          <span>Category :</span> Jackets, T-shirt, Crop Top
        </motion.p>

        <motion.p className="productdisplay-right-category" variants={sectionAnim}>
          <span>Tags :</span> Modern, Latest, Trending
        </motion.p>

      </motion.div>


      {/* mobile bar */}

      <div className="productdisplay-mobile-bar">

        <div className="qty-stepper">

          <button
            onClick={() => {
              if (qty === 1) return;
              setQty((q) => q - 1);
              removeFromCart(product._id, selectedSize);
            }}
          >
            -
          </button>

          <span>{qty}</span>

          <button
            onClick={() => {
              setQty((q) => q + 1);
              addToCart(product._id, 1, selectedSize);
            }}
          >
            +
          </button>

        </div>

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          ADD TO CART
        </button>

      </div>

    </motion.div>
  );
};

export default ProductDisplay;