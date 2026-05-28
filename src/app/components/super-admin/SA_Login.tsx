import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { GigShieldMark } from '../shared/GigShieldLogo';

export default function SA_Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState(false);
  const [countdown, setCountdown] = useState(28);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (step === 'otp') {
      setCountdown(28);
      otpRefs.current[0]?.focus();
      timerRef.current = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) { clearInterval(timerRef.current!); return 0; }
          return c - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  const handleCredentials = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 800);
  };

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError(false);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.join('') === '123456') {
      navigate('/super-admin/dashboard');
    } else {
      setOtpError(true);
    }
  };

  const handleResend = () => {
    if (countdown === 0) {
      setCountdown(28);
      setOtp(['', '', '', '', '', '']);
      setOtpError(false);
      timerRef.current = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) { clearInterval(timerRef.current!); return 0; }
          return c - 1;
        });
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#0F172A' }}>
      <div className="bg-white rounded-2xl p-8 shadow-2xl w-full" style={{ maxWidth: '440px' }}>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <GigShieldMark color="#1B2E6B" size={26} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: '#0F172A', letterSpacing: '0.04em' }}>GigShield</span>
            </div>
            <span style={{
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
              background: '#1C1C1C', color: '#FDE68A', padding: '3px 10px', borderRadius: '100px',
              border: '1px solid #B45309'
            }}>
              GigShield Internal Use Only
            </span>
          </div>
          {step === 'credentials' ? (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: '#0F172A', marginBottom: '4px' }}>
                Super Admin Login
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748B' }}>
                Restricted access — GigShield team only.
              </p>
            </>
          ) : (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: '#0F172A', marginBottom: '4px' }}>
                Two-Factor Authentication
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748B' }}>
                Enter the 6-digit code sent to your authenticator.
              </p>
            </>
          )}
        </div>

        {/* Credentials box */}
        <div className="mb-5 p-3 rounded-lg" style={{ background: '#FEF3C7', border: '1px solid #FCD34D' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', color: '#92400E', marginBottom: '4px' }}>Demo Credentials</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#78350F' }}>Email: sarthak@gigshield.in</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#78350F' }}>Password: superadmin123</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#78350F' }}>OTP: 123456</p>
        </div>

        {step === 'credentials' && (
          <>
            <div className="mb-4">
              <label style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="sarthak@gigshield.in"
                className="w-full px-4 rounded-lg outline-none"
                style={{ height: '48px', border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '14px', color: '#0F172A' }}
              />
            </div>

            <div className="mb-5">
              <label style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 rounded-lg outline-none"
                  style={{ height: '48px', border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '14px', color: '#0F172A', paddingRight: '48px' }}
                  onKeyDown={e => e.key === 'Enter' && handleCredentials()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleCredentials}
              disabled={loading}
              className="w-full rounded-xl flex items-center justify-center"
              style={{
                height: '50px',
                background: loading ? '#D97706' : '#B45309',
                color: '#FFFFFF',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '15px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Verifying…' : 'Login & Continue to 2FA →'}
            </button>
          </>
        )}

        {step === 'otp' && (
          <>
            <div className="flex gap-2 justify-center mb-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { otpRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={e => handleOTPChange(index, e.target.value)}
                  onKeyDown={e => handleOTPKeyDown(index, e)}
                  maxLength={1}
                  className="text-center outline-none"
                  style={{
                    width: '52px',
                    height: '60px',
                    border: otpError ? '2px solid #EF4444' : '1.5px solid #E2E8F0',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    fontSize: '24px',
                    color: '#0F172A',
                  }}
                />
              ))}
            </div>

            {otpError && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#EF4444', textAlign: 'center', marginBottom: '8px' }}>
                Incorrect code. Please try again.
              </p>
            )}

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#94A3B8', textAlign: 'center', marginBottom: '8px' }}>
              Demo OTP: 123456
            </p>

            <div className="text-center mb-4">
              {countdown > 0 ? (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#94A3B8' }}>
                  Resend code in <strong>{countdown}s</strong>
                </p>
              ) : (
                <button onClick={handleResend} style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#B45309', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Resend Code
                </button>
              )}
            </div>

            <button
              onClick={handleVerify}
              className="w-full rounded-xl flex items-center justify-center mb-3"
              style={{
                height: '50px',
                background: '#B45309',
                color: '#FFFFFF',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '15px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Verify & Enter Admin Panel →
            </button>

            <button
              onClick={() => setStep('credentials')}
              style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', display: 'block', margin: '0 auto' }}
            >
              ← Back to login
            </button>
          </>
        )}
      </div>

      {/* Portal link */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <button onClick={() => navigate('/platform-admin/login')}
          style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#475569', background: 'none', border: 'none', cursor: 'pointer' }}>
          Platform Admin Login →
        </button>
      </div>
    </div>
  );
}
