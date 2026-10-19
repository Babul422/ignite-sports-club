# Security & Data Privacy Policy

## 1. Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## 2. Reporting a Vulnerability

The **IGNITE SPORTS CLUB** development team takes security and student privacy seriously. If you discover a security vulnerability, **do NOT open a public issue**.

Instead, please report the vulnerability privately via:
- Email to: `security-sportsclub@campus.edu` (or the primary club lead)
- Subject line: `[SECURITY] IGNITE Sports Club Vulnerability Report`

Please include:
1. Description of the issue and potential impact.
2. Step-by-step reproduction instructions or a minimal Proof of Concept (PoC).
3. Any suggested remediations or mitigations.

You will receive an acknowledgment within 48 hours, followed by updates on triage and patching timelines.

---

## 3. Strict Rules: Secrets & Credentials

To ensure the safety of our systems and club data:

- **Never Commit Secrets**: Do not commit API secrets, private keys, database connection strings, Supabase service-role keys, or JWT secrets to Git.
- **Client vs. Server Separation**: Client-side code in Vite can only use variables prefixed with `VITE_` (such as `VITE_SUPABASE_ANON_KEY`). Anonymous keys are meant for public client access with Row Level Security (RLS). Service-role keys must NEVER be placed in frontend code.
- **Environment Files**: All `.env`, `.env.local`, and `.env.production` files must be ignored via `.gitignore`. Only `.env.example` with non-sensitive placeholders is tracked in the repository.
- **Accidental Commits**: If a secret is accidentally committed to any branch, notify the maintainers immediately so the compromised credential can be revoked and rotated.

---

## 4. Student & Member Data Privacy

Our web portal connects collegiate athletes, coaches, and student members:

- **Public Content**: Team schedules, general facility information, athletic match announcements, and public social links are public.
- **Private Data**: Student ID numbers, personal phone numbers, physical addresses, emergency medical records, and internal tryout grading/scores are confidential and must **NEVER** be hardcoded or publicly exposed in client-side bundles or mock fixtures.
- All form submissions (such as the Join Club / Tryout Registration modal) must sanitize inputs and transmit data over encrypted HTTPS endpoints.
