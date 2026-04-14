
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home2.css";

const FEATURES = [
  { icon: "🏠", label: "Fully Furnished" },
  { icon: "⚡", label: "Instant Move-in" },
  { icon: "🤝", label: "Community Living" },
  { icon: "🛡", label: "Zero Brokerage" },
];

const Home2 = () => {
  const navigate = useNavigate();

  return (
    <section className="living-container">

      {/* Header */}
      <div className="living-header">
        <div className="living-eyebrow">✦ Community Living</div>
        <h2 className="living-heading">
          Explore <span className="highlight">Co-Living</span> Spaces
        </h2>
        <p className="living-subtext">
          Modern, community-driven homes for young professionals &amp; urban residents
        </p>
      </div>

      {/* Card */}
      <div className="living-card-container">
        <div className="living-card">

          {/* Image */}
          <div className="living-img-wrap">
            <img src="/colivingspace.jpeg" alt="Co-Living Spaces" className="living-img" />
            <div className="living-img-badge">Co-Living</div>
          </div>

          {/* Content */}
          <div className="living-content">
            <h3 className="living-title">Live Smarter, Together</h3>
            <p className="living-text">
              Ovika Co-Living brings thoughtfully designed, community-driven spaces for young professionals in Noida &amp; Greater Noida. Fully furnished homes, smart amenities, and vibrant shared spaces — hassle-free living from day one.
            </p>

            {/* Feature chips */}
            <div className="living-features">
              {FEATURES.map(f => (
                <div key={f.label} className="living-feature-chip">
                  <span>{f.icon}</span> {f.label}
                </div>
              ))}
            </div>

            <button className="living-btn" onClick={() => navigate("/coliving-space")}>
              Coming Soon <span className="arrow-main-new">→</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Home2;
