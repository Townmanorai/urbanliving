import React, { useState } from "react";

const styles = {
  root: {
    fontFamily: "'Outfit', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: "#1a1a1a",
    background: "#ffffff",
    minHeight: "100vh",
  },
  gold: { color: "#b6843b" },

  /* ── NAVBAR ── */
  nav: {
    display: "flex",
    alignItems: "center",
    padding: "16px 48px",
    background: "#fff",
    borderBottom: "1px solid #e0d8cc",
  },
  logoWrap: { display: "flex", alignItems: "center", gap: "6px" },
  logoOL: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "28px",
    fontWeight: 700,
    color: "#b6843b",
    letterSpacing: "-1px",
    lineHeight: 1,
  },
  logoText: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "18px",
    fontWeight: 500,
    color: "#1a1a1a",
    letterSpacing: "0.2px",
  },
  logoTM: {
    fontSize: "10px",
    verticalAlign: "super",
    color: "#1a1a1a",
  },

  /* ── HERO ── */
  heroOuter: {
    background: "#f7f4ee", // Light beige exactly matching the image
    width: "100%",
  },
  hero: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    minHeight: "520px",
    maxHeight: "580px",
    maxWidth: "1100px",
    margin: "0 auto",
    overflow: "hidden",
  },
  heroContent: {
    flex: "0 0 54%",
    padding: "60px 48px 48px 48px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    zIndex: 2,
  },
  heroTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "44px",
    fontWeight: 400,
    color: "#1a1a1a",
    lineHeight: 1.1,
    marginBottom: "16px",
    letterSpacing: "-0.5px"
  },
  heroSubtitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "18px",
    color: "#1a1a1a",
    marginBottom: "16px",
    fontWeight: 400,
  },
  heroDesc: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "13px",
    color: "#555555",
    lineHeight: 1.6,
    marginBottom: "36px",
    maxWidth: "480px",
  },
  heroBtns: { display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" },
  heroImageWrap: { flex: "0 0 46%", position: "relative", overflow: "hidden" },
  heroImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center top",
    display: "block",
    minHeight: "520px",
    background: "#e8ddd0",
  },

  /* ── BUTTONS ── */
  btnPrimary: {
    background: "#b6843b", // Matching the image's gold shade
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    padding: "13px 26px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
    boxShadow: "0 4px 12px rgba(182, 132, 59, 0.2)"
  },
  btnPrimaryFull: {
    background: "#b6843b",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "16px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    width: "100%",
    textAlign: "center",
    marginTop: "20px",
  },
  btnPrimarySm: {
    background: "#b6843b",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    padding: "10px 24px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  btnOutline: {
    background: "transparent",
    color: "#1a1a1a",
    border: "1px solid #1a1a1a",
    borderRadius: "50px",
    padding: "12px 25px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    whiteSpace: "nowrap"
  },

  /* ── FEATURES SECTION ── */
  featuresSection: {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr 1fr",
    gap: "40px",
    padding: "60px 48px",
    background: "#fff",
    alignItems: "stretch",
  },
  featuresImgWrap: {
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
  featuresImg: {
    width: "100%",
    height: "280px",
    objectFit: "cover",
    display: "block",
    background: "#e0d5c8",
  },
  featuresHeading: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "30px",
    fontWeight: 400,
    color: "#1a1a1a",
    lineHeight: 1.3,
    marginBottom: "8px",
  },
  featuresSub: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "14px",
    marginBottom: "24px",
    color: "#b6843b",
  },
  checklist: { listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", padding: 0, margin: 0 },
  checklistItem: { display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", color: "#1a1a1a" },
  checklistItemSm: { display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#1a1a1a" },
  checkmark: { color: "#b6843b", fontWeight: 700, fontSize: "16px", flexShrink: 0 },

  /* ── PARTNER CARD ── */
  partnerCard: {
    background: "#faf7f2",
    border: "1px solid #e0d8cc",
    borderRadius: "20px",
    padding: "28px 28px 24px",
    display: "flex",
    flexDirection: "column",
  },
  partnerTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "18px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "10px",
    lineHeight: 1.4,
  },
  partnerDesc: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "14px",
    color: "#444444",
    lineHeight: 1.5,
    marginBottom: "16px",
  },
  browseBlock: {
    marginTop: "24px",
    paddingTop: "20px",
    borderTop: "1px solid #e0d8cc",
    textAlign: "center",
  },
  browseLabel: { fontSize: "13px", color: "#1a1a1a", marginBottom: "4px" },
  browseSub: { fontSize: "15px", color: "#1a1a1a", marginBottom: "14px", lineHeight: 1.4 },

  /* ── FORM SECTION ── */
  formSection: {
    background: "#fff",
    padding: "40px 48px 60px",
    display: "flex",
    justifyContent: "center",
  },
  formWrap: { width: "100%", maxWidth: "800px", textAlign: "center" },
  formTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "24px",
    fontWeight: 400,
    color: "#1a1a1a",
    marginBottom: "6px",
  },
  formSub: { fontSize: "14px", color: "#777777", marginBottom: "24px" },
  formFields: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginBottom: "18px",
  },
  input: {
    border: "1.5px solid #e0d8cc",
    borderRadius: "8px",
    padding: "12px 14px",
    fontSize: "14px",
    color: "#1a1a1a",
    background: "#fff",
    outline: "none",
    fontFamily: "'Outfit', sans-serif",
    width: "100%",
    boxSizing: "border-box"
  },
  textarea: {
    border: "1.5px solid #e0d8cc",
    borderRadius: "8px",
    padding: "12px 14px",
    fontSize: "14px",
    color: "#1a1a1a",
    background: "#fff",
    outline: "none",
    fontFamily: "'Outfit', sans-serif",
    resize: "vertical",
    minHeight: "90px",
    gridColumn: "span 2",
    width: "100%",
    boxSizing: "border-box"
  },
  submitBtn: {
    background: "#b6843b",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    padding: "14px 48px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "16px",
  },
  submitMsg: {
    marginTop: "12px",
    fontSize: "14px",
    color: "#2e7d32",
    fontWeight: 600,
  },
  submitErr: {
    marginTop: "12px",
    fontSize: "14px",
    color: "#c62828",
    fontWeight: 600,
  },

  /* ── FOOTER ── */
  footer: {
    background: "#fff",
    borderTop: "1px solid #e0d8cc",
    padding: "40px 48px",
    textAlign: "center",
  },
  footerText: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "22px",
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  footerCity: { color: "#b6843b", fontWeight: 700 },
  footerSub: { fontSize: "16px", color: "#444444", marginBottom: "20px" },
  footerLogoWrap: { display: "flex", justifyContent: "center", alignItems: "center" },
  footerLogoImg: { height: "230px", width: "204px", objectFit: "contain" },
};

export default function OvikaLiving() {
  const [formData, setFormData] = useState({ name: "", phone_number: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState("");
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [partnerForm, setPartnerForm] = useState({ name: "", phone_number: "", message: "" });
  const [partnerStatus, setPartnerStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePartnerChange = (e) => {
    const { name, value } = e.target;
    setPartnerForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePartnerSubmit = async () => {
    if (!partnerForm.name || !partnerForm.phone_number) {
      setPartnerStatus("error_fields");
      return;
    }
    setPartnerStatus("loading");
    try {
      const res = await fetch("https://www.townmanor.ai/api/formlead/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: partnerForm.name,
          phone_number: partnerForm.phone_number,
          message: partnerForm.message,
          source: "OvikaLiving Partner",
        }),
      });
      if (res.ok) {
        setPartnerStatus("success");
        setPartnerForm({ name: "", phone_number: "", message: "" });
      } else {
        setPartnerStatus("error");
      }
    } catch {
      setPartnerStatus("error");
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone_number) {
      setSubmitStatus("error_fields");
      return;
    }
    setSubmitStatus("loading");
    try {
      const res = await fetch("https://www.townmanor.ai/api/formlead/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone_number: formData.phone_number,
          message: formData.message,
          source: "OvikaLiving Co-Living",
        }),
      });
      if (res.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", phone_number: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    }
  };

  return (
    <div style={styles.root}>
      {/* INJECTED RESPONSIVE STYLES */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
          
          @media (max-width: 900px) {
            .rs-hero { max-height: max-content !important; min-height: auto !important; }
            .rs-features { grid-template-columns: 1fr !important; gap: 40px !important; }
          }
          @media (max-width: 768px) {
            .rs-nav { padding: 16px 20px !important; }
            
            /* HERO TOP SECTION MOBILE FIX - LOOKS EXACTLY LIKE IMAGE */
            .rs-hero { flex-direction: column !important; min-height: auto !important; max-height: none !important; }
            .rs-hero-content { 
               flex: none !important; 
               padding: 30px 24px !important; 
               text-align: left !important; 
               align-items: flex-start !important;
            }
            .rs-hero-title { font-size: 32px !important; line-height: 1.1 !important; margin-bottom: 12px !important; }
            .rs-hero-subtitle { font-size: 16px !important; margin-bottom: 16px !important; }
            .rs-hero-desc { font-size: 13px !important; margin-bottom: 24px !important; }
            
            /* PLACE IMAGE AT TOP ON MOBILE EXACTLY AS REQUESTED */
            .rs-hero-img-wrap { 
               flex: none !important; 
               width: 100% !important; 
               height: 400px !important; 
               order: -1 !important; 
            }
            .rs-hero-img-wrap img { 
               min-height: auto !important; 
               height: 100% !important; 
               object-position: center 20% !important; 
            }
            
            /* SIDE BY SIDE BUTTONS ON MOBILE MATCHING IMAGE */
            .rs-hero-btns { 
               justify-content: flex-start !important; 
               flex-direction: row !important; 
               flex-wrap: nowrap !important;
               gap: 10px !important; 
               width: 100%; 
            }
            .rs-hero-btns button { 
               width: auto !important; 
               flex: 1; 
               text-align: center !important; 
               padding: 12px 4px !important; 
               font-size: 12px !important;
               white-space: nowrap !important;
            }

            .rs-features { grid-template-columns: 1fr !important; padding: 40px 20px !important; }
            .rs-features-img { height: 240px !important; }
            .rs-form { padding: 40px 20px !important; }
            .rs-form-fields { grid-template-columns: 1fr !important; }
            .rs-textarea { grid-column: span 1 !important; }
            .rs-footer { padding: 40px 20px !important; }
            .rs-footer-text { font-size: 18px !important; }
          }
        `
      }} />

      {/* ── NAVBAR ── */}
      <nav style={styles.nav} className="rs-nav">
        <div style={styles.logoWrap}>
          <span style={styles.logoOL}>OL</span>
          <span style={styles.logoText}>OvikaLiving<span style={styles.logoTM}>™</span></span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={styles.heroOuter}>
      <section style={styles.hero} className="rs-hero">
        <div style={styles.heroContent} className="rs-hero-content">
          <h1 style={styles.heroTitle} className="rs-hero-title">Ovika Co-Living Spaces</h1>
          <p style={styles.heroSubtitle} className="rs-hero-subtitle">
            Smart Community Living — <span style={styles.gold}>Launching Soon</span>
          </p>
          <p style={styles.heroDesc} className="rs-hero-desc">
            Premium shared living spaces designed for students, young professionals,
            and urban residents in Noida &amp; Greater Noida. Experience comfort,
            flexibility, and vibrant community living powered by the OvikaLiving platform.
          </p>
          <div style={styles.heroBtns} className="rs-hero-btns">
            <button style={styles.btnPrimary}>Get Early Access</button>
            <button style={styles.btnOutline} onClick={() => window.dispatchEvent(new Event("openRentalCategoryPopup"))}>List Your Property</button>
          </div>
        </div>
        <div style={styles.heroImageWrap} className="rs-hero-img-wrap">
          <img src="/colivingmodel.png" alt="OvikaLiving model" style={styles.heroImg} />
        </div>
      </section>
      </div>

      {/* ── FEATURES + PARTNER ── */}
      <section style={styles.featuresSection} className="rs-features">

        {/* Left: image — alignSelf start to remove empty space below */}
        <div style={{ ...styles.featuresImgWrap, alignSelf: "start" }}>
          <img src="/colivingspace.jpeg" alt="Co-living community" style={styles.featuresImg} className="rs-features-img" />
        </div>

        {/* Center: checklist */}
        <div>
          <h2 style={styles.featuresHeading}>
            Live Smart. <span style={styles.gold}>Live Connected.</span>
          </h2>
          <p style={styles.featuresSub}>Worldwide co-living spaces in Noida or Greater Noida.</p>
          <ul style={styles.checklist}>
            {["Fully furnished homes", "Flexible monthly stays", "Community lifestyle", "Smart digital booking", "Prime locations near offices & metro"].map((item) => (
              <li key={item} style={styles.checklistItem}>
                <span style={styles.checkmark}>✓</span> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: partner card */}
        <div style={styles.partnerCard}>
          <h3 style={styles.partnerTitle}>Own a property in Noida or Greater Noida?</h3>
          <p style={styles.partnerDesc}>Convert it into a high-yield co-living space with OvikaLiving.</p>
          <ul style={styles.checklist}>
            {["Marketing", "Tenant management", "Property operations", "Payments & bookings"].map((item) => (
              <li key={item} style={styles.checklistItemSm}>
                <span style={styles.checkmark}>✓</span> {item}
              </li>
            ))}
          </ul>
          <button style={styles.btnPrimaryFull} onClick={() => { setShowPartnerModal(true); setPartnerStatus(""); }}>
            Partner With OvikaLiving
          </button>
          <div style={styles.browseBlock}>
            <p style={styles.browseLabel}><strong>Launching Soon in</strong></p>
            <p style={styles.browseSub}>
              Explore Signature Stays on <span style={styles.gold}>OvikaLiving™</span>
            </p>
            <a href="/properties" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button style={styles.btnPrimarySm}>Browse Stays</button>
            </a>
          </div>
        </div>

      </section>

      {/* ── PARTNER MODAL ── */}
      {showPartnerModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px"
        }} onClick={() => setShowPartnerModal(false)}>
          <div style={{
            background: "#fff", borderRadius: "16px", padding: "36px 32px",
            width: "100%", maxWidth: "480px", position: "relative",
            boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowPartnerModal(false)} style={{
              position: "absolute", top: "14px", right: "18px",
              background: "none", border: "none", fontSize: "22px",
              cursor: "pointer", color: "#777",
            }}>×</button>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "20px", marginBottom: "6px", color: "#1a1a1a" }}>
              Partner With OvikaLiving
            </h3>
            <p style={{ fontSize: "13px", color: "#777", marginBottom: "20px" }}>
              Fill in your details and we'll get in touch.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input style={styles.input} type="text" placeholder="Name *" name="name" value={partnerForm.name} onChange={handlePartnerChange} />
              <input style={styles.input} type="tel" placeholder="Phone *" name="phone_number" value={partnerForm.phone_number} onChange={handlePartnerChange} />
              <textarea style={{ ...styles.textarea, gridColumn: "unset" }} placeholder="Message" name="message" value={partnerForm.message} onChange={handlePartnerChange} />
            </div>
            {partnerStatus === "error_fields" && <p style={styles.submitErr}>Please fill Name and Phone.</p>}
            {partnerStatus === "error" && <p style={styles.submitErr}>Something went wrong. Try again.</p>}
            {partnerStatus === "success"
              ? <p style={{ ...styles.submitMsg, textAlign: "center", marginTop: "16px" }}>✓ Thank you! We'll contact you soon.</p>
              : <button
                  style={{ ...styles.submitBtn, width: "100%", borderRadius: "10px", marginTop: "16px", opacity: partnerStatus === "loading" ? 0.7 : 1 }}
                  onClick={handlePartnerSubmit}
                  disabled={partnerStatus === "loading"}
                >
                  {partnerStatus === "loading" ? "Submitting..." : "Submit"}
                </button>
            }
          </div>
        </div>
      )}

      {/* ── FORM ── */}
      <section style={styles.formSection} className="rs-form">
        <div style={styles.formWrap}>
          <h2 style={styles.formTitle}>Be the First to Experience Ovika Co-Living</h2>
          <p style={styles.formSub}>Launching Soon in Noida &amp; Greater Noida.</p>
          <div style={styles.formFields} className="rs-form-fields">
            <input style={styles.input} type="text" placeholder="Name" name="name" value={formData.name} onChange={handleChange} />
            <input style={styles.input} type="tel" placeholder="Phone" name="phone_number" value={formData.phone_number} onChange={handleChange} />
            <textarea style={styles.textarea} className="rs-textarea" placeholder="Message" name="message" value={formData.message} onChange={handleChange} />
          </div>
          <button
            style={{ ...styles.submitBtn, opacity: submitStatus === "loading" ? 0.7 : 1 }}
            onClick={handleSubmit}
            disabled={submitStatus === "loading"}
          >
            {submitStatus === "loading" ? "Submitting..." : "Submit"}
          </button>
          {submitStatus === "success" && <p style={styles.submitMsg}>✓ Thank you! We'll be in touch soon.</p>}
          {submitStatus === "error" && <p style={styles.submitErr}>Something went wrong. Please try again.</p>}
          {submitStatus === "error_fields" && <p style={styles.submitErr}>Please fill in Name, Phone and Email.</p>}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={styles.footer} className="rs-footer">
        <p style={styles.footerText} className="rs-footer-text">
          Launching Soon in{" "}
          <span style={styles.footerCity}>Noida &amp; Greater Noida</span> 🎉
        </p>
        <p style={styles.footerSub}>First 50 residents receive special launch benefits</p>
        <div style={styles.footerLogoWrap}>
          <img src="/ol.jpeg" alt="OvikaLiving Logo" style={styles.footerLogoImg} />
        </div>
      </footer>

    </div>
  );
}