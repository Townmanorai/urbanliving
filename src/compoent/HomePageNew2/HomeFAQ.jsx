import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'What types of stays can I book on OvikaLiving?',
    a: "OvikaLiving lists five main categories: Signature Stays (fully managed premium homes), Hotels, Homestays & BnB, PG & Co-Living, and Apartments & Villas. You can filter by nightly or monthly stays depending on whether you need a short trip or a longer-term place to live in Noida, Greater Noida, Gurugram, Delhi or Ghaziabad."
  },
  {
    q: 'Is there any brokerage or hidden fee when I book a PG or apartment?',
    a: "No. OvikaLiving does not charge tenants any brokerage. The price you see on the listing — plus applicable taxes shown at checkout — is what you pay. Property owners list directly on the platform, so there's no middleman commission added to your rent."
  },
  {
    q: 'How does OvikaLiving verify its properties?',
    a: 'Every listing goes through a review process before it goes live, and many properties carry an "Ovika Verified" or "Self Verified" badge after the owner and listing details are checked. You can see a property\'s verification status directly on its detail page before booking.'
  },
  {
    q: "What's the difference between a PG, co-living and a Signature Stay?",
    a: 'A PG (paying guest) is a shared or single room inside a managed residence, usually billed monthly with food and basic amenities included. Co-living is similar but with a stronger community element — shared common areas, events and services across a larger property. Signature Stays are OvikaLiving\'s premium, fully furnished homes meant for guests who want a hotel-like experience with more privacy and higher-end finishes.'
  },
  {
    q: 'Can I book for just one night, or only monthly?',
    a: "Both. Properties tagged under Nightly Stays can be booked for a single night or a short trip, while Monthly Rentals are built for tenants who want to stay for a month or longer. The booking flow and pricing automatically adjust based on which option you pick on the property page."
  },
  {
    q: 'How do I pay, and is my payment secure?',
    a: 'Payments are processed through a secure, encrypted payment gateway at checkout. You get a confirmation and an official payment receipt immediately after a successful booking, with your booking ID, stay dates and a full price breakdown.'
  },
  {
    q: 'What if I need to cancel my booking?',
    a: 'Cancellation terms vary by property and are shown clearly on the listing before you book — most Signature Stays and monthly rentals offer free cancellation within a defined window. Refund timelines depend on your payment method and are detailed in our Cancellation & Refund Policy.'
  },
  {
    q: 'I own a property — how do I list it on OvikaLiving?',
    a: 'Go to "List Your Property" from the homepage, choose your category (PG, Hotel, Apartment/Villa or Signature Stay), and complete the guided listing form with your property details, photos and pricing. Listing is free, and our team reviews submissions before they go live.'
  },
  {
    q: 'Which cities does OvikaLiving currently operate in?',
    a: 'OvikaLiving is focused on the Delhi NCR region — primarily Noida, Greater Noida, Gurugram, Delhi and Ghaziabad — with new properties being added regularly across these cities.'
  },
  {
    q: 'What does the "Ovika Verified" or "Self Verified" badge actually mean?',
    a: "Ovika Verified means our team has independently reviewed the owner's documents and cross-checked the listing details against the property. Self Verified means the owner has submitted and attested to their documents through our portal, pending full review. Both badges are shown clearly on the listing so you know exactly what stage of verification a property is at."
  },
  {
    q: 'Can I search by locality or sector instead of just the city?',
    a: "Yes. The search bar lets you search by city, locality or even a specific sector — for example, you can search directly for 'Sector 62 Noida' or 'Knowledge Park Greater Noida' to see listings concentrated in that area, rather than scrolling through an entire city's results."
  },
  {
    q: 'Is there a security deposit, and how is it handled?',
    a: 'Most monthly PG, co-living and apartment listings require a security deposit, with the amount shown upfront on the listing before you book. Deposit terms — including what it can be used for and how refunds are processed at the end of a stay — are set by the property owner and displayed as part of the booking details.'
  },
  {
    q: 'Can property owners manage bookings and pricing themselves?',
    a: 'Yes. Owners get access to a dashboard where they can update pricing, availability, amenities and house rules for their listing at any time, as well as view and respond to booking and enquiry requests directly.'
  },
  {
    q: 'Do I need to create an account before I can browse listings?',
    a: "No — you can browse properties, filter by category and locality, and view full listing details without an account. You'll only need to sign up when you're ready to book, save a property, or contact an owner directly."
  }
];

const css = `
.hfaq-section { background: #fdf9f3; padding: 48px 40px 56px; font-family: 'Poppins', sans-serif; }
.hfaq-inner { max-width: 900px; margin: 0 auto; }
.hfaq-eyebrow { font-size: 0.72rem; color: #c2772b; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; text-align: center; }
.hfaq-title { margin: 0 0 8px; font-size: 1.9rem; font-weight: 800; color: #1a1209; text-align: center; }
.hfaq-sub { margin: 0 0 32px; font-size: 0.92rem; color: #6b5540; text-align: center; }
.hfaq-item { border: 1px solid #f0e8da; border-radius: 14px; background: #fff; margin-bottom: 12px; overflow: hidden; }
.hfaq-q { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 20px; background: none; border: none; cursor: pointer; text-align: left; font-size: 0.95rem; font-weight: 600; color: #1a1209; font-family: inherit; }
.hfaq-chevron { flex-shrink: 0; width: 18px; height: 18px; color: #c2772b; transition: transform 0.2s ease; }
.hfaq-chevron.open { transform: rotate(180deg); }
.hfaq-a { max-height: 0; overflow: hidden; transition: max-height 0.25s ease; }
.hfaq-a.open { max-height: 320px; }
.hfaq-a-inner { padding: 0 20px 18px; font-size: 0.86rem; line-height: 1.7; color: #4a3828; }
@media (max-width: 640px) {
  .hfaq-section { padding: 36px 16px 44px; }
  .hfaq-title { font-size: 1.5rem; }
}
`;

const HomeFAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <section className="hfaq-section">
      <style>{css}</style>
      <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <div className="hfaq-inner">
        <div className="hfaq-eyebrow">Got Questions?</div>
        <h2 className="hfaq-title">Frequently Asked Questions</h2>
        <p className="hfaq-sub">Everything you need to know before booking a PG, co-living space or stay on OvikaLiving.</p>

        {FAQS.map((item, i) => {
          const isOpen = openIdx === i;
          return (
            <div className="hfaq-item" key={item.q}>
              <button
                className="hfaq-q"
                onClick={() => setOpenIdx(isOpen ? -1 : i)}
                aria-expanded={isOpen}
              >
                <span>{item.q}</span>
                <ChevronDown className={`hfaq-chevron ${isOpen ? 'open' : ''}`} />
              </button>
              <div className={`hfaq-a ${isOpen ? 'open' : ''}`}>
                <p className="hfaq-a-inner">{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HomeFAQ;
