import { ReactNode } from 'react';
import { X } from 'lucide-react';
export default function SlidePanel({ isOpen, onClose, title, subtitle, width = '60%', children, footer }: {
  isOpen: boolean; onClose: () => void; title: string; subtitle?: string;
  width?: string; children: ReactNode; footer?: ReactNode;
}) {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.3)' }} onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 bg-white flex flex-col overflow-hidden"
        style={{ width: `min(100vw, ${width})`, boxShadow: '-8px 0 32px rgba(0,0,0,0.12)' }}>
        <div className="flex items-start justify-between p-6 border-b flex-shrink-0" style={{ borderColor: '#E2E8F0' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', color: '#0F172A' }}>{title}</h2>
            {subtitle && <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B', marginTop: '4px' }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} className="ml-4 flex-shrink-0"><X size={22} style={{ color: '#64748B' }} /></button>
        </div>
        <div className="flex-1 overflow-auto p-6">{children}</div>
        {footer && <div className="p-6 border-t flex-shrink-0" style={{ borderColor: '#E2E8F0' }}>{footer}</div>}
      </div>
    </>
  );
}
