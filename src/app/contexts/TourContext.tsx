import { createContext, useContext, useState, ReactNode } from 'react';
import { TourType, ALL_TOUR_STEPS } from '../data/tutorialContent';

// Storage keys — one per portal so tours are independently tracked
const DONE_KEYS: Record<TourType, string> = {
  worker:           'gigshield_tour_done_worker',
  'platform-admin': 'gigshield_tour_done_pa',
  'super-admin':    'gigshield_tour_done_sa',
};

interface TourContextValue {
  tourType: TourType | null;
  stepIndex: number;
  active: boolean;

  /** Returns true if the user has already completed or skipped this portal's tour */
  isDone: (type: TourType) => boolean;

  /** Begin a tour for the given portal type */
  startTour: (type: TourType) => void;

  /** Advance to the next step (or enter completion state) */
  nextStep: () => void;

  /** Go back one step */
  prevStep: () => void;

  /** Dismiss the tour without marking it complete */
  skipTour: () => void;

  /** Mark the tour as finished and close the overlay */
  completeTour: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);

export function TourProvider({ children }: { children: ReactNode }) {
  const [tourType, setTourType] = useState<TourType | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [active, setActive] = useState(false);

  const isDone = (type: TourType) =>
    !!localStorage.getItem(DONE_KEYS[type]);

  const startTour = (type: TourType) => {
    setTourType(type);
    setStepIndex(0);
    setActive(true);
  };

  const nextStep = () => {
    if (!tourType) return;
    const total = ALL_TOUR_STEPS[tourType].length;
    setStepIndex(prev => Math.min(prev + 1, total)); // total = completion state
  };

  const prevStep = () => {
    setStepIndex(prev => Math.max(0, prev - 1));
  };

  const skipTour = () => {
    if (tourType) localStorage.setItem(DONE_KEYS[tourType], '1');
    setActive(false);
    setTourType(null);
  };

  const completeTour = () => {
    if (tourType) localStorage.setItem(DONE_KEYS[tourType], '1');
    setActive(false);
    setTourType(null);
  };

  return (
    <TourContext.Provider value={{
      tourType, stepIndex, active,
      isDone, startTour, nextStep, prevStep, skipTour, completeTour,
    }}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTour must be used inside <TourProvider>');
  return ctx;
}
