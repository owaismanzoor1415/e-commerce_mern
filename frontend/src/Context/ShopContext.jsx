import React, { createContext, useEffect, useState } from "react";
import { backend_url } from "../App";
import { useNotification } from "./NotificationContext";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const { success, warning, info } = useNotification(); // info restored
  const [products, setProducts] = useState([]);

  const getDefaultCart = () => {
    let cart = {};
    for (let i = 0; i < 300; i++) cart[i] = 0;
    return cart;
  };
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [cartItemsV2, setCartItemsV2] = useState({});

  /* fetch products */
  useEffect(() => {
    fetch(`${backend_url}/allproducts`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
        else if (Array.isArray(data)) setProducts(data);
      });
  }, []);

  /* migrate server cart */
  useEffect(() => {
    if (!localStorage.getItem("auth-token")) return;
    fetch(`${backend_url}/getcart`, {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'auth-token': `${localStorage.getItem("auth-token")}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(),
    })
      .then((resp) => resp.json())
      .then((data) => {
        const legacy = data.cartData || data || {};
        setCartItems(legacy);
        const rich = {};
        Object.entries(legacy).forEach(([id, qty]) => {
          if (qty <= 0) return;
          const prod = products.find(p => p.id === Number(id));
          if (!prod) return;
          const key = `${id}_`;
          rich[key] = { id: prod.id, name: prod.name, image: prod.image, new_price: prod.new_price, qty, size: '' };
        });
        setCartItemsV2(rich);
      });
  }, [products]);

  /* totals */
  const getTotalCartAmount = () => Object.values(cartItemsV2).reduce((t, i) => t + i.new_price * i.qty, 0);
  const getTotalCartItems = () => Object.values(cartItemsV2).reduce((t, i) => t + i.qty, 0);
  const getCartDetails = () => Object.values(cartItemsV2);

  /* addToCart with silent flag */
  const addToCart = (itemId, qty = 1, size = '', silent = false) => {
    if (!localStorage.getItem("auth-token")) {
      warning("Please login to add items to cart!");
      return;
    }
    const prod = products.find(p => p.id === itemId);
    if (!prod) return;

    const key = `${itemId}_${size}`;

    setCartItems(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + qty }));
    setCartItemsV2(prev => ({
      ...prev,
      [key]: {
        id: itemId,
        name: prod.name,
        image: prod.image,
        new_price: prod.new_price,
        qty: (prev[key]?.qty || 0) + qty,
        size,
      },
    }));

    if (!silent) success(`${prod.name} added to cart!`);

    if (localStorage.getItem("auth-token")) {
      fetch(`${backend_url}/addtocart`, {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem("auth-token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      }).catch(() => console.error("Failed to sync add"));
    }
  };

  /* removeFromCart – shows product-specific toast */
  const removeFromCart = (itemId, size = '') => {
    const key = `${itemId}_${size}`;
    const prod = products.find(p => p.id === itemId);

    setCartItems(prev => ({ ...prev, [itemId]: Math.max(0, (prev[itemId] || 0) - 1) }));
    setCartItemsV2(prev => {
      const copy = { ...prev };
      if (!copy[key]) return prev;
      copy[key].qty -= 1;
      if (copy[key].qty <= 0) delete copy[key];
      return copy;
    });

    /* NEW: quiet removal message */
    if (prod) info(`${prod.name} removed from cart!`);

    if (localStorage.getItem("auth-token")) {
      fetch(`${backend_url}/removefromcart`, {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem("auth-token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      }).catch(() => console.error("Failed to sync remove"));
    }
  };

  const contextValue = {
    products,
    getTotalCartItems,
    cartItems,
    cartItemsV2,
    getCartDetails,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;