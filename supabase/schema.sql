-- ============================================================================
-- SK ASSOCIATES - PRACTIVE-STYLE PRACTICE MANAGEMENT ERP (SUPABASE POSTGRESQL)
-- ============================================================================

-- 1. FIRMS (Multi-Firm Setup)
CREATE TABLE IF NOT EXISTS firms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  gstin TEXT,
  upi_id TEXT,
  bank_details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. STAFF & USERS (Role-Based Access: admin, staff, client)
CREATE TABLE IF NOT EXISTS app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID REFERENCES firms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  role TEXT CHECK (role IN ('admin', 'staff', 'client')) NOT NULL DEFAULT 'staff',
  designation TEXT,
  client_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CLIENTS MASTER
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID REFERENCES firms(id) ON DELETE CASCADE,
  client_code TEXT,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  pan TEXT,
  gstin TEXT,
  category TEXT CHECK (category IN ('A', 'B', 'C')) DEFAULT 'B',
  assigned_staff TEXT,
  monthly_retainer NUMERIC(10,2) DEFAULT 2000,
  dsc_holder TEXT,
  dsc_expiry DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREDENTIAL / PASSWORD VAULT (GST, Income Tax, MCA, Traces)
CREATE TABLE IF NOT EXISTS client_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID REFERENCES firms(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  portal_name TEXT NOT NULL, -- e.g., GST Portal, Income Tax, TRACES, MCA
  username TEXT NOT NULL,
  password_enc TEXT NOT NULL,
  remarks TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RECURRING & INWARD TASKS (With Subtask Checklist)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID REFERENCES firms(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_mobile TEXT,
  service_name TEXT NOT NULL,
  period_label TEXT, -- e.g., Nov 2026
  assigned_staff TEXT,
  due_date DATE,
  status TEXT CHECK (status IN ('Pending', 'In Progress', 'Review', 'Done')) DEFAULT 'Pending',
  checklist JSONB DEFAULT '[]'::jsonb, -- [{title, done}]
  fee_amount NUMERIC(10,2) DEFAULT 0,
  is_billed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TIMESHEET & WORK LOGS
CREATE TABLE IF NOT EXISTS timesheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID REFERENCES firms(id) ON DELETE CASCADE,
  staff_name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  task_description TEXT NOT NULL,
  minutes_spent INT NOT NULL DEFAULT 30,
  work_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DOCUMENT IN-OUT REGISTER
CREATE TABLE IF NOT EXISTS doc_register (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID REFERENCES firms(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  doc_type TEXT NOT NULL, -- e.g., Bank Passbook, Purchase File, DSC Token
  direction TEXT CHECK (direction IN ('IN', 'OUT')) NOT NULL,
  handled_by TEXT,
  remarks TEXT,
  entry_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INVOICES & COLLECTION (Auto-Billing + 3-Step Follow-up)
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no TEXT NOT NULL,
  firm_id UUID REFERENCES firms(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_mobile TEXT,
  service_name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  invoice_date DATE DEFAULT CURRENT_DATE,
  payment_status TEXT CHECK (payment_status IN ('Unpaid', 'Paid')) DEFAULT 'Unpaid',
  followup_stage TEXT DEFAULT 'Day 1 Sent',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEED INITIAL FIRMS
INSERT INTO firms (name, address, gstin, upi_id, bank_details)
VALUES 
('SK Associates', 'Pardi-Kande, Sachin, Surat, Gujarat', '24AABCS1234F1Z5', 'skassociates@okicici', 'Kotak Mahindra Bank - A/c: 9876543210 (IFSC: KKBK0000841)'),
('SK Tax & Audit Consultancy', 'Surat, Gujarat', 'Unregistered', 'sktax@okicici', 'ICICI Bank - A/c: 1234567890 (IFSC: ICIC0000052)');
