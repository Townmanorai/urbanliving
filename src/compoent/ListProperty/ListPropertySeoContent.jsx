import React from 'react';
import SeoReadMore from '../SEO/SeoReadMore';

const css = `
.lpsc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.lpsc-inner { max-width: 1100px; margin: 0 auto; }
.lpsc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.lpsc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.lpsc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
.lpsc-inner ul { margin: 0 0 12px; padding-left: 20px; }
.lpsc-inner li { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin-bottom: 6px; }
.lpsc-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.lpsc-tag { font-size: 0.74rem; font-weight: 600; color: #8a5a1f; background: #fdf2e4; border: 1px solid #f0dfc4; border-radius: 20px; padding: 5px 12px; }
@media (max-width: 640px) { .lpsc-section { padding: 28px 16px 36px; } .lpsc-inner h2 { font-size: 1.1rem; } }
`;

const TAGS = [
  'list PG Noida', 'list property no brokerage', 'rent out flat Noida', 'owner listing Greater Noida',
  'Ovika Verified owner', 'list apartment Gurugram', 'zero commission rental listing', 'earn from vacant property Noida',
];

const ListPropertySeoContent = () => (
  <section className="lpsc-section">
    <style>{css}</style>
    <div className="lpsc-inner">
      <h2>List Your Property in Noida or Greater Noida — Without Paying a Broker</h2>
      <p>
        Most property owners lose a chunk of their first month's rent to a broker, and then repeat that cost
        every time a tenant turns over. Listing directly on OvikaLiving removes that cost entirely — there's
        no commission on the rent you collect, whether you're listing a single PG room, a full apartment for
        monthly rental, or a nightly-stay unit.
      </p>

      <SeoReadMore>
        <h3>Which Category Fits Your Property</h3>
        <p>
          If you're renting out rooms with shared facilities to working professionals or students, PG &
          Co-Living is the right category. A full flat for a tenant staying months at a time fits Apartments &
          Villas. If you want to earn from short, hotel-style bookings instead, Hotels or Signature Stays (for
          fully furnished, premium units) will get you in front of nightly-stay guests. You pick the category
          when you start the listing form, and the form adjusts the fields it asks for accordingly — a PG
          listing asks about sharing type and mess facilities, while an apartment listing asks about lease
          terms and furnishing level instead.
        </p>

        <h3>The Zero-Brokerage Model, Explained</h3>
        <p>
          A traditional broker charges a tenant roughly a month's rent to connect them to a shortlist of
          properties, and in many markets also charges the owner a referral fee on top. OvikaLiving removes
          both sides of that cost. Owners keep the full rent they collect — there is no listing fee, no
          commission on bookings, and no renewal charge when a tenant changes. The platform's revenue comes
          from elsewhere (premium placement options, Signature Stays management, and value-added services for
          owners who want them), not from taking a cut of your rent.
        </p>

        <h3>How Long Listing Takes</h3>
        <p>
          The listing form itself takes most owners under 15–20 minutes to complete when photos and property
          details are ready beforehand. After submission, listings go through a review step before going live,
          which is also when you can apply for an Ovika Verified badge if you want the additional trust signal
          on your property page from day one. Most listings go live within 24–48 hours of submission, assuming
          photos and basic details are complete.
        </p>

        <h3>What You'll Need to List</h3>
        <ul>
          <li>Property address and locality, including nearest landmark or metro station.</li>
          <li>Room/unit details and sharing type, if listing a PG or co-living space.</li>
          <li>Pricing — monthly rent or nightly rate, plus security deposit if applicable.</li>
          <li>Amenities list — Wi-Fi, food, AC, housekeeping, parking, power backup.</li>
          <li>House rules — visitor policy, curfew (if any), smoking/pets policy.</li>
          <li>A set of clear, well-lit photographs of the room, common areas and exterior.</li>
        </ul>
        <p>
          The more complete the listing, the faster it tends to get enquiries — listings with full amenity
          details and five or more photos consistently get more owner-to-tenant contact than bare-bones
          listings with a single photo and a price.
        </p>

        <h3>Getting Verified — Why It's Worth the Extra Step</h3>
        <p>
          Owners can apply for an Ovika Verified badge after listing, which involves a physical check of the
          property against what's listed — photos, amenities, sharing configuration and address. It takes a
          little longer than a basic listing going live, but verified listings get noticeably faster tenant
          responses, because tenants comparing several similar-priced options tend to prioritise the ones with
          a visible trust signal. A lighter-weight "Self Verified" badge is also available, based on an
          owner-submitted identity and ownership check, for owners who want some trust signal without waiting
          for a physical visit.
        </p>

        <h3>Managing Pricing and Occupancy</h3>
        <p>
          Once live, owners manage their own pricing and availability directly — raising or lowering rent for
          a vacant room, blocking out dates for a nightly-stay unit, or pausing a listing entirely without
          needing to go through a broker or wait on anyone else's schedule. Booking and enquiry requests come
          through the platform directly to the owner, so there's no intermediary slowing down how fast a
          vacant room gets filled.
        </p>

        <h3>Who Should List on OvikaLiving</h3>
        <p>
          Owners with a spare room or two in a PG-style setup, owners with a full apartment they want to rent
          monthly or nightly, and owners managing multiple units who want one place to track enquiries across
          all of them — these are the typical profiles listing on OvikaLiving. The platform works equally for
          a single-room PG owner and for someone managing several properties across Noida and Greater Noida,
          since every listing is independent and managed from the same owner account.
        </p>
      </SeoReadMore>

      <div className="lpsc-tags">
        {TAGS.map(tag => <span className="lpsc-tag" key={tag}>{tag}</span>)}
      </div>
    </div>
  </section>
);

export default ListPropertySeoContent;
