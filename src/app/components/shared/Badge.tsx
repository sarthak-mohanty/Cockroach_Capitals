import { ReactNode } from 'react';
const styles: Record<string, { bg: string; color: string }> = {
  active:         { bg: '#F0FDF4', color: '#16A34A' },
  compliant:      { bg: '#F0FDF4', color: '#16A34A' },
  pending:        { bg: '#FEF3C7', color: '#D97706' },
  'non-compliant':{ bg: '#FEF2F2', color: '#EF4444' },
  inactive:       { bg: '#F1F5F9', color: '#64748B' },
  'best-match':   { bg: '#0EA5E9', color: '#FFFFFF' },
  'super-admin':  { bg: '#1C1C1C', color: '#FDE68A' },
};
export default function Badge({ variant, children }: { variant: string; children: ReactNode }) {
  const s = styles[variant] || styles.pending;
  return (
    <span style={{ background: s.bg, color: s.color, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', padding: '2px 8px', borderRadius: '100px', display: 'inline-flex', alignItems: 'center' }}>
      {children}
    </span>
  );
}
