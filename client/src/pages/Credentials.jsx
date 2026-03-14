import React, { useState, useEffect } from 'react';
import { Plus, Key, RefreshCw, Trash2, Copy, Check, ShieldAlert, ShieldCheck, Clock, ShieldOff } from 'lucide-react';

import { format } from 'date-fns';
import api from '../api';
import { useAlert } from '../context/AlertContext';


const Credentials = () => {
    const [credentials, setCredentials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState('');
    const [newExpires, setNewExpires] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const { showAlert } = useAlert();


    useEffect(() => {
        fetchCredentials();
    }, []);

    const fetchCredentials = async () => {
        try {
            const res = await api.get('/credentials');
            setCredentials(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const createCredential = async (e) => {
        e.preventDefault();
        try {
            const payload = { name: newName };
            if (newExpires) payload.expiresAt = newExpires;
            const res = await api.post('/credentials', payload);
            setCredentials([res.data, ...credentials]);
            setShowCreate(false);
            setNewName('');
            setNewExpires('');
            showAlert('API Key generated successfully', 'success');
        } catch (err) {
            console.error(err.response?.data || err);
            const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to generate API key';
            showAlert(`Failed to generate API key: ${msg}`, 'error');
        }

    };

    const rotateKey = async (id) => {
        try {
            const res = await api.put(`/credentials/${id}/rotate`);
            setCredentials(credentials.map(c => c._id === id ? res.data : c));
            showAlert('API Key rotated successfully', 'success');
        } catch (err) {
            showAlert('Failed to rotate API key', 'error');
            console.error(err);
        }

    };

    const deleteCredential = async (id) => {
        try {
            await api.delete(`/credentials/${id}`);
            setCredentials(credentials.filter(c => c._id !== id));
            showAlert('Credential deleted', 'info');
        } catch (err) {
            showAlert('Failed to delete credential', 'error');
            console.error(err);
        }

    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            const res = await api.patch(`/credentials/${id}/status`, { status: newStatus });
            setCredentials(credentials.map(c => c._id === id ? res.data : c));
            showAlert(`Key ${newStatus === 'active' ? 'activated' : 'deactivated'}`, 'info');
        } catch (err) {
            showAlert('Failed to update status', 'error');
            console.error(err);
        }

    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        showAlert('API Key copied to clipboard', 'success', 2000);
        setTimeout(() => setCopiedId(null), 2000);
    };


    return (
        <div className="credentials-page">
            <header className="page-header">
                <div>
                    <h1>API Credentials</h1>
                    <p>Manage and monitor your secure access keys</p>
                </div>
                <button className="btn-primary" onClick={() => setShowCreate(true)}>
                    <Plus size={20} /> Create New Key
                </button>
            </header>

            {showCreate && (
                <div className="modal-overlay">
                    <div className="modal-content glass">
                        <h2>Generate New Key</h2>
                        <form onSubmit={createCredential}>
                            <div className="form-group">
                                <label>Key Name (e.g. Production Mobile App)</label>
                                <input
                                    className="input-field"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    placeholder="Enter name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Expiration Date (Optional)</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={newExpires}
                                    onChange={e => setNewExpires(e.target.value)}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Generate Key</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="credentials-list">
                {loading ? (
                    <div className="loading">Loading keys...</div>
                ) : credentials.length === 0 ? (
                    <div className="empty-state glass">
                        <ShieldAlert size={40} />
                        <p>No credentials found. Create your first API key to get started.</p>
                    </div>
                ) : (
                    credentials.map(cred => (
                        <div key={cred._id} className="credential-card glass">
                            <div className="card-top">
                                <div className="card-info">
                                    <h3>{cred.name}</h3>
                                    <div className="key-display">
                                        <code>{cred.apiKey}</code>
                                        <button className="icon-btn" onClick={() => copyToClipboard(cred.apiKey, cred._id)}>
                                            {copiedId === cred._id ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div className={`status-badge ${cred.status}`}>
                                    {cred.status === 'active' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                                    {cred.status}
                                </div>
                            </div>

                            <div className="card-meta">
                                <div className="meta-item">
                                    <Clock size={14} />
                                    <span>Created: {format(new Date(cred.createdAt), 'MMM dd, yyyy')}</span>
                                </div>
                                {cred.expiresAt && (
                                    <div className="meta-item">
                                        <ShieldAlert size={14} />
                                        <span>Expires: {format(new Date(cred.expiresAt), 'MMM dd, yyyy')}</span>
                                    </div>
                                )}
                                <div className="meta-item">
                                    <RefreshCw size={14} />
                                    <span>Usage: {cred.usageCount} calls</span>
                                </div>
                            </div>

                            <div className="card-actions">
                                <button
                                    className={`btn-action ${cred.status === 'active' ? 'deactivate' : 'activate'}`}
                                    onClick={() => toggleStatus(cred._id, cred.status)}
                                >
                                    {cred.status === 'active' ? (
                                        <>
                                            <ShieldOff size={16} /> Deactivate
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck size={16} /> Activate
                                        </>
                                    )}
                                </button>
                                <button className="btn-action rotate" onClick={() => rotateKey(cred._id)}>
                                    <RefreshCw size={16} /> Rotate
                                </button>
                                <button className="btn-action delete" onClick={() => deleteCredential(cred._id)}>
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Credentials;
