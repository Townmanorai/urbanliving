import React from 'react';

const css = `
.ccsc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.ccsc-inner { max-width: 1100px; margin: 0 auto; }
.ccsc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.ccsc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
@media (max-width: 640px) { .ccsc-section { padding: 28px 16px 36px; } .ccsc-inner h2 { font-size: 1.1rem; } }
`;

const CategorySeoContent = () => (
  <section className="ccsc-section">
    <style>{css}</style>
    <div className="ccsc-inner">
      <h2>Start Your Free Listing on OvikaLiving</h2>
      <p>
        Pick the category that matches how you plan to rent out your property — shared rooms billed monthly
        (PG & Co-Living), a full unit for one tenant (Apartments & Villas), or nightly bookings (Hotels,
        Homestays & BnB, or Signature Stays for premium furnished units). Each option takes you to a guided
        form built for that category, so you're only asked for details that actually apply to your listing.
        There's no cost to list and no commission on what you earn — if you're unsure which category fits,
        the listing guide linked below walks through the difference in more detail.
      </p>
      <p>
        Owners often list more than one category over time — a PG owner who later buys a second property
        might list it as an Apartment or Villa, while someone with a fully furnished extra unit might test it
        as a nightly Hotel or Homestay listing to see which model earns better in their locality. You can
        manage every listing from the same owner dashboard regardless of category, so switching or adding a
        new listing type later doesn't require a separate account.
      </p>
    </div>
  </section>
);

export default CategorySeoContent;
