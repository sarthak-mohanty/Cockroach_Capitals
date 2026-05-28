import { useNavigate } from 'react-router';
import { Home, Wallet, Shield, CreditCard, User } from 'lucide-react';

interface BottomNavProps {
  active: 'home' | 'wallet' | 'insurance' | 'loans' | 'profile';
}

export default function BottomNav({ active }: BottomNavProps) {
  const navigate = useNavigate();

  const tabs = [
    { id: 'home',      label: 'Home',      icon: Home,       path: '/worker/home' },
    { id: 'wallet',    label: 'Wallet',    icon: Wallet,     path: '/worker/wallet' },
    { id: 'loans',     label: 'Loans',     icon: CreditCard, path: '/worker/loan' },
    { id: 'insurance', label: 'Insurance', icon: Shield,     path: '/worker/insurance' },
    { id: 'profile',   label: 'Profile',   icon: User,       path: '/worker/profile' },
  ];

  return (
    <div
      data-tour-id="tour-bottom-nav"
      className="fixed bottom-0 left-0 right-0 bg-white border-t flex items-center justify-around z-20"
      style={{ height: '64px', borderColor: '#E2E8F0' }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1"
          >
            <Icon
              size={22}
              style={{ color: isActive ? '#0EA5E9' : '#94A3B8' }}
              fill={isActive ? '#0EA5E9' : 'none'}
            />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                color: isActive ? '#0EA5E9' : '#94A3B8',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
