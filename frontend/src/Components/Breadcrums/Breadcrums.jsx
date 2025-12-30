import React from 'react';
import './Breadcrums.css';
import arrow_icon from '../Assets/breadcrum_arrow.png';
import { Link } from 'react-router-dom';

const Breadcrums = ({ product }) => {
  return (
    <nav className="breadcrums-max">
      <Link to="/" className="crumb">HOME</Link>
      <img src={arrow_icon} className="arrow" alt=">" />
      <Link to="/shop" className="crumb">SHOP</Link>
      <img src={arrow_icon} className="arrow" alt=">" />
      <Link to={`/${product.category}`} className="crumb">{product.category}</Link>
      <img src={arrow_icon} className="arrow" alt=">" />
      <span className="crumb current">{product.name}</span>
    </nav>
  );
};

export default Breadcrums;