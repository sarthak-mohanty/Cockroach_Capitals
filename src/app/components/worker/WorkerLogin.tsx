import { useState } from 'react';
import { useNavigate } from 'react-router';
import { GigShieldMark } from '../shared/GigShieldLogo';

export default function WorkerLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'phone' | 'otp' | 'error'>('phone');
  const [phone, setPhone] = useState('99999 99999');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleSendOTP = () => setStep('otp');

  const handleVerify = () => {
    if (otp.join('') === '123456') {
      // Reset tour so the welcome prompt appears fresh on every login
      localStorage.removeItem('gigshield_tour_done_worker');
      navigate('/worker/onboarding');
    } else {
      setStep('error');
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#1a3557' }}>

      {/* ── Top nav ── */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5">
        {/* Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <GigShieldMark color="white" size={34} className="flex-shrink-0" />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '17px', color: '#ffffff', lineHeight: 1, letterSpacing: '0.04em' }}>
              GigShield
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#93c5fd', marginTop: '2px' }}>
              India's Portable Benefit Wallet
            </div>
          </div>
        </div>

        {/* Admin link */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline" style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#93c5fd' }}>
            Platform manager?
          </span>
          <button
            onClick={() => navigate('/admin/login')}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg"
            style={{
              border: '1.5px solid rgba(255,255,255,0.25)',
              background: 'rgba(255,255,255,0.08)',
              color: '#ffffff',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" rx="1.5" fill="white" />
              <rect x="13" y="3" width="8" height="8" rx="1.5" fill="white" />
              <rect x="3" y="13" width="8" height="8" rx="1.5" fill="white" />
              <rect x="13" y="13" width="8" height="8" rx="1.5" fill="white" />
            </svg>
            <span className="hidden xs:inline">Login as Admin</span>
            <span className="xs:hidden">Admin →</span>
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      {/* On mobile: card stacked below a compact hero.
          On desktop (lg+): two-column side-by-side. */}
      <div className="flex flex-col lg:flex-row flex-1 items-center lg:items-center">

        {/* Left: hero — hidden on mobile below card, shown on lg */}
        <div className="flex-1 px-6 sm:px-10 lg:px-16 py-8 lg:py-12 text-center lg:text-left">
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(32px, 5vw, 56px)',
              lineHeight: 1.1,
              color: '#ffffff',
              marginBottom: '16px',
            }}
          >
            Welcome back,{' '}
            <span style={{ color: '#60a5fa' }}>your wallet is waiting.</span>
          </h1>
          <p
            className="mx-auto lg:mx-0"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(14px, 2vw, 17px)',
              color: '#93c5fd',
              lineHeight: 1.7,
              maxWidth: '440px',
              marginBottom: '32px',
            }}
          >
            Every delivery you've made across Swiggy, Blinkit, and Ola has been quietly building your insurance, pension, and credit history.
          </p>

          {/* Stats — 3-col always, text shrinks on mobile */}
          <div className="flex justify-center lg:justify-start gap-6 sm:gap-10 lg:gap-12">
            {[
              { value: '12,847', label: 'Workers Protected' },
              { value: '₹21.6L', label: 'Contributions This Month' },
              { value: '3', label: 'Platforms Integrated' },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(22px, 3vw, 32px)', color: '#ffffff' }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#64a3d4', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '4px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: login card */}
        <div className="w-full lg:w-auto lg:pr-16 px-4 sm:px-8 lg:px-0 py-6 lg:py-12">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl w-full" style={{ maxWidth: '420px', margin: '0 auto' }}>
            {step === 'phone' && (
              <>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: '#0f172a', marginBottom: '6px' }}>
                  Login to your wallet
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
                  Use the mobile number linked to your delivery platform.
                </p>

                <label style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                  Mobile Number
                </label>
                <div className="flex" style={{ height: '52px', border: '1.5px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
                  <div className="flex items-center justify-center px-4" style={{ background: '#f8fafc', borderRight: '1px solid #e2e8f0', minWidth: '64px' }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '15px', color: '#0f172a' }}>+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 px-4 outline-none"
                    style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#0f172a' }}
                  />
                </div>

                <button
                  onClick={handleSendOTP}
                  className="w-full rounded-xl flex items-center justify-center gap-2"
                  style={{
                    height: '52px',
                    background: '#0ea5e9',
                    color: '#ffffff',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: 'pointer',
                    border: 'none',
                    marginBottom: '12px',
                  }}
                >
                  Send OTP →
                </button>

                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#94a3b8', textAlign: 'center', marginBottom: '24px' }}>
                  Demo OTP: 123456
                </p>

                <div className="flex items-center justify-between" style={{ paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748b' }}>New to GigShield?</span>
                  <button style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0ea5e9', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Find your account →
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4" style={{ paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                  <div className="flex items-center gap-2">
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748b' }}>All systems operational</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748b' }}>
                    Need help? <span style={{ color: '#0ea5e9', fontWeight: 600 }}>1800-123-4567</span>
                  </span>
                </div>
              </>
            )}

            {(step === 'otp' || step === 'error') && (
              <>
                <button
                  onClick={() => setStep('phone')}
                  style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px', padding: 0 }}
                >
                  ← Back
                </button>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: '#0f172a', marginBottom: '6px' }}>
                  Enter OTP
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
                  OTP sent to +91 {phone}
                </p>
                <div className="flex gap-2 justify-center mb-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      maxLength={1}
                      className="text-center outline-none"
                      style={{
                        width: '44px',
                        height: '52px',
                        border: step === 'error' ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
                        borderRadius: '10px',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 600,
                        fontSize: '22px',
                        color: '#0f172a',
                      }}
                    />
                  ))}
                </div>
                {step === 'error' && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#ef4444', textAlign: 'center', marginBottom: '4px' }}>
                    Incorrect OTP. Try again.
                  </p>
                )}
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#94a3b8', textAlign: 'center', marginBottom: '8px' }}>
                  Demo OTP: 123456
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0ea5e9', textAlign: 'center', marginBottom: '16px' }}>
                  Resend OTP (28s)
                </p>
                <button
                  onClick={handleVerify}
                  className="w-full rounded-xl"
                  style={{
                    height: '52px',
                    background: '#0ea5e9',
                    color: '#ffffff',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: 'pointer',
                    border: 'none',
                  }}
                >
                  Verify & Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-4 sm:px-8 pb-5">
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#4a7aa8' }}>
          An Initiative by Cockroach's Capitals
        </span>
      </div>

    </div>
  );
}
