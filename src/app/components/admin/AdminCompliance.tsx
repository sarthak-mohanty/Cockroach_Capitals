import { useState } from 'react';
import { Download, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useToast } from '../shared/ToastContext';

const MONTHS = ['May 2026', 'April 2026', 'March 2026'];

const AUDIT_ENTRIES = [
  { ts: 'May 27 2026, 14:34:22 UTC', action: 'POST /api/contributions/remit',     status: 200, detail: '12,847 records processed'        },
  { ts: 'May 27 2026, 09:12:45 UTC', action: 'GET  /api/compliance/status',       status: 200, detail: 'All checks passed'                },
  { ts: 'May 26 2026, 18:00:01 UTC', action: 'CRON monthly-contribution-calc',    status: 200, detail: 'Duration 3.2 s'                   },
  { ts: 'May 26 2026, 14:01:00 UTC', action: 'POST /api/workers/bulk-verify',     status: 200, detail: '1,284 Aadhaar records verified'   },
  { ts: 'May 25 2026, 08:30:19 UTC', action: 'GET  /api/reports/pwfvs-summary',   status: 200, detail: 'Report cached for 24 h'           },
];

export default function AdminCompliance() {
  const { addToast } = useToast();
  const [reportGenerated, setReportGenerated] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('May 2026');
  const [auditOpen, setAuditOpen] = useState(false);

  const ledgerEntries = [
    { workerId: 'GS-2024-0847291', deliveryId: 'DEL-001', amount: 80,  contribution: 1.60, timestamp: 'Today 2:34 PM', platform: 'Swiggy',  city: 'Bengaluru' },
    { workerId: 'GS-2024-0847292', deliveryId: 'DEL-002', amount: 95,  contribution: 1.90, timestamp: 'Today 2:28 PM', platform: 'Blinkit', city: 'Bengaluru' },
    { workerId: 'GS-2024-0847293', deliveryId: 'DEL-003', amount: 120, contribution: 2.40, timestamp: 'Today 2:15 PM', platform: 'Ola',     city: 'Pune'      },
    { workerId: 'GS-2024-0847294', deliveryId: 'DEL-004', amount: 75,  contribution: 1.50, timestamp: 'Today 1:52 PM', platform: 'Swiggy',  city: 'Bengaluru' },
    { workerId: 'GS-2024-0847295', deliveryId: 'DEL-005', amount: 110, contribution: 2.20, timestamp: 'Today 1:40 PM', platform: 'Blinkit', city: 'Jaipur'    },
  ];

  const submissionHistory = [
    { month: 'Apr 2026', status: 'Submitted' },
    { month: 'Mar 2026', status: 'Submitted' },
    { month: 'Feb 2026', status: 'Submitted' },
  ];

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
    setReportGenerated(false);
  };

  const reportFilename = `Karnataka_PWFVS_${selectedMonth.replace(' ', '')}.pdf`;

  const handleExportCSV = () => {
    const headers = ['Worker ID', 'Delivery ID', 'Amount (Rs)', 'Contribution (Rs)', 'Timestamp', 'Platform', 'City'];
    const rows = ledgerEntries.map(e => [
      e.workerId, e.deliveryId, e.amount, e.contribution.toFixed(2), `"${e.timestamp}"`, e.platform, e.city,
    ]);
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GigShield_Ledger_${selectedMonth.replace(' ', '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6">
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(20px,3vw,24px)', color: '#0F172A', marginBottom: '16px' }}>
          Compliance & Reporting
        </h1>

        {/* Compliance Summary card */}
        <div className="rounded-xl p-5 sm:p-7 mb-5" style={{ background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)', border: '2px solid #86EFAC' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full" style={{ background: '#22C55E', color: '#FFFFFF', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '15px' }}>
              COMPLIANT
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#15803D' }}>
              Karnataka Labour Department — PWFVS
            </span>
          </div>
          {/* Stats — 2-col on mobile, 4-col on lg */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Contributions', value: 'Rs 21,60,000' },
              { label: 'Mandatory Rate',      value: '2%'           },
              { label: 'Actual Rate',         value: '2.00% ✓'      },
              { label: 'Workers Covered',     value: '12,847'        },
            ].map((s) => (
              <div key={s.label}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#15803D' }}>{s.label}</p>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(16px,2vw,20px)', color: '#0F172A', marginTop: '4px' }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Report Generator */}
        <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm mb-5" style={{ border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: '#0F172A', marginBottom: '14px' }}>
            Generate PWFVS Report
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="rounded-md outline-none flex-shrink-0"
              style={{ width: '180px', height: '40px', border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '14px', paddingLeft: '12px', cursor: 'pointer' }}
            >
              {MONTHS.map(m => <option key={m}>{m}</option>)}
            </select>
            <button
              onClick={() => setReportGenerated(true)}
              className="px-5 rounded-md flex-shrink-0"
              style={{ height: '40px', background: '#1A3C5E', color: '#FFFFFF', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', border: 'none', cursor: 'pointer' }}
            >
              Generate Report
            </button>
            {reportGenerated && (
              <button
                onClick={() => addToast('PDF would download here in production.', 'warning')}
                className="flex items-center gap-2 px-5 rounded-md flex-shrink-0"
                style={{ height: '40px', background: '#22C55E', color: '#FFFFFF', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', border: 'none', cursor: 'pointer' }}
              >
                <Download size={16} />
                Download PDF →
              </button>
            )}
          </div>
          {reportGenerated && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B', marginTop: '8px' }}>
              {reportFilename}
            </p>
          )}
        </div>

        {/* Contribution Ledger */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-5" style={{ border: '1px solid #E2E8F0' }}>
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: '#0F172A' }}>
              Contribution Ledger
            </h3>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-md"
              style={{ border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#0F172A', background: '#FFFFFF', cursor: 'pointer' }}
            >
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '600px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' }}>
                  {['Worker ID', 'Delivery ID', 'Amount', 'Contribution', 'Timestamp', 'Platform', 'City'].map(h => (
                    <th key={h} className="px-5 py-3 text-left" style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '11px', color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ledgerEntries.map((entry, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td className="px-5 py-3" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', whiteSpace: 'nowrap' }}>{entry.workerId}</td>
                    <td className="px-5 py-3" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>{entry.deliveryId}</td>
                    <td className="px-5 py-3" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>Rs {entry.amount}</td>
                    <td className="px-5 py-3" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>Rs {entry.contribution.toFixed(2)}</td>
                    <td className="px-5 py-3" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B', whiteSpace: 'nowrap' }}>{entry.timestamp}</td>
                    <td className="px-5 py-3" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>{entry.platform}</td>
                    <td className="px-5 py-3" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>{entry.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t" style={{ borderColor: '#E2E8F0' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B' }}>Showing 1–5 of 3,92,847 records</span>
          </div>
        </div>

        {/* Audit Trail */}
        <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm mb-5" style={{ border: '1px solid #E2E8F0' }}>
          <button
            onClick={() => setAuditOpen(o => !o)}
            className="w-full flex items-center justify-between"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: '#0F172A' }}>Audit Trail</h3>
            {auditOpen
              ? <ChevronUp  size={20} style={{ color: '#64748B' }} />
              : <ChevronDown size={20} style={{ color: '#64748B' }} />
            }
          </button>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B', marginTop: '8px' }}>
            Last entry: May 27 2026, 14:34:22 UTC — Status 200
          </p>
          {auditOpen && (
            <div className="mt-4 overflow-x-auto rounded-lg" style={{ border: '1px solid #E2E8F0' }}>
              <table className="w-full" style={{ minWidth: '560px' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' }}>
                    {['Timestamp', 'Action', 'Status', 'Detail'].map(h => (
                      <th key={h} className="px-4 py-2 text-left" style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '11px', color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {AUDIT_ENTRIES.map((a, i) => (
                    <tr key={i} style={{ borderBottom: i < AUDIT_ENTRIES.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                      <td className="px-4 py-2" style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', whiteSpace: 'nowrap' }}>{a.ts}</td>
                      <td className="px-4 py-2" style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', color: '#0F172A', whiteSpace: 'nowrap' }}>{a.action}</td>
                      <td className="px-4 py-2">
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#16A34A', background: '#F0FDF4', padding: '2px 8px', borderRadius: '100px' }}>{a.status}</span>
                      </td>
                      <td className="px-4 py-2" style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>{a.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Submission History */}
        <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm" style={{ border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: '#0F172A', marginBottom: '16px' }}>
            Submission History
          </h3>
          <div className="space-y-3">
            {submissionHistory.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#F1F5F9' }}>
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} style={{ color: '#22C55E', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A' }}>{entry.month}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>{entry.status}</p>
                  </div>
                </div>
                <button
                  onClick={() => addToast('PDF would download here in production.', 'warning')}
                  style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0EA5E9', whiteSpace: 'nowrap', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Download PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
