import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import './TermsAndConditions.css';

const TermsAndConditions = () => {
  return (
    <div className="terms-conditions">
      <Helmet>
        <title>Terms & Conditions | OvikaLiving – PG & Co-Living Platform Noida</title>
        <meta name="description" content="Read OvikaLiving's Terms and Conditions for booking PG, co-living spaces, furnished apartments and rental stays in Noida & Greater Noida. Understand your rights and responsibilities." />
        <meta name="keywords" content="ovikaliving terms and conditions, ovika terms of service, pg booking terms noida, co-living terms noida, rental agreement noida, ovika user agreement, नियम और शर्तें ओविका, पीजी बुकिंग नियम नोएडा, किराया नियम नोएडा, ओविका लिविंग नियम" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ovikaliving.com/terms-and-conditions" />
        <meta property="og:title" content="Terms & Conditions | OvikaLiving Noida" />
        <meta property="og:description" content="OvikaLiving Terms and Conditions for PG, co-living and rental bookings in Noida & Greater Noida." />
        <meta property="og:url" content="https://www.ovikaliving.com/terms-and-conditions" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Terms & Conditions | OvikaLiving" />
      </Helmet>
      <h1 className="page-title">
        Terms and Conditions
        <span className="title-underline"></span>
      </h1>

      <p className="last-updated">Last Updated: 17th December, 2025</p>

      <div className="intro-text">
        <p>
          These Terms and Conditions ("Terms") govern your access to and use of the Ovikaliving.com platform,
          operated under Townmanor Technologies ("Ovikaliving.com", "we", "us", "our").
        </p>
        <p>
          By accessing, registering, or using our website(s) ovikaliving.com (collectively, the
          "Platform"), you agree to be legally bound by these Terms.
        </p>
        <p className="warning-text">
          If you do not agree, please do not use the Platform.
        </p>
      </div>

      {/* Section 1 */}
      <div className="section-container">
        <div className="section-header">
          <div className="section-number">1</div>
          <h2 className="section-title">About Ovikaliving.com and the Platform</h2>
        </div>
        <div className="section-content">
          <p>
            Ovikaliving.com operates as a digital marketplace that enables guests seeking accommodation to
            connect with hosts or property owners offering PG, co-living, rental, and other residential living
            spaces across India.
          </p>
          <p>
            At present, the Platform functions solely as an intermediary and does not own, operate, or control
            most of the properties listed. In the future, the company may directly manage or operate certain
            properties; in such cases, additional or modified terms may apply, which will be communicated
            accordingly.
          </p>
        </div>
      </div>

      {/* Section 2 */}
      <div className="section-container">
        <div className="section-header">
          <div className="section-number">2</div>
          <h2 className="section-title">Eligibility to Use the Platform</h2>
        </div>
        <div className="section-content">
          <p>To access or use the Platform, you must:</p>
          <ul className="list-style">
            <li>Be at least 18 years of age</li>
            <li>Be legally capable of entering into a binding contract under Indian law</li>
            <li>Provide accurate, complete, and up-to-date information during registration or when interacting with the Platform</li>
          </ul>
          <p>
            The company reserves the right to restrict, suspend, or terminate access to the Platform if any
            eligibility requirement is violated or if submitted information is found to be inaccurate or misleading.
          </p>
        </div>
      </div>

      {/* Section 3 */}
      <div className="section-container">
        <div className="section-header">
          <div className="section-number">3</div>
          <h2 className="section-title">User Accounts and Responsibilities</h2>
        </div>
        <div className="section-content">
          <h3>3.1 Account Registration</h3>
          <ul className="list-style">
            <li>Certain features of the Platform require users to create an account.</li>
            <li>You are solely responsible for maintaining the confidentiality and security of your login credentials and for all activities conducted under your account.</li>
            <li>You agree to notify the Platform promptly of any unauthorized access, misuse, or suspected security breach involving your account.</li>
          </ul>
          
          <h3>3.2 Accuracy of Information</h3>
          <p>
            You agree that all information you provide on or through the Platform—including identity documents, contact details, and property-related information—is true, accurate, current, and complete.
            Submitting false, misleading, or incomplete information may result in the suspension or termination of your account, in addition to any other legal or administrative actions deemed appropriate.
          </p>
        </div>
      </div>

      {/* Section 4 */}
      <div className="section-container">
        <div className="section-header">
          <div className="section-number">4</div>
          <h2 className="section-title">Role of Ovikaliving.com (Marketplace Disclaimer)</h2>
        </div>
        <div className="section-content">
          <p>
            Unless specifically stated otherwise, Ovikaliving.com functions solely as a technology intermediary that facilitates interactions between guests seeking accommodation and hosts or property owners offering residential spaces. The Platform enables listing, discovery, communication, and booking but does not control or manage the actual properties listed by hosts.
          </p>
          <p>
            The Platform is not a party to any contractual arrangement, agreement, or transaction entered into between guests and hosts. All bookings, payments, stays, and related obligations arise directly between the parties involved.
          </p>
          <p>
            Accordingly, the Platform does not provide any guarantee or assurance regarding:
          </p>
          <ul className="list-style">
            <li>The condition, safety, suitability, or amenities of any listed property</li>
            <li>The conduct, behavior, or actions of guests or hosts</li>
            <li>The accuracy, completeness, or reliability of property listings, except for reasonable checks performed to ensure compliance with Platform policies</li>
          </ul>
          <p>
            The responsibility for evaluating the suitability of a property, verifying listing details, and ensuring safe interactions rests solely with the respective guest and host.
          </p>
        </div>
      </div>

      {/* Section 5 */}
      <div className="section-container">
        <div className="section-header">
          <div className="section-number">5</div>
          <h2 className="section-title">Property Listings (Hosts / Owners)</h2>
        </div>
        <div className="section-content">
          <p>
            Hosts and property owners are responsible for ensuring that all information they publish on the Platform is accurate, lawful, and up to date. By listing a property, hosts/owners agree to:
          </p>
          <ul className="list-style">
            <li>Provide truthful and complete descriptions, photographs, pricing details, amenities, and availability schedules for the property.</li>
            <li>Comply with all applicable local, municipal, zoning, rental, and housing regulations, including any licensing or registration requirements.</li>
            <li>Honor all confirmed bookings made through the Platform unless prevented by legitimate and verifiable circumstances.</li>
            <li>Maintain the property in a state that meets reasonable standards of safety, hygiene, habitability, and basic services.</li>
          </ul>
          <p>
            Listings that violate these Terms, provide misleading information, or fail to meet required legal or safety standards may be suspended or removed from the Platform.
          </p>
        </div>
      </div>

      {/* Section 6 */}
      <div className="section-container">
        <div className="section-header">
          <div className="section-number">6</div>
          <h2 className="section-title">Bookings and Stay Conditions (Guests)</h2>
        </div>
        <div className="section-content">
          <p>
            Guests are expected to review and understand the terms associated with a booking before completing the reservation. By making a booking, guests agree to:
          </p>
          <ul className="list-style">
            <li>Carefully review all property details, amenities, pricing, policies, and house rules prior to confirming the booking.</li>
            <li>Comply with all house rules established by the host, including check-in/out procedures, usage restrictions, and conduct expectations.</li>
            <li>Use the property in a lawful, responsible, and respectful manner, ensuring no damage or nuisance is caused.</li>
            <li>Respect neighbors, community norms, and local regulations, including noise limits and occupancy restrictions.</li>
          </ul>
          <p>
            If a guest violates house rules, engages in unlawful conduct, or causes disturbances or damage, the host may terminate the stay early without refund, and the guest may be subject to additional charges or penalties where applicable.
          </p>
        </div>
      </div>

      {/* Section 7 */}
      <div className="section-container">
        <div className="section-header">
          <div className="section-number">7</div>
          <h2 className="section-title">Payments, Pricing, and Fees</h2>
        </div>
        <div className="section-content">
          <h3>7.1 Payment Processing</h3>
          <ul className="list-style">
            <li>All payments for bookings made through the Platform are processed securely via PayU, an independent third-party payment gateway.</li>
            <li>The Platform does not store, access, or retain users' bank account numbers, card details, UPI credentials, or other sensitive payment information.</li>
            <li>By completing a transaction, you authorize PayU and any associated financial institutions to process the payment in accordance with their own terms and regulatory requirements.</li>
            <li>Any delays, failures, or technical issues related to payment processing are subject to PayU's operational frameworks, and users may be redirected to PayU's support channels where necessary.</li>
          </ul>

          <h3>7.2 Pricing</h3>
          <ul className="list-style">
            <li>Property prices, rental charges, and associated conditions are set by hosts/owners and displayed transparently on the Platform.</li>
            <li>Pricing may include additional components such as taxes, security deposits, platform service charges, or convenience fees, where applicable.</li>
            <li>The final payable amount, inclusive of all applicable fees, will be presented to the guest before the booking is confirmed.</li>
            <li>Hosts are responsible for ensuring that listed prices comply with applicable tax requirements and legal obligations.</li>
          </ul>
        </div>
      </div>

      {/* Section 8 */}
      <div className="section-container">
        <div className="section-header">
          <div className="section-number">8</div>
          <h2 className="section-title">Cancellation, Refund & Refund Policy</h2>
        </div>
        <div className="section-content">
          <p>
            This section outlines the terms governing cancellations, refunds, and related financial adjustments. Because cancellations directly affect both guests and hosts, this policy is designed to ensure transparency and fairness.
          </p>
          
          <h3>8.1 General Refund Principles</h3>
          <p>Refund eligibility is determined by a combination of factors, including:</p>
          <ul className="list-style">
            <li>The cancellation policy selected or applied by the host</li>
            <li>The timing of the cancellation relative to the check-in date</li>
            <li>The type and nature of the booking (refundable, partially refundable, non-refundable, etc.)</li>
          </ul>
          <p>
            The Platform facilitates refund processing but does not independently approve or deny refunds, except where required by applicable law, Platform policies, or in cases involving misuse, fraud, or safety concerns.
          </p>

          <h3>8.2 Guest-Initiated Cancellations</h3>
          <p>Refunds for cancellations made by guests depend on the specific policy displayed on the listing or booking confirmation page. These may include:</p>
          <ul className="list-style">
            <li><strong>Free Cancellation Window:</strong> A full or partial refund may be issued if the booking is cancelled within the permitted free-cancellation period.</li>
            <li><strong>Partial Refund:</strong> Guests may receive a reduced refund based on how close to the check-in date the cancellation occurs. The applicable percentage is defined in the listing's cancellation terms.</li>
            <li><strong>Non-Refundable Bookings:</strong> Some bookings are fully non-refundable once confirmed. In such cases, no refund will be issued regardless of the cancellation timing.</li>
          </ul>
          <p><em>Additional Notes:</em> Service fees, convenience charges, or payment gateway fees may be non-refundable, unless explicitly stated otherwise or mandated by law.</p>

          <h3>8.3 Host-Initiated Cancellations</h3>
          <p>If a host cancels a confirmed booking:</p>
          <ul className="list-style">
            <li>The guest will receive a full refund, including applicable service charges</li>
            <li>The Platform may assist the guest in arranging alternative accommodation, subject to availability</li>
            <li>Hosts who frequently cancel confirmed bookings may be subject to penalties, reduced listing visibility, or temporary/permanent account suspension</li>
          </ul>

          <h3>8.4 No-Shows & Early Check-Out</h3>
          <ul className="list-style">
            <li>Guests who fail to check in ("no-show") are not eligible for a refund, unless the host's policy explicitly allows otherwise</li>
            <li>Early check-outs generally do not qualify for refunds, except where permitted under the host's terms or in approved exceptional circumstances</li>
          </ul>

          <h3>8.5 Refund Processing Timeline</h3>
          <ul className="list-style">
            <li>Once a refund is approved, it will be initiated through PayU, the payment gateway handling the original transaction</li>
            <li>Refunds typically reflect in the guest's account within 5–10 business days, depending on the payment method, issuing bank, and settlement cycles</li>
            <li>Delays caused by banks or third-party systems are outside the Platform's control</li>
          </ul>

          <h3>8.6 Exceptional Circumstances</h3>
          <p>Refunds or partial refunds may be considered under exceptional or unavoidable circumstances such as:</p>
          <ul className="list-style">
            <li>Government-imposed restrictions or travel bans</li>
            <li>Natural disasters, severe weather conditions, or public emergencies</li>
            <li>Legal orders, safety concerns, or conditions making the stay impossible or unsafe</li>
          </ul>
          <p>Such situations are evaluated case-by-case, and supporting documentation may be required to assess eligibility.</p>
        </div>
      </div>

      {/* Section 9 */}
      <div className="section-container">
        <div className="section-header">
          <div className="section-number">9</div>
          <h2 className="section-title">Taxes and Legal Compliance</h2>
        </div>
        <div className="section-content">
          <p>
            Hosts/property owners are solely responsible for ensuring full compliance with all applicable tax and regulatory obligations related to their listings. This includes:
          </p>
          <ul className="list-style">
            <li>Assessing and paying GST, local taxes, municipal charges, or any other statutory levies applicable to their property rentals</li>
            <li>Complying with housing, tenancy, zoning, safety, and municipal regulations governing rental or accommodation services</li>
          </ul>
          <p>
            Where required under Indian law, the Platform may collect, deduct, or remit taxes (such as GST or TCS) on behalf of hosts or guests. Any such actions will be communicated transparently through the booking interface or relevant documentation.
          </p>
        </div>
      </div>

      {/* Section 10 */}
      <div className="section-container">
        <div className="section-header">
          <div className="section-number">10</div>
          <h2 className="section-title">Reviews, Feedback, and Content</h2>
        </div>
        <div className="section-content">
          <p>
            Users may submit reviews, ratings, photos, or feedback regarding their experience on the Platform. By posting such content, you agree that:
          </p>
          <ul className="list-style">
            <li>All reviews must be truthful, fair, and non-defamatory, and must not violate the rights or reputation of others</li>
            <li>Content must not include abusive, discriminatory, or otherwise inappropriate language</li>
            <li>The Platform may modify, hide, or remove content that violates these Terms, infringes on third-party rights, or is deemed misleading or harmful</li>
            <li>Submitted content may be used by the Platform for service improvement, quality assurance, marketing, or promotional activities, subject to applicable laws</li>
          </ul>
          <p>
            Users remain responsible for the content they publish and must ensure it does not violate any intellectual property, privacy, or legal standards.
          </p>
        </div>
      </div>

      {/* Section 11 */}
      <div className="section-container">
        <div className="section-header">
          <div className="section-number">11</div>
          <h2 className="section-title">Prohibited Activities</h2>
        </div>
        <div className="section-content">
          <p>
            Users are strictly prohibited from engaging in any activity that may compromise the integrity, security, or lawful operation of the Platform. This includes, but is not limited to:
          </p>
          <ul className="list-style">
            <li>Using the Platform for illegal, fraudulent, or unauthorized purposes</li>
            <li>Posting false, misleading, or fraudulent listings or information</li>
            <li>Attempting to circumvent or bypass the payment system or Platform policies</li>
            <li>Harassing, abusing, threatening, or engaging in harmful behavior toward other users, hosts, guests, or support representatives</li>
            <li>Attempting to reverse engineer, hack, disrupt, or otherwise misuse any part of the Platform's technology or infrastructure</li>
          </ul>
          <p>
            Any violation of these rules may result in immediate suspension or termination of your account, denial of access to the Platform, and potential legal action where appropriate.
          </p>
        </div>
      </div>

      {/* Section 12 */}
      <div className="section-container">
        <div className="section-header">
          <div className="section-number">12</div>
          <h2 className="section-title">Suspension and Termination</h2>
        </div>
        <div className="section-content">
          <p>
            The Platform reserves the right to suspend or terminate a user's access, account, or listings at any time, with or without prior notice, under the following circumstances:
          </p>
          <ul className="list-style">
            <li>Violation of these Terms or any applicable policies</li>
            <li>Engagement in fraudulent, abusive, harmful, or unlawful activities</li>
            <li>Actions necessary to comply with applicable laws, regulatory directives, or court orders</li>
          </ul>
          <p>
            Suspension or termination under this clause does not affect any rights, obligations, or liabilities accrued by either party prior to the effective date of termination. Users may also lose access to pending bookings or Platform services as a consequence of such actions.
          </p>
        </div>
      </div>

      {/* Section 13 */}
      <div className="section-container">
        <div className="section-header">
          <div className="section-number">13</div>
          <h2 className="section-title">Limitation of Liability</h2>
        </div>
        <div className="section-content">
          <p>
            To the fullest extent permitted under applicable Indian law:
          </p>
          <ul className="list-style">
            <li>The Platform shall not be liable for any indirect, incidental, punitive, exemplary, or consequential damages, including loss of profits, data, goodwill, or business opportunities.</li>
            <li>The Platform is not responsible for disputes between guests and hosts, nor does it guarantee the performance, conduct, or suitability of either party.</li>
            <li>The total aggregate liability of the Platform, for any claim arising out of or related to a specific booking or use of the Platform, shall not exceed the total fees paid to the Platform for that booking.</li>
          </ul>
          <p>
            Nothing in this section limits liability where such limitation is prohibited by law.
          </p>
        </div>
      </div>

      {/* Section 14 */}
      <div className="section-container">
        <div className="section-header">
          <div className="section-number">14</div>
          <h2 className="section-title">Indemnification</h2>
        </div>
        <div className="section-content">
        <p>
  You agree to indemnify, defend, and hold harmless the Platform operated by Townmanor Technologies, including its websites such as <strong>ovikaliving.com</strong>, along with their respective directors, employees, affiliates, and service partners, from any claims, demands, losses, liabilities, damages, or expenses (including legal fees) arising out of or related to:
</p>

          <ul className="list-style">
            <li>Your use or misuse of the Platform</li>
            <li>Your breach of these Terms or any supplemental policies</li>
            <li>Your violation of applicable laws, regulations, or third-party rights</li>
          </ul>
          <p>
            This obligation survives the termination of your account or cessation of Platform use.
          </p>
        </div>
      </div>

      {/* Section 15 */}
      <div className="section-container">
        <div className="section-header">
          <div className="section-number">15</div>
          <h2 className="section-title">Intellectual Property</h2>
        </div>
        <div className="section-content">
          <p>
            All content made available on the Platform—including but not limited to text, images, graphics, logos, icons, design elements, software, and branding—is the exclusive property of the company or is used under valid licenses or authorizations.
          </p>
          <p>
            Users are prohibited from copying, reproducing, distributing, modifying, or otherwise using any intellectual property from the Platform without prior written consent, except where permitted under applicable law.
          </p>
        </div>
      </div>

      {/* Section 16 */}
      <div className="section-container">
        <div className="section-header">
          <div className="section-number">16</div>
          <h2 className="section-title">Governing Law and Dispute Resolution</h2>
        </div>
        <div className="section-content">
          <ul className="list-style">
            <li>These Terms shall be governed by and interpreted in accordance with the laws of India.</li>
            <li>Subject to applicable laws, courts located within India shall have exclusive jurisdiction over any disputes arising out of or relating to these Terms or the use of the Platform.</li>
            <li>Before initiating formal legal proceedings, the Platform may, at its discretion, attempt to resolve disputes through amicable or informal negotiation, wherever feasible.</li>
          </ul>
        </div>
      </div>

      {/* Section 17 */}
      <div className="section-container">
        <div className="section-header">
          <div className="section-number">17</div>
          <h2 className="section-title">Changes to Terms</h2>
        </div>
        <div className="section-content">
          <p>
            The Platform may update, revise, or modify these Terms from time to time to reflect operational, legal, or regulatory changes.
            Updated Terms will be published on the Platform, and continued use of the services after such updates shall constitute your acceptance of the revised Terms. Users are encouraged to review these Terms periodically.
          </p>
        </div>
      </div>

      {/* Section 18 */}
      {/* <div className="section-container">
        <div className="section-header">
          <div className="section-number">18</div>
          <h2 className="section-title">Contact Information</h2>
        </div>
        <div className="section-content">
          <p>For questions, support, or legal notices:</p>
          <p>
            <a href="mailto:enquiry@ovikaliving.com" className="contact-email">enquiry@ovikaliving.com</a><br />
            <a href="mailto:support@townmanor.ai" className="contact-email">support@townmanor.ai</a>
          </p>
        </div>
      </div> */}
      
      {/* Contact Section */}
      <div className="contact-section">
        <h3>Need Help?</h3>
        <p>For any questions or concerns regarding these Terms and Conditions, please contact us at:</p>
        <div className="contact-options">
          <a href="mailto:enquiry@ovikaliving.com" className="contact-email">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#c98b3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 6L12 13L2 6" stroke="#c98b3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            enquiry@ovikaliving.com
          </a>
          <span className="or-divider">or</span>
          <a href="mailto:support@townmanor.ai" className="contact-email">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#c98b3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 6L12 13L2 6" stroke="#c98b3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            support@townmanor.ai
          </a>
        </div>
      </div>

      {/* Back to Home Button */}
      <div className="back-home-container">
        <Link to="/" className="back-home-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="back-arrow">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default TermsAndConditions;
