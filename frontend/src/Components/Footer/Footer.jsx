import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* LEFT - BRAND */}
        <div className="footer-col">
          <h3>SwiftCart</h3>
          <p>
            India's fast-growing shopping platform delivering quality products
            at the best price.
          </p>

          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin /></a>
          </div>
        </div>

        {/* QUICK LINKS........ */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Shop</Link></li>
            <li><Link to="/mens">Men</Link></li>
            <li><Link to="/womens">Women</Link></li>
            <li><Link to="/kids">Kids</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
        </div>

        {/* SERVICES */}
        <div className="footer-col">
          <h4>Our Services</h4>
          <ul>
            <li><Link to="/">Fast Delivery</Link></li>
            <li><Link to="/">Easy Returns</Link></li>
            <li><Link to="/">Secure Payment</Link></li>
            <li><Link to="/">24/7 Support</Link></li>
            <li><Link to="/">Best Deals</Link></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="footer-col">
          <h4>Contact Us</h4>
          <p>📞 +91 9103236571</p>
          <p>📧 support@swiftcart.com</p>
          <p>📍 kashmir, India</p>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <p>© 2026 SwiftCart. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/">Privacy Policy</Link>
          <Link to="/">Terms</Link>
          <Link to="/">Sitemap</Link>
        </div>
      </div>

    </footer>
  );
};

export default Footer;