import React from 'react';
import SeoReadMore from '../SEO/SeoReadMore';

const css = `
.ovfsc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.ovfsc-inner { max-width: 1100px; margin: 0 auto; }
.ovfsc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.ovfsc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.ovfsc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
.ovfsc-inner ul { margin: 0 0 12px; padding-left: 20px; }
.ovfsc-inner li { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin-bottom: 6px; }
.ovfsc-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.ovfsc-tag { font-size: 0.74rem; font-weight: 600; color: #8a5a1f; background: #fdf2e4; border: 1px solid #f0dfc4; border-radius: 20px; padding: 5px 12px; }
@media (max-width: 640px) { .ovfsc-section { padding: 28px 16px 36px; } .ovfsc-inner h2 { font-size: 1.1rem; } }
`;

const TAGS = [
  'owner verification OvikaLiving', 'list property without broker Noida', 'property photo verification',
  'walkthrough video listing', 'verified landlord Noida', 'prevent fake PG listing',
];

const OwnerVerificationSeoContent = () => (
  <section className="ovfsc-section">
    <style>{css}</style>
    <div className="ovfsc-inner">
      <h2>Why Owner Verification Matters on OvikaLiving</h2>
      <p>
        Verification isn't just a badge for guests to see — it's what lets OvikaLiving confirm that a listing
        is backed by a real property and a real owner before it ever reaches a tenant's search results.
        Completing this form — mobile confirmation, property photos and video, and an exact location pin — is
        the first and required step toward getting your listing marked Self Verified, and later, fully Ovika
        Verified.
      </p>

      <SeoReadMore>
      <h3>The Three-Step Submission</h3>
      <p>
        The owner verification form is split into three short steps rather than one long form, so it's easy to
        complete in one sitting from a phone: mobile verification (confirming your registered number with a
        6-digit OTP), media upload (one exterior photo, a minimum of three interior photos, and a walkthrough
        video of the property), and location (pinning the property's exact latitude and longitude, with an
        optional full address). Each step is validated before you can move to the next, so nothing gets
        submitted incomplete.
      </p>

      <h3>Why Photos and Video, Not Paper Documents</h3>
      <p>
        Rather than asking owners to upload scanned ID or ownership paperwork, OvikaLiving's verification flow
        is built around visual proof of the property itself — the exterior, the interiors, and a walkthrough
        video that's materially harder to fake or borrow from another listing than a document scan. Combined
        with the mobile OTP confirmation and a precise map location, this gives the review team (and later,
        prospective tenants) a far more reliable picture of whether the property actually matches the listing
        than a photo gallery alone would.
      </p>

      <h3>What Happens After You Submit</h3>
      <ul>
        <li>Your listing immediately carries the Self Verified badge once mobile, media and location steps are complete.</li>
        <li>The Townmanor review team cross-checks your submitted photos, video and location against the live listing.</li>
        <li>Once confirmed, the listing is upgraded to full Ovika Verified status — the strongest trust signal on the platform.</li>
        <li>You'll get an approval or rejection notification at the email address you submit with the form.</li>
      </ul>

      <h3>Tips Before You Start</h3>
      <p>
        Shoot the exterior photo in daylight and make sure the building number or signage is visible where
        possible — this is one of the fastest ways reviewers confirm the location matches your map pin. Keep
        the walkthrough video under a couple of minutes but make sure it covers every room and the shared
        spaces (kitchen, bathroom, common area for PG/co-living listings), since a rushed or partial video is
        one of the most common reasons a submission gets sent back for resubmission.
      </p>

      <h3>What You Get Once Verified</h3>
      <p>
        A verified listing typically sees more enquiries, since guests consistently filter toward badged
        properties when comparing options in the same locality and price range. Verification is a one-time
        process per owner account, not something you need to repeat for every new property you list, though
        significant changes to a specific property — a renovation, a different unit, a change in ownership —
        are worth resubmitting so the badge stays accurate.
      </p>

      <h3>Mobile Verification — Why It's Step One</h3>
      <p>
        Starting the process with a mobile OTP check, rather than letting anyone submit property media first,
        ties every verification submission to a real, reachable phone number from the outset. It's a simple
        step, but it's also the first line of defence against spam submissions and listings created under a
        number nobody actually answers — which matters once a tenant starts messaging an owner about move-in
        dates and needs a reliable way to reach them.
      </p>

      <h3>Getting Your Location Pin Right</h3>
      <p>
        The "Use My Current Location" option on the form pulls latitude and longitude directly from your
        device's GPS when you're standing at the property, which is the fastest and most accurate way to
        complete this step. If you're filling out the form away from the property, enter the coordinates
        manually and double-check them against a map before submitting — an inaccurate pin is one of the more
        common reasons a submission needs a second look during review, since it's the detail reviewers use to
        confirm your exterior photo actually corresponds to the address on the listing.
      </p>

      <h3>Common Reasons a Submission Gets Sent Back</h3>
      <ul>
        <li>Interior photos that don't clearly show the room being listed (overly dark, blurry, or cropped tightly).</li>
        <li>A walkthrough video that skips a room or common area mentioned in the listing's amenities.</li>
        <li>Location pin noticeably off from the address entered, or missing altogether.</li>
        <li>Exterior photo that doesn't show enough of the building to confirm it against the map location.</li>
      </ul>
      <p>
        None of these are hard to avoid — they mostly come down to taking a few extra minutes on the media
        upload step rather than rushing through it. A clean submission on the first attempt is also simply
        faster for everyone, since it skips a resubmission round before your listing can move from Self
        Verified to full Ovika Verified status.
      </p>
      </SeoReadMore>

      <div className="ovfsc-tags">
        {TAGS.map(tag => <span className="ovfsc-tag" key={tag}>{tag}</span>)}
      </div>
    </div>
  </section>
);

export default OwnerVerificationSeoContent;
