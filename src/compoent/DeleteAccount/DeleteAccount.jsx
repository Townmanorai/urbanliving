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

const tableWrapStyle = { overflowX: 'auto', margin: '16px 0' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '13px' };
const thStyle = { textAlign: 'left', padding: '10px 12px', background: 'rgba(194,119,43,0.08)', color: '#8a5a1f', fontWeight: 700, borderBottom: '1.5px solid #f0e8da' };
const tdStyle = { padding: '10px 12px', borderBottom: '1px solid #f0e8da', color: '#4a3828', verticalAlign: 'top' };

const badgeDeleted = { display: 'inline-block', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: '#fdeaea', color: '#b23b3b', whiteSpace: 'nowrap' };
const badgeRetained = { display: 'inline-block', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: '#fdf3d8', color: '#8a6d1f', whiteSpace: 'nowrap' };

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
        <title>Account & Data Deletion | OvikaLiving Partners</title>
        <meta name="description" content="How to request deletion of your OvikaLiving Partners account and associated data — in-app and web deletion process, what is retained, and support contact." />
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
        }}>✦ OvikaLiving Partners</div>
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
          Last Updated: 1 October 2026
        </div>
      </div>

      {/* Intro Section */}
      <div style={{ ...cardStyleOdd, borderLeft: '5px solid #c2772b' }}>
        <p style={pStyle}>
          This page explains how to request deletion of your <strong>OvikaLiving Partners</strong> account and associated data.
          This page is public and does not require the OvikaLiving Partners app to be installed or an account to be logged in
          to read it.
        </p>
        <p style={{ ...pStyle, marginBottom: 0 }}>
          OvikaLiving Partners allows Partners to request account closure or deletion through the <strong>Delete Account</strong>{' '}
          option available in the OvikaLiving Partners application or through this account deletion webpage on the official
          OvikaLiving website.
        </p>
      </div>

      {/* Section 1 */}
      <Section num={1} title="How to Request Account Deletion">
        <p style={pStyle}>
          In the OvikaLiving Partners app, use the available <strong>Delete Account</strong> option and follow the on-screen
          instructions to submit a valid deletion request.
        </p>
        <p style={pStyle}>You can also request account deletion outside the app through this page:</p>
        <p style={pStyle}>
          <a href="https://www.ovikaliving.com/delete-account" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #c98b3e' }}>
            https://www.ovikaliving.com/delete-account
          </a>
        </p>
        <p style={{ ...pStyle, marginBottom: 0 }}>
          The deletion request may be subject to reasonable verification requirements to protect the account and prevent
          unauthorized deletion — for example, confirming the registered email address or mobile number on the account.
        </p>
      </Section>

      {/* Section 2 */}
      <Section num={2} title="What Happens After a Deletion Request">
        <p style={pStyle}>Upon receiving a valid deletion request, OvikaLiving will process the request in accordance with applicable law and its data-retention obligations.</p>
        <p style={pStyle}>
          <strong>Processing timeframe:</strong> OvikaLiving will complete a valid, verified deletion request within{' '}
          <strong>30 days</strong>, except for information that is retained as described in the table below and in Section 3
          (Data Retention).
        </p>
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Data / Record</th>
                <th style={thStyle}>Outcome</th>
                <th style={thStyle}>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>Partner profile and account information</td>
                <td style={tdStyle}><span style={badgeDeleted}>Deleted where no longer required</span></td>
                <td style={tdStyle}>Information may be deleted or anonymized when retention is no longer necessary and where permitted by applicable law.</td>
              </tr>
              <tr>
                <td style={tdStyle}>Login and authentication information</td>
                <td style={tdStyle}><span style={badgeDeleted}>Deleted where no longer required</span></td>
                <td style={tdStyle}>Processed in accordance with account closure, security, and applicable retention requirements.</td>
              </tr>
              <tr>
                <td style={tdStyle}>Active listings / properties</td>
                <td style={tdStyle}><span style={badgeRetained}>May be removed or deactivated</span></td>
                <td style={tdStyle}>Active listings may be removed or deactivated where appropriate following account closure.</td>
              </tr>
              <tr>
                <td style={tdStyle}>Bookings, settlements and related records</td>
                <td style={tdStyle}><span style={badgeRetained}>May be retained</span></td>
                <td style={tdStyle}>Certain records may be retained for ongoing bookings, settlements, disputes, legal, tax, accounting, security, fraud-prevention, contractual, or regulatory purposes.</td>
              </tr>
              <tr>
                <td style={tdStyle}>KYC / verification information</td>
                <td style={tdStyle}><span style={badgeRetained}>May be retained where required</span></td>
                <td style={tdStyle}>Information may be retained where necessary for legal, regulatory, security, fraud-prevention, or other legitimate retention obligations.</td>
              </tr>
              <tr>
                <td style={tdStyle}>Financial / tax / accounting records</td>
                <td style={tdStyle}><span style={badgeRetained}>May be retained where required</span></td>
                <td style={tdStyle}>Certain records may continue to be retained to satisfy financial, tax, accounting, regulatory, contractual, or dispute-resolution requirements.</td>
              </tr>
              <tr>
                <td style={tdStyle}>Reviews, ratings and messages visible to other users</td>
                <td style={tdStyle}><span style={badgeRetained}>Anonymized where retained</span></td>
                <td style={tdStyle}>Where such content is kept to preserve the integrity of another user's record (e.g. a customer's booking history or review thread), it is disassociated from the deleted Partner's identity rather than deleted outright.</td>
              </tr>
              <tr>
                <td style={tdStyle}>Other personal information</td>
                <td style={tdStyle}><span style={badgeDeleted}>Deleted or anonymized where permitted</span></td>
                <td style={tdStyle}>Information is deleted or anonymized when retention is no longer necessary and where permitted by applicable law.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ ...pStyle, marginBottom: 0 }}>
          Account deletion does not necessarily result in immediate deletion of all records. Certain information may be retained
          where required or reasonably necessary for legal, tax, accounting, regulatory, security, fraud-prevention, contractual,
          or dispute-resolution purposes.
        </p>
      </Section>

      {/* Section 3 */}
      <Section num={3} title="Data Retention">
        <p style={{ ...pStyle, marginBottom: 0 }}>
          OvikaLiving retains Partner information for as long as reasonably necessary for the purposes described in the{' '}
          <Link to="/privacy-policy" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #c98b3e' }}>
            OvikaLiving Partners Privacy Policy
          </Link>. Retention may depend on the nature of the information, the purpose for which it was collected, the Partner
          relationship, contractual requirements, financial and accounting requirements, tax requirements, legal and regulatory
          obligations, dispute resolution, fraud prevention, and security requirements.
        </p>
      </Section>

      {/* Section 4 - Contact */}
      <Section num={4} title="Privacy Requests & Support">
        <p style={pStyle}>
          Subject to applicable law and reasonable verification requirements, Partners may contact OvikaLiving regarding
          account closure, deletion where legally available, access, correction, updating inaccurate information, or
          privacy-related questions and complaints.
        </p>
        <div style={{ fontSize: '14px', marginTop: '16px', padding: '18px', background: '#f9f9f9', borderLeft: '4px solid #c98b3e', borderRadius: '6px', lineHeight: '1.9' }}>
          <div><strong>Company:</strong> OvikaLiving, a brand of Townmanor Technologies Private Limited</div>
          <div><strong>Grievance Officer:</strong> Ankush Mishra</div>
          <div><strong>Email:</strong> <a href="mailto:enquiry@ovikaliving.com" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #c98b3e' }}>enquiry@ovikaliving.com</a></div>
          <div><strong>Phone:</strong> 9319392227</div>
          <div><strong>Registered Office:</strong> ST-304, Eldeco Studio, Sector-93A, Noida, Uttar Pradesh – 201304</div>
          <div><strong>Website:</strong> <a href="https://www.ovikaliving.com" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #c98b3e' }}>www.ovikaliving.com</a></div>
          <div style={{ marginTop: 8 }}><strong>Official account deletion page:</strong> <a href="https://www.ovikaliving.com/delete-account" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #c98b3e' }}>https://www.ovikaliving.com/delete-account</a></div>
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
