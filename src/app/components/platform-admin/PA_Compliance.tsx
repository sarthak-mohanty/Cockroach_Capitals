import { useState } from 'react';
import PlatformAdminLayout from './PlatformAdminLayout';
import { CheckCircle, Download, FileText, AlertTriangle } from 'lucide-react';
import { useToast } from '../shared/ToastContext';

// ── Per-month data ────────────────────────────────────────────────────────────
interface LedgerRow {
  date: string;
  workers: number;
  amount: string;
  status: string;
  ref: string;
}

interface MonthConfig {
  startDow: number;   // 0=Sun … 6=Sat
  days: number;
  remittedThrough: number; // day of month up to which all contributions are remitted
  ledger: LedgerRow[];
  complianceLabel: string;
  workersLabel: string;
}

const MONTH_DATA: Record<string, MonthConfig> = {
  'May 2026': {
    startDow: 5,          // May 1, 2026 = Friday
    days: 31,
    remittedThrough: 26,  // up to May 26
    complianceLabel: 'Fully Compliant — May 2026',
    workersLabel: '98.4%',
    ledger: [
      { date: 'May 26, 2026', workers: 1284, amount: '₹91,240', status: 'Remitted', ref: 'TXN-8847231' },
      { date: 'May 19, 2026', workers: 1271, amount: '₹89,700', status: 'Remitted', ref: 'TXN-8831049' },
      { date: 'May 12, 2026', workers: 1264, amount: '₹88,400', status: 'Remitted', ref: 'TXN-8814872' },
      { date: 'May 5, 2026',  workers: 1258, amount: '₹87,900', status: 'Remitted', ref: 'TXN-8799345' },
    ],
  },
  'Apr 2026': {
    startDow: 3,          // Apr 1, 2026 = Wednesday
    days: 30,
    remittedThrough: 30,  // full month remitted
    complianceLabel: 'Fully Compliant — Apr 2026',
    workersLabel: '97.9%',
    ledger: [
      { date: 'Apr 28, 2026', workers: 1245, amount: '₹86,500', status: 'Remitted', ref: 'TXN-8781234' },
      { date: 'Apr 21, 2026', workers: 1238, amount: '₹85,200', status: 'Remitted', ref: 'TXN-8763021' },
      { date: 'Apr 14, 2026', workers: 1230, amount: '₹84,100', status: 'Remitted', ref: 'TXN-8749102' },
      { date: 'Apr 7, 2026',  workers: 1222, amount: '₹83,400', status: 'Remitted', ref: 'TXN-8731847' },
    ],
  },
  'Mar 2026': {
    startDow: 0,          // Mar 1, 2026 = Sunday
    days: 31,
    remittedThrough: 31,
    complianceLabel: 'Fully Compliant — Mar 2026',
    workersLabel: '97.5%',
    ledger: [
      { date: 'Mar 30, 2026', workers: 1218, amount: '₹82,800', status: 'Remitted', ref: 'TXN-8703215' },
      { date: 'Mar 23, 2026', workers: 1209, amount: '₹81,500', status: 'Remitted', ref: 'TXN-8685432' },
      { date: 'Mar 16, 2026', workers: 1198, amount: '₹80,100', status: 'Remitted', ref: 'TXN-8667891' },
      { date: 'Mar 9, 2026',  workers: 1187, amount: '₹79,200', status: 'Remitted', ref: 'TXN-8649023' },
      { date: 'Mar 2, 2026',  workers: 1175, amount: '₹78,100', status: 'Remitted', ref: 'TXN-8631456' },
    ],
  },
  'Feb 2026': {
    startDow: 0,          // Feb 1, 2026 = Sunday
    days: 28,
    remittedThrough: 28,
    complianceLabel: 'Fully Compliant — Feb 2026',
    workersLabel: '97.1%',
    ledger: [
      { date: 'Feb 23, 2026', workers: 1170, amount: '₹77,600', status: 'Remitted', ref: 'TXN-8594782' },
      { date: 'Feb 16, 2026', workers: 1158, amount: '₹76,400', status: 'Remitted', ref: 'TXN-8576143' },
      { date: 'Feb 9, 2026',  workers: 1145, amount: '₹75,200', status: 'Remitted', ref: 'TXN-8557621' },
      { date: 'Feb 2, 2026',  workers: 1134, amount: '₹74,300', status: 'Remitted', ref: 'TXN-8539045' },
    ],
  },
};

const pastReports = [
  { month: 'April 2026',   status: 'Compliant', date: 'May 3, 2026'  },
  { month: 'March 2026',   status: 'Compliant', date: 'Apr 4, 2026'  },
  { month: 'February 2026',status: 'Compliant', date: 'Mar 4, 2026'  },
  { month: 'January 2026', status: 'Compliant', date: 'Feb 3, 2026'  },
];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function PA_Compliance() {
  const { addToast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('May 2026');

  const cfg = MONTH_DATA[selectedMonth] ?? MONTH_DATA['May 2026'];

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    // Reset the report state when switching months
    setGenerated(false);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      addToast(`${selectedMonth} compliance report generated.`, 'success');
    }, 1500);
  };

  return (
    <PlatformAdminLayout activeScreen="compliance">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: '#0F172A' }}>Compliance Center</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748B', marginTop: '4px' }}>PWFVS compliance tracking for Swiggy India</p>
        </div>

        {/* Summary card */}
        <div data-tour-id="tour-pa-compliance-card" className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F0FDF4' }}>
                <CheckCircle size={24} style={{ color: '#16A34A' }} />
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: '#0F172A' }}>
                  {cfg.complianceLabel}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                  {cfg.workersLabel} of workers have complete documentation · All contributions remitted on time
                </p>
                <div className="flex flex-wrap gap-4 mt-3">
                  {[
                    { label: 'Workers Covered', value: `${cfg.ledger[0]?.workers.toLocaleString('en-IN')} / ${(cfg.ledger[0]?.workers ?? 0 + 20).toLocaleString('en-IN')}` },
                    { label: 'Pending Docs', value: selectedMonth === 'May 2026' ? '20' : '0' },
                    { label: 'Disputes', value: '0' },
                  ].map(stat => (
                    <div key={stat.label}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8' }}>{stat.label}</p>
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Report generator */}
            <div className="flex flex-col gap-2" style={{ minWidth: '200px' }}>
              <select
                value={selectedMonth}
                onChange={e => handleMonthChange(e.target.value)}
                className="rounded-lg outline-none"
                style={{ height: '40px', border: '1px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', padding: '0 12px', background: '#FFFFFF', cursor: 'pointer' }}
              >
                {['May 2026', 'Apr 2026', 'Mar 2026', 'Feb 2026'].map(m => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <button
                data-tour-id="tour-pa-compliance-generate"
                onClick={handleGenerate}
                disabled={generating}
                className="flex items-center justify-center gap-2 rounded-lg"
                style={{
                  height: '40px',
                  background: generating ? '#93C5FD' : (generated ? '#22C55E' : '#1A3C5E'),
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '13px',
                  border: 'none',
                  cursor: generating ? 'not-allowed' : 'pointer',
                }}
              >
                {generating ? 'Generating…' : generated ? (
                  <><CheckCircle size={15} /> Report Ready</>
                ) : (
                  <><FileText size={15} /> Generate Report</>
                )}
              </button>
              {generated && (
                <button
                  onClick={() => addToast(`${selectedMonth} compliance report PDF downloaded.`, 'success')}
                  className="flex items-center justify-center gap-2 rounded-lg"
                  style={{ height: '36px', background: '#F0FDF4', color: '#16A34A', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', border: '1px solid #BBF7D0', cursor: 'pointer' }}
                >
                  <Download size={13} />
                  Download PDF
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ledger table — filtered to selectedMonth */}
          <div data-tour-id="tour-pa-compliance-ledger" className="lg:col-span-2 bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
            <div className="p-5 border-b" style={{ borderColor: '#F1F5F9' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>Contribution Ledger</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Weekly remittances to PWFVS pool · {selectedMonth}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: '480px' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    {['Date', 'Workers', 'Amount', 'Status', 'Reference'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', color: '#64748B', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cfg.ledger.map((row, i) => (
                    <tr key={i} style={{ borderBottom: i < cfg.ledger.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>{row.date}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>{row.workers.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>{row.amount}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: '#F0FDF4', color: '#16A34A', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', padding: '2px 8px', borderRadius: '100px' }}>
                          {row.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>{row.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Calendar — updates with selectedMonth */}
            <div data-tour-id="tour-pa-compliance-calendar" className="bg-white rounded-xl p-5" style={{ border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: '#0F172A', marginBottom: '12px' }}>
                Remittance Calendar — {selectedMonth}
              </h3>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAY_LABELS.map(d => (
                  <div key={d} style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '10px', color: '#94A3B8', fontWeight: 600, padding: '2px 0' }}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {/* Leading blank cells */}
                {Array.from({ length: cfg.startDow }, (_, i) => <div key={`pad-${i}`} />)}
                {/* Day cells */}
                {Array.from({ length: cfg.days }, (_, i) => {
                  const day = i + 1;
                  const isRemitted = day <= cfg.remittedThrough;
                  const isLastRemitted = day === cfg.remittedThrough && selectedMonth === 'May 2026';
                  return (
                    <div
                      key={day}
                      style={{
                        textAlign: 'center',
                        height: '26px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        background: isLastRemitted ? '#16A34A' : (isRemitted ? '#DCFCE7' : '#F1F5F9'),
                        color: isLastRemitted ? '#FFFFFF' : (isRemitted ? '#16A34A' : '#94A3B8'),
                        fontFamily: 'var(--font-body)',
                        fontWeight: isLastRemitted ? 700 : 500,
                        fontSize: '11px',
                      }}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#DCFCE7', display: 'inline-block' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#64748B' }}>Remitted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#F1F5F9', display: 'inline-block' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#64748B' }}>
                    {selectedMonth === 'May 2026' ? 'Upcoming' : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Past Reports */}
            <div className="bg-white rounded-xl p-5" style={{ border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: '#0F172A', marginBottom: '12px' }}>Past Reports</h3>
              <div className="space-y-2">
                {pastReports.map(r => (
                  <div key={r.month} className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                    <div>
                      <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>{r.month}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8' }}>Generated {r.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ background: '#F0FDF4', color: '#16A34A', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', padding: '2px 8px', borderRadius: '100px' }}>
                        {r.status}
                      </span>
                      <button onClick={() => addToast(`${r.month} report downloaded.`, 'success')} style={{ color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning — only relevant for current month */}
            {selectedMonth === 'May 2026' && (
              <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: '#FEF3C7', border: '1px solid #FCD34D' }}>
                <AlertTriangle size={16} style={{ color: '#D97706', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#92400E' }}>20 Workers Pending</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#78350F', marginTop: '2px' }}>
                    PAN or Aadhaar verification incomplete. Remittances held until documents are submitted.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PlatformAdminLayout>
  );
}
