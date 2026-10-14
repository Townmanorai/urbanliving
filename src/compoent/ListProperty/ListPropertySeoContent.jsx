import React from 'react';

const css = `
.lpsc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.lpsc-inner { max-width: 1100px; margin: 0 auto; }
.lpsc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.lpsc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.lpsc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
@media (max-width: 640px) { .lpsc-section { padding: 28px 16px 36px; } .lpsc-inner h2 { font-size: 1.1rem; } }
`;

const ListPropertySeoContent = () => (
  <section className="lpsc-section">
    <style>{css}</style>
    <div className="lpsc-inner">
      <h2>List Your Property in Noida or Greater Noida — Without Paying a Broker</h2>
      <p>
        Most property owners lose a chunk of their first month's rent to a broker, and then repeat that cost
        every time a tenant turns over. Listing directly on OvikaLiving removes that cost entirely — there's
        no commission on the rent you collect, whether you're listing a single PG room, a full apartment for
        monthly rental, or a nightly-stay unit.
      </p>

      <h3>Which Category Fits Your Property</h3>
      <p>
        If you're renting out rooms with shared facilities to working professionals or students, PG & Co-Living
        is the right category. A full flat for a tenant staying months at a time fits Apartments & Villas. If
        you want to earn from short, hotel-style bookings instead, Hotels or Signature Stays (for fully
        furnished, premium units) will get you in front of nightly-stay guests. You pick the category when you
        start the listing form, and the form adjusts the fields it asks for accordingly.
      </p>

      <h3>How Long Listing Takes</h3>
      <p>
        The listing form itself takes most owners under 15–20 minutes to complete when photos and property
        details are ready beforehand. After submission, listings go through a review step before going live,
        which is also when you can apply for an Ovika Verified badge if you want the additional trust signal
        on your property page from day one.
      </p>

      <h3>What You'll Need to List</h3>
      <p>
        Property address and locality, room/unit details and sharing type if applicable, pricing, amenities,
        house rules, and a set of clear photographs — the more complete the listing, the faster it tends to
        get enquiries. Owners can also apply for an Ovika Verified badge after listing, which has a measurable
        effect on how quickly a listing converts to bookings.
      </p>
    </div>
  </section>
);

export default ListPropertySeoContent;
