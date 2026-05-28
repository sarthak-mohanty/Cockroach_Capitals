import { useState } from 'react';
import { AlertTriangle, UserPlus, Zap, Calendar, Grid3x3, CheckCircle } from 'lucide-react';
import AdminLayout from './AdminLayout';

export default function AdminTestHarness() {
  const [showResetModal, setShowResetModal] = useState(false);
  const [workerRegistered, setWorkerRegistered] = useState(false);
  const [deliveryCompleted, setDeliveryCompleted] = useState(false);
  const [historyProgress, setHistoryProgress] = useState(0);

  const handleRegisterWorker = () => {
    setWorkerRegistered(true);
    setTimeout(() => setWorkerRegistered(false), 3000);
  };

  const handleCompleteDelivery = () => {
    setDeliveryCompleted(true);
    setTimeout(() => setDeliveryCompleted(false), 3000);
  };

  const handleGenerateHistory = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setHistoryProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setHistoryProgress(0), 2000);
      }
    }, 150);
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6">

        {/* Banner */}
        <div className="w-full px-4 py-3 rounded-lg mb-5" style={{ background: '#FEF2F2', border: '2px solid #EF4444' }}>
          <div className="flex items-start gap-2">
            <AlertTriangle size={18} style={{ color: '#EF4444', flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#991B1B', lineHeight: '1.5' }}>
              MVP TEST HARNESS — Simulates real platform API calls for demonstration purposes. This screen does not exist in production.
            </p>
          </div>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(20px,3vw,24px)', color: '#0F172A', marginBottom: '20px' }}>
          Test Harness
        </h1>

        {/* Action Cards — 1-col on mobile, 2-col on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

          {/* Register New Worker */}
          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm" style={{ border: '1px solid #E2E8F0' }}>
            <div className="flex items-center gap-3 mb-4">
              <UserPlus size={22} style={{ color: '#0EA5E9' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: '#0F172A' }}>Register New Worker</h3>
            </div>
            <div className="space-y-3 mb-4">
              {[
                { type: 'text',  placeholder: 'Name',  defaultValue: 'Demo Raju' },
                { type: 'tel',   placeholder: 'Phone', defaultValue: '9999999999' },
              ].map((f) => (
                <input key={f.placeholder} type={f.type} placeholder={f.placeholder} defaultValue={f.defaultValue}
                  className="w-full px-3 rounded-md outline-none"
                  style={{ height: '40px', border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '14px' }}
                />
              ))}
              {[
                ['Bengaluru', 'Pune', 'Jaipur', 'Mumbai'],
                ['Swiggy', 'Blinkit', 'Ola'],
              ].map((opts, i) => (
                <select key={i} className="w-full px-3 rounded-md outline-none"
                  style={{ height: '40px', border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
                  {opts.map(o => <option key={o}>{o}</option>)}
                </select>
              ))}
            </div>
            <button onClick={handleRegisterWorker} className="w-full rounded-md"
              style={{ height: '40px', background: '#0EA5E9', color: '#FFFFFF', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px' }}>
              Register Worker
            </button>
          </div>

          {/* Simulate Single Delivery */}
          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm" style={{ border: '1px solid #E2E8F0' }}>
            <div className="flex items-center gap-3 mb-4">
              <Zap size={22} style={{ color: '#22C55E' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: '#0F172A' }}>Simulate Single Delivery</h3>
            </div>
            <div className="space-y-3 mb-4">
              {[['Demo Raju', 'Meena Sharma', 'Arjun Patel'], ['Swiggy', 'Blinkit', 'Ola']].map((opts, i) => (
                <select key={i} className="w-full px-3 rounded-md outline-none"
                  style={{ height: '40px', border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
                  {opts.map(o => <option key={o}>{o}</option>)}
                </select>
              ))}
              <input type="text" placeholder="Amount" defaultValue="Rs 80"
                className="w-full px-3 rounded-md outline-none"
                style={{ height: '40px', border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '14px' }}
              />
            </div>
            <button onClick={handleCompleteDelivery} className="w-full rounded-md"
              style={{ height: '40px', background: '#22C55E', color: '#FFFFFF', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px' }}>
              Complete Delivery
            </button>
          </div>

          {/* Simulate 30-Day History */}
          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm" style={{ border: '1px solid #E2E8F0' }}>
            <div className="flex items-center gap-3 mb-4">
              <Calendar size={22} style={{ color: '#F59E0B' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: '#0F172A' }}>Simulate 30-Day History</h3>
            </div>
            <div className="mb-4">
              <select className="w-full px-3 rounded-md outline-none"
                style={{ height: '40px', border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
                {['Demo Raju', 'Meena Sharma', 'Arjun Patel'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            {historyProgress > 0 && (
              <div className="mb-4">
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>
                  Generating... {Math.floor(historyProgress / 100 * 30)}/30 days
                </p>
                <div className="w-full rounded-full overflow-hidden" style={{ height: '8px', background: '#E2E8F0' }}>
                  <div style={{ width: `${historyProgress}%`, height: '100%', background: '#F59E0B', transition: 'width 0.3s' }} />
                </div>
              </div>
            )}
            <button onClick={handleGenerateHistory} disabled={historyProgress > 0 && historyProgress < 100}
              className="w-full rounded-md"
              style={{ height: '40px', background: '#F59E0B', color: '#FFFFFF', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', opacity: historyProgress > 0 && historyProgress < 100 ? 0.6 : 1 }}>
              Generate History
            </button>
          </div>

          {/* Multi-Platform Simulation */}
          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm" style={{ border: '1px solid #E2E8F0' }}>
            <div className="flex items-center gap-3 mb-4">
              <Grid3x3 size={22} style={{ color: '#1A3C5E' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: '#0F172A' }}>Multi-Platform Simulation</h3>
            </div>
            <div className="mb-4">
              <select className="w-full px-3 rounded-md outline-none"
                style={{ height: '40px', border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
                {['Demo Raju', 'Meena Sharma', 'Arjun Patel'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              {[
                { label: '🟠 Fire Swiggy Delivery',  bg: '#FFF7ED', border: '#FF6B00', color: '#FF6B00' },
                { label: '⚫ Fire Blinkit Delivery', bg: '#F1F5F9', border: '#1C1C1C', color: '#1C1C1C' },
                { label: '🟡 Fire Ola Delivery',     bg: '#FFFBEB', border: '#FFD700', color: '#B45309' },
              ].map((b) => (
                <button key={b.label} className="w-full rounded-md"
                  style={{ height: '36px', background: b.bg, border: `1px solid ${b.border}`, color: b.color, fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px' }}>
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-center">
          <button onClick={() => setShowResetModal(true)} className="px-10 rounded-md"
            style={{ height: '44px', background: 'transparent', border: '2px solid #EF4444', color: '#EF4444', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px' }}>
            Reset Demo State
          </button>
        </div>

        {/* Toast: Worker Registered */}
        {workerRegistered && (
          <div className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto px-5 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50"
            style={{ background: '#F0FDF4', border: '1px solid #86EFAC' }}>
            <CheckCircle size={18} style={{ color: '#22C55E', flexShrink: 0 }} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#15803D' }}>
              ✓ Demo Raju registered. GigShield ID: GS-2024-098234 created.
            </p>
          </div>
        )}

        {/* Toast: Delivery Completed */}
        {deliveryCompleted && (
          <div className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto px-5 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50"
            style={{ background: '#F0FDF4', border: '1px solid #86EFAC' }}>
            <CheckCircle size={18} style={{ color: '#22C55E', flexShrink: 0 }} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#15803D' }}>
              ✓ Rs 1.60 contributed to Demo Raju's wallet.
            </p>
          </div>
        )}

        {/* Reset Modal */}
        {showResetModal && (
          <>
            <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowResetModal(false)} />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 sm:p-8 z-50 w-11/12 sm:w-auto" style={{ maxWidth: '480px' }}>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center" style={{ background: '#FEF2F2' }}>
                  <AlertTriangle size={28} style={{ color: '#EF4444' }} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', color: '#0F172A', marginTop: '16px' }}>
                  Reset Demo State?
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748B', marginTop: '8px', lineHeight: '1.6' }}>
                  This will erase all demo transactions and reset wallets to zero. This cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowResetModal(false)} className="flex-1 rounded-md"
                  style={{ height: '44px', background: '#1A3C5E', color: '#FFFFFF', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px' }}>
                  Cancel
                </button>
                <button onClick={() => setShowResetModal(false)} className="flex-1 rounded-md"
                  style={{ height: '44px', background: '#EF4444', color: '#FFFFFF', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px' }}>
                  Reset
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
