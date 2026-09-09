

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
const h3Style = { color: '#c2772b', fontSize: '18px', margin: '26px 0 12px 0', fontWeight: 600 };
const ulStyle = { margin: '16px 0 20px 25px', paddingLeft: '15px', listStyleType: 'disc' };
const liStyle = { marginBottom: '12px', fontSize: '13px', lineHeight: '1.75' };

const Section = ({ num, title, children }) => (
  <div style={num % 2 === 0 ? cardStyleEven : cardStyleOdd}>
    <div style={headerRowStyle}>
      <div style={circleStyle}>{String(num).padStart(2, '0')}</div>
      <h2 style={titleStyle}>{title}</h2>
    </div>
    <div style={bodyStyle}>{children}</div>
  </div>
);

const PrivacyPolicy = () => {
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
        <title>Privacy Policy | OvikaLiving – PG & Co-Living Platform Noida</title>
        <meta name="description" content="Read OvikaLiving's Privacy Policy. Learn how Townmanor Technologies Private Limited collects, uses, stores and protects your personal data when you use our PG, co-living and rental platform in Noida & Greater Noida." />
        <meta name="keywords" content="ovikaliving privacy policy, ovika data privacy, pg booking privacy noida, ovika user data, personal data protection noida, गोपनीयता नीति ओविका, ओविका प्राइवेसी पॉलिसी, पर्सनल डेटा सुरक्षा नोएडा, ओविका लिविंग प्राइवेसी" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ovikaliving.com/privacy-policy" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Privacy Policy | OvikaLiving" />
        <meta property="og:description" content="OvikaLiving's Privacy Policy for PG and co-living platform users in Noida & Greater Noida." />
        <meta property="og:url" content="https://www.ovikaliving.com/privacy-policy" />
        <meta property="og:site_name" content="OvikaLiving" />
        <meta property="og:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | OvikaLiving" />
        <meta name="twitter:description" content="OvikaLiving's Privacy Policy for PG and co-living platform users in Noida & Greater Noida." />
        <meta name="twitter:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Privacy Policy | OvikaLiving",
          "url": "https://www.ovikaliving.com/privacy-policy",
          "isPartOf": { "@id": "https://www.ovikaliving.com/#website" }
        })}</script>
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
        }}>Privacy Policy</h1>
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
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <span>Effective Date: 10 March 2026</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span>Last Updated: 9 September 2026</span>
        </div>
      </div>

      {/* Intro Section */}
      <div style={{ ...cardStyleOdd, borderLeft: '5px solid #c2772b' }}>
        <p style={pStyle}>
          This Privacy Policy explains how <strong>Townmanor Technologies Private Limited</strong>, operating its accommodation and
          property aggregation platform under the brand <strong>OvikaLiving</strong> ("OvikaLiving", "we", "us", or "our"), collects,
          uses, stores, discloses and protects information when you access or use the OvikaLiving website, mobile application,
          platform or related services (collectively, the "Services" or "Platform").
        </p>
        <p style={pStyle}>
          This Policy applies to all persons who interact with the Platform, including users and guests who search for, enquire
          about, book, rent or occupy a property, and property owners, property managers, operators, lessors and other authorised
          persons who list a property (collectively, "you" or "your").
        </p>
        <p style={pStyle}>
          By accessing or using the Services, you acknowledge that you have read and understood this Privacy Policy.
        </p>
        <p style={{ ...pStyle, marginBottom: 0 }}>
          Your use of the Platform is also subject to the OvikaLiving Website Terms &amp; Conditions and, where applicable, the
          Master Property Owner Agreement, Cancellation &amp; Refund Policy and applicable commercial terms.
        </p>
      </div>

      {/* Section 1 */}
      <Section num={1} title="Information We Collect">
        <h3 style={h3Style}>1.1 Information You Provide</h3>
        <p style={pStyle}>Depending on how you use the Platform, we may collect:</p>
        <ul style={ulStyle}>
          <li style={liStyle}>Name, telephone number, email address and address;</li>
          <li style={liStyle}>Property information supplied by Property Owners, including property address, category, photographs, videos, room or unit details, amenities, facilities, occupancy limits, availability, pricing, rental amount, security deposit, minimum stay, house rules and check-in/check-out information;</li>
          <li style={liStyle}>Booking, enquiry and transaction details;</li>
          <li style={liStyle}>Payment and billing information;</li>
          <li style={liStyle}>Bank account and payment details provided by Property Owners for settlement purposes; and</li>
          <li style={liStyle}>Reviews, ratings, photographs, comments and other feedback submitted through the Platform.</li>
        </ul>

        <h3 style={h3Style}>1.2 KYC and Verification Information</h3>
        <p style={pStyle}>Where required, we may collect Know Your Customer ("KYC") and verification information to establish the identity or authority of users, Property Owners, customers, partners, vendors or other parties using the Services.</p>
        <p style={pStyle}>This may include identity documents, PAN, ownership or authorisation documents, property documents, applicable licences, registrations, NOCs, tourism registrations, GST details, bank details, business information or other verification information required under applicable law.</p>
        <p style={pStyle}>Where permitted, KYC or verification activities may be conducted directly by OvikaLiving or through authorised third-party service providers and may include document checks, telephone calls, video verification, physical inspection or technology-based verification.</p>

        <h3 style={h3Style}>1.3 Information Relating to Children</h3>
        <p style={pStyle}>For purposes of this Policy, a child means a person below 18 years of age, consistent with the Digital Personal Data Protection Act, 2023.</p>
        <p style={pStyle}>The Services are not intended for children unless verifiable parental or lawful-guardian consent has been obtained where required by law.</p>
        <p style={pStyle}>We do not knowingly collect personal data of a child in violation of applicable law and do not knowingly undertake tracking, behavioural monitoring or targeted advertising directed at children.</p>
        <p style={pStyle}>If we become aware that a child's information has been collected improperly, we will take reasonable steps to delete it without undue delay.</p>

        <h3 style={h3Style}>1.4 Information Collected Through Communications</h3>
        <p style={pStyle}>Depending on the Services and applicable law, we may collect or retain information relating to communications made through the Platform, including call-related information or records, text messages or SMS, in-app communications, WhatsApp or other communication records where legally permitted, and communication history associated with a booking or transaction.</p>
        <p style={pStyle}>Such information may be used for customer support, dispute resolution, security and fraud prevention, compliance, service improvement and other legitimate business purposes.</p>
        <p style={pStyle}>Such information will only be collected, accessed, used or retained where there is a legitimate business purpose and where permitted by applicable law and, where required, with prior notice or consent.</p>

        <h3 style={h3Style}>1.5 Location Information</h3>
        <p style={pStyle}>Where necessary and with appropriate permissions, the Platform may collect location-related information for location-based services, connecting users with relevant properties, improving functionality, security and fraud prevention, and analytics.</p>
        <p style={pStyle}>You may control location permissions through your device settings, subject to the functionality of the Services.</p>

        <h3 style={h3Style}>1.6 Information Obtained From Other Sources</h3>
        <p style={pStyle}>We may receive information from business partners, service providers, customers, publicly available sources, verification agencies, authorised third-party platforms and other parties involved in providing the Services.</p>
        <p style={pStyle}>Where permitted by law, we may combine information received from these sources with information collected directly through the Services.</p>

        <h3 style={h3Style}>1.7 Publicly Available Information</h3>
        <p style={pStyle}>We may collect or use information that is lawfully available in the public domain where permitted by applicable law.</p>
        <p style={pStyle}>We do not assume responsibility for the accuracy, completeness, legality or continued availability of information obtained from publicly available sources. We will nevertheless make reasonable efforts to handle such information responsibly.</p>

        <h3 style={h3Style}>1.8 Cookies and Similar Technologies</h3>
        <p style={pStyle}>The Platform may use cookies, software development kits ("SDKs"), pixels and similar technologies to enable core functionality, remember preferences, measure usage, support analytics and support marketing where appropriate consent has been obtained.</p>
        <p style={pStyle}>Non-essential cookies and trackers will only be set with your consent where required by applicable law.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>You may manage cookie preferences through the cookie-settings control provided on the Platform or through your browser or device settings.</p>
      </Section>

      {/* Section 2 */}
      <Section num={2} title="How We Use and Share Information">
        <p style={pStyle}>We may use information collected through the Platform for purposes including:</p>
        <ul style={ulStyle}>
          <li style={liStyle}>Providing and operating the Services;</li>
          <li style={liStyle}>Processing enquiries and bookings;</li>
          <li style={liStyle}>Facilitating property-related transactions;</li>
          <li style={liStyle}>Processing payments and settlements;</li>
          <li style={liStyle}>Verifying identities and properties;</li>
          <li style={liStyle}>Providing customer support;</li>
          <li style={liStyle}>Preventing fraud and misuse;</li>
          <li style={liStyle}>Maintaining platform security;</li>
          <li style={liStyle}>Communicating with users and Property Owners;</li>
          <li style={liStyle}>Improving our Services and Platform;</li>
          <li style={liStyle}>Providing analytics and relevant recommendations;</li>
          <li style={liStyle}>Sending marketing and promotional communications where permitted;</li>
          <li style={liStyle}>Complying with applicable laws and regulations;</li>
          <li style={liStyle}>Resolving disputes; and</li>
          <li style={liStyle}>Enforcing our agreements and policies.</li>
        </ul>

        <h3 style={h3Style}>2.1 Third-Party Service Providers</h3>
        <p style={pStyle}>We may engage trusted third-party service providers to perform services on our behalf, including identity and KYC verification, payment processing, data hosting and storage, communication services, mapping services, analytics, customer support, security and fraud prevention.</p>
        <p style={pStyle}>Such service providers may receive only the information reasonably necessary to perform their assigned services and will be subject to appropriate contractual confidentiality, security and data-protection obligations.</p>
        <p style={pStyle}>The use of third-party services may also be subject to the applicable third party's own terms and privacy policies.</p>

        <h3 style={h3Style}>2.2 Payments and Settlement</h3>
        <p style={pStyle}>Where OvikaLiving facilitates payments, relevant transaction and billing information may be shared with authorised payment gateways, payment service providers or financial institutions to process payments, deduct applicable service or platform fees and taxes, and settle amounts to registered Property Owner bank accounts.</p>
        <p style={pStyle}>OvikaLiving is not responsible for delays or failed transfers resulting from incorrect, incomplete, outdated or invalid payment information provided by a Property Owner, subject to applicable law.</p>

        <h3 style={h3Style}>2.3 Partner Agreements and Data Protection</h3>
        <p style={pStyle}>Where OvikaLiving enters into agreements or Memoranda of Understanding with partners, service providers, vendors or other organisations involving access to personal data collected through the Platform, such arrangements will require appropriate confidentiality, data-protection and security obligations consistent with this Policy and applicable law.</p>

        <h3 style={h3Style}>2.4 Marketing and Promotional Communications</h3>
        <p style={pStyle}>Where permitted by applicable law and subject to any required consent, we may use certain information to provide marketing communications, promotional offers, product updates, personalised recommendations, information about new services and other relevant offers.</p>
        <p style={pStyle}>You may opt out of promotional communications at any time through the unsubscribe link, applicable in-app settings or by contacting us using the details provided in Section 9.</p>
        <p style={pStyle}>Opting out of promotional communications will not affect transactional or essential service communications.</p>

        <h3 style={h3Style}>2.5 Photographs, Videos and Listing Content</h3>
        <p style={pStyle}>Property Owners may provide photographs, videos, descriptions, logos, property information and other content for listing and promotional purposes.</p>
        <p style={pStyle}>Property Owners grant OvikaLiving the applicable licence to use such content for listing the Property and for marketing, advertising, social media, search results, promotional campaigns and improving OvikaLiving's Services, subject to the terms and limitations set out in the applicable Master Property Owner Agreement.</p>
        <p style={pStyle}>Property Owners are responsible for ensuring that they have the necessary rights and permissions to provide such content.</p>

        <h3 style={h3Style}>2.6 Information Handled by Property Owners</h3>
        <p style={pStyle}>Property Owners who receive User or Guest information through the Platform, including information relating to a confirmed booking, must handle such information only for legitimate purposes connected with the relevant booking, rental or provision of accommodation.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>Property Owners must comply with applicable privacy and data-protection laws and must not sell, misuse, disclose or commercially exploit User information obtained through OvikaLiving.</p>
      </Section>

      {/* Section 3 */}
      <Section num={3} title="Confidentiality">
        <p style={{ ...pStyle, marginBottom: 0 }}>Property Owners must keep confidential any non-public commercial, technical, financial or operational information received from OvikaLiving and must not disclose such information except where required or permitted by law or under the applicable agreement.</p>
      </Section>

      {/* Section 4 */}
      <Section num={4} title="Fraudulent or Unauthorised Applications and Communications">
        <p style={pStyle}>Users and Property Owners should exercise caution when providing personal, KYC, financial or other sensitive information to third-party applications, websites or individuals claiming to represent OvikaLiving.</p>
        <p style={pStyle}>Any application, website, message or individual falsely representing itself or themselves as OvikaLiving or an authorised representative of OvikaLiving is unauthorised and may be fraudulent.</p>
        <p style={pStyle}>OvikaLiving will not be responsible for information voluntarily provided by a user to an unauthorised third party, subject always to any statutory liability that cannot lawfully be excluded.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>Where OvikaLiving reasonably believes that fraud, misuse or unlawful activity has occurred, it may suspend, restrict, remove or terminate access to an account or listing, subject to applicable law and, wherever practicable, providing the affected person a fair opportunity to be heard.</p>
      </Section>

      {/* Section 5 */}
      <Section num={5} title="Legal and Regulatory Compliance">
        <p style={pStyle}>OvikaLiving may collect, use, retain or disclose information where reasonably necessary to comply with applicable laws and regulations; respond to lawful governmental or regulatory requests; prevent fraud or misuse; protect the rights, property and safety of OvikaLiving, Users, Property Owners or others; enforce our agreements and policies; and resolve disputes.</p>
        <p style={pStyle}>Where required by law, OvikaLiving will cooperate with competent authorities.</p>

        <h3 style={h3Style}>5.1 Information Technology Act, 2000</h3>
        <p style={pStyle}>OvikaLiving seeks to operate the Services in accordance with the Information Technology Act, 2000 and applicable rules made thereunder, including the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 ("SPDI Rules") and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, as amended, replaced or supplemented from time to time.</p>
        <p style={pStyle}>OvikaLiving implements reasonable security practices and procedures designed to protect sensitive personal data or information, where applicable, from unauthorised access, damage, use, modification, disclosure or impairment.</p>

        <h3 style={h3Style}>5.2 Digital Personal Data Protection Act, 2023</h3>
        <p style={pStyle}>OvikaLiving has regard to the Digital Personal Data Protection Act, 2023 ("DPDP Act") and the Digital Personal Data Protection Rules, 2025.</p>
        <p style={pStyle}>As a Data Fiduciary, OvikaLiving is working towards compliance with applicable obligations under the DPDP framework, including requirements relating to lawful processing, consent where applicable, purpose limitation, data-principal rights, reasonable security safeguards and personal-data breach notification.</p>
        <p style={pStyle}>The DPDP Act and Rules are being brought into force in phases. Provisions relating to the Data Protection Board of India, certain definitions and Government rule-making powers took effect from 13 November 2025. The framework relating to registration and operation of Consent Managers takes effect from 13 November 2026. The remaining substantive obligations, including specified consent, data-principal rights, breach-notification and enforcement provisions, are scheduled to take effect from 13 May 2027.</p>
        <p style={pStyle}>OvikaLiving will update this Privacy Policy and its practices as applicable provisions come into force and will comply with each obligation from its applicable commencement date.</p>

        <h3 style={h3Style}>5.3 Companies Act, 2013</h3>
        <p style={pStyle}>Townmanor Technologies Private Limited, the corporate entity operating OvikaLiving, is incorporated and regulated under the Companies Act, 2013 and applicable rules made thereunder.</p>
        <p style={pStyle}>Corporate Identification Number (CIN): U68200UP2023PTC193656</p>
        <p style={pStyle}>GSTIN: 09AAKCT6155G1ZZ</p>

        <h3 style={h3Style}>5.4 Other Applicable Laws</h3>
        <p style={{ ...pStyle, marginBottom: 0 }}>Depending on the nature of a transaction, OvikaLiving and/or a Property Owner may also be subject to other applicable laws, including consumer-protection laws, applicable e-commerce regulations, payment and settlement systems regulations, tax legislation including GST law, the Mediation Act, 2023 and the Arbitration and Conciliation Act, 1996, as amended from time to time.</p>
      </Section>

      {/* Section 6 */}
      <Section num={6} title="Data Retention">
        <p style={pStyle}>OvikaLiving retains personal data only for as long as reasonably necessary to fulfil the purpose for which it was collected, including to provide the Services, complete and administer bookings, comply with applicable legal, tax or accounting requirements, resolve disputes and enforce agreements.</p>
        <p style={pStyle}>Retention periods may vary depending on the category and nature of the data.</p>
        <p style={pStyle}>For example, KYC and financial records may be retained for periods required under applicable legal, tax or regulatory requirements.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>When the applicable retention period expires, personal data will be deleted, anonymised or securely archived in accordance with applicable law.</p>
      </Section>

      {/* Section 7 */}
      <Section num={7} title="Cross-Border Data Transfers">
        <p style={pStyle}>Certain third-party service providers, such as cloud-hosting or analytics providers, may process personal data on servers located outside India.</p>
        <p style={pStyle}>Where personal data is transferred or processed outside India, OvikaLiving will do so in accordance with applicable law, including the DPDP Act and any applicable conditions or restrictions notified by the Central Government from time to time.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>OvikaLiving will require relevant service providers to maintain appropriate contractual, security and data-protection safeguards.</p>
      </Section>

      {/* Section 8 */}
      <Section num={8} title="Electronic Communications and Records">
        <p style={pStyle}>By using the Platform, Users and Property Owners consent, where legally permissible, to receiving electronic communications relating to their use of the Platform, including booking confirmations, transaction notifications, account communications, service updates, important notices and other communications relating to the Services.</p>
        <p style={pStyle}>Where legally permissible, electronic records and electronic acceptance may have the same legal effect as physical records.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>OvikaLiving may maintain electronic records relating to acceptance of agreements, including identity details, date and time of acceptance, IP address or device information, the version of an agreement accepted and other relevant transaction records.</p>
      </Section>

      {/* Section 9 */}
      <Section num={9} title="Your Rights and Choices">
        <p style={pStyle}>Subject to applicable law and the applicable commencement of relevant provisions, you may have the following rights and choices:</p>
        <ul style={ulStyle}>
          <li style={liStyle}>Opt out of promotional or marketing communications using the unsubscribe mechanism, applicable in-app settings or by contacting us;</li>
          <li style={liStyle}>Request access to your personal data;</li>
          <li style={liStyle}>Request correction of inaccurate or incomplete personal data;</li>
          <li style={liStyle}>Request erasure of personal data where applicable;</li>
          <li style={liStyle}>Withdraw consent previously provided where applicable;</li>
          <li style={liStyle}>Manage location permissions through your device settings; and</li>
          <li style={liStyle}>Manage cookie preferences through the Platform or your browser/device settings.</li>
        </ul>
        <p style={pStyle}>You are responsible for ensuring that your contact, account and payment information provided to OvikaLiving remains accurate and up to date.</p>
        <p style={pStyle}>Where OvikaLiving becomes aware that a child's information has been collected improperly, it will take reasonable steps to delete such information.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>Rights and mechanisms may be subject to applicable law and the phased commencement of the DPDP framework.</p>
      </Section>

      {/* Section 10 - Grievance Redressal and Contact */}
      <Section num={10} title="Grievance Redressal and Contact">
        <p style={pStyle}>OvikaLiving maintains a grievance mechanism in accordance with applicable Indian laws and regulations.</p>
        <p style={pStyle}>For privacy-related complaints, concerns or requests, you may contact:</p>
        <div style={{ fontSize: '14px', marginTop: '16px', padding: '18px', background: '#f9f9f9', borderLeft: '4px solid #c98b3e', borderRadius: '6px', lineHeight: '1.9' }}>
          <div><strong>Company:</strong> OvikaLiving, a brand of Townmanor Technologies Private Limited</div>
          <div><strong>Grievance Officer:</strong> Ankush Mishra</div>
          <div><strong>Email:</strong> <a href="mailto:enquiry@ovikaliving.com" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #c98b3e' }}>enquiry@ovikaliving.com</a></div>
          <div><strong>Phone:</strong> 9319392227</div>
          <div><strong>Registered Office:</strong> ST-304, Eldeco Studio, Sector-93A, Noida, Uttar Pradesh – 201304</div>
          <div><strong>Website:</strong> <a href="https://www.ovikaliving.com" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #c98b3e' }}>www.ovikaliving.com</a></div>
        </div>
        <p style={{ ...pStyle, marginTop: '16px' }}>Grievances will be handled in accordance with applicable law and the grievance process maintained by OvikaLiving.</p>
      </Section>

      {/* Section 11 */}
      <Section num={11} title="Governing Law and Dispute Resolution">
        <p style={pStyle}>This Privacy Policy is governed by and construed in accordance with the laws of India.</p>
        <p style={pStyle}>Any dispute, controversy, claim or difference arising out of or relating to this Privacy Policy shall first be addressed through good-faith discussions and, where unresolved, through mediation and arbitration consistent with the dispute-resolution provisions contained in the applicable OvikaLiving Website Terms &amp; Conditions and Master Property Owner Agreement.</p>
        <p style={pStyle}>The seat and venue of arbitration shall be Noida, Gautam Buddh Nagar, Uttar Pradesh, India, subject to applicable law.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>The competent courts of the applicable jurisdiction shall have jurisdiction, subject to any mandatory statutory jurisdiction that cannot lawfully be excluded and applicable consumer-protection rights.</p>
      </Section>

      {/* Section 12 */}
      <Section num={12} title="Changes to This Privacy Policy">
        <p style={pStyle}>OvikaLiving may update this Privacy Policy from time to time to reflect changes in our Services, business practices, technology, applicable laws or regulatory requirements.</p>
        <p style={pStyle}>When we update this Policy, we will publish the revised version on the Platform and update the "Last Updated" date.</p>
        <p style={pStyle}>Where appropriate, we may also communicate material changes through the Platform, email, dashboard, account notifications or other reasonable electronic means.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>Your continued use of the Services after an update may constitute acceptance of the revised Policy, subject to applicable law.</p>
      </Section>

      {/* Section 13 */}
      <Section num={13} title="Severability and Related Policies">
        <p style={pStyle}>If any provision of this Privacy Policy is found to be invalid, unlawful or unenforceable, the remaining provisions will continue in effect to the extent permitted by law.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>This Privacy Policy should be read together with the OvikaLiving Website Terms &amp; Conditions, Master Property Owner Agreement, Charges, Payment and Settlement terms, and Cancellation and Refund Policy, as applicable.</p>
      </Section>

      {/* Contact Section */}
      <div style={{
        maxWidth: '860px',
        margin: '0 auto 14px',
        padding: '36px 32px',
        background: 'linear-gradient(135deg, #c2772b 0%, #d4894a 100%)',
        borderRadius: '18px',
        textAlign: 'center',
        color: 'white',
        boxShadow: '0 8px 28px rgba(194,119,43,0.25)'
      }}>
        <h3 style={{ fontSize: '26px', marginBottom: '12px', fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>Need Help?</h3>
        <p style={{ fontSize: '15px', marginBottom: '28px', color: 'rgba(255,255,255,0.9)', fontFamily: "'Poppins', sans-serif" }}>For any questions or concerns regarding this Privacy Policy, please contact us at:</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <a href="mailto:enquiry@ovikaliving.com" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'white',
            color: '#1a1209',
            padding: '15px 30px',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '15px',
            transition: 'all 0.3s ease',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            enquiry@ovikaliving.com
          </a>
          <a href="tel:9319392227" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'white',
            color: '#1a1209',
            padding: '15px 30px',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '15px',
            transition: 'all 0.3s ease',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1469 21.5901 20.9046 21.7335 20.6408 21.8227C20.377 21.9119 20.0973 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.09501 3.90347 2.12787 3.62477 2.21649 3.36163C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.04981 2.28271 3.30379 2.17052C3.55778 2.05833 3.83234 2.00026 4.10999 2H7.10999C7.59522 1.99522 8.06574 2.16708 8.43376 2.48353C8.80178 2.79999 9.04202 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4136 11.5864 14.4865 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0554 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            9319392227
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div style={{ maxWidth: '860px', margin: '0 auto 14px', textAlign: 'center', fontSize: '12px', color: '#8a7660' }}>
        © 2026 Townmanor Technologies Private Limited. All rights reserved.
      </div>

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

export default PrivacyPolicy;
