import React, { useContext, useRef, useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../Assets/nav-logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown from '../Assets/nav_dropdown.png';

const Navbar = () => {

  const [menu, setMenu] = useState('shop');
  const [search, setSearch] = useState('');

  const { getTotalCartItems, products } = useContext(ShopContext);

  const menuRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    const path = location.pathname;

    if (path === '/shop') setMenu('shop');
    else if (path === '/mens') setMenu('mens');
    else if (path === '/womens') setMenu('womens');
    else if (path === '/kids') setMenu('kids');

  }, [location]);

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  };

  const handleSearch = (e) => {

    if (e.key === "Enter") {

      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );

      navigate('/search', { state: { results: filtered, query: search } });

    }

  };

  return (

    <nav className="nav">

      {/* ===== TOP ROW ===== */}
      <div className="nav-top">

        <Link to="/" className="nav-logo">
          <img src={logo} alt="logo"/>
          <p>SwiftCart</p>
        </Link>

        {/* SEARCH */}
        <div className="nav-search">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        {/* BUTTONS */}
        <div className="nav-login-cart">

          <Link to="/myorders">
            <button>My Orders</button>
          </Link>

          <Link to="/cart" className="cart-link">
            <img src={cart_icon} alt="cart"/>
            <div className="nav-cart-count">{getTotalCartItems()}</div>
          </Link>

          {localStorage.getItem("auth-token") ? (
            <button
              onClick={()=>{
                localStorage.removeItem("auth-token");
                navigate("/");
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button>Login</button>
            </Link>
          )}

        </div>

      </div>

      {/* ===== SECOND ROW ===== */}
      <ul ref={menuRef} className="nav-menu">
        {["shop","mens","womens","kids"].map((m)=>(
          <li key={m} onClick={()=>setMenu(m)}>
            <Link
              to={m==="shop"?"/":`/${m}`}
              className={menu===m?"active":""}
            >
              {m.charAt(0).toUpperCase()+m.slice(1)}
            </Link>
          </li>
        ))}
      </ul>

    </nav>

  );

};

export default Navbar;