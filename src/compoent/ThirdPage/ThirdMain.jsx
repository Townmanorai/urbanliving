
import React, { useEffect, useState } from 'react'
import TranquilPerch from './TranquilPerch'
import AboutPlace from './AboutPlace'
import Amenities from './Amenities'
import LocationMap from './LocationMap'
import GuestReviews from './GuestReviews'
import ReviewsSurroundings from './ReviewsSurroundings'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'

// Ovika API wale property IDs
const OVIKA_IDS = [287, 77, 78, 79];

// ✅ TM Luxe 3 mein YEH amenities NAHI dikhni chahiye
const TM3_EXCLUDED_AMENITIES = [
  'washing machine',
  'dishwasher',
  'borewell',
  'inverter',
  'gas stove',
  'smart home',
  'smart home tech',
];

// ✅ TM Luxe 3 ke nearby locations (distance ke saath)
const TM3_NEARBY_LOCATIONS = [
  "Grand Venice Mall 1.2kms",
  "Jaypee Greens Golf Course 0.8kms",
  "Delta Metro Station 1.5kms",
  "Fortis Hospital 2.0kms",
];

function ThirdMain() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [property, setProperty] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchProperty() {
      setIsLoading(true);
      setError(null);
      try {
        const numId = Number(id);

        if (OVIKA_IDS.includes(numId)) {
          // ── Ovika API se fetch (id: 287 = TM Luxe 3) ──
          const response = await fetch(`https://www.townmanor.ai/api/ovika/properties/${numId}`);
          if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
          const json = await response.json();

          if (isMounted) {
            const raw = json?.data ?? json;
            setProperty({
              id: raw.id,
              name: raw.property_name,
              description: raw.description,
              address: raw.address,
              city: raw.city,
              area: raw.area,
              images: Array.isArray(raw.photos) ? raw.photos : [],
              amenities: Array.isArray(raw.amenities) ? raw.amenities : [],
              key_features: [],
              latitude: raw.latitude,
              longitude: raw.longitude,
              per_night_price: raw.price ?? raw.base_rate ?? 4000,
              base_rate: raw.base_rate,
            });
          }
        } else {
          // ── Purani API se fetch (TM Luxe 1 & 2) ──
          const response = await fetch(`https://www.townmanor.ai/api/properties/${id}`);
          if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
          const data = await response.json();
          if (isMounted) {
            const resolved = data && typeof data === 'object' && !Array.isArray(data)
              ? (data.property ?? data)
              : null;
            
            // Format price for consistent usage
            if (resolved) {
              resolved.per_night_price = resolved.price ?? resolved.base_rate ?? resolved.per_night_price;
            }
            setProperty(resolved);
          }
        }
      } catch (err) {
        if (isMounted) setError(err?.message || 'Failed to load property');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    if (id) fetchProperty();
    return () => { isMounted = false };
  }, [id]);

  if (isLoading) {
    return <div style={{ padding: '24px' }}>Loading property...</div>
  }

  if (error) {
    return <div style={{ padding: '24px', color: 'red' }}>Error: {error}</div>
  }

  if (!property) {
    return <div style={{ padding: '24px' }}>No property found.</div>
  }

  const images = Array.isArray(property.images) ? property.images : (Array.isArray(property.IMAGES) ? property.IMAGES : []);
  const rawAmenities = Array.isArray(property.amenities) ? property.amenities : (Array.isArray(property.AMENITIES) ? property.AMENITIES : []);
  const keyFeatures = Array.isArray(property.key_features) ? property.key_features : (Array.isArray(property.KEY_FEATURES) ? property.KEY_FEATURES : []);
  const latitude = property.latitude ?? property.LATITUDE;
  const longitude = property.longitude ?? property.LONGITUDE;
  const name = property.name ?? property.NAME;
  const pricePerNight = property.per_night_price ?? property.PER_NIGHT_PRICE ?? property.price ?? property.base_rate;

  const description = property.description ?? property.DESCRIPTION;
  const address = property.address ?? property.ADDRESS;
  const area = property.area ?? property.AREA;

  const isTM3 = Number(id) === 287;

  // ✅ TM Luxe 3 ke liye excluded amenities filter karo
  const amenities = isTM3
    ? rawAmenities.filter(
        (a) => !TM3_EXCLUDED_AMENITIES.some(
          (ex) => (typeof a === 'string' ? a : a?.name ?? a?.label ?? '').toLowerCase().includes(ex)
        )
      )
    : rawAmenities;

  // ✅ TM Luxe 3 ke liye nearby locations
  const nearbyLocations = isTM3 ? TM3_NEARBY_LOCATIONS : undefined;

  // ── Reviews ──
  const luxe1Reviews = [
    { id: 1, name: 'Akshay', time: 'August 2025 ', img: '/r4.png', review: 'We had an amazing experience at Townmanor, and a big thank you to the owner for making it feel like our second home. The place is beautifully designed, peaceful, and thoughtfully maintained. We were the very first guests to stay here, which made our visit even more special. The owner was extremely kind and accommodating — allowing us an early check-in which made our arrival smooth and comfortable. Every corner of the home reflects warmth and care. Truly a hidden gem and a perfect getaway spot. Highly recommended for anyone looking for a cozy, welcoming stay!' },
    { id: 5, name: 'Riya Tanwar', time: '2 weeks ago', img: '/r1.png', review: 'We had an amazing experience at Townmanor — it truly felt like our second home. The interiors are beautifully designed, peaceful, and thoughtfully maintained. The owner was extremely kind and even allowed us an early check-in which made everything easy. Every corner of the home reflects warmth and care. Highly recommended!' },
    { id: 2, name: 'Parvesh Verma', time: '2 days ago', img: '/r2.png', review: "Townmanor is a hidden gem! The vibe is so cozy and welcoming, and the attention to detail is visible everywhere. From spotless rooms to the peaceful neighborhood — everything exceeded expectations. Definitely a place I'd love to return to soon" },
    { id: 3, name: 'Anil Kumar', time: '1 month ago', img: '/r3.png', review: "Staying at Townmanor was one of the best travel decisions I've made. The host's hospitality, quick responses, and little touches around the house made the stay super comfortable. The beds were amazing, and it really felt like home away from home." },
  ];

  const luxe2Reviews = [
    { id: 1, name: 'pradeep', time: 'August 2025', img: '/r1.png', review: `I had an amazing two-night stay at this beautiful property! The space was spotless, very comfortable, and exactly as described in the listing. The host was incredibly welcoming and responsive throughout. I especially loved the cozy ambiance and thoughtful touches like fresh towels and tea coffee supplies and breakfast. The location is ideal for everyone because it is near the metro and offers easy access to Ola, Uber, and a variety of restaurants and shopping malls. I would absolutely recommend this place to anyone visiting, and I'd love to come back again!` },
    { id: 2, name: 'Rahul Aggarwal', time: '3 days ago', img: '/r2.png', review: `Such a peaceful and relaxing stay! The house is maintained so beautifully, and the attention to detail is commendable. It felt like a boutique hotel with the warmth of a family home. I would love to come back soon.` },
    { id: 3, name: 'Neha Kapoor', time: '2 weeks ago', img: '/r3.png', review: `From the moment we entered, Townmanor felt so welcoming. The greenery around, the calm vibe, and the well-kept interiors made the stay memorable. The owner was responsive and made everything smooth for us.` },
    { id: 4, name: 'Arjun Malhotra', time: '4 weeks ago', img: '/r4.png', review: `Townmanor is a true hidden gem! It gave us the perfect weekend getaway. The rooms were spotless, beds very comfortable, and the entire place had a luxurious yet cozy feel. Highly recommend for couples or families.` },
  ];

  const luxe3Reviews = [
    { id: 1, name: 'Siddharth Mehra', time: 'February 2026', img: '/r1.png', review: 'TM Luxe 3 is absolutely stunning! The view of the golf course from the balcony is breathtaking. The studio is spacious, well-equipped, and the kitchen was perfect for our extended stay. Highly recommended for anyone visiting Greater Noida.' },
    { id: 2, name: 'Priya Sharma', time: '1 week ago', img: '/r2.png', review: 'A super luxurious experience! The 710 sq ft studio felt like a boutique hotel suite. The dining counter with high chairs, modern toilet, and all the amenities made our stay unforgettable. Will definitely return!' },
    { id: 3, name: 'Rohit Bhatia', time: '3 weeks ago', img: '/r3.png', review: 'Exceptional property in a premium location. Overlooking Jaypee Greens resort and the stadium was such a treat. The place is immaculate and very well-maintained. Google TV and Wi-Fi worked great throughout our stay.' },
    { id: 4, name: 'Anjali Gupta', time: '1 month ago', img: '/r4.png', review: 'Self check-in was smooth and the studio was exactly as shown. The kitchen was fully fitted, beds very comfortable and the overall vibe was premium. Great value for money and a fantastic location in Sector 27.' },
  ];

  const lowerName = (name || '').toLowerCase();
  const selectedReviews = 
    lowerName.includes('tm luxe - 2') || lowerName.includes('tm luxe 2') || lowerName.includes('ovika signature 2')
    ? luxe2Reviews
    : lowerName.includes('tm luxe - 1') || lowerName.includes('tm luxe 1') || lowerName.includes('ovika signature 1')
      ? luxe1Reviews
      : lowerName.includes('tm luxe - 3') || lowerName.includes('tm luxe 3') || lowerName.includes('ovika signature 3')
        ? luxe3Reviews
        : undefined;

  const seoDescription = `Experience luxury co-living at ${name} in Noida. ${(description || '').substring(0, 155)}...`;
  const seoKeywords = `Co-living spaces Noida, Shared accommodation Greater Noida, Modern co-living Noida, Community living Noida, Flexible co-living Noida, Co-working and living Noida, Luxury serviced apartments Noida, Premium stay Noida, High-end short-term rentals Greater Noida, Executive accommodation Noida, Corporate serviced apartments Noida, Best serviced apartments Noida for business, Noida staycation luxury, Furnished PG Noida, PG accommodation Noida, Paying guest Greater Noida, Student accommodation Noida, Affordable PG Noida with amenities, Best PG in Noida Sector, ${name}`;

  return (
    <>
      <Helmet>
        <title>{name} | Premium Co-Living & Serviced Apartments in Noida</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://www.ovikaliving.com/tmluxespecific/${id}`} />
        <meta name="author" content="OvikaLiving" />
        <meta name="language" content="en" />
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Noida" />
        <meta name="geo.position" content="28.5355;77.3910" />
        <meta name="ICBM" content="28.5355, 77.3910" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${name} | Premium Co-Living in Noida`} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={`https://www.ovikaliving.com/tmluxespecific/${id}`} />
        <meta property="og:site_name" content="OvikaLiving" />
        <meta property="og:image" content={images[0] || 'https://www.ovikaliving.com/ovikalivinglogonew.png'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@OvikaLiving" />
        <meta name="twitter:title" content={`${name} | Premium Co-Living in Noida`} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={images[0] || 'https://www.ovikaliving.com/ovikalivinglogonew.png'} />
      </Helmet>

      <TranquilPerch
        title={name}
        pricePerNight={pricePerNight}
        mainImage={images[0]}
        sideImages={images.slice(1, 3)}
        id={property.id}
      />
      <AboutPlace
        description={description}
        address={address}
        area={area}
        keyFeatures={keyFeatures}
      />
      <Amenities amenities={amenities} />
      <LocationMap
        latitude={latitude ? String(latitude) : ''}
        longitude={longitude ? String(longitude) : ''}
        address={address}
      />
      {/* ✅ TM Luxe 3 ke liye custom nearby locations pass ho rahe hain */}
      <ReviewsSurroundings
        propertyName={name}
        nearbyLocations={nearbyLocations}
      />
      <GuestReviews reviews={selectedReviews} />
    </>
  )
}

export default ThirdMain