import React from 'react';

const css = `
.ctsc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.ctsc-inner { max-width: 1100px; margin: 0 auto; }
.ctsc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.ctsc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.ctsc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
@media (max-width: 640px) { .ctsc-section { padding: 28px 16px 36px; } .ctsc-inner h2 { font-size: 1.1rem; } }
`;

const ContactSeoContent = () => (
  <section className="ctsc-section">
    <style>{css}</style>
    <div className="ctsc-inner">
      <h2>Need Help With a Booking, Listing or Account Issue?</h2>
      <p>
        Whether you're a guest with a question about a booking in Noida, Greater Noida, Gurugram or Delhi, or
        a property owner needing help with your listing, OvikaLiving's support team handles enquiries directly
        — there's no ticket queue bouncing you between departments for common issues.
      </p>

      <h3>What We Can Help With</h3>
      <p>
        Booking confirmations and payment issues, cancellation and refund status, listing verification
        questions, updating property details, and general questions about how PG, co-living, nightly-stay or
        Signature Stay bookings work on the platform — these are the most common reasons guests and owners
        reach out, and most are resolved the same day.
      </p>

      <h3>Response Times</h3>
      <p>
        Booking and payment-related queries are generally the fastest to resolve since they involve looking up
        a specific transaction. Listing and verification questions can take a little longer if documents need
        to be reviewed, but owners typically hear back within a business day of submitting a query through
        this page.
      </p>

      <h3>Before You Reach Out</h3>
      <p>
        If your question is about cancellation terms, check the specific policy shown on your property's
        booking page first, since terms vary by listing. For general platform questions, our FAQ page covers
        the most common ones around booking, verification and payments, and might get you an answer faster
        than waiting on a reply.
      </p>
    </div>
  </section>
);

export default ContactSeoContent;
