import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

let nextId = 0;

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback(({ message, type = 'success', icon, duration = 5000 }) => {
        const id = ++nextId;
        setNotifications(prev => [...prev, { id, message, type, icon }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, duration);
    }, []);

    const remove = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <NotificationContainer notifications={notifications} onRemove={remove} />
        </NotificationContext.Provider>
    );
}

export const useNotification = () => useContext(NotificationContext);

/* ── Floating container ──────────────────────────────────── */
const TYPE_STYLES = {
    success: { bg: 'linear-gradient(135deg,#28a745,#4ECDC4)', icon: <i className="bi bi-check-circle-fill" /> },
    badge:   { bg: 'linear-gradient(135deg,#9B59B6,#FFD93D)', icon: <i className="bi bi-trophy-fill" /> },
    points:  { bg: 'linear-gradient(135deg,#FF6B6B,#FF8E53)', icon: <i className="bi bi-star-fill" /> },
    info:    { bg: 'linear-gradient(135deg,#45B7D1,#4ECDC4)', icon: <i className="bi bi-info-circle-fill" /> },
    warning: { bg: 'linear-gradient(135deg,#FFD93D,#FF8E53)', icon: <i className="bi bi-exclamation-triangle-fill" /> }
};

function NotificationContainer({ notifications, onRemove }) {
    if (notifications.length === 0) return null;
    return (
        <div
            style={{
                position: 'fixed',
                top: 80,
                right: 20,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                maxWidth: 340,
                pointerEvents: 'none'
            }}
        >
            {notifications.map(n => (
                <NotificationToast key={n.id} notification={n} onRemove={onRemove} />
            ))}
        </div>
    );
}

function NotificationToast({ notification, onRemove }) {
    const { id, message, type, icon } = notification;
    const style = TYPE_STYLES[type] || TYPE_STYLES.success;

    return (
        <div
            className="d-flex align-items-start gap-2 p-3 rounded-4 text-white shadow"
            style={{
                background: style.bg,
                animation: 'slideIn .3s ease',
                pointerEvents: 'all',
                cursor: 'default'
            }}
        >
            <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{icon || style.icon}</span>
            <span className="fw-semibold small flex-grow-1" style={{ lineHeight: 1.4 }}>{message}</span>
            <button
                className="btn-close btn-close-white btn-sm ms-1"
                style={{ flexShrink: 0 }}
                onClick={() => onRemove(id)}
            />
        </div>
    );
}
