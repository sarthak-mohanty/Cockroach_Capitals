import { useState } from 'react';
import SuperAdminLayout from './SuperAdminLayout';
import SlidePanel from '../shared/SlidePanel';
import ConfirmModal from '../shared/ConfirmModal';
import { useToast } from '../shared/ToastContext';
import { Plus, RefreshCw, Power, Globe, Copy } from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  contact: string;
  email: string;
  apiKey: string;
  workers: number;
  status: 'active' | 'pending' | 'inactive';
  joined: string;
  color: string;
}

const PLATFORMS: Platform[] = [
  { id: 'PLT-001', name: 'Swiggy India', contact: 'Priya Menon', email: 'priya@swiggy.com', apiKey: 'gs_live_swg_••••••••••••ab12', workers: 1284, status: 'active', joined: 'Jan 1, 2026', color: '#FF6B00' },
  { id: 'PLT-002', name: 'Blinkit', contact: 'Amit Sharma', email: 'amit@blinkit.com', apiKey: 'gs_live_blk_••••••••••••cd34', workers: 876, status: 'active', joined: 'Jan 15, 2026', color: '#FCD34D' },
  { id: 'PLT-003', name: 'Ola Electric', contact: 'Kavita Rao', email: 'kavita@ola.com', apiKey: 'gs_live_ola_••••••••••••ef56', workers: 542, status: 'active', joined: 'Feb 1, 2026', color: '#22C55E' },
  { id: 'PLT-004', name: 'Porter', contact: 'Rohan Joshi', email: 'rohan@porter.in', apiKey: 'gs_live_prt_••••••••••••gh78', workers: 218, status: 'pending', joined: 'May 1, 2026', color: '#8B5CF6' },
];

interface NewPlatformForm {
  name: string;
  contact: string;
  email: string;
  city: string;
  website: string;
}

export default function SA_Platforms() {
  const { addToast } = useToast();
  const [platforms, setPlatforms] = useState<Platform[]>(PLATFORMS);
  const [addOpen, setAddOpen] = useState(false);
  const [regenTarget, setRegenTarget] = useState<Platform | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<Platform | null>(null);

  const [form, setForm] = useState<NewPlatformForm>({ name: '', contact: '', email: '', city: '', website: '' });

  const set = (field: keyof NewPlatformForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleAdd = () => {
    if (!form.name.trim() || !form.email.trim()) {
      addToast('Platform name and email are required.', 'error');
      return;
    }
    const newP: Platform = {
      id: `PLT-00${platforms.length + 1}`,
      name: form.name,
      contact: form.contact,
      email: form.email,
      apiKey: `gs_live_new_••••••••••••zz99`,
      workers: 0,
      status: 'pending',
      joined: 'May 26, 2026',
      color: '#6366F1',
    };
    setPlatforms(prev => [...prev, newP]);
    setForm({ name: '', contact: '', email: '', city: '', website: '' });
    setAddOpen(false);
    addToast(`${form.name} platform added successfully.`, 'success');
  };

  const handleRegen = () => {
    if (!regenTarget) return;
    setPlatforms(prev => prev.map(p => p.id === regenTarget.id ? { ...p, apiKey: `gs_live_new_••••••••••••${Math.random().toString(36).slice(-4)}` } : p));
    addToast(`API key regenerated for ${regenTarget.name}.`, 'success');
  };

  const handleDeactivate = () => {
    if (!deactivateTarget) return;
    setPlatforms(prev => prev.map(p => p.id === deactivateTarget.id ? { ...p, status: 'inactive' } : p));
    addToast(`${deactivateTarget.name} has been deactivated.`, 'warning');
  };

  const inputStyle: React.CSSProperties = {
    height: '42px', border: '1.5px solid #E2E8F0', borderRadius: '8px',
    fontFamily: 'var(--font-body)', fontSize: '14px', color: '#0F172A',
    width: '100%', padding: '0 12px', outline: 'none',
  };

  const statusColors: Record<string, { bg: string; color: string }> = {
    active: { bg: '#F0FDF4', color: '#16A34A' },
    pending: { bg: '#FEF3C7', color: '#D97706' },
    inactive: { bg: '#F1F5F9', color: '#64748B' },
  };

  return (
    <SuperAdminLayout activeScreen="platforms" title="Platforms">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: '#0F172A' }}>Platforms</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
              {platforms.filter(p => p.status === 'active').length} active · {platforms.length} total
            </p>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 rounded-lg px-4"
            style={{ height: '40px', background: '#0F172A', color: '#FDE68A', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}
          >
            <Plus size={15} />
            Add New Platform
          </button>
        </div>

        <div data-tour-id="tour-sa-platforms-table" className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {platforms.map(p => {
            const sc = statusColors[p.status];
            return (
              <div key={p.id} className="bg-white rounded-xl p-5" style={{ border: '1px solid #E2E8F0' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${p.color}20` }}>
                      <Globe size={20} style={{ color: p.color }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>{p.name}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>{p.id} · Joined {p.joined}</p>
                    </div>
                  </div>
                  <span style={{ background: sc.bg, color: sc.color, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', padding: '2px 8px', borderRadius: '100px' }}>
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8' }}>Contact</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#0F172A' }}>{p.contact}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>{p.email}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8' }}>Workers</p>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: '#0F172A' }}>{p.workers.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                {/* API Key */}
                <div className="mb-4 p-3 rounded-lg flex items-center justify-between gap-2" style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                  <code style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0F172A', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.apiKey}</code>
                  <button onClick={() => { navigator.clipboard?.writeText(p.apiKey); addToast('API key copied.', 'success'); }} style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                    <Copy size={14} />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setRegenTarget(p)}
                    className="flex items-center gap-1.5 px-3 rounded-lg"
                    style={{ height: '36px', background: '#F0F9FF', color: '#0369A1', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', border: '1px solid #BAE6FD', cursor: 'pointer', flex: 1, justifyContent: 'center' }}
                  >
                    <RefreshCw size={13} />
                    Regen Key
                  </button>
                  {p.status !== 'inactive' && (
                    <button
                      onClick={() => setDeactivateTarget(p)}
                      className="flex items-center gap-1.5 px-3 rounded-lg"
                      style={{ height: '36px', background: '#FEF2F2', color: '#DC2626', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', border: '1px solid #FECACA', cursor: 'pointer', flex: 1, justifyContent: 'center' }}
                    >
                      <Power size={13} />
                      Deactivate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Platform SlidePanel */}
      <SlidePanel
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Platform"
        subtitle="Onboard a new gig platform partner"
        width="480px"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setAddOpen(false)} style={{ height: '44px', padding: '0 20px', background: '#F1F5F9', color: '#0F172A', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Cancel
            </button>
            <button onClick={handleAdd} className="flex-1 rounded-lg" style={{ height: '44px', background: '#0F172A', color: '#FDE68A', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}>
              Create Platform
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {[
            { field: 'name' as keyof NewPlatformForm, label: 'Platform Name', placeholder: 'e.g. Zepto' },
            { field: 'contact' as keyof NewPlatformForm, label: 'Primary Contact', placeholder: 'e.g. Aarav Shah' },
            { field: 'email' as keyof NewPlatformForm, label: 'Contact Email', placeholder: 'e.g. aarav@zepto.com' },
            { field: 'city' as keyof NewPlatformForm, label: 'HQ City', placeholder: 'e.g. Mumbai' },
            { field: 'website' as keyof NewPlatformForm, label: 'Website', placeholder: 'e.g. https://zepto.com' },
          ].map(f => (
            <div key={f.field}>
              <label style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                {f.label}
              </label>
              <input value={form[f.field]} onChange={set(f.field)} placeholder={f.placeholder} style={inputStyle} />
            </div>
          ))}
          <div className="p-3 rounded-lg" style={{ background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#0369A1' }}>
              An API key will be auto-generated. The platform contact will receive onboarding instructions via email.
            </p>
          </div>
        </div>
      </SlidePanel>

      {/* Regen Key ConfirmModal */}
      <ConfirmModal
        isOpen={!!regenTarget}
        onClose={() => setRegenTarget(null)}
        onConfirm={handleRegen}
        title="Regenerate API Key?"
        description={`This will immediately invalidate the existing key for ${regenTarget?.name}. Their integration will break until they update to the new key.`}
        confirmLabel="Regenerate Key"
        confirmVariant="warning"
      />

      {/* Deactivate ConfirmModal */}
      <ConfirmModal
        isOpen={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivate}
        title="Deactivate Platform?"
        description={`Deactivating ${deactivateTarget?.name} will suspend all worker registrations and contributions for this platform. This action can be reversed.`}
        confirmLabel="Deactivate"
        confirmVariant="danger"
        requireTypedConfirm="DEACTIVATE"
      />
    </SuperAdminLayout>
  );
}
