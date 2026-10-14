import React from 'react';

const css = `
.lgsc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.lgsc-inner { max-width: 1100px; margin: 0 auto; }
.lgsc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.lgsc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.lgsc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
@media (max-width: 640px) { .lgsc-section { padding: 28px 16px 36px; } .lgsc-inner h2 { font-size: 1.1rem; } }
`;

const ListingGuideSeoContent = () => (
  <section className="lgsc-section">
    <style>{css}</style>
    <div className="lgsc-inner">
      <h2>Choosing the Right Listing Category — A Practical Guide</h2>
      <p>
        The category you pick when listing on OvikaLiving decides what fields the form asks for, how your
        property is priced and displayed, and which guests see it first — so getting it right upfront saves
        you from re-listing later. Here's how the five categories actually differ in practice.
      </p>

      <h3>PG & Co-Living vs. Apartments & Villas</h3>
      <p>
        If you're renting out individual rooms or beds with shared common areas — kitchen, bathroom, living
        space — to multiple unrelated tenants, that's PG & Co-Living. If you're renting the entire unit to one
        tenant or family, it belongs under Apartments & Villas, priced and leased as a whole rather than per
        bed or per room.
      </p>

      <h3>Switching Categories Later</h3>
      <p>
        If you listed under one category and it's not converting the way you expected, you're not locked in —
        a PG room that's struggling for bookings in a student-heavy area might do better repositioned as
        co-living, and a monthly apartment in a high-footfall locality might earn more switched to nightly
        stays. Reach out to support if you want help evaluating whether a category switch makes sense for your
        specific listing.
      </p>

      <h3>Hotels, Homestays & Signature Stays</h3>
      <p>
        Hotels and Homestays & BnB both target nightly-stay guests, with Homestays typically being smaller,
        more personal set-ups compared to a full hotel operation. Signature Stays is a step above both — a
        premium, fully furnished and actively managed category reserved for properties that meet a higher
        finish and consistency bar, usually onboarded with more hands-on support from the OvikaLiving team.
      </p>

      <h3>Pricing Each Category Correctly</h3>
      <p>
        PG and co-living rooms are usually priced per bed or per room, per month, inclusive or exclusive of
        food depending on what you offer. Apartments and villas are priced as a whole-unit monthly rent plus a
        security deposit. Nightly categories — Hotels, Homestays and Signature Stays — are priced per night,
        and typically benefit from being compared against similar listings in the same locality before you
        finalize a rate, since nightly pricing is far more sensitive to local competition than monthly rent.
      </p>

      <h3>Not Sure Which Fits?</h3>
      <p>
        As a rule of thumb: priced and rented by the room or bed → PG & Co-Living. Priced and rented as a
        whole unit, long-term → Apartments & Villas. Priced and booked by the night → Hotels, Homestays or
        Signature Stays, depending on how premium and fully managed the property is.
      </p>
    </div>
  </section>
);

export default ListingGuideSeoContent;
