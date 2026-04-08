import React from 'react';
import './Navbar.css';

const Navbar = () => (
  <nav className="admin-navbar">
    <div className="admin-navbar-search">
      <span className="search-icon">⌕</span>
      <input type="text" placeholder="Search products, orders..." />
    </div>

    <div className="admin-navbar-right">
      <button className="navbar-icon-btn">
        🔔
        <span className="navbar-badge red" />
      </button>
      <button className="navbar-icon-btn">
        💬
        <span className="navbar-badge green" />
      </button>
      <div className="navbar-divider" />
      <div className="navbar-profile">
        <div className="navbar-avatar">A</div>
        <div className="navbar-profile-info">
          <p>Admin</p>
          <span>Administrator</span>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
