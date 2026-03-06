import React, { useEffect, useState } from "react";
import { backend_url, currency } from "../App";
import "./MyOrders.css";

const MyOrders = () => {

  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {

    try {

      const response = await fetch(`${backend_url}/api/order/userorders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token")
        }
      });

      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
      }

    } catch (error) {
      console.log("Order fetch error:", error);
    }

  };

  useEffect(() => {
    fetchOrders();
  }, []);


  return (
    <div className="myorders">

      <h1>My Orders</h1>

      {orders.length === 0 && (
        <p className="empty">You have not placed any orders yet.</p>
      )}

      {orders.map((order) => (

        <div key={order._id} className="order-card">

          <div className="order-header">

            <div>
              <p><b>Order ID:</b> {order._id}</p>
              <p className="date">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="amount">
              {currency}{order.amount}
            </div>

            <div className={`status ${order.status}`}>
              {order.status || "Processing"}
            </div>

          </div>


          {/* ORDER PROGRESS BAR */}
          <div className="order-progress">

            <span className={order.status === "Order Placed" ? "active" : ""}>
              Order Placed
            </span>

            <span className={order.status === "Processing" ? "active" : ""}>
              Processing
            </span>

            <span className={order.status === "Shipped" ? "active" : ""}>
              Shipped
            </span>

            <span className={order.status === "Out for delivery" ? "active" : ""}>
              Out for delivery
            </span>

            <span className={order.status === "Delivered" ? "active" : ""}>
              Delivered
            </span>

          </div>


          <div className="order-products">

            {order.products.map((item, index) => (

              <div key={index} className="order-product">

                <img
                  src={
                    item.image?.startsWith("http")
                      ? item.image
                      : backend_url + item.image
                  }
                  alt=""
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

      ))}

    </div>
  );
};

export default MyOrders;