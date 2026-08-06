import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiLoader } from 'react-icons/fi';
import { forwardLeadToIngestEndpoint, toIndianPhone } from '../../utils/leadIngest';

const CATEGORY_CHIPS = [
  'Signature Stays',
  'Hotel Stays',
  'Homestays & BnB',
  'Apartments & Villas',
  'PG & Co-Living',
];

const CITIES = ['Noida', 'Greater Noida', 'Gurugram', 'Delhi', 'Ghaziabad'];

const TIMEFRAMES = ['Immediately', 'Within 15 days', 'Within a month', 'Just exploring'];

const LANDING_LEADS_API = 'https://www.townmanor.ai/api/ovika/landing-leads';

export default function LeadForm({ id, compact = false }) {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', category: '', city: 'Noida', timeframe: '',
  });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const setField = (name, value) => setForm(f => ({ ...f, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.phone.replace(/\D/g, '').length !== 10) {
      setErrorMsg('Please enter a valid name and 10-digit mobile number.');
      setStatus('error');
      return;
    }
    setStatus('submitting');
    try {
      const res = await axios.post(LANDING_LEADS_API, {
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        category: form.category || undefined,
        city: form.city || undefined,
        timeframe: form.timeframe || undefined,
        source: 'landing_page_ads',
      });
      if (res.data?.success === false) {
        setErrorMsg(res.data?.message || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
      setStatus('error');
      return;
    } finally {
      // Secondary external CRM feed — non-blocking, independent of the primary API above.
      forwardLeadToIngestEndpoint({
        name: form.name,
        phone: toIndianPhone(form.phone),
        email: form.email || undefined,
        source: 'landing_page_ads',
      });
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        className="lp-form-card lp-form-success"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <FiCheckCircle size={44} color="#22c55e" />
        <h3>Thanks, {form.name.split(' ')[0]}!</h3>
        <p>Our team will call you within 30 minutes to help you find the perfect stay.</p>
      </motion.div>
    );
  }

  return (
    <form id={id} className={`lp-form-card ${compact ? 'lp-form-card--compact' : ''}`} onSubmit={handleSubmit}>
      <div className="lp-form-head">
        <h3>Get Free Assistance</h3>
        <p>Tell us what you're looking for — our team calls you back in 30 minutes.</p>
      </div>

      <div className="lp-form-row">
        <input
          type="text" placeholder="Your Name" value={form.name}
          onChange={e => setField('name', e.target.value)} className="lp-input" required
        />
      </div>
      <div className="lp-form-row">
        <div className="lp-phone-wrap">
          <span className="lp-phone-prefix">+91</span>
          <input
            type="tel" placeholder="10-digit mobile number" value={form.phone}
            onChange={e => setField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
            className="lp-input lp-input--phone" required
          />
        </div>
      </div>
      <div className="lp-form-row">
        <input
          type="email" placeholder="Email address (optional)" value={form.email}
          onChange={e => setField('email', e.target.value)} className="lp-input"
        />
      </div>

      <div className="lp-form-row">
        <label className="lp-form-label">Looking for</label>
        <div className="lp-chip-row">
          {CATEGORY_CHIPS.map(c => (
            <button
              type="button" key={c}
              className={`lp-chip ${form.category === c ? 'lp-chip--active' : ''}`}
              onClick={() => setField('category', form.category === c ? '' : c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="lp-form-row lp-form-row--split">
        <div className="lp-select-wrap">
          <label className="lp-form-label">City</label>
          <select value={form.city} onChange={e => setField('city', e.target.value)} className="lp-input">
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="lp-select-wrap">
          <label className="lp-form-label">Move-in timeframe</label>
          <select value={form.timeframe} onChange={e => setField('timeframe', e.target.value)} className="lp-input">
            <option value="">Select</option>
            {TIMEFRAMES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {status === 'error' && (
        <div className="lp-form-error">{errorMsg}</div>
      )}

      <motion.button
        type="submit" className="lp-submit-btn" disabled={status === 'submitting'}
        whileTap={{ scale: 0.97 }}
      >
        {status === 'submitting' ? (<><FiLoader className="lp-spin" /> Sending...</>) : 'Get Free Callback →'}
      </motion.button>
      <p className="lp-form-note">Zero brokerage · No spam · 100% free assistance</p>
    </form>
  );
}
