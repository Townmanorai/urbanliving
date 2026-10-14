import React from 'react';

const css = `
.svsc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.svsc-inner { max-width: 1100px; margin: 0 auto; }
.svsc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.svsc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.svsc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
@media (max-width: 640px) { .svsc-section { padding: 28px 16px 36px; } .svsc-inner h2 { font-size: 1.1rem; } }
`;

const SelfVerifiedSeoContent = () => (
  <section className="svsc-section">
    <style>{css}</style>
    <div className="svsc-inner">
      <h2>Self Verification — A Faster Path to a Trusted Listing</h2>
      <p>
        Self Verification lets property owners submit their identity and ownership documents directly through
        the platform and get a provisional trust badge on their listing while OvikaLiving's team completes
        full verification. It's designed for owners who want their listing to carry a trust signal from day
        one, rather than waiting for the complete review cycle before it shows any verification status at all.
      </p>

      <h3>Self Verified vs. Ovika Verified</h3>
      <p>
        A Self Verified badge means the owner has submitted and attested to their documents through our
        portal. An Ovika Verified badge means our team has independently reviewed and confirmed those details
        against the listing. Guests can see which badge (if any) a property carries directly on its listing
        page, so the distinction is always transparent — not hidden in fine print.
      </p>

      <h3>Does It Expire?</h3>
      <p>
        Once a property passes full Ovika Verified review, the badge stays on the listing as long as the
        property details remain accurate. If you significantly change the property — a different address,
        ownership transfer, or major renovation — it's worth re-submitting for verification so the badge
        continues to reflect the property's current state.
      </p>

      <h3>How to Apply</h3>
      <p>
        Owners can start the self-verification process from their dashboard by submitting the required
        identity and property documents. Once submitted, the Self Verified badge typically appears on the
        listing shortly after, with full Ovika Verified status following once our team's review is complete.
      </p>
    </div>
  </section>
);

export default SelfVerifiedSeoContent;
