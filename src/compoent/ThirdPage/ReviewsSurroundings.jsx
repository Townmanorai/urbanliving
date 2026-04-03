
import React from "react";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import "./ReviewsSurroundings.css";

const ReviewsSurroundings = ({ propertyName, nearbyLocations }) => {
  const reviews = [
    { label: "Host", rating: 4.8 },
    { label: "Comfort", rating: 4.6 },
    { label: "Cleanliness", rating: 4.9 },
    { label: "Facilities", rating: 4.5 },
  ];

  const tmLuxe1Data = [
    "Pari Chowk Metro stn 4.3kms",
    "Alpha 1 Metro stn 5kms",
    "Jaypee Greens Golf Course 4.8kms",
    "Grand Venice Mall 6.4kms",
    "Sharda Hospital 3.5kms",
    "Omaxe Connaught Place Mall 3.4kms",
    "Ansal Plaza 4.8kms",
    "Fortis Hospital 7.4 kms",
    "India Expo Centre & Mart 4.7kms"
  ];

  const tmLuxe2Data = [
    "Advant office complex 0.9kms",
    "Sector 137 Metro stn 0.5 kms",
    "Sector 142 Metro Stn 1kms",
    "Felix Hospital 0.3 kms",
    "Bio Diversity Park 0.8 kms",
    "Pari Chowk 8kms",
    "Jaypee Greens Golf course Greater Noida 9kms",
    "Jaypee greens Wish town golf course 5kms",
    "Max Super speciality hospital 5kms",
    "Sector 18 Noida Market 10kms",
    "India TV 2kms"
  ];

  // ✅ TM Luxe 3 ka data
  const tmLuxe3Data = [
    "Grand Venice Mall 1.2kms",
    "Jaypee Greens Golf Course 0.8kms",
    "Delta Metro Station 1.5kms",
    "Fortis Hospital 2.0kms",
  ];

  const surroundingsData = {
    "TM Luxe 1": tmLuxe1Data,
    "TM Luxe-1": tmLuxe1Data,
    "TM Luxe - 1": tmLuxe1Data,
    "TMLuxe1": tmLuxe1Data,
    "TM LUXE 1": tmLuxe1Data,
    "tm luxe 1": tmLuxe1Data,
    "TM Luxe - 2Suite": tmLuxe2Data,
    "TM Luxe-2Suite": tmLuxe2Data,
    "TMLuxe2Suite": tmLuxe2Data,
    "TM LUXE - 2SUITE": tmLuxe2Data,
    "tm luxe - 2suite": tmLuxe2Data,
  };

  const getSurroundings = () => {
    // ✅ Agar nearbyLocations prop aaya (TM Luxe 3) toh seedha wahi use karo
    if (nearbyLocations && nearbyLocations.length > 0) {
      return nearbyLocations;
    }

    if (propertyName && surroundingsData[propertyName]) {
      return surroundingsData[propertyName];
    }

    const lowerCaseMatch = Object.keys(surroundingsData).find(key =>
      propertyName && key.toLowerCase() === propertyName.toLowerCase()
    );
    if (lowerCaseMatch) {
      return surroundingsData[lowerCaseMatch];
    }

    if (propertyName && (
      propertyName.toLowerCase().includes('2suite') ||
      propertyName.toLowerCase().includes('2 suite') ||
      (propertyName.toLowerCase().includes('tm luxe') && propertyName.toLowerCase().includes('2'))
    )) {
      return tmLuxe2Data;
    }

    if (propertyName && (
      propertyName.toLowerCase().includes('tm luxe 1') ||
      propertyName.toLowerCase().includes('tmluxe1') ||
      propertyName.toLowerCase().includes('tm luxe-1') ||
      propertyName.toLowerCase().includes('tm luxe - 1') ||
      (propertyName.toLowerCase().includes('tm luxe') && propertyName.toLowerCase().includes('1'))
    )) {
      return tmLuxe1Data;
    }

    // ✅ Name se bhi TM Luxe 3 match karo (backup)
    if (propertyName && (
      propertyName.toLowerCase().includes('tm luxe 3') ||
      propertyName.toLowerCase().includes('tm luxe - 3') ||
      propertyName.toLowerCase().includes('tm luxe-3') ||
      (propertyName.toLowerCase().includes('tm luxe') && propertyName.toLowerCase().includes('3'))
    )) {
      return tmLuxe3Data;
    }

    return [
      "DLF Mall of India & The Great India Place",
      "Worlds of Wonder Amusement & Water Park",
      "Okhla Bird Sanctuary & Botanical Garden",
      "Film City & Cultural Centers",
    ];
  };

  const surroundings = getSurroundings();

  return (
    <div className="reviews-container">
      <div className="reviews-section">
        <h2 className="reviews-title">Reviews</h2>
        {reviews.map((item, index) => (
          <div className="review-row" key={index}>
            <span className="review-label">{item.label}</span>
            <div className="review-bar">
              <div
                className="review-fill"
                style={{ width: `${(item.rating / 5) * 100}%` }}
              ></div>
            </div>
            <FaStar className="review-star" />
            <span className="review-rating">{item.rating}</span>
          </div>
        ))}
      </div>

      <div className="surroundings-section">
        <div className="surroundings-header">
          <h2 className="surroundings-title">Nearby Locations</h2>
          <p className="surroundings-subtitle">Explore what's around you</p>
        </div>
        <div className="surroundings-container">
          {surroundings.map((place, index) => {
            const parts = place.split(' ');
            const lastPart = parts[parts.length - 1];
            // ✅ Last part distance hai ya nahi check karo
            const isDistance = /^\d/.test(lastPart) || lastPart.toLowerCase().includes('km');
            const distance = isDistance ? lastPart : '';
            const locationName = isDistance ? parts.slice(0, -1).join(' ') : place;

            return (
              <div key={index} className="location-card">
                <div className="location-icon-wrapper">
                  <FaMapMarkerAlt className="location-icon" />
                </div>
                <div className="location-details">
                  <h4 className="location-name">{locationName}</h4>
                  {distance ? <span className="location-distance">{distance}</span> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReviewsSurroundings;