import React from "react";
import { useLocation, Link } from "react-router-dom";
import { backend_url } from "../App";

const Search = () => {

  const location = useLocation();

  const results = location.state?.results || [];
  const query = location.state?.query || "";

  return (
    <div style={{padding:"40px"}}>

      <h2>Search results for "{query}"</h2>

      {results.length === 0 && <p>No products found</p>}

      <div style={{
        display:"flex",
        gap:"40px",
        flexWrap:"wrap",
        marginTop:"20px"
      }}>

        {results.map((product)=>(
          
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            style={{textDecoration:"none", color:"black"}}
          >

            <div style={{width:"220px"}}>

              <img
                src={
                  product.image?.startsWith("http")
                  ? product.image
                  : backend_url + product.image
                }
                alt=""
                width="220"
              />

              <h3>{product.name}</h3>

              <p>₹{product.new_price}</p>

            </div>

          </Link>

        ))}

      </div>

    </div>
  );
};

export default Search;