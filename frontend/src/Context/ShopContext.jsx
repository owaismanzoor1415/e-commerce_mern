import React, { createContext, useEffect, useState } from "react";
import { backend_url } from "../App";
import { useNotification } from "./NotificationContext";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const { success, warning, info, error } = useNotification();
  const [products, setProducts] = useState([]);

  const getDefaultCart = () => {
    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }
    return cart;
  };

  const [cartItems, setCartItems] = useState(getDefaultCart());

  useEffect(() => {
    fetch(`${backend_url}/allproducts`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products);
        } else if (Array.isArray(data)) {
          setProducts(data);
        }
      })

    if (localStorage.getItem("auth-token")) {
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
          if (data.cartData) {
            setCartItems(data.cartData);
          } else {
            setCartItems(data);
          }
        });
    }
  }, [])

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        try {
          let itemInfo = products.find((product) => product.id === Number(item));
          totalAmount += cartItems[item] * itemInfo.new_price;
        } catch (error) { }
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        try {
          let itemInfo = products.find((product) => product.id === Number(item));
          totalItem += itemInfo ? cartItems[item] : 0;
        } catch (error) { }
      }
    }
    return totalItem;
  };

  const addToCart = (itemId) => {
    if (!localStorage.getItem("auth-token")) {
      warning("Please login to add items to cart!");
      return;
    }

    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));

    // Find product name for better message
    const product = products.find(p => p.id === itemId);
    if (product) {
      success(`${product.name} added to cart!`);
    } else {
      success("Item added to cart!");
    }

    if (localStorage.getItem("auth-token")) {
      fetch(`${backend_url}/addtocart`, {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem("auth-token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "itemId": itemId }),
      })
        .catch((err) => error("Failed to sync with server"));
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    info("Item removed from cart");

    if (localStorage.getItem("auth-token")) {
      fetch(`${backend_url}/removefromcart`, {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem("auth-token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "itemId": itemId }),
      })
    }
  };

  const contextValue = { products, getTotalCartItems, cartItems, addToCart, removeFromCart, getTotalCartAmount };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
