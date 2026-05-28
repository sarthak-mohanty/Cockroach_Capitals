import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';

const LENDER_MAP: Record<string, { name: string; amount: string; tenure: string; emi: string }> = {
  kreditbee: { name: 'KreditBee', amount: '₹45,000', tenure: '18 months', emi: '₹2,850' },
  moneytap:  { name: 'MoneyTap',  amount: '₹30,000', tenure: '12 months', emi: '₹2,750' },
  stashfin:  { name: 'Stashfin',  amount: '₹20,000', tenure: '12 months', emi: '₹1,840' },
};

export default function WorkerLoanApplication() {
  const navigate = useNavigate();
  const location = useLocation();

  const offerId = (location.state as { offerId?: string })?.offerId ?? 'kreditbee';
  const lender = LENDER_MAP[offerId] ?? LENDER_MAP['kreditbee'];

  const [submitted, setSubmitted] = useState(false);
  const [purpose, setPurpose] = useState('Education');
  const [loanAmount, setLoanAmount] = useState(lender.amount);
  const [savedLoanId, setSavedLoanId] = useState('');

  const handleSubmit = () => {
    const id = `APP-2024-${Math.floor(10000 + Math.random() * 90000)}`;
    const newLoan = {
      id,
      lender: lender.name,
      amount: loanAmount,
      tenure: lender.tenure,
      emi: lender.emi,
      purpose,
      submittedOn: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Under Review',
    };
    const existing = JSON.parse(localStorage.getItem('gigshield_loans') || '[]');
    localStorage.setItem('gigshield_loans', JSON.stringify([newLoan, ...existing]));
    setSavedLoanId(id);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#F0FDF4' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ background: '#22C55E' }}>
          <CheckCircle size={48} style={{ color: '#FFFFFF' }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '24px', color: '#0F172A', marginTop: '24px', textAlign: 'center' }}>
          Application Submitted!
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748B', marginTop: '8px', textAlign: 'center', lineHeight: '1.6' }}>
          {lender.name} will call you at +91-99999 99999 within 2 business days.
        </p>
        <div className="px-4 py-3 rounded-xl mt-4" style={{ background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', marginBottom: '2px' }}>Application ID</p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0EA5E9' }}>
            {savedLoanId}
          </p>
        </div>
        <div className="mt-4 w-full max-w-xs rounded-xl p-4" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <div className="flex justify-between mb-2">
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B' }}>Lender</span>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>{lender.name}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B' }}>Amount</span>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>{loanAmount}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B' }}>Tenure</span>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>{lender.tenure}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B' }}>Monthly EMI</span>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>{lender.emi}</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/worker/loan')}
          className="mt-6 px-16 rounded-xl"
          style={{
            height: '48px',
            background: '#0EA5E9',
            color: '#FFFFFF',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '15px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          View Loan Status →
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-4 flex items-center" style={{ height: '56px', borderColor: '#E2E8F0' }}>
        <button onClick={() => navigate('/worker/loan')} className="mr-4">
          <ArrowLeft size={24} style={{ color: '#0F172A' }} />
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '18px', color: '#0F172A' }}>
          Loan Application
        </h1>
      </div>

      {/* Disclaimer */}
      <div className="w-full px-4 py-2.5" style={{ background: '#FEF3C7', borderBottom: '2px solid #F59E0B' }}>
        <div className="flex items-start gap-2">
          <AlertTriangle size={16} style={{ color: '#D97706', flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '12px', color: '#92400E' }}>
            PROTOTYPE — No real loan application is being submitted.
          </p>
        </div>
      </div>

      <div className="px-4 pt-4 pb-8">
        {/* Lender Identity */}
        <div className="mb-6">
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>
            Applying with
          </p>
          <div className="flex items-center gap-2 mt-1">
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '18px', color: '#0F172A' }}>
              {lender.name}
            </h2>
            {offerId === 'kreditbee' && (
              <span className="px-2.5 py-1 rounded-full" style={{ background: '#0EA5E9', color: '#FFFFFF', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '11px' }}>
                Best Match
              </span>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A', display: 'block', marginBottom: '8px' }}>
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value="Raju Yadav"
                disabled
                className="w-full px-3 rounded-md"
                style={{ height: '48px', border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '14px', background: '#F8FAFC', color: '#64748B' }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ fontSize: '16px' }}>🔒</span>
            </div>
          </div>

          {/* Loan Amount — controlled, user can edit */}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A', display: 'block', marginBottom: '8px' }}>
              Loan Amount
            </label>
            <input
              type="text"
              value={loanAmount}
              onChange={e => setLoanAmount(e.target.value)}
              className="w-full px-3 rounded-md outline-none"
              style={{ height: '48px', border: '1.5px solid #0EA5E9', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', background: '#FFFFFF' }}
            />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
              Max pre-approved: {lender.amount}
            </p>
          </div>

          {/* Purpose */}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A', display: 'block', marginBottom: '8px' }}>
              Purpose
            </label>
            <select
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              className="w-full px-3 rounded-md outline-none"
              style={{ height: '48px', border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '14px', background: '#FFFFFF' }}
            >
              <option>Education</option>
              <option>Medical</option>
              <option>Home Repair</option>
              <option>Vehicle</option>
              <option>Other</option>
            </select>
          </div>

          {/* Monthly EMI */}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A', display: 'block', marginBottom: '8px' }}>
              Monthly EMI
            </label>
            <input
              type="text"
              value={`${lender.emi} / month`}
              disabled
              className="w-full px-3 rounded-md"
              style={{ height: '48px', border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '14px', background: '#F8FAFC', color: '#64748B' }}
            />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
              Auto-calculated
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full mt-6 rounded-xl"
          style={{
            height: '52px',
            background: '#1A3C5E',
            color: '#FFFFFF',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Submit Application
        </button>
      </div>
    </div>
  );
}
