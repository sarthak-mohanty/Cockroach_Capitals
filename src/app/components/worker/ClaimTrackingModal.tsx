import { X, AlertTriangle, Phone } from 'lucide-react';
import { ACTIVE_CLAIM, formatINR } from '../../data/insuranceData';
import { useToast } from '../shared/ToastContext';

interface Props {
  onClose: () => void;
}

export default function ClaimTrackingModal({ onClose }: Props) {
  const { addToast } = useToast();
  const { claimId, filedDate, incidentDescription, statusTimeline, expectedPayout } = ACTIVE_CLAIM;

  // find the first in-progress step index
  const currentIdx = statusTimeline.findIndex(s => !s.done);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.45)' }}
        onClick={onClose}
      />

      {/* Slide-up panel */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white overflow-y-auto"
        style={{ borderRadius: '20px 20px 0 0', maxHeight: '90vh', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: '#E2E8F0' }} />
        </div>

        {/* Header */}
        <div className="px-5 py-4 flex items-start justify-between" style={{ borderBottom: '1px solid #F1F5F9' }}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: '#0F172A' }}>
                Claim {claimId}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full" style={{ background: '#FEF3C7', color: '#D97706', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px' }}>
                PROCESSING
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', marginTop: '3px' }}>
              Filed: {filedDate} · {incidentDescription}
            </p>
          </div>
          <button onClick={onClose} className="ml-3 flex-shrink-0 p-1">
            <X size={20} style={{ color: '#64748B' }} />
          </button>
        </div>

        <div className="px-5 py-4">

          {/* ── Timeline ── */}
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: '#0F172A', marginBottom: '16px' }}>
            Claim Progress
          </p>

          <div className="relative">
            {statusTimeline.map((step, idx) => {
              const isActive = idx === currentIdx;
              const isDone = step.done;
              const isFuture = !step.done && idx > currentIdx;

              const circleColor = isDone ? '#22C55E' : isActive ? '#F59E0B' : '#E2E8F0';
              const lineColor = isDone && idx < statusTimeline.length - 1 && statusTimeline[idx + 1].done
                ? '#22C55E'
                : '#E2E8F0';
              const isLast = idx === statusTimeline.length - 1;

              return (
                <div key={idx} className="flex gap-4">
                  {/* Circle + connecting line */}
                  <div className="flex flex-col items-center">
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: circleColor,
                        border: isFuture ? '2px solid #E2E8F0' : 'none',
                      }}
                    >
                      {isDone && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {isActive && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white" style={{ animation: 'pulse 2s infinite' }} />
                      )}
                    </div>
                    {!isLast && (
                      <div
                        style={{
                          width: '2px',
                          flex: 1,
                          minHeight: '24px',
                          background: lineColor,
                          borderStyle: isDone ? 'solid' : 'dashed',
                          borderWidth: isDone ? '0' : '1px',
                          borderColor: '#E2E8F0',
                          margin: '3px 0',
                        }}
                      />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 pb-5">
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: isFuture ? '#94A3B8' : '#0F172A',
                    }}>
                      {step.label}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: isFuture ? '#CBD5E1' : '#64748B', marginTop: '2px' }}>
                      {step.date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Action Required ── */}
          <div className="rounded-xl p-4 mb-4" style={{ background: '#FEF3C7', border: '1px solid #FCD34D' }}>
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} style={{ color: '#D97706', flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#92400E' }}>
                  Action Required
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#92400E', marginTop: '2px' }}>
                  Upload FIR copy to unlock document verification.
                </p>
                <button
                  onClick={() => { addToast('Upload FIR from the File a Claim screen.', 'warning'); onClose(); }}
                  style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0EA5E9', background: 'none', border: 'none', cursor: 'pointer', marginTop: '6px', padding: 0 }}
                >
                  Upload Now →
                </button>
              </div>
            </div>
          </div>

          {/* ── Payout Preview ── */}
          <div className="rounded-xl p-4 mb-5" style={{ background: '#F0FDF4', border: '1px solid #86EFAC' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
              Expected Payout
            </p>
            <div className="flex justify-between mb-1.5">
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>PMSBY (ICICI Lombard)</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px', color: '#16A34A' }}>{formatINR(expectedPayout.pmsby)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>GigShield Cash Top-Up</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px', color: '#D97706' }}>{formatINR(expectedPayout.gigshieldCash)}</span>
            </div>
            <div className="h-px mb-2" style={{ background: '#BBF7D0' }} />
            <div className="flex justify-between mb-1">
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px', color: '#0F172A' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: '#1A3C5E' }}>{formatINR(expectedPayout.total)}</span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B' }}>
              Mode: {expectedPayout.disbursementMode} to {expectedPayout.disbursementAccount} · Expected: 6 Jun 2026
            </p>
          </div>

          {/* ── Support ── */}
          <button
            onClick={() => addToast('This number will be live in production.', 'warning')}
            className="w-full rounded-xl flex items-center justify-center gap-2"
            style={{
              height: '48px',
              border: '1.5px solid #E2E8F0',
              background: '#FFFFFF',
              color: '#0F172A',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              marginBottom: '8px',
            }}
          >
            <Phone size={16} />
            📞 1800-XXX-XXXX (Toll Free)
          </button>
        </div>
      </div>
    </>
  );
}
