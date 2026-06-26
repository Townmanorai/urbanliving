import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { AuthContext } from '../Login/AuthContext';
import './BankDetails.css';

const STEPS = ['Payout Method', 'Bank Account', 'Address', 'Review'];

const API_BASE = import.meta.env.DEV
  ? 'http://localhost:3030'
  : 'https://townmanor.ai';

const axiosOpts = { withCredentials: true };

const getUserId = (user) => {
  if (user?.id) return user.id;
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw)?.id || null : null;
  } catch { return null; }
};

// ── Step bar ─────────────────────────────────────────────
function StepBar({ step }) {
  return (
    <div className="bd-steps">
      {STEPS.map((label, i) => {
        const num = i + 1;
        const isDone = step > num;
        const isActive = step === num;
        return (
          <div key={i} className="bd-step-item">
            <div className="bd-step-inner">
              <div className={`bd-step-dot ${isDone ? 'done' : isActive ? 'active' : ''}`}>
                {isDone ? '✓' : num}
              </div>
              <span className={`bd-step-label ${isDone ? 'done' : isActive ? 'active' : ''}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`bd-step-line ${isDone ? 'done' : ''}`} />}
          </div>
        );
      })}
    </div>
  );
}

// ── Step 1: Payout method + account holder ───────────────
function Step1({ data, onChange }) {
  return (
    <div>
      <h2 className="bd-card-title">Let's add a payout method</h2>
      <p className="bd-card-sub">To start, let us know where you'd like us to send your money.</p>

      <label className="bd-label">Billing country/region</label>
      <select className="bd-select" value={data.country} onChange={e => onChange({ country: e.target.value })}>
        <option value="India">India</option>
        <option value="United States">United States</option>
        <option value="United Kingdom">United Kingdom</option>
        <option value="Singapore">Singapore</option>
        <option value="UAE">UAE</option>
      </select>
      <p className="bd-input-hint">This is where you opened your financial account.</p>

      <div style={{ marginTop: '24px' }}>
        <p className="bd-label" style={{ marginTop: 0 }}>How you'll get paid</p>
        <p className="bd-input-hint" style={{ marginBottom: '8px' }}>Payouts will be sent in INR.</p>
        <div className="bd-method-card">
          <div className="bd-method-icon">🏛️</div>
          <div className="bd-method-info">
            <div className="bd-method-name">Bank account</div>
            <ul className="bd-method-bullets">
              <li>3–5 business days</li>
              <li>No fees</li>
            </ul>
          </div>
          <input type="radio" className="bd-method-radio" checked readOnly />
        </div>
        <p className="bd-note">Payouts take longer for some banks, and reviews could result in holds or delays.</p>
      </div>

      <label className="bd-label">Account holder name</label>
      <input
        className="bd-input"
        placeholder="Full name as on bank account"
        value={data.holderName}
        onChange={e => onChange({ holderName: e.target.value })}
      />

      <label className="bd-label">Whose bank account is it?</label>
      <select className="bd-select" value={data.accountOwner} onChange={e => onChange({ accountOwner: e.target.value })}>
        <option value="">Select one</option>
        <option value="myself">Myself</option>
        <option value="business">My business</option>
        <option value="joint">Joint account</option>
      </select>
      <p className="bd-input-hint">Choose from people you've added to your host account.</p>
    </div>
  );
}

// ── Step 2: Bank account info ────────────────────────────
function Step2({ data, onChange, isEditMode }) {
  return (
    <div>
      <h2 className="bd-card-title">Add bank account info</h2>
      <p className="bd-card-sub">Enter your bank details to receive payouts directly.</p>

      <label className="bd-label">Is this a current or savings account?</label>
      <div className="bd-radio-group">
        <label className="bd-radio-label">
          <input type="radio" name="accountType" value="current" checked={data.accountType === 'current'} onChange={() => onChange({ accountType: 'current' })} />
          Current
        </label>
        <label className="bd-radio-label">
          <input type="radio" name="accountType" value="savings" checked={data.accountType === 'savings'} onChange={() => onChange({ accountType: 'savings' })} />
          Savings
        </label>
      </div>

      <label className="bd-label">Account number</label>
      <div className="bd-input-group">
        <input
          className="bd-input"
          placeholder={isEditMode ? 'Enter new account number to update' : 'Account number'}
          value={data.accountNumber}
          onChange={e => onChange({ accountNumber: e.target.value, confirmAccountNumber: '' })}
        />
        <input
          className="bd-input"
          placeholder="Confirm account number"
          value={data.confirmAccountNumber}
          onChange={e => onChange({ confirmAccountNumber: e.target.value })}
        />
      </div>
      <p className="bd-input-hint">
        {isEditMode
          ? 'Existing account number is masked for security. Enter a new one to update, or leave blank to keep current.'
          : 'Enter the account number. This can usually be found within your account details.'}
      </p>

      <label className="bd-label">IFSC code</label>
      <input
        className="bd-input"
        placeholder="IFSC code e.g. HDFC0001234"
        value={data.ifsc}
        onChange={e => onChange({ ifsc: e.target.value.toUpperCase() })}
      />
      <p className="bd-input-hint">Please enter your IFSC code.</p>

      <label className="bd-label">Permanent Account Number (PAN)</label>
      <input
        className="bd-input"
        placeholder={isEditMode ? 'Enter new PAN to update' : 'e.g. ABCDE1234F'}
        value={data.pan}
        onChange={e => onChange({ pan: e.target.value.toUpperCase() })}
      />
      <p className="bd-input-hint">
        {isEditMode
          ? 'PAN is masked for security. Enter a new one to update, or leave blank to keep current.'
          : 'Add the PAN for the individual or corporation.'}
      </p>
    </div>
  );
}

// ── Step 3: Address ──────────────────────────────────────
function Step3({ data, onChange }) {
  const hasAddress = data.line1 || data.city;
  const [addingNew, setAddingNew] = useState(!hasAddress);

  return (
    <div>
      <h2 className="bd-card-title">Add the address associated with this account</h2>
      <p className="bd-card-sub">
        This is the address that the bank or financial institution has on file.
        It should match recent bank statements.
      </p>

      <label className="bd-label">Use this address?</label>

      {!addingNew ? (
        <>
          <label className="bd-address-option selected">
            <input type="radio" checked readOnly />
            <div className="bd-address-text">
              {data.line1}{data.line2 ? `, ${data.line2}` : ''}<br />
              {data.city}{data.state ? `, ${data.state}` : ''}{data.pincode ? ` — ${data.pincode}` : ''}
            </div>
          </label>
          <span className="bd-address-link" onClick={() => setAddingNew(true)}>Edit / Add a new address</span>
        </>
      ) : (
        <>
          <label className="bd-label">Address line 1</label>
          <input className="bd-input" placeholder="Flat / House No., Street" value={data.line1} onChange={e => onChange({ line1: e.target.value })} />

          <label className="bd-label">Address line 2 (optional)</label>
          <input className="bd-input" placeholder="Building, Area, Landmark" value={data.line2} onChange={e => onChange({ line2: e.target.value })} />

          <label className="bd-label">City</label>
          <input className="bd-input" placeholder="City" value={data.city} onChange={e => onChange({ city: e.target.value })} />

          <label className="bd-label">State</label>
          <input className="bd-input" placeholder="State" value={data.state} onChange={e => onChange({ state: e.target.value })} />

          <label className="bd-label">PIN code</label>
          <input className="bd-input" placeholder="6-digit PIN code" value={data.pincode} onChange={e => onChange({ pincode: e.target.value })} />

          {hasAddress && (
            <span className="bd-address-link" onClick={() => setAddingNew(false)}>← Cancel</span>
          )}
        </>
      )}
    </div>
  );
}

// ── Step 4: Review ───────────────────────────────────────
function ReviewRow({ label, value, onEdit }) {
  return (
    <div className="bd-review-section">
      <div className="bd-review-row">
        <span className="bd-review-key">{label}</span>
        <span className="bd-review-val">{value || '—'}</span>
        <button className="bd-review-edit" onClick={onEdit}>Edit</button>
      </div>
    </div>
  );
}

function Step4Review({ form, onEdit }) {
  const accountDisplay = form.accountNumber || '—';
  const panDisplay     = form.pan           || '—';
  const address = [form.line1, form.line2, form.city, form.state, form.pincode].filter(Boolean).join(', ');

  return (
    <div>
      <h2 className="bd-card-title">Let's review your info</h2>
      <p className="bd-card-sub">Almost done! Double-check everything before you submit.</p>
      <ReviewRow label="Payout method"  value={`Bank account in INR (${form.country})`} onEdit={() => onEdit(1)} />
      <ReviewRow label="Account holder" value={form.holderName}   onEdit={() => onEdit(1)} />
      <ReviewRow label="Account owner"  value={form.accountOwner} onEdit={() => onEdit(1)} />
      <ReviewRow label="Account type"   value={form.accountType ? (form.accountType.charAt(0).toUpperCase() + form.accountType.slice(1)) : '—'} onEdit={() => onEdit(2)} />
      <ReviewRow label="Account number" value={accountDisplay}    onEdit={() => onEdit(2)} />
      <ReviewRow label="IFSC code"      value={form.ifsc}         onEdit={() => onEdit(2)} />
      <ReviewRow label="PAN"            value={panDisplay}        onEdit={() => onEdit(2)} />
      <ReviewRow label="Address"        value={address || '—'}    onEdit={() => onEdit(3)} />
    </div>
  );
}

// ── Error banner ─────────────────────────────────────────
function ErrorBanner({ errors }) {
  if (!errors || errors.length === 0) return null;
  return (
    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px', marginTop: '16px' }}>
      {errors.map((e, i) => (
        <p key={i} style={{ margin: '2px 0', fontSize: '0.82rem', color: '#b91c1c' }}>• {e}</p>
      ))}
    </div>
  );
}

// ── Main component ───────────────────────────────────────
export default function BankDetails({ standalone = false }) {
  const { user } = useContext(AuthContext);

  const [hasListings, setHasListings] = useState(standalone ? true : null);
  const [isEditMode, setIsEditMode]   = useState(false);
  const [step, setStep]               = useState(1);
  const [submitted, setSubmitted]     = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [apiErrors, setApiErrors]     = useState([]);
  const [loading, setLoading]         = useState(true);

  const [form, setForm] = useState({
    country: 'India',
    holderName: '',
    accountOwner: '',
    accountType: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifsc: '',
    pan: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  });

  const updateForm = (patch) => setForm(prev => ({ ...prev, ...patch }));

  // ── 1. Check listing count (embedded mode only) ──
  useEffect(() => {
    if (standalone) { setLoading(false); return; }
    const userId = getUserId(user);
    if (!userId) { setHasListings(false); setLoading(false); return; }

    fetch(`https://www.townmanor.ai/api/ovika/properties`)
      .then(r => r.json())
      .then(data => {
        const all = Array.isArray(data) ? data : (data?.data || []);
        const mine = all.filter(p => {
          const candidates = [p.owner_id, p.ownerId, p.user_id, p.userId, p.meta?.ownerId, p.meta?.owner_id, p.owner];
          return candidates.some(c => c && String(c) === String(userId));
        });
        setHasListings(mine.length > 0);
      })
      .catch(() => setHasListings(false))
      .finally(() => setLoading(false));
  }, [user, standalone]);

  // ── 2. Check status + prefill if details exist ──
  useEffect(() => {
    if (!standalone && !hasListings) return;

    const init = async () => {
      const userId = getUserId(user);
      try {
        const statusRes = await axios.get(`${API_BASE}/api/owner/bank-details/status`, {
          ...axiosOpts,
          params: { user_id: userId },
        });
        if (statusRes.data?.exists) {
          setIsEditMode(true);
          const detailRes = await axios.get(`${API_BASE}/api/owner/bank-details`, {
            ...axiosOpts,
            params: { user_id: userId },
          });
          const d = detailRes.data?.data;
          if (d) {
            setForm({
              country:              d.country            || 'India',
              holderName:           d.holder_name        || '',
              accountOwner:         d.account_owner_type || '',
              accountType:          d.account_type       || '',
              accountNumber:        d.account_number     || '',  // masked value from backend
              confirmAccountNumber: '',
              ifsc:                 d.ifsc_code          || '',
              pan:                  d.pan                || '',  // masked value from backend
              line1:                d.address_line1      || '',
              line2:                d.address_line2      || '',
              city:                 d.city               || '',
              state:                d.state              || '',
              pincode:              d.pincode            || '',
            });
          }
        }
      } catch {
        // no saved details yet — fresh form
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [hasListings, standalone]);

  // ── Guards ──
  if (!standalone && hasListings === null) return null;
  if (!standalone && !hasListings)         return null;
  if (loading) return (
    <div className="bd-wrapper" style={standalone ? { paddingTop: '32px' } : {}}>
      <p style={{ color: '#9ca3af', fontSize: '0.88rem' }}>Loading…</p>
    </div>
  );

  // ── Validation ──
  const validate = () => {
    setApiErrors([]);
    if (step === 1) {
      if (!form.holderName.trim())  { setApiErrors(['Account holder name is required.']); return false; }
      if (!form.accountOwner)       { setApiErrors(['Please select whose account this is.']); return false; }
    }
    if (step === 2) {
      if (!form.accountType) { setApiErrors(['Please select account type (Current or Savings).']); return false; }
      if (!form.accountNumber)    { setApiErrors(['Please enter your account number.']); return false; }
      if (form.accountNumber !== form.confirmAccountNumber) { setApiErrors(['Account numbers do not match.']); return false; }
      if (!form.ifsc)             { setApiErrors(['Please enter IFSC code.']); return false; }
      if (!form.pan)              { setApiErrors(['Please enter PAN.']); return false; }
    }
    if (step === 3) {
      if (!form.line1.trim()) { setApiErrors(['Address line 1 is required.']); return false; }
      if (!form.city.trim())  { setApiErrors(['City is required.']); return false; }
      if (!form.state.trim()) { setApiErrors(['State is required.']); return false; }
      if (!form.pincode || form.pincode.length !== 6) { setApiErrors(['Please enter a valid 6-digit PIN code.']); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (!validate()) return;
    setStep(s => Math.min(s + 1, 4));
  };

  const handleBack = () => { setApiErrors([]); setStep(s => Math.max(s - 1, 1)); };

  // ── Submit to backend ──
  const handleSubmit = async () => {
    setSubmitting(true);
    setApiErrors([]);
    try {
      const userId = getUserId(user);
      const body = {
        user_id:             userId,
        country:             form.country,
        holder_name:         form.holderName,
        account_owner_type:  form.accountOwner,
        account_type:        form.accountType,
        ifsc_code:           form.ifsc,
        address_line1:       form.line1,
        address_line2:       form.line2,
        city:                form.city,
        state:               form.state,
        pincode:             form.pincode,
      };
      if (form.accountNumber) body.account_number = form.accountNumber;
      if (form.pan)           body.pan            = form.pan;

      console.log('[BankDetails] POST body:', JSON.stringify(body, null, 2));
      await axios.post(`${API_BASE}/api/owner/bank-details`, body, axiosOpts);
      setSubmitted(true);
    } catch (err) {
      const errors = err?.response?.data?.errors;
      if (Array.isArray(errors) && errors.length > 0) {
        setApiErrors(errors);
      } else {
        setApiErrors(['Something went wrong. Please try again.']);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const wrapperStyle = standalone ? { paddingTop: '32px' } : {};
  const heading = isEditMode ? 'Update Your Bank Details' : 'Add Your Bank Details';
  const subText  = isEditMode
    ? 'Your saved bank details are pre-filled. Update any field and submit.'
    : 'Set up your payout method to receive earnings from your listings.';

  if (submitted) {
    return (
      <div className="bd-wrapper" style={wrapperStyle}>
        <div className="bd-section-heading">{heading}</div>
        <div className="bd-card">
          <div className="bd-success">
            <div className="bd-success-icon">✅</div>
            <div className="bd-success-title">
              {isEditMode ? 'Bank details updated!' : 'Bank details submitted!'}
            </div>
            <p className="bd-success-msg">
              Your payout details have been saved. Payouts will be processed within 3–5 business days after a booking completes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bd-wrapper" style={wrapperStyle}>
      <Helmet>
        <title>Bank Details | OvikaLiving Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="bd-section-heading">{heading}</div>
      <p className="bd-section-sub">{subText}</p>

      <StepBar step={step} />

      <div className="bd-card">
        {step === 1 && <Step1 data={form} onChange={updateForm} />}
        {step === 2 && <Step2 data={form} onChange={updateForm} isEditMode={isEditMode} />}
        {step === 3 && <Step3 data={form} onChange={updateForm} />}
        {step === 4 && <Step4Review form={form} onEdit={(s) => { setApiErrors([]); setStep(s); }} />}

        <ErrorBanner errors={apiErrors} />

        <div className="bd-btn-row">
          {step > 1 && (
            <button className="bd-btn-back" onClick={handleBack} disabled={submitting}>← Back</button>
          )}
          {step < 4 ? (
            <button className="bd-btn-next" onClick={handleNext}>Next →</button>
          ) : (
            <button className="bd-btn-submit" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Saving…' : isEditMode ? 'Update Details' : 'Submit Details'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
