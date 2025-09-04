import React, { useEffect, useState } from 'react'
import TranquilPerch from './TranquilPerch'
import AboutPlace from './AboutPlace'
import Amenities from './Amenities'
import LocationMap from './LocationMap'
import GuestReviews from './GuestReviews'
import ReviewsSurroundings from './ReviewsSurroundings'
import { useParams } from 'react-router-dom'


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
        const response = await fetch(`https://townmanor.ai/api/properties/${id}`);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const data = await response.json();
        if (isMounted) {
          const resolved = data && typeof data === 'object' && !Array.isArray(data)
            ? (data.property ?? data)
            : null;
          setProperty(resolved);
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
  const amenities = Array.isArray(property.amenities) ? property.amenities : (Array.isArray(property.AMENITIES) ? property.AMENITIES : []);
  const keyFeatures = Array.isArray(property.key_features) ? property.key_features : (Array.isArray(property.KEY_FEATURES) ? property.KEY_FEATURES : []);
  const latitude = property.latitude ?? property.LATITUDE;
  const longitude = property.longitude ?? property.LONGITUDE;
  const name = property.name ?? property.NAME;
  const pricePerNight = property.per_night_price ?? property.PER_NIGHT_PRICE;
  const description = property.description ?? property.DESCRIPTION;
  const address = property.address ?? property.ADDRESS;
  const area = property.area ?? property.AREA;

  return (
    <>
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
      <LocationMap latitude={latitude ? String(latitude) : ''} longitude={longitude ? String(longitude) : ''} address={address} />
      <ReviewsSurroundings />
      <GuestReviews />
    </>
  )
}

export default ThirdMain