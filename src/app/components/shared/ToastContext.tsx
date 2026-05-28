import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

type ToastType = 'success' | 'warning' | 'error';
interface Toast { id: number; message: string; type: ToastType; }

const ToastContext = createContext<{ addToast: (msg: string, type?: ToastType) => void }>({ addToast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let counter = 0;
  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now() + counter++;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);
  const colors = { success: '#22C55E', warning: '#F59E0B', error: '#EF4444' };
  const icons = { success: <CheckCircle size={18} />, warning: <AlertTriangle size={18} />, error: <XCircle size={18} /> };
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-5 right-4 z-[100] flex flex-col gap-2" style={{ maxWidth: '360px' }}>
        {toasts.map(t => (
          <div key={t.id} className="bg-white rounded-lg px-4 py-3 flex items-center gap-3"
            style={{ borderLeft: `4px solid ${colors[t.type]}`, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', minWidth: '280px' }}>
            <span style={{ color: colors[t.type], flexShrink: 0 }}>{icons[t.type]}</span>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', flex: 1 }}>{t.message}</p>
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} style={{ color: '#94A3B8', flexShrink: 0 }}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
export const useToast = () => useContext(ToastContext);
