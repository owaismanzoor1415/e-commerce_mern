import React from 'react';
import './Breadcrums.css';
import { Link } from 'react-router-dom';

const Breadcrums = ({ product }) => (
  <nav className="breadcrumb" aria-label="Breadcrumb">
    <ol className="breadcrumb-list">
      <li><Link to="/">Home</Link></li>
      <li className="breadcrumb-sep">›</li>
      <li><Link to={`/${product?.category}`}>{product?.category}</Link></li>
      <li className="breadcrumb-sep">›</li>
      <li className="active">{product?.name}</li>
    </ol>
  </nav>
);

export default Breadcrums;
