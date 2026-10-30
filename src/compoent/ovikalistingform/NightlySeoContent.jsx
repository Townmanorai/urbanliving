import React from 'react';
import SeoReadMore from '../SEO/SeoReadMore';

const css = `
.nsc-section { background: #fdf9f3; border-top: 1px solid #f0e8da; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.nsc-inner { max-width: 1100px; margin: 0 auto; }
.nsc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.nsc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.nsc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
.nsc-inner ul { margin: 0 0 12px; padding-left: 20px; }
.nsc-inner li { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin-bottom: 6px; }
.nsc-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.nsc-tag { font-size: 0.74rem; font-weight: 600; color: #8a5a1f; background: #fdf2e4; border: 1px solid #f0dfc4; border-radius: 20px; padding: 5px 12px; }
@media (max-width: 640px) { .nsc-section { padding: 28px 16px 36px; } .nsc-inner h2 { font-size: 1.1rem; } }
`;

const TAGS = [
  'nightly stay Noida', 'short stay Greater Noida', 'hotel alternative Noida', '1 night stay Noida',
  'weekend stay Gurugram', 'Signature Stays nightly', 'daily rental Noida', 'short term hotel booking Noida',
];

const NightlySeoContent = () => (
  <section className="nsc-section">
    <style>{css}</style>
    <div className="nsc-inner">
      <h2>Nightly Stays in Noida, Greater Noida, Gurugram & Delhi NCR</h2>
      <p>
        Nightly Stays on OvikaLiving is the hotel-style booking category — for guests who need a verified,
        fully furnished place for one night, a weekend, or a few days, with none of the long-term paperwork a
        monthly lease involves. It covers everything from an apartment-hunter staying a few nights while they
        shortlist a PG, to a family in town for a wedding, to a working professional on a short project in
        Noida who doesn't want to book a generic hotel room.
      </p>

      <SeoReadMore>
        <h3>Who Books a Nightly Stay</h3>
        <p>
          The typical nightly-stay guest on OvikaLiving falls into one of a few groups: someone relocating to
          Noida or Greater Noida who needs a base while they search for a longer-term PG or apartment; a family
          or group visiting for a function, admission process or a hospital visit; or a professional on a
          short assignment who'd rather stay in a real furnished apartment than a cramped hotel room at a
          similar price point. Because every listing is owner-managed and verified, guests get an actual
          apartment or managed property rather than a shared, anonymous hotel floor.
        </p>

        <h3>How It's Different from a Monthly Rental</h3>
        <p>
          Monthly Rentals on OvikaLiving involve a lease agreement, a security deposit and a notice period —
          built for tenants staying for weeks or months. Nightly Stays skip all of that: pricing is per night,
          check-in and check-out dates are fixed upfront at the time of booking, and there's no long-term
          commitment. If a short stay turns into a longer need, most property owners are open to switching a
          guest over to a monthly arrangement directly through the platform.
        </p>

        <h3>What's Included</h3>
        <ul>
          <li>Fully furnished room or apartment — bed, Wi-Fi, AC and basic kitchen access in most listings.</li>
          <li>Flexible check-in and check-out times, confirmed directly with the property owner.</li>
          <li>Transparent per-night pricing shown on the listing — no last-minute "cleaning fee" surprises.</li>
          <li>Verification badge (Ovika Verified or Self Verified) on most listings, so the property matches what's shown.</li>
        </ul>

        <h3>Where Nightly Stays Are Concentrated</h3>
        <p>
          Noida Sector 62, 18 and 137, Greater Noida's Knowledge Park and Pari Chowk, Gurugram's Cyber City
          corridor, and central Delhi carry the highest density of nightly-stay listings — largely because
          these are the same pockets with the most PG and co-living supply, so owners with a vacant room or
          unit list it as a short-term stay between longer tenants. At the premium end, OvikaLiving's Signature
          Stays tier covers higher-spec nightly bookings with hotel-grade housekeeping and interiors for guests
          who want a short stay without compromising on finish.
        </p>

        <h3>Booking Tips</h3>
        <p>
          Confirm check-in time directly with the owner before travelling, especially for early-morning or
          late-night arrivals. Check whether food is included or nearby — some nightly-stay listings are in PG
          buildings with a mess facility, others are standalone apartments where you'll need to arrange meals
          separately. And as with any OvikaLiving category, a verification badge is worth prioritising over a
          marginally cheaper, unverified listing when two options look otherwise similar.
        </p>
      </SeoReadMore>

      <div className="nsc-tags">
        {TAGS.map(tag => <span className="nsc-tag" key={tag}>{tag}</span>)}
      </div>
    </div>
  </section>
);

export default NightlySeoContent;
