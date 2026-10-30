import React from 'react';
import SeoReadMore from '../SEO/SeoReadMore';

const css = `
.svsc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.svsc-inner { max-width: 1100px; margin: 0 auto; }
.svsc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.svsc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.svsc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
.svsc-inner ol, .svsc-inner ul { margin: 0 0 12px; padding-left: 20px; }
.svsc-inner li { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin-bottom: 6px; }
.svsc-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.svsc-tag { font-size: 0.74rem; font-weight: 600; color: #8a5a1f; background: #fdf2e4; border: 1px solid #f0dfc4; border-radius: 20px; padding: 5px 12px; }
@media (max-width: 640px) { .svsc-section { padding: 28px 16px 36px; } .svsc-inner h2 { font-size: 1.1rem; } }
`;

const TAGS = [
  'Self Verified badge', 'self verification PG Noida', 'owner verification OvikaLiving',
  'list PG without broker', 'provisional trust badge', 'fast listing verification Noida',
];

const SelfVerifiedSeoContent = () => (
  <section className="svsc-section">
    <style>{css}</style>
    <div className="svsc-inner">
      <h2>Self Verification — A Faster Path to a Trusted Listing</h2>
      <p>
        Self Verification lets property owners submit their identity and ownership documents directly through
        the platform and get a provisional trust badge on their listing while OvikaLiving's team completes
        full verification. It's designed for owners who want their listing to carry a trust signal from day
        one, rather than waiting for the complete review cycle before it shows any verification status at all.
      </p>

      <SeoReadMore>
      <h3>The Self Verification Process, Step by Step</h3>
      <ol>
        <li><strong>Mobile verification.</strong> Enter your registered email and mobile number; OvikaLiving sends a 6-digit OTP to confirm it's really you before anything else proceeds.</li>
        <li><strong>Property media upload.</strong> Upload one exterior photo, at least three interior photos, and a short walkthrough video of the property — these are what let a prospective tenant (and later, the review team) actually see the space rather than take your word for it.</li>
        <li><strong>Location pin.</strong> Use your current location or manually enter latitude and longitude, plus an optional full address, so the property's exact position is on record rather than just a locality name.</li>
        <li><strong>Submit.</strong> Once all three steps are complete, the listing immediately carries the Self Verified badge while it queues for full Ovika Verified review.</li>
      </ol>

      <h3>Why Owners Choose This Route First</h3>
      <p>
        Full Ovika Verified status involves a team member cross-checking your submission against the listing,
        which naturally takes longer than an instant badge. Self Verification exists so a new listing doesn't
        sit with zero trust signal while that review is pending — the moment you've uploaded real photos, a
        walkthrough video and pinned your exact location, guests already see meaningfully more evidence than a
        bare, unverified listing offers. For an owner trying to fill a vacant room quickly, that difference in
        enquiry volume from day one is often worth the few minutes the submission takes.
      </p>

      <h3>Self Verified vs. Ovika Verified</h3>
      <p>
        A Self Verified badge means the owner has submitted and attested to their documents and property media
        through our portal. An Ovika Verified badge means our team has independently reviewed and confirmed
        those details against the listing. Guests can see which badge (if any) a property carries directly on
        its listing page, so the distinction is always transparent — not hidden in fine print. Neither badge is
        meant to replace the other; Self Verified is simply the earlier, faster stage of the same pipeline that
        ends in full Ovika Verified status.
      </p>

      <h3>What Guests Should Know About a Self Verified Listing</h3>
      <p>
        A Self Verified listing is a meaningfully stronger signal than an unverified one — real photos, a real
        walkthrough video and a confirmed location are already on file — but it hasn't yet been independently
        cross-checked by the Townmanor team the way a fully Ovika Verified listing has. If you're comparing two
        otherwise similar listings and one carries the full badge, that's usually the safer first option; if
        only Self Verified options are available in your target locality, it's still worth messaging the owner
        with specific questions before committing to a booking.
      </p>

      <h3>Does It Expire?</h3>
      <p>
        Once a property passes full Ovika Verified review, the badge stays on the listing as long as the
        property details remain accurate. If you significantly change the property — a different address,
        ownership transfer, or major renovation — it's worth re-submitting for verification so the badge
        continues to reflect the property's current state.
      </p>

      <h3>How to Apply</h3>
      <p>
        Owners can start the self-verification process from their dashboard by submitting the required mobile
        OTP confirmation, property photos and walkthrough video, and location pin through the owner
        verification form. Once submitted, the Self Verified badge typically appears on the listing shortly
        after, with full Ovika Verified status following once our team's review is complete.
      </p>

      <h3>What Tenants Actually See Change</h3>
      <p>
        Once a listing carries the Self Verified badge, the property card and detail page both display it
        clearly, alongside the walkthrough video and photo set the owner submitted. For a tenant scrolling
        through a dozen similar PG or apartment listings in the same sector, that combination — a visible
        badge plus real photos and video rather than a handful of stock-style images — is usually enough to
        move a listing from "maybe" to "worth messaging the owner about," which is the entire point of having
        a lightweight first-stage badge rather than making every owner wait for full review before showing any
        trust signal at all.
      </p>

      <h3>Self Verification for Different Property Types</h3>
      <p>
        The same three-step process applies whether you're listing a single PG room, a co-living bed, or a
        full furnished apartment — the walkthrough video simply needs to cover whatever is actually being
        rented out. For a PG room, that means the room itself plus shared spaces like the kitchen, bathroom and
        common area; for a full apartment, it means every room in the unit. Matching the video to exactly what
        a tenant would see on move-in day is what makes the badge meaningful rather than a formality.
      </p>
      </SeoReadMore>

      <div className="svsc-tags">
        {TAGS.map(tag => <span className="svsc-tag" key={tag}>{tag}</span>)}
      </div>
    </div>
  </section>
);

export default SelfVerifiedSeoContent;
