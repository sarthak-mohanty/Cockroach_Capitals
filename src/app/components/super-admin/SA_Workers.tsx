import { useState, useRef, useEffect } from 'react';
import SuperAdminLayout from './SuperAdminLayout';
import SlidePanel from '../shared/SlidePanel';
import Badge from '../shared/Badge';
import { useToast } from '../shared/ToastContext';
import { useSimulation, SimWorker } from '../../simulation/SimulationContext';
import { Search, ChevronDown, ChevronUp, IndianRupee, Plus, Download, Play, History } from 'lucide-react';

// ── Static worker interface (for the detail panel) ────────────────────────────
interface Worker {
  id: string;
  name: string;
  phone: string;
  platforms: string[];
  status: 'active' | 'inactive' | 'pending';
  compliance: 'compliant' | 'non-compliant' | 'pending';
  city: string;
  wallet: string;
  walletNum: number;
  aadhaar: string;
  pan: string;
  totalContrib: string;
  trips: number;
  loans: number;
  claims: number;
  fromSim?: boolean; // true for newly registered demo workers
}

// ── Base hardcoded workers (includes Raju Yadav for demo script) ──────────────
const BASE_WORKERS: Worker[] = [
  { id: 'GS-2024-0847291', name: 'Raju Yadav',     phone: '+91-99999 99999', platforms: ['Swiggy', 'Blinkit', 'Ola'], status: 'active',   compliance: 'compliant',     city: 'Bengaluru',  wallet: '₹1,840', walletNum: 1840, aadhaar: '0000-0000-0001', pan: 'ABCRY0847F', totalContrib: '₹4,200', trips: 47,  loans: 0, claims: 1 },
  { id: 'GS-2026-08401',   name: 'Ravi Kumar',     phone: '+91 98765 43201',  platforms: ['Swiggy', 'Blinkit'],        status: 'active',   compliance: 'compliant',     city: 'Bengaluru',  wallet: '₹4,230', walletNum: 4230, aadhaar: '1234-5678-9012', pan: 'ABCKR1234F', totalContrib: '₹12,450', trips: 342, loans: 1, claims: 0 },
  { id: 'GS-2026-08402',   name: 'Meena Sharma',   phone: '+91 87654 32102',  platforms: ['Swiggy'],                   status: 'active',   compliance: 'pending',       city: 'Bengaluru',  wallet: '₹2,100', walletNum: 2100, aadhaar: '2345-6789-0123', pan: 'ABCMS5678F', totalContrib: '₹7,200', trips: 198, loans: 0, claims: 1 },
  { id: 'GS-2026-08403',   name: 'Sanjay Patel',   phone: '+91 76543 21003',  platforms: ['Swiggy'],                   status: 'active',   compliance: 'non-compliant', city: 'Mumbai',     wallet: '₹890',   walletNum: 890,  aadhaar: '3456-7890-1234', pan: 'ABCSP9012F', totalContrib: '₹3,100', trips: 89,  loans: 0, claims: 0 },
  { id: 'GS-2026-08404',   name: 'Arjun Singh',    phone: '+91 65432 10904',  platforms: ['Swiggy', 'Ola'],            status: 'active',   compliance: 'compliant',     city: 'Delhi',      wallet: '₹6,780', walletNum: 6780, aadhaar: '4567-8901-2345', pan: 'ABCAS3456F', totalContrib: '₹18,900', trips: 521, loans: 2, claims: 0 },
  { id: 'GS-2026-08405',   name: 'Fatima Bano',    phone: '+91 54321 09805',  platforms: ['Blinkit'],                  status: 'inactive', compliance: 'compliant',     city: 'Hyderabad',  wallet: '₹1,450', walletNum: 1450, aadhaar: '5678-9012-3456', pan: 'ABCFB7890F', totalContrib: '₹5,600', trips: 156, loans: 0, claims: 0 },
  { id: 'GS-2026-08406',   name: 'Kiran Reddy',    phone: '+91 43210 98706',  platforms: ['Ola'],                      status: 'active',   compliance: 'compliant',     city: 'Chennai',    wallet: '₹3,120', walletNum: 3120, aadhaar: '6789-0123-4567', pan: 'ABCKR1122F', totalContrib: '₹9,700', trips: 267, loans: 0, claims: 1 },
  { id: 'GS-2026-08407',   name: 'Deepa Nair',     phone: '+91 32109 87607',  platforms: ['Swiggy', 'Porter'],         status: 'active',   compliance: 'compliant',     city: 'Bengaluru',  wallet: '₹2,890', walletNum: 2890, aadhaar: '7890-1234-5678', pan: 'ABCDN3344F', totalContrib: '₹6,850', trips: 189, loans: 1, claims: 0 },
  { id: 'GS-2026-08408',   name: 'Mohammed Imran', phone: '+91 21098 76508',  platforms: ['Porter'],                   status: 'pending',  compliance: 'pending',       city: 'Pune',       wallet: '₹0',     walletNum: 0,    aadhaar: '8901-2345-6789', pan: 'ABCMI5566F', totalContrib: '₹0', trips: 0, loans: 0, claims: 0 },
];

const platformColors: Record<string, string> = {
  Swiggy: '#FF6B00', Blinkit: '#CA8A04', Ola: '#16A34A', Porter: '#7C3AED', Rapido: '#2563EB',
};

const ALL_PLATFORMS = ['Swiggy', 'Blinkit', 'Ola', 'Rapido', 'Porter'];

// ── Compact shared styles ─────────────────────────────────────────────────────
const compactInput: React.CSSProperties = {
  height: '28px', border: '1px solid #E2E8F0', borderRadius: '6px',
  fontFamily: 'var(--font-body)', fontSize: '12px', color: '#0F172A',
  padding: '0 8px', outline: 'none', background: '#FFFFFF',
};

// ── Register popover ─────────────────────────────────────────────────────────
interface RegisterPopoverProps {
  onRegister: (name: string, phone: string, platform: string) => void;
  onClose: () => void;
}
function RegisterPopover({ onRegister, onClose }: RegisterPopoverProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [platform, setPlatform] = useState('Swiggy');
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
        {[
          { label: 'Name',     value: name,     set: setName,   placeholder: 'Worker name',     type: 'text' },
          { label: 'Phone',    value: phone,    set: setPhone,  placeholder: '10-digit number', type: 'tel' },
        ].map(f => (
          <div key={f.label}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B', marginBottom: '3px' }}>{f.label}</p>
            <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ ...compactInput, width: '100%' }} />
          </div>
        ))}
        <div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B', marginBottom: '3px' }}>Platform</p>
          <select value={platform} onChange={e => setPlatform(e.target.value)} style={{ ...compactInput, width: '100%' }}>
            {ALL_PLATFORMS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <button
        onClick={() => {
          if (!name.trim() || !phone.trim()) return;
          onRegister(name.trim(), phone.trim(), platform);
          onClose();
        }}
        style={{ width: '100%', height: '30px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: '#0EA5E9', color: '#FFFFFF', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px' }}
      >
        Register
      </button>
    </div>
  );
}

// ── Row-level simulate panel ─────────────────────────────────────────────────
interface SimPanelProps {
  worker: Worker;
  simWorker?: SimWorker;
  onClose: () => void;
}
function SimulatePanel({ worker, simWorker, onClose }: SimPanelProps) {
  const { fireDelivery, generate30DayHistory } = useSimulation();
  const [platform, setPlatform] = useState(worker.platforms[0]);
  const [amount, setAmount] = useState(80);
  const isRaju = worker.name === 'Raju Yadav';

  return (
    <tr style={{ background: '#F0FDF4', borderTop: '1px solid #86EFAC', borderBottom: '1px solid #86EFAC' }}>
      <td colSpan={9} style={{ padding: '10px 16px' }}>
        <div className="flex flex-wrap items-center gap-3">
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#16A34A', fontWeight: 600, background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '4px', padding: '1px 6px' }}>
            For prototype demonstration · not present in production
          </span>
          <select value={platform} onChange={e => setPlatform(e.target.value)} style={{ ...compactInput, width: '120px' }}>
            {worker.platforms.map(p => <option key={p}>{p}</option>)}
          </select>
          <div className="flex items-center gap-1">
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>Rs</span>
            <input type="number" value={amount} min={1} onChange={e => setAmount(Number(e.target.value))} style={{ ...compactInput, width: '64px' }} />
          </div>
          <button
            onClick={() => { fireDelivery({ workerName: worker.name, platform, amount }); onClose(); }}
            style={{ height: '28px', width: '60px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: '#22C55E', color: '#FFFFFF', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px' }}
          >
            Fire
          </button>

          {/* 30-day history — Raju Yadav row only */}
          {isRaju && (
            <button
              onClick={() => { generate30DayHistory({ workerName: worker.name }); onClose(); }}
              className="flex items-center gap-1.5"
              style={{ height: '28px', padding: '0 10px', borderRadius: '6px', border: '1px solid #86EFAC', cursor: 'pointer', background: '#FFFFFF', color: '#16A34A', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '12px' }}
            >
              <History size={12} />
              Generate 30-day history
            </button>
          )}

          <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>
            Wallet: Rs {(simWorker?.walletBalance ?? worker.walletNum).toLocaleString('en-IN')} · Deliveries: {simWorker?.deliveryCount ?? worker.trips}
          </span>

          <button onClick={onClose} style={{ marginLeft: 'auto', fontFamily: 'var(--font-body)', fontSize: '12px', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}>
            Close
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function SA_Workers() {
  const { addToast } = useToast();
  const { state, registerWorker } = useSimulation();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [complianceFilter, setComplianceFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [contribOpen, setContribOpen] = useState(false);
  const [contribAmount, setContribAmount] = useState('');
  const [contribNote, setContribNote] = useState('');
  const [addDemoOpen, setAddDemoOpen] = useState(false);
  const [simulatingRow, setSimulatingRow] = useState<string | null>(null); // worker id

  // Convert newly-registered SimWorkers (not in BASE_WORKERS) to display Workers
  const extraWorkers: Worker[] = state.workers
    .filter(sw => !BASE_WORKERS.some(bw => bw.name === sw.name))
    .map(sw => ({
      id: sw.id,
      name: sw.name,
      phone: sw.phone,
      platforms: sw.platforms,
      status: 'active' as const,
      compliance: 'pending' as const,
      city: sw.city,
      wallet: `₹${sw.walletBalance.toLocaleString('en-IN')}`,
      walletNum: sw.walletBalance,
      aadhaar: '—',
      pan: '—',
      totalContrib: '₹0',
      trips: sw.deliveryCount,
      loans: 0,
      claims: 0,
      fromSim: true,
    }));

  // Merge: extra (new registrations) at top, then base
  const ALL_WORKERS: Worker[] = [...extraWorkers, ...BASE_WORKERS];

  // Update wallet display for BASE_WORKERS from simulation state
  const workersWithLiveData: Worker[] = ALL_WORKERS.map(w => {
    const sim = state.workers.find(s => s.name === w.name);
    if (!sim) return w;
    return {
      ...w,
      wallet: `₹${sim.walletBalance.toLocaleString('en-IN')}`,
      walletNum: sim.walletBalance,
      trips: sim.deliveryCount,
    };
  });

  const filtered = workersWithLiveData.filter(w => {
    if (query && !w.name.toLowerCase().includes(query.toLowerCase()) && !w.id.includes(query) && !w.phone.includes(query)) return false;
    if (statusFilter !== 'all' && w.status !== statusFilter) return false;
    if (complianceFilter !== 'all' && w.compliance !== complianceFilter) return false;
    if (platformFilter !== 'all' && !w.platforms.includes(platformFilter)) return false;
    return true;
  });

  const handleManualContrib = () => {
    if (!contribAmount || isNaN(Number(contribAmount))) {
      addToast('Enter a valid contribution amount.', 'error');
      return;
    }
    addToast(`Manual contribution of ₹${Number(contribAmount).toLocaleString('en-IN')} recorded for ${selectedWorker?.name}.`, 'success');
    setContribAmount('');
    setContribNote('');
    setContribOpen(false);
  };

  return (
    <SuperAdminLayout activeScreen="workers" title="All Workers">
      <style>{`
        @keyframes rowSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .worker-row-new { animation: rowSlideDown 200ms ease-out forwards; background: #F0FDF4 !important; }
      `}</style>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: '#0F172A' }}>All Workers</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
              {filtered.length !== workersWithLiveData.length
                ? `${filtered.length} of ${workersWithLiveData.length} workers`
                : `${state.totalWorkers.toLocaleString('en-IN')} workers across all platforms`}
            </p>
          </div>
        </div>

        {/* Search bar row with Download CSV and Add Demo Worker pills */}
        <div data-tour-id="tour-sa-workers-filters" className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="relative flex-1" style={{ maxWidth: '400px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, ID or phone…"
              className="w-full outline-none"
              style={{ height: '40px', border: '1px solid #E2E8F0', borderRadius: '8px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', paddingLeft: '36px', paddingRight: '12px', background: '#FFFFFF' }}
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ height: '40px', border: '1px solid #E2E8F0', borderRadius: '8px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', padding: '0 10px', background: '#FFFFFF', cursor: 'pointer', outline: 'none' }}
          >
            <option value="all">Status: All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>

          {/* Compliance filter */}
          <select
            value={complianceFilter}
            onChange={e => setComplianceFilter(e.target.value)}
            style={{ height: '40px', border: '1px solid #E2E8F0', borderRadius: '8px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', padding: '0 10px', background: '#FFFFFF', cursor: 'pointer', outline: 'none' }}
          >
            <option value="all">Compliance: All</option>
            <option value="compliant">Compliant</option>
            <option value="pending">Pending</option>
            <option value="non-compliant">Non-compliant</option>
          </select>

          {/* Platform filter */}
          <select
            value={platformFilter}
            onChange={e => setPlatformFilter(e.target.value)}
            style={{ height: '40px', border: '1px solid #E2E8F0', borderRadius: '8px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', padding: '0 10px', background: '#FFFFFF', cursor: 'pointer', outline: 'none' }}
          >
            <option value="all">Platform: All</option>
            {ALL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          {/* Download CSV (non-functional placeholder) */}
          <button
            onClick={() => addToast('CSV export available in production.', 'warning')}
            className="flex items-center gap-1.5"
            style={{ height: '36px', padding: '0 14px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#FFFFFF', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#64748B' }}
          >
            <Download size={14} />
            Download CSV
          </button>

          {/* 2C — Add Demo Worker pill */}
          <div className="relative">
            <button
              onClick={() => setAddDemoOpen(o => !o)}
              className="flex items-center gap-1.5"
              style={{ height: '36px', padding: '0 14px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#FFFFFF', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#64748B' }}
            >
              <Plus size={14} />
              Add Demo Worker
            </button>
            {addDemoOpen && (
              <RegisterPopover
                onRegister={(name, phone, platform) => {
                  registerWorker({ name, phone, city: 'Bengaluru', platform });
                }}
                onClose={() => setAddDemoOpen(false)}
              />
            )}
          </div>
        </div>

        {/* Table */}
        <div data-tour-id="tour-sa-workers-table" className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: '860px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  {['Worker ID', 'Name', 'Phone', 'Platforms', 'Status', 'Compliance', 'City', 'Wallet', 'Action'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', color: '#64748B', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((w, i) => {
                  const isSimulating = simulatingRow === w.id;
                  const simWorker = state.workers.find(s => s.name === w.name);
                  return (
                    <>
                      <tr
                        key={w.id}
                        className={w.fromSim ? 'worker-row-new' : ''}
                        style={{ borderBottom: i < filtered.length - 1 && !isSimulating ? '1px solid #F1F5F9' : 'none' }}
                      >
                        <td style={{ padding: '13px 14px', fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{w.id}</td>
                        <td style={{ padding: '13px 14px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', fontWeight: 600 }}>{w.name}</td>
                        <td style={{ padding: '13px 14px', fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>{w.phone}</td>
                        <td style={{ padding: '13px 14px' }}>
                          <div className="flex flex-wrap gap-1">
                            {w.platforms.map(pl => (
                              <span key={pl} style={{ background: `${platformColors[pl] ?? '#64748B'}20`, color: platformColors[pl] ?? '#64748B', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px', padding: '1px 7px', borderRadius: '100px' }}>
                                {pl}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '13px 14px' }}><Badge variant={w.status}>{w.status.charAt(0).toUpperCase() + w.status.slice(1)}</Badge></td>
                        <td style={{ padding: '13px 14px' }}><Badge variant={w.compliance}>{w.compliance === 'non-compliant' ? 'Non-compliant' : w.compliance.charAt(0).toUpperCase() + w.compliance.slice(1)}</Badge></td>
                        <td style={{ padding: '13px 14px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B' }}>{w.city}</td>
                        <td style={{ padding: '13px 14px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', fontWeight: 600 }}>
                          {/* Show live wallet from sim context */}
                          {`₹${(simWorker?.walletBalance ?? w.walletNum).toLocaleString('en-IN')}`}
                        </td>
                        <td style={{ padding: '13px 14px' }}>
                          <div className="flex items-center gap-3">
                            <button onClick={() => { setSelectedWorker(w); setContribOpen(false); }}
                              style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', color: '#0EA5E9', background: 'none', border: 'none', cursor: 'pointer' }}>
                              View →
                            </button>
                            {/* Simulate — prototype demo only */}
                            <div className="flex flex-col items-start gap-0.5">
                              <button
                                onClick={() => setSimulatingRow(isSimulating ? null : w.id)}
                                className="flex items-center gap-1"
                                style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', color: '#22C55E', background: 'none', border: 'none', cursor: 'pointer' }}
                              >
                                <Play size={11} />
                                Simulate
                              </button>
                              <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: '#94A3B8', lineHeight: 1 }}>
                                prototype only
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* Inline simulate panel */}
                      {isSimulating && (
                        <SimulatePanel
                          key={`sim-${w.id}`}
                          worker={w}
                          simWorker={simWorker}
                          onClose={() => setSimulatingRow(null)}
                        />
                      )}
                    </>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ padding: '32px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '14px', color: '#94A3B8' }}>No workers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail SlidePanel */}
      <SlidePanel
        isOpen={!!selectedWorker}
        onClose={() => setSelectedWorker(null)}
        title={selectedWorker?.name || ''}
        subtitle={`${selectedWorker?.id} · ${selectedWorker?.platforms.join(', ')}`}
        width="520px"
        footer={
          <div className="flex gap-3">
            <button onClick={() => { addToast(`${selectedWorker?.name} account frozen.`, 'warning'); setSelectedWorker(null); }}
              style={{ height: '42px', padding: '0 16px', background: '#FEF2F2', color: '#DC2626', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', border: '1px solid #FECACA', borderRadius: '8px', cursor: 'pointer' }}>
              Freeze Account
            </button>
            <button onClick={() => { addToast(`Wallet manually topped up for ${selectedWorker?.name}.`, 'success'); }}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg"
              style={{ height: '42px', background: '#0F172A', color: '#FDE68A', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}>
              <IndianRupee size={14} />
              Manual Top-Up
            </button>
          </div>
        }
      >
        {selectedWorker && (() => {
          const sim = state.workers.find(s => s.name === selectedWorker.name);
          return (
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <Badge variant={selectedWorker.status}>{selectedWorker.status.charAt(0).toUpperCase() + selectedWorker.status.slice(1)}</Badge>
                <Badge variant={selectedWorker.compliance}>{selectedWorker.compliance === 'non-compliant' ? 'Non-compliant' : selectedWorker.compliance.charAt(0).toUpperCase() + selectedWorker.compliance.slice(1)}</Badge>
                {selectedWorker.platforms.map(pl => (
                  <span key={pl} style={{ background: `${platformColors[pl] ?? '#64748B'}20`, color: platformColors[pl] ?? '#64748B', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', padding: '2px 8px', borderRadius: '100px' }}>{pl}</span>
                ))}
                {sim?.loanUnlocked && (
                  <span style={{ background: '#F0FDF4', color: '#16A34A', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', padding: '2px 8px', borderRadius: '100px' }}>Loan Unlocked ✓</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Phone',               value: selectedWorker.phone },
                  { label: 'City',                value: selectedWorker.city },
                  { label: 'Aadhaar',             value: selectedWorker.aadhaar },
                  { label: 'PAN',                 value: selectedWorker.pan },
                  { label: 'Wallet Balance',      value: `₹${(sim?.walletBalance ?? selectedWorker.walletNum).toLocaleString('en-IN')}` },
                  { label: 'Total Contributions', value: selectedWorker.totalContrib },
                  { label: 'Total Trips',         value: (sim?.deliveryCount ?? selectedWorker.trips).toLocaleString('en-IN') },
                  { label: 'Active Loans',        value: selectedWorker.loans.toString() },
                ].map(item => (
                  <div key={item.label} className="p-3 rounded-lg" style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8' }}>{item.label}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A', marginTop: '2px' }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Manual Contribution Collapsible */}
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
                <button
                  onClick={() => setContribOpen(!contribOpen)}
                  className="w-full flex items-center justify-between p-4"
                  style={{ background: '#F8FAFC', border: 'none', cursor: 'pointer' }}
                >
                  <div className="flex items-center gap-2">
                    <Plus size={15} style={{ color: '#0F172A' }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px', color: '#0F172A' }}>Manual Contribution Entry</span>
                  </div>
                  {contribOpen ? <ChevronUp size={16} style={{ color: '#64748B' }} /> : <ChevronDown size={16} style={{ color: '#64748B' }} />}
                </button>
                {contribOpen && (
                  <div className="p-4 space-y-3" style={{ borderTop: '1px solid #E2E8F0' }}>
                    <div>
                      <label style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', color: '#0F172A', display: 'block', marginBottom: '4px' }}>Amount (₹)</label>
                      <input type="number" value={contribAmount} onChange={e => setContribAmount(e.target.value)} placeholder="e.g. 500"
                        style={{ height: '40px', width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '8px', fontFamily: 'var(--font-body)', fontSize: '14px', color: '#0F172A', padding: '0 12px', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', color: '#0F172A', display: 'block', marginBottom: '4px' }}>Note (optional)</label>
                      <input value={contribNote} onChange={e => setContribNote(e.target.value)} placeholder="Reason for manual entry…"
                        style={{ height: '40px', width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '8px', fontFamily: 'var(--font-body)', fontSize: '14px', color: '#0F172A', padding: '0 12px', outline: 'none' }} />
                    </div>
                    <button onClick={handleManualContrib}
                      style={{ height: '40px', width: '100%', background: '#0F172A', color: '#FDE68A', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                      Submit Contribution
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </SlidePanel>
    </SuperAdminLayout>
  );
}
