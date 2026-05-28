import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { GigShieldMark } from '../shared/GigShieldLogo';

const CREDENTIALS = [
  {
    role: 'Platform Admin',
    email: 'priya@swiggy.com',
    password: 'admin123',
    path: '/platform-admin/dashboard',
    requiresOtp: false,
    badgeColor: '#0EA5E9',
    otp: null,
  },
  {
    role: 'Super Admin',
    email: 'sarthak@gigshield.in',
    password: 'superadmin123',
    path: '/super-admin/dashboard',
    requiresOtp: true,
    badgeColor: '#B45309',
    otp: '123456',
  },
];

export default function AdminLogin() {
  const navigate = useNavigate();

  // credentials step
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [credError, setCredError] = useState('');

  // routing state
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [destinationPath, setDestinationPath] = useState('');

  // otp step
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

  const handleLogin = () => {
    const match = CREDENTIALS.find(
      c => c.email === email.trim() && c.password === password
    );
    if (!match) {
      setCredError('Invalid email or password.');
      return;
    }
    setCredError('');
    if (match.requiresOtp) {
      // Super Admin path — clear SA tour so prompt reappears after every login
      localStorage.removeItem('gigshield_tour_done_sa');
      setDestinationPath(match.path);
      setStep('otp');
    } else {
      // Platform Admin path — clear PA tour so prompt reappears after every login
      localStorage.removeItem('gigshield_tour_done_pa');
      navigate(match.path);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError(false);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.join('') === '123456') {
      navigate(destinationPath);
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#1A3C5E' }}>

      {/* Top-right: Worker portal link */}
      <div className="absolute top-0 right-0 flex items-center gap-3 px-6 sm:px-8 py-5">
        <span className="hidden sm:inline" style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#93C5FD' }}>
          Worker portal?
        </span>
        <button
          onClick={() => navigate('/worker/login')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{
            border: '1.5px solid rgba(255,255,255,0.25)',
            background: 'rgba(255,255,255,0.08)',
            color: '#FFFFFF',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Login as Employee →
        </button>
      </div>

      {/* Logo */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <GigShieldMark color="white" size={38} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '26px', color: '#FFFFFF', letterSpacing: '0.04em' }}>
            GigShield
          </h1>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#93C5FD' }}>
          Admin Portal
        </p>
      </div>

      {/* Card */}
      <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ maxWidth: '460px' }}>

        {/* ── Credential hint panel ── */}
        <div style={{ background: '#FFFBEB', borderBottom: '1px solid #FCD34D' }}>
          <div className="px-5 py-2.5" style={{ borderBottom: '1px solid #FEF3C7' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '11px', color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Demo Credentials
            </p>
          </div>
          <div>
            {CREDENTIALS.map((c, idx) => (
              <div
                key={c.role}
                className="flex items-start gap-3 px-5 py-3"
                style={{ borderBottom: idx < CREDENTIALS.length - 1 ? '1px solid #FEF3C7' : 'none' }}
              >
                <span
                  className="flex-shrink-0 px-2 py-0.5 rounded-full"
                  style={{
                    background: c.badgeColor,
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: '10px',
                    whiteSpace: 'nowrap',
                    marginTop: '2px',
                  }}
                >
                  {c.role}
                </span>
                <div className="min-w-0">
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#78350F' }}>
                    {c.email}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#92400E' }}>
                    <span style={{ fontWeight: 600 }}>{c.password}</span>
                    {c.requiresOtp && (
                      <span style={{ fontWeight: 400, color: '#78350F' }}> · OTP: 123456</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Credentials step ── */}
        {step === 'credentials' && (
          <div className="p-6 sm:p-8">
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', color: '#0F172A', marginBottom: '20px' }}>
              Sign in
            </h2>

            {/* Email */}
            <div className="mb-4">
              <label style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A', display: 'block', marginBottom: '8px' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 rounded-lg outline-none"
                style={{ height: '48px', border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '14px', color: '#0F172A' }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <label style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A', display: 'block', marginBottom: '8px' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 rounded-lg outline-none"
                  style={{ height: '48px', border: `1.5px solid ${credError ? '#EF4444' : '#E2E8F0'}`, fontFamily: 'var(--font-body)', fontSize: '14px', color: '#0F172A', paddingRight: '48px' }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {credError && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#EF4444', marginTop: '6px' }}>
                  {credError}
                </p>
              )}
            </div>

            <button
              onClick={handleLogin}
              className="w-full rounded-xl"
              style={{
                height: '50px',
                background: '#1A3C5E',
                color: '#FFFFFF',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '15px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Login →
            </button>
          </div>
        )}

        {/* ── OTP step (Super Admin only) ── */}
        {step === 'otp' && (
          <div className="p-6 sm:p-8">
            <button
              onClick={() => { setStep('credentials'); setOtp(['', '', '', '', '', '']); setOtpError(false); }}
              style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '16px', display: 'block' }}
            >
              ← Back
            </button>

            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', color: '#0F172A', marginBottom: '4px' }}>
              Two-Factor Authentication
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>
              Enter the 6-digit code sent to your authenticator.
            </p>

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
                    width: '48px',
                    height: '56px',
                    border: otpError ? '2px solid #EF4444' : '1.5px solid #E2E8F0',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    fontSize: '22px',
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

            <div className="text-center mb-5">
              {countdown > 0 ? (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#94A3B8' }}>
                  Resend code in <strong>{countdown}s</strong>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#1A3C5E', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  Resend Code
                </button>
              )}
            </div>

            <button
              onClick={handleVerify}
              className="w-full rounded-xl"
              style={{
                height: '50px',
                background: '#1A3C5E',
                color: '#FFFFFF',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '15px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Verify & Enter →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
