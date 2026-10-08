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
const ulStyle = { margin: '16px 0 20px 25px', paddingLeft: '15px', listStyleType: 'disc' };
const liStyle = { marginBottom: '10px', fontSize: '13px', lineHeight: '1.75' };
const olStyle = { margin: '16px 0 20px 25px', paddingLeft: '15px' };

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
        <title>Privacy Policy | OvikaLiving Partners</title>
        <meta name="description" content="OvikaLiving Partners Privacy Policy — how Townmanor Technologies Private Limited collects, uses, stores and protects Partner (property owner) information." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ovikaliving.com/privacy-policy" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Privacy Policy | OvikaLiving Partners" />
        <meta property="og:description" content="OvikaLiving Partners Privacy Policy for property owners, managers and operators." />
        <meta property="og:url" content="https://www.ovikaliving.com/privacy-policy" />
        <meta property="og:site_name" content="OvikaLiving Partners" />
        <meta property="og:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | OvikaLiving Partners" />
        <meta name="twitter:description" content="OvikaLiving Partners Privacy Policy for property owners, managers and operators." />
        <meta name="twitter:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Privacy Policy | OvikaLiving Partners",
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
        }}>OvikaLiving Partners — Privacy Policy</h1>
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
          <span>Last Updated: 29 September 2026</span>
        </div>
      </div>

      {/* Intro Section */}
      <div style={{ ...cardStyleOdd, borderLeft: '5px solid #c2772b' }}>
        <p style={pStyle}>
          This Privacy Policy explains how <strong>Townmanor Technologies Private Limited</strong>, operating under the brand
          <strong> OvikaLiving Partners</strong> ("OvikaLiving", "we", "us", or "our"), collects, uses, stores, processes, discloses,
          and protects information when you access or use the OvikaLiving Partners mobile application, Partner Dashboard, website,
          and related services (collectively, the "Platform").
        </p>
        <p style={pStyle}>This Privacy Policy applies specifically to:</p>
        <ul style={ulStyle}>
          <li style={liStyle}>Property owners</li>
          <li style={liStyle}>Property managers</li>
          <li style={liStyle}>Property operators</li>
          <li style={liStyle}>Lessors</li>
          <li style={liStyle}>Authorized representatives</li>
          <li style={liStyle}>Other persons authorized to list, manage, verify, or operate accommodation properties through OvikaLiving</li>
        </ul>
        <p style={pStyle}>These persons are collectively referred to as "Partners", "Property Owners", "you", or "your".</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>
          Your use of the Platform may also be governed by the applicable Master Property Owner Agreement, Charges, Payment &amp;
          Settlement Terms, commercial agreements, Terms of Service, and other applicable policies.
        </p>
      </div>

      {/* Section 1 */}
      <Section num={1} title="Information We Collect">
        <p style={pStyle}>We may collect information directly from you, automatically through your use of the Platform, and from authorized third parties.</p>

        <h3 style={h3Style}>1.1 Partner Account Information</h3>
        <p style={pStyle}>Depending on your use of the Platform, we may collect:</p>
        <ul style={ulStyle}>
          <li style={liStyle}>Full name</li>
          <li style={liStyle}>Mobile/telephone number</li>
          <li style={liStyle}>Email address</li>
          <li style={liStyle}>Business name</li>
          <li style={liStyle}>Business address</li>
          <li style={liStyle}>Communication details</li>
          <li style={liStyle}>Account credentials and authentication information</li>
          <li style={liStyle}>OTP verification information</li>
          <li style={liStyle}>Account and login activity</li>
          <li style={liStyle}>Partner profile information</li>
        </ul>
        <p style={pStyle}>We may use this information to create and maintain your Partner account, authenticate your identity, communicate with you, and provide Platform services.</p>

        <h3 style={h3Style}>1.2 Property Information</h3>
        <p style={pStyle}>When you list or manage a property, we may collect information including:</p>
        <ul style={ulStyle}>
          <li style={liStyle}>Property name, address and location</li>
          <li style={liStyle}>Property category/type</li>
          <li style={liStyle}>Photographs and videos</li>
          <li style={liStyle}>Room/unit information</li>
          <li style={liStyle}>Amenities and facilities</li>
          <li style={liStyle}>Occupancy limits and availability</li>
          <li style={liStyle}>Pricing and rental amounts</li>
          <li style={liStyle}>Security deposit information</li>
          <li style={liStyle}>Minimum stay requirements and house rules</li>
          <li style={liStyle}>Check-in and check-out information</li>
          <li style={liStyle}>Property verification information and status</li>
          <li style={liStyle}>Listing and operational information</li>
        </ul>
        <p style={pStyle}>You are responsible for ensuring that the property information submitted by you is accurate, current, and lawful.</p>

        <h3 style={h3Style}>1.3 KYC and Legal Verification Information</h3>
        <p style={pStyle}>To verify your identity, authority to list a property, and compliance with applicable requirements, we may collect:</p>
        <ul style={ulStyle}>
          <li style={liStyle}>Government-issued identity documents, PAN details/documents</li>
          <li style={liStyle}>Property ownership documents, lease agreements, authorization letters, NOCs</li>
          <li style={liStyle}>Commercial licences, registrations, tourism-related registrations where applicable</li>
          <li style={liStyle}>GST details</li>
          <li style={liStyle}>Other documents reasonably required for property or Partner verification</li>
        </ul>
        <p style={pStyle}>Verification may be performed by OvikaLiving or by authorized service providers, and may involve document verification, digital verification, video verification, physical inspection, or other technology-based verification methods.</p>

        <h3 style={h3Style}>1.4 Bank and Financial Information</h3>
        <p style={pStyle}>For payments, settlements, and rental payouts, we may collect bank account holder name, account number, IFSC, cancelled cheque, bank/payment details, settlement information, and payment transaction information.</p>
        <p style={pStyle}>We maintain records relating to booking payouts, Platform charges, fees, taxes, TDS/GST deductions where applicable, settlement amounts and dates, payment status, and reconciliation records.</p>
        <p style={pStyle}>We may share necessary payment and bank information with authorized payment gateways, banking partners, financial institutions, and service providers for processing settlements.</p>
        <p style={pStyle}>OvikaLiving is not responsible for failed or delayed transfers resulting from incorrect, incomplete, outdated, or invalid bank details provided by a Partner.</p>

        <h3 style={h3Style}>1.5 Information Received from Third Parties</h3>
        <p style={{ ...pStyle, marginBottom: 0 }}>
          We may receive information about Partners or properties from authorized representatives, property owners, property
          management entities, verification service providers, payment and banking partners, publicly available sources, or other
          lawful sources where reasonably necessary to provide Platform services, verify property information, prevent fraud, or
          comply with applicable legal or regulatory requirements.
        </p>
      </Section>

      {/* Section 2 */}
      <Section num={2} title="Property Photos, Videos and Listing Content">
        <p style={pStyle}>Partners may upload or provide property photographs, videos, logos, descriptions, property information, floor plans or related materials, and other listing content.</p>
        <p style={pStyle}>By submitting such content, you grant OvikaLiving a non-exclusive license to use, reproduce, display, modify where reasonably necessary for formatting, and distribute such content for purposes including operating the Platform, publishing property listings, displaying search results, promoting properties, marketing, advertising, social media promotion, search engine visibility, and other legitimate Platform-related promotional activities.</p>
        <p style={pStyle}>You represent and warrant that you have the necessary rights, permissions, and authority to provide such content to OvikaLiving.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>You must not upload content that infringes another person's intellectual property, privacy, contractual, or other legal rights.</p>
      </Section>

      {/* Section 3 */}
      <Section num={3} title="Location and Property Verification Information">
        <p style={pStyle}>We may process property location and address information for purposes including property listing, verification, visits, operations, customer discovery and search, property matching, scheduling and managing visits, fraud prevention, and Platform security.</p>
        <p style={pStyle}>Where applicable, we may process location information provided by the Partner or associated with property verification activities.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>The Platform does not require continuous background location tracking unless expressly stated in the applicable app permission request or service description.</p>
      </Section>

      {/* Section 4 */}
      <Section num={4} title="Device and Technical Information">
        <p style={pStyle}>When you use the OvikaLiving Partners Platform, we may automatically receive certain technical information, including where applicable: IP address, device type/model, operating system, app version, browser information, network information, device and application identifiers, session information, crash and diagnostic information, security logs, and login and authentication events.</p>
        <p style={pStyle}>We use this information for Platform operation, security, fraud prevention, troubleshooting, error detection, performance improvement, technical support, and abuse prevention.</p>

        <h3 style={h3Style}>4.1 Device Permissions</h3>
        <p style={pStyle}>To provide specific features, the OvikaLiving Partners app may request access to certain device permissions. We only access these features with your explicit consent:</p>
        <ul style={ulStyle}>
          <li style={liStyle}><strong>Microphone / Audio (RECORD_AUDIO):</strong> to allow you to record audio when capturing property videos, inspections, or using any voice-related features.</li>
          <li style={liStyle}><strong>Biometrics / Fingerprint:</strong> for a secure and fast login experience, using your device's native biometric authentication. Biometric data is processed locally on your device and is not transmitted, collected, or stored by OvikaLiving.</li>
          <li style={liStyle}><strong>Notifications:</strong> to send real-time alerts regarding property enquiries, booking requests, and account updates.</li>
          <li style={liStyle}><strong>Camera and Photos/Videos:</strong> to allow you to capture, select, upload, and manage property photographs, videos, and necessary verification documents.</li>
        </ul>

        <h3 style={h3Style}>4.2 Analytics and Crash Reporting</h3>
        <p style={{ ...pStyle, marginBottom: 0 }}>
          We may use analytics and crash-reporting technologies to understand application usage, diagnose technical issues, monitor
          application performance, improve reliability, and detect security or abuse-related events. Such services may process
          technical information such as device information, application version, operating system information, crash logs,
          diagnostic information, and related identifiers, subject to the configuration of the applicable services.
        </p>
      </Section>

      {/* Section 5 */}
      <Section num={5} title="OTP, Authentication and Account Security">
        <p style={pStyle}>We may process your mobile number and/or email address for authentication and account verification. This may include OTP generation and verification, login attempts, authentication events, password-related security information, account recovery, and security and fraud-prevention records.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>Authentication credentials are handled using appropriate security controls. We do not intend to use your password for purposes unrelated to account authentication and security.</p>
      </Section>

      {/* Section 6 */}
      <Section num={6} title="Communications and Support Information">
        <p style={pStyle}>We may retain communications between you and OvikaLiving for purposes such as customer/Partner support, contract administration, dispute resolution, fraud investigation, security, service improvement, and compliance.</p>
        <p style={pStyle}>This may include in-app communications, emails, support tickets, chat communications with OvikaLiving, call-related records where applicable, and communication timestamps and metadata.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>Where a communication service records or stores content, such processing will be subject to the applicable service and technical configuration.</p>
      </Section>

      {/* Section 7 */}
      <Section num={7} title="Partner and Customer Communications">
        <p style={pStyle}>The Platform may facilitate communication between Partners and customers in connection with property enquiries, booking requests, property visits, negotiations, accommodation services, customer support, and other Platform-related activities.</p>
        <p style={pStyle}>Depending on the applicable feature, Partners may receive limited customer information necessary to provide the requested service.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>Partners must handle customer information confidentially and only for legitimate Platform-related purposes.</p>
      </Section>

      {/* Section 8 */}
      <Section num={8} title="Guest and Customer Data Handled by Partners">
        <p style={pStyle}>A Partner may receive personal information relating to customers or guests through the Platform, including (depending on the transaction) customer name, contact information, property requirement, booking/request details, visit information, communication information, and relevant accommodation information.</p>
        <p style={pStyle}>Partners must:</p>
        <ul style={ulStyle}>
          <li style={liStyle}>Use customer information only for legitimate accommodation, booking, visit, communication, verification, and service-delivery purposes.</li>
          <li style={liStyle}>Keep customer information confidential and take reasonable measures to protect it.</li>
          <li style={liStyle}>Not sell customer information or disclose it to unauthorized persons.</li>
          <li style={liStyle}>Not use customer information for unrelated marketing or solicitation.</li>
          <li style={liStyle}>Not export, copy, scrape, or otherwise misuse customer information.</li>
          <li style={liStyle}>Comply with applicable privacy and data-protection requirements.</li>
        </ul>
        <p style={{ ...pStyle, marginBottom: 0 }}>Partners are responsible for their handling of customer information after receiving it through the Platform.</p>
      </Section>

      {/* Section 9 */}
      <Section num={9} title="Communications, Contact Protection and Platform Security">
        <p style={pStyle}>To protect customers and Partners and maintain Platform integrity, OvikaLiving may use technical and security controls in Platform communications, including detecting or restricting certain contact information, spam, fraud, abuse, unauthorized solicitation, or attempts to circumvent Platform processes.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>Such controls may be used for fraud prevention, user safety, Platform security, prevention of unauthorized solicitation, prevention of spam and abuse, and protection of Platform transactions.</p>
      </Section>

      {/* Section 10 */}
      <Section num={10} title="Property Verification and Inspection">
        <p style={{ ...pStyle, marginBottom: 0 }}>
          Where property verification or inspection is required, we may collect and maintain verification status and dates,
          inspection information (including photographs/videos and notes), verification documents, property verification
          history, and information relating to authorized verification personnel or service providers. Such information may
          be used to determine listing authenticity, property eligibility, and Platform compliance.
        </p>
      </Section>

      {/* Section 11 */}
      <Section num={11} title="How We Use Partner Information">
        <p style={pStyle}>We may use information collected from Partners for purposes including:</p>
        <ol style={olStyle}>
          <li style={liStyle}>Creating and managing Partner accounts.</li>
          <li style={liStyle}>Operating the OvikaLiving Partners Platform.</li>
          <li style={liStyle}>Publishing and managing property listings.</li>
          <li style={liStyle}>Processing property enquiries and bookings.</li>
          <li style={liStyle}>Managing property visits and related services.</li>
          <li style={liStyle}>Processing payments and settlements.</li>
          <li style={liStyle}>Verifying Partner identity and property authority.</li>
          <li style={liStyle}>Conducting KYC and property verification.</li>
          <li style={liStyle}>Preventing fraudulent or misleading listings.</li>
          <li style={liStyle}>Maintaining Platform security.</li>
          <li style={liStyle}>Providing customer and Partner support.</li>
          <li style={liStyle}>Communicating Platform updates and operational information.</li>
          <li style={liStyle}>Maintaining financial, tax, accounting, and settlement records.</li>
          <li style={liStyle}>Complying with applicable laws and regulatory requirements.</li>
          <li style={liStyle}>Enforcing contractual and commercial agreements.</li>
          <li style={liStyle}>Investigating disputes, fraud, abuse, or security incidents.</li>
          <li style={liStyle}>Improving Platform functionality and reliability.</li>
          <li style={{ ...liStyle, marginBottom: 0 }}>Protecting the rights, property, and safety of OvikaLiving, Partners, customers, and other users.</li>
        </ol>
      </Section>

      {/* Section 12 */}
      <Section num={12} title="Push Notifications">
        <p style={pStyle}>With the applicable device permissions and Platform configuration, OvikaLiving may send push notifications relating to new property enquiries, booking requests, customer requests, visit requests and updates, property verification, account activity, payment/settlement updates, operational alerts, security alerts, and other Platform-related activities.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>You may be able to control certain notification permissions through your device settings.</p>
      </Section>

      {/* Section 13 */}
      <Section num={13} title="How We Share Information">
        <p style={pStyle}>We may share information where reasonably necessary for operating the Platform and providing requested services. Recipients may include:</p>

        <h3 style={h3Style}>13.1 Service Providers</h3>
        <p style={pStyle}>Authorized providers supporting cloud infrastructure, hosting, KYC verification, payment processing, banking and settlements, authentication/OTP, notifications, communication, security, analytics, crash/error reporting, and customer support.</p>

        <h3 style={h3Style}>13.2 Financial Institutions</h3>
        <p style={pStyle}>Necessary information may be shared with payment gateways, banks, and financial institutions for payment processing and settlement.</p>

        <h3 style={h3Style}>13.3 Legal and Regulatory Authorities</h3>
        <p style={pStyle}>We may disclose information where required or permitted by applicable law, regulation, legal process, court order, governmental request, or to protect legal rights.</p>

        <h3 style={h3Style}>13.4 Professional Advisers</h3>
        <p style={pStyle}>Information may be shared with professional advisers such as legal, accounting, audit, tax, or compliance professionals where reasonably necessary.</p>

        <h3 style={h3Style}>13.5 Business Transactions</h3>
        <p style={{ ...pStyle, marginBottom: 0 }}>If OvikaLiving or its business assets are involved in a merger, acquisition, restructuring, financing, sale, or similar transaction, information may be transferred as part of that transaction, subject to applicable legal requirements.</p>
      </Section>

      {/* Section 14 */}
      <Section num={14} title="Data Security">
        <p style={pStyle}>We use reasonable technical, administrative, and organizational measures designed to protect information against unauthorized access, unauthorized disclosure, loss, misuse, alteration, and destruction.</p>
        <p style={pStyle}>Depending on the nature of the information and applicable systems, safeguards may include authentication controls, access controls, role-based permissions, encryption/security protections where applicable, monitoring and logging, secure infrastructure, least-privilege access, backup and recovery mechanisms, and security and incident-management processes.</p>
        <p style={pStyle}>However, no electronic system or transmission method can be guaranteed to be completely secure.</p>

        <h3 style={h3Style}>14.1 Security Incidents</h3>
        <p style={pStyle}>If OvikaLiving becomes aware of a security incident involving personal information, we will assess and respond to the incident in accordance with applicable law and our internal security and incident-response procedures.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>Where required by applicable law, we may notify affected persons or relevant authorities.</p>
      </Section>

      {/* Section 15 */}
      <Section num={15} title="Data Retention">
        <p style={pStyle}>We retain Partner information for as long as reasonably necessary for the purposes described in this Privacy Policy. Retention periods may depend on the nature of the information, the purpose for which it was collected, the Partner relationship, contractual requirements, financial and accounting requirements, tax requirements, legal and regulatory obligations, dispute resolution, fraud prevention, and security requirements.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>Certain information may therefore continue to be retained after account closure where required or reasonably necessary for legal, tax, accounting, regulatory, security, fraud-prevention, or dispute-resolution purposes.</p>
      </Section>

      {/* Section 16 */}
      <Section num={16} title="Account Closure and Deletion">
        <p style={pStyle}>
          Partners may request closure or deletion of their account through the "Delete Account" option available in the OvikaLiving
          Partners application or through the account deletion webpage at{' '}
          <Link to="/delete-account" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #c98b3e' }}>
            https://www.ovikaliving.com/delete-account
          </Link> on the official OvikaLiving website.
        </p>
        <p style={pStyle}>Upon receiving a valid deletion request, OvikaLiving will process the request in accordance with applicable law and its data-retention obligations. Upon account closure or deletion, OvikaLiving may:</p>
        <ul style={ulStyle}>
          <li style={liStyle}>Disable access to the Partner account.</li>
          <li style={liStyle}>Remove or deactivate active listings where appropriate.</li>
          <li style={liStyle}>Retain information required for ongoing bookings, settlements, disputes, legal obligations, tax requirements, security, fraud prevention, or regulatory compliance.</li>
          <li style={liStyle}>Delete or anonymize information where retention is no longer necessary and where permitted by applicable law.</li>
        </ul>
        <p style={{ ...pStyle, marginBottom: 0 }}>
          Account deletion does not necessarily result in immediate deletion of all records. Certain information may be retained
          where required or reasonably necessary for legal, tax, accounting, regulatory, security, fraud-prevention, contractual,
          or dispute-resolution purposes.
        </p>
      </Section>

      {/* Section 17 */}
      <Section num={17} title="Partner Responsibilities">
        <p style={pStyle}>Partners are responsible for:</p>
        <ul style={ulStyle}>
          <li style={liStyle}>Providing accurate information and keeping account information updated.</li>
          <li style={liStyle}>Protecting account credentials and maintaining confidentiality of Platform information.</li>
          <li style={liStyle}>Ensuring they have authority to list properties.</li>
          <li style={liStyle}>Ensuring uploaded content does not infringe third-party rights.</li>
          <li style={liStyle}>Handling customer information responsibly.</li>
          <li style={liStyle}>Complying with applicable laws.</li>
          <li style={{ ...liStyle, marginBottom: 0 }}>Informing OvikaLiving of suspected unauthorized account access or security incidents.</li>
        </ul>
      </Section>

      {/* Section 18 */}
      <Section num={18} title="Third-Party Services and External Links">
        <p style={pStyle}>The Platform may use or integrate with third-party services. Third-party providers may have their own privacy policies and terms. Where you interact directly with a third-party service, that provider's privacy practices may also apply.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>OvikaLiving is not responsible for privacy practices of third-party services that operate independently from OvikaLiving.</p>
      </Section>

      {/* Section 19 */}
      <Section num={19} title="Cookies and Similar Technologies">
        <p style={pStyle}>The Partner Dashboard or related web services may use cookies or similar technologies for authentication, session management, security, preferences, performance, and analytics where applicable.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>You may be able to manage certain cookie settings through your browser.</p>
      </Section>

      {/* Section 20 */}
      <Section num={20} title="Children's Privacy">
        <p style={pStyle}>The OvikaLiving Partners Platform is intended for adult property owners, property managers, operators, lessors, and authorized representatives. The Platform is not intended for children.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>We do not knowingly seek to collect personal information from children for Partner account creation.</p>
      </Section>

      {/* Section 21 */}
      <Section num={21} title="Your Privacy Requests">
        <p style={pStyle}>Subject to applicable law and reasonable verification requirements, you may contact us regarding requests relating to your personal information, including where applicable: access, correction, updating inaccurate information, account closure, deletion where legally available, and privacy-related questions or complaints.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>Some information may not be eligible for deletion where retention is required by law, regulation, contract, accounting, tax, security, fraud prevention, or dispute-resolution requirements.</p>
      </Section>

      {/* Section 22 - Grievance Contact */}
      <Section num={22} title="Grievance and Privacy Contact">
        <p style={pStyle}>OvikaLiving maintains a grievance mechanism in accordance with applicable Indian laws and regulations. For privacy-related complaints, concerns, or requests, you may contact:</p>
        <div style={{ fontSize: '14px', marginTop: '16px', padding: '18px', background: '#f9f9f9', borderLeft: '4px solid #c98b3e', borderRadius: '6px', lineHeight: '1.9' }}>
          <div><strong>Company:</strong> OvikaLiving, a brand of Townmanor Technologies Private Limited</div>
          <div><strong>Grievance Officer:</strong> Ankush Mishra</div>
          <div><strong>Email:</strong> <a href="mailto:enquiry@ovikaliving.com" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #c98b3e' }}>enquiry@ovikaliving.com</a></div>
          <div><strong>Phone:</strong> 9319392227</div>
          <div><strong>Registered Office:</strong> ST-304, Eldeco Studio, Sector-93A, Noida, Uttar Pradesh – 201304</div>
          <div><strong>Website:</strong> <a href="https://www.ovikaliving.com" style={{ color: '#c2772b', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #c98b3e' }}>www.ovikaliving.com</a></div>
        </div>
      </Section>

      {/* Section 23 - Corporate Details */}
      <Section num={23} title="Corporate Details">
        <p style={pStyle}><strong>Legal Entity:</strong> Townmanor Technologies Private Limited</p>
        <p style={pStyle}><strong>Brand:</strong> OvikaLiving</p>
        <p style={pStyle}><strong>CIN:</strong> U68200UP2023PTC193656</p>
        <p style={{ ...pStyle, marginBottom: 0 }}><strong>GSTIN:</strong> 09AAKCT6155G1ZZ</p>
      </Section>

      {/* Section 24 */}
      <Section num={24} title="Changes to This Privacy Policy">
        <p style={pStyle}>We may update this Privacy Policy from time to time to reflect changes to our Platform, changes to our services, changes in applicable law, changes in data-processing practices, and security or operational requirements.</p>
        <p style={pStyle}>When we update this Policy, we will revise the "Last Updated" date at the beginning of the Policy.</p>
        <p style={{ ...pStyle, marginBottom: 0 }}>Where appropriate, we may provide additional notice for material changes.</p>
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
