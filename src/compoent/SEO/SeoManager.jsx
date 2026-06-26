import { Helmet } from 'react-helmet';
import { useLocation, useParams } from 'react-router-dom';

const SITE_NAME   = 'OvikaLiving';
const SITE_URL    = 'https://www.ovikaliving.com';
const LOGO_URL    = `${SITE_URL}/ovika-logo.png`;
const DEFAULT_IMG = `${SITE_URL}/og-default.jpg`;

const SEO_ROUTES = {
  '/': {
    title: 'OvikaLiving — Verified PG, Co-Living, Apartments & Nightly Stays in Noida, Delhi NCR',
    description: 'Find verified PG, co-living spaces, furnished apartments, homestays & premium nightly stays in Noida, Greater Noida, Gurugram & Delhi. No brokerage. Instant booking. Flexible stays for working professionals, students & corporates.',
    keywords: 'PG in Noida, co-living Noida, furnished apartments Noida, nightly stays Noida, short term rental Delhi NCR, OvikaLiving, PG near me, working professional PG, girls PG Noida, boys PG Noida',
    og: { type: 'website', image: DEFAULT_IMG },
    schema: {
      '@type': 'Organization',
      name: 'OvikaLiving',
      url: SITE_URL,
      logo: LOGO_URL,
      sameAs: ['https://www.instagram.com/ovikaliving', 'https://www.facebook.com/ovikaliving'],
      contactPoint: { '@type': 'ContactPoint', telephone: '+91-9319392227', contactType: 'customer support' },
    },
  },
  '/properties': {
    title: 'All Properties — PG, Apartments, Hotels & Homestays | OvikaLiving',
    description: 'Browse verified PG rooms, co-living spaces, furnished apartments, hotels and homestays across Noida, Greater Noida, Gurugram and Delhi. Filter by category, price, city and amenities.',
    keywords: 'properties in Noida, PG rooms Noida, furnished apartments Delhi NCR, co-living spaces, hotel stays Noida, homestay Noida, apartments for rent Noida',
    og: { type: 'website', image: DEFAULT_IMG },
  },
  '/nightly-stays': {
    title: 'Nightly Stays in Noida & Delhi NCR — Short-Term Rental | OvikaLiving',
    description: 'Book verified nightly stays & short-term rentals in Noida, Greater Noida & Delhi. Fully furnished, self check-in properties. Best daily rates with no brokerage.',
    keywords: 'nightly stays Noida, short term rental Noida, daily rate stays, hotel alternatives Noida, furnished nightly rental Delhi NCR, OvikaLiving nightly',
    og: { type: 'website', image: DEFAULT_IMG },
  },
  '/monthly-rentals': {
    title: 'Monthly Rentals — PG & Furnished Apartments in Noida, Delhi NCR | OvikaLiving',
    description: 'Find monthly PG, co-living & furnished apartments in Noida, Greater Noida, Gurugram & Delhi. Long-term stays with flexible lease. No brokerage, verified listings.',
    keywords: 'monthly PG Noida, furnished apartment monthly rent, co-living monthly, long term rental Noida, monthly stays Delhi NCR',
    og: { type: 'website', image: DEFAULT_IMG },
  },
  '/about': {
    title: 'About OvikaLiving — Our Story, Mission & Team',
    description: 'Learn about OvikaLiving — India\'s verified smart-stay platform connecting tenants with PG owners, apartment hosts & nightly rental providers across Delhi NCR.',
    keywords: 'about OvikaLiving, smart stay platform, verified rentals India, OvikaLiving team, rental platform Delhi NCR',
    og: { type: 'website', image: DEFAULT_IMG },
  },
  '/contactus': {
    title: 'Contact OvikaLiving — Support, Queries & Partnerships',
    description: 'Get in touch with OvikaLiving for booking support, listing queries, partnerships or any assistance. We reply in minutes.',
    keywords: 'contact OvikaLiving, OvikaLiving support, rental help, property listing support, customer care OvikaLiving',
    og: { type: 'website', image: DEFAULT_IMG },
  },
  '/support': {
    title: 'Support — OvikaLiving Help Center',
    description: 'Need help? Reach out to OvikaLiving support for booking issues, property queries, payment help and more.',
    keywords: 'OvikaLiving support, help center, booking help, property help, customer care',
    og: { type: 'website', image: DEFAULT_IMG },
  },
  '/faq': {
    title: 'FAQ — Frequently Asked Questions | OvikaLiving',
    description: 'Find answers to common questions about booking, listing, payments, cancellations and more on OvikaLiving.',
    keywords: 'OvikaLiving FAQ, frequently asked questions, booking questions, rental FAQ, OvikaLiving help',
    og: { type: 'website', image: DEFAULT_IMG },
    schema: {
      '@type': 'FAQPage',
    },
  },
  '/privacy-policy': {
    title: 'Privacy Policy | OvikaLiving',
    description: 'Read OvikaLiving\'s privacy policy to understand how we collect, use and protect your personal data.',
    keywords: 'OvikaLiving privacy policy, data protection, user privacy',
    og: { type: 'website', image: DEFAULT_IMG },
  },
  '/terms-and-conditions': {
    title: 'Terms & Conditions | OvikaLiving',
    description: 'Review the terms and conditions governing use of OvikaLiving\'s platform, services and listings.',
    keywords: 'OvikaLiving terms, conditions of use, rental terms, platform terms',
    og: { type: 'website', image: DEFAULT_IMG },
  },
  '/refund-cancellation-policy': {
    title: 'Refund & Cancellation Policy | OvikaLiving',
    description: 'Understand OvikaLiving\'s flexible, moderate and strict cancellation policies and how refunds are processed.',
    keywords: 'OvikaLiving refund policy, cancellation policy, booking cancellation, rental refund',
    og: { type: 'website', image: DEFAULT_IMG },
  },
  '/list-property': {
    title: 'List Your Property on OvikaLiving — Earn More, Zero Brokerage',
    description: 'List your PG, apartment, hotel or homestay on OvikaLiving for free. Reach thousands of verified tenants across Delhi NCR. Instant listing, no commissions.',
    keywords: 'list property Noida, rent out PG, list apartment Delhi NCR, host on OvikaLiving, property owner listing',
    og: { type: 'website', image: DEFAULT_IMG },
  },
  '/list-category': {
    title: 'Choose Your Listing Type | OvikaLiving',
    description: 'Select from PG, co-living, hotel, homestay or apartment to list your property on OvikaLiving and start earning.',
    keywords: 'list PG, list apartment, list hotel, list homestay, OvikaLiving property listing',
    og: { type: 'website', image: DEFAULT_IMG },
  },
  '/listing-guide': {
    title: 'Listing Guide — How to List Your Property | OvikaLiving',
    description: 'Step-by-step guide to listing your property on OvikaLiving. Learn about Signature Stays, PG listings, hotels & more.',
    keywords: 'how to list property OvikaLiving, listing guide, property listing tips, host guide',
    og: { type: 'website', image: DEFAULT_IMG },
  },
  '/ovika-verified': {
    title: 'Ovika Verified Properties — Trusted & Inspected Listings | OvikaLiving',
    description: 'Ovika Verified properties are personally inspected and certified for quality, safety and accuracy. Book with confidence.',
    keywords: 'Ovika Verified, verified PG Noida, inspected property, certified rental, trusted listings',
    og: { type: 'website', image: DEFAULT_IMG },
  },
  '/coliving-space': {
    title: 'Co-Living Spaces in Noida & Delhi NCR | OvikaLiving',
    description: 'Discover premium co-living spaces with community living, shared amenities and flexible leases in Noida, Greater Noida and Gurugram.',
    keywords: 'co-living Noida, co-living spaces Delhi NCR, shared living, community living, coliving Greater Noida',
    og: { type: 'website', image: DEFAULT_IMG },
  },
  '/roi-calculator': {
    title: 'Property ROI Calculator — Estimate Your Rental Income | OvikaLiving',
    description: 'Calculate your property\'s potential rental income and return on investment with OvikaLiving\'s free ROI calculator for PG, apartments and nightly stays.',
    keywords: 'ROI calculator, property income calculator, rental income estimate, PG earnings, apartment rental ROI',
    og: { type: 'website', image: DEFAULT_IMG },
  },
  '/login': {
    title: 'Login or Sign Up | OvikaLiving',
    description: 'Login or create your OvikaLiving account to book properties, manage listings and access your dashboard.',
    keywords: 'OvikaLiving login, sign up OvikaLiving, create account, tenant login, owner login',
    og: { type: 'website', image: DEFAULT_IMG },
  },
  '/signature-listing': {
    title: 'List a Signature Stay — Premium Property Listing | OvikaLiving',
    description: 'Apply to list your premium property as an OvikaLiving Signature Stay and reach high-intent guests looking for luxury short-term rentals.',
    keywords: 'Signature Stay listing, premium property listing, luxury rental Noida, OvikaLiving Signature',
    og: { type: 'website', image: DEFAULT_IMG },
  },
  '/legal-information': {
    title: 'Legal Information | OvikaLiving',
    description: 'View legal information, company details, and regulatory disclosures for OvikaLiving.',
    keywords: 'OvikaLiving legal, company information, regulatory disclosure',
    og: { type: 'website', image: DEFAULT_IMG },
  },
};

// Prefix-based fallbacks for dynamic routes
const PREFIX_SEO = [
  {
    prefix: '/property/',
    get: () => ({
      title: 'Property Details | OvikaLiving',
      description: 'View property details, room types, pricing, amenities and book your stay on OvikaLiving.',
      keywords: 'property details, book PG, book apartment, nightly stay, OvikaLiving property',
      og: { type: 'website', image: DEFAULT_IMG },
    }),
  },
  {
    prefix: '/update-pg/',
    get: () => ({
      title: 'Update Listing | OvikaLiving',
      description: 'Update your PG or property listing details on OvikaLiving.',
      keywords: 'update listing, edit PG, OvikaLiving dashboard',
      og: { type: 'website', image: DEFAULT_IMG },
    }),
  },
];

export default function SeoManager() {
  const location = useLocation();
  const path = location.pathname;

  // Exact match
  let seo = SEO_ROUTES[path];

  // Prefix match
  if (!seo) {
    for (const p of PREFIX_SEO) {
      if (path.startsWith(p.prefix)) {
        seo = p.get();
        break;
      }
    }
  }

  // Ultimate fallback
  if (!seo) {
    seo = {
      title: 'OvikaLiving — Smart Stays, PG & Rentals in Delhi NCR',
      description: 'OvikaLiving offers verified PG, co-living, furnished apartments and nightly stays across Delhi NCR. No brokerage. Instant booking.',
      keywords: 'OvikaLiving, PG Noida, furnished apartment, nightly stay Delhi NCR',
      og: { type: 'website', image: DEFAULT_IMG },
    };
  }

  const canonical = `${SITE_URL}${path === '/' ? '' : path}`;

  return (
    <Helmet>
      {/* Primary */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content={seo.og?.type || 'website'} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={seo.og?.image || DEFAULT_IMG} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.og?.image || DEFAULT_IMG} />

      {/* Structured Data (JSON-LD) */}
      {seo.schema && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            ...seo.schema,
            ...(seo.schema['@type'] === 'Organization' ? {} : { name: seo.title, url: canonical }),
          })}
        </script>
      )}

      {/* Default Organization Schema on every page */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'OvikaLiving',
          url: SITE_URL,
          logo: LOGO_URL,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-9319392227',
            contactType: 'customer support',
            areaServed: 'IN',
            availableLanguage: ['English', 'Hindi'],
          },
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Noida',
            addressRegion: 'Uttar Pradesh',
            addressCountry: 'IN',
          },
        })}
      </script>
    </Helmet>
  );
}
