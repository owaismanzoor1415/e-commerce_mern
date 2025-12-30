import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';

const NotificationContext = createContext();

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};

/* ----------  provider  ---------- */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const remove = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback(
    (message, type = 'info', duration = 4000) => {
      const id = Date.now() + Math.random();
      setNotifications((prev) => [...prev, { id, message, type, duration }]);
    },
    []
  );

  const success = (m) => notify(m, 'success');
  const error = (m) => notify(m, 'error');
  const warning = (m) => notify(m, 'warning');
  const info = (m) => notify(m, 'info');

  return (
    <NotificationContext.Provider value={{ notify, success, error, warning, info }}>
      {children}
      <Portal>
        <div style={portalStyles}>
          {notifications.map((n) => (
            <NotifCard key={n.id} {...n} onRemove={() => remove(n.id)} />
          ))}
        </div>
      </Portal>
    </NotificationContext.Provider>
  );
};

/* ----------  single 3-D card  ---------- */
const NotifCard = ({ id, message, type, duration, onRemove }) => {
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setExit(true);
      setTimeout(onRemove, 300);
    }, duration);
    return () => clearTimeout(t);
  }, [duration, onRemove]);

  const emoji = type === 'success' ? '🎉' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
  const title = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div
      style={{
        ...cardStyles,
        ...(exit ? exitStyles : {}),
        '--accent': type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6',
      }}
    >
      <div style={frontStyles}>
        <div style={emojiStyles}>{emoji}</div>
        <div style={textStyles}>
          <div style={titleStyles}>{title}</div>
          <div style={msgStyles}>{message}</div>
        </div>
        <button style={closeStyles} onClick={() => setExit(true)}>✕</button>
      </div>

      {/* progress bar */}
      <div style={progressStyles}>
        <div
          style={{
            ...barStyles,
            background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6',
            animation: `shrink ${duration}ms linear forwards`,
          }}
        />
      </div>

      <style>{`
        @keyframes shrink {
          to { transform: scaleX(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-60px) rotateX(-25deg); }
          to { opacity: 1; transform: translateY(0) rotateX(0); }
        }
        @keyframes slideOut {
          to { opacity: 0; transform: translateX(120px) rotateY(45deg); }
        }
      `}</style>
    </div>
  );
};

/* ----------  portal  ---------- */
const Portal = ({ children }) => {
  const [el, setEl] = useState(null);
  useEffect(() => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    setEl(div);
    return () => document.body.removeChild(div);
  }, []);
  return el ? ReactDOM.createPortal(children, el) : null;
};

/* ----------  styles  ---------- */
const portalStyles = {
  position: 'fixed',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  pointerEvents: 'none',
};

const cardStyles = {
  position: 'relative',
  width: '340px',
  padding: '16px',
  borderRadius: '16px',
  background: 'rgba(255,255,255,0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  pointerEvents: 'auto',
  animation: 'slideIn 0.4s ease-out',
  transformStyle: 'preserve-3d',
  color: '#333',
  fontFamily: `'Poppins', sans-serif`,
};

const exitStyles = {
  animation: 'slideOut 0.3s ease-in forwards',
};

const frontStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const emojiStyles = {
  fontSize: '28px',
};

const textStyles = {
  flex: 1,
};

const titleStyles = {
  fontWeight: 600,
  fontSize: '15px',
  marginBottom: '2px',
  color: 'var(--accent)',
};

const msgStyles = {
  fontSize: '14px',
  opacity: 0.9,
};

const closeStyles = {
  background: 'none',
  border: 'none',
  fontSize: '18px',
  opacity: 0.6,
  cursor: 'pointer',
  transition: 'opacity 0.2s',
};

const progressStyles = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '3px',
  background: 'rgba(0,0,0,0.1)',
  borderRadius: '0 0 16px 16px',
  overflow: 'hidden',
};

const barStyles = {
  height: '100%',
  transformOrigin: 'left',
};