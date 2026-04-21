import React from 'react'
import { Helmet } from 'react-helmet'
import HomePageNew1 from './HomePageNew1'
import HomePageNew2 from './HomePageNew2'
import Home3 from "../HomePageNew/Home3"
import Home7 from "../HomePageNew/Home7"
import Home2 from "../HomePageNew/Home2"
import Home6 from "../HomePageNew/Home6"
import HomeReviews from "../HomePageNew/HomeReviews"
import InspirationSection from './InspirationSection'

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.ovikaliving.com/#website",
      "url": "https://www.ovikaliving.com/",
      "name": "OvikaLiving",
      "description": "Premium short-term rentals, PG, co-living & furnished apartments in Noida, Greater Noida, Delhi & Gurugram.",
      "publisher": { "@id": "https://www.ovikaliving.com/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": { "@type": "EntryPoint", "urlTemplate": "https://www.ovikaliving.com/properties?search={search_term_string}" },
        "query-input": "required name=search_term_string"
      },
      "inLanguage": "en-IN"
    },
    {
      "@type": "Organization",
      "@id": "https://www.ovikaliving.com/#organization",
      "name": "OvikaLiving",
      "legalName": "Townmanor Technologies Pvt. Ltd.",
      "url": "https://www.ovikaliving.com/",
      "logo": { "@type": "ImageObject", "url": "https://www.ovikaliving.com/ovikaliving_logo_clean.png", "width": 300, "height": 60 },
      "contactPoint": { "@type": "ContactPoint", "contactType": "customer support", "areaServed": "IN", "availableLanguage": ["en", "hi"] },
      "sameAs": ["https://www.townmanor.ai/"],
      "address": { "@type": "PostalAddress", "addressLocality": "Noida", "addressRegion": "Uttar Pradesh", "addressCountry": "IN" }
    },
    {
      "@type": "WebPage",
      "@id": "https://www.ovikaliving.com/",
      "url": "https://www.ovikaliving.com/",
      "name": "OvikaLiving — Short-Term Rentals, PG & Co-Living in Noida, Greater Noida, Delhi, Gurugram",
      "description": "Find verified PG, co-living spaces, furnished apartments & nightly stays in Noida, Greater Noida, Delhi & Gurugram. OvikaLiving offers flexible smart stays — no brokerage, instant booking.",
      "isPartOf": { "@id": "https://www.ovikaliving.com/#website" },
      "about": { "@id": "https://www.ovikaliving.com/#organization" },
      "inLanguage": "en-IN"
    },
    {
      "@type": "RealEstateAgent",
      "name": "OvikaLiving",
      "url": "https://www.ovikaliving.com/",
      "description": "OvikaLiving is the hybrid rental & urban living brand of Townmanor Technologies Pvt. Ltd. — offering verified short-term stays, PG accommodations, co-living spaces, and furnished apartments across NCR.",
      "areaServed": [
        { "@type": "City", "name": "Noida" },
        { "@type": "City", "name": "Greater Noida" },
        { "@type": "City", "name": "Delhi" },
        { "@type": "City", "name": "Gurugram" }
      ]
    }
  ]
};

export const HomePageNewMain = () => {
  return (
    <>
      <Helmet>
        <title>OvikaLiving — Smart Stays, PG & Co-Living in Noida, Greater Noida, Delhi | Book Now</title>
        <meta name="description" content="Find verified PG, co-living spaces, furnished apartments & nightly stays across NCR on OvikaLiving. Best short-term rentals in Noida, Greater Noida, Delhi & Gurugram. No brokerage. Instant booking. Flexible stays for working professionals, students & corporates." />
        <meta name="keywords" content="ovikaliving, short term rental noida, pg noida, co living noida, furnished apartment noida, nightly stays noida, smart stays noida, premium pg noida, furnished flat noida, monthly rental noida, co living greater noida, pg greater noida, signature stays noida, hotel noida, serviced apartment noida, working professional pg noida, pg for students noida, pg with wifi noida, pg with food noida, pg with ac noida, co living spaces noida, short stay noida, nightly rental noida, urban living noida, flexible rental noida, no brokerage pg noida, verified pg noida, ovika signature stays, luxury apartment noida, premium apartment noida, economy stay noida, pg sector 62 noida, pg sector 63 noida, pg sector 18 noida, ovikaliving signature, townmanor technologies, short stay greater noida, furnished apartment greater noida, monthly rentals noida, pg under 10000 noida, pg under 15000 noida, pg under 20000, affordable pg noida, best pg noida 2024, top co living spaces noida, noida short term accommodation, paying guest noida, single occupancy noida, double occupancy noida, pg near metro noida, nightly pg noida, hybrid rental noida, student accommodation noida, corporate housing noida, serviced flat noida, नोएडा में पीजी, को लिविंग नोएडा, किराये का कमरा नोएडा, शॉर्ट स्टे नोएडा, फर्निश्ड फ्लैट नोएडा" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://www.ovikaliving.com/" />
        <meta name="author" content="OvikaLiving — Townmanor Technologies Pvt. Ltd." />
        <meta name="language" content="en" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="3 days" />
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Noida, Uttar Pradesh" />
        <meta name="geo.position" content="28.5355;77.3910" />
        <meta name="ICBM" content="28.5355, 77.3910" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="OvikaLiving — Smart Stays, PG & Co-Living in Noida & NCR | No Brokerage" />
        <meta property="og:description" content="Verified PG, co-living, furnished apartments & nightly stays in Noida, Greater Noida, Delhi & Gurugram. Flexible, affordable, instant booking — OvikaLiving." />
        <meta property="og:url" content="https://www.ovikaliving.com/" />
        <meta property="og:site_name" content="OvikaLiving" />
        <meta property="og:image" content="https://www.ovikaliving.com/og-homepage.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="OvikaLiving — Smart Stays & PG in Noida" />
        <meta property="og:locale" content="en_IN" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@OvikaLiving" />
        <meta name="twitter:title" content="OvikaLiving — Smart Stays, PG & Co-Living in Noida | Book Now" />
        <meta name="twitter:description" content="Verified PG, co-living & furnished apartments in Noida, Greater Noida, Delhi & Gurugram. No brokerage. Instant booking." />
        <meta name="twitter:image" content="https://www.ovikaliving.com/og-homepage.jpg" />
        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(homeJsonLd)}</script>
      </Helmet>
      <div style={{ overflow: 'visible' }}>
        <HomePageNew1 />
        <HomePageNew2 />
        <Home3 />
        <Home7 />
        <HomeReviews />
        <Home2 />
        <Home6 />
        <InspirationSection />
      </div>
    </>
  )
}
