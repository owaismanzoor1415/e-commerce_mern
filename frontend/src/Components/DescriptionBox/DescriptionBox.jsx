import React from "react";
import "./DescriptionBox.css";

const DescriptionBox = () => {
  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews</div>
      </div>
      <div className="descriptionbox-description">
        <p>
          A fast, secure shopping app that lets users browse products, add to cart, pay online, track orders, and manage returns in one simple interface.
        </p>
        <p>
          ⭐⭐⭐⭐⭐
          Clean design, smooth performance, quick checkout, secure payments, and excellent user experience—ideal for everyday online shopping.
        </p>
      </div>
    </div>
  );
};

export default DescriptionBox;
