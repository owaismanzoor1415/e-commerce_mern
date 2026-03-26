import React from 'react';
import './NewCollections.css';
import Item from '../Item/Item';
import { motion } from 'framer-motion';

const NewCollections = ({ data }) => {

  return (
    <div className="new-collections-new">

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Fresh Drops ✨
      </motion.h1>

      <p className="sub-text">Latest arrivals you can’t miss</p>

      <hr />

      <div className="collections">
        {data.map((item) => (
          <motion.div
            key={item._id}
            className="collection-item-wrapper"
            whileHover={{ scale: 1.03 }}
          >

            {/* 🔥 BADGE */}
            <span className="badge">NEW</span>

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

    </div>
  );
};

export default NewCollections;