import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Shield, AlertTriangle, Clock, Wallet, CheckCircle, MapPin } from 'lucide-react';
import BottomNav from './BottomNav';
import ClaimTrackingModal from './ClaimTrackingModal';
import ClaimDetailModal, { type ClaimSummary } from './ClaimDetailModal';
import {
  BENGALURU_HOSPITALS,
  JAIPUR_HOSPITALS,
  SCHEME_COLORS,
  ACTIVE_CLAIM,
  formatINR,
  type Hospital,
} from '../../data/insuranceData';

interface Claim {
  id: string;
  type: string;
  date: string;
  hospital: string;
  submittedOn: string;
  status: string;
}

const INITIAL_SHOW = 3;

export default function WorkerInsurance() {
  const navigate = useNavigate();
  const [city, setCity] = useState<'bengaluru' | 'jaipur'>('bengaluru');
  const [showAll, setShowAll] = useState(false);
  const [networkExpanded, setNetworkExpanded] = useState(true);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<ClaimSummary | null>(null);

  const claims: Claim[] = JSON.parse(localStorage.getItem('gigshield_claims') || '[]');

  const allHospitals = city === 'bengaluru' ? BENGALURU_HOSPITALS : JAIPUR_HOSPITALS;
  const traumaCentres = allHospitals.filter(h => h.designation === 'TRAUMA_CENTRE');
  const empanelled = allHospitals.filter(h => h.designation === 'EMPANELLED');
  const ordered = [...traumaCentres, ...empanelled];
  const visible = showAll ? ordered : ordered.slice(0, INITIAL_SHOW);

  return (
    <div data-tour-id="tour-insurance-page" className="min-h-screen pb-20" style={{ background: '#F8FAFC' }}>

      {/* ── Header ── */}
      <div className="sticky top-0 bg-white border-b px-4 flex items-center z-10" style={{ height: '56px', borderColor: '#E2E8F0' }}>
        <button onClick={() => navigate('/worker/home')} className="mr-4">
          <ArrowLeft size={24} style={{ color: '#0F172A' }} />
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '18px', color: '#0F172A' }}>
          My Insurance
        </h1>
      </div>

      {/* ── Disclaimer ── */}
      <div className="px-4 py-2.5" style={{ background: '#FEF3C7', borderBottom: '2px solid #F59E0B' }}>
        <div className="flex items-start gap-2">
          <AlertTriangle size={15} style={{ color: '#D97706', flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '11px', color: '#92400E', lineHeight: 1.4 }}>
            PROTOTYPE — Insurance underwritten by ICICI Lombard under PMSBY (Pradhan Mantri Suraksha Bima Yojana). GigShield Cash Reimbursement is a GigShield-specific top-up. Worker pays Rs 0 premium. Real coverage in production.
          </p>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* ── Policy Status ── */}
        <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full" style={{ background: '#F0FDF4', color: '#16A34A', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px' }}>
              ACTIVE
            </span>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A' }}>
              Policy Active
            </p>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Policy No:', value: 'GS-2024-0847291' },
              { label: 'Underwriter:', value: 'ICICI Lombard (PMSBY)' },
              { label: 'Type:', value: 'Accident & Disability' },
              { label: 'Valid from:', value: '12 Jan 2024' },
            ].map(row => (
              <div key={row.label} className="flex justify-between">
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>{row.label}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#0F172A' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Coverage Card ── */}
        <div data-tour-id="tour-insurance-coverage" className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
          <div className="px-5 pt-5 pb-4">
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
              Your Coverage
            </p>
            <div className="space-y-4">
              {/* Row 1 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield size={20} style={{ color: '#22C55E' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#0F172A' }}>
                    Accidental Death / Permanent Disability
                  </span>
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: '#22C55E', flexShrink: 0, marginLeft: '8px' }}>
                  {formatINR(200000)}
                </span>
              </div>
              <div className="h-px" style={{ background: '#F1F5F9' }} />
              {/* Row 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield size={20} style={{ color: '#F59E0B' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#0F172A' }}>
                    Partial Disability
                  </span>
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: '#F59E0B', flexShrink: 0, marginLeft: '8px' }}>
                  {formatINR(100000)}
                </span>
              </div>
              <div className="h-px" style={{ background: '#F1F5F9' }} />
              {/* Row 3 — GigShield Cash Top-Up */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet size={20} style={{ color: '#F59E0B' }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#0F172A' }}>
                      GigShield Cash Reimbursement
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: '#F59E0B', flexShrink: 0, marginLeft: '8px' }}>
                    Up to {formatINR(10000)}
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B', marginTop: '4px', paddingLeft: '28px' }}>
                  Transport + daily allowance + medicines. Credited to GigShield wallet within 15 days.
                </p>
              </div>
            </div>
          </div>

          {/* Total row */}
          <div className="px-5 py-4" style={{ background: '#F0F9FF', borderTop: '1px solid #E2E8F0' }}>
            <div className="flex items-center justify-between mb-1">
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#0F172A' }}>
                Total Protection (PMSBY + GigShield)
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '22px', color: '#1A3C5E' }}>
                {formatINR(210000)}
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B' }}>
              Cashless at network hospitals. Cash reimbursement for incidentals.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#22C55E', marginTop: '2px' }}>
              Funded by your platform. You pay Rs 0.
            </p>
          </div>
        </div>

        {/* ── Active Claim Card ── */}
        <div
          className="bg-white rounded-xl p-5 shadow-sm"
          style={{ borderTop: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', borderLeft: '4px solid #F59E0B' }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <AlertTriangle size={18} style={{ color: '#F59E0B', flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px', color: '#0F172A', lineHeight: 1.3 }}>
                Claim in Progress — {ACTIVE_CLAIM.claimId}
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full flex-shrink-0" style={{ background: '#FEF3C7', color: '#D97706', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px' }}>
              PROCESSING
            </span>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B', marginTop: '6px' }}>
            Scooter accident during Swiggy delivery, {ACTIVE_CLAIM.incidentDate} — {ACTIVE_CLAIM.hospital}
          </p>
          <button
            onClick={() => setShowTrackingModal(true)}
            className="rounded-lg mt-3"
            style={{
              height: '36px',
              width: '160px',
              background: '#0EA5E9',
              color: '#FFFFFF',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Track Claim →
          </button>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', marginTop: '8px' }}>
            Expected payout: {formatINR(ACTIVE_CLAIM.expectedPayout.total)} (PMSBY {formatINR(ACTIVE_CLAIM.expectedPayout.pmsby)} + GigShield {formatINR(ACTIVE_CLAIM.expectedPayout.gigshieldCash)} cash)
          </p>
        </div>

        {/* ── File Claim ── */}
        <button
          data-tour-id="tour-insurance-file-claim"
          onClick={() => navigate('/worker/claim')}
          className="w-full rounded-xl flex items-center justify-center gap-2"
          style={{
            height: '52px',
            background: '#EF4444',
            color: '#FFFFFF',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          🚨 File a Claim
        </button>

        {/* ── Hospital Network ── */}
        <div data-tour-id="tour-insurance-hospitals" className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
          {/* Header row */}
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <div>
              <button
                onClick={() => setNetworkExpanded(!networkExpanded)}
                className="flex items-center gap-2"
              >
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: '#0F172A' }}>
                  Your Hospital Network
                </span>
              </button>
              {networkExpanded && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                  {allHospitals.length} hospitals in {city === 'bengaluru' ? 'Bengaluru' : 'Jaipur'}
                </p>
              )}
            </div>
            {/* City toggle */}
            {networkExpanded && (
              <div className="flex rounded-full overflow-hidden flex-shrink-0" style={{ border: '1.5px solid #E2E8F0' }}>
                {(['bengaluru', 'jaipur'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => { setCity(c); setShowAll(false); }}
                    className="px-3 py-1.5"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                      fontSize: '12px',
                      background: city === c ? '#0EA5E9' : 'transparent',
                      color: city === c ? '#FFFFFF' : '#64748B',
                      border: 'none',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {c === 'bengaluru' ? 'Bengaluru' : 'Jaipur'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {networkExpanded && (
            <div className="px-4 py-3 space-y-3">
              {visible.map(hospital => (
                <HospitalCard key={hospital.id} hospital={hospital} />
              ))}
              {ordered.length > INITIAL_SHOW && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0EA5E9', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'center', paddingBottom: '4px' }}
                >
                  {showAll ? 'Show fewer ↑' : `Show all ${ordered.length} hospitals →`}
                </button>
              )}
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8', textAlign: 'center', paddingBottom: '4px' }}>
                374+ AB-PMJAY hospitals in Bengaluru · 1,381+ nationwide
              </p>
            </div>
          )}
        </div>

        {/* ── Claim History ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4" style={{ border: '1px solid #E2E8F0' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
            Claim History
          </p>
          {claims.length === 0 ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center" style={{ background: '#F1F5F9' }}>
                <span style={{ fontSize: '24px' }}>📋</span>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#94A3B8', marginTop: '8px' }}>
                No claims filed yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {claims.map((claim) => (
                <button
                  key={claim.id}
                  onClick={() => setSelectedClaim(claim)}
                  className="w-full text-left rounded-xl p-4"
                  style={{ border: '1px solid #E2E8F0', background: '#F8FAFC', cursor: 'pointer' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px', color: '#0F172A' }}>
                        {claim.type}
                      </p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                        {claim.hospital}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0 ml-2" style={{ background: '#FEF3C7' }}>
                      <Clock size={12} style={{ color: '#D97706' }} />
                      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', color: '#D97706', whiteSpace: 'nowrap' }}>
                        {claim.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8' }}>Claim ID: {claim.id}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#0EA5E9', fontWeight: 500 }}>
                      View details →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav active="insurance" />

      {showTrackingModal && <ClaimTrackingModal onClose={() => setShowTrackingModal(false)} />}
      {selectedClaim && <ClaimDetailModal claim={selectedClaim} onClose={() => setSelectedClaim(null)} />}
    </div>
  );
}

// ─── Hospital Card Sub-Component ──────────────────────────────────────────────
function HospitalCard({ hospital }: { hospital: Hospital }) {
  const isTrauma = hospital.designation === 'TRAUMA_CENTRE';

  return (
    <div
      className="rounded-xl p-4"
      style={
        isTrauma
          ? {
              background: '#FEF2F2',
              borderTop: '1px solid #FECACA',
              borderRight: '1px solid #FECACA',
              borderBottom: '1px solid #FECACA',
              borderLeft: '4px solid #EF4444',
            }
          : { background: '#FFFFFF', border: '1px solid #E2E8F0' }
      }
    >
      {/* Name + designation chip */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: '#0F172A', lineHeight: 1.3 }}>
            {hospital.name}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8', marginTop: '1px' }}>
            {hospital.type}
          </p>
        </div>
        <span
          className="flex-shrink-0 px-2.5 py-1 rounded-full"
          style={
            isTrauma
              ? { background: '#EF4444', color: '#FFFFFF', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px', whiteSpace: 'nowrap' }
              : { background: '#F0FDF4', color: '#22C55E', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px', whiteSpace: 'nowrap' }
          }
        >
          {isTrauma ? '🏥 TRAUMA CENTRE' : 'EMPANELLED'}
        </span>
      </div>

      {/* Speciality pills (top 3) */}
      <div className="flex flex-wrap gap-1 mb-2">
        {hospital.specialities.slice(0, 3).map(s => (
          <span key={s} className="px-2 py-0.5 rounded-full" style={{ background: '#F1F5F9', color: '#64748B', fontFamily: 'var(--font-body)', fontSize: '10px' }}>
            {s}
          </span>
        ))}
      </div>

      {/* Address */}
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', marginBottom: '10px', lineHeight: 1.4 }}>
        {hospital.area} · {hospital.phone}
      </p>

      {/* Open 24x7 + Cashless */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: '#22C55E' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#22C55E', fontWeight: 500 }}>Open 24×7</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle size={13} style={{ color: '#22C55E' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#22C55E', fontWeight: 500 }}>Cashless</span>
        </div>
      </div>

      {/* Empanelment badges */}
      <div className="flex flex-wrap gap-1 mb-3">
        {hospital.empanelledUnder.map(scheme => {
          const sc = SCHEME_COLORS[scheme] || { bg: '#64748B', text: '#FFFFFF', label: scheme };
          return (
            <span key={scheme} className="px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px' }}>
              {sc.label}
            </span>
          );
        })}
      </div>

      {/* Tag + Directions */}
      <div className="flex items-center justify-between">
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8', fontStyle: 'italic', flex: 1, paddingRight: '8px' }}>
          {hospital.tag}
        </p>
        <a
          href={`https://www.google.com/maps/search/${encodeURIComponent(hospital.name + ' ' + hospital.area)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 flex-shrink-0"
          style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', color: '#0EA5E9', textDecoration: 'none' }}
        >
          <MapPin size={13} />
          Get Directions
        </a>
      </div>
    </div>
  );
}
