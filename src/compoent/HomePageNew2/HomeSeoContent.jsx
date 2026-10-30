import React from 'react';
import SeoReadMore from '../SEO/SeoReadMore';

const css = `
.hsc-section { background: #fdf9f3; border-top: 1px solid #f0e8da; padding: 48px 24px 56px; font-family: 'Poppins', sans-serif; }
.hsc-inner { max-width: 1100px; margin: 0 auto; }
.hsc-inner h2 { font-size: 1.4rem; font-weight: 800; color: #1a1209; margin: 0 0 12px; }
.hsc-inner h3 { font-size: 1.05rem; font-weight: 700; color: #1a1209; margin: 26px 0 8px; }
.hsc-inner p { font-size: 0.87rem; line-height: 1.8; color: #4a3828; margin: 0 0 12px; }
.hsc-inner ul { margin: 0 0 14px; padding-left: 20px; }
.hsc-inner li { font-size: 0.87rem; line-height: 1.75; color: #4a3828; margin-bottom: 6px; }
.hsc-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
.hsc-tag { font-size: 0.74rem; font-weight: 600; color: #8a5a1f; background: #fdf2e4; border: 1px solid #f0dfc4; border-radius: 20px; padding: 5px 12px; }
@media (max-width: 640px) { .hsc-section { padding: 32px 16px 40px; } .hsc-inner h2 { font-size: 1.15rem; } }
`;

const TAGS = [
  'PG in Noida', 'co-living Greater Noida', 'furnished apartment Gurugram', 'nightly stays Delhi NCR',
  'no brokerage flat Noida', 'verified PG Noida', 'Signature Stays Noida', 'girls PG Noida sector 62',
  'boys PG Noida sector 63', 'monthly rental Noida', 'short term stay Noida', 'OvikaLiving Noida',
];

const HomeSeoContent = () => (
  <section className="hsc-section">
    <style>{css}</style>
    <div className="hsc-inner">
      <h2>OvikaLiving — PG, Co-Living, Furnished Apartments & Nightly Stays in Noida, Greater Noida, Gurugram & Delhi NCR</h2>
      <p>
        OvikaLiving is a single platform for everything to do with renting or staying short-term across Noida,
        Greater Noida, Gurugram and Delhi — PG accommodation, co-living spaces, furnished apartments, hotel-style
        nightly stays and the premium Signature Stays tier. Instead of going through a broker, calling five
        different numbers and visiting properties that don't match what was described, every listing on
        OvikaLiving is posted directly by the property owner, carries real photos, and shows the actual rent,
        deposit and included amenities upfront. The platform was built by Townmanor Technologies specifically
        around how people in Delhi NCR actually search for a place — by sector, by sharing type, by budget and
        by move-in date — rather than a generic citywide listing feed that makes you scroll through hundreds of
        irrelevant results.
      </p>

      <SeoReadMore>
        <h3>Why OvikaLiving Exists</h3>
        <p>
          The rental market in Noida and Greater Noida has historically run on broker networks — a tenant pays
          a month's rent as brokerage just to get a shortlist of options, many of which turn out to be outdated
          or already taken. OvikaLiving removes that layer entirely. Property owners list directly, at zero
          commission, and tenants browse, compare and book without paying anyone a finder's fee. That one
          structural change is what the platform is built around, and it's why search terms like "no brokerage
          PG Noida" and "verified PG near me" keep showing up in how people describe what they're looking for.
        </p>

        <h3>PG and Co-Living — the Core of the Platform</h3>
        <p>
          Most of what moves on OvikaLiving is PG and co-living demand concentrated in a handful of corridors:
          Noida Sector 62–63 (closest to the IT/ITES office belt), Sector 15, 18, 19 and 22 (closer to the
          metro and markets), and Greater Noida's Knowledge Park and Pari Chowk stretch (student and
          early-career professional heavy). Each PG listing shows sharing type — single, double or triple —
          gender preference where applicable, and whether food, Wi-Fi, housekeeping and power backup are
          included in the quoted rent, so the number you see on the card is close to what you'll actually pay
          each month rather than a lowball figure that grows once you call.
        </p>

        <h3>Furnished Apartments for Longer Stays</h3>
        <p>
          For tenants who want a full flat rather than a shared PG room — a couple relocating for work, a
          family moving cities, or a small group of colleagues sharing rent — OvikaLiving's furnished apartment
          category covers 1BHK to 3BHK options across Noida, Greater Noida and Gurugram, move-in ready with
          furniture, kitchen appliances and, in many cases, housekeeping included in the package. Lease terms,
          security deposit and notice period are listed on the property page itself, not buried in a phone call
          after you've already shown interest.
        </p>

        <h3>Nightly Stays and Signature Stays</h3>
        <p>
          Not every booking on OvikaLiving is a long-term move. The Nightly Stays category covers hotel-style,
          short-duration bookings — a few nights for a work trip, a family visiting for a wedding, or someone
          apartment-hunting before committing to a monthly lease — with flexible check-in and check-out and
          transparent per-night pricing. At the top end, Signature Stays is OvikaLiving's curated, higher-spec
          tier: fully managed properties with hotel-grade housekeeping, premium interiors and a more hands-on
          booking experience, aimed at guests who want a nightly stay without compromising on finish or service.
        </p>

        <h3>Verification — Why It Matters More Than the Photos</h3>
        <p>
          Every listing goes through a review step before it goes live on OvikaLiving, and many carry either an
          "Ovika Verified" badge — meaning the Townmanor team has physically confirmed the property matches its
          listing — or a "Self Verified" badge, where the owner has completed an identity and ownership check
          through the platform. For a tenant, that badge is a faster trust signal than photos alone, because
          photos can be old or borrowed, but a verification badge means someone has actually checked the
          property exists and is what it claims to be.
        </p>

        <h3>How to Search Efficiently on OvikaLiving</h3>
        <ul>
          <li>Filter by category first — PG, Co-Living, Apartments, Hotels, Nightly Stays or Signature Stays — before narrowing by locality.</li>
          <li>Set a price range early; Noida and Greater Noida PG rents vary heavily by sector, so a fixed budget filter saves the most time.</li>
          <li>Check the sharing type and gender preference on the card itself rather than opening every listing individually.</li>
          <li>Prioritise listings with an Ovika Verified or Self Verified badge when comparing similar options at a similar price.</li>
          <li>Read the amenities line closely — food, Wi-Fi, AC and housekeeping inclusion changes the real monthly cost significantly.</li>
        </ul>

        <h3>For Property Owners</h3>
        <p>
          On the supply side, OvikaLiving gives property owners a free way to list PG rooms, apartments or
          entire properties without paying a broker's commission every time a tenant turns over. Owners can
          manage pricing, availability and booking requests directly through the platform, and the verification
          process — while it adds a short review step before going live — is also what keeps the listing
          credible to prospective tenants browsing a category with hundreds of competing options.
        </p>

        <h3>Where OvikaLiving Operates</h3>
        <p>
          The platform's primary coverage is Noida, Greater Noida, Gurugram, Delhi and parts of Ghaziabad —
          concentrated specifically in the pockets with the highest working-professional and student rental
          demand: the Noida Sector 62 IT corridor, Greater Noida's Knowledge Park, Gurugram's Cyber City and
          Golf Course Road belt, and central Delhi. Coverage keeps expanding as more verified owners list on the
          platform, but the focus stays deliberately regional rather than spreading thin across every city in
          India.
        </p>
      </SeoReadMore>

      <div className="hsc-tags">
        {TAGS.map(tag => <span className="hsc-tag" key={tag}>{tag}</span>)}
      </div>
    </div>
  </section>
);

export default HomeSeoContent;
