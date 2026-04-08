import React, { useContext, useState } from "react";
import { useNotification } from "../Context/NotificationContext";
import { ShopContext } from "../Context/ShopContext";
import { backend_url, currency } from "../App";
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getTotalCartAmount, products } = useContext(ShopContext);
  const { success, error, warning } = useNotification();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "",
    street: "", city: "", state: "",
    zipcode: "", country: "", phone: ""
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData(d => ({ ...d, [name]: value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    let orderItems = [];
    products.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          productId: item._id,
          quantity: cartItems[item._id],
          price: item.new_price,
          name: item.name,
          image: item.image
        });
      }
    });

    if (orderItems.length === 0) {
      warning("Your cart is empty!");
      setLoading(false);
      return;
    }

    const orderData = {
      address: formData,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
      paymentMethod
    };

    try {
      if (paymentMethod === "cod") {
        const res = await fetch(`${backend_url}/api/order/place`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'auth-token': localStorage.getItem('auth-token') },
          body: JSON.stringify(orderData)
        });
        const data = await res.json();
        if (data.success) {
          success("🎉 Order Placed Successfully!");
          setTimeout(() => window.location.replace("/"), 2000);
        } else {
          error("Error placing order: " + data.message);
        }
      } else if (paymentMethod === "stripe") {
        const res = await fetch(`${backend_url}/api/order/stripe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'auth-token': localStorage.getItem('auth-token') },
          body: JSON.stringify(orderData)
        });
        const data = await res.json();
        if (data.success) {
          window.location.replace(data.session_url);
        } else {
          error("Stripe Error: " + data.message);
        }
      }
    } catch (err) {
      console.log(err);
      error("Something went wrong");
    }

    setLoading(false);
  };

  const subtotal = getTotalCartAmount();
  const delivery = subtotal === 0 ? 0 : 2;
  const total = subtotal === 0 ? 0 : subtotal + 2;

  return (
    <div className="checkout-page">

      {/* ── Progress bar ── */}
      <div className="co-progress">
        <div className="co-progress-inner">
          <div className="co-step co-step--done">
            <div className="co-step-circle">✓</div>
            <span className="co-step-label">Cart</span>
          </div>
          <div className="co-step-connector" />
          <div className="co-step co-step--active">
            <div className="co-step-circle">2</div>
            <span className="co-step-label">Checkout</span>
          </div>
          <div className="co-step-connector" />
          <div className="co-step co-step--pending">
            <div className="co-step-circle">3</div>
            <span className="co-step-label">Confirmation</span>
          </div>
        </div>
      </div>

      {/* ── Main form ── */}
      <form onSubmit={placeOrder} className="checkout-container">

        {/* LEFT — Delivery */}
        <div className="checkout-left">
          <div className="co-section-head">
            <div className="co-section-pip" />
            <div>
              <h2 className="co-section-title">Delivery Information</h2>
              <p className="co-section-sub">Where should we send your order?</p>
            </div>
          </div>

          <div className="co-field-group">

            <div className="co-field-row">
              <div className="co-field">
                <label>First Name</label>
                <input required name="firstName" onChange={onChangeHandler} value={formData.firstName} type="text" placeholder="John" />
              </div>
              <div className="co-field">
                <label>Last Name</label>
                <input required name="lastName" onChange={onChangeHandler} value={formData.lastName} type="text" placeholder="Doe" />
              </div>
            </div>

            <div className="co-field">
              <label>Email Address</label>
              <input required name="email" onChange={onChangeHandler} value={formData.email} type="email" placeholder="john@example.com" />
            </div>

            <div className="co-field">
              <label>Street Address</label>
              <input required name="street" onChange={onChangeHandler} value={formData.street} type="text" placeholder="123 Main Street" />
            </div>

            <div className="co-field-row">
              <div className="co-field">
                <label>City</label>
                <input required name="city" onChange={onChangeHandler} value={formData.city} type="text" placeholder="Mumbai" />
              </div>
              <div className="co-field">
                <label>State</label>
                <input required name="state" onChange={onChangeHandler} value={formData.state} type="text" placeholder="Maharashtra" />
              </div>
            </div>

            <div className="co-field-row">
              <div className="co-field">
                <label>Zip Code</label>
                <input required name="zipcode" onChange={onChangeHandler} value={formData.zipcode} type="text" placeholder="400001" />
              </div>
              <div className="co-field">
                <label>Country</label>
                <input required name="country" onChange={onChangeHandler} value={formData.country} type="text" placeholder="India" />
              </div>
            </div>

            <div className="co-field">
              <label>Phone Number</label>
              <input required name="phone" onChange={onChangeHandler} value={formData.phone} type="text" placeholder="+91 98765 43210" />
            </div>

          </div>
        </div>

        {/* RIGHT — Summary */}
        <div className="checkout-right">
          <div className="co-summary-card">

            {/* Header */}
            <div className="co-summary-header">
              <div className="co-summary-eyebrow">Order Summary</div>
              <h3 className="co-summary-title">Cart Totals</h3>
            </div>

            {/* Totals */}
            <div className="co-totals">
              <div className="co-total-row">
                <span className="co-total-label">Subtotal</span>
                <span className="co-total-value">{currency}{subtotal}</span>
              </div>
              <div className="co-total-row">
                <span className="co-total-label">Delivery Fee</span>
                <span className="co-total-value">{currency}{delivery}</span>
              </div>
              <div className="co-total-row co-total-row--final">
                <span className="co-total-label">Total</span>
                <span className="co-total-value">{currency}{total}</span>
              </div>
            </div>

            {/* Payment */}
            <div className="co-payment">
              <div className="co-payment-title">Payment Method</div>
              <div className="co-payment-options">

                <div
                  className={`co-payment-option${paymentMethod === "cod" ? " selected" : ""}`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <div className="co-radio">
                    <div className="co-radio-dot" />
                  </div>
                  <div className="co-payment-info">
                    <div className="co-payment-name">Cash on Delivery</div>
                    <div className="co-payment-desc">Pay when your order arrives</div>
                  </div>
                  <span className="co-payment-icon">🏠</span>
                </div>

                <div
                  className={`co-payment-option${paymentMethod === "stripe" ? " selected" : ""}`}
                  onClick={() => setPaymentMethod("stripe")}
                >
                  <div className="co-radio">
                    <div className="co-radio-dot" />
                  </div>
                  <div className="co-payment-info">
                    <div className="co-payment-name">Stripe — Credit Card</div>
                    <div className="co-payment-desc">Visa, Mastercard, UPI & more</div>
                  </div>
                  <span className="co-payment-icon">💳</span>
                </div>

              </div>
            </div>

            {/* Submit */}
            <div className="co-submit-wrap">
              <button type="submit" className="co-submit-btn" disabled={loading}>
                {loading ? (
                  <span className="co-spinner" />
                ) : (
                  <>
                    <span>Proceed to Payment</span>
                    <span className="co-btn-arrow">→</span>
                  </>
                )}
              </button>
              <p className="co-submit-note">🔒 Secured by 256-bit SSL encryption</p>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
};

export default Checkout;
