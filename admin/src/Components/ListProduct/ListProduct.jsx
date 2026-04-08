import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../Assets/cross_icon.png";
import { backend_url, currency } from "../../App";
import { useToast } from "../../Context/ToastContext";
import { Link } from "react-router-dom";

const ListProduct = () => {
  const toast = useToast();
  const [allproducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInfo = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backend_url}/allproducts`);
      const data = await res.json();
      if (data.products) setAllProducts(data.products);
      else if (Array.isArray(data)) setAllProducts(data);
      setLoading(false);
    } catch (e) { toast.error("Failed to fetch products"); setLoading(false); }
  };

  const removeProduct = async (id) => {
    try {
      const res = await fetch(`${backend_url}/removeproduct`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Product removed!");
        setAllProducts(prev => prev.filter(p => p._id !== id));
      } else { toast.error("Failed to remove product!"); }
    } catch (e) { toast.error("An error occurred!"); }
  };

  useEffect(() => { fetchInfo(); }, []);

  const imgSrc = (img) => img?.startsWith('http') ? img : backend_url + img;

  return (
    <div className="listproduct">
      <div className="listproduct-header">
        <div className="listproduct-header-left">
          <p>Catalogue</p>
          <h1>All Products</h1>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span className="listproduct-count">{allproducts.length} items</span>
          <Link to="/addproduct" style={{ padding:'8px 18px', background:'var(--accent)', color:'#0a0a0a', borderRadius:'var(--radius)', fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase' }}>
            + Add Product
          </Link>
        </div>
      </div>

      <div className="listproduct-table-wrap">
        <div className="listproduct-format-main headings">
          <p>Image</p>
          <p>Title</p>
          <p className="hide-mobile">Original</p>
          <p className="hide-mobile">Sale Price</p>
          <p>Category</p>
          <p>Del</p>
        </div>

        {loading ? (
          [...Array(6)].map((_,i) => (
            <div key={i} className="skeleton-row-list">
              <div style={{ height:64 }} />
              <div style={{ height:14, marginTop:10 }} />
              <div style={{ height:14, marginTop:10 }} />
              <div style={{ height:14, marginTop:10 }} />
              <div style={{ height:14, marginTop:10 }} />
              <div style={{ height:14, marginTop:10 }} />
            </div>
          ))
        ) : allproducts.length === 0 ? (
          <div className="listproduct-empty">
            <p>No products found. <Link to="/addproduct" style={{ color:'var(--accent)' }}>Add one →</Link></p>
          </div>
        ) : allproducts.map((product) => (
          <div key={product._id} className="listproduct-format-main listproduct-format">
            <img className="listproduct-product-icon" src={imgSrc(product.image)} alt="" onError={e=>e.target.style.display='none'} />
            <p className="cartitems-product-title">{product.name}</p>
            <p className="hide-mobile" style={{ color:'var(--text-muted)' }}>{currency}{product.old_price}</p>
            <p style={{ color:'var(--accent)' }}>{currency}{product.new_price}</p>
            <span className="category-badge">{product.category}</span>
            <img className="listproduct-remove-icon" src={cross_icon} alt="remove" onClick={() => removeProduct(product._id)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
