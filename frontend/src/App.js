import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Shop from "./Pages/Shop";
import Cart from "./Pages/Cart";
import Product from "./Pages/Product";
import Footer from "./Components/Footer/Footer";
import ShopCategory from "./Pages/ShopCategory";
import DescriptionBox from "./Components/DescriptionBox/DescriptionBox";
import Checkout from "./Pages/Checkout";
import women_banner from "./Components/Assets/banner_women.png";
import men_banner from "./Components/Assets/banner_mens.png";
import kid_banner from "./Components/Assets/banner_kids.png";
import LoginSignup from "./Pages/LoginSignup";
import Verify from "./Pages/Verify";

export const backend_url = process.env.REACT_APP_BACKEND_URL;
export const currency = '₹';

/* ----------  Animated Page Wrapper  ---------- */
const AnimatedPage = ({ children }) => (
  <motion.div
    key={window.location.pathname}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.35, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

/* ----------  Scroll-To-Top Helper  ---------- */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

/* ----------  Loading Bar  ---------- */
const PageLoader = () => {
  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setLoading(true);
    const id = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(id);
  }, [pathname]);

  return (
    <motion.div
      className="global-loader"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: loading ? 1 : 0 }}
      style={{ originX: 0 }}
      transition={{ duration: 0.4 }}
    />
  );
};

/* ----------  Main App  ---------- */
function App() {
  const location = useLocation();
  return (
    <>
      <PageLoader />
      <ScrollToTop />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AnimatedPage><Shop gender="all" /></AnimatedPage>} />
          <Route path="/mens" element={<AnimatedPage><ShopCategory banner={men_banner} category="men" /></AnimatedPage>} />
          <Route path="/womens" element={<AnimatedPage><ShopCategory banner={women_banner} category="women" /></AnimatedPage>} />
          <Route path="/kids" element={<AnimatedPage><ShopCategory banner={kid_banner} category="kids" /></AnimatedPage>} />
          <Route path="/product/:productId" element={<AnimatedPage><Product /></AnimatedPage>} />
          <Route path="/checkout" element={<AnimatedPage><Checkout /></AnimatedPage>} />
          <Route path="/verify" element={<AnimatedPage><Verify /></AnimatedPage>} />
          <Route path="/cart" element={<AnimatedPage><Cart /></AnimatedPage>} />
          <Route path="/login" element={<AnimatedPage><LoginSignup /></AnimatedPage>} />
          <Route path="/description" element={<DescriptionBox />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <style jsx global>{`
        /* ---- mini design-tokens ---- */
        :root {
          --accent: #ff4141;
          --bg: #fefefe;
          --text: #222;
          --radius: 12px;
          --shadow: 0 8px 20px -6px rgba(0,0,0,.15);
          --font: "Inter", system-ui, sans-serif;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: var(--font);
          background: var(--bg);
          color: var(--text);
          scroll-behavior: smooth;
        }
        .global-loader {
          position: fixed;
          top: 0; left: 0; right: 0; height: 3px;
          background: var(--accent);
          transform-origin: left;
          z-index: 9999;
        }
      `}</style>
    </>
  );
}

/* ----------  Router Wrapper  ---------- */
export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}