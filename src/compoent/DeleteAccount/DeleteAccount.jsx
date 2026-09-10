import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const cardStyleOdd = {
  maxWidth: '860px',
  margin: '0 auto 14px',
  padding: '26px 30px',
  background: '#fff',
  border: '1.5px solid #f0e8da',
  borderRadius: '16px',
  boxShadow: '0 4px 18px rgba(194,119,43,0.06)'
};

const cardStyleEven = {
  ...cardStyleOdd,
  background: '#fffcf7',
};

const headerRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  marginBottom: '20px',
  paddingBottom: '14px',
  borderBottom: '1.5px solid rgba(194,119,43,0.1)',
  flexWrap: 'wrap'
};

const circleStyle = {
  width: '42px',
  height: '42px',
  background: 'linear-gradient(135deg, #c2772b 0%, #d4894a 100%)',
  color: 'white',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '15px',
  fontWeight: 600,
  flexShrink: 0,
  boxShadow: '0 3px 10px rgba(194,119,43,0.3)'
};

const titleStyle = {
  fontSize: 'clamp(14px, 3vw, 18px)',
  color: '#1a1209',
  fontWeight: 600,
  margin: 0
};

const bodyStyle = { paddingLeft: 0, color: '#4a3828', lineHeight: '1.9' };
const pStyle = { fontSize: '14px', marginBottom: '12px' };
const ulStyle = { margin: '16px 0 20px 25px', paddingLeft: '15px', listStyleType: 'disc' };
const liStyle = { marginBottom: '10px', fontSize: '13px', lineHeight: '1.75' };

const stepWrapStyle = { display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'flex-start' };
const stepNumStyle = {
  width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
  background: 'rgba(194,119,43,0.12)', color: '#c2772b', fontWeight: 700, fontSize: '14px',
  display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px'
};
const stepTitleStyle = { fontSize: '15px', fontWeight: 600, color: '#1a1209', marginBottom: '4px' };
const stepDescStyle = { fontSize: '13px', color: '#6b5540', lineHeight: '1.7' };

const tableWrapStyle = { overflowX: 'auto', margin: '16px 0' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '13px' };
const thStyle = { textAlign: 'left', padding: '10px 12px', background: 'rgba(194,119,43,0.08)', color: '#8a5a1f', fontWeight: 700, borderBottom: '1.5px solid #f0e8da' };
const tdStyle = { padding: '10px 12px', borderBottom: '1px solid #f0e8da', color: '#4a3828' };

const badgeDeleted = { display: 'inline-block', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: '#fdeaea', color: '#b23b3b' };
const badgeRetained = { display: 'inline-block', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: '#fdf3d8', color: '#8a6d1f' };

const Section = ({ num, title, children }) => (
  <div style={num % 2 === 0 ? cardStyleEven : cardStyleOdd}>
    <div style={headerRowStyle}>
      <div style={circleStyle}>{String(num).padStart(2, '0')}</div>
      <h2 style={titleStyle}>{title}</h2>
    </div>
    <div style={bodyStyle}>{children}</div>
  </div>
);

const DeleteAccount = () => {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #fdf7ee 0%, #f5ead6 60%, #ede4cf 100%)',
      fontFamily: "'Poppins', sans-serif",
      color: '#4a3828',
      overflowX: 'hidden',
      margin: 0,
      padding: '0 16px 60px'
    }}>
      <Helmet>
        <title>Delete Account | OvikaLiving Owner App</title>
        <meta name="description" content="How to delete your OvikaLiving Owner account and what happens to your data — step-by-step in-app deletion process and data retention details." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ovikaliving.com/delete-account" />
      </Helmet>

      {/* Hero Header */}
      <div style={{ width: '100%', background: 'transparent', padding: '60px 4% 32px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          background: 'rgba(194,119,43,0.1)',
          border: '1px solid rgba(194,119,43,0.25)',
          borderRadius: '20px',
          padding: '4px 16px',
          fontSize: '0.58rem',
          color: '#c2772b',
          letterSpacing: '1.4px',
          textTransform: 'uppercase',
          fontWeight: 600,
          fontFamily: "'Poppins', sans-serif",
          marginBottom: '14px',
        }}>✦ OvikaLiving Owner App</div>
        <h1 style={{
          fontSize: 'clamp(24px, 4vw, 40px)',
          fontWeight: 600,
          color: '#1a1209',
          letterSpacing: '-0.3px',
          fontFamily: "'Poppins', sans-serif",
          marginBottom: '8px',
          display: 'block',
        }}>Account & Data Deletion</h1>
        <div style={{ fontSize: '13px', color: '#8a7660', marginBottom: '14px', fontFamily: "'Poppins', sans-serif" }}>
          A brand of Townmanor Technologies Private Limited
        </div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(194,119,43,0.08)',
          border: '1px solid rgba(194,119,43,0.2)',
          padding: '7px 16px',
          borderRadius: '40px',
          fontSize: '13px',
          color: '#6b5540',
          fontFamily: "'Poppins', sans-serif",
        }}>
          Last Updated: 10 September 2026
        </div>
      </div>

      {/* Intro Section */}
      <div style={{ ...cardStyleOdd, borderLeft: '5px solid #c2772b' }}>
        <p style={pStyle}>
          This page explains how to delete your <strong>OvikaLiving Owner</strong> account and what happens to your data,
          in accordance with Google Play's Data Safety requirements. This page is public and does not require the app
          to be installed or an account to be logged in to read it.
        </p>
        <p style={{ ...pStyle, marginBottom: 0 }}>
          To delete your OvikaLiving Owner account and associated data: open the <strong>OvikaLiving Owner</strong> app,
          go to <strong>Profile → App Settings → Delete Account</strong>, and follow the on-screen steps (email verification,
          phone verification, final confirmation). Deletion is immediate and permanent.
        </p>
      </div>

      {/* Section 1 - How to delete */}
      <Section num={1} title="How to Delete Your Account (In-App)">
        <p style={pStyle}>
          Path: <strong>Profile → App Settings → Delete Account</strong>. The flow is a 4-step guarded sequence —
          nothing is deleted until every step below is completed.
        </p>

        <div style={stepWrapStyle}>
          <div style={stepNumStyle}>1</div>
          <div>
            <div style={stepTitleStyle}>Confirm intent</div>
            <div style={stepDescStyle}>You are shown what will happen and must type your account email exactly to proceed — a deliberate friction step to prevent accidental taps.</div>
          </div>
        </div>

        <div style={stepWrapStyle}>
          <div style={stepNumStyle}>2</div>
          <div>
            <div style={stepTitleStyle}>Verify email — OTP</div>
            <div style={stepDescStyle}>A 4-digit code is emailed to your account's registered address. The code expires in 5 minutes; resend is cooldown-limited.</div>
          </div>
        </div>

        <div style={stepWrapStyle}>
          <div style={stepNumStyle}>3</div>
          <div>
            <div style={stepTitleStyle}>Verify phone — OTP</div>
            <div style={stepDescStyle}>A 4-digit code is sent via SMS to your registered mobile number. This step is skipped only if the account genuinely has no mobile number on file (e.g. Google Sign-In accounts).</div>
          </div>
        </div>

        <div style={{ ...stepWrapStyle, marginBottom: 0 }}>
          <div style={stepNumStyle}>4</div>
          <div>
            <div style={stepTitleStyle}>Final confirmation</div>
            <div style={stepDescStyle}>A last "are you sure — this cannot be undone" prompt. Both verifications must still be within the last 15 minutes at this point, or you are sent back to re-verify.</div>
          </div>
        </div>

        <p style={{ fontSize: '13px', marginTop: '20px', padding: '14px 16px', background: 'rgba(194,119,43,0.08)', borderRadius: '10px', color: '#6b5540' }}>
          Once confirmed, the account is deleted <strong>immediately and permanently</strong> — this is a hard delete,
          not a deactivation. There is no recovery/undo window and no account reactivation path.
        </p>
      </Section>

      {/* Section 2 - What is deleted / retained */}
      <Section num={2} title="What Is Deleted, and What Is Retained">
        <p style={pStyle}>The table below shows exactly what happens to each category of data when your account is deleted.</p>
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Data</th>
                <th style={thStyle}>Outcome</th>
                <th style={thStyle}>Detail</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>Profile (name, email, phone, photo)</td>
                <td style={tdStyle}><span style={badgeDeleted}>Deleted</span></td>
                <td style={tdStyle}>Removed immediately with the account record</td>
              </tr>
              <tr>
                <td style={tdStyle}>Login credentials</td>
                <td style={tdStyle}><span style={badgeDeleted}>Deleted</span></td>
                <td style={tdStyle}>Removed with the account record</td>
              </tr>
              <tr>
                <td style={tdStyle}>Bank details</td>
                <td style={tdStyle}><span style={badgeDeleted}>Deleted</span></td>
                <td style={tdStyle}>All records for that account removed</td>
              </tr>
              <tr>
                <td style={tdStyle}>KYC verification</td>
                <td style={tdStyle}><span style={badgeDeleted}>Deleted</span></td>
                <td style={tdStyle}>Record removed</td>
              </tr>
              <tr>
                <td style={tdStyle}>Listings / properties</td>
                <td style={tdStyle}><span style={badgeRetained}>Retained</span></td>
                <td style={tdStyle}>Retained for a defined period for legal/accounting purposes, then anonymized</td>
              </tr>
              <tr>
                <td style={tdStyle}>Bookings / inquiries / agreements</td>
                <td style={tdStyle}><span style={badgeRetained}>Retained</span></td>
                <td style={tdStyle}>Retained for a defined period for legal/accounting purposes, then anonymized</td>
              </tr>
              <tr>
                <td style={tdStyle}>Expense & staff records</td>
                <td style={tdStyle}><span style={badgeRetained}>Retained</span></td>
                <td style={tdStyle}>Retained for a defined period for legal/accounting purposes, then anonymized</td>
              </tr>
              <tr>
                <td style={tdStyle}>Deletion audit-log entry</td>
                <td style={tdStyle}><span style={badgeRetained}>Kept (minimal)</span></td>
                <td style={tdStyle}>Account ID and timestamp only, for compliance trail — no profile/contact data</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ ...pStyle, marginBottom: 0 }}>
          Property, booking, and financial records tied to your account are retained for legal and accounting purposes
          before being anonymized, since these records may also relate to tenants, staff, or other parties who have a
          legitimate reference to them.
        </p>
      </Section>

      {/* Section 3 - Safeguards */}
      <Section num={3} title="Safeguards in the Deletion Flow">
        <p style={pStyle}>To prevent accidental or unauthorized account deletion, the flow includes the following safeguards:</p>
        <ul style={ulStyle}>
          <li style={liStyle}>Email OTP validity: 5 minutes</li>
          <li style={liStyle}>Both email and phone verifications must be completed within the last 15 minutes of final confirmation</li>
          <li style={liStyle}>OTP requests are rate-limited within a rolling 24-hour window</li>
          <li style={liStyle}>A cooldown period is enforced between OTP resend requests</li>
          <li style={liStyle}>The phone verification step is skipped only when the account genuinely has no mobile number on file</li>
        </ul>
      </Section>

      {/* Section 4 - Contact */}
      <Section num={4} title="Questions or Support">
        <p style={pStyle}>If you have any questions about this process or need help deleting your account, please contact us:</p>
        <div style={{ fontSize: '14px', marginTop: '16px', padding: '18px', background: '#f9f9f9', borderLeft: '4px solid #c98b3e', borderRadius: '6px', lineHeight: '1.9' }}>
          <div><strong>Company:</strong> OvikaLiving, a brand of Townmanor Technologies Private Limited</div>
          <div><strong>Email:</strong> <a href="mailto:enquiry@ovikaliving.com" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #c98b3e' }}>enquiry@ovikaliving.com</a></div>
          <div><strong>Phone:</strong> 9319392227</div>
        </div>
      </Section>

      {/* Back Home Section */}
      <div style={{ maxWidth: '860px', margin: '0 auto 0', padding: '28px 32px', background: '#fff', border: '1.5px solid #f0e8da', borderRadius: '16px', textAlign: 'center' }}>
        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'linear-gradient(135deg, #c2772b 0%, #d4894a 100%)',
          color: 'white',
          padding: '15px 35px',
          borderRadius: '50px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '16px',
          transition: 'all 0.3s ease',
          boxShadow: '0 5px 15px rgba(201, 139, 62, 0.4)'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default DeleteAccount;
