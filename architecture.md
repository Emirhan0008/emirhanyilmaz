# System Architecture & Security Boundary Specification
**Target Application:** Emirhan Yılmaz — AI Systems Engineer & Psychological Counselor Portfolio  
**Audit Standard:** Cloudflare `security-audit-skill` Defensive Methodology  
**Version:** 2.4.0 (Hardened)

---

## 1. Executive Architecture Overview
The application is a full-stack web application with:
1. **Frontend:** React 19 SPA running under Vite with TypeScript, Tailwind CSS, Framer Motion, and dual UI presentation modes (Liquid Glass UX and Hacker PowerShell Terminal Workspace).
2. **Backend API Gateway:** Express.js (`server.ts`) running Node.js / tsx on port 3000, acting as a security proxy, WAF (Web Application Firewall), rate limiter, and authentication guard.
3. **External AI Services:**
   - Google Gemini API (`@google/genai`) for multi-turn assistant queries, CBT psychological reflection, and architecture cost estimation.
   - Groq API (fallback LLM inference) for cat assistant and CBT therapist redundancy.
   - Client keys are strictly isolated; zero API keys or service credentials are leaked to the client bundle.

---

## 2. Trust Boundaries & Network Perimeter

```
                      +---------------------------------------+
                      |          Untrusted Internet           |
                      |   (Browsers, Crawlers, API Clients)   |
                      +---------------------------------------+
                                          |
                                          | HTTPS / HTTP
                                          v
+---------------------------------------------------------------------------------+
| Express.js Security Boundary (server.ts)                                        |
|                                                                                 |
|  [Layer 1: HTTP Defense-in-Depth Headers]                                       |
|   - HSTS, X-Content-Type-Options: nosniff, X-Frame-Options: SAMEORIGIN           |
|   - Hardened CSP (unsafe-eval omitted in production)                            |
|   - Referrer-Policy, Cross-Origin Isolation                                     |
|                                                                                 |
|  [Layer 2: Multi-Tier In-Memory Rate Limiting & GC]                             |
|   - Global API Rate Limiter (45 req/min per IP)                                 |
|   - Admin Brute-Force Lockout (Max 5 attempts / 15 min lock)                    |
|   - Message Spam Guard (Max 4 msgs / 10 min, 4s rapid flood guard)              |
|   - AI Inference Quota Guard (25 queries / min per IP)                          |
|                                                                                 |
|  [Layer 3: Attack Signature WAF & Prototype Pollution Filter]                   |
|   - Recursive prototype key scrubber (__proto__, constructor, prototype)        |
|   - SQL Injection, NoSQL Injection, Command Injection, Path Traversal regex    |
|   - Strict Host & Origin Validation                                             |
|                                                                                 |
|  [Layer 4: Authenticated Endpoints & Session Manager]                           |
|   - Timing-safe constant-time hash comparisons (crypto.timingSafeEqual)         |
|   - Cryptographically random session tokens (crypto.randomBytes(32))            |
|   - IP origin binding & idle/lifetime session expiry                            |
+---------------------------------------------------------------------------------+
          |                                      |                     |
          v                                      v                     v
+----------------------+              +--------------------+   +------------------+
| Server-Side AI Proxy |              | Admin Inbox Store  |   | Static Assets    |
| - Gemini API Client  |              | - In-memory / file |   | - Vite Middleware|
| - Groq API Fallback  |              | - Authenticated    |   | - Public static  |
+----------------------+              +--------------------+   +------------------+
```

---

## 3. Entry Points & Attack Surfaces

| Endpoint / Component | Method | Auth Required | Input Surface | Primary Attack Vectors | Defensive Controls |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/ai-assistant` | POST | No | `prompt: string` | Prompt injection, DoS via oversized payload, ReDoS | Rate limit (25/min), max 1000 chars, control char stripping, lazy client |
| `/api/estimate-project`| POST | No | `projectType`, `complexity`, `features[]` | Injection into prompt, JSON malformation | Input sanitization, constrained array bounds, deterministic fallback |
| `/api/cat-assistant` | POST | No | `message: string`, `history: []` | Prompt injection, credential extraction | Max 500 chars, history bounded to 4 turns, system prompt grounding |
| `/api/cbt-therapist` | POST | No | `message: string`, `history: []` | Clinical bypass, jailbreak, prompt leakage | Strict Turkish filter, meta-tag scrubbers, max 800 chars, grounded instructions |
| `/api/admin-verify` | POST | No (Login) | `passcode: string` | Brute force, timing side-channel attack | Max 5 attempts/15m lockout, `crypto.timingSafeEqual`, 200-320ms random jitter |
| `/api/admin-logout` | POST | No | `Authorization: Bearer <token>` | Token spoofing, stale session replay | Server session revocation from active session map |
| `/api/messages` | POST | No | `name`, `email`, `message`, `hp_website` | Stored XSS, spam flooding, bot scraping | Anti-bot honeypot, RFC regex, DOMPurify text sanitization, rate limits |
| `/api/messages` | GET | Yes (`adminAuthGuard`) | None | Broken object-level auth, IDOR, token hijacking | Session token lookup, IP origin binding, 2h lifetime / 30m idle timeout |
| `/api/messages` | DELETE | Yes (`adminAuthGuard`) | None | Unauthorized inbox purge | Session token lookup, IP origin binding |
| Client-Side Terminal | N/A | Local | Terminal CLI commands | Command injection, DOM XSS | Simulated in-memory shell; zero child processes, DOMPurify on text inputs |

---

## 4. Cryptographic & Data Protection Standards
1. **Hashing:** Passcode hashes evaluated using SHA-256 with `crypto.timingSafeEqual` over raw buffers to eliminate remote timing discovery.
2. **Session Security:** 256-bit cryptographically secure pseudorandom number generator (`crypto.randomBytes(32)`).
3. **Data Sanitization:** DOMPurify 3.4.17 with empty allowed tags (`ALLOWED_TAGS: []`) for pure string sanitization and custom RFC URL protocol validator.
