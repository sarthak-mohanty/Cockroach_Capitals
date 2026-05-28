import { useState, useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
export default function ConfirmModal({ isOpen, onClose, onConfirm, title, description, confirmLabel, confirmVariant, requireTypedConfirm }: {
  isOpen: boolean; onClose: () => void; onConfirm: () => void;
  title: string; description: string; confirmLabel: string;
  confirmVariant: 'danger' | 'warning'; requireTypedConfirm?: string;
}) {
  const [typed, setTyped] = useState('');
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (isOpen) { setTyped(''); setTimeout(() => cancelRef.current?.focus(), 50); } }, [isOpen]);
  if (!isOpen) return null;
  const confirmBg = confirmVariant === 'danger' ? '#EF4444' : '#F59E0B';
  const canConfirm = !requireTypedConfirm || typed === requireTypedConfirm;
  return (
    <>
      <div className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-8 z-50 w-11/12" style={{ maxWidth: '480px', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4"
            style={{ background: confirmVariant === 'danger' ? '#FEF2F2' : '#FEF3C7' }}>
            <AlertTriangle size={24} style={{ color: confirmBg }} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', color: '#0F172A' }}>{title}</h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748B', marginTop: '8px', lineHeight: '1.6' }}>{description}</p>
        </div>
        {requireTypedConfirm && (
          <div className="mb-4">
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', marginBottom: '6px' }}>
              Type <strong>{requireTypedConfirm}</strong> to confirm:
            </p>
            <input value={typed} onChange={e => setTyped(e.target.value)}
              className="w-full px-3 rounded-md outline-none"
              style={{ height: '40px', border: `1.5px solid ${typed === requireTypedConfirm ? '#22C55E' : '#E2E8F0'}`, fontFamily: 'var(--font-body)', fontSize: '14px' }} />
          </div>
        )}
        <div className="flex gap-3">
          <button ref={cancelRef} onClick={onClose} className="flex-1 rounded-md"
            style={{ height: '44px', background: '#1A3C5E', color: '#FFFFFF', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', border: 'none' }}>
            Cancel
          </button>
          <button onClick={() => { if (canConfirm) { onConfirm(); onClose(); } }} disabled={!canConfirm}
            className="flex-1 rounded-md"
            style={{ height: '44px', background: canConfirm ? confirmBg : '#E2E8F0', color: canConfirm ? '#FFFFFF' : '#94A3B8', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', border: 'none', cursor: canConfirm ? 'pointer' : 'not-allowed' }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
}
