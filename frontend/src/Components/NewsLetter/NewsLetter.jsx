import React, { useState } from "react";
import "./NewsLetter.css";
import { useNotification } from "../../Context/NotificationContext";

const NewsLetter = () => {
  const { warning, success, error } = useNotification();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email) {
      warning("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      success(data.message || "Subscribed successfully!");
      setEmail("");
    } catch (err) {
      error("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="newsletter">
      <h1>Get Exclusive Offers On Your Email</h1>
      <p>Subscribe to our newsletter and stay updated.</p>

      <div className="newsletter-input">
        <input
          type="email"
          placeholder="Your email id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSubscribe} disabled={loading}>
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
    </div>
  );
};

export default NewsLetter;
