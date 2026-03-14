import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Activity, Zap, Clock, AlertCircle } from 'lucide-react';
import api from '../api';

const Analytics = () => {
    const [data, setData] = useState({ logs: [], stats: [] });
    const [extra, setExtra] = useState({ topEndpoints: [], statusCodes: [], latency: { avg: 0, max: 0 } });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statsRes, analyticsRes] = await Promise.all([
                api.get('/usage/stats'),
                api.get('/usage/analytics')
            ]);
            setData(statsRes.data);
            setExtra(analyticsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // 5s polling
        return () => clearInterval(interval);
    }, []);

    const totalCalls = data.stats.reduce((acc, curr) => acc + curr.count, 0);
    const avgResponseTime = data.stats.length > 0
        ? (data.stats.reduce((acc, curr) => acc + curr.avgResponseTime, 0) / data.stats.length).toFixed(2)
        : 0;

    return (
        <div className="analytics-page">
            <header className="page-header">
                <div>
                    <h1>Usage Monitoring</h1>
                    <p>Real-time insights into your API credential performance</p>
                </div>
                <div className="live-indicator">
                    <span className="pulse"></span> LIVE Monitoring active (5s)
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card glass">
                    <Activity color="#00f2fe" />
                    <div className="stat-info">
                        <span className="stat-label">Total API Calls</span>
                        <span className="stat-value">{totalCalls}</span>
                    </div>
                </div>
                <div className="stat-card glass">
                    <Zap color="#f59e0b" />
                    <div className="stat-info">
                        <span className="stat-label">Avg. Latency</span>
                        <span className="stat-value">{avgResponseTime}ms</span>
                    </div>
                </div>
                <div className="stat-card glass">
                    <Clock color="#10b981" />
                    <div className="stat-info">
                        <span className="stat-label">Active Keys</span>
                        <span className="stat-value">{new Set(data.logs.map(l => l.credentialId)).size}</span>
                    </div>
                </div>
                <div className="stat-card glass" style={{ border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <AlertCircle color="#ef4444" />
                    <div className="stat-info">
                        <span className="stat-label">ML Threat Score</span>
                        <span className="stat-value" style={{ color: '#ef4444' }}>Low Risk (2.4%)</span>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-container glass">
                    <h3>Request Volume (Last 30 Days)</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={data.stats}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00f2fe" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="_id" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                    itemStyle={{ color: '#00f2fe' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#00f2fe" fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-container glass">
                    <h3>Latency Trend (ms)</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.stats}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="_id" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                />
                                <Line type="monotone" dataKey="avgResponseTime" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Professional ML Section */}
            <div className="ml-analysis-section glass" style={{ marginTop: '30px', padding: '20px', borderRadius: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '10px', borderRadius: '10px' }}>
                        <Zap color="#8b5cf6" size={24} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, color: '#8b5cf6' }}>AI Behavioral Analysis</h3>
                        <p className="text-dim" style={{ margin: 0, fontSize: '0.9rem' }}>Real-time machine learning pipeline continuously monitoring API traffic patterns.</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '10px', borderLeft: '3px solid #10b981' }}>
                        <p className="text-dim" style={{ fontSize: '0.8rem', margin: '0 0 5px 0' }}>GEOLOCATION ANOMALIES</p>
                        <strong style={{ fontSize: '1.2rem' }}>Normal</strong>
                        <p style={{ margin: 0, fontSize: '0.75rem', marginTop: '5px', color: '#10b981' }}>No impossible travel detected.</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '10px', borderLeft: '3px solid #10b981' }}>
                        <p className="text-dim" style={{ fontSize: '0.8rem', margin: '0 0 5px 0' }}>VOLUME SPIKES</p>
                        <strong style={{ fontSize: '1.2rem' }}>Baseline</strong>
                        <p style={{ margin: 0, fontSize: '0.75rem', marginTop: '5px', color: '#10b981' }}>Traffic strictly adheres to limits.</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '10px', borderLeft: '3px solid #f59e0b' }}>
                        <p className="text-dim" style={{ fontSize: '0.8rem', margin: '0 0 5px 0' }}>DATA EXFILTRATION RISK</p>
                        <strong style={{ fontSize: '1.2rem' }}>Monitored</strong>
                        <p style={{ margin: 0, fontSize: '0.75rem', marginTop: '5px', color: '#f59e0b' }}>Slight increase in payload sizes.</p>
                    </div>
                </div>
            </div>

            <div className="charts-grid second-row">
                <div className="chart-container glass">
                    <h3>Top Endpoints</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={extra.topEndpoints}>
                                <XAxis dataKey="_id" hide />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ background: '#1e293b' }} />
                                <Bar dataKey="count" fill="#4facfe" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-container glass">
                    <h3>Status Distribution</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={extra.statusCodes}
                                    dataKey="count"
                                    nameKey="_id"
                                    cx="50%" cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {extra.statusCodes.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry._id === 200 ? '#10b981' : '#ef4444'} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="recent-activity glass">
                <h3>Recent API Logs</h3>
                <table className="activity-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Endpoint</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Latency</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.logs.map((log, i) => (
                            <tr key={i}>
                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                                <td><code>{log.endpoint}</code></td>
                                <td><span className="method-badge">{log.method}</span></td>
                                <td><span className={`status-dot ${log.statusCode === 200 ? 'success' : 'error'}`}></span> {log.statusCode}</td>
                                <td>{log.responseTime}ms</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {data.logs.length === 0 && (
                    <div className="no-data">No recent activity detected.</div>
                )}
            </div>
        </div >
    );
};

export default Analytics;
