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

const badgeDeleted = { display: 'inline-block', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: '#fdeaea', color: '#b23b3b', whiteSpace: 'nowrap' };
const badgeRetained = { display: 'inline-block', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: '#fdf3d8', color: '#8a6d1f', whiteSpace: 'nowrap' };

const infoTableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: 0 };
const infoLabelStyle = { padding: '10px 14px', background: 'rgba(194,119,43,0.06)', fontWeight: 700, color: '#8a5a1f', width: '160px', borderBottom: '1px solid #f0e8da', verticalAlign: 'top' };
const infoValStyle = { padding: '10px 14px', color: '#4a3828', borderBottom: '1px solid #f0e8da', verticalAlign: 'top' };

const Section = ({ num, title, children }) => (
  <div style={num % 2 === 0 ? cardStyleEven : cardStyleOdd}>
    <div style={headerRowStyle}>
      <div style={circleStyle}>{String(num).padStart(2, '0')}</div>
      <h2 style={titleStyle}>{title}</h2>
    </div>
    <div style={bodyStyle}>{children}</div>
  </div>
);

const AccountDeletionPolicy = () => {
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
        <title>Account Deletion Policy | OvikaLiving</title>
        <meta name="description" content="How to request deletion of your OvikaLiving account and personal data — in-app process, what is deleted immediately vs. retained, and timing." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ovikaliving.com/account-deletion-policy" />
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
        }}>✦ OvikaLiving App</div>
        <h1 style={{
          fontSize: 'clamp(24px, 4vw, 40px)',
          fontWeight: 600,
          color: '#1a1209',
          letterSpacing: '-0.3px',
          fontFamily: "'Poppins', sans-serif",
          marginBottom: '8px',
          display: 'block',
        }}>Account Deletion Policy</h1>
        <div style={{ fontSize: '13px', color: '#8a7660', marginBottom: '14px', fontFamily: "'Poppins', sans-serif" }}>
          Townmanor Technologies Private Limited
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
          Document Date: 16 September 2026
        </div>
      </div>

      {/* App/Company Info Card */}
      <div style={cardStyleOdd}>
        <div style={tableWrapStyle}>
          <table style={infoTableStyle}>
            <tbody>
              <tr>
                <td style={infoLabelStyle}>App name</td>
                <td style={infoValStyle}>OvikaLiving</td>
                <td style={infoLabelStyle}>Package name</td>
                <td style={infoValStyle}>com.ovikaliving.app</td>
              </tr>
              <tr>
                <td style={infoLabelStyle}>Developer / Operator</td>
                <td style={infoValStyle}>Townmanor Technologies Private Limited</td>
                <td style={infoLabelStyle}>Website</td>
                <td style={infoValStyle}><a href="https://www.ovikaliving.com" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600 }}>ovikaliving.com</a></td>
              </tr>
              <tr>
                <td style={{ ...infoLabelStyle, borderBottom: 'none' }}>Contact</td>
                <td style={{ ...infoValStyle, borderBottom: 'none' }}><a href="mailto:enquiry@ovikaliving.com" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600 }}>enquiry@ovikaliving.com</a></td>
                <td style={{ ...infoLabelStyle, borderBottom: 'none' }}>Document date</td>
                <td style={{ ...infoValStyle, borderBottom: 'none' }}>16 September 2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 1 - Overview */}
      <Section num={1} title="Overview">
        <p style={{ ...pStyle, marginBottom: 0 }}>
          Users can permanently delete their OvikaLiving account and the personal data associated with it directly from
          within the app — no separate website, form, or support request is required. The same screen also offers a
          reversible alternative (temporary deactivation) for users who want a break rather than permanent deletion.
        </p>
      </Section>

      {/* Section 2 - How to Request Deletion */}
      <Section num={2} title="How to Request Account Deletion (In-App)">
        <p style={pStyle}>Path in the app: <strong>Profile → Delete Account</strong>.</p>

        <div style={stepWrapStyle}>
          <div style={stepNumStyle}>1</div>
          <div>
            <div style={stepTitleStyle}>Open Delete Account</div>
            <div style={stepDescStyle}>From the Profile screen, the user taps "Delete Account". Optionally, they may select their country/region and a reason for leaving (both optional and used only to improve the product).</div>
          </div>
        </div>

        <div style={stepWrapStyle}>
          <div style={stepNumStyle}>2</div>
          <div>
            <div style={stepTitleStyle}>Review the policy</div>
            <div style={stepDescStyle}>A "Learn more about account deletion requests" link explains, in plain language, what deletion means before the user commits.</div>
          </div>
        </div>

        <div style={stepWrapStyle}>
          <div style={stepNumStyle}>3</div>
          <div>
            <div style={stepTitleStyle}>Confirm intent</div>
            <div style={stepDescStyle}>Tapping "Delete account" shows a final warning explaining that the action is permanent, with a "Deactivate instead" option for users who want a temporary, reversible pause instead of full deletion.</div>
          </div>
        </div>

        <div style={stepWrapStyle}>
          <div style={stepNumStyle}>4</div>
          <div>
            <div style={stepTitleStyle}>Verify identity</div>
            <div style={stepDescStyle}>The app sends a 6-digit one-time verification code to the email address on the user's account.</div>
          </div>
        </div>

        <div style={{ ...stepWrapStyle, marginBottom: 0 }}>
          <div style={stepNumStyle}>5</div>
          <div>
            <div style={stepTitleStyle}>Enter the code</div>
            <div style={stepDescStyle}>On successful verification, the account is permanently deleted immediately and the user is signed out — see Section 4 below for exactly what is deleted right away versus retained briefly (financial records only).</div>
          </div>
        </div>

        <p style={{ fontSize: '13px', marginTop: '20px', padding: '14px 16px', background: 'rgba(194,119,43,0.08)', borderRadius: '10px', color: '#6b5540' }}>
          <strong>Note:</strong> Account deletion currently requires signing in to the app — there is no separate deletion
          request path for a user who no longer has access to their account. Such users can reach us at the contact
          details in Section 6 for manual assistance.
        </p>
      </Section>

      {/* Section 3 - Temporary Deactivation */}
      <Section num={3} title="Alternative: Temporary Deactivation">
        <p style={pStyle}>Instead of permanent deletion, a user may choose <strong>"Deactivate instead"</strong> from the same flow. Deactivating:</p>
        <ul style={ulStyle}>
          <li style={liStyle}>Signs the user out and blocks access to the account until they log back in.</li>
          <li style={liStyle}>Does <strong>not</strong> delete any data — the account and all associated records are preserved as-is.</li>
          <li style={liStyle}>Is reversed automatically and instantly the next time the user successfully logs back in with their email/password or Google account — no separate reactivation step is needed.</li>
        </ul>
      </Section>

      {/* Section 4 - What Happens to Your Data */}
      <Section num={4} title="What Happens to Your Data">
        <p style={pStyle}>
          The moment the verification code is confirmed, the account and its profile are gone — signing back in is not
          possible. Most associated data is deleted in full at that same moment. The one exception is financial records,
          which are kept a little longer purely for accounting/legal reasons (see the note below the table):
        </p>
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Details</th>
                <th style={thStyle}>Outcome</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>Account & profile</td>
                <td style={tdStyle}>Name, email, mobile number, password, profile photo, date of birth, gender, occupation, location, notification preferences, device push token</td>
                <td style={tdStyle}><span style={badgeDeleted}>Deleted immediately</span></td>
              </tr>
              <tr>
                <td style={tdStyle}>Offers & visits</td>
                <td style={tdStyle}>Negotiation offers and scheduled property visit requests</td>
                <td style={tdStyle}><span style={badgeDeleted}>Deleted immediately</span></td>
              </tr>
              <tr>
                <td style={tdStyle}>Home setup orders</td>
                <td style={tdStyle}>Any home-setup service orders placed</td>
                <td style={tdStyle}><span style={badgeDeleted}>Deleted immediately</span></td>
              </tr>
              <tr>
                <td style={tdStyle}>Saved properties</td>
                <td style={tdStyle}>Wishlist / saved-property entries</td>
                <td style={tdStyle}><span style={badgeDeleted}>Deleted immediately</span></td>
              </tr>
              <tr>
                <td style={tdStyle}>Reviews</td>
                <td style={tdStyle}>Reviews and ratings submitted by the user</td>
                <td style={tdStyle}><span style={badgeDeleted}>Deleted immediately</span></td>
              </tr>
              <tr>
                <td style={tdStyle}>Notifications</td>
                <td style={tdStyle}>In-app notification history</td>
                <td style={tdStyle}><span style={badgeDeleted}>Deleted immediately</span></td>
              </tr>
              <tr>
                <td style={tdStyle}>Support tickets</td>
                <td style={tdStyle}>Support/help requests raised by the user</td>
                <td style={tdStyle}><span style={badgeDeleted}>Deleted immediately</span></td>
              </tr>
              <tr>
                <td style={tdStyle}>Bookings</td>
                <td style={tdStyle}>Current and archived booking records</td>
                <td style={tdStyle}><span style={badgeRetained}>Retained 90 days</span></td>
              </tr>
              <tr>
                <td style={tdStyle}>Wallet</td>
                <td style={tdStyle}>Wallet transaction history and balance</td>
                <td style={tdStyle}><span style={badgeRetained}>Retained 90 days</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '13px', marginTop: '16px', padding: '14px 16px', background: 'rgba(194,119,43,0.08)', borderRadius: '10px', color: '#6b5540' }}>
          <strong>Why bookings and wallet history are kept 90 days:</strong> these are financial records — payment,
          invoicing, and dispute evidence — so rather than erasing them the instant an account is deleted, they are held
          for a fixed 90-day window and then permanently and automatically purged. During those 90 days they are not
          visible or accessible to anyone through the app (the account itself no longer exists to sign in as), and they
          cannot be recovered or restored once purged.
        </p>
      </Section>

      {/* Section 5 - Timing */}
      <Section num={5} title="Timing">
        <p style={{ ...pStyle, marginBottom: 0 }}>
          Account deletion itself is <strong>immediate</strong> once the verification code is confirmed — there is no
          waiting period before the account and profile are gone. It is also <strong>irreversible</strong>: creating an
          account again afterward requires signing up as a new user. Bookings and wallet history linger for up to 90 days
          for the accounting reasons above, then are purged automatically with no further action needed from the user.
        </p>
      </Section>

      {/* Section 6 - Contact */}
      <Section num={6} title="Contact">
        <p style={pStyle}>Questions about this policy, or requests for assistance with account deletion, can be sent to:</p>
        <div style={{ fontSize: '14px', marginTop: '16px', padding: '18px', background: '#f9f9f9', borderLeft: '4px solid #c98b3e', borderRadius: '6px', lineHeight: '1.9' }}>
          <div><strong>Email:</strong> <a href="mailto:enquiry@ovikaliving.com" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #c98b3e' }}>enquiry@ovikaliving.com</a></div>
          <div><a href="mailto:support@townmanor.ai" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #c98b3e' }}>support@townmanor.ai</a></div>
        </div>
        <p style={{ ...pStyle, marginTop: '16px', marginBottom: 0 }}>
          For the full data collection, retention, and privacy practices governing OvikaLiving, see our{' '}
          <Link to="/privacy-policy" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #c98b3e' }}>Privacy Policy</Link>{' '}
          (also available in-app under Profile → Privacy Policy).
        </p>
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

export default AccountDeletionPolicy;
