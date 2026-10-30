import React from 'react';
import SeoReadMore from '../SEO/SeoReadMore';

const css = `
.msc-section { background: #fdf9f3; border-top: 1px solid #f0e8da; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.msc-inner { max-width: 1100px; margin: 0 auto; }
.msc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.msc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.msc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
.msc-inner ul { margin: 0 0 12px; padding-left: 20px; }
.msc-inner li { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin-bottom: 6px; }
.msc-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.msc-tag { font-size: 0.74rem; font-weight: 600; color: #8a5a1f; background: #fdf2e4; border: 1px solid #f0dfc4; border-radius: 20px; padding: 5px 12px; }
@media (max-width: 640px) { .msc-section { padding: 28px 16px 36px; } .msc-inner h2 { font-size: 1.1rem; } }
`;

const TAGS = [
  'monthly PG Noida', 'long term rental Greater Noida', 'monthly co-living Noida', 'furnished flat monthly rent Noida',
  'PG for working professionals Noida', 'no brokerage monthly rental', '1 month notice period PG', 'monthly stay Gurugram',
];

const MonthlySeoContent = () => (
  <section className="msc-section">
    <style>{css}</style>
    <div className="msc-inner">
      <h2>Monthly Rentals — PG, Co-Living & Furnished Apartments in Noida, Greater Noida & Gurugram</h2>
      <p>
        Monthly Rentals is OvikaLiving's long-stay category, covering PG rooms, co-living beds and fully
        furnished apartments for tenants planning to stay a month or more. Every listing here shows the
        monthly rent, security deposit and notice period upfront, so there's no ambiguity about total cost
        before you reach out to the owner — a deliberate contrast to the usual broker-led process where
        deposit terms only surface after you've already committed to visiting a property.
      </p>

      <SeoReadMore>
        <h3>Who This Category Is For</h3>
        <p>
          Monthly Rentals is built for working professionals relocating for a new job, students enrolling near
          Noida's Knowledge Park and tech corridor, and families or groups looking for a furnished flat without
          signing a traditional long-lease agreement through a broker. Because listings are owner-posted and
          most carry a verification badge, tenants get a realistic sense of what they're moving into before any
          deposit changes hands.
        </p>

        <h3>PG and Co-Living Rentals</h3>
        <p>
          For PG and co-living, the monthly rent typically bundles the room, food (where included), Wi-Fi,
          housekeeping and basic utilities into one figure. Sharing type — single, double or triple — is the
          single biggest lever on monthly cost: a single-occupancy room in the same building can run noticeably
          higher per person than a triple-sharing room with identical amenities, so comparing sharing options
          side by side on the same listing is usually the fastest way to fit a specific budget.
        </p>

        <h3>Furnished Apartments on a Monthly Lease</h3>
        <p>
          For tenants who want their own flat rather than a shared PG setup, the apartment segment of Monthly
          Rentals covers 1BHK, 2BHK and 3BHK furnished units across Noida, Greater Noida and Gurugram. These
          typically come with a formal lease, a security deposit (commonly one to two months' rent) and a
          notice period — all shown on the listing page itself, along with whether the owner includes
          housekeeping, maintenance or parking in the monthly figure.
        </p>

        <h3>Deposit, Notice Period & What to Confirm Before Moving In</h3>
        <ul>
          <li>Security deposit amount and whether it's refundable in full, subject to condition at move-out.</li>
          <li>Notice period required before vacating — typically 30 days, but confirm per listing.</li>
          <li>Whether electricity, water and maintenance are included in rent or billed separately.</li>
          <li>Verification status — Ovika Verified listings have been physically confirmed by the Townmanor team.</li>
          <li>Lock-in period, if any, before which leaving early may forfeit part of the deposit.</li>
        </ul>

        <h3>Why Monthly Tenants Choose OvikaLiving Over a Broker</h3>
        <p>
          The standard broker model in Noida and Greater Noida charges tenants roughly a month's rent as
          brokerage for access to a shortlist that may already be outdated. OvikaLiving's monthly rental
          listings remove that fee entirely — owners list directly, tenants book directly, and the only money
          that changes hands is rent and deposit to the property owner. That's a meaningful saving on a
          move that already involves enough upfront cost between deposit, moving expenses and the first
          month's rent.
        </p>
      </SeoReadMore>

      <div className="msc-tags">
        {TAGS.map(tag => <span className="msc-tag" key={tag}>{tag}</span>)}
      </div>
    </div>
  </section>
);

export default MonthlySeoContent;
