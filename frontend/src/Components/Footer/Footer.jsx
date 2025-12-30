import React, { useState } from 'react';
import { FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import './Footer.css';
import { useNotification } from '../../Context/NotificationContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { success } = useNotification();
  const [ripple, setRipple] = useState(null);

  const socials = [
    { id: 'linkedin', icon: <FaLinkedin />, url: 'https://linkedin.com' },
    { id: 'instagram', icon: <FaInstagram />, url: 'https://instagram.com' },
    { id: 'whatsapp', icon: <FaWhatsapp />, url: 'https://wa.me/91xxxxxxxxxx' },
  ];

  /* ✅ QUICK LINKS – WORKING ROUTES */
  const quickLinks = [
    { label: 'Shop', path: '/' },
    { label: 'Men', path: '/mens' },
    { label: 'Women', path: '/womens' },
    { label: 'Kids', path: '/kids' },
  ];

  const handleSocial = (url, id) => {
    setRipple(id);
    setTimeout(() => setRipple(null), 600);
    window.open(url, '_blank', 'noopener');
    success('Opening link...');
  };

  return (
    <footer className="footer-new">
      <div className="footer-glow" />

      <div className="footer-content">
        {/* Brand */}
        <motion.div
          className="footer-brand"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="logo-circle">SC</div>
          <div>
            <h3>SwiftCart</h3>
            <p>Fast fashion, faster delivery.</p>
          </div>
        </motion.div>

        {/* Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.path}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div className="footer-social">
          <h4>Follow</h4>
          <div className="social-icons">
            {socials.map((s) => (
              <motion.div
                key={s.id}
                className={`social-icon ${ripple === s.id ? 'ripple' : ''}`}
                onClick={() => handleSocial(s.url, s.id)}
                whileHover={{ scale: 1.2, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
              >
                <span>{s.icon}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <motion.div
        className="footer-copyright"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <hr />
        <p className="owais-line">Developed by OWAIS</p>
        <p>9103236571</p>
      </motion.div>
    </footer>
  );
};

export default Footer;
