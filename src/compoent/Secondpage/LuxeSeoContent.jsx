import React from 'react';
import SeoReadMore from '../SEO/SeoReadMore';

const css = `
.lsc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.lsc-inner { max-width: 1100px; margin: 0 auto; }
.lsc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.lsc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.lsc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
.lsc-inner ul { margin: 0 0 12px; padding-left: 20px; }
.lsc-inner li { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin-bottom: 6px; }
.lsc-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.lsc-tag { font-size: 0.74rem; font-weight: 600; color: #8a5a1f; background: #fdf2e4; border: 1px solid #f0dfc4; border-radius: 20px; padding: 5px 12px; }
@media (max-width: 640px) { .lsc-section { padding: 28px 16px 36px; } .lsc-inner h2 { font-size: 1.1rem; } }
`;

const TAGS = [
  'Signature Stays Noida', 'luxury nightly rental Noida', 'TM Luxe Noida', 'serviced apartment Noida',
  'premium short stay Greater Noida', 'self check-in apartment Noida', 'business travel stay Noida',
  'corporate housing Noida',
];

const LuxeSeoContent = () => (
  <section className="lsc-section">
    <style>{css}</style>
    <div className="lsc-inner">
      <h2>OvikaLiving Signature Stays — Premium Nightly Rentals in Noida & Greater Noida</h2>
      <p>
        Signature Stays are OvikaLiving's highest tier of nightly accommodation — fully managed, hotel-grade
        apartments meant for guests who want a short stay that still feels like home. Each Signature property
        is personally vetted before listing, self check-in enabled, and finished to a consistent standard, so
        what you see in the photos is what you get at the door. This is the category guests land on when
        they want something a step above a standard nightly listing — closer in feel to a serviced apartment
        than a typical PG-turned-short-stay.
      </p>

      <SeoReadMore>
        <h3>Who Books Signature Stays</h3>
        <p>
          Business travellers who need a serviced apartment instead of a cramped hotel room, families visiting
          Noida or Greater Noida for a few days, and corporates booking short-term stays for relocating
          employees are the most common guests. Because every Signature listing is self-managed end-to-end by
          OvikaLiving, the booking, check-in and support experience stays consistent property to property —
          unlike a typical nightly rental where quality can vary a lot between owners. It's also a frequent
          choice for guests coming to Noida for a short consulting assignment or project-based work who want a
          proper kitchen and workspace rather than a hotel room.
        </p>

        <h3>What Makes a Stay "Signature"</h3>
        <p>
          Fully furnished interiors, verified amenities (AC, high-speed Wi-Fi, a stocked kitchen, smart TV),
          flexible check-in timing, and a dedicated support line are standard across every Signature property —
          not an upsell. Pricing is shown upfront with taxes, and the same booking flow used for every other
          OvikaLiving category applies here too: pick your dates, see the final price, and confirm instantly.
          Every listing goes through a physical review before it's published, so the finish quality stays
          consistent whether you're booking a studio or a full 2BHK.
        </p>

        <h3>Signature vs. a Standard Nightly Listing</h3>
        <p>
          A standard nightly listing on OvikaLiving is still owner-managed — the owner handles check-in,
          pricing and guest communication directly. A Signature property is managed end-to-end by the
          OvikaLiving team, which means a more consistent experience, standardised photography and amenities,
          and support you can reach if something goes wrong during the stay. The trade-off is a smaller pool of
          inventory, since not every property qualifies for the Signature standard — but for guests who
          prioritise consistency over the widest possible selection, it's the more reliable option.
        </p>

        <h3>What's Included in Every Signature Property</h3>
        <ul>
          <li>Fully furnished living space — bed, seating, wardrobe, and a working kitchen in apartment-style units.</li>
          <li>High-speed Wi-Fi, verified and tested before the listing goes live.</li>
          <li>Air conditioning, power backup, and 24/7 water supply as standard, not add-ons.</li>
          <li>Self check-in where enabled, with clear instructions sent ahead of arrival.</li>
          <li>Direct support line for anything that comes up during the stay — not routed through the property owner.</li>
        </ul>

        <h3>Booking Ahead vs. Last-Minute</h3>
        <p>
          Signature inventory is intentionally limited compared to general PG or apartment listings, so booking
          a few days ahead usually gives you more choice of property and dates, particularly around weekends.
          Last-minute bookings are still accepted where availability allows, but the self check-in flow means
          confirmation can happen right up until the day of arrival. For weekend stays or if a specific
          location is a must-have, booking at least 3-4 days out gives meaningfully more options than
          searching the day before.
        </p>

        <h3>Where Signature Properties Are Located</h3>
        <p>
          Signature inventory is concentrated in well-connected, higher-demand pockets of Noida and Greater
          Noida — close to metro access, business districts and major markets — since these are the locations
          guests booking a premium nightly stay actually search for. As more owners complete the Signature
          onboarding process, coverage continues to expand across Noida, Greater Noida and Gurugram, with
          Delhi availability growing as well.
        </p>

        <h3>Pricing & What's Included in the Quoted Rate</h3>
        <p>
          Every Signature listing shows a per-night rate inclusive of applicable taxes before you confirm a
          booking — there's no separate cleaning fee or service charge added at checkout that wasn't visible
          upfront. Rates vary by location, property size and season, with weekend and festival-period pricing
          typically running higher than weekday rates, similar to how hotel pricing works, but always shown
          clearly before you commit to a booking.
        </p>
      </SeoReadMore>

      <div className="lsc-tags">
        {TAGS.map(tag => <span className="lsc-tag" key={tag}>{tag}</span>)}
      </div>
    </div>
  </section>
);

export default LuxeSeoContent;
