import React, { useState, useEffect } from 'react';
import { BarChart3, Activity, PieChart, Clock, Database, Globe, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '../api';

const ExternalAnalytics = () => {
    const [data, setData] = useState({ providers: [], trends: { volumeIncrease: "0", todayTotal: 0, errorRate: "0" } });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await api.get('/external-usage/stats');
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const providers_total = data.providers.reduce((acc, c) => acc + c.count, 0) || 1;

    return (
        <div className="external-analytics-page credentials-page">
            <header className="page-header">
                <div>
                    <h1>External API Analytics</h1>
                    <p>Cross-platform usage monitoring and provider telemetry</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div className="status-badge active pulse">LIVE MONITORING</div>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card glass">
                    <Activity size={24} color="#00f2fe" />
                    <div className="stat-info">
                        <span className="stat-label">Total Cloud Requests</span>
                        <span className="stat-value">{providers_total === 1 && data.providers.length === 0 ? 0 : providers_total}</span>
                    </div>
                </div>
                <div className="stat-card glass">
                    <Globe size={24} color="#4facfe" />
                    <div className="stat-info">
                        <span className="stat-label">System-Wide Latency</span>
                        <span className="stat-value">
                            {Math.round(data.providers.reduce((acc, c) => acc + (c.avgResponseTime * c.count), 0) / providers_total)}ms
                        </span>
                    </div>
                </div>
                <div className="stat-card glass">
                    <Database size={24} color="#a855f7" />
                    <div className="stat-info">
                        <span className="stat-label">Active Provider Nodes</span>
                        <span className="stat-value">{data.providers.length}</span>
                    </div>
                </div>
            </div>

            <div className="analytics-main-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', marginTop: '30px' }}>
                <div className="platform-breakdown glass">
                    <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                        <PieChart size={20} color="#00f2fe" />
                        <h3>Distribution by Platform</h3>
                    </div>

                    <div className="health-metrics">
                        {loading ? (
                            <p>Calculating Distribution...</p>
                        ) : data.providers.length === 0 ? (
                            <div className="empty-state">No cloud telemetry recorded.</div>
                        ) : (
                            data.providers.map(plat => (
                                <div key={plat._id} className="health-item" style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontWeight: '600', textTransform: 'uppercase' }}>{plat._id}</span>
                                            <span className="text-dim">({plat.count} req)</span>
                                        </div>
                                        <span style={{ fontWeight: '700' }}>
                                            {Math.round(plat.avgResponseTime)}ms
                                        </span>
                                    </div>
                                    <div className="health-bar-container">
                                        <div
                                            className="health-bar"
                                            style={{
                                                width: `${(plat.count / providers_total) * 100}%`,
                                                background: plat._id === 'openai' ? '#10a37f' : '#4facfe'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="recent-telemetry-card glass">
                    <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                        <Clock size={20} color="#ef4444" />
                        <h3>Trend Indicators (24h)</h3>
                    </div>
                    <div className="trend-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div className="trend-item glass" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p className="text-dim" style={{ fontSize: '0.8rem' }}>Daily Consumption</p>
                                <span style={{ fontWeight: '600' }}>{data.trends.volumeIncrease}% Vol</span>
                            </div>
                            {parseFloat(data.trends.volumeIncrease) >= 0 ? <ArrowUpRight color="#10b981" /> : <ArrowDownRight color="#ef4444" />}
                        </div>
                        <div className="trend-item glass" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p className="text-dim" style={{ fontSize: '0.8rem' }}>Failure Rate</p>
                                <span style={{ fontWeight: '600' }}>{data.trends.errorRate}% Errors</span>
                            </div>
                            {parseFloat(data.trends.errorRate) > 5 ? <ArrowUpRight color="#ef4444" /> : <ArrowDownRight color="#10b981" />}
                        </div>
                    </div>
                </div>
            </div>

            <div className="provider-health glass" style={{ marginTop: '30px', padding: '25px' }}>
                <h3>Global Provider Status</h3>
                <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                    {data.providers.length > 0 ? data.providers.map(p => (
                        <div key={p._id} className="glass" style={{ padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="pulse" style={{ width: '8px', height: '8px', background: p.errors / p.count > 0.1 ? '#f59e0b' : '#10b981' }}></div>
                            <span style={{ fontSize: '0.9rem', fontWeight: '500', textTransform: 'capitalize' }}>{p._id} {p.errors / p.count > 0.1 ? 'Degraded' : 'Stable'}</span>
                        </div>
                    )) : (
                        <p className="text-dim">No providers active in current telemetry cycle.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExternalAnalytics;
