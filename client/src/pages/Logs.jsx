import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, Calendar, ChevronLeft, ChevronRight, Activity, Shield } from 'lucide-react';
import api from '../api';

const Logs = () => {
    const [activeTab, setActiveTab] = useState('traffic'); // 'traffic' or 'audit'
    const [trafficLogs, setTrafficLogs] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const [trafficRes, auditRes] = await Promise.all([
                api.get('/usage/stats'),
                api.get('/security/audit-logs')
            ]);
            setTrafficLogs(trafficRes.data.logs || []);
            setAuditLogs(auditRes.data || []);
        } catch (err) {
            console.error('Error fetching logs', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (code) => {
        if (code >= 200 && code < 300) return '#10b981';
        if (code >= 400 && code < 500) return '#f97316';
        if (code >= 500) return '#ef4444';
        return '#94a3b8';
    };

    const getAuditActionColor = (action) => {
        if (action.includes('delete') || action.includes('fail')) return '#ef4444';
        if (action.includes('create') || action.includes('login') || action.includes('add')) return '#10b981';
        if (action.includes('update') || action.includes('rotate')) return '#3b82f6';
        return '#f97316';
    };

    const exportLogs = () => {
        const dataToExport = activeTab === 'traffic' ? trafficLogs : auditLogs;
        const filename = activeTab === 'traffic' ? 'api_traffic_logs.json' : 'system_audit_logs.json';
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataToExport))}`;
        const link = document.createElement("a");
        link.setAttribute("href", jsonString);
        link.setAttribute("download", filename);
        link.click();
    };

    // Filter Logic
    const currentData = activeTab === 'traffic' ? trafficLogs : auditLogs;
    const filteredData = currentData.filter(log => {
        const term = searchTerm.toLowerCase();
        if (activeTab === 'traffic') {
            return log.endpoint.toLowerCase().includes(term) || log.method.toLowerCase().includes(term) || log.ipAddress?.includes(term);
        } else {
            return log.action.toLowerCase().includes(term) || log.resourceType?.toLowerCase().includes(term) || log.ipAddress?.includes(term);
        }
    });

    const paginatedData = filteredData.slice((page - 1) * 15, page * 15);

    return (
        <div className="logs-page">
            <div className="page-header">
                <div>
                    <h1>Activity Logs</h1>
                    <p className="text-dim">Comprehensive history of API traffic and system audit events</p>
                </div>
                <div className="header-actions">
                    <button className="btn-outline" onClick={exportLogs}>
                        <Download size={18} /> Export JSON
                    </button>
                    <button className="btn-primary" onClick={fetchLogs}>Refresh</button>
                </div>
            </div>

            <div className="logs-content">
                {/* Custom Tabs */}
                <div className="tabs-container" style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                        className={`tab-btn ${activeTab === 'traffic' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('traffic'); setPage(1); setSearchTerm(''); }}
                        style={{ background: 'transparent', border: 'none', color: activeTab === 'traffic' ? '#00f2fe' : '#94a3b8', padding: '10px 20px', cursor: 'pointer', borderBottom: activeTab === 'traffic' ? '2px solid #00f2fe' : 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
                    >
                        <Activity size={18} /> API Traffic
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('audit'); setPage(1); setSearchTerm(''); }}
                        style={{ background: 'transparent', border: 'none', color: activeTab === 'audit' ? '#00f2fe' : '#94a3b8', padding: '10px 20px', cursor: 'pointer', borderBottom: activeTab === 'audit' ? '2px solid #00f2fe' : 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
                    >
                        <Shield size={18} /> System Audit
                    </button>
                </div>

                <div className="toolbar glass">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder={activeTab === 'traffic' ? "Search by endpoint, method, or IP..." : "Search by action, resource, or IP..."}
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        />
                    </div>
                    <div className="filters">
                        <button className="filter-btn"><Calendar size={18} /> Last 24h</button>
                        <button className="filter-btn"><Filter size={18} /> Filters</button>
                    </div>
                </div>

                <div className="logs-container glass">
                    <table className="logs-table">
                        <thead>
                            {activeTab === 'traffic' ? (
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Method</th>
                                    <th>Endpoint</th>
                                    <th>Status</th>
                                    <th>Response Time</th>
                                    <th>IP Address</th>
                                </tr>
                            ) : (
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Action</th>
                                    <th>Resource Hub</th>
                                    <th>Details</th>
                                    <th>IP Address</th>
                                </tr>
                            )}
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={activeTab === 'traffic' ? "6" : "5"} className="loading-row">Loading logs...</td></tr>
                            ) : paginatedData.length === 0 ? (
                                <tr><td colSpan={activeTab === 'traffic' ? "6" : "5"} className="empty-row">No logs found</td></tr>
                            ) : (
                                paginatedData.map((log) => (
                                    activeTab === 'traffic' ? (
                                        <tr key={log._id}>
                                            <td className="timestamp">{new Date(log.timestamp).toLocaleString()}</td>
                                            <td>
                                                <span className={`method-badge ${log.method.toLowerCase()}`}>
                                                    {log.method}
                                                </span>
                                            </td>
                                            <td className="endpoint"><code>{log.endpoint}</code></td>
                                            <td>
                                                <span className="status-dot" style={{ backgroundColor: getStatusColor(log.statusCode) }}></span>
                                                {log.statusCode || 200}
                                            </td>
                                            <td>{log.responseTime}ms</td>
                                            <td className="ip-cell">{log.ipAddress || '127.0.0.1'}</td>
                                        </tr>
                                    ) : (
                                        <tr key={log._id}>
                                            <td className="timestamp">{new Date(log.timestamp).toLocaleString()}</td>
                                            <td>
                                                <span style={{ color: getAuditActionColor(log.action), fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                                                    {log.action.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td><code style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>{log.resourceType || 'system'}</code></td>
                                            <td className="text-dim" style={{ fontSize: '0.85rem' }}>{log.details ? JSON.stringify(log.details) : 'N/A'}</td>
                                            <td className="ip-cell">{log.ipAddress || 'Unknown'}</td>
                                        </tr>
                                    )
                                ))
                            )}
                        </tbody>
                    </table>

                    <div className="pagination">
                        <span className="page-info">Showing {paginatedData.length} of {filteredData.length} entries</span>
                        <div className="page-controls">
                            <button disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft size={18} /></button>
                            <span className="current-page">{page}</span>
                            <button disabled={page >= Math.ceil(filteredData.length / 15) || filteredData.length === 0} onClick={() => setPage(page + 1)}><ChevronRight size={18} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Logs;
