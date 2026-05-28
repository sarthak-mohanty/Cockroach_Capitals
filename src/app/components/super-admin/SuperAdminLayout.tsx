import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router';
import { LayoutDashboard, Globe, Users, TrendingUp, Settings, FileText, LogOut, Menu, X } from 'lucide-react';
import { GigShieldMark } from '../shared/GigShieldLogo';

interface SuperAdminLayoutProps {
  activeScreen: string;
  title: string;
  children: ReactNode;
}

export default function SuperAdminLayout({ activeScreen, title, children }: SuperAdminLayoutProps) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard',     label: 'System Dashboard', icon: LayoutDashboard, path: '/super-admin/dashboard' },
    { id: 'platforms',     label: 'Platforms',         icon: Globe,           path: '/super-admin/platforms' },
    { id: 'workers',       label: 'All Workers',        icon: Users,           path: '/super-admin/workers' },
    { id: 'financials',    label: 'Financials',         icon: TrendingUp,      path: '/super-admin/financials' },
    { id: 'configuration', label: 'Configuration',      icon: Settings,        path: '/super-admin/configuration' },
    { id: 'audit',         label: 'Audit Log',          icon: FileText,        path: '/super-admin/audit' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ background: '#0F172A' }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-3">
          <GigShieldMark color="white" size={30} />
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '17px', color: '#FFFFFF', lineHeight: 1, letterSpacing: '0.04em' }}>
              GigShield
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#FDE68A', marginTop: '3px' }}>Super Admin</p>
          </div>
        </div>
        <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
          <X size={20} style={{ color: 'rgba(255,255,255,0.6)' }} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-5 py-3 relative"
              style={{
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0" style={{ width: '3px', background: '#FDE68A' }} />
              )}
              <Icon size={18} />
              <span className="flex-1">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#B45309' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', color: '#FFFFFF' }}>SA</span>
          </div>
          <div className="min-w-0">
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Sarthak M.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Super Admin, GigShield
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/admin/login')}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-md"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-body)', fontSize: '13px', border: 'none', cursor: 'pointer' }}
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col flex-shrink-0" style={{ width: '240px' }}>
        <SidebarContent />
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 lg:hidden" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 z-50 lg:hidden flex flex-col" style={{ width: '240px' }}>
            <SidebarContent />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <div className="flex-shrink-0 h-14 bg-white border-b px-4 sm:px-6 flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden flex-shrink-0" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} style={{ color: '#0F172A' }} />
            </button>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: '#0F172A' }}>{title}</span>
          </div>

          {/* Center: system status */}
          <div className="hidden sm:flex items-center gap-2">
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>All systems operational</span>
          </div>

          <div className="flex items-center gap-3">
            <span style={{
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
              background: '#1C1C1C', color: '#FDE68A', padding: '3px 10px', borderRadius: '100px',
              border: '1px solid #B45309'
            }}>
              GigShield Internal
            </span>
            <span className="hidden sm:inline" style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#0F172A' }}>Sarthak M.</span>
            <button onClick={() => navigate('/admin/login')} style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B', background: 'none', border: 'none', cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto" style={{ background: '#F8FAFC' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
