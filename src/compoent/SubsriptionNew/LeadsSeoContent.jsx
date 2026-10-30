import React from 'react';
import SeoReadMore from '../SEO/SeoReadMore';

const css = `
.ldsc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.ldsc-inner { max-width: 1100px; margin: 0 auto; }
.ldsc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.ldsc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.ldsc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
.ldsc-inner ul { margin: 0 0 12px; padding-left: 20px; }
.ldsc-inner li { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin-bottom: 6px; }
.ldsc-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.ldsc-tag { font-size: 0.74rem; font-weight: 600; color: #8a5a1f; background: #fdf2e4; border: 1px solid #f0dfc4; border-radius: 20px; padding: 5px 12px; }
@media (max-width: 640px) { .ldsc-section { padding: 28px 16px 36px; } .ldsc-inner h2 { font-size: 1.1rem; } }
`;

const TAGS = [
  'buy tenant leads Noida', 'property owner leads Greater Noida', 'pay per lead rental', 'PG leads Noida',
  'flat leads Gurugram', 'verified tenant enquiries', 'no subscription leads', 'fill vacancy faster Noida',
];

const LeadsSeoContent = () => (
  <section className="ldsc-section">
    <style>{css}</style>
    <div className="ldsc-inner">
      <h2>Why Property Owners Buy Verified Leads on OvikaLiving</h2>
      <p>
        A free listing gets you discovered by guests actively browsing, but if you want to fill vacancies
        faster — especially during a slow month or right after a tenant moves out — buying verified leads puts
        your property directly in front of tenants who are already searching for exactly what you're offering
        in Noida, Greater Noida, Gurugram or Delhi.
      </p>

      <SeoReadMore>
        <h3>How the Lead-Buying Model Works</h3>
        <p>
          Instead of a flat monthly subscription, OvikaLiving's Buy Leads feature runs on a pay-per-lead basis:
          you pay only for the enquiries you actually receive, not for guaranteed visibility or a fixed time
          window. A lead is generated when a tenant actively searching OvikaLiving submits interest in a
          property matching your category, city and price range, and you get their full contact details —
          name, phone number and what they're looking for — so you can follow up directly without going
          through a broker or a middleman.
        </p>

        <h3>What Counts as a "Verified" Lead</h3>
        <p>
          Each lead comes from a real enquiry — a guest who searched for a property matching your category,
          location and price range, and showed genuine intent by submitting their contact details rather than
          just browsing anonymously. Leads are matched to your listing's category and city, so a PG owner in
          Sector 62 isn't paying for enquiries meant for a Gurugram apartment, and a co-living space owner
          isn't getting leads for someone searching exclusively for a 2BHK furnished flat. This matching is
          what keeps the lead pool relevant instead of being a generic contact list sold to every owner on the
          platform.
        </p>

        <h3>Why Lead Quality Matters More Than Lead Volume</h3>
        <p>
          A high volume of unqualified contacts wastes an owner's time just as much as having no enquiries at
          all — every call to a tenant who was never genuinely interested, or was looking in a completely
          different city or budget range, is time that could have gone toward a real prospect. OvikaLiving's
          leads are tied to an actual search action on the platform, which filters out casual browsing and
          keeps the leads an owner receives closer to tenants who are realistically ready to move forward.
        </p>

        <h3>When Buying Leads Makes Sense</h3>
        <p>
          If your listing has been live for a while with low enquiry volume, or you're onboarding a new
          property and want to fill it quickly rather than wait for organic search traffic to discover it,
          leads are where the add-on pays off most. It's also useful around seasonal demand shifts — for
          example, the run-up to a new academic year near Greater Noida's Knowledge Park, when student PG
          demand spikes and owners who proactively reach out tend to convert faster than those waiting for
          inbound interest. For well-established listings in high-demand sectors with consistent organic
          traffic, the free listing alone is often enough.
        </p>

        <h3>Who This Is Best Suited For</h3>
        <ul>
          <li>Owners with multiple properties who want a steady, predictable flow of enquiries across all of them.</li>
          <li>New listings that haven't built up organic search visibility yet.</li>
          <li>Owners in competitive sectors where dozens of similar listings exist and standing out organically takes time.</li>
          <li>Agents or managers handling several owners' properties who need a consistent enquiry pipeline rather than relying on word of mouth.</li>
          <li>Owners re-listing after a tenant moves out who want to minimise the vacancy period.</li>
        </ul>

        <h3>How It Fits With Your Free Listing</h3>
        <p>
          Your base listing stays free and commission-free regardless of whether you buy leads — leads are an
          optional add-on for owners who want more active outreach rather than waiting for organic search
          traffic to find their property. There's no subscription lock-in: you pay only when a verified lead is
          generated, so the cost scales directly with the enquiries you actually get, not with how long your
          listing has been live.
        </p>

        <h3>Getting the Most Out of a Purchased Lead</h3>
        <p>
          Response speed matters — tenants who submit an enquiry are usually comparing a handful of properties
          at the same time, so calling back within a few hours rather than a few days meaningfully improves
          conversion. Having your pricing, deposit terms and availability dates ready before you call also
          shortens the back-and-forth and makes it easier to confirm a booking on the first real conversation
          rather than losing the lead to a faster-responding owner.
        </p>
      </SeoReadMore>

      <div className="ldsc-tags">
        {TAGS.map(tag => <span className="ldsc-tag" key={tag}>{tag}</span>)}
      </div>
    </div>
  </section>
);

export default LeadsSeoContent;
