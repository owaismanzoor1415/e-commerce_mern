import React, { useRef, useEffect } from 'react';
import './Popular.css';
import Item from '../Item/Item';
import { motion } from 'framer-motion';

const Popular = (props) => {
  const scrollRef = useRef();

  // 🔥 AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += 250;

        // reset when end reached
        if (
          scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
          scrollRef.current.scrollWidth
        ) {
          scrollRef.current.scrollLeft = 0;
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 👉 manual arrows
  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="popular">

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Trending Women’s Wear 🔥
      </motion.h1>

      <p className="sub-text">Discover trending fashion collections</p>
      <hr />

      <div className="popular-wrapper">

        {/* LEFT BUTTON */}
        <button className="scroll-btn left" onClick={scrollLeft}>❮</button>

        <div ref={scrollRef} className="popular-item horizontal-row">
          {props.data.map((item) => (
            <motion.div
              key={item._id}
              className="card-wrapper"
              whileHover={{ scale: 1.05 }}
            >
              <Item {...item} />
            </motion.div>
          ))}
        </div>

        {/* RIGHT BUTTON */}
        <button className="scroll-btn right" onClick={scrollRight}>❯</button>

      </div>
    </div>
  );
};

export default Popular;