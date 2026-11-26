import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, CheckSquare, IndianRupee, Users, KeyRound,
  Clock, FolderSync, Bot, Settings, Plus, Send, Printer,
  Upload, Download, Sparkles, ShieldCheck, AlertTriangle, Cloud, HardDrive
} from 'lucide-react';
import { supabase, isCloudConfigured } from './supabaseClient';

const DEFAULT_STATE = {
  activeFirmId: 'firm-1',
  role: 'admin',
  firms: [
    {
      id: 'firm-1',
      name: 'SK Associates',
      address: 'Sachin, Surat, Gujarat',
      gstin: '24AABCS1234F1Z5',
      upi_id: 'skassociates@okicici',
      bank_details: 'Kotak Mahindra Bank - A/c: 9876543210 | IFSC: KKBK0000841'
    },
    {
      id: 'firm-2',
      name: 'SK Tax & Audit Consultancy',
      address: 'Surat, Gujarat',
      gstin: 'Unregistered',
      upi_id: 'sktax@okicici',
      bank_details: 'ICICI Bank - A/c: 1234567890 | IFSC: ICIC0000052'
    }
  ],
  staff: [
    { id: 'Staff 1', name: 'Staff 1 (GST & TDS Head)', role: 'Compliance & Filing' },
    { id: 'Staff 2', name: 'Staff 2 (Office Accountant)', role: 'Tally & Billing' },
    { id: 'Staff 3', name: 'Staff 3 (On-Site Executive)', role: 'Client Visits & BRS' }
  ],
  clients: [
    { id: 'c1', firm_id: 'firm-1', client_code: 'SK-001', name: 'Shreeji Textile Mills', mobile: '919825011111', pan: 'AAECS1111A', gstin: '24AAECS1111A1Z1', category: 'A', assigned_staff: 'Staff 3', monthly_retainer: 5000, dsc_holder: 'Rameshbhai Patel', dsc_expiry: '2026-12-15' },
    { id: 'c2', firm_id: 'firm-1', name: 'Maruti Enterprise', mobile: '919825022222', pan: 'AABCM2222B', gstin: '24AABCM2222B1Z2', category: 'B', assigned_staff: 'Staff 2', monthly_retainer: 2500, dsc_holder: 'Sureshbhai Shah', dsc_expiry: '2027-04-10' },
    { id: 'c3', firm_id: 'firm-1', name: 'Patel Jewellers', mobile: '919825033333', pan: 'AAECP3333C', gstin: '24AAECP3333C1Z3', category: 'A', assigned_staff: 'Staff 1', monthly_retainer: 6000, dsc_holder: 'Jignesh Patel', dsc_expiry: '2026-12-05' }
  ],
  vault: [
    { id: 'v1', firm_id: 'firm-1', client_name: 'Shreeji Textile Mills', portal_name: 'GST Portal', username: 'shreeji_gst24', password_enc: 'Shreeji@2026#', remarks: 'Primary EVC Mobile: 9825011111' },
    { id: 'v2', firm_id: 'firm-1', client_name: 'Shreeji Textile Mills', portal_name: 'Income Tax e-Filing', username: 'AAECS1111A', password_enc: 'TaxAudit#99', remarks: 'DSC Registered' },
    { id: 'v3', firm_id: 'firm-1', client_name: 'Patel Jewellers', portal_name: 'TRACES (TDS)', username: 'SURP04512A', password_enc: 'JewelTds@12', remarks: '26Q Quarterly' }
  ],
  tasks: [
    {
      id: 't1', firm_id: 'firm-1', client_name: 'Shreeji Textile Mills', client_mobile: '919825011111',
      service_name: 'Monthly Accounting & GSTR-1/3B', assigned_staff: 'Staff 3', due_date: '2026-12-20',
      status: 'In Progress', fee_amount: 5000, is_billed: false,
      checklist: [
        { title: 'Bank Statement & Sales Data Collected', done: true },
        { title: 'Tally Entry & BRS Completed', done: true },
        { title: 'GSTR-2B Reconciliation & 3B Filing', done: false }
      ]
    },
    {
      id: 't2', firm_id: 'firm-1', client_name: 'Maruti Enterprise', client_mobile: '919825022222',
      service_name: 'Monthly GST Filing', assigned_staff: 'Staff 2', due_date: '2026-12-20',
      status: 'Done', fee_amount: 2500, is_billed: true,
      checklist: [
        { title: 'Sales Bills Verified', done: true },
        { title: 'GSTR-1 & 3B Filed', done: true }
      ]
    }
  ],
  invoices: [
    { id: 'inv1', invoice_no: 'INV-2026-101', firm_id: 'firm-1', client_name: 'Maruti Enterprise', client_mobile: '919825022222', service_name: 'Monthly GST Filing (Nov 2026)', amount: 2500, invoice_date: '2026-11-21', payment_status: 'Unpaid', followup_stage: 'Day 10 Reminder' }
  ],
  timesheets: [
    { id: 'ts1', firm_id: 'firm-1', staff_name: 'Staff 3', client_name: 'Shreeji Textile Mills', task_description: 'On-Site Visit: Bank Reconciliation & Purchase Entry', minutes_spent: 180, work_date: '2026-11-26' },
    { id: 'ts2', firm_id: 'firm-1', staff_name: 'Staff 1', client_name: 'Patel Jewellers', task_description: 'GSTR-2B Mismatch Scrutiny & Notice Draft', minutes_spent: 90, work_date: '2026-11-26' }
  ],
  docRegister: [
    { id: 'd1', firm_id: 'firm-1', client_name: 'Shreeji Textile Mills', doc_type: 'ICICI Bank Passbook & Purchase File', direction: 'IN', handled_by: 'Staff 3', remarks: 'For Q3 Audit', entry_date: '2026-11-24' },
    { id: 'd2', firm_id: 'firm-1', client_name: 'Maruti Enterprise', doc_type: 'Signed Balance Sheet & ITR Ack', direction: 'OUT', handled_by: 'Staff 2', remarks: 'Handed over to client', entry_date: '2026-11-25' }
  ]
};

export default function App() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('sk_practive_erp_v1');
    return saved ? JSON.parse(saved) : DEFAULT_STATE;
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [printInvoice, setPrintInvoice] = useState(null);
  const [aiMode, setAiMode] = useState('notice');
  const [aiInput, setAiInput] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('sk_practive_erp_v1', JSON.stringify(data));
  }, [data]);

  const activeFirm = data.firms.find(f => f.id === data.activeFirmId) || data.firms[0];
  const firmClients = data.clients.filter(c => c.firm_id === activeFirm.id);
  const firmTasks = data.tasks.filter(t => t.firm_id === activeFirm.id && (data.role === 'admin' || data.role === 'client' || t.assigned_staff === data.role));
  const firmInvoices = data.invoices.filter(i => i.firm_id === activeFirm.id);
  const firmVault = data.vault.filter(v => v.firm_id === activeFirm.id);
  const firmTimesheets = data.timesheets.filter(ts => ts.firm_id === activeFirm.id);
  const firmDocs = data.docRegister.filter(d => d.firm_id === activeFirm.id);

  // --- AUTO GENERATE MONTHLY RECURRING TASKS ---
  const generateMonthlyTasks = () => {
    if (firmClients.length === 0) return alert('Add clients first!');
    const newTasks = firmClients.map(c => ({
      id: 't-' + Date.now() + Math.random().toString(36).slice(2, 6),
      firm_id: activeFirm.id,
      client_name: c.name,
      client_mobile: c.mobile,
      service_name: 'Monthly Accounting, GSTR-1 & GSTR-3B',
      assigned_staff: c.assigned_staff,
      due_date: '2026-12-20',
      status: 'Pending',
      fee_amount: Number(c.monthly_retainer) || 2000,
      is_billed: false,
      checklist: [
        { title: 'Data & Bank Statement Collection', done: false },
        { title: 'Tally Entry & BRS', done: false },
        { title: 'GSTR-1 & 3B Filing', done: false }
      ]
    }));
    setData(prev => ({ ...prev, tasks: [...newTasks, ...prev.tasks] }));
    alert(`${newTasks.length} recurring monthly tasks generated!`);
  };

  // --- TOGGLE CHECKLIST ITEM ---
  const toggleChecklist = (taskId, idx) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => {
        if (t.id !== taskId) return t;
        const updatedList = t.checklist.map((item, i) => i === idx ? { ...item, done: !item.done } : item);
        return { ...t, checklist: updatedList };
      })
    }));
  };

  // --- MARK TASK DONE & AUTO-GENERATE INVOICE ---
  const completeTaskAndBill = (taskId) => {
    const target = data.tasks.find(t => t.id === taskId);
    if (!target) return;
    let createdInvoice = null;
    if (!target.is_billed && target.fee_amount > 0) {
      createdInvoice = {
        id: 'inv-' + Date.now(),
        invoice_no: 'INV-' + Math.floor(1000 + Math.random() * 9000),
        firm_id: target.firm_id,
        client_name: target.client_name,
        client_mobile: target.client_mobile,
        service_name: target.service_name,
        amount: target.fee_amount,
        invoice_date: new Date().toISOString().split('T')[0],
        payment_status: 'Unpaid',
        followup_stage: 'Day 1 Sent'
      };
    }
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, status: 'Done', is_billed: true } : t),
      invoices: createdInvoice ? [createdInvoice, ...prev.invoices] : prev.invoices
    }));
    if (createdInvoice) {
      alert(`Task Completed! Auto-Invoice ${createdInvoice.invoice_no} (₹${createdInvoice.amount}) created.`);
    }
  };

  // --- WHATSAPP ONE-CLICK REMINDER ---
  const sendWhatsApp = (inv) => {
    const text = `Namaste *${inv.client_name}*,%0A%0A*${activeFirm.name}* taraf thi aapnu *${inv.service_name}* nu Invoice *${inv.invoice_no}* (Amount: *₹${inv.amount}*) pending che.%0A%0APayment Details:%0A*UPI ID:* ${activeFirm.upi_id}%0A*Bank:* ${activeFirm.bank_details}%0A%0AThank you!`;
    window.open(`https://wa.me/${inv.client_mobile}?text=${text}`, '_blank');
  };

  // --- CSV BULK IMPORT ---
  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split('\n').slice(1);
      const imported = [];
      lines.forEach(line => {
        const [name, mobile, pan, gstin, category, staff, fee, dscHolder, dscExpiry] = line.split(',');
        if (name && name.trim()) {
          imported.push({
            id: 'c-' + Math.random().toString(36).slice(2, 8),
            firm_id: activeFirm.id,
            client_code: 'SK-' + Math.floor(100 + Math.random() * 900),
            name: name.trim(),
            mobile: (mobile || '919999999999').trim(),
            pan: (pan || '').trim(),
            gstin: (gstin || 'Unregistered').trim(),
            category: (category || 'B').trim(),
            assigned_staff: (staff || 'Staff 2').trim(),
            monthly_retainer: Number(fee) || 2000,
            dsc_holder: (dscHolder || '').trim(),
            dsc_expiry: (dscExpiry || '2027-03-31').trim()
          });
        }
      });
      setData(prev => ({ ...prev, clients: [...imported, ...prev.clients] }));
      alert(`${imported.length} clients imported successfully!`);
    };
    reader.readAsText(file);
  };

  // --- GEMINI AI ASSISTANT (Live API if key set, else Smart Template) ---
  const runAIAssistant = async () => {
    if (!aiInput.trim()) return alert('Please enter notice text or ledger details.');
    setAiLoading(true);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey && !apiKey.includes('your-gemini')) {
      try {
        const prompt = aiMode === 'notice'
          ? `You are an expert Indian Chartered Accountant & Tax Consultant. Draft a formal, legally sound reply for the following GST/Income Tax notice on behalf of ${activeFirm.name}:\n\n${aiInput}`
          : `You are an expert Indian Tax Auditor. Analyze the following Tally ledger / GSTR-2B summary and highlight Section 40A(3) cash violations, TDS defaults, and ITC mismatches:\n\n${aiInput}`;
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const json = await res.json();
        setAiOutput(json?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.');
      } catch (err) {
        setAiOutput('API Error: ' + err.message);
      }
    } else {
      setTimeout(() => {
        setAiOutput(
          aiMode === 'notice'
            ? `To,\nThe Jurisdictional Proper Officer,\n\nSubject: Formal Reply to Notice - ${aiInput.slice(0, 50)}...\n\nRespected Sir/Madam,\n\n1. With reference to the captioned notice, we submit that our client has duly reconciled GSTR-1, GSTR-3B, and GSTR-2B returns.\n2. All Input Tax Credit (ITC) claimed satisfies conditions under Section 16(2) of the CGST Act, 2017, backed by valid tax invoices and bank payment proofs.\n3. Copies of Purchase Register, GSTR-2B Reconciliation, and Bank Statements are enclosed herewith.\n\nKindly drop the proceedings.\n\nFor ${activeFirm.name}\nAuthorized Signatory`
            : `=== AI AUDIT & SCRUTINY SUMMARY ===\nAnalyzed Data: ${aiInput.slice(0, 60)}...\n\n1. Section 40A(3) Check: Verify cash payments exceeding ₹10,000 in a single day.\n2. GSTR-2B Mismatch: Flagged vendors who have not filed GSTR-1; hold ITC until reflected.\n3. TDS Compliance: Cross-check 194C (1%/2%) and 194J (10%) deductions.`
        );
      }, 400);
    }
    setAiLoading(false);
  };

  // --- CLIENT SELF-SERVICE PORTAL VIEW ---
  if (data.role === 'client') {
    const demoClient = firmClients[0] || { name: 'Valued Client', gstin: '24AAAAA0000A1Z5', pan: 'AAAAA0000A' };
    return (
      <div className="min-h-screen bg-slate-100">
        <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-bold text-lg">{activeFirm.name} — Client Portal</h1>
            <p className="text-xs text-slate-400">Self-Service Compliance & Billing Dashboard</p>
          </div>
          <select
            value={data.role}
            onChange={(e) => setData({ ...data, role: e.target.value })}
            className="bg-slate-800 text-sm px-3 py-1.5 rounded-lg border border-slate-700"
          >
            <option value="admin">Switch to Admin</option>
            <option value="client">Client Portal View</option>
          </select>
        </header>
        <main className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-bold">Welcome, {demoClient.name}</h2>
            <p className="text-sm text-indigo-100 mt-1">PAN: {demoClient.pan} | GSTIN: {demoClient.gstin}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <p className="text-xs text-slate-500">Compliance Status</p>
              <p className="text-lg font-bold text-emerald-600 mt-1">All Returns Up-to-Date</p>
            </div>
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <p className="text-xs text-slate-500">Outstanding Fees</p>
              <p className="text-lg font-bold text-rose-600 mt-1">
                ₹{firmInvoices.filter(i => i.payment_status === 'Unpaid').reduce((a, b) => a + b.amount, 0)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <p className="text-xs text-slate-500">Instant UPI Payment</p>
              <p className="text-sm font-mono font-bold text-indigo-700 mt-1">{activeFirm.upi_id}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <h3 className="font-bold mb-3">Your Invoices & Statements</h3>
            {firmInvoices.map(inv => (
              <div key={inv.id} className="flex justify-between items-center p-3 border-b last:border-0">
                <div>
                  <p className="font-semibold text-sm">{inv.service_name}</p>
                  <p className="text-xs text-slate-500">{inv.invoice_no} • {inv.invoice_date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">₹{inv.amount}</span>
                  <span className={`text-xs px-2 py-1 rounded font-semibold ${inv.payment_status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {inv.payment_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* TOP BAR */}
      <header className="bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 px-2.5 py-1.5 rounded-lg font-bold">SK</div>
          <div>
            <h1 className="font-bold text-base md:text-lg leading-tight">{activeFirm.name}</h1>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Practive-Grade ERP</span>
              {isCloudConfigured ? (
                <span className="flex items-center gap-1 text-emerald-400"><Cloud size={12} /> Cloud Connected</span>
              ) : (
                <span className="flex items-center gap-1 text-amber-400"><HardDrive size={12} /> Local Storage Mode</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={data.activeFirmId}
            onChange={(e) => setData({ ...data, activeFirmId: e.target.value })}
            className="bg-slate-800 text-sm px-3 py-1.5 rounded-lg border border-slate-700"
          >
            {data.firms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>

          <select
            value={data.role}
            onChange={(e) => setData({ ...data, role: e.target.value })}
            className="bg-slate-800 text-emerald-400 text-sm font-medium px-3 py-1.5 rounded-lg border border-slate-700"
          >
            <option value="admin">Admin (Owner)</option>
            <option value="Staff 1">Staff 1 (GST/TDS)</option>
            <option value="Staff 2">Staff 2 (Accounting)</option>
            <option value="Staff 3">Staff 3 (On-Site)</option>
            <option value="client">Client Portal</option>
          </select>
        </div>
      </header>

      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside className="w-60 bg-white border-r border-slate-200 p-3 hidden md:flex flex-col justify-between no-print">
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'tasks', label: 'Tasks & Checklists', icon: CheckSquare },
              { id: 'billing', label: 'Billing & WhatsApp', icon: IndianRupee },
              { id: 'clients', label: 'Clients & DSC Tracker', icon: Users },
              { id: 'vault', label: 'Password Vault', icon: KeyRound },
              { id: 'timesheet', label: 'Staff Timesheet', icon: Clock },
              { id: 'docs', label: 'Doc In-Out Register', icon: FolderSync },
              { id: 'ai', label: 'AI Notice & Audit', icon: Bot },
              { id: 'settings', label: 'Multi-Firm Settings', icon: Settings }
            ].map(item => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={17} /> {item.label}
                </button>
              );
            })}
          </nav>
          <div className="p-3 bg-slate-100 rounded-lg text-xs text-slate-600">
            <p className="font-semibold text-slate-800">150+ Client Ready</p>
            <p className="mt-0.5">Connect Supabase in .env for multi-PC real-time sync.</p>
          </div>
        </aside>

        {/* MAIN AREA */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900">Practice Overview — {activeFirm.name}</h2>
                <button onClick={generateMonthlyTasks} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                  <Sparkles size={16} /> Generate Monthly Tasks
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border shadow-sm">
                  <p className="text-xs text-slate-500 uppercase">Total Clients</p>
                  <p className="text-3xl font-bold mt-1">{firmClients.length}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border shadow-sm">
                  <p className="text-xs text-slate-500 uppercase">Pending Tasks</p>
                  <p className="text-3xl font-bold text-amber-600 mt-1">{firmTasks.filter(t => t.status !== 'Done').length}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border shadow-sm">
                  <p className="text-xs text-slate-500 uppercase">Unpaid Fees</p>
                  <p className="text-3xl font-bold text-rose-600 mt-1">
                    ₹{firmInvoices.filter(i => i.payment_status === 'Unpaid').reduce((s, i) => s + i.amount, 0)}
                  </p>
                </div>
                <div className="bg-white p-5 rounded-xl border shadow-sm">
                  <p className="text-xs text-slate-500 uppercase">DSC Expiring Soon</p>
                  <p className="text-3xl font-bold text-indigo-600 mt-1">
                    {firmClients.filter(c => c.dsc_expiry && c.dsc_expiry <= '2026-12-31').length}
                  </p>
                </div>
              </div>

              {/* DSC & Compliance Alerts */}
              <div className="bg-white p-5 rounded-xl border shadow-sm">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-500" /> DSC Expiry & Priority Compliance Watchlist
                </h3>
                <div className="divide-y">
                  {firmClients.map(c => (
                    <div key={c.id} className="py-2.5 flex justify-between items-center text-sm">
                      <div>
                        <span className="font-semibold">{c.name}</span>
                        <span className="text-xs text-slate-500 ml-2">({c.dsc_holder || 'Director'})</span>
                      </div>
                      <span className="text-xs font-mono bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded">
                        DSC Expiry: {c.dsc_expiry || 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Compliance Tasks & Subtask Checklists</h2>
                <button onClick={generateMonthlyTasks} className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-xs font-semibold">
                  + Auto-Generate Recurring Tasks
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {firmTasks.map(t => (
                  <div key={t.id} className="bg-white p-5 rounded-xl border shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-900">{t.client_name}</h3>
                        <p className="text-xs text-slate-500">{t.service_name} • Due: {t.due_date}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${t.status === 'Done' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {t.status}
                      </span>
                    </div>
                    <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg">
                      {t.checklist?.map((item, idx) => (
                        <label key={idx} className="flex items-center gap-2 text-xs cursor-pointer">
                          <input type="checkbox" checked={item.done} onChange={() => toggleChecklist(t.id, idx)} />
                          <span className={item.done ? 'line-through text-slate-400' : 'text-slate-700'}>{item.title}</span>
                        </label>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t text-xs">
                      <span className="font-medium text-slate-600">Assigned: {t.assigned_staff} | Fee: ₹{t.fee_amount}</span>
                      {t.status !== 'Done' && (
                        <button onClick={() => completeTaskAndBill(t.id)} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-semibold">
                          Complete & Auto-Bill
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Billing, Collection & WhatsApp Automation</h2>
              <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                    <tr>
                      <th className="p-3">Invoice #</th>
                      <th className="p-3">Client & Service</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {firmInvoices.map(inv => (
                      <tr key={inv.id}>
                        <td className="p-3 font-mono font-bold text-indigo-700">{inv.invoice_no}</td>
                        <td className="p-3">
                          <p className="font-bold">{inv.client_name}</p>
                          <p className="text-xs text-slate-500">{inv.service_name}</p>
                        </td>
                        <td className="p-3 font-bold">₹{inv.amount}</td>
                        <td className="p-3">
                          <button
                            onClick={() => setData(prev => ({
                              ...prev,
                              invoices: prev.invoices.map(i => i.id === inv.id ? { ...i, payment_status: i.payment_status === 'Paid' ? 'Unpaid' : 'Paid' } : i)
                            }))}
                            className={`text-xs px-2.5 py-1 rounded-full font-bold ${inv.payment_status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}
                          >
                            {inv.payment_status}
                          </button>
                        </td>
                        <td className="p-3 flex gap-2">
                          <button onClick={() => setPrintInvoice(inv)} className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1">
                            <Printer size={14} /> Invoice
                          </button>
                          <button onClick={() => sendWhatsApp(inv)} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1">
                            <Send size={14} /> WhatsApp
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <h2 className="text-2xl font-bold">Client Master & DSC Tracker ({firmClients.length})</h2>
                <label className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-2">
                  <Upload size={15} /> Bulk Import CSV (150+ Clients)
                  <input type="file" accept=".csv" onChange={handleCSVImport} className="hidden" />
                </label>
              </div>
              <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                    <tr>
                      <th className="p-3">Code</th>
                      <th className="p-3">Client Name</th>
                      <th className="p-3">PAN / GSTIN</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Staff</th>
                      <th className="p-3">DSC Expiry</th>
                      <th className="p-3">Retainer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {firmClients.map(c => (
                      <tr key={c.id}>
                        <td className="p-3 font-mono text-xs">{c.client_code}</td>
                        <td className="p-3 font-bold">{c.name}<br /><span className="text-xs font-normal text-slate-500">{c.mobile}</span></td>
                        <td className="p-3 font-mono text-xs">{c.pan}<br />{c.gstin}</td>
                        <td className="p-3"><span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-0.5 rounded">Cat {c.category}</span></td>
                        <td className="p-3">{c.assigned_staff}</td>
                        <td className="p-3 text-xs font-mono">{c.dsc_expiry}</td>
                        <td className="p-3 font-semibold">₹{c.monthly_retainer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'vault' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2"><ShieldCheck className="text-indigo-600" /> Client Password Vault</h2>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target);
                  setData(prev => ({
                    ...prev,
                    vault: [{
                      id: 'v-' + Date.now(),
                      firm_id: activeFirm.id,
                      client_name: fd.get('client_name'),
                      portal_name: fd.get('portal_name'),
                      username: fd.get('username'),
                      password_enc: fd.get('password_enc'),
                      remarks: fd.get('remarks')
                    }, ...prev.vault]
                  }));
                  e.target.reset();
                }}
                className="bg-white p-4 rounded-xl border grid grid-cols-1 sm:grid-cols-5 gap-3"
              >
                <input name="client_name" required placeholder="Client Name" className="border rounded-lg px-3 py-2 text-sm" />
                <input name="portal_name" required placeholder="Portal (GST/ITR/MCA)" className="border rounded-lg px-3 py-2 text-sm" />
                <input name="username" required placeholder="User ID" className="border rounded-lg px-3 py-2 text-sm" />
                <input name="password_enc" required placeholder="Password" className="border rounded-lg px-3 py-2 text-sm" />
                <button type="submit" className="bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-semibold">+ Save Login</button>
              </form>
              <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                    <tr>
                      <th className="p-3">Client</th>
                      <th className="p-3">Portal</th>
                      <th className="p-3">Username</th>
                      <th className="p-3">Password</th>
                      <th className="p-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {firmVault.map(v => (
                      <tr key={v.id}>
                        <td className="p-3 font-bold">{v.client_name}</td>
                        <td className="p-3">{v.portal_name}</td>
                        <td className="p-3 font-mono text-xs">{v.username}</td>
                        <td className="p-3 font-mono text-xs bg-slate-50">{v.password_enc}</td>
                        <td className="p-3 text-xs text-slate-500">{v.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'timesheet' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Staff Timesheet & Work Logs</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target);
                  setData(prev => ({
                    ...prev,
                    timesheets: [{
                      id: 'ts-' + Date.now(),
                      firm_id: activeFirm.id,
                      staff_name: fd.get('staff_name'),
                      client_name: fd.get('client_name'),
                      task_description: fd.get('task_description'),
                      minutes_spent: Number(fd.get('minutes_spent')) || 60,
                      work_date: new Date().toISOString().split('T')[0]
                    }, ...prev.timesheets]
                  }));
                  e.target.reset();
                }}
                className="bg-white p-4 rounded-xl border grid grid-cols-1 sm:grid-cols-5 gap-3"
              >
                <select name="staff_name" className="border rounded-lg px-3 py-2 text-sm">
                  <option value="Staff 1">Staff 1</option>
                  <option value="Staff 2">Staff 2</option>
                  <option value="Staff 3">Staff 3</option>
                </select>
                <input name="client_name" required placeholder="Client Name" className="border rounded-lg px-3 py-2 text-sm" />
                <input name="task_description" required placeholder="Work Summary" className="border rounded-lg px-3 py-2 text-sm" />
                <input name="minutes_spent" type="number" required placeholder="Minutes (e.g. 90)" className="border rounded-lg px-3 py-2 text-sm" />
                <button type="submit" className="bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm font-semibold">+ Log Time</button>
              </form>
              <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Staff</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Work Done</th>
                      <th className="p-3">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {firmTimesheets.map(ts => (
                      <tr key={ts.id}>
                        <td className="p-3 text-xs">{ts.work_date}</td>
                        <td className="p-3 font-semibold">{ts.staff_name}</td>
                        <td className="p-3 font-bold">{ts.client_name}</td>
                        <td className="p-3">{ts.task_description}</td>
                        <td className="p-3 font-mono">{ts.minutes_spent} mins</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Physical Document In-Out Register</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target);
                  setData(prev => ({
                    ...prev,
                    docRegister: [{
                      id: 'd-' + Date.now(),
                      firm_id: activeFirm.id,
                      client_name: fd.get('client_name'),
                      doc_type: fd.get('doc_type'),
                      direction: fd.get('direction'),
                      handled_by: fd.get('handled_by'),
                      remarks: fd.get('remarks'),
                      entry_date: new Date().toISOString().split('T')[0]
                    }, ...prev.docRegister]
                  }));
                  e.target.reset();
                }}
                className="bg-white p-4 rounded-xl border grid grid-cols-1 sm:grid-cols-6 gap-3"
              >
                <input name="client_name" required placeholder="Client Name" className="border rounded-lg px-3 py-2 text-sm" />
                <input name="doc_type" required placeholder="File / Passbook / DSC" className="border rounded-lg px-3 py-2 text-sm" />
                <select name="direction" className="border rounded-lg px-3 py-2 text-sm">
                  <option value="IN">IN (Received)</option>
                  <option value="OUT">OUT (Returned)</option>
                </select>
                <input name="handled_by" required placeholder="Staff Name" className="border rounded-lg px-3 py-2 text-sm" />
                <input name="remarks" placeholder="Remarks" className="border rounded-lg px-3 py-2 text-sm" />
                <button type="submit" className="bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-semibold">+ Add Entry</button>
              </form>
              <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Document / Item</th>
                      <th className="p-3">In / Out</th>
                      <th className="p-3">Handled By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {firmDocs.map(d => (
                      <tr key={d.id}>
                        <td className="p-3 text-xs">{d.entry_date}</td>
                        <td className="p-3 font-bold">{d.client_name}</td>
                        <td className="p-3">{d.doc_type}</td>
                        <td className="p-3">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${d.direction === 'IN' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                            {d.direction}
                          </span>
                        </td>
                        <td className="p-3">{d.handled_by}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="max-w-3xl space-y-5">
              <h2 className="text-2xl font-bold">Gemini AI Tax Notice & Audit Assistant</h2>
              <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                <select value={aiMode} onChange={(e) => setAiMode(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="notice">GST / Income Tax Notice Reply Generator (ASMT-10 / DRC-01 / 143(1))</option>
                  <option value="audit">Tally Ledger & GSTR-2B Audit Scrutiny</option>
                </select>
                <textarea
                  rows={4}
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Paste notice summary or ledger details here..."
                  className="w-full border rounded-lg p-3 text-sm"
                />
                <button onClick={runAIAssistant} disabled={aiLoading} className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold">
                  {aiLoading ? 'Generating...' : '✨ Generate AI Draft'}
                </button>
                <textarea rows={10} value={aiOutput} onChange={(e) => setAiOutput(e.target.value)} className="w-full border rounded-lg p-3 text-sm font-mono bg-slate-50" />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-3xl space-y-6">
              <h2 className="text-2xl font-bold">Multi-Firm & Staff Setup</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target);
                  const newFirm = {
                    id: 'firm-' + Date.now(),
                    name: fd.get('name'),
                    address: fd.get('address'),
                    gstin: fd.get('gstin') || 'Unregistered',
                    upi_id: fd.get('upi_id'),
                    bank_details: fd.get('bank_details')
                  };
                  setData(prev => ({ ...prev, firms: [...prev.firms, newFirm], activeFirmId: newFirm.id }));
                  e.target.reset();
                  alert('New firm added!');
                }}
                className="bg-white p-5 rounded-xl border shadow-sm space-y-3"
              >
                <h3 className="font-bold">+ Add Another Firm</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input name="name" required placeholder="Firm Name" className="border rounded-lg px-3 py-2 text-sm" />
                  <input name="gstin" placeholder="GSTIN" className="border rounded-lg px-3 py-2 text-sm" />
                  <input name="address" required placeholder="Office Address" className="border rounded-lg px-3 py-2 text-sm" />
                  <input name="upi_id" required placeholder="UPI ID" className="border rounded-lg px-3 py-2 text-sm" />
                </div>
                <input name="bank_details" required placeholder="Bank Name, Account No & IFSC" className="border rounded-lg px-3 py-2 text-sm w-full" />
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Save Firm</button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* PRINT INVOICE MODAL */}
      {printInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4">
            <div className="border p-5 rounded-lg space-y-3">
              <div className="flex justify-between border-b pb-3">
                <div>
                  <h2 className="font-bold text-lg">{activeFirm.name}</h2>
                  <p className="text-xs text-slate-500">{activeFirm.address}</p>
                  <p className="text-xs text-slate-500">GSTIN: {activeFirm.gstin}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-indigo-700">{printInvoice.invoice_no}</p>
                  <p className="text-xs text-slate-500">Date: {printInvoice.invoice_date}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400">BILL TO:</p>
                <p className="font-bold">{printInvoice.client_name}</p>
              </div>
              <div className="flex justify-between border-y py-2 text-sm">
                <span>{printInvoice.service_name}</span>
                <span className="font-bold">₹{printInvoice.amount}</span>
              </div>
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded">
                <p><strong>UPI ID:</strong> {activeFirm.upi_id}</p>
                <p><strong>Bank:</strong> {activeFirm.bank_details}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 no-print">
              <button onClick={() => setPrintInvoice(null)} className="px-4 py-2 border rounded-lg text-sm">Close</button>
              <button onClick={() => window.print()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">Print / Save PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
