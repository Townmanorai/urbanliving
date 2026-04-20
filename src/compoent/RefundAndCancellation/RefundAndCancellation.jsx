
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import './RefundAndCancellation.css';

const RefundAndCancellation = () => {
  return (
    <div className="refund-policy-wrapper-unique">
      <Helmet>
        <title>Refund & Cancellation Policy | OvikaLiving – Noida PG & Rentals</title>
        <meta name="description" content="Learn about OvikaLiving's Refund and Cancellation Policy for PG, co-living, and rental bookings in Noida & Greater Noida. Understand cancellation timelines and refund process." />
        <meta name="keywords" content="ovikaliving refund policy, cancellation policy pg noida, refund pg booking noida, ovika cancellation, co-living cancellation policy, rental refund noida, ovika money back, रिफंड नीति नोएडा, पीजी बुकिंग कैंसिलेशन नोएडा, ओविका रिफंड पॉलिसी, पैसे वापसी पीजी नोएडा, किराया रद्द नोएडा" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ovikaliving.com/refund-cancellation-policy" />
        <meta property="og:title" content="Refund & Cancellation Policy | OvikaLiving" />
        <meta property="og:description" content="OvikaLiving's refund and cancellation policy for PG and co-living bookings in Noida & Greater Noida." />
        <meta property="og:url" content="https://www.ovikaliving.com/refund-cancellation-policy" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Refund & Cancellation Policy | OvikaLiving" />
      </Helmet>
      {/* Hero Header */}
      <div className="refund-hero-section-unique">
        <h1 className="refund-main-title-unique">Refund & Cancellation Policy</h1>
        <div className="refund-last-updated-unique">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 2V6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 2V6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 10H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Last Updated: 17<sup>th</sup> December, 2025
        </div>
      </div>

      {/* Intro Section */}
      <div className="refund-intro-section-unique">
        <p className="refund-intro-text-unique">
          This Refund & Cancellation Policy ("Policy") governs the cancellation of bookings and the processing
          of refunds made through the Ovikaliving platform.
        </p>
        <p className="refund-intro-text-unique">
          Ovikaliving is a flagship brand operated under Townmanor Technology Pvt. Ltd. ("Company", "we",
          "us", "our").
        </p>
        <p className="refund-intro-text-unique">
          This Policy is to be read in conjunction with our Terms & Conditions and Privacy Policy. In the event
          of any conflict, the Terms & Conditions shall prevail.
        </p>
      </div>

      {/* Section 1 */}
      <div className="refund-section-unique">
        <div className="refund-section-header-unique">
          <div className="refund-section-number-unique">01</div>
          <h2>About Ovikaliving & Applicability of This Policy</h2>
        </div>
        <div className="refund-section-content-unique">
          <p>
            Ovikaliving operates as a technology-enabled short-term stay marketplace connecting guests with
            hosts or property owners offering PG, co-living, rental, and other residential living spaces across
            India.
          </p>
          <p>This Policy applies to:</p>
          <ul>
            <li>All bookings made through:</li>
            <ul>
              <li><a href="https://www.ovikaliving.com">https://www.ovikaliving.com</a></li>
              <li><a href="https://ovikaliving.com/">https://ovikaliving.com/</a></li>
            </ul>
            <li>All cancellations initiated by guests or hosts</li>
            <li>All refund requests processed through the Platform</li>
          </ul>
          <p>
            Ovikaliving acts primarily as an intermediary platform and facilitates refunds in accordance with this
            Policy, applicable host terms, and Indian law.
          </p>
        </div>
      </div>

      {/* Section 2 */}
      <div className="refund-section-unique refund-section-alt-unique">
        <div className="refund-section-header-unique">
          <div className="refund-section-number-unique">02</div>
          <h2>Currency & Payment Mode</h2>
        </div>
        <div className="refund-section-content-unique">
          <ul>
            <li>All prices, payments, cancellations, and refunds are processed exclusively in Indian Rupees (INR).</li>
            <li>Foreign currency payments are not accepted at present.</li>
            <li>Payments and refunds are processed through authorized Indian payment gateways (currently PayU or its successors).</li>
          </ul>
        </div>
      </div>

      {/* Section 3 - Cancellation Policies */}
      <div className="refund-section-unique">
        <div className="refund-section-header-unique">
          <div className="refund-section-number-unique">03</div>
          <h2>Guest-Initiated Cancellations (Time-Based Refund Structure)</h2>
        </div>
        <div className="refund-section-content-unique">
          <p>If a guest cancels a confirmed booking, refunds shall be processed according to the time remaining before the scheduled check-in date and time, as outlined below:</p>
          
          <h3 className="refund-subsection-title-unique">Short-term stays</h3>
          
          <div className="refund-cards-grid-unique">
            <div className="refund-policy-card-unique">
              <div className="refund-card-badge-unique refund-badge-flexible-unique">Flexible</div>
              <ul>
                <li>Full refund at least 1 day before check-in</li>
                <li>Partial refund within 1 day of check-in</li>
              </ul>
            </div>
            
            <div className="refund-policy-card-unique">
              <div className="refund-card-badge-unique refund-badge-moderate-unique">Moderate</div>
              <ul>
                <li>Full refund at least 5 days before check-in</li>
                <li>Partial refund within 5 days of check-in</li>
              </ul>
            </div>

            <div className="refund-policy-card-unique">
              <div className="refund-card-badge-unique refund-badge-standard-unique">Standard</div>
              <ul>
                <li>Full refund at least 14 days before check-in</li>
                <li>Partial refund 7–14 days before check-in</li>
              </ul>
            </div>

            <div className="refund-policy-card-unique">
              <div className="refund-card-badge-unique refund-badge-strict-unique">Not Flexible</div>
              <ul>
                <li>Full refund at least 30 days before check-in</li>
                <li>Partial refund 7–30 days before check-in</li>
              </ul>
            </div>
          </div>
          
          <div className="refund-notes-box-unique">
            <strong>Notes:</strong><br />
            • The countdown is calculated from the official check-in date and time mentioned in the booking confirmation.<br />
            • "Booking amount" refers to the base rental amount excluding non-refundable charges, if any.
          </div>
        </div>
      </div>

      {/* Section 4 */}
      <div className="refund-section-unique refund-section-alt-unique">
        <div className="refund-section-header-unique">
          <div className="refund-section-number-unique">04</div>
          <h2>Non-Refundable Charges</h2>
        </div>
        <div className="refund-section-content-unique">
          <p>Unless explicitly stated otherwise at the time of booking or required by law, the following may be non-refundable:</p>
          <ul>
            <li>Payment gateway or transaction fees</li>
            <li>Platform service or convenience fees</li>
            <li>Taxes already remitted to authorities</li>
          </ul>
        </div>
      </div>

      {/* Section 5 */}
      <div className="refund-section-unique">
        <div className="refund-section-header-unique">
          <div className="refund-section-number-unique">05</div>
          <h2>Host-Specific or Property-Specific Policies</h2>
        </div>
        <div className="refund-section-content-unique">
          <ul>
            <li>Certain listings may display custom cancellation terms defined by the host.</li>
            <li>Where such terms are clearly disclosed before booking, those terms shall apply only if they are not less favorable than this Policy, unless legally permitted.</li>
          </ul>
        </div>
      </div>

      {/* Section 6 */}
      <div className="refund-section-unique refund-section-alt-unique">
        <div className="refund-section-header-unique">
          <div className="refund-section-number-unique">06</div>
          <h2>Host-Initiated Cancellations</h2>
        </div>
        <div className="refund-section-content-unique">
          <p>If a host cancels a confirmed booking:</p>
          <ul>
            <li>The guest shall receive a 100% refund, including applicable service charges</li>
            <li>Ovikaliving may, at its discretion, assist the guest in finding alternative accommodation</li>
            <li>Repeated host cancellations may result in:</li>
            <ul>
              <li>Reduced listing visibility</li>
              <li>Temporary suspension</li>
              <li>Permanent removal from the Platform</li>
            </ul>
          </ul>
        </div>
      </div>

      {/* Section 7 */}
      <div className="refund-section-unique">
        <div className="refund-section-header-unique">
          <div className="refund-section-number-unique">07</div>
          <h2>No-Shows & Early Check-Outs</h2>
        </div>
        <div className="refund-section-content-unique">
          <h3 className="refund-subsection-title-unique">• No-Show:</h3>
          <p>If a guest fails to check in without prior cancellation, no refund shall be issued.</p>
          
          <h3 className="refund-subsection-title-unique">• Early Check-Out:</h3>
          <p>
            Leaving the property before the scheduled check-out date does not entitle the guest to a
            refund, unless:
          </p>
          <ul>
            <li>Explicitly permitted by the host, or</li>
            <li>Approved by Ovikaliving under exceptional circumstances</li>
          </ul>
        </div>
      </div>

      {/* Section 8 */}
      <div className="refund-section-unique refund-section-alt-unique">
        <div className="refund-section-header-unique">
          <div className="refund-section-number-unique">08</div>
          <h2>Exceptional Circumstances</h2>
        </div>
        <div className="refund-section-content-unique">
          <p>
            Refunds or partial refunds may be considered on a case-by-case basis in situations including but not
            limited to:
          </p>
          <ul>
            <li>Government-imposed travel bans or lockdowns</li>
            <li>Natural disasters or severe weather events</li>
            <li>Legal or safety-related restrictions</li>
            <li>Situations where the property becomes uninhabitable</li>
          </ul>
          <p>Supporting documents may be required. Approval under this clause remains at the sole discretion of Ovikaliving, subject to applicable law.</p>
        </div>
      </div>

      {/* Section 9 */}
      <div className="refund-section-unique">
        <div className="refund-section-header-unique">
          <div className="refund-section-number-unique">09</div>
          <h2>Refund Processing Timeline</h2>
        </div>
        <div className="refund-section-content-unique">
          <ul>
            <li>Approved refunds are processed through the original payment method.</li>
            <li>Typical processing time: 5–10 business days</li>
            <li>Delays caused by banks, payment gateways, or third-party systems are beyond Ovikaliving's control.</li>
          </ul>
        </div>
      </div>

      {/* Section 10 */}
      <div className="refund-section-unique refund-section-alt-unique">
        <div className="refund-section-header-unique">
          <div className="refund-section-number-unique">10</div>
          <h2>Misuse, Fraud & Policy Violations</h2>
        </div>
        <div className="refund-section-content-unique">
          <p>No refund shall be issued where:</p>
          <ul>
            <li>The booking involves fraudulent activity</li>
            <li>Platform policies or house rules are violated</li>
            <li>There is intentional damage to property</li>
            <li>The account is suspended or terminated due to misuse</li>
          </ul>
          <p>Ovikaliving reserves the right to deduct charges or deny refunds in such cases.</p>
        </div>
      </div>

      {/* Section 11 */}
      <div className="refund-section-unique">
        <div className="refund-section-header-unique">
          <div className="refund-section-number-unique">11</div>
          <h2>Legal & Regulatory Compliance</h2>
        </div>
        <div className="refund-section-content-unique">
          <p>This Policy is governed by the laws of India and is aligned with:</p>
          <ul>
            <li>The Information Technology Act, 2000</li>
            <li>Applicable consumer protection laws</li>
            <li>Contractual principles under Indian law</li>
          </ul>
          <p>Courts within Noida Gautam Budhnagar shall have exclusive jurisdiction.</p>
        </div>
      </div>

      {/* Section 12 */}
      <div className="refund-section-unique refund-section-alt-unique">
        <div className="refund-section-header-unique">
          <div className="refund-section-number-unique">12</div>
          <h2>Amendments to This Policy</h2>
        </div>
        <div className="refund-section-content-unique">
          <p>Ovikaliving reserves the right to modify or update this Policy at any time. Changes will be effective upon publication on the Platform. Continued use of the Platform after such changes constitutes acceptance of the revised Policy.</p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="refund-contact-section-unique">
        <div className="refund-section-header-unique">
          <div className="refund-section-number-unique">13</div>
          <h2>Contact & Support</h2>
        </div>
        <p>For cancellation or refund-related queries, please contact:</p>
        <div className="refund-contact-buttons-unique">
          <a href="mailto:enquiry@ovikaliving.com" className="refund-contact-btn-unique">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            enquiry@ovikaliving.com
          </a>
          <span className="refund-or-divider-unique">or</span>
          <a href="mailto:support@townmanor.ai" className="refund-contact-btn-unique">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            support@townmanor.ai
          </a>
        </div>
      </div>

      {/* Back to Home */}
      <div className="refund-back-home-unique">
        <Link to="/" className="refund-home-btn-unique">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default RefundAndCancellation;