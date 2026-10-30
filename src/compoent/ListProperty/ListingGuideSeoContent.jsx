import React from 'react';
import SeoReadMore from '../SEO/SeoReadMore';

const css = `
.lgsc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.lgsc-inner { max-width: 1100px; margin: 0 auto; }
.lgsc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.lgsc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.lgsc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
.lgsc-inner ul { margin: 0 0 12px; padding-left: 20px; }
.lgsc-inner li { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin-bottom: 6px; }
.lgsc-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.lgsc-tag { font-size: 0.74rem; font-weight: 600; color: #8a5a1f; background: #fdf2e4; border: 1px solid #f0dfc4; border-radius: 20px; padding: 5px 12px; }
@media (max-width: 640px) { .lgsc-section { padding: 28px 16px 36px; } .lgsc-inner h2 { font-size: 1.1rem; } }
`;

const TAGS = [
  'how to list property Noida', 'listing tips PG owners', 'verified listing guide Noida',
  'price PG competitively Noida', 'rental listing mistakes', 'list flat for rent Greater Noida',
  'owner verification OvikaLiving', 'Self Verified vs Ovika Verified',
];

const ListingGuideSeoContent = () => (
  <section className="lgsc-section">
    <style>{css}</style>
    <div className="lgsc-inner">
      <h2>How to Create a Listing That Actually Gets Enquiries</h2>
      <p>
        Two listings for near-identical rooms in the same Noida sector, at the same rent, can get wildly
        different enquiry volume — and the difference almost never comes down to luck. It comes down to
        photos, how complete the amenity list is, whether the price matches what's realistic for the area, and
        whether the listing carries a verification badge. This guide covers what consistently moves a listing
        from ignored to booked.
      </p>

      <SeoReadMore>
        <h3>Photos Are the First (and Biggest) Filter</h3>
        <p>
          Most prospective tenants decide whether to even open a listing based on the thumbnail photo alone.
          Well-lit, honest photos of the actual room or unit — not stock images, not photos of a similar but
          different property — consistently outperform generic or low-quality images, even when the property
          itself is comparable. Shoot during the day with natural light where possible, include the room, the
          attached or shared bathroom, and any common areas (kitchen, living space) that are part of what a
          tenant is actually paying for, and avoid over-editing photos in a way that won't match what a guest
          sees on move-in day — a mismatch between photos and reality is the single fastest way to lose a
          tenant's trust after they've already shown interest.
        </p>

        <h3>An Accurate, Complete Amenity List</h3>
        <p>
          Leaving amenities unmarked or inaccurate — forgetting to flag AC, Wi-Fi, food, housekeeping or
          power backup — doesn't just under-sell the property, it actively filters your listing out of
          searches where tenants have those amenities set as a requirement. A listing with every applicable
          amenity accurately checked shows up in more filtered searches and sets the right expectation before a
          tenant even messages, which cuts down on back-and-forth questions and speeds up the decision to book.
        </p>

        <h3>Pricing Competitively for Your Sector</h3>
        <p>
          Before setting a rate, look at what similar listings — same sharing type, similar amenities, nearby
          sector — are actually charging on OvikaLiving right now, not what you assume the market rate is from
          a conversation months ago. Rents in Noida and Greater Noida shift sector by sector and season by
          season; a rate that was competitive in Sector 62 a year ago may be above or below today's going rate.
          If a listing sits for more than a couple of weeks with views but no enquiries, that's usually the
          clearest signal to recheck pricing against current comparable listings before assuming the property
          itself is the problem.
        </p>

        <h3>Getting Verified — Why It's Worth the Extra Step</h3>
        <p>
          Submitting for verification — mobile OTP confirmation, exterior and interior photos, a walkthrough
          video and a precise location pin — earns a listing Self Verified status immediately, and once the
          Townmanor team reviews and confirms the submission, it's upgraded to full Ovika Verified. Verified
          listings consistently draw more enquiries than otherwise-identical unverified ones, because the badge
          removes a layer of hesitation for tenants who've been burned before by listings that didn't match
          reality. It's generally the single highest-impact step an owner can take on a new listing, and it's
          detailed fully on the Ovika Verified page.
        </p>

        <h3>Common Mistakes That Slow Down Bookings</h3>
        <ul>
          <li>Listing under the wrong category — a shared room listed as a full Apartment won't show up for tenants filtering by PG or Co-Living.</li>
          <li>Vague or missing availability dates, which makes tenants assume the listing is stale even if it isn't.</li>
          <li>Overpricing relative to nearby comparable listings and leaving the rate unchanged for weeks despite no enquiries.</li>
          <li>Incomplete or inconsistent amenity tags that don't match what's shown in the photos.</li>
          <li>Skipping verification — unverified listings routinely get fewer clicks than verified ones at the same price point.</li>
          <li>Slow response time to enquiries — tenants comparing multiple listings tend to move on to whichever owner replies first.</li>
        </ul>

        <h3>Choosing the Right Category Before You List</h3>
        <p>
          Rooms or beds shared with other tenants, priced and rented per bed or per room, belong under PG &
          Co-Living. A full unit rented to one tenant or family, priced as a whole, belongs under Apartments &
          Villas. Properties rented per night rather than monthly fall under Hotels, Homestays & BnB, or
          Signature Stays for a premium, fully managed tier. The List Category page covers this decision in
          more depth, but getting it right at the listing stage avoids the need to re-list later under a
          different category after weeks of low visibility.
        </p>

        <h3>After You List — What to Keep Updated</h3>
        <p>
          A listing isn't a one-time submission. Keeping availability dates current, updating photos if the
          property changes (a new coat of paint, added furniture, a renovated bathroom), and adjusting pricing
          periodically against comparable listings all keep a listing performing well months after it first
          went live, rather than quietly losing visibility to newer, more actively maintained listings in the
          same sector.
        </p>
      </SeoReadMore>

      <div className="lgsc-tags">
        {TAGS.map(tag => <span className="lgsc-tag" key={tag}>{tag}</span>)}
      </div>
    </div>
  </section>
);

export default ListingGuideSeoContent;
