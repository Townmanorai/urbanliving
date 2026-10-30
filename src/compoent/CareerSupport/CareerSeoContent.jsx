import React from 'react';
import SeoReadMore from '../SEO/SeoReadMore';

const css = `
.csc-section { background: #fdf9f3; border-top: 1px solid #f0e8da; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.csc-inner { max-width: 1100px; margin: 0 auto; }
.csc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.csc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.csc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
.csc-inner ul { margin: 0 0 12px; padding-left: 20px; }
.csc-inner li { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin-bottom: 6px; }
.csc-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.csc-tag { font-size: 0.74rem; font-weight: 600; color: #8a5a1f; background: #fdf2e4; border: 1px solid #f0dfc4; border-radius: 20px; padding: 5px 12px; }
@media (max-width: 640px) { .csc-section { padding: 28px 16px 36px; } .csc-inner h2 { font-size: 1.1rem; } }
`;

const TAGS = [
  'careers at OvikaLiving', 'Townmanor Technologies jobs', 'proptech jobs Noida', 'software intern Noida',
  'AI marketing intern Noida', 'startup jobs Noida', 'rental platform careers India', 'internship Noida tech',
];

const CareerSeoContent = () => (
  <section className="csc-section">
    <style>{css}</style>
    <div className="csc-inner">
      <h2>Careers at OvikaLiving — Build India's Next-Generation Rental Platform</h2>
      <p>
        OvikaLiving is the flagship rental brand of Townmanor Technologies Pvt. Ltd., and the team behind it is
        small enough that every hire — intern or full-time — actually ships features used by tens of thousands
        of guests and property owners across Noida, Greater Noida, Gurugram and Delhi. If you're looking for a
        role where you're assigned real ownership from week one instead of shadowing someone else's project,
        this is what working at OvikaLiving looks like.
      </p>

      <SeoReadMore>
        <h3>What Townmanor Technologies Is Building</h3>
        <p>
          OvikaLiving exists to fix a specific, broken part of the Indian rental market: the broker-dependent
          process of finding a PG, co-living space, furnished apartment or short-term stay. The mission —
          "luxury living, made accessible" — plays out as a zero-brokerage, verification-first platform that
          already covers 200+ listed properties and 50,000+ guests across three cities and growing. Joining the
          team at this stage means working close to decisions that shape the product, not executing a roadmap
          that was finalised long before you arrived.
        </p>

        <h3>Current Open Roles</h3>
        <p>
          OvikaLiving typically hires internships in the 3–4 month range based out of Noida, with a clear path
          to a full-time offer for people who perform well. Two roles are commonly open:
        </p>
        <ul>
          <li><strong>Software Intern (Engineering)</strong> — works directly with the product and engineering team building features in React, Node.js and REST APIs that guests and hosts use every day.</li>
          <li><strong>AI Marketing Intern (Marketing & Growth)</strong> — uses AI tools for campaign execution, content strategy and growth hacking to expand OvikaLiving's digital presence.</li>
        </ul>
        <p>
          Roles open and close based on team capacity — the application form on this page accepts applications
          even when a listed role isn't an exact match, and the team reaches out when something opens up that
          fits.
        </p>

        <h3>Why Work at a Proptech Startup Like OvikaLiving</h3>
        <p>
          Real estate and rental technology in India is still mostly unsolved at the product level — most
          platforms are either classifieds with no verification, or broker-run networks with no transparency.
          Working on a team actively trying to fix that at the structural level (no brokerage, mandatory
          listing verification, direct owner-tenant connection) means the problems you're solving are genuinely
          unsolved ones, not incremental improvements on a mature, saturated product.
        </p>

        <h3>What You Actually Get</h3>
        <ul>
          <li><strong>Industry-level work</strong> — you ship features used by 50,000+ real guests, not dummy projects or internal tools nobody uses.</li>
          <li><strong>Direct access to leadership</strong> — you work under founders and senior leaders who've built and scaled products across India's proptech sector.</li>
          <li><strong>Modern tech exposure</strong> — hands-on with React, Node.js, AI tooling and cloud infrastructure, not legacy stacks.</li>
          <li><strong>Mentorship and a learning budget</strong> — weekly knowledge sessions and 1:1 mentorship from domain experts.</li>
          <li><strong>Travel coverage</strong> — site visits, property tours and team offsites are covered because understanding the product means seeing the properties, not just the dashboard.</li>
          <li><strong>Real pay and a path forward</strong> — competitive stipends, performance bonuses, and ESOP eligibility on conversion to a full-time role.</li>
        </ul>

        <h3>How the Application Process Works</h3>
        <p>
          The process is intentionally simple: fill in your name, email and phone number, then use the "About
          You + Resume Link" field to briefly explain what you know about OvikaLiving and paste a link to your
          resume (Google Drive or LinkedIn works). If you're applying for a specific listed role, select it so
          the team can route your application correctly. OvikaLiving reviews applications and reaches out
          within 5–7 business days — there's no multi-week black hole between applying and hearing back.
        </p>

        <h3>Who Tends to Do Well Here</h3>
        <p>
          Because the team is lean, the people who get the most out of working at OvikaLiving are generally
          comfortable with ambiguity — a small team means you'll often be the first person to touch a given
          problem, without a long-established playbook to follow. Curiosity about the actual rental market
          (not just the codebase or the campaign dashboard) also helps, since product decisions here are
          grounded in real tenant and owner behaviour across Noida and Greater Noida, not abstract user
          personas.
        </p>
      </SeoReadMore>

      <div className="csc-tags">
        {TAGS.map(tag => <span className="csc-tag" key={tag}>{tag}</span>)}
      </div>
    </div>
  </section>
);

export default CareerSeoContent;
