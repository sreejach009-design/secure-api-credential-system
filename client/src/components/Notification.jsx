import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlert } from '../context/AlertContext';
import { CheckCircle2, AlertCircle, XCircle, Info, X } from 'lucide-react';

const Notification = () => {
    const { alerts, removeAlert } = useAlert();

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="alert-icon success" size={20} />;
            case 'error': return <XCircle className="alert-icon error" size={20} />;
            case 'warning': return <AlertCircle className="alert-icon warning" size={20} />;
            default: return <Info className="alert-icon info" size={20} />;
        }
    };

    return (
        <div className="notification-container">
            <AnimatePresence>
                {alerts.map((alert) => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: 100, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.9, transition: { duration: 0.2 } }}
                        className={`notification-item glass ${alert.type}`}
                    >
                        <div className="notification-content">
                            {getIcon(alert.type)}
                            <span className="notification-message">{alert.message}</span>
                        </div>
                        <button className="notification-close" onClick={() => removeAlert(alert.id)}>
                            <X size={16} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default Notification;
