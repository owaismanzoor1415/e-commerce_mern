import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { backend_url } from '../../App';

const Dashboard = () => {
    const location = useLocation();
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalValue: 0,
        totalDiscount: 0,
        averagePrice: 0,
        averageDiscount: 0,
        highestPrice: 0,
        lowestPrice: 0
    });

    const [recentProducts, setRecentProducts] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [categoryData, setCategoryData] = useState({ women: 0, men: 0, kids: 0 });
    const [priceRanges, setPriceRanges] = useState({ low: 0, medium: 0, high: 0, premium: 0 });
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchDashboardData(true); // Silent refresh
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    // Refresh when navigating back to dashboard
    useEffect(() => {
        fetchDashboardData();
    }, [location]);

    const fetchDashboardData = async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            else setIsRefreshing(true);

            const response = await fetch(`${backend_url}/allproducts`);
            const data = await response.json();
            const products = data.products || data;

            if (Array.isArray(products) && products.length > 0) {

                // Calculate REAL statistics
                const totalProducts = products.length;
                const totalValue = products.reduce((sum, p) => sum + (p.new_price || 0), 0);
                const totalOldValue = products.reduce((sum, p) => sum + (p.old_price || 0), 0);
                const totalDiscount = totalOldValue - totalValue;
                const avgPrice = Math.round(totalValue / totalProducts);

                // Calculate average discount percentage
                const discounts = products.map(p => {
                    if (p.old_price > p.new_price) {
                        return ((p.old_price - p.new_price) / p.old_price) * 100;
                    }
                    return 0;
                });
                const avgDiscount = Math.round(discounts.reduce((sum, d) => sum + d, 0) / totalProducts);

                // Find highest and lowest prices
                const prices = products.map(p => p.new_price);
                const highestPrice = Math.max(...prices);
                const lowestPrice = Math.min(...prices);

                // Category breakdown (REAL counts)
                const women = products.filter(p => p.category.toLowerCase() === 'women').length;
                const men = products.filter(p => p.category.toLowerCase() === 'men').length;
                const kids = products.filter(p => p.category.toLowerCase() === 'kid').length;

                // Price range distribution
                const low = products.filter(p => p.new_price < 1000).length;
                const medium = products.filter(p => p.new_price >= 1000 && p.new_price < 2000).length;
                const high = products.filter(p => p.new_price >= 2000 && p.new_price < 3000).length;
                const premium = products.filter(p => p.new_price >= 3000).length;

                // Top products by discount percentage
                const sortedByDiscount = [...products]
                    .filter(p => p.old_price > p.new_price)
                    .sort((a, b) => {
                        const discountA = ((a.old_price - a.new_price) / a.old_price) * 100;
                        const discountB = ((b.old_price - b.new_price) / b.old_price) * 100;
                        return discountB - discountA;
                    })
                    .slice(0, 5);

                setStats({
                    totalProducts,
                    totalValue,
                    totalDiscount,
                    averagePrice: avgPrice,
                    averageDiscount: avgDiscount,
                    highestPrice,
                    lowestPrice
                });

                setRecentProducts(products.slice(-6).reverse());
                setTopProducts(sortedByDiscount);
                setCategoryData({ women, men, kids });
                setPriceRanges({ low, medium, high, premium });
                setLastUpdated(new Date());
            } else {
                // No products yet
                setStats({
                    totalProducts: 0,
                    totalValue: 0,
                    totalDiscount: 0,
                    averagePrice: 0,
                    averageDiscount: 0,
                    highestPrice: 0,
                    lowestPrice: 0
                });
                setRecentProducts([]);
                setTopProducts([]);
                setCategoryData({ women: 0, men: 0, kids: 0 });
                setPriceRanges({ low: 0, medium: 0, high: 0, premium: 0 });
            }

            setLoading(false);
            setIsRefreshing(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleManualRefresh = () => {
        fetchDashboardData();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            {/* Header with Dynamic Refresh */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Live Dashboard
                        </h1>
                        {isRefreshing && (
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <p className="text-gray-600 text-lg">
                            Real-time data from your store
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-gray-500">
                                Updated: {lastUpdated.toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleManualRefresh}
                        className="px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-green-500 hover:text-green-600 transition-all flex items-center gap-2"
                        disabled={isRefreshing}
                    >
                        <span className={isRefreshing ? 'animate-spin' : ''}>🔄</span>
                        Refresh
                    </button>
                    <Link
                        to="/addproduct"
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-2xl transition-all transform hover:-translate-y-1"
                    >
                        ➕ Add Product
                    </Link>
                    <Link
                        to="/listproduct"
                        className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-blue-500 hover:text-blue-600 transition-all"
                    >
                        📦 View All ({stats.totalProducts})
                    </Link>
                </div>
            </div>

            {/* Dynamic Stats with Animation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        title: 'Total Products',
                        value: stats.totalProducts,
                        icon: '📦',
                        color: 'from-blue-500 via-blue-600 to-indigo-600',
                        subtitle: 'Active inventory',
                        trend: '+'
                    },
                    {
                        title: 'Inventory Value',
                        value: `₹${stats.totalValue.toLocaleString()}`,
                        icon: '💰',
                        color: 'from-green-500 via-green-600 to-emerald-600',
                        subtitle: 'Total worth',
                        trend: '↑'
                    },
                    {
                        title: 'Avg Price',
                        value: `₹${stats.averagePrice.toLocaleString()}`,
                        icon: '💵',
                        color: 'from-purple-500 via-purple-600 to-pink-600',
                        subtitle: `${stats.averageDiscount}% avg discount`,
                        trend: '~'
                    },
                    {
                        title: 'Customer Savings',
                        value: `₹${stats.totalDiscount.toLocaleString()}`,
                        icon: '🎯',
                        color: 'from-orange-500 via-orange-600 to-red-600',
                        subtitle: 'Total discounts',
                        trend: '↓'
                    }
                ].map((stat, index) => (
                    <div key={index} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                        <div className="p-6 relative">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.title}</p>
                                    <h3 className="text-3xl font-bold text-gray-900 mt-3 transition-all duration-300">{stat.value}</h3>
                                    <p className="text-xs text-gray-500 mt-2">{stat.subtitle}</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="text-sm font-bold text-green-600">{stat.trend} Live</span>
                                        <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                                <div className={`bg-gradient-to-br ${stat.color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                        <div className={`h-1.5 bg-gradient-to-r ${stat.color}`}></div>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Category Distribution - Dynamic */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Category Distribution</h2>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            Live Data
                        </span>
                    </div>
                    <div className="space-y-6">
                        {[
                            { name: 'Women', count: categoryData.women, color: 'from-pink-500 to-rose-600', icon: '👗', bgColor: 'bg-pink-50' },
                            { name: 'Men', count: categoryData.men, color: 'from-blue-500 to-cyan-600', icon: '👔', bgColor: 'bg-blue-50' },
                            { name: 'Kids', count: categoryData.kids, color: 'from-yellow-500 to-orange-600', icon: '🧸', bgColor: 'bg-yellow-50' }
                        ].map((cat, index) => {
                            const total = stats.totalProducts;
                            const percentage = total > 0 ? ((cat.count / total) * 100).toFixed(1) : 0;
                            return (
                                <div key={index} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`${cat.bgColor} w-14 h-14 rounded-xl flex items-center justify-center text-2xl`}>
                                                {cat.icon}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-lg">{cat.name}</p>
                                                <p className="text-sm text-gray-500">{percentage}% of total</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-gray-900">{cat.count}</p>
                                            <p className="text-xs text-gray-500">products</p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                        <div
                                            className={`h-4 bg-gradient-to-r ${cat.color} rounded-full transition-all duration-1000 flex items-center justify-end pr-2`}
                                            style={{ width: `${percentage}%` }}
                                        >
                                            {percentage > 10 && (
                                                <span className="text-white text-xs font-bold">{percentage}%</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Price Range Distribution - Dynamic */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Price Ranges</h2>
                        <span className="text-xs text-gray-500">Auto-updating</span>
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: 'Budget', range: '< ₹1K', count: priceRanges.low, color: 'bg-green-500', textColor: 'text-green-600' },
                            { label: 'Medium', range: '₹1K-2K', count: priceRanges.medium, color: 'bg-blue-500', textColor: 'text-blue-600' },
                            { label: 'High', range: '₹2K-3K', count: priceRanges.high, color: 'bg-purple-500', textColor: 'text-purple-600' },
                            { label: 'Premium', range: '> ₹3K', count: priceRanges.premium, color: 'bg-orange-500', textColor: 'text-orange-600' }
                        ].map((range, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <div>
                                    <p className={`font-semibold ${range.textColor}`}>{range.label}</p>
                                    <p className="text-xs text-gray-500">{range.range}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`${range.color} text-white px-4 py-2 rounded-lg font-bold transition-all duration-500`}>
                                        {range.count}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section - Dynamic */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Discounts - Updates Automatically */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">🏆 Best Deals</h2>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Live</span>
                    </div>
                    {topProducts.length > 0 ? (
                        <div className="space-y-3">
                            {topProducts.map((product, index) => {
                                const discount = Math.round(((product.old_price - product.new_price) / product.old_price) * 100);
                                return (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all border border-gray-100">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                                            #{index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 truncate text-sm">{product.name}</p>
                                            <p className="text-xs text-green-600 font-bold">{discount}% OFF</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">₹{product.new_price}</p>
                                            <p className="text-xs text-gray-400 line-through">₹{product.old_price}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-8">No discounted products</p>
                    )}
                </div>

                {/* Recent Products - Auto Updates */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">📦 Latest Products</h2>
                        <div className="flex items-center gap-3">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Refreshed {lastUpdated.toLocaleTimeString()}</span>
                            <Link to="/listproduct" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                View All →
                            </Link>
                        </div>
                    </div>
                    {recentProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {recentProducts.map((product, index) => (
                                <div key={index} className="group cursor-pointer">
                                    <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-square">
                                        <img
                                            src={product.image.startsWith('http') ? product.image : backend_url + product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=Image'; }}
                                        />
                                        {product.old_price > product.new_price && (
                                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                                                {Math.round(((product.old_price - product.new_price) / product.old_price) * 100)}% OFF
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900 truncate">{product.name}</h3>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-sm font-bold text-gray-900">₹{product.new_price}</span>
                                        {product.old_price > product.new_price && (
                                            <span className="text-xs text-gray-500 line-through">₹{product.old_price}</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500 capitalize">{product.category}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-3">No products yet</p>
                            <Link to="/addproduct" className="text-blue-600 hover:text-blue-700 font-medium">
                                Add your first product →
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Price Stats Summary - Live */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">💵 Live Pricing Stats</h2>
                    <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded-full">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-sm">Auto-updating</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Highest Price', value: stats.highestPrice },
                        { label: 'Lowest Price', value: stats.lowestPrice },
                        { label: 'Average Price', value: stats.averagePrice },
                        { label: 'Avg Discount', value: `${stats.averageDiscount}%`, isPercent: true }
                    ].map((item, index) => (
                        <div key={index} className="text-center p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                            <p className="text-sm opacity-90">{item.label}</p>
                            <p className="text-3xl font-bold mt-2 transition-all duration-500">
                                {item.isPercent ? item.value : `₹${item.value.toLocaleString()}`}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
