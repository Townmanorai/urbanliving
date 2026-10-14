import React from 'react';

const css = `
.ldsc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.ldsc-inner { max-width: 1100px; margin: 0 auto; }
.ldsc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.ldsc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.ldsc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
@media (max-width: 640px) { .ldsc-section { padding: 28px 16px 36px; } .ldsc-inner h2 { font-size: 1.1rem; } }
`;

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

      <h3>What Counts as a "Verified" Lead</h3>
      <p>
        Each lead comes from a real enquiry — a guest who searched for a property matching your category,
        location and price range, and showed genuine intent by submitting their contact details. Leads are
        matched to your listing's category and city, so a PG owner in Sector 62 isn't paying for enquiries
        meant for a Gurugram apartment.
      </p>

      <h3>When Buying Leads Makes Sense</h3>
      <p>
        If your listing has been live for a while with low enquiry volume, or you're onboarding a new property
        and want to fill it quickly rather than wait for organic search traffic to discover it, leads are
        where the add-on pays off most. For well-established listings in high-demand sectors, organic search
        traffic alone is often enough.
      </p>

      <h3>How It Fits With Your Free Listing</h3>
      <p>
        Your base listing stays free and commission-free regardless of whether you buy leads — leads are an
        optional add-on for owners who want more active outreach rather than waiting for organic search
        traffic to find their property.
      </p>
    </div>
  </section>
);

export default LeadsSeoContent;
