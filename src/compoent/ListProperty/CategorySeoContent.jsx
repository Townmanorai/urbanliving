import React from 'react';
import SeoReadMore from '../SEO/SeoReadMore';

const css = `
.ccsc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.ccsc-inner { max-width: 1100px; margin: 0 auto; }
.ccsc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.ccsc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.ccsc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
.ccsc-inner ul { margin: 0 0 12px; padding-left: 20px; }
.ccsc-inner li { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin-bottom: 6px; }
.ccsc-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.ccsc-tag { font-size: 0.74rem; font-weight: 600; color: #8a5a1f; background: #fdf2e4; border: 1px solid #f0dfc4; border-radius: 20px; padding: 5px 12px; }
@media (max-width: 640px) { .ccsc-section { padding: 28px 16px 36px; } .ccsc-inner h2 { font-size: 1.1rem; } }
`;

const TAGS = [
  'list property Noida', 'PG category listing', 'co-living owner listing', 'list apartment for rent Noida',
  'list Signature Stay property', 'free property listing India', 'no commission property listing',
  'list PG Greater Noida',
];

const CategorySeoContent = () => (
  <section className="ccsc-section">
    <style>{css}</style>
    <div className="ccsc-inner">
      <h2>Start Your Free Listing on OvikaLiving</h2>
      <p>
        Pick the category that matches how you plan to rent out your property — shared rooms billed monthly
        (PG & Co-Living), a full unit for one tenant (Apartments & Villas), or nightly bookings (Hotels,
        Homestays & BnB, or Signature Stays for premium furnished units). Each option takes you to a guided
        form built for that category, so you're only asked for details that actually apply to your listing.
        There's no cost to list and no commission on what you earn — if you're unsure which category fits,
        the listing guide linked below walks through the difference in more detail.
      </p>

      <SeoReadMore>
        <h3>Why Category Choice Matters More Than It Looks</h3>
        <p>
          The category you pick isn't just a label — it determines who sees your listing, what filters a
          prospective tenant uses to find it, and ultimately what rate and occupancy pattern you can expect.
          A single spare room listed under the wrong category (say, as a full Apartment instead of PG) can sit
          unbooked for weeks simply because the tenants actually searching for a shared room never see it in
          their filtered results. Getting the category right at the start saves time and gets a listing in
          front of the right audience immediately.
        </p>

        <h3>PG & Co-Living — Shared, Monthly, Higher Density</h3>
        <p>
          If your property is a room or set of rooms rented individually — by the bed or by the room, with
          shared common areas like a kitchen or living room — PG or Co-Living is the right fit. This category
          suits owners who want to maximise income per square foot by housing multiple paying tenants rather
          than one family, and is the highest-demand category among working professionals and students in
          Noida and Greater Noida's IT and education corridors. Expect monthly billing, shorter average
          tenant stays than a full apartment, and more frequent (but lower-effort) tenant turnover.
        </p>

        <h3>Apartments & Villas — One Tenant, Full Unit, Monthly</h3>
        <p>
          This category fits a full flat or independent house rented to a single tenant or family on a
          monthly basis, typically with a formal lease, security deposit and notice period. It suits owners
          with a complete, self-contained unit who'd rather deal with one tenant relationship than manage
          multiple PG tenants, and generally commands a higher per-unit monthly rent than a single PG room,
          though lower income per square foot than a densely shared PG setup.
        </p>

        <h3>Hotels, Homestays & BnB — Nightly, Guest-Style</h3>
        <p>
          For owners who want to rent per night rather than per month — a spare flat used occasionally, a
          managed guesthouse, or a property near a business or tourist corridor — this category covers
          hotel-style and homestay-style nightly bookings. It demands more active management (check-in/out
          coordination, housekeeping between guests) but can earn a meaningfully higher per-night rate than
          the equivalent monthly PG rate, provided occupancy stays reasonably high across the month.
        </p>

        <h3>Signature Stays — Premium, Managed, Highest Rate Tier</h3>
        <p>
          Signature Stays is OvikaLiving's curated top tier, for owners with a fully furnished, higher-spec
          unit who are open to a more hands-on, managed listing process with hotel-grade presentation
          standards. It commands the highest per-night or per-month rate of any category, but also comes with
          a stricter review process before going live, since every Signature listing is meant to represent the
          platform's premium end.
        </p>

        <h3>Choosing Between Categories for the Same Property</h3>
        <ul>
          <li>A single room in a shared flat with common areas → PG or Co-Living.</li>
          <li>A complete, self-contained furnished flat for one tenant → Apartments & Villas (monthly) or Nightly Stays (short-term).</li>
          <li>A spare furnished unit you're open to renting occasionally for a few nights at a time → Hotels, Homestays & BnB.</li>
          <li>A premium, fully managed unit where you want hands-off, hotel-standard operations → Signature Stays.</li>
        </ul>

        <h3>You're Not Locked Into One Category</h3>
        <p>
          Owners often list more than one category over time — a PG owner who later buys a second property
          might list it as an Apartment or Villa, while someone with a fully furnished extra unit might test it
          as a nightly Hotel or Homestay listing to see which model earns better in their locality. You can
          manage every listing from the same owner dashboard regardless of category, so switching or adding a
          new listing type later doesn't require a separate account, and comparing actual booking performance
          across categories on the same dashboard is often the fastest way to learn which model works best for
          a specific property and location.
        </p>
      </SeoReadMore>

      <div className="ccsc-tags">
        {TAGS.map(tag => <span className="ccsc-tag" key={tag}>{tag}</span>)}
      </div>
    </div>
  </section>
);

export default CategorySeoContent;
