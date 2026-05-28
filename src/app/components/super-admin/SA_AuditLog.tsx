import { useState } from 'react';
import SuperAdminLayout from './SuperAdminLayout';
import { Search, Download } from 'lucide-react';
import { useToast } from '../shared/ToastContext';

interface AuditRow {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  actionType: 'create' | 'update' | 'delete' | 'login' | 'export' | 'config' | 'alert';
  target: string;
  ip: string;
  platform: string;
}

const ROWS: AuditRow[] = [
  { id: 'AUD-1001', timestamp: 'May 26, 2026 14:32', actor: 'Sarthak M.', action: 'Config Updated', actionType: 'config', target: 'Worker contribution rate → 3%', ip: '103.21.45.12', platform: 'System' },
  { id: 'AUD-1002', timestamp: 'May 26, 2026 13:58', actor: 'Priya Menon', action: 'Export', actionType: 'export', target: 'Worker CSV — Swiggy India', ip: '106.51.22.89', platform: 'Swiggy' },
  { id: 'AUD-1003', timestamp: 'May 26, 2026 12:14', actor: 'Sarthak M.', action: 'Login', actionType: 'login', target: 'Super Admin Panel (2FA verified)', ip: '103.21.45.12', platform: 'System' },
  { id: 'AUD-1004', timestamp: 'May 26, 2026 11:47', actor: 'Amit Sharma', action: 'Worker Created', actionType: 'create', target: 'GS-2026-08408 — Mohammed Imran', ip: '49.207.11.34', platform: 'Porter' },
  { id: 'AUD-1005', timestamp: 'May 26, 2026 10:22', actor: 'System', action: 'Alert', actionType: 'alert', target: 'NPA rate exceeded 3% — Ola Electric', ip: 'system', platform: 'Ola' },
  { id: 'AUD-1006', timestamp: 'May 26, 2026 09:05', actor: 'Priya Menon', action: 'Worker Updated', actionType: 'update', target: 'GS-2026-08403 — compliance flag resolved', ip: '106.51.22.89', platform: 'Swiggy' },
  { id: 'AUD-1007', timestamp: 'May 25, 2026 18:40', actor: 'Sarthak M.', action: 'API Key Regenerated', actionType: 'config', target: 'Platform: Porter (PLT-004)', ip: '103.21.45.12', platform: 'System' },
  { id: 'AUD-1008', timestamp: 'May 25, 2026 16:11', actor: 'System', action: 'Contribution Remitted', actionType: 'create', target: 'Swiggy India — ₹91,240 → PWFVS', ip: 'system', platform: 'Swiggy' },
  { id: 'AUD-1009', timestamp: 'May 25, 2026 14:33', actor: 'Kavita Rao', action: 'Export', actionType: 'export', target: 'Compliance Report — Ola Electric Apr 2026', ip: '122.167.45.21', platform: 'Ola' },
  { id: 'AUD-1010', timestamp: 'May 25, 2026 11:02', actor: 'Sarthak M.', action: 'Login', actionType: 'login', target: 'Super Admin Panel (2FA verified)', ip: '103.21.45.12', platform: 'System' },
  { id: 'AUD-1011', timestamp: 'May 24, 2026 17:55', actor: 'System', action: 'Alert', actionType: 'alert', target: 'Login from new device — Chrome, Mumbai', ip: '103.21.45.12', platform: 'System' },
  { id: 'AUD-1012', timestamp: 'May 24, 2026 15:20', actor: 'Rohan Joshi', action: 'Worker Created', actionType: 'create', target: 'GS-2026-08407 — Deepa Nair', ip: '117.96.23.45', platform: 'Porter' },
  { id: 'AUD-1013', timestamp: 'May 24, 2026 13:14', actor: 'Amit Sharma', action: 'Login', actionType: 'login', target: 'Platform Admin Panel', ip: '49.207.11.34', platform: 'Blinkit' },
  { id: 'AUD-1014', timestamp: 'May 23, 2026 10:45', actor: 'System', action: 'Loan Disbursed', actionType: 'create', target: 'GS-2026-08404 — ₹45,000', ip: 'system', platform: 'Swiggy' },
  { id: 'AUD-1015', timestamp: 'May 23, 2026 09:30', actor: 'Sarthak M.', action: 'Platform Deactivated', actionType: 'delete', target: 'Test Platform — PLT-TEST', ip: '103.21.45.12', platform: 'System' },
];

const actionColors: Record<string, { bg: string; color: string }> = {
  create: { bg: '#F0FDF4', color: '#16A34A' },
  update: { bg: '#F0F9FF', color: '#0369A1' },
  delete: { bg: '#FEF2F2', color: '#DC2626' },
  login: { bg: '#F5F3FF', color: '#7C3AED' },
  export: { bg: '#FEF3C7', color: '#D97706' },
  config: { bg: '#F1F5F9', color: '#475569' },
  alert: { bg: '#FEF2F2', color: '#EF4444' },
};

const ROWS_PER_PAGE = 8;

export default function SA_AuditLog() {
  const { addToast } = useToast();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = ROWS.filter(r => {
    const matchQ = !query || r.actor.toLowerCase().includes(query.toLowerCase()) || r.action.toLowerCase().includes(query.toLowerCase()) || r.target.toLowerCase().includes(query.toLowerCase());
    const matchType = typeFilter === 'all' || r.actionType === typeFilter;
    const matchPlatform = platformFilter === 'all' || r.platform === platformFilter;
    return matchQ && matchType && matchPlatform;
  });

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const selectStyle: React.CSSProperties = {
    height: '36px', border: '1px solid #E2E8F0', borderRadius: '8px',
    fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A',
    padding: '0 10px', background: '#FFFFFF', cursor: 'pointer', outline: 'none',
  };

  return (
    <SuperAdminLayout activeScreen="audit" title="Audit Log">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: '#0F172A' }}>Audit Log</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
              Complete record of all system and user actions.
            </p>
          </div>
          <button
            data-tour-id="tour-sa-audit-export"
            onClick={() => addToast('Audit log exported as CSV.', 'success')}
            className="flex items-center gap-2 rounded-lg px-4"
            style={{ height: '40px', background: '#0F172A', color: '#FDE68A', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}
          >
            <Download size={15} />
            Export
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1" style={{ minWidth: '200px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search actor, action or target…"
              className="w-full outline-none"
              style={{ height: '40px', border: '1px solid #E2E8F0', borderRadius: '8px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', paddingLeft: '36px', paddingRight: '12px', background: '#FFFFFF' }}
            />
          </div>
          <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }} style={selectStyle}>
            <option value="all">All Types</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="login">Login</option>
            <option value="export">Export</option>
            <option value="config">Config</option>
            <option value="alert">Alert</option>
          </select>
          <select value={platformFilter} onChange={e => { setPlatformFilter(e.target.value); setPage(1); }} style={selectStyle}>
            <option value="all">All Platforms</option>
            <option value="System">System</option>
            <option value="Swiggy">Swiggy</option>
            <option value="Blinkit">Blinkit</option>
            <option value="Ola">Ola</option>
            <option value="Porter">Porter</option>
          </select>
        </div>

        {/* Table */}
        <div data-tour-id="tour-sa-audit-log" className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  {['Timestamp', 'Actor', 'Action', 'Target', 'Platform', 'IP Address'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', color: '#64748B', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((row, i) => {
                  const ac = actionColors[row.actionType];
                  return (
                    <tr key={row.id} style={{ borderBottom: i < paginated.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', whiteSpace: 'nowrap' }}>{row.timestamp}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A', whiteSpace: 'nowrap' }}>{row.actor}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ background: ac.bg, color: ac.color, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', padding: '2px 8px', borderRadius: '100px', whiteSpace: 'nowrap' }}>
                          {row.action}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: '12px', color: '#0F172A', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.target}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>{row.platform}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '12px', color: '#94A3B8' }}>{row.ip}</td>
                    </tr>
                  );
                })}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '32px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '14px', color: '#94A3B8' }}>No audit records match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid #F1F5F9' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>
              Showing {Math.min((page - 1) * ROWS_PER_PAGE + 1, filtered.length)}–{Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length} entries
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ height: '32px', width: '32px', borderRadius: '6px', border: '1px solid #E2E8F0', background: page === 1 ? '#F8FAFC' : '#FFFFFF', color: page === 1 ? '#CBD5E1' : '#0F172A', cursor: page === 1 ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ height: '32px', width: '32px', borderRadius: '6px', border: '1px solid #E2E8F0', background: page === p ? '#0F172A' : '#FFFFFF', color: page === p ? '#FDE68A' : '#0F172A', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: page === p ? 600 : 400 }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}
                style={{ height: '32px', width: '32px', borderRadius: '6px', border: '1px solid #E2E8F0', background: (page === totalPages || totalPages === 0) ? '#F8FAFC' : '#FFFFFF', color: (page === totalPages || totalPages === 0) ? '#CBD5E1' : '#0F172A', cursor: (page === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
