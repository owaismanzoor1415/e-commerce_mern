import React, { useState } from 'react';
import './Footer.css';
import { useNotification } from '../../Context/NotificationContext';
import { motion } from 'framer-motion';

const Footer = () => {
  const { success } = useNotification();
  const [ripple, setRipple] = useState(null);

  const socials = [
    { id: 'linkedin', icon: '🔗', url: 'https://www.linkedin.com/in/owais-manzoor-989314261/' },
    { id: 'github', icon: '💻', url: 'https://github.com/owaismanzoor1415' },
    { id: 'whatsapp', icon: '💬', url: 'https://wa.me/919999999999' },
  ];

  const quickLinks = [
    { label: 'Shop', path: '/' },
    { label: 'Track Order', path: '/track' },
    { label: 'Support', path: '/support' },
    { label: 'Returns', path: '/returns' },
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
                <a href={l.path}>{l.label}</a>
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

      {/* Copyright – fade + glow pulse */}
      <motion.div
        className="footer-copyright"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <hr />
        <p className="owais-line">Developed by OWAIS</p>
      </motion.div>
    </footer>
  );
};

export default Footer;