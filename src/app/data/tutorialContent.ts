// tutorialContent.ts — EDITABLE CONSTANTS for all three Guided Tours
// ─────────────────────────────────────────────────────────────────────────────
//
// This file is the single source of truth for every word the user sees during
// the guided walkthrough across every portal. Edit freely — no component code
// needs to change when you update copy here.
//
// Conventions
//   route      : exact pathname the element lives on — the overlay navigates
//                there automatically before spotlighting the target.
//   targetId   : value of the `data-tour-id` attribute on the DOM element.
//   hint       : optional footnote shown in italic.
// ─────────────────────────────────────────────────────────────────────────────

export type TourType = 'worker' | 'platform-admin' | 'super-admin';

export interface TourStep {
  id: string;       // unique key
  targetId: string; // value of data-tour-id on the target DOM element
  route: string;    // pathname this element lives on
  emoji: string;    // decorative emoji shown in the tooltip card
  title: string;    // bold headline
  body: string;     // 1–2 sentence explanation shown to the user
  hint?: string;    // optional dimmer footnote
}

// ── Prompt modals ─────────────────────────────────────────────────────────────
export const TOUR_PROMPTS: Record<TourType, {
  title: string; subtitle: string; note: string; yesLabel: string; noLabel: string;
}> = {
  worker: {
    title: 'Welcome to GigShield! 👋',
    subtitle: 'Want a guided tour of your dashboard? We explain every feature and what it means for your rights.',
    note: 'Takes about 3 minutes',
    yesLabel: 'Yes, show me around',
    noLabel: 'Skip for now',
  },
  'platform-admin': {
    title: 'Welcome, Platform Admin! 🏢',
    subtitle: "Take a detailed tour of your GigShield panel — we'll walk through every screen, every button, and every PWFVS obligation.",
    note: 'About 4 minutes',
    yesLabel: 'Yes, start the tour',
    noLabel: 'Skip for now',
  },
  'super-admin': {
    title: 'GigShield Control Centre 🛡️',
    subtitle: "Full guided walkthrough of the super-admin panel — every KPI, every config lever, and the regulatory foundation behind each one.",
    note: 'About 3 minutes',
    yesLabel: 'Yes, walk me through',
    noLabel: 'Skip for now',
  },
};

// ── Completion cards ──────────────────────────────────────────────────────────
export const TOUR_COMPLETE: Record<TourType, {
  emoji: string; title: string; body: string; ctaLabel: string;
}> = {
  worker: {
    emoji: '🎉',
    title: "You're all set!",
    body: 'You now know your way around GigShield. Every delivery you complete is building your welfare fund, your insurance cover, and your credit score — automatically, for free.',
    ctaLabel: "Let's go →",
  },
  'platform-admin': {
    emoji: '✅',
    title: 'Tour complete!',
    body: "You've seen every tool in the platform admin panel. Your PWFVS compliance is fully automated — register workers, monitor contributions, and generate reports with confidence.",
    ctaLabel: 'Go to Dashboard →',
  },
  'super-admin': {
    emoji: '🛡️',
    title: 'Full overview done!',
    body: "You've toured the entire GigShield control centre — every KPI, every config lever, and the audit trail that protects you in any regulatory review.",
    ctaLabel: 'Back to Dashboard →',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// WORKER TOUR  (mobile app — 23 steps)
// Home (8) → Wallet (5) → Loan (4) → Claim (3) → Insurance (2) → Profile (1)
// ─────────────────────────────────────────────────────────────────────────────
export const WORKER_STEPS: TourStep[] = [
  // ── Home screen ──────────────────────────────────────────────────────────
  {
    id: 'w-header',
    targetId: 'tour-header',
    route: '/worker/home',
    emoji: '🏠',
    title: 'Your GigShield Identity',
    body: 'Welcome, Raju! This header shows your name and GigShield account. The EN | हिं toggle switches the entire app between English and Hindi — regional language support is built in from day one.',
    hint: 'GigShield auto-generates a portable Worker ID (GSID) the moment you are registered by any platform. This ID follows you across every app you work for — Swiggy, Blinkit, Ola, and beyond.',
  },
  {
    id: 'w-wallet',
    targetId: 'tour-wallet',
    route: '/worker/home',
    emoji: '💳',
    title: 'Tap Your Wallet Card',
    body: 'This card shows your total GigShield balance: Rs 1,840. Every delivery you complete, your platform automatically contributes 2% of your earnings into this fund. You never see a deduction from your payout — the platform pays on top.',
    hint: 'PWFVS (Platform Workers Fund and Verification Scheme) mandates platforms to deposit a percentage of each gig payment into your portable welfare fund. GigShield is the infrastructure layer that makes this real and auditable.',
  },
  {
    id: 'w-earnings',
    targetId: 'tour-earnings',
    route: '/worker/home',
    emoji: '📊',
    title: 'Your Verified Monthly Earnings',
    body: 'You earned Rs 24,200 this month across three apps — Swiggy Rs 8,400, Blinkit Rs 6,200, and Ola Rs 9,600. GigShield aggregates your income from every platform into one verified record that no single app can see or control.',
    hint: 'This multi-platform income record is your most powerful financial asset. It is used to calculate loan eligibility and is submitted to the Karnataka Labour Department for ESIC (Employees State Insurance Corporation) registration on your behalf.',
  },
  {
    id: 'w-insurance',
    targetId: 'tour-insurance',
    route: '/worker/home',
    emoji: '🛡️',
    title: 'Insurance Shield — Active ✓',
    body: 'Your policy is ACTIVE. You are covered for up to Rs 2,10,000: Rs 2,00,000 under PMSBY (Pradhan Mantri Suraksha Bima Yojana) from ICICI Lombard for accidental death or disability, plus a Rs 10,000 GigShield cash top-up. You pay Rs 0 premium.',
    hint: 'Under PWFVS, platforms must fund accident insurance for all registered gig workers. PMSBY is the government scheme providing this cover — GigShield handles enrollment and the extra cash layer so you are protected from day one of your first delivery.',
  },
  {
    id: 'w-retirement',
    targetId: 'tour-home-retirement',
    route: '/worker/home',
    emoji: '🏦',
    title: 'Your Retirement Fund — Growing',
    body: 'GigShield allocates a portion of each contribution to your long-term retirement savings. You have already accumulated Rs 3,200 — growing every month, automatically, with no action required from you.',
    hint: 'PWFVS guidelines require platforms to contribute to both short-term worker welfare (insurance, emergency loans) and long-term social security (pension savings). Think of this as a portable NPS-equivalent built for the gig economy.',
  },
  {
    id: 'w-quick-actions',
    targetId: 'tour-quick-actions',
    route: '/worker/home',
    emoji: '⚡',
    title: 'Quick Actions — 3 Power Buttons',
    body: 'Three one-tap shortcuts to your most important tools: File Claim (had an accident? start here), Apply for Loan (your income is your collateral), and View History (every delivery contribution, on record).',
    hint: 'These three actions represent the three pillars of gig worker protection under PWFVS: emergency insurance (safety net), formal credit (financial mobility), and transparent income records (your auditable proof of work).',
  },
  {
    id: 'w-profile-banner',
    targetId: 'tour-home-profile-banner',
    route: '/worker/home',
    emoji: '📋',
    title: 'Complete Profile → Unlock Loans',
    body: 'Your profile is 60% complete. Adding your bank account and PAN takes 2 minutes and unlocks loan pre-approval up to Rs 45,000. The progress bar tracks exactly what is missing.',
    hint: 'GigShield performs a soft credit check with NBFC partners using your PAN and income history. Soft checks do not affect your CIBIL score — they use GigShield income data in place of the salary slip that traditional banks require.',
  },
  {
    id: 'w-bottom-nav',
    targetId: 'tour-bottom-nav',
    route: '/worker/home',
    emoji: '🗺️',
    title: 'Your 5-Tab Navigation Bar',
    body: 'The bar at the bottom is your main navigation: Home (this dashboard), Wallet (contributions and history), Loans (credit access), Insurance (cover and claims), and Profile (your identity and documents).',
    hint: 'All five tabs are designed to work offline in the production app. Your contribution data syncs when you reconnect — critical for delivery workers in areas with poor network coverage.',
  },

  // ── Wallet screen ─────────────────────────────────────────────────────────
  {
    id: 'w-wallet-page',
    targetId: 'tour-worker-wallet-page',
    route: '/worker/wallet',
    emoji: '💰',
    title: 'Your Contribution Ledger',
    body: 'The Wallet screen is your financial ledger — every delivery shows what you earned and what your platform contributed to your fund. The Rs 1,840 balance is money you can withdraw, use for insurance, or keep growing.',
    hint: 'This ledger is tamper-proof and timestamped. PWFVS gives workers the legal right to access their own contribution records at any time — this screen makes that right visible and actionable.',
  },
  {
    id: 'w-wallet-summary',
    targetId: 'tour-wallet-summary',
    route: '/worker/wallet',
    emoji: '📅',
    title: 'Today / This Week / This Month',
    body: 'Three summary tiles show how much your platforms contributed today (Rs 28), this week (Rs 187), and this month (Rs 484). These are the 2% contributions from your platforms — separate from your delivery payouts.',
    hint: 'The 2% contribution rate is set by PWFVS as the minimum floor. It flows directly into your GigShield wallet after every delivery and cannot be withheld or clawed back by any platform, even if you stop working for them.',
  },
  {
    id: 'w-wallet-filters',
    targetId: 'tour-wallet-filters',
    route: '/worker/wallet',
    emoji: '🔍',
    title: 'Filter by Platform or Date',
    body: 'Use the two dropdowns to filter transactions by platform (Swiggy, Blinkit, or Ola) or date range (Today, This Week, This Month, Last 3 Months). Tap the × chip to clear a filter instantly.',
    hint: 'Filtering by platform is useful when disputing a missed contribution. You can show exactly how many Swiggy deliveries you completed and cross-check with your platform payout statement — GigShield has the independent record.',
  },
  {
    id: 'w-wallet-transactions',
    targetId: 'tour-wallet-transactions',
    route: '/worker/wallet',
    emoji: '📋',
    title: 'Live Transaction Feed ●',
    body: 'Each row shows one delivery: which platform, how much you earned (Rs 80–120), and the green contribution amount (Rs 1.60–2.40). The green text confirms that 2% reached your fund for that delivery.',
    hint: 'If a delivery contribution is missing, you can raise a dispute through the platform admin. GigShield logs every transaction on your behalf — you are never dependent on the platform to prove what you earned.',
  },
  {
    id: 'w-wallet-download',
    targetId: 'tour-wallet-download',
    route: '/worker/wallet',
    emoji: '📄',
    title: 'Download Your Statement',
    body: "Tap 'Download Statement' to get a PDF of your full contribution history. This document is accepted by banks, NBFCs, and government offices as a formal income certificate — equivalent to a bank passbook.",
    hint: 'Your GigShield statement is the income proof that traditional banks have always demanded but gig workers have never had. NBFCs use it in lieu of a salary slip or ITR when processing your loan application.',
  },

  // ── Loan screen ───────────────────────────────────────────────────────────
  {
    id: 'w-loan-page',
    targetId: 'tour-worker-loan-page',
    route: '/worker/loan',
    emoji: '🤝',
    title: 'Micro-Loans — Your Income is Collateral',
    body: "The Loans tab shows your GigShield credit profile. Because your income is verified across three platforms over 18 months, you're pre-approved for up to Rs 45,000 with zero paperwork — no salary slip, no employer letter needed.",
    hint: 'Traditional banks reject 90% of gig worker loan applications because income is unverifiable. GigShield creates the income verification layer that RBI-regulated NBFCs can trust — this screen is that breakthrough made real.',
  },
  {
    id: 'w-loan-income',
    targetId: 'tour-loan-income-card',
    route: '/worker/loan',
    emoji: '✅',
    title: 'GigShield Verified Income Card',
    body: "Your verified income is Rs 25,000/month, drawn from 18 months of history across 3 platforms. Your GigShield Trust Score is 742/900 — an income-based score used by NBFC partners to assess creditworthiness.",
    hint: 'The Trust Score considers income consistency (no long gaps), platform diversity (multi-platform workers are more stable income earners), and history length. A score of 742 puts Raju in the top 40% of GigShield workers.',
  },
  {
    id: 'w-loan-preapproval',
    targetId: 'tour-loan-preapproval',
    route: '/worker/loan',
    emoji: '🎉',
    title: "You're Pre-Approved! ₹45,000",
    body: "Rs 45,000 is your pre-approved credit limit — that's 1.8× your monthly income, the NBFC industry standard for micro-loan sizing. The 'See offers below ↓' button scrolls to your NBFC partner options.",
    hint: 'This pre-approval uses a soft credit pull — no hard inquiry, no CIBIL score impact. When you formally apply, the NBFC uses your GigShield income certificate instead of the traditional ITR or Form 16.',
  },
  {
    id: 'w-loan-offers',
    targetId: 'tour-loan-offers',
    route: '/worker/loan',
    emoji: '🏦',
    title: 'Three NBFC Partner Offers',
    body: 'Three RBI-regulated NBFC partners with pre-filled offers: KreditBee (Rs 45,000, 14% p.a., BEST MATCH), MoneyTap (Rs 30,000, 16%), and Stashfin (Rs 20,000, 18%). Tap Apply → on any to begin the formal application.',
    hint: 'All three are RBI-regulated Non-Banking Financial Companies. The BEST MATCH badge means KreditBee offered the largest loan at the lowest rate for your Trust Score. Repayments are deducted automatically from future delivery earnings — no EMI tracking needed.',
  },
  {
    id: 'w-loan-explainer',
    targetId: 'tour-loan-explainer',
    route: '/worker/loan',
    emoji: '📐',
    title: "Tap 'How Was This Calculated?' to Expand",
    body: 'This accordion reveals the four eligibility criteria: 18 months verified history, cross-platform aggregation, no single employer needed, and a 1.8× income multiplier. PWFVS mandates that eligibility criteria must be disclosed to workers.',
    hint: 'Gig workers have historically been ineligible for formal credit because income was unverifiable. GigShield income aggregation plus NBFC partnership solves this gap — this explainer section shows the calculation transparently, as required by law.',
  },

  // ── Claim form screen ─────────────────────────────────────────────────────
  {
    id: 'w-claim-page',
    targetId: 'tour-worker-claim-page',
    route: '/worker/claim',
    emoji: '🏥',
    title: 'File an Insurance Claim',
    body: 'This form triggers your PMSBY coverage after any on-the-job accident. GigShield auto-verifies 4 of 6 required steps — you only need to provide incident details and, if applicable, upload an FIR. No hospital paperwork needed upfront.',
    hint: 'PMSBY (Pradhan Mantri Suraksha Bima Yojana) is the government-backed accidental insurance scheme. GigShield handles enrollment under PMSBY automatically when you are registered — you never need to sign up separately.',
  },
  {
    id: 'w-claim-hospital',
    targetId: 'tour-claim-hospital',
    route: '/worker/claim',
    emoji: '🏨',
    title: 'Search Your Hospital Network',
    body: "Type to search for the hospital where you were treated. 'Trauma Centre' hospitals (red badge) get priority processing and larger GigShield cash. 'Empanelled' hospitals offer fully cashless treatment under PMSBY — you pay Rs 0 at the desk.",
    hint: 'GigShield covers 374+ hospitals in Bengaluru alone under AB-PMJAY empanelment. If you go to a non-network hospital in an emergency, you can still file a claim — but reimbursement takes longer and requires more documentation.',
  },
  {
    id: 'w-claim-submit',
    targetId: 'tour-claim-submit',
    route: '/worker/claim',
    emoji: '📤',
    title: "Tap 'Review & Submit →'",
    body: "Tapping this button shows you the full verification status page. GigShield has already verified your registration, platform history, and hospital network status automatically. Your claim is acknowledged within 24 hours under PWFVS.",
    hint: 'The 24-hour response commitment is a PWFVS mandate — not a courtesy. GigShield monitors response times and automatically escalates any claim that is not acknowledged within the deadline. You are notified instantly.',
  },

  // ── Insurance screen ──────────────────────────────────────────────────────
  {
    id: 'w-insurance-coverage',
    targetId: 'tour-insurance-coverage',
    route: '/worker/insurance',
    emoji: '🛡️',
    title: 'Your Full Coverage Breakdown',
    body: 'Three protection layers: (1) Rs 2,00,000 PMSBY lump sum for accidental death or permanent disability. (2) Rs 1,00,000 for partial disability. (3) Up to Rs 10,000 GigShield cash for transport, daily allowance, and medicines. All funded by your platform.',
    hint: "The GigShield cash layer is what makes this different from a standard PMSBY enrolment. Standard PMSBY is reactive — a lump sum after major injury. GigShield adds proactive cash support within 10 days of filing, covering the expenses that PMSBY doesn't.",
  },

  // ── Profile screen ────────────────────────────────────────────────────────
  {
    id: 'w-profile-page',
    targetId: 'tour-worker-profile-page',
    route: '/worker/profile',
    emoji: '👤',
    title: 'Your GigShield Profile',
    body: 'Your profile holds everything GigShield knows about you: personal details, your e-Shram UAN (national worker ID), linked bank account, all your platforms with join dates, and downloadable documents including your GigShield ID card.',
    hint: 'Your GigShield ID card is a government-recognised worker identity document under PWFVS. Download it, print it, and carry it — hospitals, police, and government offices accept it as proof of registered gig worker status.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PLATFORM ADMIN TOUR  (desktop — 16 steps)
// Dashboard (7) → Register (3) → Search (2) → Compliance (4)
// ─────────────────────────────────────────────────────────────────────────────
export const PLATFORM_ADMIN_STEPS: TourStep[] = [
  // ── Dashboard ─────────────────────────────────────────────────────────────
  {
    id: 'pa-banner',
    targetId: 'tour-pa-compliance-banner',
    route: '/platform-admin/dashboard',
    emoji: '✅',
    title: 'Compliance Status — Your Legal Standing',
    body: "This banner confirms that Swiggy India is FULLY COMPLIANT with PWFVS regulations for May 2026. All worker contributions are remitted, ESIC records are up to date, and there are zero pending disputes — you are legally covered.",
    hint: 'PWFVS (Platform Workers Fund and Verification Scheme) is Karnataka law. Non-compliance can result in platform licence suspension and penalties up to Rs 10 lakh per violation. This green banner is your real-time compliance health check.',
  },
  {
    id: 'pa-month-select',
    targetId: 'tour-pa-month-select',
    route: '/platform-admin/dashboard',
    emoji: '📅',
    title: 'Month Selector — Check Any Period',
    body: "Use this dropdown to switch between months and verify historical compliance. Select April, March, or February 2026 to confirm all past periods are clean before your quarterly PWFVS audit.",
    hint: 'PWFVS requires platforms to maintain compliance records for 3 years. GigShield archives every month automatically — no manual filing required. This dropdown gives you instant access to your entire compliance history.',
  },
  {
    id: 'pa-stats',
    targetId: 'tour-pa-stats',
    route: '/platform-admin/dashboard',
    emoji: '📊',
    title: 'Platform KPIs — Four Key Numbers',
    body: 'Your dashboard at a glance: 1,284 Active Workers on your GigShield network, Rs 21.6L in contributions remitted this month, 98.4% of workers fully compliant, and 7 open flags (3 high priority requiring same-day action).',
    hint: 'The Compliant Workers percentage (98.4%) is calculated daily by GigShield — it counts workers with verified KYC, active contributions, and no outstanding ESIC disputes. PWFVS requires platforms to maintain this above 95% to avoid penalties.',
  },
  {
    id: 'pa-chart',
    targetId: 'tour-pa-chart',
    route: '/platform-admin/dashboard',
    emoji: '📈',
    title: 'Daily Contribution Trend — May 2026',
    body: 'This line chart shows your daily contribution totals for the month. An upward trend reflects growing worker activity. A sudden dip signals an API integration issue — GigShield flags these in real time so you act before month-end.',
    hint: 'Contribution gaps are the most common PWFVS compliance finding in audits. GigShield daily monitoring means you see a gap the same day it occurs — not at month-end audit time when it is too late to fix without penalty.',
  },
  {
    id: 'pa-simulate',
    targetId: 'tour-pa-simulate-delivery',
    route: '/platform-admin/dashboard',
    emoji: '▶️',
    title: "Simulate Delivery — See the Pipeline Live",
    body: "Click 'Simulate Delivery' to pick a worker and platform, fire a delivery event, and watch the activity feed update in real time. This is how you demo GigShield to your leadership team or PWFVS inspectors.",
    hint: 'In production, this data flows from your platform API. Each delivery triggers: (1) contribution calculation, (2) wallet credit for the worker, (3) a PWFVS ledger entry, (4) an ESIC report update — all in under 2 seconds.',
  },
  {
    id: 'pa-activity',
    targetId: 'tour-pa-activity',
    route: '/platform-admin/dashboard',
    emoji: '🔔',
    title: 'Recent Activity Feed — Your Audit Trail',
    body: "Every event on your platform appears here: worker registrations, contribution remittances, PAN verifications, flags, and compliance milestones. This real-time audit trail is available to PWFVS inspectors on request.",
    hint: 'PWFVS requires platforms to log all worker-related events with timestamps. GigShield satisfies this requirement automatically — you will never need to produce manual logs for a compliance inspection. The feed is your evidence.',
  },
  {
    id: 'pa-quick-actions',
    targetId: 'tour-pa-quick-actions',
    route: '/platform-admin/dashboard',
    emoji: '⚡',
    title: 'Quick Actions — Your 3 Core Tasks',
    body: 'Three one-click shortcuts: Register New Worker (add to the GigShield network), Worker Search (look up any worker by ID or phone), and Run Compliance Check (generate your monthly PWFVS report).',
    hint: 'These three actions map directly to the three PWFVS obligations for platforms: (1) register all workers before their first assignment, (2) maintain an accessible worker directory, (3) generate and submit monthly compliance reports by the 7th of the following month.',
  },

  // ── Register screen ───────────────────────────────────────────────────────
  {
    id: 'pa-register',
    targetId: 'tour-pa-register-form',
    route: '/platform-admin/register',
    emoji: '👤',
    title: 'Register a Worker — PWFVS Onboarding',
    body: "Fill in the worker's Full Name, Mobile Number, Aadhaar (12 digits), PAN (format ABCDE1234F), and City. The Platform field is locked to 'Swiggy' — your admin account is scoped to your platform only, preventing cross-platform data access.",
    hint: 'Under PWFVS, platforms must register workers before their first assignment — not after. Late registration is flagged and logged as a violation. GigShield API integration allows bulk import so HR can onboard workers the moment they pass your screening.',
  },
  {
    id: 'pa-register-kyc',
    targetId: 'tour-pa-register-kyc',
    route: '/platform-admin/register',
    emoji: '🪪',
    title: 'Aadhaar + PAN — Why Both Are Required',
    body: "Aadhaar (12-digit UID) is cross-checked with UIDAI to verify the worker's identity and address in real time. PAN is linked for tax reporting of platform payments above Rs 30,000/year under Section 194O of the Income Tax Act.",
    hint: 'PWFVS mandates Aadhaar and PAN verification for every worker before first delivery. GigShield validates both via API instantly — an invalid format is rejected before registration completes, protecting you from compliance gaps.',
  },
  {
    id: 'pa-register-submit',
    targetId: 'tour-pa-register-submit',
    route: '/platform-admin/register',
    emoji: '🆔',
    title: 'Register Worker → GigShield ID Generated',
    body: "Clicking this button creates a unique GigShield ID (format: GS-2026-XXXX) for the worker. They receive an SMS with their ID and a link to set up the GigShield app. From that moment, every delivery builds their benefits automatically.",
    hint: 'The GigShield ID is permanent and portable. If this worker later joins Blinkit or Ola, both platforms can find them by GSID and their full history and benefits carry over. This cross-platform portability is the core of the PWFVS model.',
  },

  // ── Search screen ─────────────────────────────────────────────────────────
  {
    id: 'pa-search',
    targetId: 'tour-pa-search-bar',
    route: '/platform-admin/search',
    emoji: '🔍',
    title: 'Worker Search & Filter',
    body: "Search your entire worker directory by name, GigShield ID (GS-XXXX-XXXX), or mobile number. Dropdown filters let you isolate by status (Active / Flagged / Pending) and compliance level to quickly find workers who need attention.",
    hint: 'PWFVS requires platforms to produce a worker\'s complete contribution and compliance history within 48 hours of a labour department request. GigShield search puts that information at your fingertips in under 2 seconds.',
  },
  {
    id: 'pa-search-results',
    targetId: 'tour-pa-search-results',
    route: '/platform-admin/search',
    emoji: '📋',
    title: 'Worker Directory Table',
    body: "Each row shows Worker ID, name, phone, platform, status (green = compliant, amber = pending, red = flagged), and city. Click 'View →' on any row to see full KYC details, contribution history, and flag resolution options.",
    hint: 'The red flagged rows represent your highest compliance risk. Using the Compliance filter to show only Non-Compliant workers, then resolving each flag one by one, is the fastest way to reach 100% compliance before your monthly PWFVS submission.',
  },

  // ── Compliance screen ─────────────────────────────────────────────────────
  {
    id: 'pa-compliance',
    targetId: 'tour-pa-compliance-card',
    route: '/platform-admin/compliance',
    emoji: '📋',
    title: 'Compliance Centre — One Screen, Full Picture',
    body: "This screen is your PWFVS compliance command centre. Select a month, view the full remittance ledger, check the calendar heat map of daily contributions, and generate the official PDF report for submission to the Labour Department.",
    hint: 'PWFVS requires platforms to submit a monthly compliance report to the Karnataka Labour Department by the 7th of the following month. GigShield auto-generates this report — you review, sign, and submit in minutes, not days.',
  },
  {
    id: 'pa-compliance-generate',
    targetId: 'tour-pa-compliance-generate',
    route: '/platform-admin/compliance',
    emoji: '📑',
    title: "Tap 'Generate Report' → Instant PDF",
    body: "Click this button to produce the official PWFVS compliance report for the selected month. It includes the full ledger, worker counts, contribution totals, and a digital signature block. The report is ready in under 30 seconds.",
    hint: 'This report is legally binding under PWFVS. In production, GigShield will offer one-click submission directly to the Karnataka Labour Department portal via API integration, eliminating the manual upload step entirely.',
  },
  {
    id: 'pa-compliance-ledger',
    targetId: 'tour-pa-compliance-ledger',
    route: '/platform-admin/compliance',
    emoji: '📒',
    title: 'Contribution Ledger — The Financial Record',
    body: "The ledger shows each week's remittance: delivery count, total delivery amount, contributions collected (2%), ESIC portion, and NEFT reference number. This is the exact document PWFVS inspectors will examine during an audit.",
    hint: "ESIC (Employees' State Insurance Corporation) contributions form part of the PWFVS remittance. GigShield calculates the ESIC split automatically — you don't need to file separately with ESIC. The ledger is your evidence of compliance.",
  },
  {
    id: 'pa-compliance-calendar',
    targetId: 'tour-pa-compliance-calendar',
    route: '/platform-admin/compliance',
    emoji: '📆',
    title: 'Remittance Calendar — Day by Day',
    body: "The calendar shows every day of the selected month. Blue = contributions remitted. Grey = no activity (weekend or public holiday). Any gap on a working day must be explained in your PWFVS report.",
    hint: 'PWFVS mandates daily remittance of contributions from platforms to the GigShield pool after each delivery cycle. GigShield real-time API integration means contributions flow automatically — this calendar is your proof it happened every day.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUPER ADMIN TOUR  (desktop — 11 steps)
// Dashboard (2) → Platforms (1) → Workers (2) → Financials (2) → Config (2) → Audit (2)
// ─────────────────────────────────────────────────────────────────────────────
export const SUPER_ADMIN_STEPS: TourStep[] = [
  // ── Dashboard ─────────────────────────────────────────────────────────────
  {
    id: 'sa-kpis',
    targetId: 'tour-sa-kpis',
    route: '/super-admin/dashboard',
    emoji: '🌐',
    title: 'System-Wide KPIs — Network at a Glance',
    body: "Six tiles show the real-time health of the entire GigShield network: 12,847 workers registered across 6 platforms, Rs 21.4L in the welfare pool, 94.2% system-wide compliance rate, 47 active loans, 3 open claims, and Rs 3.2L monthly revenue.",
    hint: "These tiles update every 30 seconds via WebSocket in production. The Monthly Revenue figure (Rs 3.2L) is GigShield's platform licensing fee — 0.5% of total contributions — meaning GigShield's business grows only when more workers are protected.",
  },
  {
    id: 'sa-activity',
    targetId: 'tour-sa-activity',
    route: '/super-admin/dashboard',
    emoji: '⚡',
    title: 'Live Network Feed — Everything, Everywhere',
    body: "Every event across all six platforms appears here in real time: deliveries, registrations, claim approvals, flag resolutions. Use the 'Fire Delivery' and 'Register Worker' controls to demo the live system to investors or government officials.",
    hint: 'The super-admin live feed is the most powerful demo tool in GigShield. In a 5-minute investor pitch, fire 3 deliveries, watch contributions flow to workers in real time, then flip to Financials to show GigShield revenue growing — all live.',
  },

  // ── Platforms ─────────────────────────────────────────────────────────────
  {
    id: 'sa-platforms',
    targetId: 'tour-sa-platforms-table',
    route: '/super-admin/platforms',
    emoji: '🏢',
    title: 'Platform Management — 6 Integrated Partners',
    body: "Six platforms are integrated: Swiggy (2,847 workers), Blinkit (1,943), Ola (3,021), Zepto (1,247), Urban Company (2,108), and Rapido (1,681). Each card shows API status, compliance rate, and total contributions remitted.",
    hint: 'Under PWFVS, platforms must integrate with GigShield API within 90 days of the regulation taking effect. The API integration automates contribution collection, worker verification, and ESIC reporting — replacing all manual filing. Non-integrated platforms cannot legally operate in Karnataka.',
  },

  // ── Workers ───────────────────────────────────────────────────────────────
  {
    id: 'sa-workers',
    targetId: 'tour-sa-workers-table',
    route: '/super-admin/workers',
    emoji: '👥',
    title: 'Master Registry — 12,847 Workers Cross-Platform',
    body: "The master registry shows every worker across all platforms in one table. A worker registered on both Swiggy and Ola appears once, with contributions from both platforms combined — critical for accurate ESIC reporting and loan eligibility.",
    hint: "This cross-platform view is unique to GigShield. Without it, Swiggy sees Swiggy income and Ola sees Ola income — neither can give a worker a fair loan. GigShield combines them into a single verified profile that reflects the worker's full economic reality.",
  },
  {
    id: 'sa-workers-filters',
    targetId: 'tour-sa-workers-filters',
    route: '/super-admin/workers',
    emoji: '🔧',
    title: 'Filter, Search & Simulate',
    body: "Three filter dropdowns (Status, Compliance, Platform) plus a search box let you slice 12,847 workers down to exactly who you need. 'Download CSV' exports the filtered set. 'Add Demo Worker' adds test data for platform demos.",
    hint: "Filtering by Non-Compliant is the most important use case here. These workers represent regulatory risk — their platforms have missed contributions. GigShield auto-sends platforms a warning notification when any worker enters non-compliant status.",
  },

  // ── Financials ────────────────────────────────────────────────────────────
  {
    id: 'sa-financials',
    targetId: 'tour-sa-financials-chart',
    route: '/super-admin/financials',
    emoji: '💰',
    title: 'Revenue Chart — Three Income Streams',
    body: "GigShield revenue comes from three sources: Platform Licensing fees (largest), Loan Book Interest (growing), and Insurance Premium Cuts. The chart shows month-over-month growth as more workers and platforms join the network.",
    hint: "GigShield's business model is aligned with worker interests: the primary revenue stream (platform licensing) scales with the number of protected workers. GigShield is therefore financially incentivised to onboard as many workers as possible.",
  },
  {
    id: 'sa-financials-pnl',
    targetId: 'tour-sa-financials-breakdown',
    route: '/super-admin/financials',
    emoji: '📊',
    title: 'Profit & Loss Statement',
    body: "The P&L table shows May 2026 vs April 2026 side by side: revenue lines, cost items (ESIC processing, AWS, NBFC coordination), and net operating profit. The green highlighted row is the bottom line — currently profitable and growing.",
    hint: "PWFVS specifies minimum allocation percentages for each welfare category. GigShield's automated allocation engine ensures these ratios are maintained with every contribution cycle — you can verify compliance with the Contribution Flow section below.",
  },

  // ── Configuration ─────────────────────────────────────────────────────────
  {
    id: 'sa-config',
    targetId: 'tour-sa-config-card',
    route: '/super-admin/configuration',
    emoji: '⚙️',
    title: 'System Configuration — PWFVS as Code',
    body: "This is where PWFVS parameters are implemented as live controls: Contribution Rates, Pool Allocation percentages, Loan Settings, and notification templates. Changes here propagate to all six integrated platforms instantly.",
    hint: 'Configuration changes require a 72-hour notice period to platforms under PWFVS — GigShield enforces this with a countdown timer and approval workflow. Any change that reduces worker benefits requires Karnataka Labour Department sign-off before deployment.',
  },
  {
    id: 'sa-config-rates',
    targetId: 'tour-sa-config-rates',
    route: '/super-admin/configuration',
    emoji: '🎚️',
    title: 'Contribution Rates — The Policy Levers',
    body: "Worker Contribution Rate (currently 3%) is deducted from earnings per delivery. Platform Top-Up Rate (currently 5%) is the platform's additional contribution on top. These sliders let you adjust rates within PWFVS-mandated minimums.",
    hint: "The 2% worker contribution rate is the PWFVS floor — platforms can choose to contribute more. Early GigShield platform partners have committed to 3% as a market differentiator. GigShield's config system supports per-platform overrides for these premium agreements.",
  },

  // ── Audit Log ─────────────────────────────────────────────────────────────
  {
    id: 'sa-audit',
    targetId: 'tour-sa-audit-log',
    route: '/super-admin/audit',
    emoji: '📜',
    title: 'Immutable Audit Log — Your Regulatory Shield',
    body: "Every admin action is logged here: config changes, bulk exports, login events, API key rotations, and flag resolutions. Each entry carries a timestamp, IP address, and actor identity. This log cannot be edited or deleted.",
    hint: 'PWFVS mandates audit log retention for 5 years. GigShield uses append-only storage (similar to blockchain principles) — entries are cryptographically chained so tampering is detectable. This log is your first line of defence in any regulatory dispute.',
  },
  {
    id: 'sa-audit-export',
    targetId: 'tour-sa-audit-export',
    route: '/super-admin/audit',
    emoji: '⬇️',
    title: "Export Audit Log — Ready in Seconds",
    body: "The Export button generates a signed CSV of the complete audit log. Use the search and filter controls above to scope the export to a specific date range, action type, or platform before exporting for a regulatory submission.",
    hint: 'Government inspectors can request the audit log with 24 hours notice under PWFVS. GigShield one-click export means you are always 2 minutes away from full regulatory compliance documentation — no manual records, no scrambling.',
  },
];

// ── Convenience lookup ────────────────────────────────────────────────────────
export const ALL_TOUR_STEPS: Record<TourType, TourStep[]> = {
  worker: WORKER_STEPS,
  'platform-admin': PLATFORM_ADMIN_STEPS,
  'super-admin': SUPER_ADMIN_STEPS,
};

// ── Legacy export kept for backward compatibility ────────────────────────────
export const TOUR_PROMPT = TOUR_PROMPTS.worker;
export const TOUR_STEPS  = WORKER_STEPS;
