import React from 'react';

const Navbar = () => {
    return (
        <div className="bg-white border-b border-gray-200 shadow-sm fixed top-0 right-0 left-64 z-10">
            <div className="px-6 py-4 flex items-center justify-between">
                {/* Search Bar */}
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products, orders, customers..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center space-x-4 ml-4">
                    {/* Notifications */}
                    <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <span className="text-xl">🔔</span>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Messages */}
                    <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <span className="text-xl">💬</span>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                    </button>

                    {/* Profile */}
                    <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">OWAIS</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                            O
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
