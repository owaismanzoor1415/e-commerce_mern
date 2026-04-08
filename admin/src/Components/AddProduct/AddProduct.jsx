import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../Assets/upload_area.svg";
import { backend_url } from "../../App";
import { useToast } from "../../Context/ToastContext";

const AddProduct = () => {
  const toast = useToast();
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "", description: "", image: "", category: "men", new_price: "", old_price: ""
  });
  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => setProductDetails({ ...productDetails, [e.target.name]: e.target.value });

  const handleAddProduct = async () => {
    if (!image) return toast.error("Please select an image!");
    if (!productDetails.name || !productDetails.new_price || !productDetails.old_price)
      return toast.warning("Please fill all required fields!");

    setLoading(true);
    try {
      let formData = new FormData();
      formData.append('product', image);
      const uploadRes = await fetch(`${backend_url}/upload`, { method:'POST', headers:{ Accept:'application/json' }, body:formData });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) { toast.error("Image upload failed!"); setLoading(false); return; }

      const product = { ...productDetails, image: uploadData.image_url };
      const addRes = await fetch(`${backend_url}/addproduct`, {
        method:'POST', headers:{ Accept:'application/json', 'Content-Type':'application/json' },
        body: JSON.stringify(product)
      });
      const addData = await addRes.json();
      if (addData.success) {
        toast.success("Product added successfully!");
        setProductDetails({ name:"", description:"", image:"", category:"men", new_price:"", old_price:"" });
        setImage(false);
      } else { toast.error("Failed to add product!"); }
    } catch (e) { toast.error("An error occurred!"); }
    setLoading(false);
  };

  return (
    <div className="addproduct">
      <div className="addproduct-page-header">
        <p>Catalogue</p>
        <h1>Add New Product</h1>
      </div>

      <div className="addproduct-form">
        {/* Basic Info */}
        <div className="addproduct-card">
          <p className="addproduct-card-title">Product Info</p>
          <div className="addproduct-itemfield">
            <label>Product Title *</label>
            <input type="text" name="name" value={productDetails.name} onChange={changeHandler} placeholder="Enter product title" />
          </div>
          <div className="addproduct-itemfield">
            <label>Description</label>
            <input type="text" name="description" value={productDetails.description} onChange={changeHandler} placeholder="Brief description" />
          </div>
          <div className="addproduct-itemfield">
            <label>Category</label>
            <select name="category" value={productDetails.category} onChange={changeHandler} className="add-product-selector">
              <option value="women">Women</option>
              <option value="men">Men</option>
              <option value="kids">Kids</option>
            </select>
          </div>
        </div>

        {/* Pricing */}
        <div className="addproduct-card">
          <p className="addproduct-card-title">Pricing</p>
          <div className="addproduct-price">
            <div className="addproduct-itemfield">
              <label>Original Price (₹) *</label>
              <input type="number" name="old_price" value={productDetails.old_price} onChange={changeHandler} placeholder="e.g. 2499" />
            </div>
            <div className="addproduct-itemfield">
              <label>Sale Price (₹) *</label>
              <input type="number" name="new_price" value={productDetails.new_price} onChange={changeHandler} placeholder="e.g. 1799" />
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="addproduct-card">
          <p className="addproduct-card-title">Product Image</p>
          <label htmlFor="file-input">
            <div className={`addproduct-upload-area ${image ? 'has-image' : ''}`}>
              {image ? (
                <img className="addproduct-thumbnail-img" src={URL.createObjectURL(image)} alt="preview" />
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-placeholder-icon">↑</span>
                  <p>Click to upload image</p>
                  <span>PNG, JPG, WEBP</span>
                </div>
              )}
            </div>
          </label>
          <input type="file" id="file-input" accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])} />
        </div>

        {/* Submit */}
        <button className="addproduct-btn" onClick={handleAddProduct} disabled={loading}>
          {loading ? <span className="btn-spinner" /> : 'Add Product to Catalogue'}
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
