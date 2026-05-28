import { useNavigate } from 'react-router';
import { ArrowLeft, Download, CheckCircle, LogOut, FileText } from 'lucide-react';
import BottomNav from './BottomNav';
import { useToast } from '../shared/ToastContext';

export default function WorkerProfile() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const protoToast = () => addToast('This is a prototype — changes won\'t be saved.', 'warning');

  const platforms = [
    { name: 'Swiggy', logo: 'S', bg: '#FF6B00', joined: '12 Jan 2024' },
    { name: 'Blinkit', logo: 'B', bg: '#1C1C1C', joined: '3 Mar 2024' },
    { name: 'Ola', logo: 'O', bg: '#FFD700', textColor: '#000', joined: '18 Apr 2024' }
  ];

  const documents = [
    { label: 'Income Statement (PDF)', icon: 'download', href: null },
    { label: 'GigShield ID Card (PDF)', icon: 'download', href: '/gigshield-id-card.pdf' },
  ];

  const insuranceDocs = [
    { label: 'Insurance Certificate — PMSBY (ICICI Lombard)', icon: 'pdf' },
    { label: 'GigShield Cash Reimbursement Policy', icon: 'pdf' },
  ];

  return (
    <div data-tour-id="tour-worker-profile-page" className="min-h-screen pb-16" style={{ background: '#F8FAFC' }}>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-4 flex items-center" style={{ height: '56px', borderColor: '#E2E8F0' }}>
        <button onClick={() => navigate('/worker/home')} className="mr-4">
          <ArrowLeft size={24} style={{ color: '#0F172A' }} />
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '18px', color: '#0F172A' }}>
          My Profile
        </h1>
      </div>

      <div className="px-4 pt-6">
        {/* Profile Hero */}
        <div className="text-center mb-6">
          <div className="w-18 h-18 rounded-full mx-auto flex items-center justify-center" style={{ width: '72px', height: '72px', background: '#1A3C5E' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '24px', color: '#FFFFFF' }}>
              RY
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '20px', color: '#0F172A', marginTop: '12px' }}>
            Raju Yadav
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0EA5E9' }}>
            GS-2024-0847291
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
            Member since: 12 Jan 2024
          </p>
        </div>

        {/* Personal Details */}
        <div className="bg-white rounded-xl p-5 shadow-sm mb-4" style={{ border: '1px solid #E2E8F0' }}>
          <div className="flex items-center justify-between mb-4">
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Personal Details
            </p>
            <button
              onClick={protoToast}
              className="px-4 py-1.5 rounded-md"
              style={{ border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#0F172A', cursor: 'pointer' }}
            >
              Edit
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B' }}>Name</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>Raju Yadav</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B' }}>Phone</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>+91-99999 99999</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B' }}>City</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>Bengaluru</span>
            </div>
          </div>
        </div>

        {/* e-Shram UAN */}
        <div data-tour-id="tour-profile-eshram" className="bg-white rounded-xl p-5 shadow-sm mb-4" style={{ border: '1px solid #E2E8F0' }}>
          <div className="flex justify-between mb-2">
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B' }}>e-Shram UAN</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>12-3456-7890-1234</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle size={14} style={{ color: '#16A34A' }} />
            <span className="px-2 py-0.5 rounded-full" style={{ background: '#F0FDF4', color: '#16A34A', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '11px' }}>
              Verified via e-Shram API
            </span>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8', marginTop: '6px' }}>
            Integration live in production. Dummy UAN in prototype.
          </p>
        </div>

        {/* Bank Account */}
        <div className="bg-white rounded-xl p-5 shadow-sm mb-4" style={{ border: '1px solid #E2E8F0' }}>
          <div className="flex items-center justify-between mb-4">
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Bank Account
            </p>
            <button
              onClick={protoToast}
              className="px-4 py-1.5 rounded-md"
              style={{ border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#0F172A', cursor: 'pointer' }}
            >
              Edit
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B' }}>Account</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>XXXX XXXX 1234</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B' }}>IFSC</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>SBIN0001234</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B' }}>Bank</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>State Bank of India</span>
            </div>
          </div>
        </div>

        {/* Linked Platforms */}
        <div data-tour-id="tour-profile-platforms" className="mb-4">
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
            My Platforms
          </p>
          {platforms.map((platform, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-4 mb-2 bg-white rounded-xl shadow-sm"
              style={{ border: '1px solid #E2E8F0' }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: platform.bg }}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: platform.textColor || '#FFFFFF' }}>
                  {platform.logo}
                </span>
              </div>
              <div className="flex-1">
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A' }}>
                  {platform.name}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>
                  Joined {platform.joined}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: '#22C55E' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#22C55E' }}>Active</span>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-xl p-5 shadow-sm mb-4" style={{ border: '1px solid #E2E8F0' }}>
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Emergency Contact
            </p>
            <button
              onClick={protoToast}
              className="px-4 py-1.5 rounded-md"
              style={{ border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#0F172A', cursor: 'pointer' }}
            >
              Edit
            </button>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A' }}>
            Sunita Yadav
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B' }}>
            +91-98765 43210
          </p>
        </div>

        {/* Documents */}
        <div className="mb-4">
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
            Documents
          </p>
          <div className="space-y-2">
            {documents.map((doc, idx) => (
              doc.href ? (
                <a
                  key={idx}
                  href={doc.href}
                  download="GigShield_ID_Card.pdf"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white rounded-md"
                  style={{ border: '1.5px solid #0EA5E9', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px', color: '#0EA5E9', textDecoration: 'none', display: 'flex' }}
                >
                  <Download size={16} />
                  {doc.label}
                </a>
              ) : (
                <button
                  key={idx}
                  onClick={() => addToast('Income statement available in production.', 'warning')}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white rounded-md"
                  style={{ border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#64748B', cursor: 'pointer' }}
                >
                  <Download size={16} />
                  {doc.label}
                </button>
              )
            ))}

            {/* Insurance documents */}
            {insuranceDocs.map((doc, idx) => (
              <button
                key={`ins-${idx}`}
                onClick={() => addToast('PDF would download here in production.', 'warning')}
                className="w-full flex items-center gap-3 py-3 px-4 bg-white rounded-md"
                style={{ border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#0F172A', textAlign: 'left' }}
              >
                <FileText size={16} style={{ color: '#0EA5E9', flexShrink: 0 }} />
                <span className="flex-1">{doc.label}</span>
                <Download size={14} style={{ color: '#94A3B8', flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </div>
        {/* Logout */}
        <button
          onClick={() => navigate('/worker/login')}
          className="w-full flex items-center justify-center gap-2 rounded-xl mb-6"
          style={{
            height: '52px',
            border: '1.5px solid #FEE2E2',
            background: '#FFF5F5',
            color: '#EF4444',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '15px',
            cursor: 'pointer',
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <BottomNav active="profile" />
    </div>
  );
}
