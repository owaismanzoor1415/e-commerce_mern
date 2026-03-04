import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../Assets/cross_icon.png";
import { backend_url, currency } from "../../App";
import { useToast } from "../../Context/ToastContext";

const ListProduct = () => {
  const toast = useToast();
  const [allproducts, setAllProducts] = useState([]);

  /* ================= FETCH PRODUCTS ================= */

  const fetchInfo = async () => {
    try {
      const response = await fetch(`${backend_url}/allproducts`);
      const data = await response.json();

      if (data.products) {
        setAllProducts(data.products);
      } else if (Array.isArray(data)) {
        setAllProducts(data);
      }
    } catch (error) {
      toast.error("Failed to fetch products");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  /* ================= REMOVE PRODUCT ================= */

  const removeProduct = async (id) => {
    try {
      const response = await fetch(`${backend_url}/removeproduct`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("✓ Product removed successfully!");

        // update UI immediately
        setAllProducts((prev) =>
          prev.filter((product) => product._id !== id)
        );
      } else {
        toast.error("✕ Failed to remove product!");
      }
    } catch (error) {
      toast.error("✕ An error occurred!");
      console.error(error);
    }
  };

  return (
    <div className="listproduct">
      <h1>All Products List</h1>

      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>

      <div className="listproduct-allproducts">
        <hr />

        {allproducts.map((product) => (
          <div key={product._id}>
            <div className="listproduct-format-main listproduct-format">
              
              <img
                className="listproduct-product-icon"
                src={
                  product.image.startsWith("http")
                    ? product.image
                    : backend_url + product.image
                }
                alt=""
              />

              <p className="cartitems-product-title">{product.name}</p>

              <p>{currency}{product.old_price}</p>

              <p>{currency}{product.new_price}</p>

              <p>{product.category}</p>

              <img
                className="listproduct-remove-icon"
                src={cross_icon}
                alt="remove"
                onClick={() => removeProduct(product._id)}
              />

            </div>
            <hr />
          </div>
        ))}

      </div>
    </div>
  );
};

export default ListProduct;
