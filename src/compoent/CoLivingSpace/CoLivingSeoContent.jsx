import React from 'react';

const css = `
.cls-seo { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.cls-seo-inner { max-width: 1100px; margin: 0 auto; }
.cls-seo-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.cls-seo-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.cls-seo-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
@media (max-width: 640px) { .cls-seo { padding: 28px 16px 36px; } .cls-seo-inner h2 { font-size: 1.1rem; } }
`;

const CoLivingSeoContent = () => (
  <section className="cls-seo">
    <style>{css}</style>
    <div className="cls-seo-inner">
      <h2>Co-Living in Noida & Greater Noida — What to Expect</h2>
      <p>
        Co-living on OvikaLiving is built for people who want a furnished room without giving up a sense of
        community — think working professionals near the Sector 62–63 IT corridor, students around Knowledge
        Park in Greater Noida, and remote workers or startup founders who'd rather not deal with brokers,
        9-month lock-ins or unclear bills. Every co-living listing shows exactly what's included — Wi-Fi,
        meals, housekeeping, power backup, parking — so the rent you see is the rent you pay.
      </p>

      <h3>Co-Living vs. a Regular PG</h3>
      <p>
        A standard PG is primarily a place to sleep and store your things, usually with limited common space.
        Co-living takes the same furnished-room convenience and adds shared lounges, work-friendly common
        areas and sometimes community events — so it tends to suit people who'll actually spend time in the
        building, not just sleep there. Pricing is typically comparable to a mid-tier PG once food and
        utilities are factored in.
      </p>

      <h3>Lease Flexibility</h3>
      <p>
        Co-living leases on OvikaLiving tend to be more flexible than a standard 11-month apartment lease —
        many listings allow monthly renewal with a shorter notice period, which suits tenants who aren't
        certain how long they'll be in the city, such as interns, new hires still evaluating a job, or
        students between semesters.
      </p>

      <h3>Where Co-Living Spaces Are Concentrated</h3>
      <p>
        In Noida, co-living supply clusters around Sector 62, 63, 16, 18, 50–52 and the Sector 15/22/27 belt —
        largely driven by proximity to corporate offices and the Blue/Aqua metro lines. In Greater Noida,
        Alpha, Beta, Knowledge Park and the area around Pari Chowk are the most active zones, popular with
        students at nearby institutes and young professionals in the Knowledge Park tech offices.
      </p>

      <h3>Amenities Worth Prioritizing</h3>
      <p>
        High-speed Wi-Fi and a reliable power backup consistently top the list of what co-living tenants
        actually care about, followed by housekeeping frequency and whether meals are included or optional.
        If you're comparing two similarly priced co-living rooms, these operational details — not just the
        rent figure — usually decide which one is the better value.
      </p>

      <h3>Listing Your Property as a Co-Living Space</h3>
      <p>
        If you own a multi-room property in Noida or Greater Noida, OvikaLiving lets you list it as a
        co-living space for free — no brokerage, no listing fee. You control pricing, house rules and
        occupancy, and you reach tenants who are specifically looking for managed, community-style living
        rather than a bare rental.
      </p>
    </div>
  </section>
);

export default CoLivingSeoContent;
