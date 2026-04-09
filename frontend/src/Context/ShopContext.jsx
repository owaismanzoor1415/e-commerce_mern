import React, { createContext, useEffect, useState } from "react";
import { backend_url } from "../App";
import { useNotification } from "./NotificationContext";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {

  const { success, warning, info } = useNotification();

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [cartItemsV2, setCartItemsV2] = useState({});

  /* ================= FETCH PRODUCTS ================= */

  useEffect(() => {

    fetch(`${backend_url}/allproducts`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || data || []);
      })
      .catch((err) => console.error("Failed to fetch products:", err));

  }, []);


  /* ================= FETCH CART ================= */

  useEffect(() => {

    if (!localStorage.getItem("auth-token")) return;

    fetch(`${backend_url}/api/cart/getcart`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "auth-token": localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {

        const cartData = data.cartData || data || {};

        setCartItems(cartData);

      })
      .catch((err) => console.error("Failed to load cart:", err));

  }, []);


  /* ================= BUILD RICH CART ================= */

  useEffect(() => {

    if (!products.length) return;

    const richCart = {};

    Object.entries(cartItems).forEach(([id, qty]) => {

      const product = products.find((p) => p._id === id);

      if (product && qty > 0) {

        const key = `${id}_`;

        richCart[key] = {
          _id: product._id,
          name: product.name,
          image: product.image,
          new_price: product.new_price,
          qty: qty,
          size: ""
        };

      }

    });

    setCartItemsV2(richCart);

  }, [products, cartItems]);


  /* ================= TOTALS ================= */

  const getTotalCartAmount = () =>
    Object.values(cartItemsV2).reduce(
      (total, item) => total + item.new_price * item.qty,
      0
    );

  const getTotalCartItems = () =>
    Object.values(cartItemsV2).reduce(
      (total, item) => total + item.qty,
      0
    );

  const getCartDetails = () => Object.values(cartItemsV2);


  /* ================= ADD TO CART ================= */

  const addToCart = (productId, qty = 1, size = "", silent = false) => {

    if (!localStorage.getItem("auth-token")) {
      warning("Please login to add items to cart!");
      return;
    }

    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const key = `${productId}_${size}`;

    setCartItems((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + qty,
    }));

    setCartItemsV2((prev) => ({
      ...prev,
      [key]: {
        _id: product._id,
        name: product.name,
        image: product.image,
        new_price: product.new_price,
        qty: (prev[key]?.qty || 0) + qty,
        size,
      },
    }));

    if (!silent) success(`${product.name} added to cart!`);

    fetch(`${backend_url}/api/cart/addtocart`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "auth-token": localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId: productId }),
    }).catch(() => console.error("Failed to sync add"));

  };


  /* ================= REMOVE FROM CART ================= */

  const removeFromCart = (productId, size = "") => {

    const key = `${productId}_${size}`;

    const product = products.find((p) => p._id === productId);

    setCartItems((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1),
    }));

    setCartItemsV2((prev) => {

      const updated = { ...prev };

      if (!updated[key]) return prev;

      updated[key].qty -= 1;

      if (updated[key].qty <= 0) delete updated[key];

      return updated;

    });

    if (product) info(`${product.name} removed from cart!`);

    fetch(`${backend_url}/api/cart/removefromcart`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "auth-token": localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId: productId }),
    }).catch(() => console.error("Failed to sync remove"));

  };


  /* ================= CONTEXT VALUE ================= */

  const contextValue = {
    products,
    cartItems,
    cartItemsV2,
    getTotalCartAmount,
    getTotalCartItems,
    getCartDetails,
    addToCart,
    removeFromCart,
  };


  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );

};

export default ShopContextProvider;