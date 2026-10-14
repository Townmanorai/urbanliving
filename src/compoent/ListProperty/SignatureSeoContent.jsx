import React from 'react';

const css = `
.sgsc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.sgsc-inner { max-width: 1100px; margin: 0 auto; }
.sgsc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.sgsc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.sgsc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
@media (max-width: 640px) { .sgsc-section { padding: 28px 16px 36px; } .sgsc-inner h2 { font-size: 1.1rem; } }
`;

const SignatureSeoContent = () => (
  <section className="sgsc-section">
    <style>{css}</style>
    <div className="sgsc-inner">
      <h2>Listing Your Property as an OvikaLiving Signature Stay</h2>
      <p>
        Signature Stays are OvikaLiving's managed, premium nightly-rental tier — meant for property owners
        whose unit is already fully furnished to a high standard and who want it actively managed and
        marketed as a short-stay rental rather than handled as a regular monthly listing.
      </p>

      <h3>What's Different About the Signature Track</h3>
      <p>
        Unlike a standard listing where the owner handles guest communication and check-in themselves,
        Signature properties go through a more hands-on onboarding — our team reviews the property in detail,
        helps set a nightly rate based on comparable Signature listings nearby, and positions the unit for
        guests specifically browsing the premium category rather than general PG or apartment search traffic.
      </p>

      <h3>What Happens After You Apply</h3>
      <p>
        Once you submit the contact form, our team reviews your property details and reaches out within 24
        hours to discuss onboarding — including a property walkthrough, suggested nightly pricing based on
        comparable Signature listings, and what, if anything, needs upgrading to meet the Signature standard
        before the listing goes live.
      </p>

      <h3>Earnings Compared to a Standard Listing</h3>
      <p>
        Because Signature properties are actively marketed and priced on a per-night basis rather than a flat
        monthly rent, owners generally see higher gross earnings per unit compared to listing the same
        property as a standard monthly apartment — though this comes with the trade-off of variable occupancy
        rather than a fixed, predictable monthly payment.
      </p>

      <h3>Who Should Apply</h3>
      <p>
        Owners with a fully furnished 1BHK, 2BHK or studio in a well-connected part of Noida or Greater
        Noida — ideally with amenities like AC, high-speed Wi-Fi and a stocked kitchen already in place — are
        the best fit. If your property isn't fully furnished yet, the regular Apartments & Villas or Hotel
        listing categories are a better starting point until it's ready for the Signature tier.
      </p>
    </div>
  </section>
);

export default SignatureSeoContent;
