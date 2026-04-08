import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const toast = {
    success: (m) => addToast(m, 'success'),
    error:   (m) => addToast(m, 'error'),
    warning: (m) => addToast(m, 'warning'),
    info:    (m) => addToast(m, 'info'),
  };

  const typeStyles = {
    success: { bg:'rgba(76,175,125,0.12)',  border:'rgba(76,175,125,0.3)',  color:'#4caf7d', icon:'✓' },
    error:   { bg:'rgba(224,82,82,0.12)',   border:'rgba(224,82,82,0.3)',   color:'#e05252', icon:'✕' },
    warning: { bg:'rgba(224,168,74,0.12)',  border:'rgba(224,168,74,0.3)',  color:'#e0a84a', icon:'⚠' },
    info:    { bg:'rgba(90,156,245,0.12)',  border:'rgba(90,156,245,0.3)',  color:'#5a9cf5', icon:'ℹ' },
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{ position:'fixed', bottom:24, right:24, zIndex:9999, display:'flex', flexDirection:'column', gap:10, pointerEvents:'none' }}>
        {toasts.map(({ id, message, type }) => {
          const s = typeStyles[type] || typeStyles.info;
          return (
            <div key={id} style={{
              background: s.bg,
              border: `1px solid ${s.border}`,
              borderLeft: `3px solid ${s.color}`,
              borderRadius: 3,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              minWidth: 260,
              maxWidth: 360,
              backdropFilter: 'blur(12px)',
              animation: 'fadeUp .25s ease forwards',
              pointerEvents: 'all',
              fontFamily: 'var(--font-b)',
            }}>
              <span style={{ color: s.color, fontSize: 14, flexShrink: 0 }}>{s.icon}</span>
              <p style={{ fontSize: 13, color: '#f0ede8', lineHeight: 1.4 }}>{message}</p>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};
