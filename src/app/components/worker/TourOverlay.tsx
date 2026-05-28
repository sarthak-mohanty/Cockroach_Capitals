// GlobalTourOverlay — rendered once inside <BrowserRouter> in App.tsx.
// Reads state from TourContext and handles automatic navigation to the correct
// route before spotlighting the target element.
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTour } from '../../contexts/TourContext';
import { ALL_TOUR_STEPS, TOUR_COMPLETE } from '../../data/tutorialContent';

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

// Worker tour uses mobile bottom-sheet positioning; admin tours float bottom-right
function isAdminTour(type: string | null) {
  return type === 'platform-admin' || type === 'super-admin';
}

export default function GlobalTourOverlay() {
  const { tourType, stepIndex, active, nextStep, prevStep, skipTour, completeTour } = useTour();
  const navigate = useNavigate();
  const location = useLocation();
  const [rect, setRect] = useState<SpotlightRect | null>(null);
  const [navigating, setNavigating] = useState(false);
  // When the spotlight is in the lower half of the viewport, flip the tooltip to the top
  const [tooltipOnTop, setTooltipOnTop] = useState(false);

  const steps = tourType ? ALL_TOUR_STEPS[tourType] : [];
  const isComplete = stepIndex >= steps.length;
  const step = isComplete ? null : steps[stepIndex];

  // ── Measure the spotlight target ────────────────────────────────────────────
  const measureTarget = useCallback((targetId: string) => {
    const el = document.querySelector<HTMLElement>(`[data-tour-id="${targetId}"]`);
    if (!el) { setRect(null); return; }
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      const r = el.getBoundingClientRect();
      const newRect = {
        top:    r.top    - 8,
        left:   r.left   - 8,
        width:  r.width  + 16,
        height: r.height + 16,
      };
      setRect(newRect);
      // Flip tooltip to top when spotlight centre is in the lower 50% of viewport
      const centre = r.top + r.height / 2;
      setTooltipOnTop(centre > window.innerHeight * 0.5);
    }, 380);
  }, []);

  // ── Core effect: navigate if needed, then spotlight ─────────────────────────
  useEffect(() => {
    if (!active || !step) {
      setRect(null);
      return;
    }

    setRect(null); // clear while transitioning

    if (step.route !== location.pathname) {
      // Navigate to the correct page; effect will re-run once pathname updates
      setNavigating(true);
      navigate(step.route);
      return;
    }

    // We're on the right route — wait briefly for the page to paint, then measure
    setNavigating(false);
    const t = setTimeout(() => measureTarget(step.targetId), 160);
    return () => clearTimeout(t);
  }, [step, location.pathname, active, navigate, measureTarget]);

  // Once navigation settles, clear the navigating flag
  useEffect(() => {
    if (navigating) setNavigating(false);
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Nothing to render when tour is not active
  if (!active || !tourType) return null;

  const desktop = isAdminTour(tourType);

  // ── Completion card ─────────────────────────────────────────────────────────
  if (isComplete) {
    const done = TOUR_COMPLETE[tourType];
    return (
      <>
        <div className="fixed inset-0 z-[98]" style={{ background: 'rgba(0,0,0,0.65)' }} />
        <div
          className="fixed z-[101] bg-white rounded-2xl"
          style={desktop
            ? { bottom: '32px', right: '32px', width: '380px', padding: '32px 28px', boxShadow: '0 8px 40px rgba(0,0,0,0.25)' }
            : { bottom: '88px', left: '16px', right: '16px', padding: '28px 24px', boxShadow: '0 8px 40px rgba(0,0,0,0.25)', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }
          }
        >
          <div className="text-center">
            <span style={{ fontSize: '52px' }}>{done.emoji}</span>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', color: '#0F172A', marginTop: '12px' }}>
              {done.title}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748B', marginTop: '8px', lineHeight: '1.5' }}>
              {done.body}
            </p>
          </div>
          <button
            onClick={completeTour}
            className="w-full rounded-xl mt-6 flex items-center justify-center"
            style={{
              height: '52px',
              background: 'linear-gradient(135deg, #0EA5E9, #1A3C5E)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '15px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {done.ctaLabel}
          </button>
        </div>
      </>
    );
  }

  // ── Active step ─────────────────────────────────────────────────────────────
  return (
    <>
      {/* Full-screen dark overlay */}
      <div className="fixed inset-0 z-[98]" style={{ background: 'rgba(0,0,0,0.65)', pointerEvents: 'none' }} />

      {/* Click-blocker (prevents tapping through to the app) */}
      <div className="fixed inset-0 z-[99]" style={{ pointerEvents: 'all' }} />

      {/* Spotlight punch-through */}
      {rect && !navigating && (
        <div
          className="fixed z-[100]"
          style={{
            top:          rect.top,
            left:         rect.left,
            width:        rect.width,
            height:       rect.height,
            borderRadius: '12px',
            boxShadow:    '0 0 0 9999px rgba(0,0,0,0.65)',
            border:       '2px solid #0EA5E9',
            pointerEvents: 'none',
            transition:   'top 0.3s ease, left 0.3s ease, width 0.3s ease, height 0.3s ease',
          }}
        />
      )}

      {/* Skip button */}
      <button
        onClick={skipTour}
        className="fixed z-[102]"
        style={{
          top: '16px', right: '16px',
          background: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '20px',
          padding: '6px 16px',
          color: '#FFFFFF',
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          fontSize: '13px',
          cursor: 'pointer',
        }}
      >
        Skip tour
      </button>

      {/* Tooltip card — flips to top when spotlight is in lower half of viewport */}
      <div
        className="fixed z-[102] bg-white rounded-2xl"
        style={desktop
          ? tooltipOnTop
            ? { top: '32px', right: '32px', width: '380px', padding: '20px', boxShadow: '0 8px 40px rgba(0,0,0,0.25)' }
            : { bottom: '32px', right: '32px', width: '380px', padding: '20px', boxShadow: '0 8px 40px rgba(0,0,0,0.25)' }
          : tooltipOnTop
            ? { top: '16px', left: '16px', right: '16px', padding: '20px', boxShadow: '0 8px 40px rgba(0,0,0,0.25)', maxHeight: 'calc(50vh - 24px)', overflowY: 'auto' }
            : { bottom: '88px', left: '16px', right: '16px', padding: '20px', boxShadow: '0 8px 40px rgba(0,0,0,0.25)', maxHeight: 'calc(50vh - 24px)', overflowY: 'auto' }
        }
      >
        {/* Progress segments */}
        <div className="flex gap-1.5 mb-3">
          {steps.map((_, idx) => (
            <div
              key={idx}
              style={{
                flex:         idx === stepIndex ? 2 : 1,
                height:       '4px',
                borderRadius: '2px',
                background:   idx <= stepIndex ? '#0EA5E9' : '#E2E8F0',
                transition:   'flex 0.25s ease, background 0.25s ease',
              }}
            />
          ))}
        </div>

        {/* Step counter */}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8', marginBottom: '10px' }}>
          Step {stepIndex + 1} of {steps.length}
        </p>

        {/* Content */}
        <div className="flex items-start gap-3 mb-5">
          <span style={{ fontSize: '30px', flexShrink: 0, lineHeight: 1 }}>{step!.emoji}</span>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>
              {step!.title}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#475569', marginTop: '5px', lineHeight: '1.55' }}>
              {step!.body}
            </p>
            {step!.hint && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8', marginTop: '6px', fontStyle: 'italic' }}>
                {step!.hint}
              </p>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-2">
          {stepIndex > 0 && (
            <button
              onClick={prevStep}
              style={{
                flex: 1, height: '44px', borderRadius: '10px',
                border: '1.5px solid #E2E8F0', background: '#FFFFFF',
                color: '#475569', fontFamily: 'var(--font-body)',
                fontWeight: 500, fontSize: '14px', cursor: 'pointer',
              }}
            >
              ← Back
            </button>
          )}
          <button
            onClick={stepIndex === steps.length - 1 ? completeTour : nextStep}
            style={{
              flex: 2, height: '44px', borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, #0EA5E9, #1A3C5E)',
              color: '#FFFFFF', fontFamily: 'var(--font-display)',
              fontWeight: 600, fontSize: '14px', cursor: 'pointer',
            }}
          >
            {stepIndex === steps.length - 1 ? 'Finish 🎉' : 'Next →'}
          </button>
        </div>
      </div>
    </>
  );
}
