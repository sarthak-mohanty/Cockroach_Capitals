/**
 * SimulationContext — central engine for all inline demo controls.
 * Wrap <SimulationProvider> inside <ToastProvider> at the app root so
 * useToast() is available here. All admin screens read from this context;
 * firing a delivery on SA_Dashboard is immediately reflected on SA_Workers.
 */
import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { useToast } from '../components/shared/ToastContext';

// ── Types ────────────────────────────────────────────────────────────────────

export interface SimWorker {
  name: string;
  id: string;
  phone: string;
  city: string;
  platforms: string[];
  walletBalance: number;
  deliveryCount: number;
  insuranceStatus: 'ACTIVE' | 'PENDING';
  loanUnlocked: boolean;
  claimStatus: 'PROCESSING' | 'SUBMITTED' | 'RESOLVED' | null;
}

export interface ActivityItem {
  id: string;
  type: 'delivery' | 'registration' | 'loan' | 'claim';
  worker: string;
  platform?: string;
  amount?: number;
  contribution?: number;
  timestamp: string;
  isNew?: boolean;
  color: string;
  text: string;
}

export interface SimState {
  workers: SimWorker[];
  activityFeed: ActivityItem[];
  totalWorkers: number;
  totalContributions: number;
  activeInsurancePolicies: number;
  loanApplications: number;
}

export interface SimContextType {
  state: SimState;
  fireDelivery: (opts: { workerName: string; platform: string; amount: number }) => void;
  registerWorker: (opts: { name: string; phone: string; city: string; platform: string }) => void;
  generate30DayHistory: (opts: { workerName: string }) => void;
  advanceClaimStatus: (opts: { workerName: string }) => void;
  fireMultiPlatformDelivery: (opts: { workerName: string }) => void;
  resetWorker: (opts: { workerName: string }) => void;
  fullSystemReset: (opts: { confirmationString: string }) => boolean;
}

// ── Initial demo data ────────────────────────────────────────────────────────

const INITIAL_WORKERS: SimWorker[] = [
  { name: 'Raju Yadav',    id: 'GS-2024-0847291', phone: '+91-99999 99999', city: 'Bengaluru', platforms: ['Swiggy', 'Blinkit', 'Ola'], walletBalance: 1840, deliveryCount: 47, insuranceStatus: 'ACTIVE',   loanUnlocked: true,  claimStatus: 'PROCESSING' },
  { name: 'Meena Sharma',  id: 'GS-2024-0847292', phone: '+91-98765 43210', city: 'Bengaluru', platforms: ['Blinkit'],                   walletBalance: 2200, deliveryCount: 58, insuranceStatus: 'ACTIVE',   loanUnlocked: true,  claimStatus: null },
  { name: 'Arjun Patel',   id: 'GS-2024-0847293', phone: '+91-97654 32109', city: 'Pune',      platforms: ['Ola'],                       walletBalance: 1650, deliveryCount: 43, insuranceStatus: 'ACTIVE',   loanUnlocked: false, claimStatus: null },
  { name: 'Deepa Nair',    id: 'GS-2024-0847294', phone: '+91-96543 21098', city: 'Bengaluru', platforms: ['Swiggy'],                    walletBalance: 980,  deliveryCount: 26, insuranceStatus: 'PENDING',  loanUnlocked: false, claimStatus: null },
  { name: 'Karan Singh',   id: 'GS-2024-0847295', phone: '+91-95432 10987', city: 'Jaipur',    platforms: ['Swiggy', 'Ola'],             walletBalance: 3100, deliveryCount: 82, insuranceStatus: 'ACTIVE',   loanUnlocked: true,  claimStatus: null },
];

const INITIAL_FEED: ActivityItem[] = [
  { id: 'init-1', type: 'delivery',      worker: 'Raju Yadav',   platform: 'Swiggy', amount: 80, contribution: 1.60, timestamp: 'Today 2:34 PM', color: '#22C55E', text: 'Raju Yadav completed Swiggy delivery · Rs 1.60 contributed' },
  { id: 'init-2', type: 'delivery',      worker: 'Meena Sharma', platform: 'Blinkit', amount: 95, contribution: 1.90, timestamp: 'Today 2:28 PM', color: '#22C55E', text: 'Meena Sharma completed Blinkit delivery · Rs 1.90 contributed' },
  { id: 'init-3', type: 'registration',  worker: 'Arjun Patel',  platform: 'Ola',    timestamp: 'Today 2:10 PM', color: '#0EA5E9', text: 'Arjun Patel registered via Ola platform' },
  { id: 'init-4', type: 'loan',          worker: 'Raju Yadav',   timestamp: 'Today 2:15 PM', color: '#8B5CF6', text: 'Raju Yadav loan pre-approval unlocked — 30-day history complete' },
  { id: 'init-5', type: 'claim',         worker: 'Arjun Patel',  timestamp: 'Today 2:15 PM', color: '#F59E0B', text: 'Arjun Patel insurance claim PROCESSING' },
];

const makeInitialState = (): SimState => ({
  workers: INITIAL_WORKERS.map(w => ({ ...w })),
  activityFeed: INITIAL_FEED.map(a => ({ ...a })),
  totalWorkers: 12847,
  totalContributions: 2160000,
  activeInsurancePolicies: 12203,
  loanApplications: 847,
});

// Seeded amounts for generate30DayHistory — consistent across resets
const HISTORY_AMOUNTS = Array.from({ length: 30 }, (_, i) => 75 + ((i * 23 + 7) % 66));

// ── Context ──────────────────────────────────────────────────────────────────

const SimContext = createContext<SimContextType | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const { addToast } = useToast();
  const [state, setState] = useState<SimState>(makeInitialState);

  // Keep a ref so closures inside intervals/timeouts can read current workers
  const workersRef = useRef<SimWorker[]>(state.workers);
  const origSetState = (updater: (prev: SimState) => SimState) => {
    setState(prev => {
      const next = updater(prev);
      workersRef.current = next.workers;
      return next;
    });
  };

  // ── addActivity helper ──────────────────────────────────────────────────

  const addActivity = useCallback((item: Omit<ActivityItem, 'id' | 'isNew'>) => {
    const id = `act-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const newItem: ActivityItem = { ...item, id, isNew: true };

    origSetState(prev => ({
      ...prev,
      activityFeed: [newItem, ...prev.activityFeed.slice(0, 19)],
    }));

    // Clear isNew flag after animation window
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        activityFeed: prev.activityFeed.map(a => a.id === id ? { ...a, isNew: false } : a),
      }));
    }, 900);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── fireDelivery ────────────────────────────────────────────────────────

  const fireDelivery = useCallback(({ workerName, platform, amount }: {
    workerName: string; platform: string; amount: number;
  }) => {
    const contribution = parseFloat((amount * 0.02).toFixed(2));

    addActivity({
      type: 'delivery',
      worker: workerName,
      platform,
      amount,
      contribution,
      timestamp: 'Just now',
      color: '#22C55E',
      text: `${workerName} completed ${platform} delivery · Rs ${contribution.toFixed(2)} contributed`,
    });

    origSetState(prev => ({
      ...prev,
      totalContributions: parseFloat((prev.totalContributions + contribution).toFixed(2)),
      workers: prev.workers.map(w =>
        w.name === workerName
          ? { ...w, walletBalance: parseFloat((w.walletBalance + contribution).toFixed(2)), deliveryCount: w.deliveryCount + 1 }
          : w
      ),
    }));

    addToast(`✓ Rs ${contribution.toFixed(2)} contributed to ${workerName}'s wallet`, 'success');
  }, [addActivity, addToast]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── registerWorker ──────────────────────────────────────────────────────

  const registerWorker = useCallback(({ name, phone, city, platform }: {
    name: string; phone: string; city: string; platform: string;
  }) => {
    const newId = `GS-2024-${Math.floor(100000 + Math.random() * 899999)}`;
    const newWorker: SimWorker = {
      name, id: newId,
      phone: phone.startsWith('+91') ? phone : `+91-${phone}`,
      city, platforms: [platform],
      walletBalance: 0, deliveryCount: 0,
      insuranceStatus: 'PENDING', loanUnlocked: false, claimStatus: null,
    };

    origSetState(prev => ({
      ...prev,
      workers: [newWorker, ...prev.workers],
      totalWorkers: prev.totalWorkers + 1,
    }));

    addActivity({
      type: 'registration',
      worker: name,
      platform,
      timestamp: 'Just now',
      color: '#0EA5E9',
      text: `${name} registered via ${platform} platform · ID: ${newId}`,
    });

    addToast(`✓ ${name} registered. ID: ${newId}`, 'success');
  }, [addActivity, addToast]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── generate30DayHistory ─────────────────────────────────────────────────

  const generate30DayHistory = useCallback(({ workerName }: { workerName: string }) => {
    const worker = workersRef.current.find(w => w.name === workerName);
    if (!worker) { addToast(`Worker "${workerName}" not found.`, 'error'); return; }
    const platforms = [...worker.platforms];

    let i = 0;
    const tick = () => {
      if (i >= 30) {
        origSetState(prev => ({
          ...prev,
          workers: prev.workers.map(w => w.name === workerName ? { ...w, loanUnlocked: true } : w),
        }));
        addToast(`✓ 30-day history generated. Loan pre-approval now unlocked for ${workerName}.`, 'success');
        return;
      }
      const platform = platforms[i % platforms.length];
      const amount = HISTORY_AMOUNTS[i];
      const contribution = parseFloat((amount * 0.02).toFixed(2));
      const itemId = `hist-${i}-${Date.now()}`;

      origSetState(prev => ({
        ...prev,
        totalContributions: parseFloat((prev.totalContributions + contribution).toFixed(2)),
        workers: prev.workers.map(w =>
          w.name === workerName
            ? { ...w, walletBalance: parseFloat((w.walletBalance + contribution).toFixed(2)), deliveryCount: w.deliveryCount + 1 }
            : w
        ),
        activityFeed: [
          {
            id: itemId,
            type: 'delivery',
            worker: workerName,
            platform,
            amount,
            contribution,
            timestamp: 'History',
            color: '#22C55E',
            text: `${workerName} · ${platform} · Rs ${contribution.toFixed(2)} contributed`,
            isNew: true,
          },
          ...prev.activityFeed.slice(0, 19),
        ],
      }));

      // Clear isNew
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          activityFeed: prev.activityFeed.map(a => a.id === itemId ? { ...a, isNew: false } : a),
        }));
      }, 900);

      i++;
      setTimeout(tick, 80);
    };
    tick();
  }, [addToast]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── advanceClaimStatus ──────────────────────────────────────────────────

  const advanceClaimStatus = useCallback(({ workerName }: { workerName: string }) => {
    origSetState(prev => {
      const workers = prev.workers.map(w => {
        if (w.name !== workerName) return w;
        const next: SimWorker['claimStatus'] =
          w.claimStatus === null        ? 'SUBMITTED'  :
          w.claimStatus === 'SUBMITTED' ? 'PROCESSING' :
          w.claimStatus === 'PROCESSING'? 'RESOLVED'   : null;
        addToast(`Claim for ${workerName}: ${next ?? 'Reset to null'}`, 'success');
        return { ...w, claimStatus: next };
      });
      return { ...prev, workers };
    });
  }, [addToast]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── fireMultiPlatformDelivery ───────────────────────────────────────────

  const fireMultiPlatformDelivery = useCallback(({ workerName }: { workerName: string }) => {
    const worker = workersRef.current.find(w => w.name === workerName);
    const platforms = worker?.platforms ?? ['Swiggy', 'Blinkit', 'Ola'];
    platforms.forEach((platform, idx) => {
      setTimeout(() => fireDelivery({ workerName, platform, amount: 80 }), idx * 400);
    });
  }, [fireDelivery]);

  // ── resetWorker ─────────────────────────────────────────────────────────

  const resetWorker = useCallback(({ workerName }: { workerName: string }) => {
    const original = INITIAL_WORKERS.find(w => w.name === workerName);
    if (!original) { addToast(`Cannot reset — "${workerName}" not in initial data.`, 'error'); return; }
    origSetState(prev => ({
      ...prev,
      workers: prev.workers.map(w => w.name === workerName ? { ...original } : w),
    }));
    addToast(`${workerName} reset to initial state.`, 'warning');
  }, [addToast]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── fullSystemReset ─────────────────────────────────────────────────────

  const fullSystemReset = useCallback(({ confirmationString }: { confirmationString: string }): boolean => {
    if (confirmationString !== 'CONFIRM RESET') return false;
    const fresh = makeInitialState();
    setState(fresh);
    workersRef.current = fresh.workers;
    addToast('Demo state reset. All data restored to defaults.', 'success');
    return true;
  }, [addToast]);

  return (
    <SimContext.Provider value={{
      state,
      fireDelivery,
      registerWorker,
      generate30DayHistory,
      advanceClaimStatus,
      fireMultiPlatformDelivery,
      resetWorker,
      fullSystemReset,
    }}>
      {children}
    </SimContext.Provider>
  );
}

export function useSimulation(): SimContextType {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error('useSimulation must be used inside <SimulationProvider>');
  return ctx;
}
