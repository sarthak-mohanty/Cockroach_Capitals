import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import SuperAdminLayout from './SuperAdminLayout';
import StatCard from '../shared/StatCard';
import ConfirmModal from '../shared/ConfirmModal';
import { useSimulation } from '../../simulation/SimulationContext';
import { useTour } from '../../contexts/TourContext';
import TourPromptModal from '../worker/TourPromptModal';
import { Globe, Users, IndianRupee, TrendingUp, Shield, AlertTriangle, CheckCircle, Activity, Settings, RotateCcw, Zap, UserPlus, Play } from 'lucide-react';

// ── Animated counter hook ────────────────────────────────────────────────────
function useAnimatedValue(target: number, duration = 400) {
  const [displayed, setDisplayed] = useState(target);
  const prevRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevRef.current === target) return;
    const from = prevRef.current;
    prevRef.current = target;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 2);
      setDisplayed(from + (target - from) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return displayed;
}

// ── Compact pill button ───────────────────────────────────────────────────────
function PillBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        height: '28px', padding: '0 12px',
        border: '1px solid #E2E8F0', borderRadius: '100px',
        background: '#FFFFFF', cursor: 'pointer',
        fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '12px', color: '#64748B',
        whiteSpace: 'nowrap', flexShrink: 0,
      }}
    >
      {label}
    </button>
  );
}

// ── Compact select + input shared styles ────────────────────────────────────
const compactInput: React.CSSProperties = {
  height: '30px', width: '100%', border: '1px solid #E2E8F0',
  borderRadius: '6px', fontFamily: 'var(--font-body)', fontSize: '12px',
  color: '#0F172A', padding: '0 8px', outline: 'none', background: '#FFFFFF',
};

// ── Delivery popover form ────────────────────────────────────────────────────
interface DeliveryPopoverProps {
  workerNames: string[];
  platforms: string[];
  onFire: (workerName: string, platform: string, amount: number) => void;
  onClose: () => void;
}
function DeliveryPopover({ workerNames, platforms, onFire, onClose }: DeliveryPopoverProps) {
  const [worker, setWorker] = useState(workerNames[0] ?? '');
  const [platform, setPlatform] = useState(platforms[0] ?? 'Swiggy');
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
    <div ref={ref} className="absolute z-50 bg-white rounded-lg shadow-lg" style={{
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
            {platforms.map(p => <option key={p}>{p}</option>)}
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

// ── Register worker popover ──────────────────────────────────────────────────
interface RegisterPopoverProps {
  platforms: string[];
  onRegister: (name: string, phone: string, platform: string) => void;
  onClose: () => void;
}
function RegisterPopover({ platforms, onRegister, onClose }: RegisterPopoverProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [platform, setPlatform] = useState(platforms[0] ?? 'Swiggy');
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
      top: '34px', right: 0, width: '220px',
      border: '1px solid #E2E8F0', padding: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    }}>
      <div className="space-y-2 mb-3">
        <div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B', marginBottom: '3px' }}>Name</p>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Worker name" style={compactInput} />
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B', marginBottom: '3px' }}>Phone</p>
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit number" style={compactInput} />
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B', marginBottom: '3px' }}>Platform</p>
          <select value={platform} onChange={e => setPlatform(e.target.value)} style={compactInput}>
            {platforms.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <button
        onClick={() => {
          if (!name.trim() || !phone.trim()) return;
          onRegister(name.trim(), phone.trim(), platform);
          onClose();
        }}
        style={{
          width: '100%', height: '32px', borderRadius: '6px', border: 'none', cursor: 'pointer',
          background: '#0EA5E9', color: '#FFFFFF',
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
        }}
      >
        Register
      </button>
    </div>
  );
}

// ── Static platform data (unchanged) ─────────────────────────────────────────
const platforms = [
  { name: 'Swiggy India',  workers: '1,284', compliant: '98.4%', contribution: '₹21.6L', status: 'active',  color: '#FF6B00' },
  { name: 'Blinkit',       workers: '876',   compliant: '96.1%', contribution: '₹14.2L', status: 'active',  color: '#FCD34D' },
  { name: 'Ola Electric',  workers: '542',   compliant: '94.7%', contribution: '₹9.8L',  status: 'active',  color: '#22C55E' },
  { name: 'Porter',        workers: '218',   compliant: '91.3%', contribution: '₹3.9L',  status: 'pending', color: '#8B5CF6' },
];

const revenueCards = [
  { label: 'Platform Licensing',   value: '₹12.4L', color: '#0EA5E9' },
  { label: 'Loan Book Interest',   value: '₹4.2L',  color: '#22C55E' },
  { label: 'Insurance Premium Cut', value: '₹2.8L', color: '#8B5CF6' },
  { label: 'Transaction Fees',     value: '₹1.1L',  color: '#F59E0B' },
  { label: 'Total MRR',            value: '₹20.5L', color: '#EF4444' },
];

const SA_PLATFORMS = ['Swiggy', 'Blinkit', 'Ola', 'Rapido'];

// ── Main component ────────────────────────────────────────────────────────────
export default function SA_Dashboard() {
  const navigate = useNavigate();
  const { state, fireDelivery, registerWorker, fireMultiPlatformDelivery, fullSystemReset } = useSimulation();
  const { isDone, startTour } = useTour();
  const [showTourPrompt, setShowTourPrompt] = useState(false);
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Show tour prompt on first visit
  useEffect(() => {
    if (!isDone('super-admin')) {
      const t = setTimeout(() => setShowTourPrompt(true), 700);
      return () => clearTimeout(t);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Animated counters
  const animatedWorkers = useAnimatedValue(state.totalWorkers);
  const animatedContribs = useAnimatedValue(state.totalContributions);

  // Worker names for the popover dropdown
  const workerNames = state.workers.map(w => w.name);

  const handleFire = useCallback((workerName: string, platform: string, amount: number) => {
    fireDelivery({ workerName, platform, amount });
  }, [fireDelivery]);

  const handleRegister = useCallback((name: string, phone: string, platform: string) => {
    registerWorker({ name, phone, city: 'Bengaluru', platform });
  }, [registerWorker]);

  const handleMultiPlatform = useCallback(() => {
    fireMultiPlatformDelivery({ workerName: 'Raju Yadav' });
  }, [fireMultiPlatformDelivery]);

  const formatContribs = (n: number) => `₹${(n / 100000).toFixed(1)}L`;

  return (
    <>
    <SuperAdminLayout activeScreen="dashboard" title="System Dashboard">
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .feed-row-new {
          animation: slideDown 200ms ease-out forwards;
          background: #F0FDF4 !important;
          transition: background 800ms ease-out;
        }
      `}</style>

      <div className="p-6 space-y-6">
        {/* Health banner */}
        <div className="bg-white rounded-xl px-6 py-4" style={{ border: '1px solid #E2E8F0' }}>
          <div className="flex flex-wrap items-center gap-0">
            {[
              { label: 'API Gateway', ok: true },
              { label: 'PWFVS Integration', ok: true },
              { label: 'ESIC Sync', ok: true },
              { label: 'Payment Rail', ok: true },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center">
                <div className="flex items-center gap-2 px-4 py-1">
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.ok ? '#22C55E' : '#EF4444', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: item.ok ? '#16A34A' : '#DC2626' }}>{item.ok ? 'Operational' : 'Degraded'}</span>
                </div>
                {i < 3 && <div style={{ width: '1px', height: '20px', background: '#E2E8F0' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* 6 KPI Cards — totalWorkers and totalContributions are animated */}
        <div data-tour-id="tour-sa-kpis" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Total Workers"     value={Math.round(animatedWorkers).toLocaleString('en-IN')} icon={<Users size={22} />}       iconColor="#0EA5E9" />
          <StatCard label="Active Platforms"  value="4"                                                    icon={<Globe size={22} />}       iconColor="#22C55E" />
          <StatCard label="Pool Size"         value={formatContribs(animatedContribs)}                     icon={<IndianRupee size={22} />} iconColor="#16A34A" />
          <StatCard label="MRR"               value="₹20.5L"                                               icon={<TrendingUp size={22} />}  iconColor="#8B5CF6" />
          <StatCard label="Active Loans"      value="84"                                                    icon={<Activity size={22} />}   iconColor="#F59E0B" />
          <StatCard label="Open Claims"       value="12"                                                    icon={<Shield size={22} />}     iconColor="#EF4444" />
        </div>

        {/* Platform Breakdown table */}
        <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
          <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>Platform Overview</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', marginTop: '2px' }}>Click any row to view platform detail</p>
            </div>
            {/* 2B — Multi-Platform Demo pill */}
            <button
              onClick={handleMultiPlatform}
              className="flex items-center gap-1.5"
              style={{
                height: '28px', padding: '0 12px',
                border: '1px solid #E2E8F0', borderRadius: '100px',
                background: '#FFFFFF', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '12px', color: '#64748B',
              }}
            >
              <Zap size={12} style={{ color: '#F59E0B' }} />
              Multi-Platform Demo
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: '560px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  {['Platform', 'Workers', 'Compliance', 'May Contribution', 'Status'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', color: '#64748B', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {platforms.map((p, i) => (
                  <tr
                    key={p.name}
                    onClick={() => navigate('/super-admin/platforms')}
                    onMouseEnter={() => setHoveredPlatform(p.name)}
                    onMouseLeave={() => setHoveredPlatform(null)}
                    style={{
                      borderBottom: i < platforms.length - 1 ? '1px solid #F1F5F9' : 'none',
                      background: hoveredPlatform === p.name ? '#F8FAFC' : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${p.color}20` }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '12px', color: p.color }}>{p.name[0]}</span>
                        </div>
                        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px', color: '#0F172A' }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>{p.workers}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div className="flex items-center gap-2">
                        <div style={{ flex: 1, height: '6px', background: '#F1F5F9', borderRadius: '3px', minWidth: '60px' }}>
                          <div style={{ width: p.compliant, height: '6px', background: '#22C55E', borderRadius: '3px' }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#0F172A', fontWeight: 600, minWidth: '36px' }}>{p.compliant}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>{p.contribution}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        background: p.status === 'active' ? '#F0FDF4' : '#FEF3C7',
                        color: p.status === 'active' ? '#16A34A' : '#D97706',
                        fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', padding: '2px 8px', borderRadius: '100px'
                      }}>
                        {p.status === 'active' ? 'Active' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {revenueCards.map(r => (
            <div key={r.label} className="bg-white rounded-xl p-4" style={{ border: '1px solid #E2E8F0' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B', marginBottom: '6px' }}>{r.label}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', color: r.color }}>{r.value}</p>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Activity feed — 2A: pill buttons in card header */}
          <div data-tour-id="tour-sa-activity" className="lg:col-span-2 bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
            <div className="flex items-center justify-between mb-4 gap-3">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>Live Activity</h3>
              {/* Ops Controls pills */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="relative">
                  <PillBtn label="＋ Fire Delivery" onClick={() => { setRegisterOpen(false); setDeliveryOpen(o => !o); }} />
                  {deliveryOpen && (
                    <DeliveryPopover
                      workerNames={workerNames}
                      platforms={SA_PLATFORMS}
                      onFire={handleFire}
                      onClose={() => setDeliveryOpen(false)}
                    />
                  )}
                </div>
                <div className="relative">
                  <PillBtn label="＋ Register Worker" onClick={() => { setDeliveryOpen(false); setRegisterOpen(o => !o); }} />
                  {registerOpen && (
                    <RegisterPopover
                      platforms={SA_PLATFORMS}
                      onRegister={handleRegister}
                      onClose={() => setRegisterOpen(false)}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Activity feed — isNew items get slide-down + green flash */}
            <div className="space-y-3">
              {state.activityFeed.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 rounded-md px-2 py-1 -mx-2 ${item.isNew ? 'feed-row-new' : ''}`}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0, marginTop: '5px' }} />
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', flex: 1 }}>{item.text}</p>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8', flexShrink: 0, whiteSpace: 'nowrap' }}>{item.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions — Test Harness removed */}
          <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '16px' }}>Quick Actions</h3>
            <div className="space-y-3">
              {[
                { icon: Globe,          label: 'Add New Platform',  sub: 'Onboard a partner',       color: '#0EA5E9', path: '/super-admin/platforms' },
                { icon: AlertTriangle,  label: 'View Audit Log',    sub: 'Recent system events',    color: '#F59E0B', path: '/super-admin/audit' },
                { icon: Settings,       label: 'Configuration',     sub: 'Rates & SMS templates',   color: '#8B5CF6', path: '/super-admin/configuration' },
              ].map(action => {
                const Icon = action.icon;
                return (
                  <button key={action.label} onClick={() => navigate(action.path)}
                    className="flex items-center gap-3 p-3 rounded-lg w-full"
                    style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${action.color}20` }}>
                      <Icon size={16} style={{ color: action.color }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>{action.label}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B' }}>{action.sub}</p>
                    </div>
                    <CheckCircle size={13} style={{ color: '#94A3B8', marginLeft: 'auto' }} />
                  </button>
                );
              })}

              {/* Multi-platform demo shortcut */}
              <button
                onClick={handleMultiPlatform}
                className="flex items-center gap-3 p-3 rounded-lg w-full"
                style={{ background: '#FFF7ED', border: '1px solid #FED7AA', textDecoration: 'none', cursor: 'pointer' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#FED7AA' }}>
                  <Play size={16} style={{ color: '#EA580C' }} />
                </div>
                <div className="text-left">
                  <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>Multi-Platform Demo</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B' }}>Fire 3 platforms simultaneously</p>
                </div>
                <Zap size={13} style={{ color: '#F59E0B', marginLeft: 'auto' }} />
              </button>
            </div>
          </div>
        </div>

        {/* 2E — System Reset danger zone */}
        <div className="flex items-center justify-between rounded-lg px-4 py-3"
          style={{ border: '1px dashed #FECACA', background: '#FFF5F5' }}>
          <div className="flex items-center gap-2">
            <RotateCcw size={16} style={{ color: '#EF4444' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#EF4444' }}>
              Reset Demo State
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#94A3B8' }}>
              — Restores all workers, activity feed, and KPIs to defaults
            </span>
          </div>
          <button
            onClick={() => setResetModalOpen(true)}
            style={{
              height: '28px', width: '64px', borderRadius: '6px', flexShrink: 0,
              border: '1px solid #EF4444', background: 'transparent',
              color: '#EF4444', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Reset confirmation modal */}
      <ConfirmModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={() => fullSystemReset({ confirmationString: 'CONFIRM RESET' })}
        title="Reset Demo State?"
        description="This will restore all workers, the activity feed, and all KPIs to their default values. Type CONFIRM RESET to proceed."
        confirmLabel="Reset Everything"
        confirmVariant="danger"
        requireTypedConfirm="CONFIRM RESET"
      />
    </SuperAdminLayout>

    {showTourPrompt && (
      <TourPromptModal
        tourType="super-admin"
        variant="desktop"
        onYes={() => { setShowTourPrompt(false); startTour('super-admin'); }}
        onNo={() => { setShowTourPrompt(false); localStorage.setItem('gigshield_tour_done_sa', '1'); }}
      />
    )}
  </>
  );
}
