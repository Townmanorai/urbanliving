import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home2.css";
import { navClick, auxNavClick } from '../../utils/navClick';

const FEATURES = [
  { icon: "🔨", label: "Free Renovation" },
  { icon: "💰", label: "Profit Sharing" },
  { icon: "🛡", label: "Zero Risk" },
  { icon: "📋", label: "We Manage All" },
];

const STEPS = [
  { no: "01", text: "Share your property with us" },
  { no: "02", text: "We renovate & furnish it" },
  { no: "03", text: "We find & manage tenants" },
  { no: "04", text: "You earn monthly" },
];

const Home2 = () => {
  const navigate = useNavigate();

  return (
    <section className="living-container">

      {/* Header */}
      <div className="living-header">
        <div className="living-eyebrow">✦ Property Partnership</div>
      </div>

      {/* Card */}
      <div className="living-card-container">
        <div className="living-card">

          {/* Image */}
          <div className="living-img-wrap" style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1572120360610-d971b5d68c54?w=700&q=80&auto=format&fit=crop"
              alt="Renovate and earn"
              className="living-img"
              onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80'; }}
            />
            <div className="living-img-badge" style={{ background: 'linear-gradient(135deg,#c2772b,#e09a4f)' }}>Renovate & Earn</div>

            {/* Floating stat cards */}
            <div style={{
              position: 'absolute', bottom: 16, left: 16,
              background: 'rgba(255,255,255,0.95)', borderRadius: 12,
              padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              backdropFilter: 'blur(8px)',
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#c2772b', lineHeight: 1 }}>30%</div>
              <div style={{ fontSize: '0.6rem', color: '#666', fontWeight: 500 }}>Avg Profit Share</div>
            </div>

            <div style={{
              position: 'absolute', top: 16, right: 16,
              background: 'rgba(255,255,255,0.95)', borderRadius: 12,
              padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              backdropFilter: 'blur(8px)',
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#c2772b', lineHeight: 1 }}>₹0</div>
              <div style={{ fontSize: '0.6rem', color: '#666', fontWeight: 500 }}>Investment Needed</div>
            </div>
          </div>

          {/* Content */}
          <div className="living-content">
            <h3 className="living-title">
              Unused Property?<br />
              <span style={{ color: '#c2772b' }}>We Renovate & Share Profits</span>
            </h3>
            <p className="living-text">
              Have an old or idle property? Partner with OvikaLiving — we renovate, furnish, and manage it for you. You sit back and earn monthly profit without lifting a finger. Available in Noida & Greater Noida.
            </p>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {STEPS.map(s => (
                <div key={s.no} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg,#c2772b,#e09a4f)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.6rem', fontWeight: 800, color: '#fff',
                  }}>{s.no}</div>
                  <span style={{ fontSize: '0.82rem', color: '#3a2a1a', fontWeight: 500 }}>{s.text}</span>
                </div>
              ))}
            </div>

            {/* Feature chips */}
            <div className="living-features">
              {FEATURES.map(f => (
                <div key={f.label} className="living-feature-chip">
                  <span>{f.icon}</span> {f.label}
                </div>
              ))}
            </div>

            <button
              className="living-btn"
              onClick={(e) => navClick(e, "/renovation", navigate)}
              onAuxClick={(e) => auxNavClick(e, "/renovation")}
            >
              Explore Partnership <span className="arrow-main-new">→</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Home2;
