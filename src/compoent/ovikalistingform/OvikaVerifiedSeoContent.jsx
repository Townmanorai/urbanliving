import React from 'react';

const css = `
.ovsc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.ovsc-inner { max-width: 1100px; margin: 0 auto; }
.ovsc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.ovsc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.ovsc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
@media (max-width: 640px) { .ovsc-section { padding: 28px 16px 36px; } .ovsc-inner h2 { font-size: 1.1rem; } }
`;

const OvikaVerifiedSeoContent = () => (
  <section className="ovsc-section">
    <style>{css}</style>
    <div className="ovsc-inner">
      <h2>Why the Ovika Verified Badge Matters When Booking a PG or Rental</h2>
      <p>
        One of the biggest frustrations with renting in Noida or Greater Noida is the gap between listing
        photos and what's actually at the property. The Ovika Verified badge exists specifically to close
        that gap — it's only awarded to listings where OvikaLiving has reviewed the owner's details, checked
        the listed amenities against the property, and confirmed the information shown to guests is accurate.
      </p>

      <h3>What Gets Checked</h3>
      <p>
        Verification covers the property owner's identity, ownership or authorization documents, and a
        cross-check of the listing itself — photos, amenities, pricing and address — against what's actually
        available on-site. Properties that pass carry the Ovika Verified badge visibly on their listing and
        detail page, so you can filter for it before you even start messaging owners.
      </p>

      <h3>How Guests Should Use the Badge</h3>
      <p>
        Treat the Ovika Verified badge as a strong trust signal, not a guarantee against every possible issue —
        it's still worth reading the listing carefully and messaging the owner with any specific questions
        before booking, especially for monthly stays where you'll be living in the property for an extended
        period.
      </p>

      <h3>Verified vs. Self-Verified Listings</h3>
      <p>
        OvikaLiving uses two trust signals: "Ovika Verified" (reviewed and confirmed by our team) and "Self
        Verified" (the owner has submitted and attested to their documents, pending full review). Both are
        shown clearly on the property card and detail page, so you always know which stage of verification a
        listing is at before you book — no guesswork, no surprises at check-in.
      </p>
    </div>
  </section>
);

export default OvikaVerifiedSeoContent;
