import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const [activeItem, setActiveItem] = useState('dashboard');

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: '📊',
            path: '/'
        },
        {
            id: 'addproduct',
            label: 'Add Product',
            icon: '➕',
            path: '/addproduct'
        },
        {
            id: 'listproduct',
            label: 'Product List',
            icon: '📦',
            path: '/listproduct'
        },
        {
            id: 'orders',
            label: 'Orders',
            icon: '📋',
            path: '/orders'
        }
    ];

    return (
        <div className="w-64 bg-white h-screen shadow-lg fixed left-0 top-0 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        E
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">E-Commerce</h1>
                        <p className="text-xs text-gray-500">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => setActiveItem(item.id)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeItem === item.id
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <span className="text-2xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-700">Need Help?</p>
                    <p className="text-xs text-gray-500 mt-1">Check our documentation</p>
                    <button className="mt-2 w-full bg-white text-gray-700 text-xs py-2 rounded-md hover:bg-gray-50 transition-colors font-medium">
                        Get Support
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
