import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Download } from 'lucide-react';
import BottomNav from './BottomNav';
import { useToast } from '../shared/ToastContext';

// 'today' | 'week' = yesterday + this week's earlier days | 'month' = all
const ALL_TRANSACTIONS = [
  { platform: 'Swiggy',  logo: 'S', bg: '#FF6B00', textColor: undefined,  amount: 80,  contribution: 1.60, time: 'Today 2:34 PM',    dayGroup: 'today' as const },
  { platform: 'Blinkit', logo: 'B', bg: '#1C1C1C', textColor: undefined,  amount: 95,  contribution: 1.90, time: 'Today 11:15 AM',   dayGroup: 'today' as const },
  { platform: 'Ola',     logo: 'O', bg: '#FFD700', textColor: '#000',     amount: 120, contribution: 2.40, time: 'Yesterday 6:48 PM', dayGroup: 'week'  as const },
  { platform: 'Swiggy',  logo: 'S', bg: '#FF6B00', textColor: undefined,  amount: 75,  contribution: 1.50, time: 'Yesterday 3:22 PM', dayGroup: 'week'  as const },
  { platform: 'Blinkit', logo: 'B', bg: '#1C1C1C', textColor: undefined,  amount: 110, contribution: 2.20, time: 'Yesterday 1:05 PM', dayGroup: 'week'  as const },
  { platform: 'Swiggy',  logo: 'S', bg: '#FF6B00', textColor: undefined,  amount: 80,  contribution: 1.60, time: '23 May',           dayGroup: 'week'  as const },
  { platform: 'Ola',     logo: 'O', bg: '#FFD700', textColor: '#000',     amount: 140, contribution: 2.80, time: '23 May',           dayGroup: 'week'  as const },
  { platform: 'Swiggy',  logo: 'S', bg: '#FF6B00', textColor: undefined,  amount: 80,  contribution: 1.60, time: '22 May',           dayGroup: 'week'  as const },
];

export default function WorkerWallet() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const protoToast = () => addToast('This is a prototype — changes won\'t be saved.', 'warning');

  const [platformFilter, setPlatformFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('month');

  // ── Apply filters ─────────────────────────────────────────────────────────
  const filtered = ALL_TRANSACTIONS.filter(tx => {
    const platOk = platformFilter === 'all' || tx.platform === platformFilter;
    let dateOk = true;
    if (dateFilter === 'today') dateOk = tx.dayGroup === 'today';
    else if (dateFilter === 'week') dateOk = tx.dayGroup === 'today' || tx.dayGroup === 'week';
    // 'month' and 'quarter' show all
    return platOk && dateOk;
  });

  // ── Summary tiles — base values for "all platforms" ─────────────────────
  const BASE = { today: 28, week: 187, month: 484 };

  // Proportional scaling when a platform filter is active
  const ratioFor = (dayGroups: ('today' | 'week')[]) => {
    const all  = ALL_TRANSACTIONS.filter(t => dayGroups.includes(t.dayGroup)).reduce((s, t) => s + t.contribution, 0);
    const plat = ALL_TRANSACTIONS.filter(t => dayGroups.includes(t.dayGroup) && t.platform === platformFilter).reduce((s, t) => s + t.contribution, 0);
    return all === 0 ? 0 : plat / all;
  };

  const summaryToday = platformFilter === 'all' ? BASE.today : Math.round(BASE.today * ratioFor(['today']));
  const summaryWeek  = platformFilter === 'all' ? BASE.week  : Math.round(BASE.week  * ratioFor(['today', 'week']));
  const summaryMonth = platformFilter === 'all' ? BASE.month : Math.round(BASE.month * ratioFor(['today', 'week']));

  const noResults = filtered.length === 0;

  return (
    <div data-tour-id="tour-worker-wallet-page" className="min-h-screen pb-16" style={{ background: '#F8FAFC' }}>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-4 flex items-center justify-between" style={{ height: '56px', borderColor: '#E2E8F0' }}>
        <button onClick={() => navigate('/worker/home')}>
          <ArrowLeft size={24} style={{ color: '#0F172A' }} />
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '18px', color: '#0F172A' }}>
          My Wallet
        </h1>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: '#0EA5E9' }}>
          Rs 1,840
        </p>
      </div>

      <div className="px-4 pt-4">
        {/* Summary Row */}
        <div data-tour-id="tour-wallet-summary" className="grid grid-cols-3 gap-2">
          {[
            { label: 'Today',      amount: summaryToday },
            { label: 'This Week',  amount: summaryWeek  },
            { label: 'This Month', amount: summaryMonth },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg p-3"
              style={{ border: '1.5px solid #0EA5E9', background: '#F0F9FF' }}
            >
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B' }}>
                {item.label}
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: '#0F172A' }}>
                Rs {item.amount}
              </p>
            </div>
          ))}
        </div>

        {/* Platform Breakdown donut */}
        <div data-tour-id="tour-wallet-donut" className="mt-5 flex flex-col items-center">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="10" />
              {/* Swiggy 42% */}
              <circle cx="50" cy="50" r="40" fill="none" stroke="#FF6B00" strokeWidth="10"
                strokeDasharray="105 251" strokeDashoffset="0" />
              {/* Blinkit 31% */}
              <circle cx="50" cy="50" r="40" fill="none" stroke="#1C1C1C" strokeWidth="10"
                strokeDasharray="78 251" strokeDashoffset="-105" />
              {/* Ola 27% */}
              <circle cx="50" cy="50" r="40" fill="none" stroke="#FFD700" strokeWidth="10"
                strokeDasharray="68 251" strokeDashoffset="-183" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>
                Rs 1,840
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B' }}>
                Total
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            {[
              { label: 'Swiggy 42%', color: '#FF6B00' },
              { label: 'Blinkit 31%', color: '#1C1C1C' },
              { label: 'Ola 27%', color: '#FFD700' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div data-tour-id="tour-wallet-filters" className="flex gap-2 mt-5">
          <select
            value={platformFilter}
            onChange={e => setPlatformFilter(e.target.value)}
            className="flex-1 px-3 rounded-md outline-none"
            style={{ height: '36px', border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '13px' }}
          >
            <option value="all">Platform: All</option>
            <option value="Swiggy">Swiggy</option>
            <option value="Blinkit">Blinkit</option>
            <option value="Ola">Ola</option>
          </select>
          <select
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="flex-1 px-3 rounded-md outline-none"
            style={{ height: '36px', border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '13px' }}
          >
            <option value="month">Date: This Month</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="quarter">Last 3 Months</option>
          </select>
        </div>

        {/* Active filter chips */}
        {(platformFilter !== 'all' || dateFilter !== 'month') && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {platformFilter !== 'all' && (
              <span
                className="flex items-center gap-1 px-2.5 py-1 rounded-full"
                style={{ background: '#EFF6FF', color: '#2563EB', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '11px', border: '1px solid #BFDBFE' }}
              >
                {platformFilter}
                <button onClick={() => setPlatformFilter('all')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1, color: '#2563EB', marginLeft: '2px' }}>×</button>
              </span>
            )}
            {dateFilter !== 'month' && (
              <span
                className="flex items-center gap-1 px-2.5 py-1 rounded-full"
                style={{ background: '#EFF6FF', color: '#2563EB', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '11px', border: '1px solid #BFDBFE' }}
              >
                {dateFilter === 'today' ? 'Today' : dateFilter === 'week' ? 'This Week' : 'Last 3 Months'}
                <button onClick={() => setDateFilter('month')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1, color: '#2563EB', marginLeft: '2px' }}>×</button>
              </span>
            )}
          </div>
        )}

        {/* Live Indicator */}
        <div className="flex items-center justify-end gap-1.5 mt-5">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22C55E' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '11px', color: '#22C55E' }}>
            LIVE
          </span>
        </div>

        {/* Transaction List */}
        <div data-tour-id="tour-wallet-transactions" className="mt-3">
          {noResults ? (
            <div className="py-10 text-center">
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#94A3B8' }}>
                No transactions match the selected filters.
              </p>
              <button
                onClick={() => { setPlatformFilter('all'); setDateFilter('month'); }}
                style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0EA5E9', background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px' }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            filtered.map((tx, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-4 py-4"
                style={{
                  background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
                  borderBottom: '1px solid #F1F5F9',
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: tx.bg }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: tx.textColor || '#FFFFFF' }}>
                    {tx.logo}
                  </span>
                </div>
                <div className="flex-1">
                  <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A' }}>
                    {tx.platform} Delivery Completed
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#94A3B8' }}>
                    {tx.time}
                  </p>
                </div>
                <div className="text-right">
                  <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A' }}>
                    Rs {tx.amount}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#22C55E' }}>
                    Rs {tx.contribution.toFixed(2)} contributed
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Download Button */}
        <button
          data-tour-id="tour-wallet-download"
          onClick={protoToast}
          className="w-full mt-6 rounded-md flex items-center justify-center gap-2 mb-4"
          style={{
            height: '44px',
            border: '1.5px solid #E2E8F0',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: '14px',
            color: '#64748B',
            cursor: 'pointer',
          }}
        >
          <Download size={16} />
          Download Statement
        </button>
      </div>

      <BottomNav active="wallet" />
    </div>
  );
}
