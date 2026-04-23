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

const BASE = "https://www.ovikaliving.com";

const imageGalleryJsonLd = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  "name": "OvikaLiving Property & Co-Living Gallery — Noida, Greater Noida, Delhi NCR",
  "description": "Browse OvikaLiving's verified property gallery: furnished apartments, co-living spaces, PG rooms, luxury stays, and smart rentals across Noida, Greater Noida, and Delhi NCR.",
  "url": BASE + "/",
  "image": [
    { "@type": "ImageObject", "contentUrl": BASE + "/home1.png", "name": "OvikaLiving Furnished Apartment Noida", "description": "Premium furnished apartment available for nightly and monthly rental on OvikaLiving, Noida.", "width": 1200, "height": 800, "representativeOfPage": true },
    { "@type": "ImageObject", "contentUrl": BASE + "/home2.png", "name": "Modern Co-Living Space Noida", "description": "Spacious co-living common area designed for working professionals in Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/home3.png", "name": "OvikaLiving Smart Stay Interior", "description": "Stylishly furnished smart stay room interior offered by OvikaLiving in Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/home1desktop.jpeg", "name": "OvikaLiving Furnished Apartment Hero", "description": "Hero banner showcasing OvikaLiving's furnished apartment options in Noida NCR.", "width": 1440, "height": 810 },
    { "@type": "ImageObject", "contentUrl": BASE + "/home2desktop.png", "name": "Modern Studio Apartment Noida", "description": "Fully furnished modern studio apartment for short-term and monthly rental in Noida.", "width": 1440, "height": 810 },
    { "@type": "ImageObject", "contentUrl": BASE + "/home6.png", "name": "OvikaLiving Living Room Setup", "description": "Contemporary living room interior in an OvikaLiving managed property, Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/homeluxe1.png", "name": "OvikaLiving Luxury Apartment Interior", "description": "Luxury apartment interior showcasing premium furnishings and design at OvikaLiving.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/apartment1.jpeg", "name": "Fully Furnished Apartment Noida", "description": "Fully furnished apartment available for rent on OvikaLiving in Noida, UP.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/apartmnet2.png", "name": "Premium Furnished Apartment Greater Noida", "description": "Premium furnished apartment in Greater Noida available for monthly and nightly rental.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/colivingspace.jpeg", "name": "Co-Living Space Noida Working Professionals", "description": "Modern co-living space in Noida, ideal for working professionals and students.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/colivingol.png", "name": "OvikaLiving Co-Living Common Area", "description": "Vibrant co-living common area at OvikaLiving property in Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/colivingmodel.png", "name": "Modern Co-Living Setup Noida", "description": "Contemporary co-living model room setup available on OvikaLiving platform.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/pg1.jpeg", "name": "Verified PG Room Noida", "description": "Verified paying guest (PG) room with modern amenities in Noida, available on OvikaLiving.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/pg2.jpeg", "name": "PG Room with Attached Bathroom Noida", "description": "PG accommodation with attached bathroom and AC in Noida on OvikaLiving.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/pg3.png", "name": "Affordable PG for Working Professionals Noida", "description": "Affordable PG rooms for working professionals in Noida starting from ₹8,000/month.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/pglivingspace.jpeg", "name": "PG Living Space Noida OvikaLiving", "description": "Comfortable PG living space with all amenities in Noida offered by OvikaLiving.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/b1.jpeg", "name": "Furnished Bedroom Noida PG", "description": "Fully furnished bedroom in a PG accommodation in Noida, listed on OvikaLiving.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/b2.jpg", "name": "Double Occupancy Bedroom PG Noida", "description": "Double occupancy bedroom with wardrobe and study table at PG in Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/b3.jpeg", "name": "Single Occupancy Bedroom PG Noida", "description": "Single occupancy furnished bedroom with AC and WiFi in Noida PG.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/b4.jpg", "name": "Premium Bedroom Furnished Apartment Noida", "description": "Premium bedroom in a fully furnished apartment available for rent in Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/b5.jpg", "name": "AC Bedroom PG Noida OvikaLiving", "description": "Air-conditioned bedroom at verified PG in Noida, bookable on OvikaLiving.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/l1.png", "name": "Luxury Stay Bedroom Noida", "description": "Elegantly designed bedroom in a luxury stay property listed on OvikaLiving Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/l3.png", "name": "Luxury Living Space Noida OvikaLiving", "description": "Luxury living space with premium decor and furnishings in Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/l4.png", "name": "Premium Apartment Interior Noida", "description": "Premium apartment interior showcasing high-quality furnishings in Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/l5.png", "name": "Luxury Furnished Apartment Greater Noida", "description": "Luxury furnished apartment in Greater Noida with modern kitchen and living area.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/ol.jpeg", "name": "OvikaLiving Signature Property", "description": "OvikaLiving signature property showcasing premium hospitality standards.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/ol.png", "name": "OvikaLiving Smart Stay Room", "description": "Smart stay room at OvikaLiving property in Noida with all modern facilities.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/ol1.png", "name": "OvikaLiving Property Interior", "description": "Interior view of an OvikaLiving managed property in Noida NCR.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/siki1.png", "name": "OvikaLiving Property Noida Exterior View", "description": "Exterior view of an OvikaLiving listed property in Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/siki2.png", "name": "OvikaLiving Property Room Noida", "description": "Furnished room at OvikaLiving property in Noida with balcony access.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/siki3.png", "name": "OvikaLiving Kitchen Noida Property", "description": "Fully equipped kitchen in an OvikaLiving furnished apartment in Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/siki4.png", "name": "OvikaLiving Bathroom Noida Property", "description": "Modern attached bathroom at an OvikaLiving property in Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/novi1.png", "name": "Noida Smart Rental Property OvikaLiving", "description": "Smart rental property in Noida sector listed on OvikaLiving platform.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/novi2.png", "name": "Furnished Studio Apartment Noida", "description": "Furnished studio apartment in Noida ideal for working professionals.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/novi3.png", "name": "Modern Apartment Noida OvikaLiving", "description": "Modern apartment with premium amenities in Noida available for short and long stays.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/novi4.png", "name": "OvikaLiving Noida Property Bedroom", "description": "Spacious bedroom in a Noida OvikaLiving property with comfortable bed and storage.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/tmluxe.png", "name": "OvikaLiving Luxe Property Noida", "description": "OvikaLiving Luxe tier property offering ultra-premium stays in Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/tmluxe1.jpeg", "name": "Luxury Apartment Interior Noida OvikaLiving", "description": "Luxury apartment interior with designer furnishings and high-end appliances in Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/tmluxe2.png", "name": "OvikaLiving Luxe Room Setup", "description": "Luxe room setup with premium queen bed, smart TV and blackout curtains at OvikaLiving.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/tmluxe3.png", "name": "Premium Stay Noida OvikaLiving Luxe", "description": "OvikaLiving Luxe premium stay featuring hotel-grade amenities in Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/tmluxe22.jpg", "name": "Luxury Bedroom Noida OvikaLiving", "description": "Elegantly designed luxury bedroom in OvikaLiving Luxe category property.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/tmluxe44.png", "name": "High-End Furnished Room Noida", "description": "High-end furnished room with premium bedding and decor at OvikaLiving Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/TMhive1.png", "name": "OvikaLiving TM Hive Co-Living Noida", "description": "TM Hive co-living community space by OvikaLiving for young professionals in Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/Luxe.png", "name": "OvikaLiving Luxe Accommodation Noida", "description": "OvikaLiving Luxe accommodation showcase — top-tier rentals in Noida NCR.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/locationluxe3.png", "name": "OvikaLiving Luxe Property Location Noida", "description": "Prime location luxe property in Noida sector area, listed on OvikaLiving.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/r1.png", "name": "Furnished Room Short-Term Rental Noida", "description": "Furnished room available for short-term nightly rental in Noida on OvikaLiving.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/r2.png", "name": "Studio Room PG Noida OvikaLiving", "description": "Studio room in a PG accommodation in Noida with all amenities included.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/r3.png", "name": "Single Room Rental Noida", "description": "Single occupancy room for rent in Noida, no brokerage, instant booking on OvikaLiving.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/r4.png", "name": "Double Room Furnished Noida", "description": "Double occupancy furnished room in Noida with wardrobe, WiFi, and AC.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/p1.png", "name": "OvikaLiving Property Image Noida 1", "description": "Featured property image from OvikaLiving's Noida portfolio.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/p2.png", "name": "OvikaLiving Property Image Noida 2", "description": "Verified property interior from OvikaLiving's managed accommodation in Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/p3.png", "name": "OvikaLiving Property Image Noida 3", "description": "Spacious property room from OvikaLiving's short-term rental catalog in Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/p4.png", "name": "OvikaLiving Property Image Noida 4", "description": "Premium property view from OvikaLiving's curated rental listings in Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/f1.png", "name": "Furnished Apartment Facility Noida", "description": "Fully equipped apartment facility — kitchen, WiFi, AC — at OvikaLiving Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/f2.png", "name": "Co-Living Facility OvikaLiving Noida", "description": "Co-living facility amenities including laundry and common area at OvikaLiving.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/f3.png", "name": "Smart Stay Amenity Noida OvikaLiving", "description": "Smart stay amenity setup including high-speed WiFi and smart locks at OvikaLiving.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/after_bedroom.png", "name": "Renovated Bedroom After OvikaLiving Makeover", "description": "After OvikaLiving property makeover — beautifully renovated bedroom ready for guests.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/after_new.png", "name": "Property After Renovation OvikaLiving", "description": "Fully renovated property room after OvikaLiving's professional upgrade service.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/washroom_after.png", "name": "Modern Washroom After Renovation Noida", "description": "Renovated modern washroom at OvikaLiving property — clean, hygienic, and well-equipped.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/tm2newimage.jpeg", "name": "OvikaLiving Property Noida Interior", "description": "Interior photo of a new OvikaLiving managed property available for booking in Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/tm3image.jpeg", "name": "Furnished Property Interior Noida", "description": "Furnished interior of an OvikaLiving property in Noida showcasing modern design.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/tm5.png", "name": "OvikaLiving Property Exterior Noida", "description": "Exterior view of an OvikaLiving property in Noida with secure entry.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/main.png", "name": "OvikaLiving Main Property Banner Noida", "description": "Main property showcase banner for OvikaLiving's rental listings in Noida NCR.", "width": 1440, "height": 810 },
    { "@type": "ImageObject", "contentUrl": BASE + "/newnew.jpeg", "name": "New OvikaLiving Property Noida", "description": "Newly listed property on OvikaLiving — verified, furnished, ready to book in Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/home3rents1.png", "name": "Rental Property OvikaLiving Noida 1", "description": "Featured rental property interior on OvikaLiving platform in Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/home3rents2.png", "name": "Rental Property OvikaLiving Noida 2", "description": "Monthly rental property room available on OvikaLiving in Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/home3rents3.png", "name": "Rental Property OvikaLiving Noida 3", "description": "Short-term rental property room available for nightly booking on OvikaLiving.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/home3rents4.png", "name": "Rental Property OvikaLiving Noida 4", "description": "Verified rental property with premium furnishings listed on OvikaLiving Noida.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/mission.jpeg", "name": "OvikaLiving Mission — Quality Urban Living Noida", "description": "OvikaLiving's mission: deliver quality verified urban living spaces across Noida NCR.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/self-verified.jpeg", "name": "OvikaLiving Self-Verified Property Badge", "description": "OvikaLiving's self-verified property certification ensuring quality and safety for tenants.", "width": 800, "height": 600 },
    { "@type": "ImageObject", "contentUrl": BASE + "/verifyimage.png", "name": "OvikaLiving Verified Property Seal", "description": "Verified property seal by OvikaLiving guaranteeing quality, hygiene and accurate listing.", "width": 800, "height": 600 },
    { "@type": "ImageObject", "contentUrl": BASE + "/home3owner1.png", "name": "Property Owner Testimonial OvikaLiving 1", "description": "Happy property owner who listed on OvikaLiving platform in Noida.", "width": 800, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/home3owner2.png", "name": "Property Owner Testimonial OvikaLiving 2", "description": "Satisfied landlord sharing their experience with OvikaLiving property management.", "width": 800, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/home3owner3.png", "name": "Property Owner Testimonial OvikaLiving 3", "description": "Property owner benefiting from OvikaLiving's no-brokerage rental model.", "width": 800, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/home3owner4.png", "name": "Property Owner Testimonial OvikaLiving 4", "description": "Landlord with OvikaLiving earning guaranteed rental income in Noida.", "width": 800, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/ovikaliving_logo_clean.png", "name": "OvikaLiving Logo", "description": "Official OvikaLiving logo — premium rental and co-living brand by Townmanor Technologies.", "width": 300, "height": 60 },
    { "@type": "ImageObject", "contentUrl": BASE + "/careerdesktop.png", "name": "OvikaLiving Careers Desktop Banner", "description": "OvikaLiving careers page banner — join our team building the future of urban living.", "width": 1440, "height": 720 },
    { "@type": "ImageObject", "contentUrl": BASE + "/landlord.png", "name": "Landlord Partner OvikaLiving Noida", "description": "Landlord partner with OvikaLiving — list your property, earn guaranteed rental income.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/landlord1.png", "name": "Property Owner OvikaLiving Platform", "description": "Property owner using OvikaLiving's digital platform to manage rental listings.", "width": 1200, "height": 800 },
    { "@type": "ImageObject", "contentUrl": BASE + "/landlord2.png", "name": "Landlord Success Story OvikaLiving", "description": "Successful landlord earning passive income by listing on OvikaLiving in Noida.", "width": 1200, "height": 800 }
  ]
};

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
        <script type="application/ld+json">{JSON.stringify(imageGalleryJsonLd)}</script>
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
