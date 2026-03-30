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
        
        <h2 className="home3-heading">
          How <span className="highlight">OvikaLiving</span> Works
        </h2>
        <p className="home3-subtitle">— {subtitle} —</p>

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
            <div className="home3-mobile-card" key={i}>
              <div className="home3-mobile-icon">
                {s.imageUrl ? <img src={s.imageUrl} alt={s.title} /> : <span>🏠</span>}
              </div>
              <div className="home3-mobile-content">
                <div className="home3-mobile-label">Step {s.stepNo} of 4</div>
                <h3 className="home3-mobile-title">{s.title}</h3>
                <p className="home3-mobile-desc">{s.desc}</p>
              </div>
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
          <p className="home3-footer">{cta.footnote}</p>
        </div>

        {/* Trust Badges Strip */}
        <div className="home3-trust-strip">
          <p className="home3-trust-label">Our Verified Listing Programs</p>
          <div className="home3-trust-badges">
            <Link to="/ovika-verified" className="home3-trust-badge">
              <img src="/ovikaver.png" alt="OvikaLiving Verified" className="home3-trust-img" />
              <div className="home3-trust-info">
                <span className="home3-trust-name">OvikaLiving Verified</span>
                <span className="home3-trust-sub">Team-verified listing</span>
              </div>
            </Link>
            <div className="home3-trust-sep" />
            <Link to="/ovika-self-verified" className="home3-trust-badge">
              <svg className="home3-trust-shield" viewBox="0 0 130 155" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="h3gr1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F5C842"/><stop offset="100%" stopColor="#C88A0A"/></linearGradient>
                  <linearGradient id="h3gr2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F07828"/><stop offset="100%" stopColor="#B84808"/></linearGradient>
                  <linearGradient id="h3gr3" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#C03A00"/><stop offset="50%" stopColor="#E05808"/><stop offset="100%" stopColor="#C03A00"/></linearGradient>
                </defs>
                <path d="M65 3 L124 28 L124 82 C124 118 65 150 65 150 C65 150 6 118 6 82 L6 28 Z" fill="url(#h3gr1)"/>
                <path d="M65 10 L117 33 L117 82 C117 114 65 143 65 143 C65 143 13 114 13 82 L13 33 Z" fill="url(#h3gr2)"/>
                <path d="M13 66 L117 66 L117 97 C105 107 87 116 65 121 C43 116 25 107 13 97 Z" fill="url(#h3gr3)"/>
                <text x="65" y="87" textAnchor="middle" fontFamily="serif" fontSize="12.5" fontWeight="700" fill="#FFF8EE" letterSpacing="0.8">VERIFIED</text>
                <text x="65" y="109" textAnchor="middle" fontFamily="serif" fontSize="10.5" fontWeight="600" fill="#FFF8EE" letterSpacing="0.8">SELF</text>
                <path d="M40 40 L57 58 L90 25" stroke="#FFFAEA" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              <div className="home3-trust-info">
                <span className="home3-trust-name">Property Self-Verified</span>
                <span className="home3-trust-sub">Owner self-verified listing</span>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Home3;