const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  .legal-page {
    min-height: 100vh;
    background: linear-gradient(160deg, #fdf7ee 0%, #f5ead6 60%, #ede4cf 100%);
    font-family: 'Poppins', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .legal-page::before {
    content: '';
    position: absolute;
    top: -100px; right: -100px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(194,119,43,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  .legal-page::after {
    content: '';
    position: absolute;
    bottom: -80px; left: -80px;
    width: 350px; height: 350px;
    background: radial-gradient(circle, rgba(194,119,43,0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  .legal-hero {
    padding: 60px 24px 48px;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .legal-hero-inner {
    max-width: 680px;
    margin: 0 auto;
  }

  .legal-badge {
    display: inline-flex;
    background: rgba(194,119,43,0.1);
    border: 1px solid rgba(194,119,43,0.25);
    border-radius: 20px;
    padding: 4px 16px;
    font-size: 0.6rem;
    color: #c2772b;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .legal-hero-title {
    font-size: clamp(1.5rem, 3vw, 2.2rem);
    font-weight: 600;
    color: #1a1209;
    margin: 0 0 10px;
    line-height: 1.2;
  }

  .legal-hero-title span {
    color: #c2772b;
  }

  .legal-hero-sub {
    font-size: 0.86rem;
    color: #6b5540;
    margin: 0;
    line-height: 1.6;
  }

  .legal-body {
    max-width: 820px;
    margin: 0 auto;
    padding: 0 20px 80px;
    position: relative;
    z-index: 1;
  }

  .legal-illus-card {
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(194,119,43,0.10);
    padding: 36px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 32px;
    border: 1.5px solid #f0e8da;
  }

  .legal-illus-svg {
    flex-shrink: 0;
    width: 130px;
  }

  .legal-illus-text h2 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a1209;
    margin: 0 0 8px;
  }

  .legal-illus-text p {
    font-size: 0.8rem;
    color: #6b5540;
    line-height: 1.65;
    margin: 0;
  }

  .legal-cards-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  .legal-card {
    background: #fff;
    border: 1.5px solid #f0e8da;
    border-radius: 16px;
    padding: 28px 24px;
    box-shadow: 0 4px 18px rgba(194,119,43,0.07);
  }

  .legal-card-top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .legal-icon-circle {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: rgba(194,119,43,0.08);
    border: 1px solid rgba(194,119,43,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .legal-card-label {
    font-size: 0.62rem;
    font-weight: 600;
    color: #c2772b;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .legal-card-heading {
    font-size: 0.92rem;
    font-weight: 600;
    color: #1a1209;
    margin: 0;
  }

  .legal-field {
    padding: 12px 0;
    border-bottom: 1px solid rgba(194,119,43,0.1);
  }

  .legal-field:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .legal-field-key {
    font-size: 0.68rem;
    font-weight: 600;
    color: #c2772b;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    margin-bottom: 4px;
  }

  .legal-field-val {
    font-size: 0.86rem;
    font-weight: 500;
    color: #1a1209;
    word-break: break-all;
  }

  .legal-compliance-card {
    background: #fff;
    border: 1.5px solid #f0e8da;
    border-radius: 16px;
    padding: 32px 28px;
    box-shadow: 0 4px 18px rgba(194,119,43,0.07);
  }

  .legal-compliance-card h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #1a1209;
    margin: 0 0 12px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .legal-compliance-card p {
    font-size: 0.82rem;
    color: #6b5540;
    line-height: 1.7;
    margin: 0 0 16px;
  }

  .legal-contact-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(194,119,43,0.08);
    border: 1px solid rgba(194,119,43,0.25);
    border-radius: 50px;
    padding: 8px 18px;
    font-size: 0.78rem;
    color: #c2772b;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .legal-hero { padding: 40px 16px 32px; }
    .legal-hero-title { font-size: 1.4rem; }
    .legal-body { padding: 0 16px 60px; }
    .legal-illus-card { flex-direction: column; text-align: center; gap: 20px; padding: 24px 18px; }
    .legal-illus-svg { width: 100px; }
    .legal-cards-grid { grid-template-columns: 1fr; }
    .legal-card { padding: 22px 18px; }
    .legal-compliance-card { padding: 24px 18px; }
  }
`;

function ScaleSVG() {
  return (
    <svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base pedestal */}
      <rect x="52" y="108" width="26" height="8" rx="4" fill="#c2772b" opacity="0.3"/>
      <rect x="44" y="114" width="42" height="6" rx="3" fill="#c2772b" opacity="0.5"/>

      {/* Center pole */}
      <rect x="63" y="38" width="4" height="72" rx="2" fill="#c2772b" opacity="0.6"/>

      {/* Top horizontal bar */}
      <rect x="22" y="35" width="86" height="5" rx="2.5" fill="#c2772b"/>

      {/* Hanging strings */}
      <line x1="30" y1="40" x2="22" y2="72" stroke="#c2772b" strokeWidth="1.5" opacity="0.7"/>
      <line x1="30" y1="40" x2="38" y2="72" stroke="#c2772b" strokeWidth="1.5" opacity="0.7"/>
      <line x1="100" y1="40" x2="92" y2="72" stroke="#c2772b" strokeWidth="1.5" opacity="0.7"/>
      <line x1="100" y1="40" x2="108" y2="72" stroke="#c2772b" strokeWidth="1.5" opacity="0.7"/>

      {/* Left pan */}
      <ellipse cx="30" cy="74" rx="14" ry="4" fill="#f5ead6" stroke="#c2772b" strokeWidth="1.5"/>
      <path d="M16 74 Q30 84 44 74" stroke="#c2772b" strokeWidth="1.5" fill="#fdf7ee" opacity="0.8"/>

      {/* Right pan */}
      <ellipse cx="100" cy="74" rx="14" ry="4" fill="#f5ead6" stroke="#c2772b" strokeWidth="1.5"/>
      <path d="M86 74 Q100 84 114 74" stroke="#c2772b" strokeWidth="1.5" fill="#fdf7ee" opacity="0.8"/>

      {/* Document on left pan */}
      <rect x="22" y="60" width="16" height="11" rx="2" fill="#c2772b" opacity="0.9"/>
      <line x1="25" y1="64" x2="35" y2="64" stroke="#fff" strokeWidth="1" opacity="0.8"/>
      <line x1="25" y1="67" x2="35" y2="67" stroke="#fff" strokeWidth="1" opacity="0.8"/>

      {/* Star on right pan */}
      <text x="94" y="72" fontSize="13" fill="#c2772b" textAnchor="middle" dominantBaseline="middle">★</text>

      {/* Top circle ornament */}
      <circle cx="65" cy="34" r="6" fill="#c2772b"/>
      <circle cx="65" cy="34" r="3.5" fill="#fdf7ee"/>
    </svg>
  );
}

function GSTIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2" y="3" width="14" height="17" rx="2" stroke="#c2772b" strokeWidth="1.6" fill="none"/>
      <line x1="5" y1="8" x2="13" y2="8" stroke="#c2772b" strokeWidth="1.2"/>
      <line x1="5" y1="11" x2="13" y2="11" stroke="#c2772b" strokeWidth="1.2"/>
      <line x1="5" y1="14" x2="10" y2="14" stroke="#c2772b" strokeWidth="1.2"/>
      <circle cx="17" cy="16" r="4.5" fill="#c2772b"/>
      <text x="17" y="19.5" fontSize="6" fill="#fff" textAnchor="middle" fontWeight="700">₹</text>
    </svg>
  );
}

function AwardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="9" r="6" stroke="#c2772b" strokeWidth="1.6" fill="none"/>
      <path d="M7 14.5L5 20l6-2 6 2-2-5.5" stroke="#c2772b" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
      <text x="11" y="12" fontSize="7" fill="#c2772b" textAnchor="middle" fontWeight="700">★</text>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 2L4 5v5c0 4.4 3 8.5 7 9.5 4-1 7-5.1 7-9.5V5L11 2z" stroke="#c2772b" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
      <path d="M8 11l2 2 4-4" stroke="#c2772b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function LegalInformation() {
  return (
    <div className="legal-page">
      <style>{styles}</style>

      {/* Hero */}
      <div className="legal-hero">
        <div className="legal-hero-inner">
          <div className="legal-badge">✦ Official Documents</div>
          <h1 className="legal-hero-title">Legal <span>Information</span></h1>
          <p className="legal-hero-sub">
            Official registration &amp; compliance details of OvikaLiving
          </p>
        </div>
      </div>

      <div className="legal-body">

        {/* Illustration card */}
        <div className="legal-illus-card">
          <div className="legal-illus-svg">
            <ScaleSVG />
          </div>
          <div className="legal-illus-text">
            <h2>Registered &amp; Compliant</h2>
            <p>
              OvikaLiving is a fully registered company operating under the laws of India.
              All our licenses, tax registrations, and government certifications are active
              and verified. We believe in complete transparency with our guests and partners.
            </p>
          </div>
        </div>

        {/* Two info cards */}
        <div className="legal-cards-grid">

          {/* GST + PAN */}
          <div className="legal-card">
            <div className="legal-card-top">
              <div className="legal-icon-circle"><GSTIcon /></div>
              <div>
                <div className="legal-card-label">Tax Details</div>
                <div className="legal-card-heading">Registration Numbers</div>
              </div>
            </div>
            <div className="legal-field">
              <div className="legal-field-key">GST Number</div>
              <div className="legal-field-val">09AAKCT6155G1ZZ</div>
            </div>
            <div className="legal-field">
              <div className="legal-field-key">PAN Number</div>
              <div className="legal-field-val">AAKCT6155G</div>
            </div>
          </div>

          {/* Startup India */}
          <div className="legal-card">
            <div className="legal-card-top">
              <div className="legal-icon-circle"><AwardIcon /></div>
              <div>
                <div className="legal-card-label">Govt. Recognition</div>
                <div className="legal-card-heading">Startup India</div>
              </div>
            </div>
            <div className="legal-field">
              <div className="legal-field-key">Certificate No.</div>
              <div className="legal-field-val">DIPP151698</div>
            </div>
            <div className="legal-field">
              <div className="legal-field-key">Issued By</div>
              <div className="legal-field-val">DPIIT, Govt. of India</div>
            </div>
          </div>

        </div>

        {/* Compliance dark card */}
        <div className="legal-compliance-card">
          <h3>
            <ShieldIcon />
            Compliance Statement
          </h3>
          <p>
            OvikaLiving operates in full compliance with applicable Indian laws including the
            GST Act, Income Tax Act, and all regulatory frameworks governing rental and
            co-living accommodation services across India.
          </p>
          <div className="legal-contact-chip">
            ✉ &nbsp; legal@ovikaliving.com
          </div>
        </div>

      </div>
    </div>
  );
}
