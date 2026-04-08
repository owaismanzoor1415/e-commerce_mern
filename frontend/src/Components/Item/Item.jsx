import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';
import { backend_url, currency } from '../../App';

const Item = (props) => {
  const imgSrc = props.image?.startsWith('http') ? props.image : backend_url + props.image;
  return (
    <div className="item">
      <Link to={`/product/${props._id}`} onClick={() => window.scrollTo(0, 0)}>
        <div className="item-img-wrapper">
          <img src={imgSrc} alt={props.name} className="item-img" />
          <div className="item-overlay">
            <span className="item-overlay-text">View Product</span>
          </div>
        </div>
      </Link>
      <div className="item-info">
        <p className="item-name">{props.name}</p>
        <div className="item-prices">
          <span className="item-price-new">{currency}{props.new_price}</span>
          <span className="item-price-old">{currency}{props.old_price}</span>
        </div>
      </div>
    </div>
  );
};

export default Item;
