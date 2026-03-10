import React, { useEffect, useState } from "react";
import { backend_url, currency } from "../App";
import "./MyOrders.css";

const MyOrders = () => {

const [orders, setOrders] = useState([]);

const fetchOrders = async () => {
try {

  const response = await fetch(`${backend_url}/api/order/userorders`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("auth-token")
    }
  });

  const data = await response.json();

  if (data.success) {
    setOrders(data.data || []);
  }

} catch (error) {
  console.log("Order fetch error:", error);
}

};

useEffect(() => {
fetchOrders();
}, []);

const steps = [
"Order Placed",
"Processing",
"Shipped",
"Out for delivery",
"Delivered"
];

return (

<div className="myorders">

  <h1>My Orders</h1>

  {orders.length === 0 && (
    <p className="empty">You have not placed any orders yet.</p>
  )}

  {orders.map((order) => {

    const status = order.status || "Processing";
    const currentStep = steps.indexOf(status);

    return (

      <div key={order._id} className="order-card">

        {/* HEADER */}
        <div className="order-header">

          <div>
            <p><b>Order ID:</b> {order._id}</p>

            <p className="date">
              {new Date(order.createdAt || order.date).toLocaleDateString()}
            </p>
          </div>

          <div className="amount">
            {currency}{order.amount}
          </div>

          <div className={`status ${status}`}>
            {status}
          </div>

        </div>


        {/* ORDER PROGRESS */}
        <div className="order-progress">

          {steps.map((step, index) => (
            <span
              key={step}
              className={index <= currentStep ? "active" : ""}
            >
              {step}
            </span>
          ))}

        </div>


        {/* PRODUCTS */}
        <div className="order-products">

          {(order.products || []).map((item, index) => (

            <div key={index} className="order-product">

              <img
                src={
                  item.image?.startsWith("http")
                    ? item.image
                    : backend_url + item.image
                }
                alt={item.name}
              />

              <div className="details">

                <p className="name">{item.name}</p>

                <p>Quantity: {item.quantity}</p>

                <p>Price: {currency}{item.price}</p>

              </div>

            </div>

          ))}

        </div>

      </div>

    );

  })}

</div>

);
};

export default MyOrders;
