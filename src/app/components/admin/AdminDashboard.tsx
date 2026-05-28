import { useNavigate } from 'react-router';
import { Users, TrendingUp, AlertCircle, CheckCircle, UserPlus, Zap, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AdminLayout from './AdminLayout';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const contributionData = [
    { date: 'May 1', amount: 72000 },
    { date: 'May 5', amount: 78000 },
    { date: 'May 10', amount: 81000 },
    { date: 'May 15', amount: 83000 },
    { date: 'May 20', amount: 87400 },
    { date: 'May 26', amount: 91000 }
  ];

  const workerData = [
    { week: 'W19', count: 1240 },
    { week: 'W20', count: 1380 },
    { week: 'W21', count: 1520 },
    { week: 'W22', count: 1690 },
    { week: 'W23', count: 1840 },
    { week: 'W24', count: 1920 },
    { week: 'W25', count: 2080 },
    { week: 'W26', count: 2175 }
  ];

  const transactions = [
    { worker: 'Raju Yadav', amount: 80, contribution: 1.60, platform: 'Swiggy', time: 'Today 2:34 PM' },
    { worker: 'Meena Sharma', amount: 95, contribution: 1.90, platform: 'Blinkit', time: 'Today 2:28 PM' },
    { worker: 'Arjun Patel', amount: 120, contribution: 2.40, platform: 'Ola', time: 'Today 2:15 PM' },
    { worker: 'Deepa Nair', amount: 75, contribution: 1.50, platform: 'Swiggy', time: 'Today 1:52 PM' },
    { worker: 'Karan Singh', amount: 110, contribution: 2.20, platform: 'Blinkit', time: 'Today 1:40 PM' }
  ];

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6">

        {/* PWFVS Status Banner */}
        <div className="px-4 py-3 rounded-lg flex items-start sm:items-center gap-3 mb-5" style={{ background: '#F0FDF4', border: '1px solid #86EFAC' }}>
          <CheckCircle size={18} style={{ color: '#22C55E', flexShrink: 0, marginTop: '2px' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#15803D', lineHeight: 1.5 }}>
            PWFVS Compliance: ACTIVE — All contributions tracked and verified.
          </span>
        </div>

        {/* KPI Cards — 2-col on mobile, 4-col on lg */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm" style={{ border: '1px solid #E2E8F0' }}>
            <div className="flex items-start justify-between">
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '12px', color: '#64748B' }}>Total Workers</p>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(22px,3vw,32px)', color: '#0F172A', marginTop: '6px' }}>12,847</p>
              </div>
              <Users size={20} style={{ color: '#1A3C5E', flexShrink: 0 }} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm" style={{ border: '1px solid #E2E8F0' }}>
            <div className="flex items-start justify-between">
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '12px', color: '#64748B' }}>Contributions</p>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(22px,3vw,32px)', color: '#22C55E', marginTop: '6px' }}>Rs 21.6L</p>
              </div>
              <TrendingUp size={20} style={{ color: '#22C55E', flexShrink: 0 }} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm" style={{ border: '1px solid #E2E8F0' }}>
            <div className="flex items-start justify-between">
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '12px', color: '#64748B' }}>Claims This Month</p>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(22px,3vw,32px)', color: '#F59E0B', marginTop: '6px' }}>3</p>
              </div>
              <AlertCircle size={20} style={{ color: '#F59E0B', flexShrink: 0 }} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm" style={{ border: '1px solid #E2E8F0' }}>
            <div className="flex items-start justify-between">
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '12px', color: '#64748B' }}>PWFVS Status</p>
                <span className="inline-block mt-2 px-2 py-1 rounded-full" style={{ background: '#F0FDF4', color: '#16A34A', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px' }}>
                  COMPLIANT
                </span>
              </div>
              <CheckCircle size={20} style={{ color: '#22C55E', flexShrink: 0 }} />
            </div>
          </div>
        </div>

        {/* Charts Row — stacked on mobile, 2/3+1/3 on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
          {/* Contribution Trend — full width on mobile, 2/3 on lg */}
          <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-5 shadow-sm" style={{ border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: '#0F172A', marginBottom: '16px' }}>
              Contribution Trend — Last 30 Days
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={contributionData}>
                <XAxis dataKey="date" stroke="#E2E8F0" style={{ fontFamily: 'var(--font-body)', fontSize: '11px' }} />
                <YAxis stroke="#E2E8F0" style={{ fontFamily: 'var(--font-body)', fontSize: '11px' }} tickFormatter={(v) => `Rs ${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontFamily: 'var(--font-body)', fontSize: '12px' }}
                  formatter={(value: number) => [`Rs ${value.toLocaleString()}`, 'Amount']}
                />
                <Line type="monotone" dataKey="amount" stroke="#0EA5E9" strokeWidth={2} dot={{ fill: '#0EA5E9', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* New Workers Bar */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm" style={{ border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: '#0F172A', marginBottom: '16px' }}>
              New Workers — Last 8 Weeks
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={workerData}>
                <XAxis dataKey="week" stroke="#E2E8F0" style={{ fontFamily: 'var(--font-body)', fontSize: '11px' }} />
                <YAxis stroke="#E2E8F0" style={{ fontFamily: 'var(--font-body)', fontSize: '11px' }} />
                <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontFamily: 'var(--font-body)', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#1A3C5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row — stacked on mobile, 2/3+1/3 on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: '#0F172A', padding: '16px 16px 12px' }}>
              Recent Transactions
            </h3>
            {/* Horizontally scrollable table on mobile */}
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: '520px' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' }}>
                    {['Worker', 'Delivery', 'Contribution', 'Platform', 'Time'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left" style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '11px', color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td className="px-4 py-3" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', whiteSpace: 'nowrap' }}>{tx.worker}</td>
                      <td className="px-4 py-3" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>Rs {tx.amount}</td>
                      <td className="px-4 py-3" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>Rs {tx.contribution.toFixed(2)}</td>
                      <td className="px-4 py-3" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>{tx.platform}</td>
                      <td className="px-4 py-3" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B', whiteSpace: 'nowrap' }}>{tx.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: '#0F172A', marginBottom: '12px' }}>
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { icon: <UserPlus size={20} style={{ color: '#0EA5E9' }} />, label: 'Register New Worker', path: '/admin/test-harness' },
                { icon: <Zap size={20} style={{ color: '#22C55E' }} />, label: 'Simulate Delivery', path: '/admin/test-harness' },
                { icon: <Download size={20} style={{ color: '#1A3C5E' }} />, label: 'Download Compliance Report', path: '/admin/compliance' },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
                  style={{ border: '1px solid #E2E8F0' }}
                >
                  <div className="flex items-center gap-3">
                    {action.icon}
                    <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#0F172A', textAlign: 'left' }}>
                      {action.label}
                    </span>
                  </div>
                  <span style={{ fontSize: '16px' }}>→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
