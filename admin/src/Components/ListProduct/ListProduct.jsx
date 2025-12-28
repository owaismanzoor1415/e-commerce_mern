import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from '../Assets/cross_icon.png'
import { backend_url, currency } from "../../App";
import { useToast } from "../../Context/ToastContext";

const ListProduct = () => {
  const toast = useToast();
  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = () => {
    fetch(`${backend_url}/allproducts`)
      .then((res) => res.json())
      .then((data) => {
        // Handle new API response structure
        if (data.products) {
          setAllProducts(data.products);
        } else if (Array.isArray(data)) {
          setAllProducts(data);
        }
      })
      .catch((error) => {
        toast.error("Failed to fetch products");
        console.error(error);
      });
  }

  useEffect(() => {
    fetchInfo();
  }, [])

  const removeProduct = async (id) => {
    try {
      const response = await fetch(`${backend_url}/removeproduct`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("✓ Product removed successfully!");
        fetchInfo();
      } else {
        toast.error("✕ Failed to remove product!");
      }
    } catch (error) {
      toast.error("✕ An error occurred!");
      console.error(error);
    }
  }

  return (
    <div className="listproduct">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p> <p>Title</p> <p>Old Price</p> <p>New Price</p> <p>Category</p> <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((e, index) => (
          <div key={index}>
            <div className="listproduct-format-main listproduct-format">
              <img className="listproduct-product-icon" src={e.image.startsWith('http') ? e.image : backend_url + e.image} alt="" />
              <p className="cartitems-product-title">{e.name}</p>
              <p>{currency}{e.old_price}</p>
              <p>{currency}{e.new_price}</p>
              <p>{e.category}</p>
              <img className="listproduct-remove-icon" onClick={() => { removeProduct(e.id) }} src={cross_icon} alt="" />
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
