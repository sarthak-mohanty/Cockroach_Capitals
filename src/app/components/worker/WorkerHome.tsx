import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import BottomNav from './BottomNav';
import TourPromptModal from './TourPromptModal';
import { useTour } from '../../contexts/TourContext';
import { GigShieldMark } from '../shared/GigShieldLogo';

export default function WorkerHome() {
  const navigate = useNavigate();
  const { isDone, startTour } = useTour();
  const [showTourPrompt, setShowTourPrompt] = useState(false);
  const [showMobileBanner, setShowMobileBanner] = useState(true);

  // Auto-dismiss the mobile-optimised banner after 4 s
  useEffect(() => {
    const t = setTimeout(() => setShowMobileBanner(false), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isDone('worker')) {
      const t = setTimeout(() => setShowTourPrompt(true), 600);
      return () => clearTimeout(t);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTourYes = () => {
    setShowTourPrompt(false);
    startTour('worker');
  };

  const handleTourNo = () => {
    setShowTourPrompt(false);
    localStorage.setItem('gigshield_tour_done_worker', '1');
  };

  const activities = [
    { platform: 'Swiggy', logo: 'S', bg: '#FF6B00', amount: 80, contribution: 1.60, time: 'Today, 2:34 PM' },
    { platform: 'Blinkit', logo: 'B', bg: '#1C1C1C', amount: 95, contribution: 1.90, time: 'Today, 11:15 AM' },
    { platform: 'Ola Ride', logo: 'O', bg: '#FFD700', textColor: '#000', amount: 120, contribution: 2.40, time: 'Yesterday, 6:48 PM' }
  ];

  return (
    <div className="min-h-screen pb-16" style={{ background: '#F8FAFC' }}>
      {/* Mobile-optimised disclaimer banner */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transform: showMobileBanner ? 'translateY(0)' : 'translateY(-110%)',
          opacity: showMobileBanner ? 1 : 0,
          transition: 'transform 0.35s ease, opacity 0.35s ease',
          background: '#FFFBEB',
          borderBottom: '1px solid #FCD34D',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
        }}
      >
        <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>📱</span>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#92400E', flex: 1, lineHeight: '1.5' }}>
          <strong>Worker portal is optimised for mobile.</strong> For the best experience, open this on your phone or resize your browser to a narrow window.
        </p>
        <button
          onClick={() => setShowMobileBanner(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B45309', fontSize: '16px', lineHeight: 1, flexShrink: 0, padding: '0 2px' }}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>

      {/* Header */}
      <div
        data-tour-id="tour-header"
        className="sticky top-0 bg-white border-b px-4 flex items-center justify-between"
        style={{ height: '56px', borderColor: '#E2E8F0' }}
      >
        <div className="flex items-center gap-2">
          <GigShieldMark color="#1B2E6B" size={22} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: '#1A3C5E', letterSpacing: '0.04em' }}>
            GigShield
          </span>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A' }}>
          Good morning, Raju 👋
        </p>
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '11px', color: '#64748B' }}>
            EN | हिं
          </span>
        </div>
      </div>

      <div className="px-4 pb-4">
        {/* Wallet Balance Card */}
        <div
          data-tour-id="tour-wallet"
          onClick={() => navigate('/worker/wallet')}
          className="mt-4 rounded-xl p-6 cursor-pointer active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #1A3C5E 100%)' }}
        >
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>
            Your GigShield Wallet
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '40px', color: '#FFFFFF', marginTop: '4px' }}>
            Rs 1,840
          </p>
          <div className="flex items-center gap-1 mt-1">
            <span style={{ color: '#86EFAC', fontSize: '13px' }}>↑</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>
              Rs 28 added today
            </span>
          </div>
        </div>

        {/* Earnings Summary */}
        <div data-tour-id="tour-earnings" className="mt-4 bg-white rounded-xl p-5 shadow-sm" style={{ border: '1px solid #E2E8F0' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            This Month
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '28px', color: '#0F172A', marginTop: '4px' }}>
            Rs 24,200
          </p>
          <div className="flex gap-2 mt-3">
            <span className="px-2.5 py-1 rounded-full" style={{ background: '#FFF7ED', color: '#FF6B00', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '12px' }}>
              Swiggy Rs 8,400
            </span>
            <span className="px-2.5 py-1 rounded-full" style={{ background: '#F1F5F9', color: '#1C1C1C', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '12px' }}>
              Blinkit Rs 6,200
            </span>
            <span className="px-2.5 py-1 rounded-full" style={{ background: '#FFFBEB', color: '#B45309', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '12px' }}>
              Ola Rs 9,600
            </span>
          </div>
        </div>

        {/* Insurance Status */}
        <div
          data-tour-id="tour-insurance"
          onClick={() => navigate('/worker/insurance')}
          className="mt-4 bg-white rounded-xl p-5 shadow-sm cursor-pointer relative"
          style={{ border: '1px solid #E2E8F0' }}
        >
          {/* Amber action-required badge */}
          <div
            className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{ background: '#FEF3C7', border: '1px solid #FCD34D' }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#F59E0B' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px', color: '#D97706' }}>
              1 action required
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="px-2.5 py-1 rounded-full inline-block" style={{ background: '#F0FDF4', color: '#16A34A', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '11px' }}>
                ACTIVE
              </span>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                PMSBY + GigShield Top-Up
              </p>
            </div>
            <div className="text-right" style={{ marginTop: '20px' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>Coverage</p>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '18px', color: '#0F172A' }}>
                Rs 2,10,000
              </p>
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#D97706', marginTop: '8px' }}>
            Prototype — Real coverage coming in production
          </p>
        </div>

        {/* Pension Pot */}
        <div data-tour-id="tour-home-retirement" className="mt-4 bg-white rounded-xl p-5 shadow-sm" style={{ border: '1px solid #E2E8F0' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Your Retirement Fund
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '24px', color: '#0F172A', marginTop: '4px' }}>
            Rs 3,200
          </p>
          <div className="flex items-end gap-1 mt-2" style={{ height: '32px' }}>
            <div className="flex-1 rounded-t" style={{ height: '40%', background: '#0EA5E9' }} />
            <div className="flex-1 rounded-t" style={{ height: '65%', background: '#0EA5E9' }} />
            <div className="flex-1 rounded-t" style={{ height: '100%', background: '#0EA5E9' }} />
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
            Accumulated so far
          </p>
        </div>

        {/* Quick Actions */}
        <div data-tour-id="tour-quick-actions" className="grid grid-cols-3 gap-2 mt-4">
          <button
            onClick={() => navigate('/worker/insurance')}
            className="bg-white rounded-xl p-4 shadow-sm text-center"
            style={{ border: '1px solid #E2E8F0' }}
          >
            <div className="w-8 h-8 mx-auto rounded-full flex items-center justify-center" style={{ background: '#FEF2F2' }}>
              <span style={{ fontSize: '20px' }}>📋</span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '12px', color: '#0F172A', marginTop: '6px' }}>
              File Claim
            </p>
          </button>
          <button
            onClick={() => navigate('/worker/loan')}
            className="bg-white rounded-xl p-4 shadow-sm text-center"
            style={{ border: '1px solid #E2E8F0' }}
          >
            <div className="w-8 h-8 mx-auto rounded-full flex items-center justify-center" style={{ background: '#F0FDF4' }}>
              <span style={{ fontSize: '20px' }}>💰</span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '12px', color: '#0F172A', marginTop: '6px' }}>
              Apply for Loan
            </p>
          </button>
          <button
            onClick={() => navigate('/worker/wallet')}
            className="bg-white rounded-xl p-4 shadow-sm text-center"
            style={{ border: '1px solid #E2E8F0' }}
          >
            <div className="w-8 h-8 mx-auto rounded-full flex items-center justify-center" style={{ background: '#EFF6FF' }}>
              <span style={{ fontSize: '20px' }}>📊</span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '12px', color: '#0F172A', marginTop: '6px' }}>
              View History
            </p>
          </button>
        </div>

        {/* Profile Completion Banner */}
        <div data-tour-id="tour-home-profile-banner" className="mt-4 rounded-xl p-4" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <div className="flex items-start gap-2">
            <span style={{ color: '#F59E0B', fontSize: '20px' }}>⚠️</span>
            <div className="flex-1">
              <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#92400E' }}>
                Complete your profile to unlock loan pre-approval
              </p>
              <div className="mt-2 rounded-full overflow-hidden" style={{ height: '6px', background: '#FDE68A' }}>
                <div style={{ width: '60%', height: '100%', background: '#F59E0B' }} />
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#D97706', marginTop: '6px' }}>
                60% complete
              </p>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="mt-4">
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
            Recent Activity
          </p>
          {activities.map((activity, idx) => (
            <div key={idx} className="flex items-center gap-3 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: activity.bg }}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: activity.textColor || '#FFFFFF' }}>
                  {activity.logo}
                </span>
              </div>
              <div className="flex-1">
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A' }}>
                  {activity.platform} Delivery
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#94A3B8' }}>
                  {activity.time}
                </p>
              </div>
              <div className="text-right">
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A' }}>
                  Rs {activity.amount}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#22C55E' }}>
                  Rs {activity.contribution.toFixed(2)} contributed
                </p>
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate('/worker/wallet')}
            style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#0EA5E9', marginTop: '12px' }}
          >
            View all transactions →
          </button>
        </div>
      </div>

      <BottomNav active="home" />

      {/* Tour prompt modal — GlobalTourOverlay (in App.tsx) handles the rest */}
      {showTourPrompt && (
        <TourPromptModal tourType="worker" variant="mobile" onYes={handleTourYes} onNo={handleTourNo} />
      )}
    </div>
  );
}
