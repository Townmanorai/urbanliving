import React from 'react';

const css = `
.absc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.absc-inner { max-width: 1100px; margin: 0 auto; }
.absc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.absc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.absc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
@media (max-width: 640px) { .absc-section { padding: 28px 16px 36px; } .absc-inner h2 { font-size: 1.1rem; } }
`;

const AboutSeoContent = () => (
  <section className="absc-section">
    <style>{css}</style>
    <div className="absc-inner">
      <h2>OvikaLiving — Built for Noida & Greater Noida's Rental Market</h2>
      <p>
        OvikaLiving is the rental and short-stay platform of Townmanor Technologies Private Limited, built
        specifically around how people actually search for a place to live in Delhi NCR — by locality,
        sharing type, budget and move-in timeline, not just a generic city-wide search. We started by solving
        for the PG and co-living segment in Noida and Greater Noida, and have since expanded to furnished
        apartments, hotels, homestays and Signature nightly stays across the same region.
      </p>

      <h3>What We Actually Do Differently</h3>
      <p>
        Two things define how OvikaLiving operates: we don't charge tenants brokerage on any booking, and
        every listing goes through a review step before it's published, with many carrying an Ovika Verified
        or Self Verified badge once confirmed. That combination — zero brokerage plus a verification layer —
        is what we're building the brand around, rather than just being another classifieds-style listing
        aggregator.
      </p>

      <h3>Where We're Headed</h3>
      <p>
        As the platform grows, the focus stays the same — more verified inventory in the localities people
        actually search for, a cleaner booking experience across every category, and tools that make it easier
        for owners to manage pricing and occupancy without needing a broker or a property manager in between.
      </p>

      <h3>Who Uses OvikaLiving</h3>
      <p>
        Working professionals relocating for a new job, students near Knowledge Park and the Noida tech
        corridor, families visiting for a few days, and property owners who want to list without paying a
        broker's commission each time a tenant changes — these are the core users on both sides of the
        platform, concentrated in Noida, Greater Noida, Gurugram, Delhi and Ghaziabad.
      </p>
    </div>
  </section>
);

export default AboutSeoContent;
