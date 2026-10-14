import React from 'react';

const css = `
.roisc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.roisc-inner { max-width: 1100px; margin: 0 auto; }
.roisc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.roisc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.roisc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
@media (max-width: 640px) { .roisc-section { padding: 28px 16px 36px; } .roisc-inner h2 { font-size: 1.1rem; } }
`;

const ROISeoContent = () => (
  <section className="roisc-section">
    <style>{css}</style>
    <div className="roisc-inner">
      <h2>How Rental Income Actually Works for Noida & Greater Noida Property Owners</h2>
      <p>
        Most landlords in Noida and Greater Noida underestimate what a vacant flat can earn once it's
        furnished and listed correctly. The gap between a bare, unlisted apartment and a well-presented PG,
        co-living room or nightly-stay unit often comes down to three levers: how the property is categorized
        (monthly PG vs. nightly stay), how complete the listing is (photos, amenities, verified badge), and
        how consistently it's priced against nearby comparable listings.
      </p>

      <h3>Monthly PG Income vs. Nightly Stay Income</h3>
      <p>
        A monthly PG model gives you predictable, lower-touch income — you set a per-bed or per-room rate and
        it's collected monthly, with less week-to-week management. A nightly-stay model (like OvikaLiving's
        Signature Stays) can earn significantly more per night but needs active occupancy management, since
        income depends on how many nights in the month the unit is actually booked — which is exactly what
        the ROI calculator above estimates using your inputs.
      </p>

      <h3>What Pushes Occupancy and Rate Higher</h3>
      <p>
        Properties near the Sector 62–63 IT corridor, metro-adjacent sectors, and Greater Noida's Knowledge
        Park area typically see higher demand due to the working-professional and student population nearby.
        Beyond location, a verified badge, complete amenity list and professional photos consistently
        correlate with faster bookings and fewer vacant days — all of which this calculator doesn't capture
        directly, but which directly affect whether you hit the occupancy percentage you plug in.
      </p>

      <h3>Using the Calculator to Set a Realistic Rate</h3>
      <p>
        Rather than guessing at a nightly or monthly rate, enter your property's size, furnishing level and
        target category, then compare the estimate against similar listings already live on OvikaLiving in
        your sector. If your estimated figure is noticeably above what comparable properties are charging,
        it's usually a sign to either adjust the rate or invest in the amenities that justify a premium,
        rather than leaving the unit vacant while waiting for a tenant at an above-market price.
      </p>
    </div>
  </section>
);

export default ROISeoContent;
