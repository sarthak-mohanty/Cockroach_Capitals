import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { GigShieldMark } from '../shared/GigShieldLogo';

export default function PA_Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!email.trim() || !password.trim()) {
      setError('Invalid email or password.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/platform-admin/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#1A3C5E' }}>
      <div className="bg-white rounded-2xl p-8 shadow-2xl w-full" style={{ maxWidth: '440px' }}>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2.5 mb-4">
            <GigShieldMark color="#1B2E6B" size={26} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: '#0F172A', letterSpacing: '0.04em' }}>GigShield</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: '#0F172A', marginBottom: '4px' }}>
            Platform Admin Login
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748B' }}>
            Sign in to manage your platform's workers.
          </p>
        </div>

        {/* Credentials hint */}
        <div className="mb-5 p-3 rounded-lg" style={{ background: '#FEF3C7', border: '1px solid #FCD34D' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', color: '#92400E', marginBottom: '4px' }}>Demo Credentials</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#78350F' }}>Email: priya@swiggy.com</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#78350F' }}>Password: admin123</p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="priya@swiggy.com"
            className="w-full px-4 rounded-lg outline-none"
            style={{ height: '48px', border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '14px', color: '#0F172A' }}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
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
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
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

        {/* Error */}
        {error && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#EF4444', marginBottom: '12px' }}>{error}</p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-xl flex items-center justify-center"
          style={{
            height: '50px',
            background: loading ? '#93C5FD' : '#1A3C5E',
            color: '#FFFFFF',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '15px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '20px',
          }}
        >
          {loading ? 'Signing in…' : 'Sign In →'}
        </button>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#94A3B8', textAlign: 'center' }}>
            By signing in you agree to GigShield's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      {/* Portal links */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <button onClick={() => navigate('/super-admin/login')}
          style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#93C5FD', background: 'none', border: 'none', cursor: 'pointer', marginRight: '16px' }}>
          Super Admin →
        </button>
        <button onClick={() => navigate('/worker/login')}
          style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#93C5FD', background: 'none', border: 'none', cursor: 'pointer' }}>
          Worker Portal →
        </button>
      </div>
    </div>
  );
}
