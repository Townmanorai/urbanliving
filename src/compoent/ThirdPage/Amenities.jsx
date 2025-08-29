import React from "react";
import "./Amenities.css";
import { FaWifi, FaCar, FaDog } from "react-icons/fa";
import { MdAcUnit, MdBalcony } from "react-icons/md";
import { LuLampDesk } from "react-icons/lu";


export default function Amenities({ amenities = [] }) {
  return (
    <div className="amenities-container">
      <h2 className="amenities-heading">Amenities</h2>

      <div className="amenities-grid">
        {Array.isArray(amenities) && amenities.length > 0 ? (
          amenities.map((item, idx) => (
            <div className="amenity-item" key={idx}>
              {/* Icon mapping could be improved; defaulting to a generic set */}
              <LuLampDesk className="amenity-icon" />
              <span>{item}</span>
            </div>
          ))
        ) : (
          <div className="amenity-item">
            <LuLampDesk className="amenity-icon" />
            <span>No amenities listed</span>
          </div>
        )}
      </div>
    </div>
  );
}
