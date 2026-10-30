import React from 'react';
import SeoReadMore from '../SEO/SeoReadMore';

const css = `
.absc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.absc-inner { max-width: 1100px; margin: 0 auto; }
.absc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.absc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.absc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
.absc-inner ul { margin: 0 0 12px; padding-left: 20px; }
.absc-inner li { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin-bottom: 6px; }
.absc-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.absc-tag { font-size: 0.74rem; font-weight: 600; color: #8a5a1f; background: #fdf2e4; border: 1px solid #f0dfc4; border-radius: 20px; padding: 5px 12px; }
@media (max-width: 640px) { .absc-section { padding: 28px 16px 36px; } .absc-inner h2 { font-size: 1.1rem; } }
`;

const TAGS = [
  'about OvikaLiving', 'Townmanor Technologies', 'no brokerage rental platform Noida', 'verified PG company Noida',
  'OvikaLiving Greater Noida', 'OvikaLiving Gurugram', 'rental startup Noida', 'Ovika Verified badge',
];

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

      <SeoReadMore>
        <h3>The Problem We Started With</h3>
        <p>
          Renting a room or a flat in Noida or Greater Noida traditionally meant going through a broker — paying
          close to a month's rent in brokerage, visiting properties that didn't match the photos shown, and
          getting little clarity on deposit or notice-period terms until well into the process. On the owner
          side, the same broker network meant paying a commission every time a tenant moved out, with no direct
          relationship to the next one. OvikaLiving was built to remove the broker from both sides of that
          transaction entirely.
        </p>

        <h3>What We Actually Do Differently</h3>
        <p>
          Two things define how OvikaLiving operates: we don't charge tenants brokerage on any booking, and
          every listing goes through a review step before it's published, with many carrying an Ovika Verified
          or Self Verified badge once confirmed. That combination — zero brokerage plus a verification layer —
          is what we're building the brand around, rather than just being another classifieds-style listing
          aggregator where anyone can post anything with no accountability for accuracy.
        </p>

        <h3>Townmanor Technologies — the Company Behind OvikaLiving</h3>
        <p>
          OvikaLiving is operated by Townmanor Technologies Private Limited, which owns and runs the platform,
          the verification process, and the owner and tenant support functions. The company's focus has stayed
          narrow and regional by design — rather than trying to cover every city in India from day one, the
          product and verification process have been built around the specific rental patterns of Noida,
          Greater Noida, Gurugram, Delhi and Ghaziabad.
        </p>

        <h3>How the Platform Is Structured</h3>
        <ul>
          <li><strong>PG & Co-Living</strong> — shared accommodation with flexible sharing types, aimed at students and working professionals.</li>
          <li><strong>Apartments & Villas</strong> — full furnished flats for monthly or longer-term rental.</li>
          <li><strong>Hotels & Nightly Stays</strong> — short, hotel-style bookings for a few nights at a time.</li>
          <li><strong>Signature Stays</strong> — OvikaLiving's curated, premium managed-property tier.</li>
        </ul>
        <p>
          Every category runs on the same underlying principle — direct, owner-posted listings, transparent
          pricing shown upfront, and a verification layer that separates OvikaLiving from a plain classifieds
          board.
        </p>

        <h3>Where We're Headed</h3>
        <p>
          As the platform grows, the focus stays the same — more verified inventory in the localities people
          actually search for, a cleaner booking experience across every category, and tools that make it
          easier for owners to manage pricing and occupancy without needing a broker or a property manager in
          between. Expansion into new localities happens only once there's enough verified supply to make the
          search experience genuinely useful there, rather than spreading thin across markets with too little
          real inventory.
        </p>

        <h3>Who Uses OvikaLiving</h3>
        <p>
          Working professionals relocating for a new job — particularly into the Noida Sector 62–63 IT
          corridor and Gurugram's Cyber City belt — students near Knowledge Park and the Greater Noida tech
          corridor, families visiting for a few days, and property owners who want to list without paying a
          broker's commission each time a tenant changes. These are the core users on both sides of the
          platform, concentrated in Noida, Greater Noida, Gurugram, Delhi and Ghaziabad, with the heaviest
          activity around sectors with high IT-park and university density.
        </p>

        <h3>Our Approach to Trust and Verification</h3>
        <p>
          A listing photo alone doesn't tell a tenant whether a property actually exists in the condition
          shown. That's why OvikaLiving built a two-tier verification system — Ovika Verified, where the team
          physically confirms a property against its listing, and Self Verified, where an owner completes an
          identity and ownership check through the platform. Neither is mandatory to list, but both exist
          because trust, not just inventory volume, is what determines whether a rental platform is actually
          useful to the people searching on it.
        </p>
      </SeoReadMore>

      <div className="absc-tags">
        {TAGS.map(tag => <span className="absc-tag" key={tag}>{tag}</span>)}
      </div>
    </div>
  </section>
);

export default AboutSeoContent;
