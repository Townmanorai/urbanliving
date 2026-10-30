import React from 'react';
import SeoReadMore from '../SEO/SeoReadMore';

const css = `
.ovsc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.ovsc-inner { max-width: 1100px; margin: 0 auto; }
.ovsc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.ovsc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.ovsc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
.ovsc-inner ul { margin: 0 0 12px; padding-left: 20px; }
.ovsc-inner li { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin-bottom: 6px; }
.ovsc-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.ovsc-tag { font-size: 0.74rem; font-weight: 600; color: #8a5a1f; background: #fdf2e4; border: 1px solid #f0dfc4; border-radius: 20px; padding: 5px 12px; }
@media (max-width: 640px) { .ovsc-section { padding: 28px 16px 36px; } .ovsc-inner h2 { font-size: 1.1rem; } }
`;

const TAGS = [
  'Ovika Verified Noida', 'verified PG badge', 'team verified rental Noida', 'trusted PG listing',
  'verified landlord Noida', 'no fake listing PG', 'Ovika Verified vs Self Verified',
];

const OvikaVerifiedSeoContent = () => (
  <section className="ovsc-section">
    <style>{css}</style>
    <div className="ovsc-inner">
      <h2>Why the Ovika Verified Badge Matters When Booking a PG or Rental</h2>
      <p>
        One of the biggest frustrations with renting in Noida or Greater Noida is the gap between listing
        photos and what's actually at the property. The Ovika Verified badge exists specifically to close
        that gap — it's only awarded to listings where OvikaLiving has reviewed the owner's details, checked
        the listed amenities against the property, and confirmed the information shown to guests is accurate.
      </p>

      <SeoReadMore>
      <h3>What Gets Checked</h3>
      <p>
        Verification covers the property owner's identity, ownership or authorization documents, and a
        cross-check of the listing itself — photos, amenities, pricing and address — against what's actually
        available on-site. Properties that pass carry the Ovika Verified badge visibly on their listing and
        detail page, so you can filter for it before you even start messaging owners.
      </p>

      <h3>How the Full Verification Process Works</h3>
      <p>
        Ovika Verified builds on top of the self-verification submission — mobile OTP confirmation, exterior
        and interior property photos, a walkthrough video and a precise location pin — that every owner
        completes first. Once that submission is in, the Townmanor review team cross-checks the submitted
        media and details against the listing itself: does the exterior photo match the pinned location, do
        the interior photos reflect the amenities claimed on the listing, is the room count and sharing
        configuration consistent with what's advertised. Only listings that pass this review carry the full
        Ovika Verified badge, as opposed to the lighter Self Verified status that applies once the owner's
        submission is in but before the team's independent check is complete.
      </p>

      <h3>Why This Badge Carries More Weight Than Photos Alone</h3>
      <p>
        Listing photos can be old, borrowed from a similar unit, or simply flattering in ways that don't
        reflect the property on the day you move in. A walkthrough video reviewed by an actual team member is
        much harder to fake than a handful of curated photos, which is why Ovika Verified listings consistently
        get more enquiries than otherwise-identical unverified ones in the same sector and price band —
        tenants have learned to treat the badge as a genuine filter, not just decoration on the listing card.
      </p>

      <h3>How Guests Should Use the Badge</h3>
      <p>
        Treat the Ovika Verified badge as a strong trust signal, not a guarantee against every possible issue —
        it's still worth reading the listing carefully and messaging the owner with any specific questions
        before booking, especially for monthly stays where you'll be living in the property for an extended
        period. Confirm move-in date availability, ask about anything not clearly shown in the photos (parking,
        water pressure, noise levels), and treat the badge as a strong starting point for trust rather than a
        substitute for your own due diligence.
      </p>

      <h3>What to Compare When Two Listings Both Carry the Badge</h3>
      <ul>
        <li>How recently the verification was completed — a listing verified months ago may have changed since.</li>
        <li>Whether amenities shown in the walkthrough video match what's listed on the card (food, Wi-Fi, AC, housekeeping).</li>
        <li>Sharing type and occupancy — two verified PGs at the same rent can differ significantly in room configuration.</li>
        <li>Distance to the nearest metro station or office corridor, which the badge itself doesn't capture.</li>
      </ul>

      <h3>Verified vs. Self-Verified Listings</h3>
      <p>
        OvikaLiving uses two trust signals: "Ovika Verified" (reviewed and confirmed by our team) and "Self
        Verified" (the owner has submitted and attested to their documents, pending full review). Both are
        shown clearly on the property card and detail page, so you always know which stage of verification a
        listing is at before you book — no guesswork, no surprises at check-in. When choosing between a Self
        Verified and an Ovika Verified listing at a similar price, the fully verified option is generally the
        safer first choice, though a recently submitted Self Verified listing is still meaningfully more
        trustworthy than one with no verification badge at all.
      </p>

      <h3>How Owners Get This Badge</h3>
      <p>
        Property owners start from the owner verification form, complete mobile OTP confirmation, upload the
        required exterior photo, at least three interior photos and a walkthrough video, then pin the exact
        property location on the map before submitting. That submission immediately earns Self Verified status
        on the listing, and once the Townmanor team reviews and confirms it, the listing is upgraded to full
        Ovika Verified — generally the single highest-impact step an owner can take to increase enquiry volume
        on a new listing.
      </p>
      </SeoReadMore>

      <div className="ovsc-tags">
        {TAGS.map(tag => <span className="ovsc-tag" key={tag}>{tag}</span>)}
      </div>
    </div>
  </section>
);

export default OvikaVerifiedSeoContent;
