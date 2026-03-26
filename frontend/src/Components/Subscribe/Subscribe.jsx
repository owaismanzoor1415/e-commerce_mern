import React, { useState } from "react";
import "./Subscribe.css";

const Subscribe = () => {

  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email) return alert("Enter email");
    alert("Subscribed successfully!");
    setEmail("");
  };

  return (
    <div className="subscribe">

      <h2>Get Exclusive Deals</h2>
      <p>Subscribe to get latest offers & updates</p>

      <div className="subscribe-box">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
        <button onClick={handleSubscribe}>Subscribe</button>
      </div>

    </div>
  );
};

export default Subscribe;