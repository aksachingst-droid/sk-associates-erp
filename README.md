# SK Associates - Practive-Grade Practice Management & AI ERP

Complete Full-Stack Practice Management Software designed for Chartered Accountants, Tax Consultants, and Accounting Firms (150+ Clients & Multi-Staff Teams).

## Included Modules (Practive Parity + AI)
1. **Multi-Firm Switcher:** Manage multiple firms (e.g., SK Associates, SK Tax Consultancy) from a single login.
2. **Role-Based Access & Client Portal:** Admin, Staff 1/2/3 views, plus a dedicated Client Self-Service Portal.
3. **Client Master & DSC Expiry Tracker:** Bulk CSV import for 150+ clients and Digital Signature expiry alerts.
4. **Password Vault:** Securely store GST, Income Tax, TRACES, and MCA login credentials.
5. **Recurring Tasks & Subtask Checklists:** One-click monthly compliance generation with step-by-step checklists.
6. **Auto-Billing & WhatsApp Integration:** Automatic invoice generation on task completion + 1-click WhatsApp payment reminders.
7. **Staff Timesheet & Physical Document In-Out Register:** Track staff hours and client file movements.
8. **Built-in Gemini AI Assistant:** Draft replies to GST/Income Tax notices (ASMT-10, DRC-01, 143(1)) and audit ledger summaries.

## Quick Setup (Run Locally or Deploy Free to Vercel + Supabase)
1. Install Node.js (v18+).
2. Run `npm install` inside this folder.
3. Create a free project on [Supabase.com](https://supabase.com), open **SQL Editor**, and run `supabase/schema.sql`.
4. Copy `.env.example` to `.env` and paste your Supabase URL, Anon Key, and Gemini API Key.
5. Run `npm run dev` to start locally, or push to GitHub and deploy free on [Vercel.com](https://vercel.com).
