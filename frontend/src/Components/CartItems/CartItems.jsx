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
  const { success, info } = useNotification(); // toast hooks
  const navigate = useNavigate();

  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const total = getTotalCartAmount() - discount;

  /* dummy promo check */
  const applyPromo = () => {
    if (promo.toUpperCase() === 'SAVE20') setDiscount(20);
    else {
      setDiscount(0);
      const box = document.querySelector('.cartitems-promobox');
      box.classList.add('shake');
      setTimeout(() => box.classList.remove('shake'), 400);
    }
  };

  /* animate on total change */
  useEffect(() => {
    const el = document.querySelector('.total-value');
    if (el) el.classList.add('pulse');
    setTimeout(() => el?.classList.remove('pulse'), 600);
  }, [total]);

  const cartList = Object.entries(cartItems)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => products.find((p) => p.id === Number(id)))
    .filter(Boolean);

  return (
    <div className="cartitems">
      <div className="cartitems-format-main headings">
        <p>Products</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p> <p>Remove</p>
      </div>
      <hr />

      {/* rows */}
      <AnimatePresence>
        {cartList.map((e) => (
          <CartRow
            key={e.id}
            item={e}
            qty={cartItems[e.id]}
            remove={() => removeFromCart(e.id)}
            changeQty={(delta, silent = false) => addToCart(e.id, delta, '', silent)} // silent flag
          />
        ))}
      </AnimatePresence>

      {cartList.length === 0 && <SkeletonCart />}

      {/* totals & promo */}
      <div className="cartitems-down">
        <motion.div className="cartitems-total" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>{currency}{getTotalCartAmount()}</p>
            </div>
            <hr />
            {discount > 0 && (
              <div className="cartitems-total-item discount">
                <p>Discount</p>
                <p>- {currency}{discount}</p>
              </div>
            )}
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3 className="total-value">{currency}{total}</h3>
            </div>
          </div>
          <button onClick={() => navigate('/Checkout')}>PROCEED TO CHECKOUT</button>
        </motion.div>

        <div className="cartitems-promocode">
          <p>If you have a promo code, Enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="promo code" value={promo} onChange={(ev) => setPromo(ev.target.value)} />
            <button onClick={applyPromo}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =====  animated row with SINGLE toast ===== */
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
      <img className="cartitems-product-icon" src={item.image.startsWith('http') ? item.image : backend_url + item.image} alt={item.name} />
      <p className="cartitems-product-title">{item.name}</p>
      <p>{currency}{item.new_price}</p>

      {/* stepper – only ONE toast per click */}
      <div className="qty-stepper">
        <button
          onClick={() => {
            changeQty(-1, true); // silent
            info(`${item.name} removed from cart!`);
          }}
          disabled={qty <= 1}
        >
          -
        </button>
        <span>{qty}</span>
        <button
          onClick={() => {
            changeQty(1, true); // normal toast
            success(`${item.name} added to cart!`);
          }}
        >
          +
        </button>
      </div>

      <p>{currency}{(item.new_price * qty).toFixed(2)}</p>
      <img className="cartitems-remove-icon" src={cross_icon} alt="remove" onClick={remove} />
    </motion.div>
  );
};

/* skeleton while empty */
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