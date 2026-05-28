import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import PlatformAdminLayout from './PlatformAdminLayout';
import StatCard from '../shared/StatCard';
import { useSimulation } from '../../simulation/SimulationContext';
import { useTour } from '../../contexts/TourContext';
import TourPromptModal from '../worker/TourPromptModal';
import { Users, IndianRupee, CheckCircle, AlertTriangle, UserPlus, Search, FileCheck, TrendingUp, Play } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const trendData = Array.from({ length: 30 }, (_, i) => ({
  day: `May ${i + 1}`,
  amount: Math.round(40000 + (i / 29) * 51000 + (Math.random() - 0.5) * 3000),
}));

const INITIAL_ACTIVITY = [
  { color: '#22C55E', text: 'Ravi Kumar (GS-2026-08401) registered successfully', time: '2 min ago' },
  { color: '#0EA5E9', text: 'Priya Menon downloaded compliance report for April 2026', time: '15 min ago' },
  { color: '#F59E0B', text: "Meena Sharma's PAN verification pending", time: '32 min ago' },
  { color: '#22C55E', text: '₹1,24,000 contributions remitted to ESIC pool', time: '1 hr ago' },
  { color: '#EF4444', text: 'Sanjay Patel flagged: Aadhaar mismatch', time: '2 hr ago' },
  { color: '#22C55E', text: 'Worker Arjun Singh (GS-2026-08399) onboarded via Swiggy API', time: '3 hr ago' },
  { color: '#0EA5E9', text: 'Monthly PWFVS report auto-generated and archived', time: '5 hr ago' },
  { color: '#F59E0B', text: 'Contribution rate update scheduled for June 1', time: '8 hr ago' },
];

const PA_PLATFORMS = ['Swiggy', 'Blinkit', 'Ola'];

// Compact shared styles
const compactInput: React.CSSProperties = {
  height: '30px', width: '100%', border: '1px solid #E2E8F0',
  borderRadius: '6px', fontFamily: 'var(--font-body)', fontSize: '12px',
  color: '#0F172A', padding: '0 8px', outline: 'none', background: '#FFFFFF',
};

// ── Delivery popover ─────────────────────────────────────────────────────────
interface DeliveryPopoverProps {
  workerNames: string[];
  onFire: (workerName: string, platform: string, amount: number) => void;
  onClose: () => void;
}
function DeliveryPopover({ workerNames, onFire, onClose }: DeliveryPopoverProps) {
  const [worker, setWorker] = useState(workerNames[0] ?? 'Raju Yadav');
  const [platform, setPlatform] = useState('Swiggy');
  const [amount, setAmount] = useState(80);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    setTimeout(() => document.addEventListener('mousedown', handler), 10);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute z-50 bg-white rounded-lg" style={{
      top: '34px', right: 0, width: '210px',
      border: '1px solid #E2E8F0', padding: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    }}>
      <div className="space-y-2 mb-3">
        <div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B', marginBottom: '3px' }}>Worker</p>
          <select value={worker} onChange={e => setWorker(e.target.value)} style={compactInput}>
            {workerNames.map(n => <option key={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B', marginBottom: '3px' }}>Platform</p>
          <select value={platform} onChange={e => setPlatform(e.target.value)} style={compactInput}>
            {PA_PLATFORMS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B', marginBottom: '3px' }}>Amount (Rs)</p>
          <input type="number" value={amount} min={1} onChange={e => setAmount(Number(e.target.value))} style={compactInput} />
        </div>
      </div>
      <button
        onClick={() => { onFire(worker, platform, amount); onClose(); }}
        style={{
          width: '100%', height: '32px', borderRadius: '6px', border: 'none', cursor: 'pointer',
          background: '#22C55E', color: '#FFFFFF',
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
        }}
      >
        Fire Delivery
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PA_Dashboard() {
  const navigate = useNavigate();
  const { state, fireDelivery } = useSimulation();
  const { isDone, startTour } = useTour();
  const [showTourPrompt, setShowTourPrompt] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('May 2026');
  const [localActivity, setLocalActivity] = useState(INITIAL_ACTIVITY);
  const [deliveryOpen, setDeliveryOpen] = useState(false);

  // Show tour prompt on first visit
  useEffect(() => {
    if (!isDone('platform-admin')) {
      const t = setTimeout(() => setShowTourPrompt(true), 700);
      return () => clearTimeout(t);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Base monthly contributions in paise (Rs 21,60,000 = 2160000)
  const [monthlyContribsRaw, setMonthlyContribsRaw] = useState(2160000);
  const formatContribs = (n: number) => `₹${(n / 100000).toFixed(1)}L`;

  const workerNames = state.workers.map(w => w.name);

  const handleFire = (workerName: string, platform: string, amount: number) => {
    const contribution = parseFloat((amount * 0.02).toFixed(2));
    // Update shared simulation context (so SA_Dashboard also reflects it)
    fireDelivery({ workerName, platform, amount });
    // Also update local PA activity feed
    setLocalActivity(prev => [
      {
        color: '#22C55E',
        text: `${workerName} completed ${platform} delivery · Rs ${contribution.toFixed(2)} contributed`,
        time: 'Just now',
      },
      ...prev,
    ]);
    // Increment local monthly contributions KPI
    setMonthlyContribsRaw(prev => prev + contribution);
  };

  return (
    <>
    <PlatformAdminLayout activeScreen="dashboard">
      <style>{`
        @keyframes paFeedSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pa-feed-new { animation: paFeedSlide 200ms ease-out forwards; background: #F0FDF4; border-radius: 6px; }
      `}</style>

      <div className="p-6 space-y-6">
        {/* Compliance banner */}
        <div data-tour-id="tour-pa-compliance-banner" className="w-full px-5 py-4 rounded-xl flex items-center gap-3" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
          <CheckCircle size={20} style={{ color: '#16A34A', flexShrink: 0 }} />
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px', color: '#14532D' }}>
              Swiggy India is fully compliant for May 2026
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#166534' }}>
              All PWFVS contributions remitted · ESIC records up to date · 0 pending disputes
            </p>
          </div>
          <div data-tour-id="tour-pa-month-select" className="ml-auto flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="rounded-lg outline-none"
              style={{ border: '1px solid #BBF7D0', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#14532D', padding: '4px 10px', background: '#FFFFFF', cursor: 'pointer' }}
            >
              {['May 2026', 'Apr 2026', 'Mar 2026', 'Feb 2026'].map(m => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stat cards */}
        <div data-tour-id="tour-pa-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active Workers"      value="1,284"                          icon={<Users size={28} />}       iconColor="#0EA5E9" caption="+12 this month" />
          <StatCard label="Contributions (May)" value={formatContribs(monthlyContribsRaw)} icon={<IndianRupee size={28} />} iconColor="#22C55E" caption="↑ 8.3% vs Apr" />
          <StatCard label="Compliant Workers"   value="98.4%"                          icon={<CheckCircle size={28} />} iconColor="#16A34A" caption="20 pending review" />
          <StatCard label="Open Flags"          value="7"                              icon={<AlertTriangle size={28} />} iconColor="#F59E0B" caption="3 high priority" />
        </div>

        {/* Chart */}
        <div data-tour-id="tour-pa-chart" className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>Daily Contribution Trend</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>May 2026 · ₹ per day</p>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ width: '10px', height: '3px', background: '#0EA5E9', borderRadius: '2px', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>Daily total</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontFamily: 'var(--font-body)', fontSize: 10, fill: '#94A3B8' }} interval={4} />
              <YAxis tick={{ fontFamily: 'var(--font-body)', fontSize: 10, fill: '#94A3B8' }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Contributions']} labelStyle={{ fontFamily: 'var(--font-body)', fontSize: '12px' }} contentStyle={{ fontFamily: 'var(--font-body)', fontSize: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
              <Line type="monotone" dataKey="amount" stroke="#0EA5E9" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity — 2A: Simulate Delivery pill in header */}
          <div data-tour-id="tour-pa-activity" className="lg:col-span-2 bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
            <div className="flex items-center justify-between mb-4 gap-3">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>Recent Activity</h3>
              <div data-tour-id="tour-pa-simulate-delivery" className="relative flex-shrink-0">
                <button
                  onClick={() => setDeliveryOpen(o => !o)}
                  className="flex items-center gap-1.5"
                  style={{
                    height: '28px', padding: '0 12px',
                    border: '1px solid #E2E8F0', borderRadius: '100px',
                    background: '#FFFFFF', cursor: 'pointer',
                    fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '12px', color: '#64748B',
                  }}
                >
                  <Play size={11} style={{ color: '#22C55E' }} />
                  Simulate Delivery
                </button>
                {deliveryOpen && (
                  <DeliveryPopover
                    workerNames={workerNames}
                    onFire={handleFire}
                    onClose={() => setDeliveryOpen(false)}
                  />
                )}
              </div>
            </div>

            <div className="space-y-3">
              {localActivity.map((a, i) => (
                <div key={i} className={`flex items-start gap-3 px-2 py-1 -mx-2 rounded-md ${i === 0 && a.time === 'Just now' ? 'pa-feed-new' : ''}`}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.color, flexShrink: 0, marginTop: '5px' }} />
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', lineHeight: '1.5' }}>{a.text}</p>
                  </div>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8', flexShrink: 0, whiteSpace: 'nowrap' }}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div data-tour-id="tour-pa-quick-actions" className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '16px' }}>Quick Actions</h3>
            <div className="space-y-3">
              {[
                { icon: UserPlus, label: 'Register New Worker', sub: 'Add to platform',      color: '#0EA5E9', path: '/platform-admin/register' },
                { icon: Search,   label: 'Worker Search',       sub: 'Find by ID or phone',  color: '#22C55E', path: '/platform-admin/search' },
                { icon: FileCheck,label: 'Run Compliance Check',sub: 'Generate report',      color: '#F59E0B', path: '/platform-admin/compliance' },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button key={action.label} onClick={() => navigate(action.path)}
                    className="flex items-center gap-3 p-3 rounded-lg w-full"
                    style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${action.color}20` }}>
                      <Icon size={18} style={{ color: action.color }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>{action.label}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B' }}>{action.sub}</p>
                    </div>
                    <TrendingUp size={14} style={{ color: '#94A3B8', marginLeft: 'auto' }} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PlatformAdminLayout>

    {showTourPrompt && (
      <TourPromptModal
        tourType="platform-admin"
        variant="desktop"
        onYes={() => { setShowTourPrompt(false); startTour('platform-admin'); }}
        onNo={() => { setShowTourPrompt(false); localStorage.setItem('gigshield_tour_done_pa', '1'); }}
      />
    )}
    </>
  );
}
