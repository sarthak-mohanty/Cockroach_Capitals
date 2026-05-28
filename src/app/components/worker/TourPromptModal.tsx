import { TourType, TOUR_PROMPTS } from '../../data/tutorialContent';

interface Props {
  tourType: TourType;
  /** 'mobile' = bottom-sheet (worker), 'desktop' = centered card (admin panels) */
  variant?: 'mobile' | 'desktop';
  onYes: () => void;
  onNo: () => void;
}

export default function TourPromptModal({ tourType, variant = 'mobile', onYes, onNo }: Props) {
  const p = TOUR_PROMPTS[tourType];

  if (variant === 'desktop') {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.35)' }}
          onClick={onNo}
        />

        {/* Centered card */}
        <div
          className="fixed z-50 bg-white rounded-2xl"
          style={{
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '420px',
            maxWidth: 'calc(100vw - 48px)',
            padding: '36px 32px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
          }}
        >
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #E0F2FE, #BFDBFE)' }}
          >
            <span style={{ fontSize: '32px' }}>🧭</span>
          </div>

          <div className="text-center mb-7">
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', color: '#0F172A' }}>
              {p.title}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748B', marginTop: '8px', lineHeight: '1.55' }}>
              {p.subtitle}
            </p>
            <div
              className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full"
              style={{ background: '#F1F5F9' }}
            >
              <span style={{ fontSize: '12px' }}>⏱</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>
                {p.note}
              </span>
            </div>
          </div>

          <button
            onClick={onYes}
            className="w-full rounded-xl flex items-center justify-center"
            style={{
              height: '50px',
              background: 'linear-gradient(135deg, #0EA5E9, #1A3C5E)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '15px',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '10px',
            }}
          >
            {p.yesLabel}
          </button>

          <button
            onClick={onNo}
            className="w-full rounded-xl flex items-center justify-center"
            style={{
              height: '44px',
              background: 'transparent',
              color: '#64748B',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: '14px',
              border: '1.5px solid #E2E8F0',
              cursor: 'pointer',
            }}
          >
            {p.noLabel}
          </button>
        </div>
      </>
    );
  }

  // ── Mobile bottom-sheet (worker portal) ────────────────────────────────────
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.45)' }}
        onClick={onNo}
      />

      {/* Slide-up bottom sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white"
        style={{
          borderRadius: '20px 20px 0 0',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: '#E2E8F0' }} />
        </div>

        <div className="px-6 pt-4 pb-8">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #E0F2FE, #BFDBFE)' }}
          >
            <span style={{ fontSize: '32px' }}>🧭</span>
          </div>

          <div className="text-center mb-7">
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', color: '#0F172A' }}>
              {p.title}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748B', marginTop: '8px', lineHeight: '1.5' }}>
              {p.subtitle}
            </p>
            <div
              className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full"
              style={{ background: '#F1F5F9' }}
            >
              <span style={{ fontSize: '12px' }}>⏱</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>
                {p.note}
              </span>
            </div>
          </div>

          <button
            onClick={onYes}
            className="w-full rounded-xl flex items-center justify-center"
            style={{
              height: '52px',
              background: 'linear-gradient(135deg, #0EA5E9, #1A3C5E)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '15px',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '12px',
            }}
          >
            {p.yesLabel}
          </button>

          <button
            onClick={onNo}
            className="w-full rounded-xl flex items-center justify-center"
            style={{
              height: '48px',
              background: 'transparent',
              color: '#64748B',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: '14px',
              border: '1.5px solid #E2E8F0',
              cursor: 'pointer',
            }}
          >
            {p.noLabel}
          </button>
        </div>
      </div>
    </>
  );
}
