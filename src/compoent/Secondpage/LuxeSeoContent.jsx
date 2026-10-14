import React from 'react';

const css = `
.lsc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.lsc-inner { max-width: 1100px; margin: 0 auto; }
.lsc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.lsc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.lsc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
@media (max-width: 640px) { .lsc-section { padding: 28px 16px 36px; } .lsc-inner h2 { font-size: 1.1rem; } }
`;

const LuxeSeoContent = () => (
  <section className="lsc-section">
    <style>{css}</style>
    <div className="lsc-inner">
      <h2>OvikaLiving Signature Stays — Premium Nightly Rentals in Noida & Greater Noida</h2>
      <p>
        Signature Stays are OvikaLiving's highest tier of nightly accommodation — fully managed, hotel-grade
        apartments meant for guests who want a short stay that still feels like home. Each Signature property
        is personally vetted before listing, self check-in enabled, and finished to a consistent standard, so
        what you see in the photos is what you get at the door.
      </p>

      <h3>Who Books Signature Stays</h3>
      <p>
        Business travellers who need a serviced apartment instead of a cramped hotel room, families visiting
        Noida or Greater Noida for a few days, and corporates booking short-term stays for relocating
        employees are the most common guests. Because every Signature listing is self-managed end-to-end by
        OvikaLiving, the booking, check-in and support experience stays consistent property to property —
        unlike a typical nightly rental where quality can vary a lot between owners.
      </p>

      <h3>Booking Ahead vs. Last-Minute</h3>
      <p>
        Signature inventory is intentionally limited compared to general PG or apartment listings, so booking
        a few days ahead usually gives you more choice of property and dates, particularly around weekends.
        Last-minute bookings are still accepted where availability allows, but the self check-in flow means
        confirmation can happen right up until the day of arrival.
      </p>

      <h3>What Makes a Stay "Signature"</h3>
      <p>
        Fully furnished interiors, verified amenities (AC, high-speed Wi-Fi, a stocked kitchen, smart TV),
        flexible check-in timing, and a dedicated support line are standard across every Signature property —
        not an upsell. Pricing is shown upfront with taxes, and the same booking flow used for every other
        OvikaLiving category applies here too: pick your dates, see the final price, and confirm instantly.
      </p>
    </div>
  </section>
);

export default LuxeSeoContent;
