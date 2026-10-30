import React from 'react';
import SeoReadMore from '../SEO/SeoReadMore';

const css = `
.ctsc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.ctsc-inner { max-width: 1100px; margin: 0 auto; }
.ctsc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.ctsc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.ctsc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
.ctsc-inner ul { margin: 0 0 12px; padding-left: 20px; }
.ctsc-inner li { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin-bottom: 6px; }
.ctsc-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.ctsc-tag { font-size: 0.74rem; font-weight: 600; color: #8a5a1f; background: #fdf2e4; border: 1px solid #f0dfc4; border-radius: 20px; padding: 5px 12px; }
@media (max-width: 640px) { .ctsc-section { padding: 28px 16px 36px; } .ctsc-inner h2 { font-size: 1.1rem; } }
`;

const TAGS = [
  'contact OvikaLiving', 'OvikaLiving office Noida', 'list property enquiry', 'partnership OvikaLiving',
  'investor contact OvikaLiving', 'Townmanor Technologies contact', 'sales enquiry rental platform',
];

const ContactSeoContent = () => (
  <section className="ctsc-section">
    <style>{css}</style>
    <div className="ctsc-inner">
      <h2>Get in Touch With OvikaLiving — Listings, Partnerships & General Enquiries</h2>
      <p>
        This page is for anyone reaching out to OvikaLiving before they've booked or listed anything yet —
        a property owner considering listing, a business exploring a partnership, an investor with a
        question, or anyone who simply wants to understand how the platform works before using it. If you
        already have a booking or an account and need help with it, the Support page is the faster route.
      </p>

      <SeoReadMore>
        <h3>Who Should Use This Page</h3>
        <ul>
          <li><strong>Prospective property owners</strong> who want to understand the listing process or verification requirements before starting a listing.</li>
          <li><strong>Businesses and partners</strong> exploring a collaboration — corporate housing tie-ups, bulk booking arrangements, or regional expansion partnerships.</li>
          <li><strong>Investors</strong> interested in Townmanor Technologies and OvikaLiving's growth, who want to request information or set up a conversation.</li>
          <li><strong>Media and press</strong> looking for company information or a comment.</li>
          <li><strong>General visitors</strong> with a question about how OvikaLiving works that isn't covered on the FAQ page.</li>
        </ul>

        <h3>Listing Enquiries</h3>
        <p>
          If you're a property owner and haven't started a listing yet, you can also go directly to the List
          Your Property page to begin — but if you have questions first (which category fits your property,
          how verification works, what documents are needed), reaching out here gets you a direct answer
          before you commit time to filling out the listing form.
        </p>

        <h3>Partnership & Business Enquiries</h3>
        <p>
          OvikaLiving works with corporate clients needing recurring accommodation for relocating employees,
          with property management companies looking to list managed inventory in bulk, and with other
          businesses exploring regional partnerships. These conversations typically start with a short written
          enquiry through this page describing the scope, followed by a direct call with the relevant team.
        </p>

        <h3>Response Times</h3>
        <p>
          General and partnership enquiries are usually acknowledged within one business day. Listing-related
          questions from prospective owners tend to get the fastest turnaround since they're the most common
          enquiry type. For urgent matters tied to an existing booking or account, the Support page routes to
          the right team faster than a general enquiry here.
        </p>

        <h3>Where OvikaLiving Operates</h3>
        <p>
          OvikaLiving's listings and operations are concentrated in Noida, Greater Noida, Gurugram, Delhi and
          Ghaziabad. If your enquiry is about a region outside current coverage, it's still worth reaching out
          — expansion into new localities is based partly on inbound interest from both owners and prospective
          tenants in that area.
        </p>

        <h3>Before You Reach Out</h3>
        <p>
          For general platform questions — how booking works, how verification badges work, how payments are
          handled — the FAQ page covers the most common ones and might get you an answer faster than waiting
          on a reply. This contact page is best used for anything specific to your situation that the FAQ
          doesn't already answer.
        </p>
      </SeoReadMore>

      <div className="ctsc-tags">
        {TAGS.map(tag => <span className="ctsc-tag" key={tag}>{tag}</span>)}
      </div>
    </div>
  </section>
);

export default ContactSeoContent;
