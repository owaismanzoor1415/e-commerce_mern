import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
  { id: 'dashboard',   label: 'Dashboard',    icon: '▦',  path: '/' },
  { id: 'addproduct',  label: 'Add Product',  icon: '+',  path: '/addproduct' },
  { id: 'listproduct', label: 'Products',     icon: '≡',  path: '/listproduct', badge: null },
  { id: 'orders',      label: 'Orders',       icon: '◫',  path: '/orders' },
];

const Sidebar = () => {
  const location = useLocation();
  const active = location.pathname === '/' ? 'dashboard'
    : navItems.find(i => location.pathname.startsWith(i.path) && i.path !== '/')?.id || 'dashboard';

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-inner">
          <div className="sidebar-logo-mark">S</div>
          <div className="sidebar-brand-text">
            <h1>SwiftCart</h1>
            <span>Admin Panel</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-section-label">Main</p>
        {navItems.map(item => (
          <Link
            key={item.id}
            to={item.path}
            className={`sidebar-nav-item ${active === item.id ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-card">
          <div className="sidebar-status">
            <span className="status-dot" />
            Store is Live
          </div>
          <p>Need help with the admin panel?</p>
          <button>View Docs</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
