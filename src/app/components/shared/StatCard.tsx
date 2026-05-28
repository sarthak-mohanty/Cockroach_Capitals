import { ReactNode } from 'react';
export default function StatCard({ label, value, icon, iconColor, caption }: {
  label: string; value: string; icon?: ReactNode; iconColor?: string; caption?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: '1px solid #E2E8F0' }}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>{label}</p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(20px,2.5vw,28px)', color: '#0F172A' }}>{value}</p>
          {caption && <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>{caption}</p>}
        </div>
        {icon && <div style={{ color: iconColor || '#1A3C5E', flexShrink: 0, marginLeft: '8px' }}>{icon}</div>}
      </div>
    </div>
  );
}
