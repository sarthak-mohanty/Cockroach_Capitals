import { X, CheckCircle, Clock } from 'lucide-react';
import { formatINR } from '../../data/insuranceData';

export interface ClaimSummary {
  id: string;
  type: string;
  date: string;
  hospital: string;
  submittedOn: string;
  status: string;
}

interface Props {
  claim: ClaimSummary;
  onClose: () => void;
}

const STATUS_META: Record<string, { bg: string; color: string; label: string }> = {
  'Awaiting Response': { bg: '#FEF3C7', color: '#D97706', label: 'UNDER REVIEW' },
  'Approved':          { bg: '#F0FDF4', color: '#16A34A', label: 'APPROVED' },
  'Rejected':          { bg: '#FEF2F2', color: '#DC2626', label: 'REJECTED' },
  'Payout Initiated':  { bg: '#EFF6FF', color: '#2563EB', label: 'PAYOUT INITIATED' },
};

const TIMELINE_STEPS = [
  { label: 'Claim Filed',              description: 'Your claim was received.' },
  { label: 'Document Review',          description: 'Verifying FIR & hospital records.' },
  { label: 'Assessment in Progress',   description: 'ICICI Lombard reviewing coverage.' },
  { label: 'Payout Initiated',         description: 'NEFT transfer to your bank.' },
];

/** Returns how many steps are fully done (0-based index of the active step). */
function getProgress(status: string): number {
  switch (status) {
    case 'Awaiting Response': return 1;  // Filed ✓ | Document Review active
    case 'Approved':          return 2;  // Filed ✓ | Review ✓ | Assessment active
    case 'Payout Initiated':  return 3;  // First 3 done | Payout active
    default:                  return 1;
  }
}

export default function ClaimDetailModal({ claim, onClose }: Props) {
  const badge = STATUS_META[claim.status] ?? { bg: '#F1F5F9', color: '#64748B', label: claim.status.toUpperCase() };
  const progress = getProgress(claim.status);

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
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: '#E2E8F0' }} />
        </div>

        {/* Header */}
        <div className="px-5 py-4 flex items-start justify-between" style={{ borderBottom: '1px solid #F1F5F9' }}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: '#0F172A' }}>
                Claim {claim.id}
              </h2>
              <span
                className="px-2.5 py-0.5 rounded-full"
                style={{ background: badge.bg, color: badge.color, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px' }}
              >
                {badge.label}
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', marginTop: '3px' }}>
              Filed: {claim.submittedOn}
            </p>
          </div>
          <button onClick={onClose} className="ml-3 flex-shrink-0 p-1">
            <X size={20} style={{ color: '#64748B' }} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">

          {/* ── Summary rows ── */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
            <div className="px-4 py-2.5" style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Claim Summary
              </p>
            </div>
            {[
              { label: 'Claim ID',      value: claim.id },
              { label: 'Incident Type', value: claim.type },
              { label: 'Date',          value: claim.date },
              { label: 'Hospital',      value: claim.hospital },
              { label: 'Filed On',      value: claim.submittedOn },
            ].map((row, idx, arr) => (
              <div
                key={row.label}
                className="flex items-start justify-between px-4 py-3"
                style={{ borderBottom: idx < arr.length - 1 ? '1px solid #F1F5F9' : 'none' }}
              >
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B' }}>{row.label}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#0F172A', textAlign: 'right', maxWidth: '58%' }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* ── Status Timeline ── */}
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: '#0F172A', marginBottom: '16px' }}>
              Claim Progress
            </p>
            <div>
              {TIMELINE_STEPS.map((step, idx) => {
                const isDone   = idx < progress;
                const isActive = idx === progress;
                const isFuture = idx > progress;
                const isLast   = idx === TIMELINE_STEPS.length - 1;

                const circleColor = isDone ? '#22C55E' : isActive ? '#F59E0B' : 'transparent';
                const circleBorder = isFuture ? '2px solid #E2E8F0' : 'none';

                return (
                  <div key={step.label} className="flex gap-4">
                    {/* Circle + connector */}
                    <div className="flex flex-col items-center">
                      <div
                        className="flex items-center justify-center flex-shrink-0"
                        style={{ width: '24px', height: '24px', borderRadius: '50%', background: circleColor, border: circleBorder }}
                      >
                        {isDone && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                        {isActive && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </div>
                      {!isLast && (
                        <div style={{ width: '2px', flex: 1, minHeight: '20px', background: isDone ? '#22C55E' : '#E2E8F0', margin: '3px 0' }} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px', color: isFuture ? '#94A3B8' : '#0F172A' }}>
                        {step.label}
                      </p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: isFuture ? '#CBD5E1' : '#64748B', marginTop: '2px' }}>
                        {isDone ? step.description : isActive ? '⏳ ' + step.description : step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Expected Payout ── */}
          <div className="rounded-xl p-4" style={{ background: '#F0FDF4', border: '1px solid #86EFAC' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
              Expected Payout
            </p>
            <div className="flex justify-between mb-1.5">
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>PMSBY (ICICI Lombard)</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px', color: '#16A34A' }}>{formatINR(200000)}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>GigShield Cash Top-Up</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px', color: '#D97706' }}>{formatINR(10000)}</span>
            </div>
            <div className="h-px mb-3" style={{ background: '#BBF7D0' }} />
            <div className="flex justify-between mb-1">
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: '#1A3C5E' }}>{formatINR(210000)}</span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
              Subject to claim assessment. Credited via NEFT to SBI XXXX1234.
            </p>
          </div>

          {/* ── Status notice ── */}
          <div className="flex items-center gap-2 rounded-xl p-3" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <Clock size={14} style={{ color: '#64748B', flexShrink: 0 }} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>
              Our team will contact you at +91-99999 99999 if any additional documents are required.
            </p>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
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
              marginBottom: '4px',
            }}
          >
            <CheckCircle size={16} style={{ color: '#22C55E' }} />
            Done
          </button>
        </div>
      </div>
    </>
  );
}
