import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiLoader, FiUser, FiPhone, FiMail, FiMapPin, FiCalendar, FiHome } from 'react-icons/fi';
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

export default function LeadForm({ id }) {
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
        className="lp-search-card lp-search-success"
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
      >
        <FiCheckCircle size={40} color="#22c55e" />
        <h3>Thanks, {form.name.split(' ')[0]}!</h3>
        <p>Our team will call you within 30 minutes to help you find the perfect stay.</p>
      </motion.div>
    );
  }

  return (
    <form id={id} className="lp-search-card" onSubmit={handleSubmit}>
      <div className="lp-search-head">
        <h3>Find Your Stay with Ease</h3>
        <p>Share your details — get a free callback in 30 minutes.</p>
      </div>

      <div className="lp-search-field">
        <label>Full Name</label>
        <div className="lp-search-field-row">
          <FiUser size={14} />
          <input type="text" placeholder="Your Name" value={form.name} onChange={e => setField('name', e.target.value)} required />
        </div>
      </div>

      <div className="lp-search-grid">
        <div className="lp-search-field">
          <label>Mobile Number</label>
          <div className="lp-search-field-row">
            <FiPhone size={14} />
            <span className="lp-search-prefix">+91</span>
            <input type="tel" placeholder="10-digit number" value={form.phone} onChange={e => setField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} required />
          </div>
        </div>
        <div className="lp-search-field">
          <label>Email (Optional)</label>
          <div className="lp-search-field-row">
            <FiMail size={14} />
            <input type="email" placeholder="you@email.com" value={form.email} onChange={e => setField('email', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="lp-search-field">
        <label>Looking For</label>
        <div className="lp-search-chip-row">
          {CATEGORY_CHIPS.map(c => (
            <button
              type="button" key={c}
              className={`lp-search-chip ${form.category === c ? 'lp-search-chip--active' : ''}`}
              onClick={() => setField('category', form.category === c ? '' : c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="lp-search-grid">
        <div className="lp-search-field">
          <label>City</label>
          <div className="lp-search-field-row">
            <FiMapPin size={14} />
            <select value={form.city} onChange={e => setField('city', e.target.value)}>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="lp-search-field">
          <label>Move-in Timeframe</label>
          <div className="lp-search-field-row">
            <FiCalendar size={14} />
            <select value={form.timeframe} onChange={e => setField('timeframe', e.target.value)}>
              <option value="">Select</option>
              {TIMEFRAMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {status === 'error' && <div className="lp-search-error">{errorMsg}</div>}

      <motion.button type="submit" className="lp-search-btn" disabled={status === 'submitting'} whileTap={{ scale: 0.97 }}>
        {status === 'submitting' ? (<><FiLoader className="lp-spin" /> Sending...</>) : (<>Get Free Callback <FiHome size={15} /></>)}
      </motion.button>

      <div className="lp-search-trust">
        <span><FiCheckCircle size={12} /> No Booking Fees</span>
        <span><FiCheckCircle size={12} /> Instant Confirmation</span>
        <span><FiCheckCircle size={12} /> 24x7 Support</span>
      </div>
    </form>
  );
}
