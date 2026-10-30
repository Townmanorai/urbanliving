import React from 'react';
import SeoReadMore from '../SEO/SeoReadMore';

const css = `
.spsc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.spsc-inner { max-width: 1100px; margin: 0 auto; }
.spsc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.spsc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.spsc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
.spsc-inner ul { margin: 0 0 12px; padding-left: 20px; }
.spsc-inner li { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin-bottom: 6px; }
.spsc-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.spsc-tag { font-size: 0.74rem; font-weight: 600; color: #8a5a1f; background: #fdf2e4; border: 1px solid #f0dfc4; border-radius: 20px; padding: 5px 12px; }
@media (max-width: 640px) { .spsc-section { padding: 28px 16px 36px; } .spsc-inner h2 { font-size: 1.1rem; } }
`;

const TAGS = [
  'OvikaLiving support', 'booking help OvikaLiving', 'refund status OvikaLiving', 'cancellation help Noida PG',
  'verification support OvikaLiving', 'account help OvikaLiving', 'booking issue PG Noida',
];

const SupportSeoContent = () => (
  <section className="spsc-section">
    <style>{css}</style>
    <div className="spsc-inner">
      <h2>OvikaLiving Support — Help With an Existing Booking, Listing or Account</h2>
      <p>
        This page is for guests and owners who already have a booking, a listing, or an account on
        OvikaLiving and need help with something specific to it — a payment that didn't go through, a
        cancellation you're waiting on, a verification document stuck in review, or a question about an
        active stay. If you haven't booked or listed anything yet and just have a general question, the
        Contact Us page is the better place to start.
      </p>

      <SeoReadMore>
        <h3>What Support Handles</h3>
        <ul>
          <li><strong>Booking issues</strong> — confirmation not received, incorrect dates, payment deducted but booking not showing.</li>
          <li><strong>Cancellation & refunds</strong> — checking refund status, understanding why a refund amount differs from what was expected.</li>
          <li><strong>Verification</strong> — status of an Ovika Verified or Self Verified application, documents that were rejected and need resubmission.</li>
          <li><strong>Account issues</strong> — login problems, updating contact details, merging duplicate accounts.</li>
          <li><strong>Active stay concerns</strong> — a property not matching its listing, an owner not responding, safety concerns during a stay.</li>
        </ul>

        <h3>Before You Submit a Query</h3>
        <p>
          Have your booking ID, registered phone number or property listing ID ready — queries with a
          reference number get resolved faster than ones without, since the support team can pull up the exact
          transaction instead of searching by name or date. For cancellation and refund questions specifically,
          check the cancellation policy shown on the property's own booking page first, since refund terms
          vary by listing and by how far in advance you cancelled.
        </p>

        <h3>Typical Response Times</h3>
        <p>
          Payment and booking-confirmation issues are usually the fastest to resolve, often same-day, because
          they involve looking up a specific transaction against the payment gateway record. Refund status
          queries can take slightly longer if the refund is still processing on the bank's side rather than
          stuck on OvikaLiving's end. Verification document issues typically get a response within a business
          day, since a team member needs to review the resubmitted document.
        </p>

        <h3>For Property Owners</h3>
        <p>
          Owners reaching out through Support are usually dealing with one of three things: a verification
          badge application that's been pending longer than expected, a booking or enquiry notification that
          didn't come through, or a question about updating listing details (price, availability, photos)
          after the listing has already gone live. All three are handled directly by the same support team
          that manages guest queries — there's no separate owner-only queue that adds delay.
        </p>

        <h3>Safety & Urgent Concerns</h3>
        <p>
          If something feels unsafe during an active stay — a property significantly different from its
          listing, an unresponsive owner, or a security concern — flag it as urgent when reaching out, since
          these are prioritised ahead of general billing or account queries. OvikaLiving's verification process
          is designed to catch most of these issues before a listing goes live, but a direct report during an
          active stay is still the fastest way to get it looked at.
        </p>

        <h3>If You Can't Find an Answer Here</h3>
        <p>
          The FAQ page covers the most frequently asked questions about how booking, verification, payments
          and cancellations work in general. If your situation is specific to your own booking or account
          rather than a general "how does this work" question, submitting a query through this page directly
          — with your reference details — will get you a faster, more accurate answer than the FAQ can.
        </p>
      </SeoReadMore>

      <div className="spsc-tags">
        {TAGS.map(tag => <span className="spsc-tag" key={tag}>{tag}</span>)}
      </div>
    </div>
  </section>
);

export default SupportSeoContent;
