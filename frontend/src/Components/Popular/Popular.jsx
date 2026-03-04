import React from 'react';
import './Popular.css';
import Item from '../Item/Item';
import { motion } from 'framer-motion';

const Popular = (props) => {
  const hasData = props.data && props.data.length;

  return (
    <div className="popular">
      <motion.h1
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        POPULAR IN WOMEN
      </motion.h1>
      <hr />

      {hasData ? (
        <div className="popular-item horizontal-row">
          {props.data.map((item) => (
            <motion.div
              key={item._id}
              className="card-wrapper"
              whileTap={{ scale: 0.97 }}
            >
              <Item
                _id={item._id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <SkeletonRow />
      )}
    </div>
  );
};

/* skeleton until data loads */
const SkeletonRow = () => (
  <div className="popular-item horizontal-row skeleton-row">
    {Array.from({ length: 5 }).map((_, i) => (
      <div className="skeleton-card" key={i} />
    ))}
  </div>
);

export default Popular;