import React from 'react';
import './OvikaSelfVerified.css';

// ─── SVG Shield ──────────────────────────────────────────────────────────────
const ShieldBadge = ({ size = 110 }) => (
  <svg width={size} height={size * 1.18} viewBox="0 0 130 155" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldRim"    x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F5C842" /><stop offset="100%" stopColor="#C88A0A" /></linearGradient>
      <linearGradient id="shieldBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F07828" /><stop offset="100%" stopColor="#B84808" /></linearGradient>
      <linearGradient id="ribbon"     x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#C03A00" /><stop offset="50%" stopColor="#E05808" /><stop offset="100%" stopColor="#C03A00" /></linearGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <path d="M65 3 L124 28 L124 82 C124 118 65 150 65 150 C65 150 6 118 6 82 L6 28 Z" fill="url(#goldRim)" />
    <path d="M65 10 L117 33 L117 82 C117 114 65 143 65 143 C65 143 13 114 13 82 L13 33 Z" fill="url(#shieldBody)" />
    <path d="M13 66 L117 66 L117 97 C105 107 87 116 65 121 C43 116 25 107 13 97 Z" fill="url(#ribbon)" />
    <path d="M4 63 L13 68 L13 95 L4 90 Z" fill="#9C2E00" />
    <path d="M126 63 L117 68 L117 95 L126 90 Z" fill="#9C2E00" />
    <text x="65" y="87"  textAnchor="middle" fontFamily="serif" fontSize="12.5" fontWeight="700" fill="#FFF8EE" letterSpacing="0.8">VERIFIED</text>
    <text x="65" y="109" textAnchor="middle" fontFamily="serif" fontSize="10.5" fontWeight="600" fill="#FFF8EE" letterSpacing="0.8">SELF</text>
    <path d="M40 40 L57 58 L90 25" stroke="#FFFAEA" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#glow)" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const benefits = [
  { icon: '📈', title: 'Higher Search Ranking', desc: 'Your listing climbs to the top, making it easier for renters to find you.',       tag: '3× more visibility' },
  { icon: '🛡️', title: 'Builds Renter Trust',   desc: 'A verified badge signals authenticity — renters book with confidence.',           tag: 'Trusted listing'    },
  { icon: '📬', title: 'More Enquiries',         desc: 'Verified listings receive significantly more messages from renters.',              tag: 'More leads'         },
  { icon: '🏠', title: 'Faster Bookings',        desc: 'Greater visibility and trust translates into higher and faster booking rates.',   tag: 'Quicker occupancy'  },
];

const steps = [
  { action: 'Upload Exterior Photo',    desc: 'A clear photo of your building entrance is required for location validation.',        tag: '📷 Photo required'   },
  { action: 'Upload Interior Photos',   desc: 'At least 3 photos — bedroom, living room, bathroom, and kitchen.',                   tag: '🖼️ Minimum 3 photos' },
  { action: 'Walkthrough Video',        desc: 'Record a 30–60 second video walking through the property.',                         tag: '🎥 30–60 seconds'    },
  { action: 'Confirm Property Location',desc: 'Pin your exact property on the map to confirm the address.',                         tag: '📍 Map confirmation'  },
  { action: 'Verify Mobile Number',     desc: 'Receive an OTP on your mobile. Optional ID upload for higher trust tier.',           tag: '📱 OTP via mobile'   },
];

const perks = [
  { icon: '🏅', text: 'SELF-VERIFIED badge displayed on your listing'    },
  { icon: '🔝', text: 'Higher position in OvikaLiving search results'    },
  { icon: '🤝', text: 'Greater trust & credibility with renters'          },
  { icon: '📊', text: 'Access to enhanced listing analytics'              },
];

const stats = [
  { num: '3×',   label: 'More Visibility' },
  { num: '2 min',label: 'To Complete'     },
  { num: '10k+', label: 'Verified Owners' },
  { num: '98%',  label: 'Approval Rate'   },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function OvikaSelfVerified({ onOpenForm }) {
  return (
    <div className="svp-root">

      {/* ══════════════════════════════════════════════
          HERO — 2-column desktop
      ══════════════════════════════════════════════ */}
      <section className="svp-hero">
        <div className="svp-hero-bg1" />
        <div className="svp-hero-bg2" />
        <div className="svp-hero-dots" />

        <div className="svp-hero-inner">

          {/* Left: text + actions + stats */}
          <div className="svp-hero-left">
            <div className="svp-eyebrow">OvikaLiving · Self-Verification</div>

            <h1 className="svp-hero-h1">
              Get Your Property<br />
              <span className="svp-accent">Self-Verified</span>
            </h1>

            <p className="svp-hero-desc">
              Verify your listing in minutes and stand out to thousands of renters looking for trusted homes.
            </p>

            <div className="svp-hero-actions">
              <button className="svp-btn-primary" onClick={onOpenForm}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Verification
              </button>
              <div className="svp-mobile-note">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" strokeLinecap="round" strokeWidth="3" />
                </svg>
                Mobile-only verification
              </div>
            </div>

            {/* Stats inline in hero */}
            <div className="svp-hero-stats">
              {stats.map((s) => (
                <div className="svp-hero-stat" key={s.num}>
                  <div className="svp-hero-stat-num">{s.num}</div>
                  <div className="svp-hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: shield + badge card */}
          <div className="svp-hero-right">
            <div className="svp-shield-wrap">
              <ShieldBadge size={130} />
            </div>
            <div className="svp-hero-badge-card">
              <div className="svp-verified-chip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Self-Verified
              </div>
              <p className="svp-hero-badge-text">Your listing gets this badge — a mark of trust renters look for.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WHY — compact 4-col benefits
      ══════════════════════════════════════════════ */}
      <section className="svp-why">
        <div className="svp-section-wrap">
          <div className="svp-section-head">
            <div className="svp-eyebrow">Why It Matters</div>
            <h2 className="svp-section-title">Why Verify Your <span className="svp-accent">Property?</span></h2>
            <p className="svp-section-desc">
              Self-verification is the fastest way to build credibility and reach more renters on OvikaLiving.
            </p>
          </div>
          <div className="svp-benefits-grid">
            {benefits.map((b) => (
              <div className="svp-benefit-card" key={b.title}>
                <div className="svp-benefit-icon">{b.icon}</div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
                <div className="svp-benefit-tag">{b.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STEPS + PERKS — 2-column
      ══════════════════════════════════════════════ */}
      <section className="svp-middle">
        <div className="svp-middle-inner">

          {/* Left: steps */}
          <div className="svp-steps-col">
            <div className="svp-eyebrow">How It Works</div>
            <h2 className="svp-section-title" style={{ marginBottom: 8 }}>
              Steps to <span className="svp-accent">Complete</span>
            </h2>
            <p className="svp-section-desc" style={{ marginBottom: 28 }}>
              Follow these simple steps on your mobile device.
            </p>
            <div className="svp-steps-list">
              {steps.map((s, i) => (
                <div className="svp-step-row" key={i}>
                  <div className="svp-step-num">{i + 1}</div>
                  <div className="svp-step-box">
                    <h4>{s.action}</h4>
                    <p>{s.desc}</p>
                    <div className="svp-step-tag">{s.tag}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: badge preview + perks */}
          <div className="svp-perks-col">
            <div className="svp-badge-preview">
              <svg className="svp-preview-shield" viewBox="0 0 130 155" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="pg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F5C842" /><stop offset="100%" stopColor="#C88A0A" /></linearGradient>
                  <linearGradient id="pg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F07828" /><stop offset="100%" stopColor="#B84808" /></linearGradient>
                  <linearGradient id="pg3" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#C03A00" /><stop offset="50%" stopColor="#E05808" /><stop offset="100%" stopColor="#C03A00" /></linearGradient>
                </defs>
                <path d="M65 3 L124 28 L124 82 C124 118 65 150 65 150 C65 150 6 118 6 82 L6 28 Z" fill="url(#pg1)" />
                <path d="M65 10 L117 33 L117 82 C117 114 65 143 65 143 C65 143 13 114 13 82 L13 33 Z" fill="url(#pg2)" />
                <path d="M13 66 L117 66 L117 97 C105 107 87 116 65 121 C43 116 25 107 13 97 Z" fill="url(#pg3)" />
                <path d="M4 63 L13 68 L13 95 L4 90 Z" fill="#9C2E00" />
                <path d="M126 63 L117 68 L117 95 L126 90 Z" fill="#9C2E00" />
                <text x="65" y="87"  textAnchor="middle" fontFamily="serif" fontSize="12.5" fontWeight="700" fill="#FFF8EE" letterSpacing="0.8">VERIFIED</text>
                <text x="65" y="109" textAnchor="middle" fontFamily="serif" fontSize="10.5" fontWeight="600" fill="#FFF8EE" letterSpacing="0.8">SELF</text>
                <path d="M40 40 L57 58 L90 25" stroke="#FFFAEA" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <div className="svp-verified-chip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Self-Verified
              </div>
              <h3>Your Listing Gets This Badge</h3>
              <p>A mark of trust that renters look for when choosing a home.</p>
            </div>

            <div className="svp-after-head">
              <div className="svp-eyebrow" style={{ marginBottom: 8 }}>After Verification</div>
              <h2 className="svp-section-title" style={{ marginBottom: 6, fontSize: 22 }}>
                What You <span className="svp-accent">Unlock</span>
              </h2>
            </div>
            <div className="svp-perks-list">
              {perks.map((p) => (
                <div className="svp-perk-row" key={p.text}>
                  <div className="svp-perk-icon">{p.icon}</div>
                  <p>{p.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          NOTE + CTA — combined compact
      ══════════════════════════════════════════════ */}
      <section className="svp-cta">
        <div className="svp-cta-inner">
          <div className="svp-note-inline">
            <span className="svp-note-icon">ℹ️</span>
            <p>Self-verified listings use owner-submitted photos & videos. OvikaLiving performs digital checks to maintain authenticity standards.</p>
          </div>
          <h2>Ready to Get <span className="svp-accent-gold">Verified?</span></h2>
          <p className="svp-cta-sub">Fill in your details and get your badge within minutes.</p>
          <button className="svp-btn-cta" onClick={onOpenForm}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start Self-Verification
          </button>
          <div className="svp-cta-mobile-note">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="2" width="14" height="20" rx="2" />
            </svg>
            Verification available on mobile only
          </div>
        </div>
      </section>


    </div>
  );
}
