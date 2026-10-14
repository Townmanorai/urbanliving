import React from 'react';

const css = `
.plp-seo { background: #fdf9f3; border-top: 1px solid #f0e8da; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.plp-seo-inner { max-width: 1100px; margin: 0 auto; }
.plp-seo-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.plp-seo-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.plp-seo-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
.plp-seo-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.plp-seo-tag { font-size: 0.74rem; font-weight: 600; color: #8a5a1f; background: #fdf2e4; border: 1px solid #f0dfc4; border-radius: 20px; padding: 5px 12px; }
@media (max-width: 640px) { .plp-seo { padding: 28px 16px 36px; } .plp-seo-inner h2 { font-size: 1.1rem; } }
`;

const SECTOR_TAGS = [
  'PG in Noida Sector 62', 'PG in Noida Sector 18', 'PG near Noida Sector 15',
  'co-living Greater Noida Knowledge Park', 'PG near Pari Chowk',
  'girls PG near metro Noida', 'boys PG Sector 63 Noida', 'PG with food Noida',
  'single sharing PG Noida', 'furnished flat Gurugram', 'PG for working professionals Noida',
];

const PLPSeoContent = () => (
  <section className="plp-seo">
    <style>{css}</style>
    <div className="plp-seo-inner">
      <h2>PG, Co-Living & Rental Stays Across Noida, Greater Noida, Gurugram & Delhi NCR</h2>
      <p>
        OvikaLiving brings together verified PG accommodation, co-living spaces, furnished apartments, hotels
        and premium Signature Stays on one platform, so you can compare real listings by sector, price and
        amenities instead of chasing brokers. Whether you're searching for a PG in Noida Sector 62, a
        co-living space near Knowledge Park in Greater Noida, or a furnished flat close to your office in
        Gurugram, every listing here is posted directly by the property owner — there's no brokerage added
        to your rent.
      </p>

      <h3>Finding the Right PG or Co-Living Space</h3>
      <p>
        Most PG searches in Delhi NCR come down to three things: location, sharing type and what's included.
        Noida's Sector 62–63 belt, Sector 15, 18, 19, 22 and 27 remain some of the most active PG clusters
        thanks to their proximity to IT parks and metro connectivity, while Greater Noida's Knowledge Park and
        Pari Chowk area are popular with students and young professionals working nearby. On OvikaLiving you
        can filter by single, double or triple sharing, by gender preference (girls-only, boys-only or
        co-ed), and by whether food, Wi-Fi, AC and housekeeping are included — so the price you see is close
        to what you'll actually pay each month.
      </p>

      <h3>Nightly Stays vs. Monthly Rentals</h3>
      <p>
        If you need a place for a few nights — a work trip, a family visit, or you're apartment-hunting in a
        new city — the Nightly Stays category gives you hotel-style booking with flexible check-in and
        check-out. If you're relocating for a longer stint, Monthly Rentals covers PG rooms, co-living beds
        and full furnished apartments with lease terms built for tenants staying a month or more, with
        transparent security-deposit and notice-period terms shown upfront on every listing.
      </p>

      <h3>Why Owners and Tenants Both List on OvikaLiving</h3>
      <p>
        Property owners get a free, no-commission way to reach verified tenants, while guests get listings
        that have been through our review process before going live — many carry an "Ovika Verified" or
        "Self Verified" badge visible on the property page. That two-sided trust is what keeps search intent
        high for terms like "verified PG Noida" and "no brokerage flat for rent Noida" — and it's exactly
        what OvikaLiving is built around.
      </p>

      <h3>Picking the Right Sharing Type for Your Budget</h3>
      <p>
        Single-occupancy rooms cost the most per person but give you full privacy; double and triple sharing
        bring the monthly rent down significantly while keeping the same amenities. Most PG listings on
        OvikaLiving let you compare sharing options for the same property side by side, so you can weigh the
        privacy-vs-budget trade-off before you commit rather than discovering room configuration only after
        contacting the owner.
      </p>

      <h3>Using Filters to Narrow Down Fast</h3>
      <p>
        With hundreds of listings across Noida, Greater Noida, Gurugram and Delhi, filtering by category, price
        range, number of rooms and amenities upfront saves significant time compared to scrolling through
        every result. Combining a locality search with a price filter is usually the fastest way to land on a
        shortlist worth actually contacting owners about.
      </p>

      <h3>What to Check Before You Book</h3>
      <p>
        Beyond rent and location, look at what's actually included — food, Wi-Fi, housekeeping, laundry and
        parking can meaningfully change the real cost of a stay even when the base rent looks similar across
        listings. Verification status (Ovika Verified or Self Verified), the security deposit amount, and the
        notice period for moving out are the three details worth confirming on the listing page before you
        reach out to a property owner.
      </p>

      <div className="plp-seo-tags">
        {SECTOR_TAGS.map(tag => <span className="plp-seo-tag" key={tag}>{tag}</span>)}
      </div>
    </div>
  </section>
);

export default PLPSeoContent;
