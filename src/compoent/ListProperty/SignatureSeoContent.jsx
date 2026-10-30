import React from 'react';
import SeoReadMore from '../SEO/SeoReadMore';

const css = `
.sgsc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.sgsc-inner { max-width: 1100px; margin: 0 auto; }
.sgsc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.sgsc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.sgsc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
.sgsc-inner ul { margin: 0 0 12px; padding-left: 20px; }
.sgsc-inner li { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin-bottom: 6px; }
.sgsc-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.sgsc-tag { font-size: 0.74rem; font-weight: 600; color: #8a5a1f; background: #fdf2e4; border: 1px solid #f0dfc4; border-radius: 20px; padding: 5px 12px; }
@media (max-width: 640px) { .sgsc-section { padding: 28px 16px 36px; } .sgsc-inner h2 { font-size: 1.1rem; } }
`;

const TAGS = [
  'Signature Stays Noida', 'managed rental Noida', 'short-stay property management Noida',
  'list furnished apartment for nightly rental', 'premium nightly rental Greater Noida',
  'property management Noida Gurugram', 'earn from furnished flat Noida',
];

const SignatureSeoContent = () => (
  <section className="sgsc-section">
    <style>{css}</style>
    <div className="sgsc-inner">
      <h2>Listing Your Property as an OvikaLiving Signature Stay</h2>
      <p>
        Signature Stays are OvikaLiving's managed, premium nightly-rental tier — meant for property owners
        whose unit is already fully furnished to a high standard and who want it actively managed and
        marketed as a short-stay rental rather than handled as a regular monthly listing. It sits at the top
        of OvikaLiving's category structure, above standard PG, co-living and monthly-apartment listings, and
        is built specifically for owners who want hands-off, revenue-focused management rather than
        self-handling tenant calls and check-ins.
      </p>

      <SeoReadMore>
        <h3>What's Different About the Signature Track</h3>
        <p>
          Unlike a standard listing where the owner handles guest communication and check-in themselves,
          Signature properties go through a more hands-on onboarding — our team reviews the property in detail,
          helps set a nightly rate based on comparable Signature listings nearby, and positions the unit for
          guests specifically browsing the premium category rather than general PG or apartment search traffic.
          The listing itself is also presented differently on the platform — better photography guidelines,
          a dedicated Signature badge, and placement ahead of standard listings when a guest filters for
          premium nightly stays.
        </p>

        <h3>What Management Actually Covers</h3>
        <p>
          Once a property is onboarded, OvikaLiving's team handles the guest-facing side of running it as a
          short-stay rental: responding to booking enquiries, coordinating check-in and check-out timing with
          guests, and managing the calendar so the property isn't double-booked or sitting vacant without the
          owner knowing why. Owners aren't expected to personally answer guest messages or negotiate nightly
          rates case by case — that's the core value of the Signature track over listing a property
          independently.
        </p>

        <h3>What Happens After You Apply</h3>
        <p>
          Once you submit the contact form, our team reviews your property details and reaches out within 24
          hours to discuss onboarding — including a property walkthrough, suggested nightly pricing based on
          comparable Signature listings, and what, if anything, needs upgrading to meet the Signature standard
          before the listing goes live. For most fully furnished units, this process from first contact to a
          live listing typically takes a few days, depending on how quickly photography and any minor
          furnishing gaps are sorted out.
        </p>

        <h3>Earnings Compared to a Standard Listing</h3>
        <p>
          Because Signature properties are actively marketed and priced on a per-night basis rather than a flat
          monthly rent, owners generally see higher gross earnings per unit compared to listing the same
          property as a standard monthly apartment — though this comes with the trade-off of variable occupancy
          rather than a fixed, predictable monthly payment. A well-located, well-furnished Signature unit in a
          high-demand Noida or Greater Noida pocket can outperform an equivalent monthly rental over a full
          year, but owners should go in expecting some months to run higher occupancy than others, similar to
          any short-stay rental model.
        </p>

        <h3>Furnishing & Property Standards</h3>
        <ul>
          <li>Fully furnished — bed, wardrobe, seating, and a functional kitchen if the unit includes one.</li>
          <li>Reliable Wi-Fi and power backup, since Signature guests expect uninterrupted connectivity.</li>
          <li>Clean, presentable bathrooms and common areas — these are the first things reviewed during onboarding.</li>
          <li>Good natural light and recent, accurate photography — listings with dated or mismatched photos perform worse and are flagged during review.</li>
          <li>A location within reasonable distance of transit, markets or the business district it's being positioned toward.</li>
        </ul>

        <h3>Signature Stays vs. a Regular Monthly Listing</h3>
        <p>
          A regular monthly listing suits owners who want one long-term tenant and minimal involvement after
          the lease starts. Signature Stays suits owners who are comfortable with guest turnover in exchange
          for higher per-night rates and active demand management from OvikaLiving's team. If a property is
          vacant between long-term tenants, some owners also use the Signature track as a way to earn from the
          unit during that gap rather than leaving it empty while searching for the next monthly tenant.
        </p>

        <h3>Who Should Apply</h3>
        <p>
          Owners with a fully furnished 1BHK, 2BHK or studio in a well-connected part of Noida or Greater
          Noida — ideally with amenities like AC, high-speed Wi-Fi and a stocked kitchen already in place — are
          the best fit. If your property isn't fully furnished yet, the regular Apartments & Villas or Hotel
          listing categories are a better starting point until it's ready for the Signature tier. Owners
          unsure which category fits can submit the contact form regardless — the onboarding team will advise
          whether Signature, a standard nightly listing, or a monthly rental is the better starting point for
          that specific property.
        </p>
      </SeoReadMore>

      <div className="sgsc-tags">
        {TAGS.map(tag => <span className="sgsc-tag" key={tag}>{tag}</span>)}
      </div>
    </div>
  </section>
);

export default SignatureSeoContent;
