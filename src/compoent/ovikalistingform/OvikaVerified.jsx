import React, { useEffect, useState } from 'react';

// ─── Responsive hook ──────────────────────────────────────────────────────────
const useViewport = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return { isMobile: width < 768 };
};

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  primary:       '#c17d2e',
  primaryDark:   '#a06320',
  primaryLight:  '#fdf5e8',
  primaryBorder: '#f0d5a0',
  verified:      '#16a34a',
  verifiedLight: '#f0fdf4',
  verifiedBorder:'#bbf7d0',
  textDark:      '#111827',
  textBody:      '#4b5563',
  textMuted:     '#9ca3af',
  bg:            '#fafaf9',
  white:         '#ffffff',
  border:        '#e5e7eb',
  whatsapp:      '#25D366',
};

const STEPS = [
  { icon: '🏠', title: 'Physical Inspection',  desc: 'Our team visits in person — verifies location, condition & amenities.' },
  { icon: '🛡️', title: 'Genuine Listings',      desc: 'Ownership confirmed to eliminate fraudulent or misleading listings.' },
  { icon: '✅', title: 'Accurate Details',      desc: 'Every amenity — Wi-Fi, bedrooms, power backup — physically confirmed.' },
];

const TRUST_CHIPS = ['No Hidden Charges', 'Team Visit Included', 'Certificate Provided'];

// ─── Icons ────────────────────────────────────────────────────────────────────
const WhatsAppIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={C.whatsapp}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.499-5.688-1.447l-6.309 1.655zm6.357-3.872l.45.267c1.535.911 3.424 1.393 5.362 1.394 5.42 0 9.831-4.411 9.833-9.832.001-2.628-1.023-5.098-2.883-6.958-1.859-1.86-4.329-2.885-6.958-2.885-5.421 0-9.831 4.411-9.834 9.832-.001 1.942.573 3.834 1.66 5.463l.293.438-1.096 4.008 4.102-1.077zm9.435-6.578c-.244-.121-1.442-.711-1.666-.793-.223-.081-.386-.121-.548.121-.162.243-.629.793-.771.954-.142.162-.284.182-.528.061-.243-.122-1.026-.378-1.953-1.206-.721-.643-1.208-1.437-1.35-1.68-.142-.243-.015-.375.106-.496.11-.11.244-.284.366-.425s.162-.243.244-.405c.081-.162.04-.304-.02-.425s-.548-1.319-.751-1.808c-.198-.476-.399-.411-.548-.419-.142-.007-.304-.008-.466-.008s-.426.061-.649.304c-.223.243-.853.832-.853 2.029s.872 2.35 1.015 2.532c.142.182 1.716 2.62 4.156 3.673.58.253 1.033.404 1.387.517.583.185 1.113.159 1.533.096.468-.07 1.442-.589 1.646-1.159.203-.57.203-1.056.142-1.157-.061-.101-.223-.162-.466-.283z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────
const OvikaVerified = () => {
  const { isMobile } = useViewport();

  const [formData,     setFormData]     = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [btnHover,     setBtnHover]     = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('https://www.townmanor.ai/api/formlead/leads', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:         formData.name,
          phone_number: formData.phone,
          purpose:      'Property Verification Request',
          source:       'OvikaVerified Page',
        }),
      });
      if (res.ok) setSubmitted(true);
    } catch (err) {
      console.error('Verification form error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = (field) => ({
    width:       '100%',
    padding:     '11px 14px',
    borderRadius:'10px',
    border:      `1.5px solid ${focusedField === field ? C.primary : C.border}`,
    boxShadow:   focusedField === field ? `0 0 0 3px rgba(193,125,46,0.12)` : 'none',
    fontSize:    '14px',
    color:       C.textDark,
    outline:     'none',
    transition:  'border-color 0.2s, box-shadow 0.2s',
    boxSizing:   'border-box',
    fontFamily:  '"Poppins", sans-serif',
    background:  '#fff',
  });

  // ── DESKTOP layout ──────────────────────────────────────────────────────────
  if (!isMobile) {
    return (
      <div style={{ fontFamily:'"Poppins", sans-serif', background: C.bg, minHeight:'100vh', color: C.textDark }}>

        {/* ── Main above-fold: 2-column, fills viewport ── */}
        <div style={{
          minHeight:   'calc(100vh - 0px)',
          display:     'flex',
          alignItems:  'center',
          background:  `linear-gradient(135deg, #fffdf8 0%, #fdf5e8 50%, #fef9f0 100%)`,
          borderBottom:`1px solid ${C.border}`,
          padding:     '80px 0 40px',
        }}>
          <div style={{
            maxWidth: '1240px',
            width:    '100%',
            margin:   '0 auto',
            padding:  '0 48px',
            display:  'grid',
            gridTemplateColumns: '1fr 420px',
            gap:      '64px',
            alignItems:'center',
          }}>

            {/* ── LEFT: info + steps ── */}
            <div>
              {/* Verified pill */}
              <div style={{
                display:      'inline-flex', alignItems:'center', gap:'8px',
                background:   C.verifiedLight, border:`1.5px solid ${C.verifiedBorder}`,
                borderRadius: '50px', padding:'5px 16px', marginBottom:'20px',
              }}>
                <span style={{ width:'7px', height:'7px', borderRadius:'50%', background: C.verified, display:'block' }} />
                <span style={{ fontSize:'11px', fontWeight:'700', color: C.verified, letterSpacing:'0.8px', textTransform:'uppercase' }}>
                  Verified Properties Program
                </span>
              </div>

              {/* Badge + Headline row */}
              <div style={{ display:'flex', alignItems:'center', gap:'20px', marginBottom:'16px' }}>
                <img
                  src="/ovikaver.png"
                  alt="OvikaLiving Verified Badge"
                  style={{ width:'90px', height:'auto', flexShrink:0 }}
                />
                <h1 style={{
                  fontSize:'42px', fontWeight:'800', lineHeight:'1.2',
                  letterSpacing:'-0.5px', color: C.textDark, margin:0,
                }}>
                  The <span style={{ color: C.primary }}>OvikaLiving</span>
                  <br />Verified Standard
                </h1>
              </div>

              {/* Subtext */}
              <p style={{
                fontSize:'16px', color: C.textBody, lineHeight:'1.7',
                marginBottom:'28px', maxWidth:'520px',
              }}>
                Every badge-bearing property has been{' '}
                <strong style={{ color: C.textDark }}>physically inspected</strong> by our team —
                guaranteeing genuine listings, accurate details, and stays you can trust.
              </p>

              {/* 3 step cards — horizontal compact row */}
              <div style={{ display:'flex', flexDirection:'column', gap:'12px', marginBottom:'28px' }}>
                {STEPS.map((step) => (
                  <div key={step.title} style={{
                    display:      'flex',
                    alignItems:   'flex-start',
                    gap:          '14px',
                    background:   C.white,
                    borderRadius: '14px',
                    padding:      '14px 18px',
                    border:       `1px solid ${C.border}`,
                    boxShadow:    '0 2px 8px rgba(0,0,0,0.04)',
                    position:     'relative',
                    overflow:     'hidden',
                  }}>
                    {/* Left accent */}
                    <div style={{
                      position:'absolute', left:0, top:0, bottom:0, width:'3px',
                      background:`linear-gradient(180deg, ${C.primary}, #e8a84a)`,
                      borderRadius:'14px 0 0 14px',
                    }} />
                    <span style={{ fontSize:'24px', lineHeight:'1', marginTop:'2px' }}>{step.icon}</span>
                    <div>
                      <div style={{ fontSize:'14px', fontWeight:'700', color: C.textDark, marginBottom:'3px' }}>{step.title}</div>
                      <div style={{ fontSize:'13px', color: C.textBody, lineHeight:'1.5' }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust chips */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                {TRUST_CHIPS.map((chip) => (
                  <span key={chip} style={{
                    display:'inline-flex', alignItems:'center', gap:'5px',
                    background: C.verifiedLight, border:`1px solid ${C.verifiedBorder}`,
                    borderRadius:'7px', padding:'5px 12px',
                    fontSize:'12px', fontWeight:'600', color: C.verified,
                  }}>
                    <CheckIcon />{chip}
                  </span>
                ))}
              </div>
            </div>

            {/* ── RIGHT: form card ── */}
            <div>
              <div style={{
                background:   C.white,
                borderRadius: '24px',
                padding:      '36px 32px',
                boxShadow:    `0 16px 56px rgba(193,125,46,0.12)`,
                border:       `1px solid ${C.primaryBorder}`,
              }}>
                {!submitted ? (
                  <>
                    <div style={{ marginBottom:'20px' }}>
                      <h3 style={{ fontSize:'22px', fontWeight:'800', color: C.textDark, marginBottom:'6px' }}>
                        Request Verification
                      </h3>
                      <p style={{ fontSize:'13px', color: C.textBody, lineHeight:'1.6', margin:0 }}>
                        Our team will reach out within 24 hours.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div style={{ marginBottom:'14px' }}>
                        <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color: C.textBody, marginBottom:'5px' }}>
                          Full Name
                        </label>
                        <input
                          type="text" placeholder="e.g. Rahul Sharma" required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          style={inputStyle('name')}
                        />
                      </div>
                      <div style={{ marginBottom:'18px' }}>
                        <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color: C.textBody, marginBottom:'5px' }}>
                          Mobile Number
                        </label>
                        <input
                          type="tel" placeholder="10-digit mobile number"
                          pattern="[0-9]{10}" required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          onFocus={() => setFocusedField('phone')}
                          onBlur={() => setFocusedField(null)}
                          style={inputStyle('phone')}
                        />
                      </div>
                      <button
                        type="submit" disabled={isSubmitting}
                        onMouseEnter={() => setBtnHover(true)}
                        onMouseLeave={() => setBtnHover(false)}
                        style={{
                          width:'100%', padding:'13px',
                          borderRadius:'11px', border:'none',
                          background: btnHover ? C.primaryDark : C.primary,
                          color:'#fff', fontSize:'15px', fontWeight:'700',
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          transition:'background 0.2s',
                          fontFamily:'"Poppins", sans-serif',
                          opacity: isSubmitting ? 0.75 : 1,
                        }}
                      >
                        {isSubmitting ? 'Submitting…' : 'Submit Verification Request →'}
                      </button>
                    </form>

                    {/* WhatsApp */}
                    <div style={{ marginTop:'20px', paddingTop:'18px', borderTop:`1px solid ${C.border}` }}>
                      <p style={{ fontSize:'12px', color: C.textMuted, marginBottom:'10px', textAlign:'center' }}>
                        Or connect directly via WhatsApp
                      </p>
                      <a
                        href="https://wa.me/919319392227"
                        target="_blank" rel="noopener noreferrer"
                        style={{
                          display:'flex', alignItems:'center', justifyContent:'center', gap:'10px',
                          background: C.verifiedLight, border:`1px solid ${C.verifiedBorder}`,
                          borderRadius:'11px', padding:'11px 16px',
                          textDecoration:'none',
                        }}
                      >
                        <WhatsAppIcon size={22} />
                        <span style={{ fontSize:'15px', fontWeight:'700', color: C.textDark }}>
                          +91 93193 92227
                        </span>
                      </a>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign:'center', padding:'32px 16px' }}>
                    <div style={{ fontSize:'52px', marginBottom:'14px' }}>🎉</div>
                    <div style={{ fontSize:'20px', fontWeight:'700', color: C.verified, marginBottom:'8px' }}>
                      Request Received!
                    </div>
                    <p style={{ fontSize:'14px', color: C.textBody, lineHeight:'1.7', margin:0 }}>
                      Our verification team will contact you within 24 hours.
                      Thank you for choosing OvikaLiving.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ── Process image — below fold ── */}
        <div style={{
          background:  C.white,
          borderBottom:`1px solid ${C.border}`,
          padding:     '60px 48px',
          textAlign:   'center',
        }}>
          <div style={{ maxWidth:'1240px', margin:'0 auto' }}>
            <span style={{
              display:'inline-block', background: C.primaryLight, color: C.primary,
              fontSize:'11px', fontWeight:'700', letterSpacing:'1.5px',
              textTransform:'uppercase', padding:'5px 16px', borderRadius:'50px', marginBottom:'24px',
            }}>
              Behind the Badge
            </span>
            <div>
              <img
                src="/verifyimage.png"
                alt="OvikaLiving verification process"
                style={{
                  width:'100%', maxWidth:'960px',
                  borderRadius:'20px', border:`1px solid ${C.border}`,
                  boxShadow:'0 16px 48px rgba(0,0,0,0.07)',
                }}
              />
            </div>
          </div>
        </div>

      </div>
    );
  }

  // ── MOBILE layout ────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily:'"Poppins", sans-serif', background: C.bg, minHeight:'100vh', color: C.textDark }}>

      {/* Hero */}
      <section style={{
        background:     `linear-gradient(150deg, #fff 0%, #fdf5e8 60%, #fef9f0 100%)`,
        padding:        '88px 24px 40px',
        borderBottom:   `1px solid ${C.border}`,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        textAlign:      'center',
      }}>
        {/* Verified pill */}
        <div style={{
          display:'inline-flex', alignItems:'center', gap:'7px',
          background: C.verifiedLight, border:`1.5px solid ${C.verifiedBorder}`,
          borderRadius:'50px', padding:'5px 14px', marginBottom:'20px',
          flexShrink: 0,
        }}>
          <span style={{ width:'7px', height:'7px', borderRadius:'50%', background: C.verified, flexShrink:0 }} />
          <span style={{ fontSize:'11px', fontWeight:'700', color: C.verified, letterSpacing:'0.7px', textTransform:'uppercase', whiteSpace:'nowrap' }}>
            Verified Properties Program
          </span>
        </div>

        <img
          src="/ovikaver.png" alt="OvikaLiving Verified Badge"
          style={{ width:'130px', height:'auto', marginBottom:'20px', display:'block' }}
        />

        <h1 style={{ fontSize:'26px', fontWeight:'800', lineHeight:'1.3', color: C.textDark, marginBottom:'14px', width:'100%' }}>
          The <span style={{ color: C.primary }}>OvikaLiving</span>
          <br />Verified Standard
        </h1>

        <p style={{ fontSize:'14px', color: C.textBody, lineHeight:'1.75', marginBottom:'0', maxWidth:'340px' }}>
          Every badge-bearing property has been{' '}
          <strong style={{ color: C.textDark }}>physically inspected</strong> by our team —
          genuine listings, accurate details, trusted stays.
        </p>
      </section>

      {/* Steps */}
      <section style={{ padding:'32px 20px', background: C.bg }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {STEPS.map((step) => (
            <div key={step.title} style={{
              display:'flex', alignItems:'flex-start', gap:'14px',
              background: C.white, borderRadius:'14px', padding:'16px',
              border:`1px solid ${C.border}`, boxShadow:'0 2px 8px rgba(0,0,0,0.04)',
              position:'relative', overflow:'hidden',
            }}>
              <div style={{
                position:'absolute', left:0, top:0, bottom:0, width:'3px',
                background:`linear-gradient(180deg, ${C.primary}, #e8a84a)`,
                borderRadius:'14px 0 0 14px',
              }} />
              <span style={{ fontSize:'26px', lineHeight:'1', marginTop:'2px' }}>{step.icon}</span>
              <div>
                <div style={{ fontSize:'14px', fontWeight:'700', color: C.textDark, marginBottom:'3px' }}>{step.title}</div>
                <div style={{ fontSize:'13px', color: C.textBody, lineHeight:'1.5' }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section style={{ padding:'0 20px 40px' }}>
        <div style={{
          background: C.white, borderRadius:'20px',
          padding:'28px 24px',
          boxShadow:`0 12px 40px rgba(193,125,46,0.1)`,
          border:`1px solid ${C.primaryBorder}`,
        }}>
          {!submitted ? (
            <>
              <h3 style={{ fontSize:'20px', fontWeight:'800', color: C.textDark, marginBottom:'6px' }}>
                Request Verification
              </h3>
              <p style={{ fontSize:'13px', color: C.textBody, marginBottom:'22px', lineHeight:'1.6' }}>
                Our team will reach out within 24 hours.
              </p>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom:'14px' }}>
                  <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color: C.textBody, marginBottom:'5px' }}>
                    Full Name
                  </label>
                  <input
                    type="text" placeholder="e.g. Rahul Sharma" required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle('name')}
                  />
                </div>
                <div style={{ marginBottom:'18px' }}>
                  <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color: C.textBody, marginBottom:'5px' }}>
                    Mobile Number
                  </label>
                  <input
                    type="tel" placeholder="10-digit mobile number"
                    pattern="[0-9]{10}" required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle('phone')}
                  />
                </div>
                <button
                  type="submit" disabled={isSubmitting}
                  style={{
                    width:'100%', padding:'14px', borderRadius:'11px', border:'none',
                    background: C.primary, color:'#fff', fontSize:'15px', fontWeight:'700',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontFamily:'"Poppins", sans-serif',
                    opacity: isSubmitting ? 0.75 : 1,
                  }}
                >
                  {isSubmitting ? 'Submitting…' : 'Submit Verification Request →'}
                </button>
              </form>

              <div style={{ marginTop:'18px', paddingTop:'16px', borderTop:`1px solid ${C.border}` }}>
                <p style={{ fontSize:'12px', color: C.textMuted, marginBottom:'10px', textAlign:'center' }}>
                  Or connect via WhatsApp
                </p>
                <a
                  href="https://wa.me/919319392227"
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display:'flex', alignItems:'center', justifyContent:'center', gap:'10px',
                    background: C.verifiedLight, border:`1px solid ${C.verifiedBorder}`,
                    borderRadius:'11px', padding:'12px 16px', textDecoration:'none',
                  }}
                >
                  <WhatsAppIcon size={22} />
                  <span style={{ fontSize:'15px', fontWeight:'700', color: C.textDark }}>+91 93193 92227</span>
                </a>
              </div>
            </>
          ) : (
            <div style={{ textAlign:'center', padding:'24px 0' }}>
              <div style={{ fontSize:'48px', marginBottom:'12px' }}>🎉</div>
              <div style={{ fontSize:'18px', fontWeight:'700', color: C.verified, marginBottom:'8px' }}>Request Received!</div>
              <p style={{ fontSize:'14px', color: C.textBody, lineHeight:'1.7', margin:0 }}>
                Our verification team will contact you within 24 hours.
              </p>
            </div>
          )}
        </div>

        {/* Trust chips */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'16px', justifyContent:'center' }}>
          {TRUST_CHIPS.map((chip) => (
            <span key={chip} style={{
              display:'inline-flex', alignItems:'center', gap:'5px',
              background: C.verifiedLight, border:`1px solid ${C.verifiedBorder}`,
              borderRadius:'7px', padding:'5px 12px',
              fontSize:'12px', fontWeight:'600', color: C.verified,
            }}>
              <CheckIcon />{chip}
            </span>
          ))}
        </div>
      </section>

      {/* Process image */}
      <section style={{ padding:'0 20px 48px', textAlign:'center' }}>
        <img
          src="/verifyimage.png" alt="Verification process"
          style={{ width:'100%', borderRadius:'16px', border:`1px solid ${C.border}`, boxShadow:'0 8px 24px rgba(0,0,0,0.07)' }}
        />
      </section>

    </div>
  );
};

export default OvikaVerified;
