import React from 'react';
import { Book, Code, Lock, Server, Globe, Cpu } from 'lucide-react';

const Docs = () => {
    return (
        <div className="docs-page">
            <header className="page-header">
                <h1>API Documentation</h1>
                <p>Learn how to integrate our security services into your application.</p>
            </header>

            <div className="docs-grid">
                <section className="docs-section glass">
                    <div className="section-header">
                        <Lock className="icon-primary" />
                        <h2>Authentication</h2>
                    </div>
                    <p>All API requests must include your API key in the <code>X-API-KEY</code> header.</p>
                    <div className="code-block">
                        <pre>
                            {`curl -X GET https://api.securekey.com/v1/data \\
  -H "X-API-KEY: your_api_key_here"`}
                        </pre>
                    </div>
                </section>

                <section className="docs-section glass">
                    <div className="section-header">
                        <Server className="icon-secondary" />
                        <h2>Base URL</h2>
                    </div>
                    <p>Production environment base URL:</p>
                    <div className="code-block">
                        <code>https://api.securekey.com/v1</code>
                    </div>
                </section>

                <section className="docs-section glass card-full">
                    <div className="section-header">
                        <Code className="icon-accent" />
                        <h2>Endpoints</h2>
                    </div>

                    <div className="endpoint-item">
                        <div className="endpoint-meta">
                            <span className="method-get">GET</span>
                            <span className="path">/user/profile</span>
                        </div>
                        <p>Retrieve the profile information associated with the API key.</p>
                    </div>

                    <div className="endpoint-item">
                        <div className="endpoint-meta">
                            <span className="method-post">POST</span>
                            <span className="path">/data/process</span>
                        </div>
                        <p>Submit data for secure processing and analysis.</p>
                    </div>

                    <div className="endpoint-item">
                        <div className="endpoint-meta">
                            <span className="method-get">GET</span>
                            <span className="path">/analytics/usage</span>
                        </div>
                        <p>Get real-time usage statistics for the current key.</p>
                    </div>
                </section>

                <section className="docs-section glass">
                    <div className="section-header">
                        <Globe className="icon-warning" />
                        <h2>Rate Limits</h2>
                    </div>
                    <p>Default rate limits for Standard keys:</p>
                    <ul>
                        <li>1,000 requests per minute</li>
                        <li>5,000 requests per hour</li>
                    </ul>
                </section>

                <section className="docs-section glass">
                    <div className="section-header">
                        <Cpu className="icon-success" />
                        <h2>Error Codes</h2>
                    </div>
                    <table className="docs-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>401</td><td>Unauthorized (Invalid API Key)</td></tr>
                            <tr><td>403</td><td>Forbidden (IP Blocked)</td></tr>
                            <tr><td>429</td><td>Too Many Requests</td></tr>
                            <tr><td>500</td><td>Internal Server Error</td></tr>
                        </tbody>
                    </table>
                </section>
            </div>

        </div>
    );
};

export default Docs;

