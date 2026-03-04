import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartItems.css';
import cross_icon from '../Assets/cart_cross_icon.png';
import { ShopContext } from '../../Context/ShopContext';
import { backend_url, currency } from '../../App';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../Context/NotificationContext';

const CartItems = () => {

  const { products, cartItems, removeFromCart, getTotalCartAmount, addToCart } =
    useContext(ShopContext);

  const { success, warning } = useNotification();
  const navigate = useNavigate();

  const [promo, setPromo] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const subtotal = getTotalCartAmount();
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = subtotal - discountAmount;

  const applyPromo = () => {

    const code = promo.toUpperCase().trim();

    if (code === 'SAVE10') {
      setDiscountPercent(10);
      success('10% discount applied');
    }
    else if (code === 'SAVE20') {
      setDiscountPercent(20);
      success('20% discount applied');
    }
    else {
      setDiscountPercent(0);
      warning('Invalid promo code');
    }

  };

  useEffect(() => {

    const el = document.querySelector('.total-value');

    if (el) el.classList.add('pulse');

    setTimeout(() => el?.classList.remove('pulse'), 600);

  }, [total]);


  const cartList = Object.entries(cartItems)
    .filter(([, qty]) => qty > 0)
    .map(([id]) => products.find((p) => p._id === id))
    .filter(Boolean);


  return (

    <div className="cartitems">

      <div className="cartitems-format-main headings">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>

      <hr />

      <AnimatePresence>

        {cartList.map((item) => (

          <CartRow
            key={item._id}
            item={item}
            qty={cartItems[item._id]}
            remove={() => removeFromCart(item._id)}
            changeQty={(delta) => addToCart(item._id, delta, '', true)}
          />

        ))}

      </AnimatePresence>

      {cartList.length === 0 && <SkeletonCart />}

      <div className="cartitems-down">

        <motion.div
          className="cartitems-total"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >

          <h1>Cart Totals</h1>

          <div className="cartitems-total-item">
            <p>Subtotal</p>
            <p>{currency}{subtotal}</p>
          </div>

          {discountPercent > 0 && (

            <div className="cartitems-total-item discount">
              <p>Discount ({discountPercent}%)</p>
              <p>- {currency}{discountAmount}</p>
            </div>

          )}

          <div className="cartitems-total-item">
            <p>Shipping Fee</p>
            <p>Free</p>
          </div>

          <div className="cartitems-total-item">
            <h3>Total</h3>
            <h3 className="total-value">{currency}{total}</h3>
          </div>

          <button onClick={() => navigate('/Checkout')}>
            PROCEED TO CHECKOUT
          </button>

        </motion.div>


        <div className="cartitems-promocode">

          <p>Have a promo code?</p>

          <div className="cartitems-promobox">

            <input
              type="text"
              placeholder="SAVE10 / SAVE20"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
            />

            <button onClick={applyPromo}>Apply</button>

          </div>

        </div>

      </div>

    </div>

  );

};


/* ================= CART ROW ================= */

const CartRow = ({ item, qty, remove, changeQty }) => {

  const { success, info } = useNotification();

  return (

    <motion.div
      layout
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 80 }}
      transition={{ duration: 0.35 }}
      className="cartitems-format-main cartitems-format"
    >

      <img
        className="cartitems-product-icon"
        src={item.image.startsWith('http') ? item.image : backend_url + item.image}
        alt={item.name}
      />

      <p>{item.name}</p>

      <p>{currency}{item.new_price}</p>


      <div className="qty-stepper">

        <button
          onClick={() => {
            changeQty(-1);
            info(`${item.name} removed from cart!`);
          }}
          disabled={qty <= 1}
        >
          -
        </button>

        <span>{qty}</span>

        <button
          onClick={() => {
            changeQty(1);
            success(`${item.name} added to cart!`);
          }}
        >
          +
        </button>

      </div>


      <p>{currency}{(item.new_price * qty).toFixed(2)}</p>


      <img
        className="cartitems-remove-icon"
        src={cross_icon}
        alt="remove"
        onClick={remove}
      />

    </motion.div>

  );

};


/* ================= SKELETON ================= */

const SkeletonCart = () => (

  <div className="skeleton-cart">

    {Array.from({ length: 3 }).map((_, i) => (

      <div className="skeleton-row" key={i}>
        <div className="sk-img" />
        <div className="sk-title" />
        <div className="sk-price" />
        <div className="sk-qty" />
        <div className="sk-total" />
        <div className="sk-remove" />
      </div>

    ))}

  </div>

);

export default CartItems;