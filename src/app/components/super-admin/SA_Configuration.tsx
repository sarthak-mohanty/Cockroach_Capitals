import { useState } from 'react';
import SuperAdminLayout from './SuperAdminLayout';
import ConfirmModal from '../shared/ConfirmModal';
import { useToast } from '../shared/ToastContext';
import { Save, MessageSquare } from 'lucide-react';

interface Rates {
  workerContrib: number;
  platformContrib: number;
  insurancePct: number;
  pensionPct: number;
  emergencyPct: number;
}

const SMS_VARS = ['{{worker_name}}', '{{amount}}', '{{date}}', '{{platform}}', '{{gigshield_id}}'];

export default function SA_Configuration() {
  const { addToast } = useToast();
  const [rates, setRates] = useState<Rates>({ workerContrib: 3, platformContrib: 5, insurancePct: 40, pensionPct: 40, emergencyPct: 20 });
  const [saveOpen, setSaveOpen] = useState(false);
  const [smsTemplate, setSmsTemplate] = useState(
    'Hi {{worker_name}}, your GigShield contribution of ₹{{amount}} has been received on {{date}} from {{platform}}. Your wallet ID: {{gigshield_id}}. Keep earning, keep protected!'
  );
  const [loanRate, setLoanRate] = useState('12.5');
  const [maxLoan, setMaxLoan] = useState('50000');
  const [claimWindow, setClaimWindow] = useState('30');

  const total = rates.insurancePct + rates.pensionPct + rates.emergencyPct;
  const isValid = total === 100;

  const handleRateChange = (field: keyof Rates) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    setRates(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = () => {
    addToast('Configuration saved successfully.', 'success');
  };

  const previewSms = smsTemplate
    .replace('{{worker_name}}', 'Ravi Kumar')
    .replace('{{amount}}', '450')
    .replace('{{date}}', 'May 26, 2026')
    .replace('{{platform}}', 'Swiggy')
    .replace('{{gigshield_id}}', 'GS-2026-08401');

  const inputStyle: React.CSSProperties = {
    height: '42px', border: '1.5px solid #E2E8F0', borderRadius: '8px',
    fontFamily: 'var(--font-body)', fontSize: '14px', color: '#0F172A',
    width: '100%', padding: '0 12px', outline: 'none',
  };

  return (
    <SuperAdminLayout activeScreen="configuration" title="Configuration">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: '#0F172A' }}>Configuration</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
              System-wide rates, loan limits, and communication templates.
            </p>
          </div>
          <button
            onClick={() => setSaveOpen(true)}
            className="flex items-center gap-2 rounded-lg px-5"
            style={{ height: '42px', background: '#0F172A', color: '#FDE68A', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}
          >
            <Save size={15} />
            Save Changes
          </button>
        </div>

        <div data-tour-id="tour-sa-config-card" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contribution Rates */}
          <div data-tour-id="tour-sa-config-rates" className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '16px' }}>Contribution Rates</h3>
            <div className="space-y-4">
              {[
                { label: 'Worker Contribution Rate (%)', field: 'workerContrib' as keyof Rates, hint: 'Deducted from worker earnings per delivery' },
                { label: 'Platform Top-Up Rate (%)', field: 'platformContrib' as keyof Rates, hint: 'Platform pays this % on top of worker deduction' },
              ].map(item => (
                <div key={item.field}>
                  <label style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A', display: 'block', marginBottom: '4px' }}>{item.label}</label>
                  <input type="number" step="0.5" min="0" max="20" value={rates[item.field]} onChange={handleRateChange(item.field)} style={inputStyle} />
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>{item.hint}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Allocation Bar */}
          <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '4px' }}>Pool Allocation</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748B', marginBottom: '16px' }}>Must sum to 100%</p>
            <div className="space-y-4">
              {[
                { label: 'Insurance', field: 'insurancePct' as keyof Rates, color: '#0EA5E9' },
                { label: 'Pension / Savings', field: 'pensionPct' as keyof Rates, color: '#22C55E' },
                { label: 'Emergency Fund', field: 'emergencyPct' as keyof Rates, color: '#F59E0B' },
              ].map(item => (
                <div key={item.field}>
                  <div className="flex items-center justify-between mb-1">
                    <label style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#0F172A' }}>{item.label}</label>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: item.color }}>{rates[item.field]}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={rates[item.field]}
                    onChange={e => setRates(prev => ({ ...prev, [item.field]: parseInt(e.target.value) }))}
                    style={{ width: '100%', accentColor: item.color }}
                  />
                </div>
              ))}
            </div>

            {/* Live bar */}
            <div className="mt-4">
              <div style={{ height: '12px', borderRadius: '6px', overflow: 'hidden', display: 'flex', background: '#F1F5F9' }}>
                <div style={{ width: `${rates.insurancePct}%`, background: '#0EA5E9', transition: 'width 0.3s' }} />
                <div style={{ width: `${rates.pensionPct}%`, background: '#22C55E', transition: 'width 0.3s' }} />
                <div style={{ width: `${rates.emergencyPct}%`, background: '#F59E0B', transition: 'width 0.3s' }} />
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: isValid ? '#16A34A' : '#EF4444', marginTop: '6px', textAlign: 'right' }}>
                {isValid ? `✓ Total: 100%` : `Total: ${total}% — must equal 100%`}
              </p>
            </div>
          </div>

          {/* Loan Settings */}
          <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '16px' }}>Loan Settings</h3>
            <div className="space-y-4">
              <div>
                <label style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A', display: 'block', marginBottom: '4px' }}>Annual Interest Rate (%)</label>
                <input type="number" step="0.5" value={loanRate} onChange={e => setLoanRate(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A', display: 'block', marginBottom: '4px' }}>Maximum Loan Amount (₹)</label>
                <input type="number" step="1000" value={maxLoan} onChange={e => setMaxLoan(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0F172A', display: 'block', marginBottom: '4px' }}>Claim Filing Window (days)</label>
                <input type="number" step="1" value={claimWindow} onChange={e => setClaimWindow(e.target.value)} style={inputStyle} />
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>Days after incident to file a claim</p>
              </div>
            </div>
          </div>

          {/* SMS Template */}
          <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={18} style={{ color: '#0EA5E9' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>SMS Notification Template</h3>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {SMS_VARS.map(v => (
                <button
                  key={v}
                  onClick={() => setSmsTemplate(prev => prev + ' ' + v)}
                  style={{ fontFamily: 'var(--font-body)', fontSize: '11px', background: '#F0F9FF', color: '#0369A1', border: '1px solid #BAE6FD', borderRadius: '6px', padding: '3px 8px', cursor: 'pointer' }}
                >
                  {v}
                </button>
              ))}
            </div>

            <textarea
              value={smsTemplate}
              onChange={e => setSmsTemplate(e.target.value)}
              rows={4}
              style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '8px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F172A', padding: '10px 12px', outline: 'none', resize: 'vertical' }}
            />

            <div className="mt-3 p-3 rounded-lg" style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#64748B', marginBottom: '4px', fontWeight: 600 }}>Preview (sample worker: Ravi Kumar):</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#0F172A', lineHeight: '1.6' }}>{previewSms}</p>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#94A3B8', marginTop: '6px' }}>
              {smsTemplate.length} / 160 characters
            </p>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={saveOpen}
        onClose={() => setSaveOpen(false)}
        onConfirm={handleSave}
        title="Save Configuration?"
        description="These changes will take effect immediately across all platforms. Contribution rates will apply to new earnings from the next billing cycle."
        confirmLabel="Save Configuration"
        confirmVariant="warning"
      />
    </SuperAdminLayout>
  );
}
