import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, Users, FileCheck, Beaker, LogOut, Menu, X } from 'lucide-react';
import { GigShieldMark } from '../shared/GigShieldLogo';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'workers', label: 'Workers', icon: Users, path: '/admin/workers' },
    { id: 'compliance', label: 'Compliance', icon: FileCheck, path: '/admin/compliance' },
    { id: 'harness', label: 'Test Harness', icon: Beaker, path: '/admin/test-harness' }
  ];

  const currentPath = location.pathname;

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ background: '#1A3C5E' }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
        <div className="flex items-center gap-3">
          <GigShieldMark color="white" size={30} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '17px', color: '#FFFFFF', letterSpacing: '0.04em' }}>
            GigShield
          </h1>
        </div>
        {/* Close button — mobile only */}
        <button
          className="lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={20} style={{ color: 'rgba(255,255,255,0.7)' }} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.id}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-5 py-3 relative"
              style={{
                background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.65)',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '14px'
              }}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: '#0EA5E9' }} />
              )}
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#0EA5E9' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '12px', color: '#FFFFFF' }}>PM</span>
          </div>
          <div className="min-w-0">
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Priya Menon
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.65)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Senior Manager, Swiggy
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/admin/login')}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-md"
          style={{
            background: 'rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.85)',
            fontFamily: 'var(--font-body)',
            fontSize: '13px'
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">

      {/* ── Desktop sidebar (always visible on lg+) ── */}
      <div className="hidden lg:flex flex-col w-60 flex-shrink-0">
        <SidebarContent />
      </div>

      {/* ── Mobile sidebar drawer ── */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed left-0 top-0 bottom-0 z-50 w-64 lg:hidden flex flex-col">
            <SidebarContent />
          </div>
        </>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Bar */}
        <div className="flex-shrink-0 h-14 bg-white border-b px-4 sm:px-6 flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              className="lg:hidden flex-shrink-0"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} style={{ color: '#0F172A' }} />
            </button>

            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#FF6B00' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: '#FFFFFF' }}>S</span>
            </div>
            <span
              className="hidden sm:inline"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              Swiggy India — GigShield Admin Panel
            </span>
            <span
              className="sm:hidden"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px', color: '#0F172A' }}
            >
              Admin Panel
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline" style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#0F172A' }}>
              Priya Menon
            </span>
            <button
              onClick={() => navigate('/admin/login')}
              style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B', whiteSpace: 'nowrap' }}
            >
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
