import React, { useContext, useRef, useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import logo from '../Assets/nav-logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown from '../Assets/nav_dropdown.png';

const Navbar = () => {
  const [menu, setMenu] = useState('shop');
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();
  const location = useLocation();

  /* sync active tab on refresh / direct visit */
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setMenu('shop');
    else if (path === '/mens') setMenu('mens');
    else if (path === '/womens') setMenu('womens');
    else if (path === '/kids') setMenu('kids');
  }, [location]);

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  };

  const cartCount = getTotalCartItems();

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo" onClick={() => setMenu('shop')}>
        <img src={logo} alt="logo" />
        <p>SwiftCart</p>
      </Link>

      <img
        src={nav_dropdown}
        alt="menu"
        className="nav-dropdown"
        onClick={dropdown_toggle}
      />

      <ul ref={menuRef} className="nav-menu">
        {['shop', 'mens', 'womens', 'kids'].map((m) => (
          <li key={m} onClick={() => setMenu(m)}>
            <Link to={m === 'shop' ? '/' : `/${m}`} className={menu === m ? 'active' : ''}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </Link>
            <span className={`underline ${menu === m ? 'show' : ''}`} />
          </li>
        ))}
      </ul>

      <div className="nav-login-cart">
        {localStorage.getItem('auth-token') ? (
          <button
            onClick={() => {
              localStorage.removeItem('auth-token');
              window.location.replace('/');
            }}
          >
            Logout
          </button>
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}

        <Link to="/cart" className="cart-link">
          <img src={cart_icon} alt="cart" />
          {cartCount > 0 && (
            <span key={cartCount} className="nav-cart-count pulse">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;