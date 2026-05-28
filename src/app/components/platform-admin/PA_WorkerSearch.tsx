import { useState } from 'react';
import PlatformAdminLayout from './PlatformAdminLayout';
import Badge from '../shared/Badge';
import SlidePanel from '../shared/SlidePanel';
import { useToast } from '../shared/ToastContext';
import { Search, Download, FileText, Phone, CreditCard, MapPin, Calendar, IndianRupee } from 'lucide-react';

interface Worker {
  id: string;
  name: string;
  phone: string;
  platform: string;
  status: 'active' | 'inactive' | 'pending';
  compliance: 'compliant' | 'non-compliant' | 'pending';
  city: string;
  joined: string;
  wallet: string;
  aadhaar: string;
  pan: string;
  trips: number;
  contributions: string;
}

const WORKERS: Worker[] = [
  { id: 'GS-2026-08401', name: 'Ravi Kumar', phone: '+91 ••••• 12301', platform: 'Swiggy', status: 'active', compliance: 'compliant', city: 'Bengaluru', joined: 'Jan 5, 2026', wallet: '₹4,230', aadhaar: '••••-••••-1234', pan: 'ABCK•1234•', trips: 342, contributions: '₹12,450' },
  { id: 'GS-2026-08402', name: 'Meena Sharma', phone: '+91 ••••• 45602', platform: 'Swiggy', status: 'active', compliance: 'pending', city: 'Bengaluru', joined: 'Feb 12, 2026', wallet: '₹2,100', aadhaar: '••••-••••-5678', pan: 'ABCS•5678•', trips: 198, contributions: '₹7,200' },
  { id: 'GS-2026-08403', name: 'Sanjay Patel', phone: '+91 ••••• 78903', platform: 'Swiggy', status: 'active', compliance: 'non-compliant', city: 'Mumbai', joined: 'Mar 1, 2026', wallet: '₹890', aadhaar: '••••-••••-9012', pan: 'ABCP•9012•', trips: 89, contributions: '₹3,100' },
  { id: 'GS-2026-08404', name: 'Arjun Singh', phone: '+91 ••••• 23404', platform: 'Swiggy', status: 'active', compliance: 'compliant', city: 'Delhi', joined: 'Jan 18, 2026', wallet: '₹6,780', aadhaar: '••••-••••-3456', pan: 'ABCA•3456•', trips: 521, contributions: '₹18,900' },
  { id: 'GS-2026-08405', name: 'Fatima Bano', phone: '+91 ••••• 56705', platform: 'Swiggy', status: 'inactive', compliance: 'compliant', city: 'Hyderabad', joined: 'Dec 10, 2025', wallet: '₹1,450', aadhaar: '••••-••••-7890', pan: 'ABCF•7890•', trips: 156, contributions: '₹5,600' },
  { id: 'GS-2026-08406', name: 'Kiran Reddy', phone: '+91 ••••• 89106', platform: 'Swiggy', status: 'active', compliance: 'compliant', city: 'Chennai', joined: 'Feb 28, 2026', wallet: '₹3,120', aadhaar: '••••-••••-1122', pan: 'ABCK•1122•', trips: 267, contributions: '₹9,700' },
  { id: 'GS-2026-08407', name: 'Deepa Nair', phone: '+91 ••••• 34507', platform: 'Swiggy', status: 'active', compliance: 'compliant', city: 'Bengaluru', joined: 'Mar 15, 2026', wallet: '₹2,890', aadhaar: '••••-••••-3344', pan: 'ABCD•3344•', trips: 189, contributions: '₹6,850' },
  { id: 'GS-2026-08408', name: 'Mohammed Imran', phone: '+91 ••••• 67808', platform: 'Swiggy', status: 'pending', compliance: 'pending', city: 'Pune', joined: 'May 20, 2026', wallet: '₹0', aadhaar: '••••-••••-5566', pan: 'ABCM•5566•', trips: 0, contributions: '₹0' },
];

const ROWS_PER_PAGE = 6;

export default function PA_WorkerSearch() {
  const { addToast } = useToast();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [complianceFilter, setComplianceFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  const filtered = WORKERS.filter(w => {
    const matchQuery = !query || w.name.toLowerCase().includes(query.toLowerCase()) || w.id.toLowerCase().includes(query.toLowerCase()) || w.phone.includes(query);
    const matchStatus = statusFilter === 'all' || w.status === statusFilter;
    const matchCompliance = complianceFilter === 'all' || w.compliance === complianceFilter;
    return matchQuery && matchStatus && matchCompliance;
  });

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const selectStyle: React.CSSProperties = {
    height: '36px', border: '1px solid #E2E8F0', borderRadius: '8px',
    fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A',
    padding: '0 10px', background: '#FFFFFF', cursor: 'pointer', outline: 'none',
  };

  return (
    <PlatformAdminLayout activeScreen="search">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: '#0F172A' }}>Worker Search</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
              {WORKERS.length} workers registered under Swiggy India
            </p>
          </div>
          <button
            onClick={() => addToast('CSV export downloaded successfully.', 'success')}
            className="flex items-center gap-2 rounded-lg px-4"
            style={{ height: '40px', background: '#1A3C5E', color: '#FFFFFF', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div data-tour-id="tour-pa-search-bar" className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1" style={{ minWidth: '200px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search by name, ID or phone…"
              className="w-full outline-none"
              style={{ height: '40px', border: '1px solid #E2E8F0', borderRadius: '8px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', paddingLeft: '36px', paddingRight: '12px', background: '#FFFFFF' }}
            />
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={selectStyle}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          <select value={complianceFilter} onChange={e => { setComplianceFilter(e.target.value); setPage(1); }} style={selectStyle}>
            <option value="all">All Compliance</option>
            <option value="compliant">Compliant</option>
            <option value="pending">Pending</option>
            <option value="non-compliant">Non-compliant</option>
          </select>
        </div>

        {/* Table */}
        <div data-tour-id="tour-pa-search-results" className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  {['Worker ID', 'Name', 'Phone', 'Platform', 'Status', 'Compliance', 'City', 'Action'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', color: '#64748B', textAlign: 'left', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((w, i) => (
                  <tr key={w.id} style={{ borderBottom: i < paginated.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{w.id}</td>
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', fontWeight: 600 }}>{w.name}</td>
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B' }}>{w.phone}</td>
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>{w.platform}</td>
                    <td style={{ padding: '14px 16px' }}><Badge variant={w.status}>{w.status.charAt(0).toUpperCase() + w.status.slice(1)}</Badge></td>
                    <td style={{ padding: '14px 16px' }}><Badge variant={w.compliance}>{w.compliance === 'non-compliant' ? 'Non-compliant' : w.compliance.charAt(0).toUpperCase() + w.compliance.slice(1)}</Badge></td>
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B' }}>{w.city}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => setSelectedWorker(w)}
                        style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', color: '#0EA5E9', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: '32px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '14px', color: '#94A3B8' }}>
                      No workers match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid #F1F5F9' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>
              Showing {Math.min((page - 1) * ROWS_PER_PAGE + 1, filtered.length)}–{Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length} workers
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ height: '32px', width: '32px', borderRadius: '6px', border: '1px solid #E2E8F0', background: page === 1 ? '#F8FAFC' : '#FFFFFF', color: page === 1 ? '#CBD5E1' : '#0F172A', cursor: page === 1 ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', fontSize: '13px' }}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{ height: '32px', width: '32px', borderRadius: '6px', border: '1px solid #E2E8F0', background: page === p ? '#1A3C5E' : '#FFFFFF', color: page === p ? '#FFFFFF' : '#0F172A', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: page === p ? 600 : 400 }}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                style={{ height: '32px', width: '32px', borderRadius: '6px', border: '1px solid #E2E8F0', background: (page === totalPages || totalPages === 0) ? '#F8FAFC' : '#FFFFFF', color: (page === totalPages || totalPages === 0) ? '#CBD5E1' : '#0F172A', cursor: (page === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', fontSize: '13px' }}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail SlidePanel */}
      <SlidePanel
        isOpen={!!selectedWorker}
        onClose={() => setSelectedWorker(null)}
        title={selectedWorker?.name || ''}
        subtitle={`${selectedWorker?.id} · ${selectedWorker?.platform}`}
        width="480px"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => { addToast(`PDF report for ${selectedWorker?.name} downloaded.`, 'success'); }}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg"
              style={{ height: '42px', background: '#1A3C5E', color: '#FFFFFF', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}
            >
              <FileText size={15} />
              Download PDF
            </button>
            <button
              onClick={() => setSelectedWorker(null)}
              style={{ height: '42px', padding: '0 20px', background: '#F1F5F9', color: '#0F172A', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        }
      >
        {selectedWorker && (
          <div className="space-y-5">
            {/* Badges row */}
            <div className="flex items-center gap-2">
              <Badge variant={selectedWorker.status}>{selectedWorker.status.charAt(0).toUpperCase() + selectedWorker.status.slice(1)}</Badge>
              <Badge variant={selectedWorker.compliance}>{selectedWorker.compliance === 'non-compliant' ? 'Non-compliant' : selectedWorker.compliance.charAt(0).toUpperCase() + selectedWorker.compliance.slice(1)}</Badge>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Phone, label: 'Phone', value: selectedWorker.phone },
                { icon: MapPin, label: 'City', value: selectedWorker.city },
                { icon: Calendar, label: 'Joined', value: selectedWorker.joined },
                { icon: IndianRupee, label: 'Wallet Balance', value: selectedWorker.wallet },
                { icon: CreditCard, label: 'Aadhaar', value: selectedWorker.aadhaar },
                { icon: CreditCard, label: 'PAN', value: selectedWorker.pan },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="p-3 rounded-lg" style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={13} style={{ color: '#64748B' }} />
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B', fontWeight: 500 }}>{item.label}</p>
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', fontWeight: 600 }}>{item.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="p-4 rounded-xl" style={{ background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0369A1', marginBottom: '12px' }}>Contribution Summary</p>
              <div className="flex justify-between">
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B' }}>Total Trips</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: '#0F172A' }}>{selectedWorker.trips.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B' }}>Total Contributions</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: '#0F172A' }}>{selectedWorker.contributions}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>
    </PlatformAdminLayout>
  );
}
