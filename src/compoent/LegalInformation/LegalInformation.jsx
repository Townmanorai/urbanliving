import { FileText, Shield, Award } from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  .legal-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #fdf7ee 0%, #f5ead6 60%, #ede4cf 100%);
    font-family: 'Poppins', sans-serif;
    padding: 60px 20px 80px;
  }

  .legal-wrapper {
    max-width: 760px;
    margin: 0 auto;
  }

  .legal-eyebrow {
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
    margin-bottom: 14px;
  }

  .legal-title {
    font-size: clamp(1.5rem, 3vw, 2.2rem);
    font-weight: 600;
    color: #1a1209;
    margin: 0 0 8px;
    line-height: 1.2;
  }

  .legal-title em {
    font-style: normal;
    color: #c2772b;
  }

  .legal-subtitle {
    font-size: 0.86rem;
    color: #6b5540;
    margin: 0 0 40px;
  }

  .legal-card {
    background: #fff;
    border: 1.5px solid #f0e8da;
    border-radius: 18px;
    padding: 32px 36px;
    box-shadow: 0 8px 32px rgba(194,119,43,0.08);
    margin-bottom: 20px;
  }

  .legal-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(194,119,43,0.15);
  }

  .legal-card-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(194,119,43,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .legal-card-title {
    font-size: 1.05rem;
    font-weight: 600;
    color: #1a1209;
    margin: 0;
  }

  .legal-row {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 14px 0;
    border-bottom: 1px solid rgba(194,119,43,0.08);
  }

  .legal-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .legal-row-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #c2772b;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    min-width: 110px;
    padding-top: 2px;
    flex-shrink: 0;
  }

  .legal-row-value {
    font-size: 0.9rem;
    font-weight: 500;
    color: #1a1209;
    line-height: 1.5;
    word-break: break-all;
  }

  .legal-note {
    background: rgba(194,119,43,0.06);
    border: 1px solid rgba(194,119,43,0.18);
    border-radius: 12px;
    padding: 16px 20px;
    font-size: 0.78rem;
    color: #6b5540;
    line-height: 1.6;
    margin-top: 20px;
  }

  @media (max-width: 768px) {
    .legal-page { padding: 40px 16px 60px; }
    .legal-card { padding: 22px 20px; }
    .legal-row { flex-direction: column; gap: 4px; }
    .legal-row-label { min-width: unset; }
    .legal-row-value { font-size: 0.84rem; }
    .legal-title { font-size: 1.4rem; }
  }
`;

export default function LegalInformation() {
  return (
    <div className="legal-page">
      <style>{styles}</style>

      <div className="legal-wrapper">
        <div className="legal-eyebrow">✦ Official Documents</div>
        <h1 className="legal-title">Legal <em>Information</em></h1>
        <p className="legal-subtitle">
          Official registration and compliance details of OvikaLiving.
        </p>

        {/* Tax & Registration */}
        <div className="legal-card">
          <div className="legal-card-header">
            <div className="legal-card-icon">
              <FileText size={22} color="#c2772b" strokeWidth={1.8} />
            </div>
            <h2 className="legal-card-title">Tax & Registration Details</h2>
          </div>

          <div className="legal-row">
            <span className="legal-row-label">GST No.</span>
            <span className="legal-row-value">09AAKCT6155G1ZZ</span>
          </div>
          <div className="legal-row">
            <span className="legal-row-label">PAN No.</span>
            <span className="legal-row-value">AAKCT6155G</span>
          </div>
        </div>

        {/* Startup India */}
        <div className="legal-card">
          <div className="legal-card-header">
            <div className="legal-card-icon">
              <Award size={22} color="#c2772b" strokeWidth={1.8} />
            </div>
            <h2 className="legal-card-title">Startup India Recognition</h2>
          </div>

          <div className="legal-row">
            <span className="legal-row-label">Certificate No.</span>
            <span className="legal-row-value">DIPP151698</span>
          </div>
          <div className="legal-row">
            <span className="legal-row-label">Issued By</span>
            <span className="legal-row-value">Department for Promotion of Industry and Internal Trade (DPIIT), Government of India</span>
          </div>
        </div>

        {/* Compliance Note */}
        <div className="legal-card">
          <div className="legal-card-header">
            <div className="legal-card-icon">
              <Shield size={22} color="#c2772b" strokeWidth={1.8} />
            </div>
            <h2 className="legal-card-title">Compliance Statement</h2>
          </div>

          <p style={{ fontSize: "0.86rem", color: "#4a3828", lineHeight: 1.7, margin: 0 }}>
            OvikaLiving operates in full compliance with applicable Indian laws and regulations,
            including the Goods and Services Tax Act, Income Tax Act, and all relevant regulatory
            frameworks governing rental and co-living accommodation services.
          </p>

          <div className="legal-note">
            For any legal queries or document verification requests, please contact us at{" "}
            <strong>legal@ovikaliving.com</strong> or reach our support team through the Contact Us page.
          </div>
        </div>
      </div>
    </div>
  );
}
