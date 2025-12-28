import React, { useContext, useState } from "react";
import { useNotification } from "../Context/NotificationContext";
import { ShopContext } from "../Context/ShopContext";
import { backend_url } from "../App";
import './CSS/Checkout.css';

const Checkout = () => {
  const { cartItems, getTotalCartAmount, products } = useContext(ShopContext);
  const { success, error, warning } = useNotification();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value }));
  }

  const placeOrder = async (event) => {
    event.preventDefault();
    setLoading(true);

    let orderItems = [];
    products.map((item) => {
      if (cartItems[item.id] > 0) {
        let itemInfo = {
          productId: item.id, // ID from frontend matched to schema 'productId'
          quantity: cartItems[item.id],
          price: item.new_price,
          name: item.name,
          image: item.image
        };
        orderItems.push(itemInfo);
      }
      return null;
    });

    if (orderItems.length === 0) {
      warning("Your cart is empty!");
      setLoading(false);
      return;
    }

    let orderData = {
      address: formData,
      items: orderItems,
      amount: getTotalCartAmount() + 2, // Adding delivery fee just for demo
      paymentMethod: paymentMethod
    }

    try {
      if (paymentMethod === "cod") {
        const response = await fetch(backend_url + '/api/order/place', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('auth-token')
          },
          body: JSON.stringify(orderData)
        });

        const data = await response.json();
        if (data.success) {
          success("🎉 Order Placed Successfully!");
          // Ideally clear cart via context function here if available
          setTimeout(() => {
            window.location.replace("/"); // Go to 'My Orders' in future, for now Home
          }, 2000);
        } else {
          error("Error placing order: " + data.message);
        }

      } else if (paymentMethod === "stripe") {
        const response = await fetch(backend_url + '/api/order/stripe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('auth-token')
          },
          body: JSON.stringify(orderData)
        });

        const data = await response.json();
        if (data.success) {
          const { session_url } = data;
          window.location.replace(session_url);
        } else {
          error("Stripe Error: " + data.message);
        }
      }

    } catch (err) {
      console.log(err);
      error("Something went wrong");
    }
    setLoading(false);
  }


  return (
    <form onSubmit={placeOrder} className="checkout-container">
      <div className="checkout-left">
        <div className="checkout-title">Delivery Information</div>
        <div className="multi-fields">
          <input required name="firstName" onChange={onChangeHandler} value={formData.firstName} type="text" placeholder="First name" />
          <input required name="lastName" onChange={onChangeHandler} value={formData.lastName} type="text" placeholder="Last name" />
        </div>
        <input required name="email" onChange={onChangeHandler} value={formData.email} type="email" placeholder="Email address" />
        <input required name="street" onChange={onChangeHandler} value={formData.street} type="text" placeholder="Street" />
        <div className="multi-fields">
          <input required name="city" onChange={onChangeHandler} value={formData.city} type="text" placeholder="City" />
          <input required name="state" onChange={onChangeHandler} value={formData.state} type="text" placeholder="State" />
        </div>
        <div className="multi-fields">
          <input required name="zipcode" onChange={onChangeHandler} value={formData.zipcode} type="text" placeholder="Zip code" />
          <input required name="country" onChange={onChangeHandler} value={formData.country} type="text" placeholder="Country" />
        </div>
        <input required name="phone" onChange={onChangeHandler} value={formData.phone} type="text" placeholder="Phone" />
      </div>

      <div className="checkout-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>

          <div className="payment-method">
            <h3>Payment Method</h3>
            <div className="payment-options">
              <div className={`payment-option ${paymentMethod === "cod" ? "selected" : ""}`} onClick={() => setPaymentMethod("cod")}>
                <p>Cash On Delivery</p>
              </div>
              <div className={`payment-option ${paymentMethod === "stripe" ? "selected" : ""}`} onClick={() => setPaymentMethod("stripe")}>
                <p>Stripe (Credit Card)</p>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "PROCEED TO PAYMENT"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Checkout;
