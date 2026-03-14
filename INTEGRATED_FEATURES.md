# 🚀 SecureKey: Integrated Features & Latest Updates

SecureKey is a state-of-the-art **Secure API Credential Lifecycle & Usage Monitoring Platform** built on the MERN stack. It bridges the gap between static secret storage and active runtime observability.

---

## 💎 Core Integrated Features

### 1. 🔐 High-Security Credential Vault
*   **AES-256-GCM Encryption**: All API keys are encrypted at rest using industry-standard GCM mode, providing both confidentiality and data integrity.
*   **Zero-Exposure Workflow**: Keys are only decrypted in volatile memory during proxy execution. They are never sent to the client-side or stored in plain text.
*   **Master Key Management**: Centralized vault service logic ensures consistent cryptographic enforcement across the entire application.

### 2. 🌉 Transparent Proxy Bridge
*   **Runtime Intermediation**: Developers route requests through `host/api/external-usage/proxy/:id`. SecureKey injects the decrypted secret into headers and forwards the request.
*   **Provider Agnostic**: Out-of-the-box support for **OpenAI, Google Gemini, Groq, AWS, and Stripe**, plus a "Custom" provider option.
*   **Proxy Test Tool**: A built-in dashboard utility to verify connectivity and credential validity without writing a single line of code.

### 3. 📊 Precision Analytics & Observability
*   **Real-time Telemetry**: Automatic tracking of **latency (ms)**, **status codes**, and **endpoint heatmaps** for every proxied call.
*   **Usage Distribution**: Visual charts showing API consumption trends across different providers and timeframes.
*   **Error Surveillance**: Instant identification of service degradation (5xx) or authentication failures (4xx) from external providers.

### 4. 🛡️ Identity & Access Governance
*   **Role-Based Access Control (RBAC)**: Distinct permissions for `Users` (managing their own keys) and `Admins` (global oversight).
*   **Audit Logging**: Every sensitive action—from login attempts to credential access—is timestamped and logged with user ID and IP address.
*   **OAuth 2.0 Integration**: Seamless account linking with **Google, GitHub, and OpenAI** for simplified authentication.

### 5. 🚦 Security Enforcement
*   **API Rate Limiting**: Granular control over usage with per-key limits (Requests per Minute/Day) to prevent cost overruns.
*   **Threat Detection**: Backend logic to flag suspicious activity, such as unusual IP access or volumetric spikes.
*   **Live Alerts**: A dedicated Security Center for users to view and manage system-generated safety notifications.

---

## 🎨 Design & User Experience
*   **Glassmorphism UI**: A premium, modern dark-mode interface using tailored gradients, blur effects, and Lucide icons.
*   **Interactive Documentation**: A dedicated "Docs" page explaining how to integrate the Proxy Bridge into external Python/Node.js applications.
*   **Responsive Analytics**: Dynamic dashboards that adapt to mobile and desktop views.

---

## 🔄 Recent Updates & Enhancements
- ✅ **AI Behavioral Analysis (Machine Learning)**: Integrated a simulated ML threat pipeline into the Analytics dashboard to track Geolocation Anomalies, Volume Spikes, and Data Exfiltration Risks in real-time.
- ✅ **System Audit Trails (Control Plane)**: Introduced a unified logging dashboard. You can now toggle between API Data Traffic and detailed System Audit logs (logins, key rotations, IP accesses) for true enterprise compliance.
- ✅ **Infrastructure Health Score**: Dynamic dashboard gauge that audits your security posture in real-time.
- ✅ **IP Whitelisting**: Granular control to restrict API proxy usage to specific IP addresses.
- ✅ **Expiration & Rotation Tracking**: Automated tracking of key ages with JIT expiration enforcement in the proxy.
- ✅ **Enhanced Proxy Handling**: Improved the proxy bridge to handle non-JSON responses and various HTTP methods (POST, GET, PATCH).
- ✅ **Status Tracking**: Introduced active/inactive/revoked status states for all credentials with visual indicators.

---

## 🗺️ Roadmap: V3.0 (Upcoming)
*   **ML Anomaly Engine**: Using Isolation Forests to detect "unusual" API behavior automatically.
*   **GitHub Token Scanning**: Automated scanning of public repositories to prevent credential leaks.
*   **Edge Proxies**: Deploying the bridge to Cloudflare Workers for sub-10ms global latency.
*   **Auto-Rotation**: Automated key rotation for cloud providers like AWS and GCP.

---
**SecureKey** - *The future of secure API observability.*
