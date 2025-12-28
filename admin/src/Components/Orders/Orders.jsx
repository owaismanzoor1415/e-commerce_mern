import React, { useState, useEffect } from 'react';
import { backend_url, currency } from '../../App';
import { useToast } from '../../Context/ToastContext';
import parcel_icon from '../../Components/Assets/Product_Cart.svg';

const Orders = () => {
    const { success, error } = useToast();
    const [orders, setOrders] = useState([]);

    const fetchAllOrders = async () => {
        try {
            const response = await fetch(backend_url + '/api/order/list', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.success) {
                setOrders(data.data);
            } else {
                error("Error fetching orders");
            }
        } catch (err) {
            error("Error fetching orders");
        }
    }

    const statusHandler = async (event, orderId) => {
        try {
            const response = await fetch(backend_url + '/api/order/status', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId,
                    status: event.target.value
                })
            });
            const data = await response.json();
            if (data.success) {
                await fetchAllOrders();
                success("Status Updated");
            }
        } catch (err) {
            error("Error updating status");
        }
    }

    useEffect(() => {
        fetchAllOrders();
    }, [])

    return (
        <div className='p-8 bg-gray-50 min-h-screen'>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Orders Management</h3>

            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">Product</th>
                            <th scope="col" className="px-6 py-3">Customer</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Amount</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={index} className="bg-white border-b hover:bg-gray-50 align-top">
                                {/* Product Column */}
                                <td className="px-6 py-4">
                                    <div className='flex flex-col gap-2'>
                                        {order.products.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <img
                                                    src={item.image || parcel_icon}
                                                    alt="product"
                                                    className="w-10 h-10 rounded object-cover border"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = parcel_icon }}
                                                />
                                                <div>
                                                    <p className='font-medium text-gray-900 line-clamp-2 w-48' title={item.name}>
                                                        {item.name || "Product ID: " + item.productId}
                                                    </p>
                                                    <span className='text-xs text-gray-500'>Qty: {item.quantity}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </td>

                                {/* Customer Column */}
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900">{order.address.firstName + " " + order.address.lastName}</span>
                                        <span className="text-xs text-gray-500 mt-1">{order.address.phone}</span>
                                        <span className="text-xs text-gray-600 mt-1 max-w-xs">
                                            {order.address.street}, {order.address.city}, {order.address.zipcode}
                                        </span>
                                    </div>
                                </td>

                                {/* Date Column */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(order.date).toLocaleDateString()}
                                    <br />
                                    <span className='text-xs text-gray-500'>{new Date(order.date).toLocaleTimeString()}</span>
                                </td>

                                {/* Amount Column */}
                                <td className="px-6 py-4 font-semibold text-gray-900">
                                    {currency}{order.amount}
                                </td>

                                {/* Status Column */}
                                <td className="px-6 py-4">
                                    <select
                                        onChange={(event) => statusHandler(event, order._id)}
                                        value={order.status}
                                        className={`p-2 rounded border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${order.status === 'Delivered' ? 'bg-green-50 border-green-200 text-green-700' :
                                                order.status === 'Shipped' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                                    'bg-gray-50 border-gray-200 text-gray-700'
                                            }`}
                                    >
                                        <option value="Order Placed">Order Placed</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Out for delivery">Out for delivery</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Orders;
