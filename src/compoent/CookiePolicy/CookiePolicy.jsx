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
const h3Style = { color: '#c2772b', fontSize: '17px', margin: '22px 0 10px 0', fontWeight: 600 };

const Section = ({ num, title, children }) => (
  <div style={num % 2 === 0 ? cardStyleEven : cardStyleOdd}>
    <div style={headerRowStyle}>
      <div style={circleStyle}>{String(num).padStart(2, '0')}</div>
      <h2 style={titleStyle}>{title}</h2>
    </div>
    <div style={bodyStyle}>{children}</div>
  </div>
);

const CookiePolicy = () => {
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
        <title>Cookie Policy | OvikaLiving</title>
        <meta name="description" content="How OvikaLiving.com uses cookies and similar technologies, the types of cookies used, and how to manage your cookie preferences." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ovikaliving.com/cookie-policy" />
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
        }}>✦ Legal Document</div>
        <h1 style={{
          fontSize: 'clamp(24px, 4vw, 40px)',
          fontWeight: 600,
          color: '#1a1209',
          letterSpacing: '-0.3px',
          fontFamily: "'Poppins', sans-serif",
          marginBottom: '8px',
          display: 'block',
        }}>Cookie Policy</h1>
        <div style={{ fontSize: '13px', color: '#8a7660', marginBottom: '14px', fontFamily: "'Poppins', sans-serif" }}>
          OvikaLiving.com — Townmanor Technologies Private Limited
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
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <span>Effective Date: To be confirmed before publication</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span>Last Updated: 9 September 2026</span>
        </div>
      </div>

      {/* Intro Section */}
      <div style={{ ...cardStyleOdd, borderLeft: '5px solid #c2772b' }}>
        <p style={{ ...pStyle, marginBottom: 0 }}>
          This Cookie Policy explains how OvikaLiving.com, owned and operated by Townmanor Technologies Private Limited
          ("OvikaLiving", "we", "us" or "our"), uses cookies and similar technologies when you access or use our website,
          applications, digital interfaces and related services.
        </p>
      </div>

      {/* Section 1 */}
      <Section num={1} title="What Are Cookies?">
        <p style={pStyle}>
          Cookies are small text files or similar identifiers stored on or accessed from your device when you visit a website.
          They help websites function properly, remember preferences, maintain sessions, improve performance, understand usage
          and support security.
        </p>
        <p style={{ ...pStyle, marginBottom: 0 }}>
          Similar technologies may include pixels, tags, web beacons, software development kits (SDKs), local storage and other
          technologies that perform functions similar to cookies.
        </p>
      </Section>

      {/* Section 2 */}
      <Section num={2} title="Types of Cookies We May Use">
        <p style={pStyle}>Depending on the features and technology implemented on OvikaLiving, we may use the following categories:</p>

        <h3 style={h3Style}>Strictly Necessary Cookies</h3>
        <p style={pStyle}>These cookies are required for core Platform functionality, including authentication, session management, security, fraud prevention, navigation and other essential functions. They generally cannot be disabled through the Platform where they are necessary for the service to operate.</p>

        <h3 style={h3Style}>Functional Cookies</h3>
        <p style={pStyle}>These cookies help remember preferences and choices, such as language, settings or other user-interface preferences, and may improve the functionality of the Platform.</p>

        <h3 style={h3Style}>Performance and Analytics Cookies</h3>
        <p style={pStyle}>These cookies help us understand how users interact with the Platform, measure traffic and performance, identify errors and improve the website and marketplace experience.</p>

        <h3 style={h3Style}>Security Cookies</h3>
        <p style={pStyle}>These technologies may help detect suspicious activity, prevent fraud, protect accounts and transactions, and maintain the security and integrity of the Platform.</p>

        <h3 style={h3Style}>Advertising or Marketing Cookies</h3>
        <p style={{ ...pStyle, marginBottom: 0 }}>Where implemented, these technologies may be used to understand interests, measure campaigns or provide more relevant advertising or marketing communications. We will obtain consent where required by Applicable Laws before using non-essential advertising or marketing cookies.</p>
      </Section>

      {/* Section 3 */}
      <Section num={3} title="How We Use Cookies">
        <p style={{ ...pStyle, marginBottom: 0 }}>
          Cookies and similar technologies may be used to authenticate users and maintain sessions; remember preferences;
          facilitate booking and account functionality; improve website performance; measure traffic and usage; detect errors;
          prevent fraud and abuse; enhance security; understand how the Platform is used; and, where applicable and permitted,
          support advertising or marketing activities.
        </p>
      </Section>

      {/* Section 4 */}
      <Section num={4} title="Third-Party Cookies and Technologies">
        <p style={pStyle}>
          OvikaLiving may use trusted third-party service providers whose technologies may place or access cookies or similar
          identifiers on the Platform. Depending on the services actually implemented, these may include providers supporting
          analytics, payments, customer support, security, communications or other Platform functions.
        </p>
        <p style={pStyle}>
          Third-party providers may process information in accordance with their own privacy policies and applicable terms.
          OvikaLiving will not list a third-party provider as a current cookie provider unless that provider is actually
          implemented on the relevant Platform environment.
        </p>
        <p style={{ ...pStyle, marginBottom: 0 }}>
          Where required, details of current optional cookies or similar technologies may be made available through the
          OvikaLiving cookie-preference mechanism or other applicable notice.
        </p>
      </Section>

      {/* Section 5 */}
      <Section num={5} title="Consent and Cookie Preferences">
        <p style={pStyle}>Where consent is required by Applicable Laws, OvikaLiving will seek your consent before placing or using non-essential cookies and similar technologies.</p>
        <p style={pStyle}>You may accept or reject optional cookie categories through the cookie-preference mechanism made available by OvikaLiving, where implemented. You may also withdraw or change your consent through the available preference controls.</p>
        <p style={pStyle}>Withdrawal of consent does not affect the lawfulness of processing based on consent before its withdrawal.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>Refusing or disabling optional cookies should not prevent access to core marketplace functionality, although some features or personalised experiences may be affected.</p>
      </Section>

      {/* Section 6 */}
      <Section num={6} title="Managing Cookies Through Your Browser">
        <p style={pStyle}>Most commonly used browsers allow you to block, delete or manage cookies through their settings. You may consult your browser's help documentation for instructions.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>Disabling or deleting strictly necessary cookies may affect the availability, security or functionality of parts of the Platform.</p>
      </Section>

      {/* Section 7 */}
      <Section num={7} title="Cookies and Personal Data">
        <p style={pStyle}>Information collected through cookies or similar technologies may constitute personal data or be capable of being associated with other information. Where applicable, such information will be handled in accordance with OvikaLiving's Privacy Policy and Applicable Laws.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>Where consent is required for a particular cookie or technology, the relevant processing will be subject to the applicable consent requirements.</p>
      </Section>

      {/* Section 8 */}
      <Section num={8} title="Data Retention">
        <p style={pStyle}>Cookie-related information may be retained for periods appropriate to the purpose for which it is collected, subject to Applicable Laws, our Privacy Policy and the applicable technology configuration.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>Specific retention periods may vary depending on the cookie, technology and service provider involved.</p>
      </Section>

      {/* Section 9 */}
      <Section num={9} title="Changes to This Cookie Policy">
        <p style={pStyle}>We may update this Cookie Policy from time to time to reflect changes in the Platform, technologies used, legal requirements or our practices.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>The latest version will be made available on OvikaLiving.com and will indicate the applicable Last Updated date.</p>
      </Section>

      {/* Section 10 - Contact */}
      <Section num={10} title="Contact Us">
        <div style={{ fontSize: '14px', padding: '18px', background: '#f9f9f9', borderLeft: '4px solid #c98b3e', borderRadius: '6px', lineHeight: '1.9' }}>
          <div>Townmanor Technologies Private Limited</div>
          <div>ST-304, Eldeco Studio, Sector-93A, Noida, Uttar Pradesh – 201304, India</div>
          <div><strong>Privacy enquiries:</strong> <a href="mailto:privacy@ovikaliving.com" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #c98b3e' }}>privacy@ovikaliving.com</a></div>
          <div><strong>Website:</strong> <a href="https://www.ovikaliving.com" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #c98b3e' }}>www.ovikaliving.com</a></div>
        </div>
        <p style={{ ...pStyle, marginTop: '16px', marginBottom: 0 }}>
          Please also review the{' '}
          <Link to="/privacy-policy" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #c98b3e' }}>OvikaLiving Privacy Policy</Link>{' '}
          for information about how personal data is collected, used, disclosed, retained and protected.
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

export default CookiePolicy;
