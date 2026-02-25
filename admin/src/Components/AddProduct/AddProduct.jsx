import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../Assets/upload_area.svg";
import { backend_url } from "../../App";
import { useToast } from "../../Context/ToastContext";

const AddProduct = () => {

  const toast = useToast();
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    image: "",
    category: "men",
    new_price: "",
    old_price: ""
  });
  const [loading, setLoading] = useState(false);

  const AddProduct = async () => {

    if (!image) {
      toast.error("Please select an image!");
      return;
    }

    if (!productDetails.name || !productDetails.new_price || !productDetails.old_price) {
      toast.warning("Please fill all required fields!");
      return;
    }

    setLoading(true);
    let dataObj;
    let product = productDetails;

    let formData = new FormData();
    formData.append('product', image);

    try {
      await fetch(`${backend_url}/upload`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      })
        .then((resp) => resp.json())
        .then((data) => { dataObj = data });

      if (dataObj.success) {
        product.image = dataObj.image_url;
        await fetch(`${backend_url}/addproduct`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        })
          .then((resp) => resp.json())
          .then((data) => {
            if (data.success) {
              toast.success("✓ Product added successfully!");
              setProductDetails({
                name: "",
                description: "",
                image: "",
                category: "men",
                new_price: "",
                old_price: ""
              });
              setImage(false);
            } else {
              toast.error("✕ Failed to add product!");
            }
          });
      } else {
        toast.error("✕ Failed to upload image!");
      }
    } catch (error) {
      toast.error("✕ An error occurred!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className="addproduct">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          type="text"
          name="name"
          value={productDetails.name}
          onChange={changeHandler}
          placeholder="Type here"
        />
      </div>

      <div className="addproduct-itemfield">
        <p>Product description</p>
        <input
          type="text"
          name="description"
          value={productDetails.description}
          onChange={changeHandler}
          placeholder="Type here"
        />
      </div>

      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            type="number"
            name="old_price"
            value={productDetails.old_price}
            onChange={changeHandler}
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            type="number"
            name="new_price"
            value={productDetails.new_price}
            onChange={changeHandler}
            placeholder="Type here"
          />
        </div>
      </div>

      <div className="addproduct-itemfield">
        <p>Product category</p>
        <select
          value={productDetails.category}
          name="category"
          className="add-product-selector"
          onChange={changeHandler}
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kids">Kids</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
        <p>Product image</p>
        <label htmlFor="file-input">
          <img
            className="addproduct-thumbnail-img"
            src={!image ? upload_area : URL.createObjectURL(image)}
            alt=""
          />
        </label>
        <input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          name="image"
          id="file-input"
          accept="image/*"
          hidden
        />
      </div>

      <button className="addproduct-btn" onClick={AddProduct}>
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
