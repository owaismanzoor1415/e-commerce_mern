import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../Assets/nav-logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { ShopContext } from '../../Context/ShopContext';

const Navbar = () => {

  const [menu, setMenu] = useState('shop');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const { getTotalCartItems, products } = useContext(ShopContext);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setMenu('shop');
    else if (path === '/mens') setMenu('mens');
    else if (path === '/womens') setMenu('womens');
    else if (path === '/kids') setMenu('kids');
  }, [location]);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
      navigate('/search', { state: { results: filtered, query: search } });
      setOpen(false);
    }
  };

  return (
    <>
      <nav className="nav">

        {/* ── TOP BAR ── */}
        <div className="nav-top">

          {/* LEFT: hamburger + logo */}
          <div className="nav-left">
            <div
              className={`hamburger ${open ? 'active' : ''}`}
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              role="button"
            >
              <span></span>
              <span></span>
              <span></span>
            </div>

            <Link to="/" className="nav-logo" onClick={() => setOpen(false)}>
              <img src={logo} alt="SwiftCart logo" />
              <p>SwiftCart</p>
            </Link>
          </div>

          {/* SEARCH — spans full width on mobile (via CSS grid) */}
          <div className="nav-search">
            <input
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          {/* RIGHT: Orders link (desktop), cart, login/logout */}
          <div className="nav-right">

            {/* Visible on desktop only — also in drawer on mobile */}
            <Link to="/myorders" className="nav-link">Orders</Link>

            <Link to="/cart" className="cart-link" aria-label="Cart">
              <img src={cart_icon} alt="cart" />
              <span className="nav-cart-count">{getTotalCartItems()}</span>
            </Link>

            {localStorage.getItem('auth-token') ? (
              <button
                className="nav-btn"
                onClick={() => {
                  localStorage.removeItem('auth-token');
                  navigate('/');
                }}
              >
                Logout
              </button>
            ) : (
              <Link to="/login">
                <button className="nav-btn">Login</button>
              </Link>
            )}

          </div>
        </div>

        {/* ── CATEGORY MENU ── */}
        <ul className={`nav-menu ${open ? 'show' : ''}`}>

          {['shop', 'mens', 'womens', 'kids'].map((m) => (
            <li key={m} onClick={() => { setMenu(m); setOpen(false); }}>
              <Link
                to={m === 'shop' ? '/' : `/${m}`}
                className={menu === m ? 'active' : ''}
              >
                {m.toUpperCase()}
              </Link>
            </li>
          ))}
        </ul>

      </nav>

      {/* Backdrop — closes drawer when tapped outside */}
      {open && (
        <div
          className="nav-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;