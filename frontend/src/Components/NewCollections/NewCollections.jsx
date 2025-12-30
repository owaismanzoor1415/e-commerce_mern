import React from 'react';
import './NewCollections.css';
import Item from '../Item/Item';
import { motion } from 'framer-motion';

const NewCollections = ({ data }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className="new-collections-new"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        NEW COLLECTIONS
      </motion.h1>
      <motion.hr
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      />

      <motion.div className="collections" variants={container}>
        {data.map((item, index) => (
          <motion.div
            key={item.id}
            className="collection-item-wrapper"
            variants={itemAnim}
            whileHover={{ y: -8, transition: { duration: 0.25 } }}
          >
            <div className="sparkle-badge">✨</div>
            <Item
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default NewCollections;