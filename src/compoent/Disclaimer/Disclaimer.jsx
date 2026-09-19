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

const Section = ({ num, title, children }) => (
  <div style={num % 2 === 0 ? cardStyleEven : cardStyleOdd}>
    <div style={headerRowStyle}>
      <div style={circleStyle}>{String(num).padStart(2, '0')}</div>
      <h2 style={titleStyle}>{title}</h2>
    </div>
    <div style={bodyStyle}>{children}</div>
  </div>
);

const Disclaimer = () => {
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
        <title>Website Disclaimer | OvikaLiving</title>
        <meta name="description" content="OvikaLiving's website disclaimer — our role as a marketplace, property information accuracy, host responsibility, and limitation of liability." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ovikaliving.com/disclaimer" />
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
        }}>Website Disclaimer</h1>
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
          This Website Disclaimer applies to OvikaLiving.com, owned and operated by Townmanor Technologies Private Limited
          ("Townmanor", "OvikaLiving", "we", "us" or "our"). By accessing or using the website, you acknowledge this Disclaimer
          together with the applicable Terms & Conditions, Privacy Policy, Cookie Policy and other published policies.
        </p>
      </div>

      {/* Section 1 */}
      <Section num={1} title="General Information">
        <p style={pStyle}>The content on OvikaLiving.com is provided for general information and accommodation marketplace facilitation purposes only. We make reasonable efforts to keep website information useful and current, but we do not warrant that all content will always be complete, accurate, current, reliable or suitable for every user or purpose.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>Information may change without notice, including property details, pricing, availability, amenities, photographs, policies and other listing information.</p>
      </Section>

      {/* Section 2 */}
      <Section num={2} title="OvikaLiving's Role as a Marketplace">
        <p style={pStyle}>OvikaLiving is a technology-enabled accommodation marketplace that facilitates connections between independent guests and hosts/property owners and enables users to discover, enquire about and, where available, book accommodation.</p>
        <p style={pStyle}>OvikaLiving does not own, lease, possess, operate, manage or control the third-party properties listed by Hosts, unless expressly stated otherwise in a specific listing and permitted by applicable law. The accommodation, hosting and guest relationship is primarily between the Guest and the relevant Host, subject to applicable law and the terms governing the booking.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>OvikaLiving does not guarantee that any particular Host, property or booking will meet a Guest's expectations or requirements.</p>
      </Section>

      {/* Section 3 */}
      <Section num={3} title="Property Information">
        <p style={pStyle}>Property descriptions, photographs, amenities, location information, pricing, availability, house rules and other listing details are provided by the relevant Host or property owner and may change from time to time.</p>
        <p style={pStyle}>While OvikaLiving may use reasonable measures to review, display or facilitate verification of listing information, OvikaLiving does not independently guarantee the accuracy, completeness, legality, quality, safety, suitability or availability of every listing or representation made by a Host.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>Guests should review the applicable listing, booking terms, cancellation conditions, house rules and other information before making a booking and should raise any material questions with the Host or through OvikaLiving's available support channels before relying on the information.</p>
      </Section>

      {/* Section 4 */}
      <Section num={4} title="Bookings, Availability and Pricing">
        <p style={pStyle}>Bookings are subject to availability, applicable booking conditions, payment or payment-authorisation requirements, verification and confirmation.</p>
        <p style={pStyle}>A listing displayed on the website does not by itself guarantee that the accommodation will remain available until a booking is confirmed. Prices, taxes, fees, availability and other booking conditions may change before confirmation.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>OvikaLiving may take actions concerning a booking where reasonably necessary for operational, security, fraud-prevention, legal or compliance reasons, subject to applicable law and the Terms & Conditions and applicable cancellation/refund policies.</p>
      </Section>

      {/* Section 5 */}
      <Section num={5} title="Host Responsibility">
        <p style={pStyle}>Hosts are responsible for the properties and services they offer through OvikaLiving, including maintaining accurate listing information, ensuring that they have the necessary rights, permissions, registrations, licences and approvals to offer the accommodation, complying with applicable laws, maintaining the property in an appropriate condition, honouring confirmed bookings and complying with applicable tax, safety and guest-protection requirements.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>Nothing in this Disclaimer transfers those responsibilities to OvikaLiving.</p>
      </Section>

      {/* Section 6 */}
      <Section num={6} title="Third-Party Services and Links">
        <p style={pStyle}>The website may use or provide access to third-party services, payment facilities, communication tools, analytics technologies, maps or links to third-party websites. Such services may be subject to separate terms and privacy practices.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>OvikaLiving does not control third-party websites or services and, to the extent permitted by law, is not responsible for their content, availability, security, privacy practices, products or services. Users should review the relevant third party's terms and policies before using those services.</p>
      </Section>

      {/* Section 7 */}
      <Section num={7} title="No Professional Advice">
        <p style={pStyle}>Nothing on OvikaLiving.com constitutes legal, financial, tax, investment, insurance, immigration, property, travel or other professional advice.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>Users should obtain independent professional advice where appropriate, particularly where a decision involves legal, financial, tax, regulatory or other material consequences.</p>
      </Section>

      {/* Section 8 */}
      <Section num={8} title="Intellectual Property">
        <p style={pStyle}>Unless otherwise stated, trademarks, logos, designs, software, text, graphics, photographs, interfaces and other content made available by OvikaLiving are owned by or licensed to Townmanor Technologies Private Limited or their respective rights holders.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>No content may be copied, reproduced, modified, distributed, republished, commercially exploited or otherwise used without the applicable rights holder's prior written permission, except as permitted by law.</p>
      </Section>

      {/* Section 9 */}
      <Section num={9} title="Limitation of Liability">
        <p style={pStyle}>To the fullest extent permitted by applicable law, Townmanor Technologies Private Limited and OvikaLiving shall not be responsible for indirect, incidental, special, exemplary or consequential loss or damage arising from or relating to access to or use of the website, reliance on website content, third-party properties, Host conduct, third-party services or linked websites.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>Nothing in this Disclaimer excludes or limits liability that cannot lawfully be excluded or limited, including rights and remedies available to consumers or users under mandatory applicable law.</p>
      </Section>

      {/* Section 10 */}
      <Section num={10} title="Relationship with Other Policies and Terms">
        <p style={pStyle}>This Disclaimer should be read together with OvikaLiving's Terms & Conditions, Privacy Policy, Cookie Policy, applicable Booking and Cancellation/Refund terms, and any other terms expressly applicable to a particular service or booking.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>If there is an inconsistency between this Disclaimer and a specific contractual term governing a confirmed booking or transaction, the specific contractual term will apply to the extent of that inconsistency, subject to applicable law.</p>
      </Section>

      {/* Section 11 */}
      <Section num={11} title="Governing Law and Dispute Resolution">
        <p style={pStyle}>This Disclaimer is governed by the laws of India. Any dispute relating to OvikaLiving or use of the website shall be addressed in accordance with the dispute-resolution provisions contained in the applicable Terms & Conditions and subject to applicable law, including any mandatory statutory or consumer rights.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>Where court or other competent-forum proceedings are legally permitted, courts or competent forums in Noida, Uttar Pradesh may have jurisdiction to the extent permitted by applicable law.</p>
      </Section>

      {/* Section 12 - Contact */}
      <Section num={12} title="Contact">
        <div style={{ fontSize: '14px', padding: '18px', background: '#f9f9f9', borderLeft: '4px solid #c98b3e', borderRadius: '6px', lineHeight: '1.9' }}>
          <div>Townmanor Technologies Private Limited</div>
          <div>OvikaLiving.com</div>
          <div><strong>Website:</strong> <a href="https://www.ovikaliving.com" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #c98b3e' }}>www.ovikaliving.com</a></div>
          <div><strong>General Support:</strong> <a href="mailto:support@ovikaliving.com" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #c98b3e' }}>support@ovikaliving.com</a></div>
          <div><strong>Legal / Grievance Enquiries:</strong> <a href="mailto:enquiry@ovikaliving.com" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #c98b3e' }}>enquiry@ovikaliving.com</a></div>
          <div><strong>Privacy / Cookie Matters:</strong> <a href="mailto:privacy@ovikaliving.com" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #c98b3e' }}>privacy@ovikaliving.com</a></div>
          <div style={{ marginTop: 8 }}><strong>Registered Office:</strong><br />ST-304, Eldeco Studio, Sector-93A, Noida, Uttar Pradesh 201304, India</div>
        </div>
      </Section>

      {/* Section 13 */}
      <Section num={13} title="Updates">
        <p style={{ ...pStyle, marginBottom: 0 }}>
          OvikaLiving may revise this Disclaimer from time to time to reflect changes in the website, marketplace services,
          applicable law or business practices. The updated version will be published on the website with the revised
          effective or last-updated date. Users should review this page periodically.
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

export default Disclaimer;
