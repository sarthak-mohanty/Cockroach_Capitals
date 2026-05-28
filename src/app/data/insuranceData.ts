// ─────────────────────────────────────────────────────────────────────────────
// GigShield — Insurance Data
// Real government-empanelled hospital lists (Bengaluru + Jaipur)
// PMSBY + GigShield Cash Reimbursement tiers
// ─────────────────────────────────────────────────────────────────────────────

export type HospitalDesignation = 'TRAUMA_CENTRE' | 'EMPANELLED';
export type VerificationStatus = 'COMPLETE' | 'IN_PROGRESS' | 'PENDING';

export interface Hospital {
  id: string;
  name: string;
  type: string;
  designation: HospitalDesignation;
  address: string;
  area: string;
  phone: string;
  empanelledUnder: string[];
  specialities: string[];
  beds: number;
  icu: boolean;
  open24x7: boolean;
  cashless: boolean;
  govtVerified: boolean;
  pmjayCode: string;
  distanceFromCity: string;
  tag: string;
}

export interface VerificationStep {
  id: string;
  step: number;
  label: string;
  description: string;
  status: VerificationStatus;
  autoVerified: boolean;
  source: string;
  uploadRequired?: boolean;
}

export interface TimelineStep {
  label: string;
  date: string;
  done: boolean;
}

/** Indian number formatting — Rs 2,10,000 */
export const formatINR = (amount: number): string =>
  `Rs ${amount.toLocaleString('en-IN')}`;

// ─── Empanelment badge colours ────────────────────────────────────────────────
export const SCHEME_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  'AB-PMJAY':  { bg: '#1A3C5E', text: '#FFFFFF', label: 'AB-PMJAY' },
  'AB-MGRSBY': { bg: '#0F4C81', text: '#FFFFFF', label: 'AB-MGRSBY' },
  'CGHS':      { bg: '#0EA5E9', text: '#FFFFFF', label: 'CGHS' },
  'ESIC':      { bg: '#22C55E', text: '#FFFFFF', label: 'ESIC' },
  'RGHS':      { bg: '#7C3AED', text: '#FFFFFF', label: 'RGHS' },
  'PMNRF':     { bg: '#EA580C', text: '#FFFFFF', label: 'PMNRF' },
  'GigShield': { bg: '#0EA5E9', text: '#FFFFFF', label: 'GigShield ✓' },
};

// ─── Bengaluru Hospital Network ───────────────────────────────────────────────
export const BENGALURU_HOSPITALS: Hospital[] = [
  // ── GOVERNMENT / TRAUMA CENTRES ──
  {
    id: 'BLR-GOV-001',
    name: 'Victoria Hospital',
    type: 'Government',
    designation: 'TRAUMA_CENTRE',
    address: 'K.R. Road, Fort, Bengaluru, Karnataka 560002',
    area: 'KR Road / Fort',
    phone: '080-2670-1150',
    empanelledUnder: ['AB-PMJAY', 'ESIC', 'CGHS', 'GigShield'],
    specialities: ['Trauma & Emergency', 'Orthopaedics', 'Neurosurgery', 'General Surgery'],
    beds: 1200,
    icu: true,
    open24x7: true,
    cashless: true,
    govtVerified: true,
    pmjayCode: 'KA-GOV-0012',
    distanceFromCity: 'City centre',
    tag: "South India's first govt organ retrieval centre",
  },
  {
    id: 'BLR-GOV-002',
    name: 'Bowring & Lady Curzon Hospital',
    type: 'Government',
    designation: 'TRAUMA_CENTRE',
    address: 'Shivaji Nagar, Bengaluru, Karnataka 560001',
    area: 'Shivaji Nagar',
    phone: '080-2286-5051',
    empanelledUnder: ['AB-PMJAY', 'ESIC', 'GigShield'],
    specialities: ['Trauma & Emergency', 'General Medicine', 'Orthopaedics', 'Paediatrics'],
    beds: 860,
    icu: true,
    open24x7: true,
    cashless: true,
    govtVerified: true,
    pmjayCode: 'KA-GOV-0034',
    distanceFromCity: 'Central Bengaluru',
    tag: 'Est. 1868 — Teaching hospital, BMCRI',
  },
  {
    id: 'BLR-GOV-003',
    name: 'Sanjay Gandhi Institute of Trauma & Orthopaedics',
    type: 'Government-Aided',
    designation: 'TRAUMA_CENTRE',
    address: 'Byrasandra, Jayanagar East, Bengaluru 560011',
    area: 'Jayanagar',
    phone: '080-2654-1747',
    empanelledUnder: ['PMNRF', 'AB-PMJAY', 'GigShield'],
    specialities: ['Trauma Surgery', 'Orthopaedics', 'Spine Surgery', 'Emergency Care'],
    beds: 400,
    icu: true,
    open24x7: true,
    cashless: true,
    govtVerified: true,
    pmjayCode: 'KA-GOV-0089',
    distanceFromCity: 'South Bengaluru',
    tag: 'Dedicated trauma & orthopaedics institute',
  },
  // ── PRIVATE EMPANELLED ──
  {
    id: 'BLR-GOV-004',
    name: 'ESI Hospital, Rajajinagar',
    type: 'Government (ESIC)',
    designation: 'EMPANELLED',
    address: 'Rajajinagar, Bengaluru, Karnataka 560010',
    area: 'Rajajinagar',
    phone: '080-2337-2071',
    empanelledUnder: ['ESIC', 'GigShield'],
    specialities: ['General Medicine', 'Surgery', 'Emergency Care'],
    beds: 310,
    icu: true,
    open24x7: true,
    cashless: true,
    govtVerified: true,
    pmjayCode: 'KA-ESIC-0007',
    distanceFromCity: 'West Bengaluru',
    tag: 'ESIC — Ministry of Labour & Employment',
  },
  {
    id: 'BLR-PVT-001',
    name: 'Narayana Health City',
    type: 'Private',
    designation: 'EMPANELLED',
    address: 'Bommasandra Industrial Area, Anekal Taluk, Bengaluru 562158',
    area: 'Bommasandra / Electronic City',
    phone: '080-7122-2222',
    empanelledUnder: ['AB-PMJAY', 'PMNRF', 'GigShield'],
    specialities: ['Cardiology', 'Cardiac Surgery', 'Oncology', 'Orthopaedics'],
    beds: 3000,
    icu: true,
    open24x7: true,
    cashless: true,
    govtVerified: true,
    pmjayCode: 'KA-PVT-0218',
    distanceFromCity: '20 km from city centre',
    tag: "World's largest cardiac care hospital",
  },
  {
    id: 'BLR-PVT-002',
    name: "St. John's Medical College Hospital",
    type: 'Private (Aided)',
    designation: 'EMPANELLED',
    address: "No. 69, St. John's Church Road, Koramangala, Bengaluru 560034",
    area: 'Koramangala',
    phone: '080-2206-5000',
    empanelledUnder: ['AB-PMJAY', 'PMNRF', 'CGHS', 'GigShield'],
    specialities: ['Emergency Medicine', 'Trauma', 'Neurology', 'Oncology'],
    beds: 1250,
    icu: true,
    open24x7: true,
    cashless: true,
    govtVerified: true,
    pmjayCode: 'KA-PVT-0041',
    distanceFromCity: 'South Bengaluru',
    tag: 'NABH accredited — Ministry of Health empanelled',
  },
  {
    id: 'BLR-PVT-003',
    name: 'Manipal Hospital, Whitefield',
    type: 'Private',
    designation: 'EMPANELLED',
    address: 'ITPL Main Road, Whitefield, Bengaluru 560048',
    area: 'Whitefield / East Bengaluru',
    phone: '080-2502-4444',
    empanelledUnder: ['AB-PMJAY', 'GigShield'],
    specialities: ['Emergency', 'Orthopaedics', 'Neurology', 'Cardiology'],
    beds: 600,
    icu: true,
    open24x7: true,
    cashless: true,
    govtVerified: true,
    pmjayCode: 'KA-PVT-0312',
    distanceFromCity: 'East Bengaluru — 18 km',
    tag: 'Nearest major hospital to tech corridor',
  },
  {
    id: 'BLR-PVT-004',
    name: 'Vydehi Institute of Medical Sciences',
    type: 'Private',
    designation: 'EMPANELLED',
    address: '82, EPIP Area, Whitefield, Bengaluru 560066',
    area: 'Whitefield',
    phone: '080-2841-5757',
    empanelledUnder: ['PMNRF', 'AB-PMJAY', 'GigShield'],
    specialities: ['General Medicine', 'Surgery', 'Emergency', 'Orthopaedics'],
    beds: 1000,
    icu: true,
    open24x7: true,
    cashless: true,
    govtVerified: true,
    pmjayCode: 'KA-PVT-0445',
    distanceFromCity: 'East Bengaluru',
    tag: 'Teaching hospital — PMNRF empanelled',
  },
];

// ─── Jaipur Hospital Network ──────────────────────────────────────────────────
export const JAIPUR_HOSPITALS: Hospital[] = [
  // ── GOVERNMENT / TRAUMA CENTRES ──
  {
    id: 'JAI-GOV-001',
    name: 'Sawai Man Singh (SMS) Hospital',
    type: 'Government',
    designation: 'TRAUMA_CENTRE',
    address: 'S.M.S. Hospital Road, Near Ajmeri Gate, Jaipur, Rajasthan 302001',
    area: 'Ajmeri Gate, Central Jaipur',
    phone: '0141-256-0291',
    empanelledUnder: ['AB-PMJAY', 'CGHS', 'RGHS', 'AB-MGRSBY', 'GigShield'],
    specialities: ['Trauma & Emergency', 'Cardiothoracic Surgery', 'Neurology', 'Oncology'],
    beds: 6251,
    icu: true,
    open24x7: true,
    cashless: true,
    govtVerified: true,
    pmjayCode: 'RJ-GOV-0001',
    distanceFromCity: 'City centre — near Sindhi Camp Metro',
    tag: 'Largest public hospital in Rajasthan — 3.2M+ outpatients/year',
  },
  {
    id: 'JAI-GOV-002',
    name: 'Jaipuria Hospital',
    type: 'Government',
    designation: 'TRAUMA_CENTRE',
    address: 'Lal Kothi, Tonk Road, Jaipur, Rajasthan 302015',
    area: 'Lal Kothi / Tonk Road',
    phone: '0141-274-0426',
    empanelledUnder: ['AB-PMJAY', 'RGHS', 'AB-MGRSBY', 'GigShield'],
    specialities: ['General Medicine', 'Surgery', 'Emergency', 'Orthopaedics', 'Gynaecology'],
    beds: 520,
    icu: true,
    open24x7: true,
    cashless: true,
    govtVerified: true,
    pmjayCode: 'RJ-GOV-0014',
    distanceFromCity: 'South Jaipur',
    tag: 'AB-MGRSBY & RGHS empanelled government hospital',
  },
  {
    id: 'JAI-GOV-003',
    name: 'JK Lon Hospital (Children\'s Hospital)',
    type: 'Government',
    designation: 'EMPANELLED',
    address: 'S.M.S. Medical College Campus, Jaipur, Rajasthan 302004',
    area: 'SMS Medical College Campus',
    phone: '0141-256-1012',
    empanelledUnder: ['AB-PMJAY', 'RGHS', 'GigShield'],
    specialities: ['Paediatrics', 'Neonatology', 'PICU', 'Paediatric Surgery'],
    beds: 700,
    icu: true,
    open24x7: true,
    cashless: true,
    govtVerified: true,
    pmjayCode: 'RJ-GOV-0022',
    distanceFromCity: 'Central Jaipur — SMS campus',
    tag: 'Largest paediatric government hospital in Rajasthan',
  },
  // ── PRIVATE EMPANELLED ──
  {
    id: 'JAI-PVT-001',
    name: 'Fortis Escorts Hospital',
    type: 'Private',
    designation: 'EMPANELLED',
    address: 'Jawaharlal Nehru Marg, Malviya Nagar, Jaipur, Rajasthan 302017',
    area: 'Malviya Nagar',
    phone: '0141-254-7000',
    empanelledUnder: ['AB-PMJAY', 'CGHS', 'GigShield'],
    specialities: ['Cardiology', 'Cardiac Surgery', 'Emergency', 'Orthopaedics'],
    beds: 450,
    icu: true,
    open24x7: true,
    cashless: true,
    govtVerified: true,
    pmjayCode: 'RJ-PVT-0087',
    distanceFromCity: 'South Jaipur — 8 km',
    tag: 'NABH accredited — CGHS & AB-PMJAY empanelled',
  },
  {
    id: 'JAI-PVT-002',
    name: 'Mahatma Gandhi Hospital (NIMS)',
    type: 'Private University',
    designation: 'EMPANELLED',
    address: 'Shobha Nagar, Sitapura Industrial Area, Jaipur, Rajasthan 302022',
    area: 'Sitapura',
    phone: '0141-271-4100',
    empanelledUnder: ['AB-MGRSBY', 'AB-PMJAY', 'GigShield'],
    specialities: ['Multi-Speciality', 'Trauma', 'Emergency', 'General Surgery'],
    beds: 1500,
    icu: true,
    open24x7: true,
    cashless: true,
    govtVerified: true,
    pmjayCode: 'RJ-PVT-0134',
    distanceFromCity: 'Southeast Jaipur — 14 km',
    tag: 'AB-MGRSBY empanelled — Mahatma Gandhi Ayushman Arogya Yojana',
  },
  {
    id: 'JAI-PVT-003',
    name: 'Eternal Hospital',
    type: 'Private',
    designation: 'EMPANELLED',
    address: '6, Jawahar Nagar, Near Gyan Vihar University, Jaipur, Rajasthan 302004',
    area: 'Jawahar Nagar',
    phone: '0141-407-0000',
    empanelledUnder: ['CGHS', 'AB-PMJAY', 'GigShield'],
    specialities: ['Cardiology', 'Cardiac Surgery', 'Orthopaedics', 'Neurosurgery'],
    beds: 350,
    icu: true,
    open24x7: true,
    cashless: true,
    govtVerified: true,
    pmjayCode: 'RJ-PVT-0201',
    distanceFromCity: 'North Jaipur',
    tag: 'CGHS empanelled cardiac care centre',
  },
  {
    id: 'JAI-PVT-004',
    name: 'Santokba Durlabhji Memorial Hospital',
    type: 'Private',
    designation: 'EMPANELLED',
    address: 'Bhawani Singh Marg, Jaipur, Rajasthan 302015',
    area: 'C-Scheme',
    phone: '0141-256-6251',
    empanelledUnder: ['AB-PMJAY', 'CGHS', 'RGHS', 'GigShield'],
    specialities: ['Multi-Speciality', 'Oncology', 'Neurology', 'Orthopaedics'],
    beds: 500,
    icu: true,
    open24x7: true,
    cashless: true,
    govtVerified: true,
    pmjayCode: 'RJ-PVT-0298',
    distanceFromCity: 'Central Jaipur — C-Scheme',
    tag: "CGHS & RGHS empanelled — one of Jaipur's oldest private hospitals",
  },
];

// ─── Reimbursement Tiers ──────────────────────────────────────────────────────
export const REIMBURSEMENT_TIERS = {
  traumaCentre: {
    label: 'Govt. Trauma Centre',
    baseInsurance: 200000,
    partialDisability: 100000,
    gigshieldCashReimbursement: 15000,
    cashlessAt: 'All govt. trauma centres — fully cashless',
    settlementDays: 15,
  },
  empanelledPrivate: {
    label: 'Empanelled Private Hospital',
    baseInsurance: 200000,
    partialDisability: 100000,
    gigshieldCashReimbursement: 10000,
    cashlessAt: 'Cashless at network hospitals — co-pay 0% for gig workers',
    settlementDays: 21,
  },
  nonEmpanelled: {
    label: 'Non-Network Hospital',
    baseInsurance: 200000,
    partialDisability: 100000,
    gigshieldCashReimbursement: 5000,
    cashlessAt: 'Reimbursement only — submit bills within 30 days',
    settlementDays: 30,
  },
};

// ─── Verification Steps ───────────────────────────────────────────────────────
export const VERIFICATION_STEPS: VerificationStep[] = [
  {
    id: 'V1',
    step: 1,
    label: 'GigShield ID Verified',
    description: 'Your GigShield ID (GS-2024-0847291) is verified against e-Shram UAN 12-3456-7890-1234.',
    status: 'COMPLETE',
    autoVerified: true,
    source: 'e-Shram API',
  },
  {
    id: 'V2',
    step: 2,
    label: 'Active Delivery on Accident Date',
    description: 'Swiggy delivery log confirms active ride at 2:15 PM on 15 May 2026 — consistent with incident time.',
    status: 'COMPLETE',
    autoVerified: true,
    source: 'Swiggy Platform API',
  },
  {
    id: 'V3',
    step: 3,
    label: 'Hospital Admission Verified',
    description: 'Manipal Hospital, Whitefield — Empanelled under GigShield network (KA-PVT-0312). Admission confirmed.',
    status: 'COMPLETE',
    autoVerified: false,
    source: 'Hospital Network API (GigShield)',
  },
  {
    id: 'V4',
    step: 4,
    label: 'FIR / Police Report',
    description: 'Upload police report or FIR copy. Mandatory for PMSBY claim processing.',
    status: 'PENDING',
    autoVerified: false,
    source: 'Manual Upload Required',
    uploadRequired: true,
  },
  {
    id: 'V5',
    step: 5,
    label: 'Bank Account Verification',
    description: 'NEFT transfer to SBI XXXX1234 on approval. Account pre-verified from GigShield wallet.',
    status: 'COMPLETE',
    autoVerified: true,
    source: 'GigShield Wallet (pre-verified)',
  },
  {
    id: 'V6',
    step: 6,
    label: 'PMSBY Claim Forwarded to Insurer',
    description: 'Claim forwarded to ICICI Lombard (PMSBY underwriter) for final approval. Expected: 15 working days.',
    status: 'IN_PROGRESS',
    autoVerified: false,
    source: 'ICICI Lombard PMSBY Portal',
  },
];

// ─── Active Claim ─────────────────────────────────────────────────────────────
export const ACTIVE_CLAIM = {
  claimId: 'CLM-2024-00391',
  filedDate: '15 May 2026',
  incidentDate: '15 May 2026',
  incidentDescription:
    'Fell off scooter during Swiggy delivery. Right arm fracture. Admitted to Manipal Hospital, Whitefield.',
  hospital: 'Manipal Hospital, Whitefield',
  hospitalType: 'empanelledPrivate',
  status: 'PROCESSING',
  statusTimeline: [
    { label: 'Claim Filed', date: '15 May 2026, 4:30 PM', done: true },
    { label: 'GigShield Verification', date: '15 May 2026, 4:35 PM', done: true },
    { label: 'Insurer Notified (ICICI Lombard)', date: '16 May 2026, 9:00 AM', done: true },
    { label: 'Documents Verified', date: 'Pending — FIR upload required', done: false },
    { label: 'Claim Approved & Amount Disbursed', date: 'Expected by 6 Jun 2026', done: false },
  ] as TimelineStep[],
  expectedPayout: {
    pmsby: 200000,
    gigshieldCash: 10000,
    total: 210000,
    disbursementAccount: 'SBI XXXX1234',
    disbursementMode: 'NEFT',
  },
};
