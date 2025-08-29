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
        const response = await fetch(`http://localhost:3000/properties/${id}`);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const data = await response.json();
        if (isMounted) {
          setProperty(data?.property || null);
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

  const images = Array.isArray(property.IMAGES) ? property.IMAGES : [];
  const amenities = Array.isArray(property.AMENITIES) ? property.AMENITIES : [];
  const keyFeatures = Array.isArray(property.KEY_FEATURES) ? property.KEY_FEATURES : [];
  const latitude = property.LATITUDE ? String(property.LATITUDE) : '';
  const longitude = property.LONGITUDE ? String(property.LONGITUDE) : '';

  return (
    <>
      <TranquilPerch
        title={property.NAME}
        pricePerNight={property.PER_NIGHT_PRICE}
        mainImage={images[0]}
        sideImages={images.slice(1, 3)}
      />
      <AboutPlace
        description={property.DESCRIPTION}
        address={property.ADDRESS}
        area={property.AREA}
        keyFeatures={keyFeatures}
      />
      <Amenities amenities={amenities} />
      <LocationMap latitude={latitude} longitude={longitude} address={property.ADDRESS} />
      <ReviewsSurroundings />
      <GuestReviews />
    </>
  )
}

export default ThirdMain