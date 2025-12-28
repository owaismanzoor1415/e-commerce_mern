import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        const newToast = { id, message, type, duration };

        setToasts(prev => [...prev, newToast]);

        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((message, duration) => showToast(message, 'success', duration), [showToast]);
    const error = useCallback((message, duration) => showToast(message, 'error', duration), [showToast]);
    const info = useCallback((message, duration) => showToast(message, 'info', duration), [showToast]);
    const warning = useCallback((message, duration) => showToast(message, 'warning', duration), [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, success, error, info, warning, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-3">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

const Toast = ({ toast, onClose }) => {
    const { message, type } = toast;

    const styles = {
        success: {
            bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
            icon: '✓',
            iconBg: 'bg-white text-green-600'
        },
        error: {
            bg: 'bg-gradient-to-r from-red-500 to-rose-600',
            icon: '✕',
            iconBg: 'bg-white text-red-600'
        },
        warning: {
            bg: 'bg-gradient-to-r from-yellow-500 to-orange-600',
            icon: '⚠',
            iconBg: 'bg-white text-yellow-600'
        },
        info: {
            bg: 'bg-gradient-to-r from-blue-500 to-cyan-600',
            icon: 'ℹ',
            iconBg: 'bg-white text-blue-600'
        }
    };

    const style = styles[type] || styles.info;

    return (
        <div className={`${style.bg} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 min-w-[300px] max-w-md transform transition-all duration-300 animate-slideIn`}>
            <div className={`${style.iconBg} w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0`}>
                {style.icon}
            </div>
            <p className="flex-1 font-medium text-sm">{message}</p>
            <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default ToastProvider;
