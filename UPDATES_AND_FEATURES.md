# SecureKey: Project Updates & Integrated Features 🚀

SecureKey has evolved into a comprehensive **Secure API Credential Lifecycle & Usage Monitoring Platform**. This document outlines the core architecture, security implementations, and feature sets currently integrated into the system.

## 🛠 Project Overview
SecureKey is a MERN-stack application (MongoDB, Express, React, Node.js) designed to unify the management of third-party API keys (OpenAI, AWS, Gemini, etc.) while providing real-time observability and security enforcement.

---

## 🔐 Core Security Features

### 1. Zero-Exposure Vaulting (AES-256-GCM)
*   **Encrypted Storage**: Credentials are never stored in plain text. They are encrypted using industry-standard **AES-256-GCM** before hitting the database.
*   **Decryption at Runtime**: Keys are only decrypted in volatile memory during the exact moment they are needed for a proxy request, minimizing the attack surface.
*   **Vault Service**: Centralized `vaultService.js` handles all cryptographic operations, ensuring consistency and security.

### 2. Role-Based Access Control (RBAC)
*   **Identity Management**: Distinct roles (e.g., `user`, `admin`) govern access to features.
*   **Admin Dashboard**: Restricted portal for managing system-wide users, viewing global security stats, and auditing platform health.
*   **Middleware Enforcement**: Native RBAC middleware protects sensitive API routes backend-side.

### 3. Threat Detection & Security Alerts
*   **Suspicious Activity Monitoring**: Automatically flags unusual usage patterns or unauthorized access attempts.
*   **Security Notification System**: Real-time alerts displayed on the frontend to notify users of potential breaches or credential expiry.
*   **IP Logging**: Every credential access and proxy call is logged with the originating IP for forensic analysis.

---

## 📊 Monitoring & Observability

### 1. Transparent Proxy Bridge
*   **Secure Intermediation**: Developers route API calls through `/api/external-usage/proxy/:id`. The server injects the decrypted secret into the request header and forwards it to the provider.
*   **Live Telemetry**: Automatically records latency, status codes (2xx, 4xx, 5xx), and endpoint usage for every forward-proxied request.

### 2. Advanced Analytics Dashboard
*   **Provider Distribution**: Visual breakdown of which cloud providers (e.g., Groq, OpenAI) are used most.
*   **Latency Trends**: Heatmaps and line charts showing API performance over time.
*   **Error Rate Surveillance**: Monitoring of failure rates to detect service degradation or misuse.

### 3. API Rate Limiting
*   **Threshold Management**: Define per-key limits for requests-per-minute and requests-per-day.
*   **Enforcement**: The Proxy bridge automatically validates usage against these thresholds before forwarding calls, preventing unexpected cost overruns.

### 4. Audit Logging
*   **Comprehensive Trails**: Every critical action—login, role change, credential creation—is recorded in the `AuditLog` collection.
*   **Traceability**: Each log entry links the actor, action, timestamp, and target resource.

---

## 🎨 User Experience (UX)

### 1. Modern Glassmorphism UI
*   **Aesthetic Design**: Sleek, dark-mode-first interface using tailored CSS gradients and Lucide icons.
*   **Dynamic Components**: Interactive charts, hover effects, and responsive glass-layered card layouts.

### 2. Multi-Platform OAuth Integration
*   **Simplified Onboarding**: Link existing accounts from Google, GitHub, or OpenAI using OIDC.
*   **Centralized Identity**: Manage all external provider connections from a single unified profile page.

### 3. Interactive Documentation
*   **Developer Portal**: Built-in documentation page teaching users how to use the Proxy API and integrate SecureKey into their own workflows.

---

## 🚀 Recent Updates (V2.5)
- **Infrastructure Health Score**: Added a dynamic gauge in the dashboard that analyzes credential restrictions and expiration to provide a global security score.
- **IP Whitelisting**: Implemented per-credential IP restrictions. The Proxy Bridge now validates the caller's IP against the whitelist before forwarding requests.
- **Expiration Tracking**: Added JIT enforcement for key rotation. Expired keys are automatically blocked at the proxy level.
- **Enhanced Error Handling**: Improved proxy response parsing to handle non-JSON responses gracefully.

---
**SecureKey** - *Empowering developers with unified API security and observability.*
