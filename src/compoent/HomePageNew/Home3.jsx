import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Home3.css";

const rentersSteps = [
  {
    stepNo: "1",
    title: "Explore Stays",
    desc: "Browse curated studios and apartments in Noida & Greater Noida.",
    imageUrl: "/home3rents1.png", // Using the previous available images or fallbacks
  },
  {
    stepNo: "2",
    title: "Select & Book",
    desc: "Choose your preferred stay and confirm instantly online.",
    imageUrl: "/home3rents2.png", 
  },
  {
    stepNo: "3",
    title: "Easy Check-in",
    desc: "Enjoy hassle-free arrival with OvikaLiving support.",
    imageUrl: "/home3rents3.png", 
  },
  {
    stepNo: "4",
    title: "Live Smart",
    desc: "Experience comfortable urban living with managed stays.",
    imageUrl: "/home3rents4.png", 
  },
];

const ownersSteps = [
  {
    stepNo: "1",
    title: "List Your Property",
    desc: "Submit your apartment, studio, or flat on the OvikaLiving platform.",
    imageUrl: "/home3owner1.png", 
  },
  {
    stepNo: "2",
    title: "Property Setup",
    desc: "Our team verifies, photographs, and prepares the listing.",
    imageUrl: "/home3owner2.png", 
  },
  {
    stepNo: "3",
    title: "Go Live",
    desc: "Your property becomes visible to renters searching on OvikaLiving.",
    imageUrl: "/home3owner3.png", 
  },
  {
    stepNo: "4",
    title: "Earn Passive Income",
    desc: "We manage bookings, guest support, and payments.",
    imageUrl: "/home3owner4.png", 
  },
];

const rentersCTA = {
  heading: (
    <>
      Find Your Next <span className="highlight">Smart Stay</span>
    </>
  ),
  checks: ["Fully Furnished Studios", "Prime Locations", "Flexible Rentals"],
  btnText: "BROWSE STAYS",
  footnote: "Smart rentals for tenants and effortless income for property owners.",
};

const ownersCTA = {
  heading: (
    <>
      Turn Your Property Into <span className="highlight">Passive Income</span>
    </>
  ),
  checks: ["Free Listing", "Managed by OvikaLiving", "Verified Tenants"],
  btnText: "LIST YOUR PROPERTY",
  footnote: "Join property owners earning with OvikaLiving in Noida & Greater Noida.",
};

const Home3 = () => {
  const [tab, setTab] = useState("owners"); // "renters" | "owners"
  const navigate = useNavigate();

  const handleCTAClick = () => {
    if (tab === "renters") {
      navigate("/properties");
    } else {
      // Trigger the Listing Category popup in Navbar.jsx via custom event
      window.dispatchEvent(new CustomEvent("openRentalCategoryPopup"));
    }
  };

  const steps = tab === "renters" ? rentersSteps : ownersSteps;
  const cta = tab === "renters" ? rentersCTA : ownersCTA;
  const subtitle = tab === "renters"
    ? "Smart rentals & urban living"
    : "Smart rentals & passive income";

  return (
    <section className={`home3-section ${tab}-active`}>
      <div className="home3-container">
        
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            display: 'inline-flex',
            background: 'rgba(194,119,43,0.1)',
            border: '1px solid rgba(194,119,43,0.25)',
            borderRadius: 20,
            padding: '5px 18px',
            fontSize: '0.62rem',
            color: '#c2772b',
            letterSpacing: '1.4px',
            textTransform: 'uppercase',
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
          }}>✦ How OvikaLiving Works</div>
        </div>

        <div className="home3-toggle">
          <div className="home3-toggle-pill">
            <button
              className={`home3-toggle-btn ${tab === "renters" ? "active" : ""}`}
              onClick={() => setTab("renters")}
            >
              For Renters
            </button>
            <button
              className={`home3-toggle-btn ${tab === "owners" ? "active" : ""}`}
              onClick={() => setTab("owners")}
            >
              For Property Owners
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="home3-steps-desktop">
          {steps.map((s, i) => (
            <div className="home3-step-card" key={i}>
              <div className="home3-step-label">Step {s.stepNo}</div>
              <div className="home3-step-icon">
                {s.imageUrl ? <img src={s.imageUrl} alt={s.title} /> : <span>🏠</span>}
              </div>
              <h3 className="home3-step-title">{s.title}</h3>
              <p className="home3-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Mobile Layout */}
        <div className="home3-steps-mobile">
          {steps.map((s, i) => (
            <div key={i}>
              <div className="home3-mobile-card">
                <div className="home3-mobile-icon">
                  {s.imageUrl ? <img src={s.imageUrl} alt={s.title} /> : <span>🏠</span>}
                </div>
                <div className="home3-mobile-content">
                  <div className="home3-mobile-label">Step {s.stepNo} of 4</div>
                  <h3 className="home3-mobile-title">{s.title}</h3>
                  <p className="home3-mobile-desc">{s.desc}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, margin: '2px 0' }}>
                  <div style={{ width: 1.5, height: 8, background: 'linear-gradient(to bottom, #e8c88a, #c2772b)', borderRadius: 2 }} />
                  <span style={{ fontSize: '0.75rem', color: '#c2772b', lineHeight: 1 }}>↓</span>
                  <div style={{ width: 1.5, height: 8, background: 'linear-gradient(to bottom, #c2772b, #e8c88a)', borderRadius: 2 }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="home3-cta">
          <h2 className="home3-cta-title">{cta.heading}</h2>
          <div className="home3-cta-features">
            {cta.checks.map((c, i) => (
              <div className="home3-feature" key={i}>
                <span className="home3-feature-icon">✓</span>
                {c}
              </div>
            ))}
          </div>
          <button className="home3-cta-btn" onClick={handleCTAClick}>{cta.btnText}</button>
        </div>

        {/* Premium Verified Badges */}
        <div className="h3-vbadge-wrap">
          <h2 className="h3-vbadge-heading">Get your property <span style={{ color: '#C98B3E' }}>verified</span></h2>
          <p className="h3-vbadge-subheading">— Earn more visibility and win bookings faster —</p>
          <div className="h3-vbadge-row">

            {/* OvikaLiving Verified — green */}
            <Link to="/ovika-verified" className="h3-vbadge">
              <div className="h3-vbadge-shield-wrap">
                <svg viewBox="0 0 130 155" fill="none" xmlns="http://www.w3.org/2000/svg" className="h3-vbadge-shield">
                  <defs>
                    <linearGradient id="gRim"  x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#E8D45A"/><stop offset="100%" stopColor="#A88A00"/></linearGradient>
                    <linearGradient id="gBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3a7d44"/><stop offset="100%" stopColor="#1a4a20"/></linearGradient>
                    <linearGradient id="gRib"  x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#1a4a20"/><stop offset="50%" stopColor="#2d6e38"/><stop offset="100%" stopColor="#1a4a20"/></linearGradient>
                  </defs>
                  <path d="M65 3 L124 28 L124 82 C124 118 65 150 65 150 C65 150 6 118 6 82 L6 28 Z" fill="url(#gRim)"/>
                  <path d="M65 10 L117 33 L117 82 C117 114 65 143 65 143 C65 143 13 114 13 82 L13 33 Z" fill="url(#gBody)"/>
                  <path d="M13 66 L117 66 L117 97 C105 107 87 116 65 121 C43 116 25 107 13 97 Z" fill="url(#gRib)"/>
                  <path d="M4 63 L13 68 L13 95 L4 90 Z" fill="#0e3518"/>
                  <path d="M126 63 L117 68 L117 95 L126 90 Z" fill="#0e3518"/>
                  <path d="M38 72 L55 92 L92 52" stroke="#E8D45A" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <div className="h3-vbadge-text">
                <div className="h3-vbadge-top h3-vbadge-top--green">
                  <span className="h3-vbadge-title">OvikaLiving Verified</span>
                </div>
                <div className="h3-vbadge-bottom">
                  <span className="h3-vbadge-sub">Physically verified by OvikaLiving</span>
                </div>
              </div>
            </Link>

            {/* Divider */}
            <div className="h3-vbadge-divider" />

            {/* Self Verified — orange */}
            <Link to="/ovika-self-verified" className="h3-vbadge">
              <div className="h3-vbadge-shield-wrap">
                <svg viewBox="0 0 130 155" fill="none" xmlns="http://www.w3.org/2000/svg" className="h3-vbadge-shield">
                  <defs>
                    <linearGradient id="oRim"  x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F5C842"/><stop offset="100%" stopColor="#C88A0A"/></linearGradient>
                    <linearGradient id="oBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E07030"/><stop offset="100%" stopColor="#8B3A00"/></linearGradient>
                    <linearGradient id="oRib"  x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#8B3A00"/><stop offset="50%" stopColor="#C05010"/><stop offset="100%" stopColor="#8B3A00"/></linearGradient>
                  </defs>
                  <path d="M65 3 L124 28 L124 82 C124 118 65 150 65 150 C65 150 6 118 6 82 L6 28 Z" fill="url(#oRim)"/>
                  <path d="M65 10 L117 33 L117 82 C117 114 65 143 65 143 C65 143 13 114 13 82 L13 33 Z" fill="url(#oBody)"/>
                  <path d="M13 66 L117 66 L117 97 C105 107 87 116 65 121 C43 116 25 107 13 97 Z" fill="url(#oRib)"/>
                  <path d="M4 63 L13 68 L13 95 L4 90 Z" fill="#5a2000"/>
                  <path d="M126 63 L117 68 L117 95 L126 90 Z" fill="#5a2000"/>
                  <path d="M38 72 L55 92 L92 52" stroke="#F5C842" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <div className="h3-vbadge-text">
                <div className="h3-vbadge-top h3-vbadge-top--orange">
                  <span className="h3-vbadge-title">Self Verified</span>
                </div>
                <div className="h3-vbadge-bottom">
                  <span className="h3-vbadge-sub">Verified by property owner via images &amp; video.</span>
                </div>
              </div>
            </Link>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Home3;