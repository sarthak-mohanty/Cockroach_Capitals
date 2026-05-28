import { AlertTriangle } from 'lucide-react';
export default function DisclaimerBanner({ variant, message }: { variant: 'amber' | 'red'; message: string }) {
  const isAmber = variant === 'amber';
  return (
    <div className="w-full px-4 py-3 flex items-start gap-2 mb-4" style={{
      background: isAmber ? '#FEF3C7' : '#FEF2F2',
      borderLeft: `4px solid ${isAmber ? '#F59E0B' : '#EF4444'}`,
      borderRadius: '6px',
    }}>
      <AlertTriangle size={16} style={{ color: isAmber ? '#D97706' : '#EF4444', flexShrink: 0, marginTop: 2 }} />
      <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: isAmber ? '#92400E' : '#991B1B', lineHeight: '1.5' }}>{message}</p>
    </div>
  );
}
