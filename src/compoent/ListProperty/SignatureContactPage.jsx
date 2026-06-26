import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShieldCheck, Clock, Phone } from 'lucide-react';

const HIGHLIGHTS = [
  { icon: <Star size={16} strokeWidth={1.5} />, text: 'Premium listing placement' },
  { icon: <ShieldCheck size={16} strokeWidth={1.5} />, text: 'Dedicated listing manager' },
  { icon: <Clock size={16} strokeWidth={1.5} />, text: 'Priority onboarding' },
  { icon: <Phone size={16} strokeWidth={1.5} />, text: 'Direct team support' },
];

const SignatureContactPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const validate = () => {
    const newErr = {};
    if (!form.name.trim()) newErr.name = 'Name is required';
    if (!form.phone.trim()) newErr.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) newErr.phone = 'Enter a valid 10-digit number';
    if (!form.email.trim()) newErr.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErr.email = 'Invalid email';
    if (!form.message.trim()) newErr.message = 'Please describe your property';
    return newErr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const res = await fetch('https://www.townmanor.ai/api/formlead/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone_number: form.phone,
          purpose: `Signature Stays Listing — ${form.message} | Email: ${form.email}`,
          source: 'Signature Stays Listing Inquiry',
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setDone(true);
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch {
      alert('Something went wrong. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>List on Signature Stays — Premium Property Listing | OvikaLiving</title>
        <meta name="description" content="List your luxury villa, premium suite or high-end property on OvikaLiving Signature Stays. Get premium placement, dedicated listing manager & priority onboarding. Contact our Signature Stays team today." />
        <meta name="keywords" content="signature stay listing, list luxury villa Noida, premium property listing OvikaLiving, luxury rental Noida, high-end stay listing, OvikaLiving signature, list villa Delhi NCR, premium suite listing" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ovikaliving.com/signature-listing" />
        <meta name="author" content="OvikaLiving" />
        <meta name="language" content="en" />
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Noida" />
        <meta name="geo.position" content="28.5355;77.3910" />
        <meta name="ICBM" content="28.5355, 77.3910" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="List on Signature Stays — Premium Property | OvikaLiving" />
        <meta property="og:description" content="List your luxury villa or premium property on OvikaLiving Signature Stays. Premium placement, dedicated support & priority onboarding." />
        <meta property="og:url" content="https://www.ovikaliving.com/signature-listing" />
        <meta property="og:site_name" content="OvikaLiving" />
        <meta property="og:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@OvikaLiving" />
        <meta name="twitter:title" content="List on Signature Stays | OvikaLiving" />
        <meta name="twitter:description" content="List your luxury villa or premium property on OvikaLiving Signature Stays. Premium placement & dedicated support." />
        <meta name="twitter:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
      </Helmet>

      <style>{`
        .sig-root {
          min-height: 100vh;
          background: #fdf8f2;
          display: flex;
          flex-direction: column;
          font-family: 'Outfit','Helvetica Neue',Arial,sans-serif;
        }

        /* ── Top accent bar (matches site header feel) ── */
        .sig-hero-bar {
          background: linear-gradient(120deg, #fdf2e4 0%, #faecd8 100%);
          border-bottom: 1px solid #f0d8b0;
          padding: 40px 24px 48px;
        }
        .sig-hero-inner {
          max-width: 960px;
          margin: 0 auto;
        }

        .sig-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fff;
          border: 1.5px solid #e2d5c0;
          border-radius: 8px;
          padding: 7px 14px;
          color: #5a3e1b;
          font-size: 13px;
          cursor: pointer;
          margin-bottom: 20px;
          transition: border-color .15s, background .15s;
        }
        .sig-back:hover { background: #fdf2e4; border-color: #c2772b; }

        .sig-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fdf2e4;
          border: 1px solid #f0d8b0;
          border-radius: 100px;
          padding: 5px 14px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .07em;
          text-transform: uppercase;
          color: #c2772b;
          margin-bottom: 14px;
        }

        .sig-h1 {
          font-size: clamp(26px, 3.5vw, 40px);
          font-weight: 300;
          line-height: 1.2;
          margin: 0 0 10px;
          color: #1e293b;
        }
        .sig-h1 strong { font-weight: 700; color: #c2772b; }

        .sig-desc {
          font-size: 14.5px;
          color: #64748b;
          line-height: 1.65;
          margin: 0;
          max-width: 480px;
        }

        /* ── Main content area: 2-col on desktop ── */
        .sig-body {
          max-width: 960px;
          margin: 0 auto;
          width: 100%;
          padding: 40px 24px 60px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: start;
          box-sizing: border-box;
        }

        /* ─── Left: Highlights ─── */
        .sig-left {}

        .sig-left-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .06em;
          color: #94a3b8;
          margin: 0 0 16px;
        }

        .sig-highlights { display: flex; flex-direction: column; gap: 12px; }
        .sig-hl {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: #1e293b;
        }
        .sig-hl-icon {
          width: 36px; height: 36px;
          background: #fdf2e4;
          border: 1.5px solid #f0d8b0;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #c2772b; flex-shrink: 0;
        }

        /* ─── Right: Form card ─── */
        .sig-card {
          background: #fff;
          border: 2px solid #e2e8f0;
          border-radius: 20px;
          padding: 36px 32px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.07);
        }
        .sig-card h2 { font-size: 20px; font-weight: 700; color: #1e293b; margin: 0 0 4px; }
        .sig-card p.sub { font-size: 13px; color: #64748b; margin: 0 0 22px; }

        .sig-form { display: flex; flex-direction: column; gap: 14px; }

        .sig-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .sig-field { display: flex; flex-direction: column; gap: 5px; }
        .sig-field label { font-size: 12.5px; font-weight: 600; color: #334155; }
        .sig-field input,
        .sig-field textarea {
          padding: 11px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 9px;
          font-size: 14px;
          font-family: inherit;
          color: #1e293b;
          background: #fff;
          outline: none;
          transition: border-color .18s, box-shadow .18s;
          width: 100%;
          box-sizing: border-box;
        }
        .sig-field input:focus,
        .sig-field textarea:focus {
          border-color: #c2772b;
          box-shadow: 0 0 0 3px rgba(194,119,43,0.1);
        }
        .sig-field input.err,
        .sig-field textarea.err { border-color: #ef4444; }
        .sig-field .errmsg { font-size: 11.5px; color: #ef4444; }
        .sig-field textarea { resize: vertical; min-height: 90px; }

        .sig-submit {
          width: 100%; padding: 13px;
          background: #c2772b;
          color: #fff; border: none; border-radius: 10px;
          font-size: 15px; font-weight: 600; cursor: pointer;
          transition: background .18s, transform .15s, box-shadow .15s;
          box-shadow: 0 4px 14px rgba(194,119,43,0.25);
          font-family: inherit;
        }
        .sig-submit:hover:not(:disabled) {
          background: #a66522;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(194,119,43,0.35);
        }
        .sig-submit:disabled { opacity: .7; cursor: not-allowed; }

        .sig-note { text-align: center; font-size: 11.5px; color: #9ca3af; margin: 0; }

        /* Success */
        .sig-success { text-align: center; padding: 12px 0; }
        .sig-success-icon {
          width: 56px; height: 56px;
          background: #c2772b;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 14px; font-size: 24px; color: #fff;
        }
        .sig-success h3 { font-size: 20px; color: #1e293b; margin: 0 0 8px; }
        .sig-success p { font-size: 14px; color: #64748b; margin: 0 0 20px; line-height: 1.6; }
        .sig-home-btn {
          padding: 11px 28px;
          background: #c2772b;
          color: #fff; border: none; border-radius: 9px;
          font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit;
        }
        .sig-home-btn:hover { background: #a66522; }

        /* ─── Mobile ─── */
        @media (max-width: 700px) {
          .sig-hero-bar { padding: 28px 20px 32px; }

          .sig-body {
            grid-template-columns: 1fr;
            padding: 24px 16px 40px;
            gap: 24px;
          }

          /* form first, highlights second on mobile */
          .sig-card  { order: 1; padding: 24px 20px; }
          .sig-left  { order: 2; }

          .sig-highlights { flex-direction: row; flex-wrap: wrap; gap: 8px; }
          .sig-hl {
            background: #fdf2e4;
            border: 1px solid #f0d8b0;
            border-radius: 100px;
            padding: 7px 13px;
            font-size: 12.5px;
          }
          .sig-hl-icon { display: none; }

          .sig-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="sig-root">

        {/* ── Top hero bar: Back + Badge + Heading + Desc ── */}
        <div className="sig-hero-bar">
          <div className="sig-hero-inner">
            <button className="sig-back" onClick={() => navigate('/list-category')}>
              <ArrowLeft size={14} /> Back
            </button>
            <div><div className="sig-badge">
              <Star size={11} fill="currentColor" /> Signature Stays
            </div></div>
            <h1 className="sig-h1">
              List your property in <strong>Signature Stays</strong>
            </h1>
            <p className="sig-desc">
              Our curated category for luxury villas, premium suites & signature homes.
              Share your details and our team will personally onboard you.
            </p>
          </div>
        </div>

        {/* ── Body: highlights left, form right ── */}
        <div className="sig-body">

          {/* Left: highlights */}
          <div className="sig-left">
            <div className="sig-left-title">What you get</div>
            <div className="sig-highlights">
              {HIGHLIGHTS.map((h, i) => (
                <div key={i} className="sig-hl">
                  <div className="sig-hl-icon">{h.icon}</div>
                  {h.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form card */}
          <div className="sig-card">
            {done ? (
              <div className="sig-success">
                <div className="sig-success-icon">✓</div>
                <h3>Request Submitted!</h3>
                <p>Thank you! Our Signature Stays team will contact you within 24 hours.</p>
                <button className="sig-home-btn" onClick={() => navigate('/')}>Back to Home</button>
              </div>
            ) : (
              <>
                <h2>Contact Us to Get Listed</h2>
                <p className="sub">Fill in your details — we'll get back within 24 hours.</p>

                <form className="sig-form" onSubmit={handleSubmit} noValidate>
                  <div className="sig-field">
                    <label>Full Name *</label>
                    <input
                      name="name" type="text" value={form.name} onChange={handleChange}
                      placeholder="Your full name"
                      className={errors.name ? 'err' : ''}
                    />
                    {errors.name && <span className="errmsg">{errors.name}</span>}
                  </div>

                  <div className="sig-row">
                    <div className="sig-field">
                      <label>Phone *</label>
                      <input
                        name="phone" type="tel" value={form.phone} onChange={handleChange}
                        placeholder="10-digit mobile"
                        className={errors.phone ? 'err' : ''}
                      />
                      {errors.phone && <span className="errmsg">{errors.phone}</span>}
                    </div>
                    <div className="sig-field">
                      <label>Email *</label>
                      <input
                        name="email" type="email" value={form.email} onChange={handleChange}
                        placeholder="your@email.com"
                        className={errors.email ? 'err' : ''}
                      />
                      {errors.email && <span className="errmsg">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="sig-field">
                    <label>About your property *</label>
                    <textarea
                      name="message" value={form.message} onChange={handleChange}
                      placeholder="e.g. 4BHK luxury villa in Goa, fully furnished, pool, sea view..."
                      className={errors.message ? 'err' : ''}
                    />
                    {errors.message && <span className="errmsg">{errors.message}</span>}
                  </div>

                  <button type="submit" className="sig-submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Listing Request →'}
                  </button>

                  <p className="sig-note">Our team will contact you within 24 hours.</p>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default SignatureContactPage;
