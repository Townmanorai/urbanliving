import React from "react";
import "./LocationMap.css";

export default function LocationMap({ latitude, longitude, address }) {
  const hasCoords = latitude && longitude;
  const mapSrc = hasCoords
    ? `https://www.google.com/maps?q=${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}&z=15&output=embed`
    : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14018.94922089445!2d77.437!3d28.572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce53b4d7b0d4d%3A0xb1d8f1c4fbc44a!2sSector%2081%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1699978890000!5m2!1sen!2sin";
  return (
    <div className="locationmap-container">
      <h2 className="locationmap-heading">Location on Map</h2>
      <div className="locationmap-map">
        <iframe
          title="location"
          src={mapSrc}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
        {address ? <div style={{marginTop: '8px'}}>{address}</div> : null}
      </div>
    </div>
  );
}
