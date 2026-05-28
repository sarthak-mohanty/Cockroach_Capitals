import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, AlertTriangle, CheckCircle, ChevronUp, CreditCard } from 'lucide-react';
import BottomNav from './BottomNav';

interface LoanApplication {
  id: string;
  lender: string;
  amount: string;
  emi: string;
  tenure: string;
  purpose: string;
  submittedOn: string;
  status: string;
}

const OFFERS = [
  {
    id: 'kreditbee',
    name: 'KreditBee',
    tag: 'NBFC Partner',
    best: true,
    amount: '₹45,000',
    interest: '14% p.a.',
    tenure: '18 months',
    emi: '₹2,850',
    borderColor: '#0EA5E9',
    badgeBg: '#0EA5E9',
  },
  {
    id: 'moneytap',
    name: 'MoneyTap',
    tag: 'NBFC Partner',
    best: false,
    amount: '₹30,000',
    interest: '16% p.a.',
    tenure: '12 months',
    emi: '₹2,750',
    borderColor: '#E2E8F0',
    badgeBg: null,
  },
  {
    id: 'stashfin',
    name: 'Stashfin',
    tag: 'NBFC Partner',
    best: false,
    amount: '₹20,000',
    interest: '18% p.a.',
    tenure: '12 months',
    emi: '₹1,840',
    borderColor: '#E2E8F0',
    badgeBg: null,
  },
];

export default function WorkerLoan() {
  const navigate = useNavigate();
  const [explainerExpanded, setExplainerExpanded] = useState(false);
  const offersRef = useRef<HTMLDivElement>(null);

  const applications: LoanApplication[] = JSON.parse(
    localStorage.getItem('gigshield_loans') || '[]'
  );

  const handleApply = (offerId: string) => {
    navigate('/worker/loan-apply', { state: { offerId } });
  };

  const scrollToOffers = () => {
    offersRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div data-tour-id="tour-worker-loan-page" className="min-h-screen pb-20" style={{ background: '#F8FAFC' }}>

      {/* ── Header ── */}
      <div className="sticky top-0 bg-white border-b px-4 flex items-center gap-3 z-10" style={{ height: '56px', borderColor: '#E2E8F0' }}>
        <button onClick={() => navigate('/worker/home')}>
          <ArrowLeft size={24} style={{ color: '#0F172A' }} />
        </button>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '17px', color: '#0F172A', lineHeight: 1 }}>
            Loans & Credit
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
            Your verified gig income unlocks formal credit
          </p>
        </div>
      </div>

      {/* ── Prototype Disclaimer ── */}
      <div className="px-4 py-2.5" style={{ background: '#FEF3C7', borderBottom: '2px solid #F59E0B' }}>
        <div className="flex items-start gap-2">
          <AlertTriangle size={15} style={{ color: '#D97706', flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', color: '#92400E', lineHeight: 1.4 }}>
            PROTOTYPE — Loan offers shown are simulated. Real loans will be disbursed by NBFC partners in production.
          </p>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* ── Income Card ── */}
        <div
          data-tour-id="tour-loan-income-card"
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1A3C5E 0%, #0EA5E9 100%)' }}
        >
          {/* decorative circle */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20" style={{ background: '#FFFFFF' }} />
          <div className="absolute -right-4 bottom-4 w-20 h-20 rounded-full opacity-10" style={{ background: '#FFFFFF' }} />

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.18)' }}>
            <CheckCircle size={13} style={{ color: '#FFFFFF' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', color: '#FFFFFF' }}>
              GigShield Verified
            </span>
          </div>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '2px' }}>
            Your Verified Income
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '32px', color: '#FFFFFF', lineHeight: 1 }}>
            ₹25,000
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '14px', color: 'rgba(255,255,255,0.75)', marginLeft: '4px' }}>
              /month
            </span>
          </p>

          <div className="flex gap-6 mt-4">
            {[
              { label: 'HISTORY', value: '18 months' },
              { label: 'PLATFORMS', value: '3 verified' },
              { label: 'TRUST SCORE', value: '742' },
            ].map((s) => (
              <div key={s.label}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {s.label}
                </p>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: '#FFFFFF', marginTop: '1px' }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Pre-Approval Card ── */}
        <div data-tour-id="tour-loan-preapproval" className="rounded-2xl p-5" style={{ background: '#F0FDF4', border: '2px solid #86EFAC' }}>
          <div className="flex gap-1 mb-2">
            {[1, 2, 3].map(i => (
              <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#22C55E">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', color: '#0F172A' }}>
            You're pre-approved! 🎉
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
            Based on 18 months of verified income
          </p>

          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '36px', color: '#22C55E', margin: '10px 0 2px' }}>
            ₹45,000
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', marginBottom: '16px' }}>
            Maximum pre-approved amount
          </p>

          <button
            onClick={scrollToOffers}
            className="w-full rounded-xl flex items-center justify-center gap-2"
            style={{
              height: '44px',
              background: '#22C55E',
              color: '#FFFFFF',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            See offers below ↓
          </button>
        </div>

        {/* ── Loan Offers ── */}
        <div data-tour-id="tour-loan-offers" ref={offersRef}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '12px' }}>
            Loan Offers
          </p>

          <div className="space-y-3">
            {OFFERS.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-2xl p-5 shadow-sm"
                style={{ border: `2px solid ${offer.borderColor}` }}
              >
                {/* Lender header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '17px', color: '#0F172A' }}>
                        {offer.name}
                      </h3>
                      {offer.best && (
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={{
                            background: '#0EA5E9',
                            color: '#FFFFFF',
                            fontFamily: 'var(--font-body)',
                            fontWeight: 600,
                            fontSize: '10px',
                          }}
                        >
                          BEST MATCH
                        </span>
                      )}
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#94A3B8', marginTop: '1px' }}>
                      {offer.tag}
                    </p>
                  </div>
                  <CreditCard size={20} style={{ color: offer.best ? '#0EA5E9' : '#CBD5E1' }} />
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
                  {[
                    { label: 'AMOUNT', value: offer.amount },
                    { label: 'INTEREST', value: offer.interest },
                    { label: 'TENURE', value: offer.tenure },
                    { label: 'MONTHLY EMI', value: offer.emi },
                  ].map((s) => (
                    <div key={s.label}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        {s.label}
                      </p>
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A', marginTop: '2px' }}>
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Apply button */}
                <button
                  onClick={() => handleApply(offer.id)}
                  className="w-full rounded-xl"
                  style={{
                    height: '44px',
                    background: offer.best ? '#0EA5E9' : 'transparent',
                    border: offer.best ? 'none' : '1.5px solid #E2E8F0',
                    color: offer.best ? '#FFFFFF' : '#0EA5E9',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  Apply →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Active Loans ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: '1px solid #E2E8F0' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
            Active Loans
          </p>

          {applications.length === 0 ? (
            <div className="py-4 text-center">
              <div
                className="w-12 h-12 mx-auto rounded-full flex items-center justify-center"
                style={{ background: '#F1F5F9' }}
              >
                <CreditCard size={22} style={{ color: '#CBD5E1' }} />
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#94A3B8', marginTop: '8px' }}>
                No active loans.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((loan) => (
                <div
                  key={loan.id}
                  className="rounded-xl p-4"
                  style={{ border: '1px solid #E2E8F0', background: '#F8FAFC' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px', color: '#0F172A' }}>
                        {loan.lender}
                      </p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                        {loan.amount} · {loan.tenure}
                      </p>
                    </div>
                    <span
                      className="px-2.5 py-1 rounded-full"
                      style={{ background: '#FEF3C7', color: '#D97706', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px' }}
                    >
                      Under Review
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8' }}>
                      App ID: {loan.id}
                    </span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8' }}>
                      Submitted {loan.submittedOn}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── How was this calculated? ── */}
        <div data-tour-id="tour-loan-explainer" className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #E2E8F0' }}>
          <button
            onClick={() => setExplainerExpanded(!explainerExpanded)}
            className="w-full px-5 py-4 flex items-center justify-between"
          >
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px', color: '#0F172A' }}>
              How was this calculated?
            </span>
            <ChevronUp
              size={20}
              style={{
                color: '#64748B',
                transform: explainerExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.3s',
              }}
            />
          </button>

          {explainerExpanded && (
            <div className="px-5 pb-5">
              <div className="space-y-2.5 mb-4">
                {[
                  '18 months of income history verified',
                  'Cross-platform earnings aggregated: Swiggy, Blinkit, Ola',
                  'No single employer required — gig income counts',
                  'Pre-approval = 1.8× monthly income (industry standard)',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle size={15} style={{ color: '#22C55E', marginTop: 1, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', lineHeight: 1.5 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Trust Score */}
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>
                  GigShield Trust Score
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>
                  742 / 900
                </span>
              </div>
              <div className="w-full rounded-full overflow-hidden" style={{ height: '8px', background: '#E2E8F0' }}>
                <div style={{ width: '82.4%', height: '100%', background: 'linear-gradient(90deg, #22C55E, #0EA5E9)' }} />
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8', marginTop: '6px' }}>
                Trust score is simulated in prototype.
              </p>
            </div>
          )}
        </div>

      </div>

      <BottomNav active="loans" />
    </div>
  );
}
