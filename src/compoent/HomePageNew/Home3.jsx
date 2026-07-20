import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle2, ShieldCheck, BadgeCheck, ArrowRight } from "lucide-react";
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
        
        <div className="home3-eyebrow">✦ How OvikaLiving Works</div>

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
                <CheckCircle2 size={15} className="home3-feature-icon" />
                {c}
              </div>
            ))}
          </div>
          <button className="home3-cta-btn" onClick={handleCTAClick}>
            {cta.btnText} <ArrowRight size={15} />
          </button>
        </div>

        {/* Verified Badges */}
        <div className="h3-vbadge-wrap">
          <div className="h3-vbadge-eyebrow">Get Verified</div>
          <h2 className="h3-vbadge-heading">Boost trust, win more bookings</h2>
          <p className="h3-vbadge-subheading">Verified listings earn more visibility and convert faster.</p>

          <div className="h3-vbadge-row">
            <Link to="/ovika-verified" className="h3-vbadge">
              <div className="h3-vbadge-icon h3-vbadge-icon--green"><ShieldCheck size={22} /></div>
              <div>
                <div className="h3-vbadge-title">OvikaLiving Verified</div>
                <p className="h3-vbadge-sub">Physically verified by the OvikaLiving team</p>
              </div>
            </Link>

            <Link to="/ovika-self-verified" className="h3-vbadge">
              <div className="h3-vbadge-icon h3-vbadge-icon--orange"><BadgeCheck size={22} /></div>
              <div>
                <div className="h3-vbadge-title">Self Verified</div>
                <p className="h3-vbadge-sub">Verified by the property owner via images &amp; video</p>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Home3;