import { useState } from 'react';
import { useNavigate } from 'react-router';
import PlatformAdminLayout from './PlatformAdminLayout';
import { useSimulation } from '../../simulation/SimulationContext';
import { CheckCircle, UserPlus, Play } from 'lucide-react';

const KNOWN_PHONES = ['9999999999', '9876543210', '8888888888'];

interface FormData {
  fullName: string;
  phone: string;
  aadhaar: string;
  pan: string;
  platform: string;
  city: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  aadhaar?: string;
  pan?: string;
  platform?: string;
  city?: string;
}

function generateGSID() {
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `GS-2026-084${rand}`;
}

// The platform is fixed to the logged-in admin's platform (Swiggy in this prototype)
const ADMIN_PLATFORM = 'Swiggy';

export default function PA_RegisterWorker() {
  const navigate = useNavigate();
  const { fireDelivery } = useSimulation();
  const [form, setForm] = useState<FormData>({
    fullName: '',
    phone: '',
    aadhaar: '',
    pan: '',
    platform: ADMIN_PLATFORM,
    city: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [gsid, setGsid] = useState('');

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = 'Enter a valid 10-digit phone number.';
    else if (KNOWN_PHONES.includes(form.phone.replace(/\s/g, ''))) errs.phone = 'This phone number is already registered.';
    if (!/^\d{12}$/.test(form.aadhaar.replace(/\s/g, ''))) errs.aadhaar = 'Aadhaar must be 12 digits.';
    if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(form.pan.toUpperCase())) errs.pan = 'Enter a valid PAN (e.g. ABCDE1234F).';
    if (!form.platform) errs.platform = 'Select a platform.';
    if (!form.city.trim()) errs.city = 'City is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGsid(generateGSID());
      setSuccess(true);
    }, 1200);
  };

  const handleReset = () => {
    setForm({ fullName: '', phone: '', aadhaar: '', pan: '', platform: '', city: '' });
    setErrors({});
    setSuccess(false);
    setGsid('');
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    height: '44px',
    border: `1.5px solid ${hasError ? '#EF4444' : '#E2E8F0'}`,
    borderRadius: '8px',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: '#0F172A',
    width: '100%',
    padding: '0 12px',
    outline: 'none',
    background: '#FFFFFF',
  });

  if (success) {
    return (
      <PlatformAdminLayout activeScreen="register">
        <div className="p-6 flex items-center justify-center min-h-[calc(100vh-56px)]">
          <div className="bg-white rounded-2xl p-10 text-center" style={{ border: '1px solid #E2E8F0', maxWidth: '480px', width: '100%' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: '#F0FDF4' }}>
              <CheckCircle size={36} style={{ color: '#16A34A' }} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: '#0F172A', marginBottom: '8px' }}>
              Worker Registered!
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748B', marginBottom: '20px' }}>
              {form.fullName} has been successfully added to GigShield.
            </p>
            <div className="rounded-xl p-4 mb-6" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>GigShield Worker ID</p>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '24px', color: '#16A34A', letterSpacing: '0.04em' }}>{gsid}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 rounded-xl flex items-center justify-center gap-2"
                style={{ height: '46px', background: '#1A3C5E', color: '#FFFFFF', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer' }}
              >
                <UserPlus size={16} />
                Register Another
              </button>
              <button
                onClick={() => navigate('/platform-admin/search')}
                className="flex-1 rounded-xl"
                style={{ height: '46px', background: '#F1F5F9', color: '#0F172A', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer' }}
              >
                View in Search
              </button>
            </div>

            {/* 2D — Simulate first delivery link */}
            <button
              onClick={() => {
                fireDelivery({ workerName: form.fullName, platform: form.platform || 'Swiggy', amount: 80 });
                navigate('/platform-admin/dashboard');
              }}
              className="w-full flex items-center justify-center gap-1.5 mt-2"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#22C55E' }}
            >
              <Play size={13} />
              Simulate first delivery for {form.fullName} →
            </button>
          </div>
        </div>
      </PlatformAdminLayout>
    );
  }

  return (
    <PlatformAdminLayout activeScreen="register">
      <div className="p-6">
        <div className="mb-6">
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: '#0F172A' }}>Register New Worker</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
            Add a gig worker to the GigShield network under your platform.
          </p>
        </div>

        <div data-tour-id="tour-pa-register-form" className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0', maxWidth: '640px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                Full Name <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input value={form.fullName} onChange={set('fullName')} placeholder="Ravi Kumar" style={inputStyle(!!errors.fullName)} />
              {errors.fullName && <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.fullName}</p>}
            </div>

            {/* Phone */}
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                Mobile Number <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input value={form.phone} onChange={set('phone')} placeholder="98765 43210" type="tel" style={inputStyle(!!errors.phone)} />
              {errors.phone && <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.phone}</p>}
            </div>

            {/* Platform — locked to the logged-in admin's platform */}
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                Platform
              </label>
              <div
                style={{
                  height: '44px', border: '1.5px solid #E2E8F0', borderRadius: '8px',
                  background: '#F8FAFC', display: 'flex', alignItems: 'center',
                  padding: '0 12px', gap: '8px',
                }}
              >
                <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ background: '#FF6B00' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '10px', color: '#FFFFFF' }}>S</span>
                </div>
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px', color: '#0F172A' }}>{ADMIN_PLATFORM}</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8' }}>Your platform</span>
              </div>
            </div>

            {/* Aadhaar */}
            <div data-tour-id="tour-pa-register-kyc">
              <label style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                Aadhaar Number <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input value={form.aadhaar} onChange={set('aadhaar')} placeholder="1234 5678 9012" type="text" maxLength={14} style={inputStyle(!!errors.aadhaar)} />
              {errors.aadhaar && <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.aadhaar}</p>}
            </div>

            {/* PAN */}
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                PAN Number <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input value={form.pan} onChange={set('pan')} placeholder="ABCDE1234F" maxLength={10} style={inputStyle(!!errors.pan)} />
              {errors.pan && <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.pan}</p>}
            </div>

            {/* City */}
            <div className="sm:col-span-2">
              <label style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                City <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input value={form.city} onChange={set('city')} placeholder="Bengaluru" style={inputStyle(!!errors.city)} />
              {errors.city && <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.city}</p>}
            </div>
          </div>

          {/* Note */}
          <div className="mt-5 p-3 rounded-lg" style={{ background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#0369A1' }}>
              By registering this worker, you confirm that the worker has provided consent and all details are verified per PWFVS guidelines.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => window.history.back()}
              style={{ height: '46px', padding: '0 20px', background: '#F1F5F9', color: '#0F172A', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              data-tour-id="tour-pa-register-submit"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 rounded-xl flex items-center justify-center gap-2"
              style={{
                height: '46px',
                background: loading ? '#93C5FD' : '#1A3C5E',
                color: '#FFFFFF',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '14px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Registering…' : (
                <><UserPlus size={16} /> Register Worker</>
              )}
            </button>
          </div>
        </div>
      </div>
    </PlatformAdminLayout>
  );
}
