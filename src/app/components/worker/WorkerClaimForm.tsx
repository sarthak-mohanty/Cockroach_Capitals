import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, AlertTriangle, CheckCircle, Upload } from 'lucide-react';
import {
  BENGALURU_HOSPITALS,
  JAIPUR_HOSPITALS,
  VERIFICATION_STEPS,
  REIMBURSEMENT_TIERS,
  formatINR,
  type Hospital,
} from '../../data/insuranceData';

type FormStep = 'form' | 'review' | 'submitted';

const ALL_HOSPITALS: Hospital[] = [...BENGALURU_HOSPITALS, ...JAIPUR_HOSPITALS];

// Derive tier from hospital designation
function getTier(hospital: Hospital | undefined) {
  if (!hospital) return REIMBURSEMENT_TIERS.nonEmpanelled;
  if (hospital.designation === 'TRAUMA_CENTRE') return REIMBURSEMENT_TIERS.traumaCentre;
  return REIMBURSEMENT_TIERS.empanelledPrivate;
}

const CLAIM_ID = 'CLM-2026-00391';

export default function WorkerClaimForm() {
  const navigate = useNavigate();
  const [formStep, setFormStep] = useState<FormStep>('form');

  // Form fields
  const [incidentType, setIncidentType] = useState('Accident');
  const [incidentDate, setIncidentDate] = useState('2026-05-15');
  const [hospitalId, setHospitalId] = useState('BLR-PVT-003'); // Manipal Whitefield
  const [hospitalSearch, setHospitalSearch] = useState('Manipal Hospital, Whitefield');
  const [showDropdown, setShowDropdown] = useState(false);
  const [description, setDescription] = useState('Fell off scooter during delivery. Right arm fracture. Admitted to Manipal Hospital.');

  // FIR pre-uploaded in demo
  const [firUploaded] = useState(true);

  const selectedHospital = ALL_HOSPITALS.find(h => h.id === hospitalId);
  const tier = getTier(selectedHospital);

  const filteredHospitals = hospitalSearch.trim()
    ? ALL_HOSPITALS.filter(h => h.name.toLowerCase().includes(hospitalSearch.toLowerCase()) || h.area.toLowerCase().includes(hospitalSearch.toLowerCase()))
    : ALL_HOSPITALS;

  const handleHospitalSelect = (h: Hospital) => {
    setHospitalId(h.id);
    setHospitalSearch(h.name);
    setShowDropdown(false);
  };

  const handleReviewSubmit = () => {
    setFormStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    const newClaim = {
      id: CLAIM_ID,
      type: incidentType,
      date: incidentDate,
      hospital: selectedHospital?.name ?? hospitalSearch,
      submittedOn: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Awaiting Response',
    };
    const existing = JSON.parse(localStorage.getItem('gigshield_claims') || '[]');
    localStorage.setItem('gigshield_claims', JSON.stringify([newClaim, ...existing]));
    setFormStep('submitted');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Success Screen ─────────────────────────────────────────────────────────
  if (formStep === 'submitted') {
    return (
      <div className="min-h-screen px-4 pt-12 pb-8 flex flex-col items-center" style={{ background: '#F0FDF4' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: '#22C55E' }}>
          <CheckCircle size={48} style={{ color: '#FFFFFF' }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '24px', color: '#0F172A', marginTop: '20px', textAlign: 'center' }}>
          Claim Submitted Successfully!
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748B', marginTop: '8px', textAlign: 'center', lineHeight: 1.6 }}>
          Our team will contact you at +91-99999 99999 within 24 hours.
        </p>

        {/* Payout summary */}
        <div className="w-full max-w-sm mt-5 rounded-xl p-4" style={{ background: '#FFFFFF', border: '1px solid #BBF7D0' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#15803D', marginBottom: '10px' }}>
            Claim {CLAIM_ID} filed successfully.
          </p>
          <div className="flex justify-between mb-2">
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>PMSBY (ICICI Lombard)</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>
              {formatINR(200000)} · within 15 days
            </span>
          </div>
          <div className="flex justify-between mb-3">
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>GigShield Cash Top-Up</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#D97706', fontWeight: 600 }}>
              {formatINR(tier.gigshieldCashReimbursement)} · within 10 days
            </span>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B' }}>
            PMSBY claim forwarded to ICICI Lombard. GigShield Cash credited to your GigShield wallet.
          </p>
        </div>

        <div className="px-4 py-2 rounded-md mt-4" style={{ background: '#F0F9FF' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#0EA5E9' }}>
            Claim ID: {CLAIM_ID}
          </p>
        </div>
        <button
          onClick={() => navigate('/worker/insurance')}
          className="mt-6 px-12 rounded-xl"
          style={{ height: '48px', background: '#0EA5E9', color: '#FFFFFF', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', border: 'none', cursor: 'pointer' }}
        >
          View Claim History
        </button>
      </div>
    );
  }

  // ── Review / Verification Screen ───────────────────────────────────────────
  if (formStep === 'review') {
    return (
      <div className="min-h-screen pb-8" style={{ background: '#F8FAFC' }}>
        <div className="sticky top-0 bg-white border-b px-4 flex items-center z-10" style={{ height: '56px', borderColor: '#E2E8F0' }}>
          <button onClick={() => setFormStep('form')} className="mr-4">
            <ArrowLeft size={24} style={{ color: '#0F172A' }} />
          </button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '18px', color: '#0F172A' }}>
            Claim Verification
          </h1>
        </div>

        {/* Disclaimer */}
        <div className="px-4 py-2.5" style={{ background: '#FEF3C7', borderBottom: '2px solid #F59E0B' }}>
          <div className="flex items-start gap-2">
            <AlertTriangle size={15} style={{ color: '#D97706', flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '11px', color: '#92400E' }}>
              PROTOTYPE — Insurance underwritten by ICICI Lombard under PMSBY. GigShield Cash Reimbursement is a GigShield-specific top-up. Real claim processing in production.
            </p>
          </div>
        </div>

        <div className="px-4 pt-4 space-y-4">

          {/* Verification Steps Panel */}
          <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: '1px solid #E2E8F0' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '4px' }}>
              Claim Verification Status
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
              GigShield auto-verifies 4 of 6 steps. You only need to upload 1 document.
            </p>

            <div className="space-y-5">
              {VERIFICATION_STEPS.map((step, idx) => {
                const isComplete = step.status === 'COMPLETE';
                const isProgress = step.status === 'IN_PROGRESS';
                const isPending = step.status === 'PENDING';
                const circleColor = isComplete ? '#22C55E' : isProgress ? '#F59E0B' : '#E2E8F0';

                return (
                  <div key={step.id}>
                    <div className="flex items-start gap-3">
                      {/* Circle */}
                      <div
                        className="flex items-center justify-center flex-shrink-0"
                        style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: circleColor,
                          border: isPending ? '2px solid #E2E8F0' : 'none',
                        }}
                      >
                        {isComplete && (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2.5 7l3.5 3.5 5.5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                        {isProgress && (
                          <div className="w-3 h-3 rounded-full bg-white" />
                        )}
                        {isPending && (
                          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '11px', color: '#94A3B8' }}>
                            {step.step}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px', color: '#0F172A' }}>
                            {step.label}
                          </p>
                          {/* Status chip */}
                          {isComplete && (
                            <span className="px-2.5 py-0.5 rounded-full flex-shrink-0" style={{ background: '#F0FDF4', color: '#16A34A', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px', whiteSpace: 'nowrap' }}>
                              {step.autoVerified ? 'AUTO-VERIFIED ✓' : 'VERIFIED ✓'}
                            </span>
                          )}
                          {isProgress && (
                            <span className="px-2.5 py-0.5 rounded-full flex-shrink-0" style={{ background: '#FEF3C7', color: '#D97706', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px', whiteSpace: 'nowrap' }}>
                              IN PROGRESS
                            </span>
                          )}
                          {isPending && (
                            <span className="px-2.5 py-0.5 rounded-full flex-shrink-0" style={{ background: '#FFFFFF', color: '#EF4444', border: '1.5px solid #EF4444', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px', whiteSpace: 'nowrap' }}>
                              UPLOAD REQUIRED
                            </span>
                          )}
                        </div>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', marginTop: '2px', lineHeight: 1.4 }}>
                          {step.description}
                        </p>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                          via {step.source}
                        </p>

                        {/* FIR Upload Box */}
                        {step.uploadRequired && (
                          <div className="mt-3 rounded-lg p-4 flex flex-col items-center" style={{ border: '1.5px dashed #E2E8F0' }}>
                            {firUploaded ? (
                              <div className="flex items-center gap-2 w-full">
                                <CheckCircle size={18} style={{ color: '#22C55E', flexShrink: 0 }} />
                                <div className="flex-1">
                                  <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>
                                    FIR_Copy_15May2026.pdf
                                  </p>
                                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#22C55E' }}>
                                    Uploaded · Ready for submission
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <>
                                <Upload size={24} style={{ color: '#94A3B8', marginBottom: '6px' }} />
                                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#64748B' }}>
                                  Upload FIR / Police Report
                                </p>
                                <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                                  PDF, JPG — max 5 MB
                                </p>
                                <button
                                  className="mt-3 px-4 rounded-lg"
                                  style={{ height: '32px', border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '12px', color: '#0F172A', background: '#FFFFFF', cursor: 'pointer' }}
                                >
                                  Browse Files
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {idx < VERIFICATION_STEPS.length - 1 && (
                      <div className="ml-3.5 mt-2 mb-1 w-0.5" style={{ height: '12px', background: '#E2E8F0' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payout Preview */}
          <div className="rounded-xl p-4" style={{ background: '#F0FDF4', border: '1px solid #86EFAC' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12px', color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
              Estimated Payout
            </p>
            <div className="flex justify-between mb-2">
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>PMSBY Lump Sum (Accidental)</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px', color: '#16A34A' }}>{formatINR(200000)}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A' }}>GigShield Cash Reimbursement</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px', color: '#D97706' }}>{formatINR(tier.gigshieldCashReimbursement)}</span>
            </div>
            <div className="h-px mb-3" style={{ background: '#BBF7D0' }} />
            <div className="flex justify-between mb-1">
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: '#1A3C5E' }}>
                {formatINR(200000 + tier.gigshieldCashReimbursement)}
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B' }}>
              Disbursement: NEFT to SBI XXXX1234
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
              Expected: within {tier.settlementDays} working days of approval
            </p>
          </div>

          {/* Submit Claim button */}
          <button
            onClick={handleSubmit}
            disabled={!firUploaded}
            className="w-full rounded-xl"
            style={{
              height: '52px',
              background: firUploaded ? '#0EA5E9' : '#CBD5E1',
              color: '#FFFFFF',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '16px',
              border: 'none',
              cursor: firUploaded ? 'pointer' : 'not-allowed',
              marginBottom: '8px',
            }}
          >
            Submit Claim
          </button>
        </div>
      </div>
    );
  }

  // ── Form Screen ────────────────────────────────────────────────────────────
  return (
    <div data-tour-id="tour-worker-claim-page" className="min-h-screen" style={{ background: '#F8FAFC' }}>
      <div className="sticky top-0 bg-white border-b px-4 flex items-center z-10" style={{ height: '56px', borderColor: '#E2E8F0' }}>
        <button onClick={() => navigate('/worker/insurance')} className="mr-4">
          <ArrowLeft size={24} style={{ color: '#0F172A' }} />
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '18px', color: '#0F172A' }}>
          File a Claim
        </h1>
      </div>

      <div className="px-4 py-2.5" style={{ background: '#FEF3C7', borderBottom: '2px solid #F59E0B' }}>
        <div className="flex items-start gap-2">
          <AlertTriangle size={15} style={{ color: '#D97706', flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '11px', color: '#92400E' }}>
            PROTOTYPE — Insurance underwritten by ICICI Lombard under PMSBY. GigShield Cash Reimbursement is a GigShield-specific top-up. Worker pays Rs 0 premium.
          </p>
        </div>
      </div>

      <div className="px-4 pt-4 pb-8">

        {/* Type of Incident */}
        <div data-tour-id="tour-claim-incident-type" className="mb-4">
          <label style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A', display: 'block', marginBottom: '8px' }}>
            Type of Incident
          </label>
          <select
            value={incidentType}
            onChange={e => setIncidentType(e.target.value)}
            className="w-full px-3 rounded-lg outline-none"
            style={{ height: '48px', border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '14px', background: '#FFFFFF' }}
          >
            <option>Accident</option>
            <option>Disability</option>
            <option>Other</option>
          </select>
        </div>

        {/* Date of Incident */}
        <div className="mb-4">
          <label style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A', display: 'block', marginBottom: '8px' }}>
            Date of Incident
          </label>
          <input
            type="date"
            value={incidentDate}
            onChange={e => setIncidentDate(e.target.value)}
            className="w-full px-3 rounded-lg outline-none"
            style={{ height: '48px', border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '14px', background: '#FFFFFF' }}
          />
        </div>

        {/* Hospital Selector */}
        <div data-tour-id="tour-claim-hospital" className="mb-4">
          <label style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A', display: 'block', marginBottom: '8px' }}>
            Hospital / Clinic
          </label>
          <div className="relative">
            <input
              type="text"
              value={hospitalSearch}
              onChange={e => { setHospitalSearch(e.target.value); setShowDropdown(true); setHospitalId(''); }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search hospital by name or area…"
              className="w-full px-3 rounded-lg outline-none"
              style={{ height: '48px', border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '14px', background: '#FFFFFF' }}
            />
            {showDropdown && filteredHospitals.length > 0 && (
              <div
                className="absolute left-0 right-0 bg-white z-20 rounded-xl overflow-hidden overflow-y-auto"
                style={{ top: '52px', border: '1.5px solid #E2E8F0', maxHeight: '220px', boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}
              >
                {filteredHospitals.map(h => (
                  <button
                    key={h.id}
                    onMouseDown={() => handleHospitalSelect(h)}
                    className="w-full text-left px-4 py-3 flex items-start gap-3"
                    style={{ borderBottom: '1px solid #F1F5F9', background: 'transparent', cursor: 'pointer' }}
                  >
                    <span
                      className="flex-shrink-0 px-2 py-0.5 rounded-full mt-0.5"
                      style={
                        h.designation === 'TRAUMA_CENTRE'
                          ? { background: '#FEF2F2', color: '#EF4444', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px' }
                          : { background: '#F0FDF4', color: '#22C55E', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px' }
                      }
                    >
                      {h.designation === 'TRAUMA_CENTRE' ? 'TRAUMA' : 'NET.'}
                    </span>
                    <div>
                      <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>{h.name}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B' }}>{h.area}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hospital type info after selection */}
          {selectedHospital && (
            <div className="mt-2 px-3 py-2 rounded-lg flex items-center gap-2" style={{ background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
              <span
                className="px-2 py-0.5 rounded-full"
                style={
                  selectedHospital.designation === 'TRAUMA_CENTRE'
                    ? { background: '#EF4444', color: '#FFFFFF', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px' }
                    : { background: '#F0FDF4', color: '#22C55E', border: '1px solid #86EFAC', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px' }
                }
              >
                {selectedHospital.designation === 'TRAUMA_CENTRE' ? '🏥 TRAUMA CENTRE' : 'EMPANELLED'}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#0369A1' }}>
                Applicable: {tier.label} — GigShield Cash Top-Up: {formatINR(tier.gigshieldCashReimbursement)}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A', display: 'block', marginBottom: '8px' }}>
            Brief Description
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={300}
            rows={4}
            className="w-full px-3 py-2 rounded-lg outline-none resize-none"
            style={{ border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '14px', background: '#FFFFFF' }}
          />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8', textAlign: 'right', marginTop: '4px' }}>
            {description.length}/300
          </p>
        </div>

        {/* Emergency Contact */}
        <div className="mb-6">
          <label style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
            Emergency Contact
          </label>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>Pre-filled from profile</p>
          <input
            type="text"
            value="Sunita Yadav — +91-98765 43210"
            disabled
            className="w-full px-3 rounded-lg"
            style={{ height: '48px', border: '1.5px solid #E2E8F0', fontFamily: 'var(--font-body)', fontSize: '14px', background: '#F8FAFC', color: '#64748B' }}
          />
        </div>

        {/* Review & Submit */}
        <button
          data-tour-id="tour-claim-submit"
          onClick={handleReviewSubmit}
          className="w-full rounded-xl"
          style={{
            height: '52px',
            background: '#0EA5E9',
            color: '#FFFFFF',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Review & Submit →
        </button>
      </div>
    </div>
  );
}
