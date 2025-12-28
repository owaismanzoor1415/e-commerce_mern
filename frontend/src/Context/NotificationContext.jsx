import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    // Add a new notification
    const notify = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);

        if (duration) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    // Helper functions
    const success = (msg) => notify(msg, 'success');
    const error = (msg) => notify(msg, 'error');
    const warning = (msg) => notify(msg, 'warning');
    const info = (msg) => notify(msg, 'info');

    return (
        <NotificationContext.Provider value={{ notify, success, error, warning, info }}>
            {children}

            {/* Notification Container */}
            <div style={{
                position: 'fixed',
                top: '80px',
                right: '20px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                pointerEvents: 'none'
            }}>
                {notifications.map(n => (
                    <div
                        key={n.id}
                        className="animate-slide-in"
                        style={{
                            pointerEvents: 'auto',
                            minWidth: '300px',
                            maxWidth: '350px',
                            padding: '16px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: getBackground(n.type),
                            fontFamily: "'Poppins', sans-serif"
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '20px' }}>
                                {n.type === 'success' && '✅'}
                                {n.type === 'error' && '❌'}
                                {n.type === 'warning' && '⚠️'}
                                {n.type === 'info' && 'ℹ️'}
                            </span>
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>{n.message}</p>
                        </div>

                        <button
                            onClick={() => removeNotification(n.id)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '16px',
                                opacity: 0.8,
                                marginLeft: '10px'
                            }}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

const getBackground = (type) => {
    switch (type) {
        case 'success': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)'; // Green
        case 'error': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';   // Red
        case 'warning': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'; // Orange
        case 'info': return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';    // Blue
        default: return '#333';
    }
};
