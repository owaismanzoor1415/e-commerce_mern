import React, { useEffect, useRef, useState } from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [visible, setVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const shopLinks   = [{ label: 'All Products', to: '/' }, { label: 'Women', to: '/womens' }, { label: 'Men', to: '/mens' }, { label: 'Kids', to: '/kids' }];
  const accountLinks = [{ label: 'Sign In', to: '/login' }, { label: 'Create Account', to: '/login' }, { label: 'My Orders', to: '/myorders' }, { label: 'Cart', to: '/cart' }];
  const helpLinks   = [{ label: 'Sizing Guide', href: '#' }, { label: 'Returns', href: '#' }, { label: 'Shipping Info', href: '#' }, { label: 'Contact', href: '#' }];

  return (
    <footer className={`footer ${visible ? 'footer--visible' : ''}`} ref={footerRef}>

      {/* Red top accent stripe — mirrors navbar */}
      <div className="footer__accent-bar" />

      {/* Watermark */}
      <div className="footer__watermark" aria-hidden="true">SWIFTCART</div>

      <div className="footer__inner">

        {/* ── TOP GRID ── */}
        <div className="footer__top">

          {/* Brand column */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="footer__logo-name">SwiftCart</span>
              <span className="footer__logo-dot">.</span>
            </Link>
            <p className="footer__brand-desc">
              Curated fashion for those who appreciate the intersection of comfort, craft, and style.
            </p>
            {/* Social icons */}
            <div className="footer__socials">
              {[
                { label: 'Instagram', icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                  </svg>
                )},
                { label: 'Twitter / X', icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                )},
                { label: 'Pinterest', icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                  </svg>
                )},
              ].map(({ label, icon }) => (
                <a key={label} href="#" className="footer__social-btn" aria-label={label}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="footer__col">
            <h4 className="footer__col-heading">Shop</h4>
            <ul className="footer__col-list">
              {shopLinks.map(({ label, to }) => (
                <li key={label}><Link to={to} className="footer__col-link">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="footer__col">
            <h4 className="footer__col-heading">Account</h4>
            <ul className="footer__col-list">
              {accountLinks.map(({ label, to }) => (
                <li key={label}><Link to={to} className="footer__col-link">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className="footer__col">
            <h4 className="footer__col-heading">Help</h4>
            <ul className="footer__col-list">
              {helpLinks.map(({ label, href }) => (
                <li key={label}><a href={href} className="footer__col-link">{label}</a></li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── TRUST STRIP ── */}
        <div className="footer__trust">
          {[
            { icon: '🚚', label: 'Free Shipping', sub: 'On orders over ₹999' },
            { icon: '↩', label: 'Easy Returns',  sub: '30-day return policy' },
            { icon: '🔒', label: 'Secure Checkout', sub: '256-bit SSL encrypted' },
            { icon: '💬', label: '24/7 Support',  sub: 'Always here to help' },
          ].map(({ icon, label, sub }) => (
            <div key={label} className="footer__trust-item">
              <span className="footer__trust-icon">{icon}</span>
              <div>
                <p className="footer__trust-label">{label}</p>
                <p className="footer__trust-sub">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── DIVIDER ── */}
        <div className="footer__divider">
          <div className="footer__divider-fill" />
        </div>

        {/* ── BOTTOM ── */}
        <div className="footer__bottom">
          <p className="footer__copy">
            © {new Date().getFullYear()} SwiftCart. All rights reserved.
          </p>
          <div className="footer__legal">
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((item) => (
              <a key={item} href="#" className="footer__legal-link">{item}</a>
            ))}
          </div>
          <p className="footer__made">
            Made with <span className="footer__heart">♥</span> for fashion lovers
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;