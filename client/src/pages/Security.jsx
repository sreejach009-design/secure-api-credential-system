import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Info, CheckCircle2, MoreVertical, Trash2, Filter, Bell } from 'lucide-react';
import api from '../api';
import { useAlert } from '../context/AlertContext';


const Security = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const { showAlert } = useAlert();


    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const res = await api.get('/security');
            setAlerts(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching alerts', err);
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/security/${id}/status`, { status });
            setAlerts(alerts.map(a => a._id === id ? { ...a, status } : a));
            showAlert(`Alert marked as ${status}`, 'success');
        } catch (err) {
            showAlert('Failed to update alert', 'error');
            console.error('Error updating status', err);
        }

    };

    const deleteAlert = (id) => {
        // Mock delete
        setAlerts(alerts.filter(a => a._id !== id));
        showAlert('Alert hidden', 'info');
    };


    const filteredAlerts = alerts.filter(alert => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'unread') return alert.status === 'unread';
        if (activeFilter === 'high') return alert.severity === 'high' || alert.severity === 'critical';
        return true;
    });

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return '#ef4444';
            case 'high': return '#f97316';
            case 'medium': return '#eab308';
            default: return '#3b82f6';
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'revoked_key_usage': return <AlertTriangle color="#ef4444" size={20} />;
            case 'expired_key_usage': return <AlertTriangle color="#f97316" size={20} />;
            case 'high_usage': return <Bell color="#3b82f6" size={20} />;
            default: return <Info color="#94a3b8" size={20} />;
        }
    };

    return (
        <div className="security-page">
            <div className="page-header">
                <div>
                    <h1>Security Alerts</h1>
                    <p className="text-dim">Monitor suspicious activities and access attempts</p>
                </div>
                <div className="header-actions">
                    <button className="btn-outline" onClick={() => setActiveFilter('unread')}>
                        <Bell size={18} /> {alerts.filter(a => a.status === 'unread').length} Unread
                    </button>
                    <button className="btn-primary" onClick={fetchAlerts}>Refresh</button>
                </div>
            </div>

            <div className="security-content">
                <div className="filter-bar glass">
                    <button
                        className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('all')}
                    >All Alerts</button>
                    <button
                        className={`filter-btn ${activeFilter === 'unread' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('unread')}
                    >Unread</button>
                    <button
                        className={`filter-btn ${activeFilter === 'high' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('high')}
                    >High Priority</button>
                </div>

                {loading ? (
                    <div className="loading-state">Loading alerts...</div>
                ) : filteredAlerts.length === 0 ? (
                    <div className="empty-state glass">
                        <Shield size={48} className="text-dim" />
                        <h3>No Security Alerts</h3>
                        <p>Your system is performing securely. No suspicious activity detected.</p>
                    </div>
                ) : (
                    <div className="alerts-list">
                        {filteredAlerts.map(alert => (
                            <div key={alert._id} className={`alert-card glass ${alert.status === 'unread' ? 'unread' : ''}`}>
                                <div className="alert-severity" style={{ backgroundColor: getSeverityColor(alert.severity) }}></div>
                                <div className="alert-icon-container">
                                    {getIcon(alert.type)}
                                </div>
                                <div className="alert-details">
                                    <div className="alert-title-row">
                                        <h4>{alert.message}</h4>
                                        <span className="alert-time">{new Date(alert.timestamp).toLocaleString()}</span>
                                    </div>
                                    <div className="alert-meta">
                                        <span><strong>IP:</strong> {alert.ipAddress}</span>
                                        <span><strong>Type:</strong> {alert.type.replace(/_/g, ' ')}</span>
                                        <span className={`severity-tag ${alert.severity}`}>{alert.severity}</span>
                                    </div>
                                </div>
                                <div className="alert-actions">
                                    {alert.status === 'unread' ? (
                                        <button onClick={() => updateStatus(alert._id, 'read')} title="Mark as Read">
                                            <CheckCircle2 size={18} />
                                        </button>
                                    ) : (
                                        <button className="text-dim"><CheckCircle2 size={18} /></button>
                                    )}
                                    <button onClick={() => deleteAlert(alert._id)} className="delete-btn">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Security;
