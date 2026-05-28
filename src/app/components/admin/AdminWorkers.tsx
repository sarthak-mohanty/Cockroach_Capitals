import { useState, useMemo } from 'react';
import { Search, X, ChevronDown, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import AdminLayout from './AdminLayout';

// ── Types ─────────────────────────────────────────────────────────────────────
type SortField = 'name' | 'city' | 'joined' | 'contributions';
type SortDir   = 'asc' | 'desc';

const WORKERS = [
  { id: 1, name: 'Raju Yadav',    gsId: 'GS-2024-0847291', phone: '+91-99999 99999', city: 'Bengaluru', joined: '12 Jan 2024', joinedTs: 20240112, contributions: 1840, insurance: 'Active',  lastActive: 'Today' },
  { id: 2, name: 'Meena Sharma',  gsId: 'GS-2024-0847292', phone: '+91-98765 43210', city: 'Bengaluru', joined: '15 Jan 2024', joinedTs: 20240115, contributions: 2200, insurance: 'Active',  lastActive: 'Today' },
  { id: 3, name: 'Arjun Patel',   gsId: 'GS-2024-0847293', phone: '+91-97654 32109', city: 'Pune',      joined: '20 Jan 2024', joinedTs: 20240120, contributions: 1650, insurance: 'Active',  lastActive: 'Today' },
  { id: 4, name: 'Deepa Nair',    gsId: 'GS-2024-0847294', phone: '+91-96543 21098', city: 'Bengaluru', joined: '3 Feb 2024',  joinedTs: 20240203, contributions: 980,  insurance: 'Pending', lastActive: '3 days ago' },
  { id: 5, name: 'Karan Singh',   gsId: 'GS-2024-0847295', phone: '+91-95432 10987', city: 'Jaipur',    joined: '10 Feb 2024', joinedTs: 20240210, contributions: 3100, insurance: 'Active',  lastActive: 'Yesterday' },
  { id: 6, name: 'Sunita Roy',    gsId: 'GS-2024-0847296', phone: '+91-94321 09876', city: 'Mumbai',    joined: '18 Feb 2024', joinedTs: 20240218, contributions: 750,  insurance: 'Pending', lastActive: '5 days ago' },
  { id: 7, name: 'Vikram Das',    gsId: 'GS-2024-0847297', phone: '+91-93210 98765', city: 'Bengaluru', joined: '3 Mar 2024',  joinedTs: 20240303, contributions: 2850, insurance: 'Active',  lastActive: 'Today' },
  { id: 8, name: 'Preethi Nair',  gsId: 'GS-2024-0847298', phone: '+91-92109 87654', city: 'Pune',      joined: '15 Mar 2024', joinedTs: 20240315, contributions: 1420, insurance: 'Active',  lastActive: 'Yesterday' },
];

const PAGE_SIZE = 5;

// ── Sortable column header ────────────────────────────────────────────────────
function SortTh({
  label, field, sortField, sortDir, onSort,
}: {
  label: string; field: SortField;
  sortField: SortField | null; sortDir: SortDir;
  onSort: (f: SortField) => void;
}) {
  const active = sortField === field;
  return (
    <th
      onClick={() => onSort(field)}
      className="px-4 py-3 text-left select-none"
      style={{
        fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '11px',
        color: active ? '#0EA5E9' : '#64748B',
        textTransform: 'uppercase', whiteSpace: 'nowrap', cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active
          ? sortDir === 'asc'
            ? <ArrowUp size={11} style={{ color: '#0EA5E9' }} />
            : <ArrowDown size={11} style={{ color: '#0EA5E9' }} />
          : <ArrowUpDown size={11} style={{ color: '#CBD5E1' }} />
        }
      </span>
    </th>
  );
}

// ── Plain (non-sortable) column header ────────────────────────────────────────
function PlainTh({ label }: { label: string }) {
  return (
    <th className="px-4 py-3 text-left" style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '11px', color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
      {label}
    </th>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AdminWorkers() {
  const [selectedWorker, setSelectedWorker] = useState<number | null>(null);
  const [filtersOpen, setFiltersOpen]       = useState(false);

  // Search + filter state
  const [query,            setQuery]            = useState('');
  const [cityFilter,       setCityFilter]       = useState('All');
  const [insuranceFilter,  setInsuranceFilter]  = useState('All');
  const [activityFilter,   setActivityFilter]   = useState('All');

  // Sort state
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir,   setSortDir]   = useState<SortDir>('asc');

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Pagination
  const [page, setPage] = useState(1);

  // ── Filter + sort pipeline ──────────────────────────────────────────────

  const filtered = useMemo(() => {
    let list = WORKERS.filter(w => {
      const q = query.trim().toLowerCase();
      if (q && !w.name.toLowerCase().includes(q) && !w.gsId.toLowerCase().includes(q) && !w.phone.includes(q)) return false;
      if (cityFilter !== 'All' && w.city !== cityFilter) return false;
      if (insuranceFilter !== 'All' && w.insurance !== insuranceFilter) return false;
      if (activityFilter === 'Today' && w.lastActive !== 'Today') return false;
      if (activityFilter === 'This Week' && !['Today', 'Yesterday'].includes(w.lastActive)) return false;
      return true;
    });

    if (sortField) {
      list = [...list].sort((a, b) => {
        let result = 0;
        if (sortField === 'name')          result = a.name.localeCompare(b.name);
        else if (sortField === 'city')     result = a.city.localeCompare(b.city);
        else if (sortField === 'contributions') result = a.contributions - b.contributions;
        else if (sortField === 'joined')   result = a.joinedTs - b.joinedTs;
        return sortDir === 'asc' ? result : -result;
      });
    }
    return list;
  }, [query, cityFilter, insuranceFilter, activityFilter, sortField, sortDir]);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage    = Math.min(page, totalPages);
  const pageSlice   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Page numbers to show (at most 3 + ellipsis pattern)
  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
    setPage(1);
  };

  const handleFilterChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setter(e.target.value);
    setPage(1);
  };

  // ── Checkbox logic ──────────────────────────────────────────────────────

  const pageIds      = pageSlice.map(w => w.id);
  const allChecked   = pageIds.length > 0 && pageIds.every(id => selectedIds.has(id));
  const someChecked  = pageIds.some(id => selectedIds.has(id));

  const toggleAll = () => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allChecked) pageIds.forEach(id => next.delete(id));
      else            pageIds.forEach(id => next.add(id));
      return next;
    });
  };

  const toggleOne = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedWorkerData = WORKERS.find(w => w.id === selectedWorker);

  const selectStyle: React.CSSProperties = {
    height: '40px', border: '1.5px solid #E2E8F0', borderRadius: '6px',
    fontFamily: 'var(--font-body)', fontSize: '14px', padding: '0 10px',
    outline: 'none', cursor: 'pointer', background: '#FFFFFF',
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 relative">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(20px,3vw,24px)', color: '#0F172A' }}>
            Worker Management
          </h1>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0369A1' }}>
                {selectedIds.size} selected
              </span>
              <button onClick={() => setSelectedIds(new Set())} style={{ color: '#0369A1', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <X size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Search bar */}
        <div className="relative mb-3">
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search by name, phone, or GigShield ID"
            className="w-full pl-10 pr-10 rounded-md outline-none"
            style={{ height: '42px', border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '14px' }}
          />
          {query && (
            <button onClick={() => { setQuery(''); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={15} style={{ color: '#94A3B8' }} />
            </button>
          )}
        </div>

        {/* Filters — collapsible on mobile, inline on md+ */}
        <div className="mb-4">
          <button
            className="flex items-center gap-2 mb-2 md:hidden"
            onClick={() => setFiltersOpen(!filtersOpen)}
            style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <ChevronDown size={16} style={{ transform: filtersOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            {filtersOpen ? 'Hide filters' : 'Show filters'}
          </button>

          <div className={`flex flex-wrap gap-2 ${filtersOpen ? 'flex' : 'hidden'} md:flex`}>
            {/* City */}
            <select value={cityFilter} onChange={handleFilterChange(setCityFilter)} style={{ ...selectStyle, minWidth: '140px' }}>
              {['All', 'Bengaluru', 'Pune', 'Jaipur', 'Mumbai'].map(o => (
                <option key={o} value={o}>{o === 'All' ? 'City: All' : o}</option>
              ))}
            </select>

            {/* Insurance */}
            <select value={insuranceFilter} onChange={handleFilterChange(setInsuranceFilter)} style={{ ...selectStyle, minWidth: '155px' }}>
              {['All', 'Active', 'Pending'].map(o => (
                <option key={o} value={o}>{o === 'All' ? 'Insurance: All' : o}</option>
              ))}
            </select>

            {/* Activity */}
            <select value={activityFilter} onChange={handleFilterChange(setActivityFilter)} style={{ ...selectStyle, minWidth: '145px' }}>
              {['All', 'Today', 'This Week'].map(o => (
                <option key={o} value={o}>{o === 'All' ? 'Activity: All' : o}</option>
              ))}
            </select>

            {/* Clear all filters */}
            {(cityFilter !== 'All' || insuranceFilter !== 'All' || activityFilter !== 'All' || query) && (
              <button
                onClick={() => { setCityFilter('All'); setInsuranceFilter('All'); setActivityFilter('All'); setQuery(''); setPage(1); }}
                style={{ height: '40px', padding: '0 12px', border: '1.5px solid #FECACA', borderRadius: '6px', background: '#FFF5F5', color: '#EF4444', fontFamily: 'var(--font-body)', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '700px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                  {/* Select-all checkbox */}
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      ref={el => { if (el) el.indeterminate = someChecked && !allChecked; }}
                      onChange={toggleAll}
                      style={{ cursor: 'pointer', accentColor: '#0EA5E9' }}
                    />
                  </th>
                  <SortTh label="Worker Name"   field="name"          sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <PlainTh label="GigShield ID" />
                  <PlainTh label="Phone" />
                  <SortTh label="City"          field="city"          sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortTh label="Joined"        field="joined"        sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortTh label="Contributions" field="contributions" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <PlainTh label="Insurance" />
                  <PlainTh label="Last Activity" />
                </tr>
              </thead>
              <tbody>
                {pageSlice.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '14px', color: '#94A3B8' }}>
                      No workers match the current filters.
                    </td>
                  </tr>
                ) : pageSlice.map((worker, idx) => (
                  <tr
                    key={worker.id}
                    onClick={() => setSelectedWorker(worker.id)}
                    className="cursor-pointer"
                    style={{
                      background: selectedIds.has(worker.id) ? '#F0F9FF' : idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
                      borderBottom: '1px solid #F1F5F9',
                      transition: 'background 150ms',
                    }}
                  >
                    <td className="px-4 py-3" onClick={e => toggleOne(worker.id, e)}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(worker.id)}
                        onChange={() => {}}
                        style={{ cursor: 'pointer', accentColor: '#0EA5E9' }}
                      />
                    </td>
                    <td className="px-4 py-3" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', fontWeight: 500, whiteSpace: 'nowrap' }}>{worker.name}</td>
                    <td className="px-4 py-3" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0EA5E9', whiteSpace: 'nowrap' }}>{worker.gsId}</td>
                    <td className="px-4 py-3" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', whiteSpace: 'nowrap' }}>{worker.phone}</td>
                    <td className="px-4 py-3" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>{worker.city}</td>
                    <td className="px-4 py-3" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', whiteSpace: 'nowrap' }}>{worker.joined}</td>
                    <td className="px-4 py-3" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', fontWeight: 600 }}>Rs {worker.contributions.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full" style={{
                        background: worker.insurance === 'Active' ? '#F0FDF4' : '#FEF3C7',
                        color:      worker.insurance === 'Active' ? '#16A34A' : '#D97706',
                        fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '11px',
                      }}>
                        {worker.insurance}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B', whiteSpace: 'nowrap' }}>{worker.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <div className="px-4 py-3 border-t flex flex-wrap items-center justify-between gap-2" style={{ borderColor: '#E2E8F0' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B' }}>
              {filtered.length === 0
                ? 'No results'
                : `Showing ${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} of ${filtered.length} workers`
              }
            </span>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  style={{
                    padding: '4px 10px', borderRadius: '6px', border: '1px solid #E2E8F0',
                    fontFamily: 'var(--font-body)', fontSize: '13px',
                    color: safePage === 1 ? '#CBD5E1' : '#64748B',
                    background: '#FFFFFF', cursor: safePage === 1 ? 'default' : 'pointer',
                  }}
                >
                  ← Prev
                </button>

                {pageNums.map(n => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    style={{
                      width: '32px', height: '32px', borderRadius: '6px',
                      border: `1px solid ${n === safePage ? '#0EA5E9' : '#E2E8F0'}`,
                      background: n === safePage ? '#0EA5E9' : '#FFFFFF',
                      color: n === safePage ? '#FFFFFF' : '#64748B',
                      fontFamily: 'var(--font-body)', fontSize: '13px',
                      cursor: 'pointer', fontWeight: n === safePage ? 600 : 400,
                    }}
                  >
                    {n}
                  </button>
                ))}

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  style={{
                    padding: '4px 10px', borderRadius: '6px', border: '1px solid #E2E8F0',
                    fontFamily: 'var(--font-body)', fontSize: '13px',
                    color: safePage === totalPages ? '#CBD5E1' : '#64748B',
                    background: '#FFFFFF', cursor: safePage === totalPages ? 'default' : 'pointer',
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Slide-in Worker Detail Panel */}
        {selectedWorker && selectedWorkerData && (
          <>
            <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.3)' }} onClick={() => setSelectedWorker(null)} />
            <div
              className="fixed right-0 top-0 bottom-0 bg-white z-50 overflow-auto"
              style={{ width: 'min(100vw, 520px)', boxShadow: '-8px 0px 32px rgba(0,0,0,0.12)' }}
            >
              <div className="p-5 sm:p-6 border-b relative" style={{ borderColor: '#E2E8F0' }}>
                <button onClick={() => setSelectedWorker(null)} className="absolute top-5 right-5">
                  <X size={22} style={{ color: '#64748B' }} />
                </button>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: '#0F172A', paddingRight: '28px' }}>
                  {selectedWorkerData.name}
                </h2>
                <div className="flex flex-wrap gap-2 mt-2" style={{ fontFamily: 'var(--font-body)', fontSize: '13px' }}>
                  <span style={{ color: '#0EA5E9' }}>{selectedWorkerData.gsId}</span>
                  <span style={{ color: '#64748B' }}>{selectedWorkerData.phone}</span>
                  <span style={{ color: '#64748B' }}>{selectedWorkerData.city}</span>
                  <span className="px-2 py-0.5 rounded-full" style={{
                    background: selectedWorkerData.insurance === 'Active' ? '#F0FDF4' : '#FEF3C7',
                    color: selectedWorkerData.insurance === 'Active' ? '#16A34A' : '#D97706',
                    fontSize: '11px',
                  }}>
                    {selectedWorkerData.insurance}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Current Wallet', value: selectedWorkerData.contributions },
                    { label: 'This Month',     value: selectedWorkerData.contributions },
                    { label: 'All-Time',       value: selectedWorkerData.contributions },
                  ].map((s) => (
                    <div key={s.label}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>{s.label}</p>
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(16px,2.5vw,24px)', color: '#0F172A', marginTop: '4px' }}>
                        Rs {s.value.toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 sm:p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
                <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A', marginBottom: '12px' }}>Platform Linkages</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Swiggy',  logo: 'S', bg: '#FF6B00',              joined: '12 Jan 2024' },
                    { name: 'Blinkit', logo: 'B', bg: '#1C1C1C',              joined: '3 Mar 2024' },
                    { name: 'Ola',     logo: 'O', bg: '#FFD700', tc: '#000',  joined: '18 Apr 2024' },
                  ].map((p) => (
                    <div key={p.name} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: p.bg }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: p.tc ?? '#FFFFFF' }}>{p.logo}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#0F172A' }}>{p.name}</p>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>Joined {p.joined}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full" style={{ background: '#22C55E' }} />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#22C55E' }}>Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 py-2 rounded-md" style={{ border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A', cursor: 'pointer' }}>
                    Send Benefit Notification
                  </button>
                  <button className="flex-1 py-2 rounded-md" style={{ border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A', cursor: 'pointer' }}>
                    View Full History
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
