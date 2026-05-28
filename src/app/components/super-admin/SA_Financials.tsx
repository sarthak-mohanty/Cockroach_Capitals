import SuperAdminLayout from './SuperAdminLayout';
import DisclaimerBanner from '../shared/DisclaimerBanner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, IndianRupee, Shield, Activity } from 'lucide-react';

const barData = [
  { month: 'Dec', revenue: 12.1, cost: 8.4 },
  { month: 'Jan', revenue: 14.3, cost: 9.2 },
  { month: 'Feb', revenue: 15.8, cost: 9.8 },
  { month: 'Mar', revenue: 17.2, cost: 10.1 },
  { month: 'Apr', revenue: 19.0, cost: 11.3 },
  { month: 'May', revenue: 20.5, cost: 12.1 },
];

const pnlRows = [
  { item: 'Platform Licensing Revenue', may: '₹12,40,000', apr: '₹11,20,000', type: 'revenue' },
  { item: 'Loan Book Interest Income', may: '₹4,20,000', apr: '₹3,80,000', type: 'revenue' },
  { item: 'Insurance Premium Cut (15%)', may: '₹2,80,000', apr: '₹2,50,000', type: 'revenue' },
  { item: 'Transaction Fee Revenue', may: '₹1,10,000', apr: '₹95,000', type: 'revenue' },
  { item: 'PWFVS Compliance Cost', may: '(₹3,20,000)', apr: '(₹2,90,000)', type: 'cost' },
  { item: 'Technology Infrastructure', may: '(₹4,80,000)', apr: '(₹4,60,000)', type: 'cost' },
  { item: 'Operations & Support', may: '(₹2,10,000)', apr: '(₹1,95,000)', type: 'cost' },
  { item: 'Insurance Claims Paid Out', may: '(₹1,90,000)', apr: '(₹1,60,000)', type: 'cost' },
  { item: 'Net Operating Profit', may: '₹8,50,000', apr: '₹7,40,000', type: 'profit' },
];

const loanBook = [
  { platform: 'Swiggy India', active: 42, volume: '₹18.9L', npa: '2.1%', avgSize: '₹45,000' },
  { platform: 'Blinkit', active: 28, volume: '₹11.2L', npa: '1.8%', avgSize: '₹40,000' },
  { platform: 'Ola Electric', active: 14, volume: '₹5.6L', npa: '3.2%', avgSize: '₹40,000' },
  { platform: 'Porter', active: 0, volume: '₹0', npa: 'N/A', avgSize: 'N/A' },
];

const contribFlow = [
  { label: 'Worker Earnings', value: '₹2.1 Cr', arrow: true, color: '#0EA5E9' },
  { label: 'Contributions Deducted (3%)', value: '₹6.3L', arrow: true, color: '#22C55E' },
  { label: 'GigShield Pool', value: '₹49.5L', arrow: true, color: '#8B5CF6' },
  { label: 'PWFVS Disbursement', value: '₹45.1L', arrow: false, color: '#F59E0B' },
];

export default function SA_Financials() {
  return (
    <SuperAdminLayout activeScreen="financials" title="Financials">
      <div className="p-6 space-y-6">
        <DisclaimerBanner
          variant="amber"
          message="Financial data shown is for internal GigShield use only. This is a demo environment — figures do not represent actual financial positions. All amounts in INR."
        />

        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: '#0F172A' }}>Financials</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748B', marginTop: '4px' }}>Revenue, P&L, loan book and contribution flow — May 2026</p>
        </div>

        {/* Revenue cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Monthly Revenue', value: '₹20.5L', icon: TrendingUp, color: '#0EA5E9', caption: '↑ 7.9% vs Apr' },
            { label: 'Pool Under Management', value: '₹49.5L', icon: IndianRupee, color: '#22C55E', caption: 'Across all platforms' },
            { label: 'Active Loan Book', value: '₹35.7L', icon: Activity, color: '#8B5CF6', caption: '84 active loans' },
            { label: 'Claims Paid (May)', value: '₹1.9L', icon: Shield, color: '#EF4444', caption: '12 settled' },
          ].map(card => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-white rounded-xl p-5" style={{ border: '1px solid #E2E8F0' }}>
                <div className="flex items-start justify-between mb-2">
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>{card.label}</p>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${card.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} style={{ color: card.color }} />
                  </div>
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(18px,2vw,24px)', color: '#0F172A' }}>{card.value}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>{card.caption}</p>
              </div>
            );
          })}
        </div>

        {/* Chart + Insurance Pool */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* BarChart */}
          <div data-tour-id="tour-sa-financials-chart" className="lg:col-span-2 bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '4px' }}>Revenue vs Cost (₹L)</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', marginBottom: '16px' }}>Last 6 months</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontFamily: 'var(--font-body)', fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontFamily: 'var(--font-body)', fontSize: 11, fill: '#94A3B8' }} tickFormatter={v => `₹${v}L`} />
                <Tooltip formatter={(val: number, name: string) => [`₹${val}L`, name === 'revenue' ? 'Revenue' : 'Cost']} contentStyle={{ fontFamily: 'var(--font-body)', fontSize: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                <Bar dataKey="revenue" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cost" fill="#FCA5A5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-6 mt-2">
              <div className="flex items-center gap-2"><span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#0EA5E9', display: 'inline-block' }} /><span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>Revenue</span></div>
              <div className="flex items-center gap-2"><span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#FCA5A5', display: 'inline-block' }} /><span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>Cost</span></div>
            </div>
          </div>

          {/* Insurance Pool Health */}
          <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '16px' }}>Insurance Pool Health</h3>
            <div className="space-y-4">
              {[
                { label: 'Pool Size', value: '₹49.5L', bar: 100, color: '#22C55E' },
                { label: 'Claims Reserved', value: '₹12.1L', bar: 24, color: '#F59E0B' },
                { label: 'Paid Out (May)', value: '₹1.9L', bar: 4, color: '#EF4444' },
                { label: 'Available', value: '₹35.5L', bar: 72, color: '#0EA5E9' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>{item.label}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>{item.value}</span>
                  </div>
                  <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px' }}>
                    <div style={{ width: `${item.bar}%`, height: '8px', background: item.color, borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-lg" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', color: '#14532D' }}>Pool Solvency Ratio</p>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', color: '#16A34A' }}>4.09x</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#16A34A' }}>Above regulatory minimum of 2.0x</p>
            </div>
          </div>
        </div>

        {/* P&L Table */}
        <div data-tour-id="tour-sa-financials-breakdown" className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
          <div className="p-5 border-b" style={{ borderColor: '#F1F5F9' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>Profit & Loss Statement</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', marginTop: '2px' }}>May 2026 vs April 2026</p>
          </div>
          <table className="w-full" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                {['Line Item', 'May 2026', 'Apr 2026'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', color: '#64748B', textAlign: h === 'Line Item' ? 'left' : 'right', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pnlRows.map((row, i) => (
                <tr key={i} style={{
                  borderBottom: i < pnlRows.length - 1 ? '1px solid #F1F5F9' : 'none',
                  background: row.type === 'profit' ? '#F0FDF4' : 'transparent',
                  borderTop: row.type === 'profit' ? '2px solid #BBF7D0' : 'none',
                }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: row.type === 'profit' ? '#14532D' : '#0F172A', fontWeight: row.type === 'profit' ? 700 : 400 }}>{row.item}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: row.type === 'profit' ? 700 : 500, color: row.type === 'cost' ? '#EF4444' : row.type === 'profit' ? '#16A34A' : '#0F172A', textAlign: 'right' }}>{row.may}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: row.type === 'profit' ? 700 : 400, color: row.type === 'cost' ? '#EF4444' : row.type === 'profit' ? '#16A34A' : '#64748B', textAlign: 'right' }}>{row.apr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Loan Book */}
        <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
          <div className="p-5 border-b" style={{ borderColor: '#F1F5F9' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>Loan Book by Platform</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: '500px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  {['Platform', 'Active Loans', 'Total Volume', 'NPA Rate', 'Avg Loan Size'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', color: '#64748B', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loanBook.map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < loanBook.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <td style={{ padding: '13px 16px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>{row.platform}</td>
                    <td style={{ padding: '13px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>{row.active}</td>
                    <td style={{ padding: '13px 16px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>{row.volume}</td>
                    <td style={{ padding: '13px 16px' }}>
                      {row.npa !== 'N/A' ? (
                        <span style={{ background: parseFloat(row.npa) > 2.5 ? '#FEF2F2' : '#F0FDF4', color: parseFloat(row.npa) > 2.5 ? '#EF4444' : '#16A34A', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', padding: '2px 8px', borderRadius: '100px' }}>
                          {row.npa}
                        </span>
                      ) : <span style={{ color: '#94A3B8', fontSize: '13px', fontFamily: 'var(--font-body)' }}>N/A</span>}
                    </td>
                    <td style={{ padding: '13px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B' }}>{row.avgSize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contribution Flow */}
        <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '20px' }}>Contribution Flow — May 2026</h3>
          <div className="flex flex-wrap items-center gap-2">
            {contribFlow.map((item, i) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="text-center rounded-xl p-4" style={{ background: `${item.color}15`, border: `1.5px solid ${item.color}40`, minWidth: '140px' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>{item.label}</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: item.color }}>{item.value}</p>
                </div>
                {item.arrow && <span style={{ fontSize: '20px', color: '#94A3B8' }}>→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
