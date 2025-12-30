import React, { useContext, useEffect, useState } from 'react';
import Breadcrums from '../Components/Breadcrums/Breadcrums';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';

const Product = () => {
  const { products } = useContext(ShopContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    setProduct(products.find((e) => e.id === Number(productId)));
  }, [products, productId]);

  if (!product) return <SkeletonPage />;

  const pageVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
  };

  return (
    <motion.div
      className="product-page-max"
      initial="hidden"
      animate="show"
      variants={pageVariants}
    >
      <ParallaxBg />
      <motion.div variants={sectionVariants}>
        <Breadcrums product={product} />
      </motion.div>
      <motion.div variants={sectionVariants}>
        <ProductDisplay product={product} />
      </motion.div>
      <motion.div variants={sectionVariants}>
        <DescriptionBox />
      </motion.div>
      <motion.div variants={sectionVariants}>
        <RelatedProducts id={product.id} category={product.category} />
      </motion.div>
    </motion.div>
  );
};

/* ----------  skeleton while loading  ---------- */
const SkeletonPage = () => (
  <div className="skeleton-product">
    <div className="sk-block sk-bread" />
    <div className="sk-block sk-display" />
    <div className="sk-block sk-desc" />
    <div className="sk-block sk-related" />
  </div>
);

/* ----------  subtle parallax background  ---------- */
const ParallaxBg = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    setOffset({ x, y });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="parallax-bg"
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
      }}
    />
  );
};

export default Product;