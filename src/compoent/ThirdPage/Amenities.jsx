import React from "react";
import "./Amenities.css";
import { FaWifi, FaCar, FaDog, FaTv, FaTint } from "react-icons/fa";
import {
  MdAcUnit,
  MdBalcony,
  MdKitchen,
  MdLocalLaundryService,
  MdMicrowave,
} from "react-icons/md";
import { LuLampDesk } from "react-icons/lu";


// Choose an icon based on amenity name (case-insensitive, keyword based)
const getAmenityIcon = (amenityName = "") => {
  const name = String(amenityName).toLowerCase();

  if (name.includes("wifi") || name.includes("wi-fi")) return <FaWifi className="amenity-icon" />;
  if (name === "ac" || name.includes("air") || name.includes("conditioning"))
    return <MdAcUnit className="amenity-icon" />;
  if (name.includes("parking") || name.includes("car park")) return <FaCar className="amenity-icon" />;
  if (name.includes("pet") || name.includes("dog")) return <FaDog className="amenity-icon" />;
  if (name.includes("balcony")) return <MdBalcony className="amenity-icon" />;
  if (name.includes("tv")) return <FaTv className="amenity-icon" />;
  if (name.includes("laundry") || name.includes("washing"))
    return <MdLocalLaundryService className="amenity-icon" />;
  if (name.includes("microwave")) return <MdMicrowave className="amenity-icon" />;
  if (
    name.includes("refrigerator") ||
    name.includes("fridge") ||
    name.includes("toaster") ||
    name.includes("kettle") ||
    name.includes("coffee") ||
    name.includes("hob") ||
    name.includes("chimney") ||
    name.includes("kitchen")
  )
    return <MdKitchen className="amenity-icon" />;
  if (name.includes("ro") || name.includes("water") || name.includes("geyser"))
    return <FaTint className="amenity-icon" />;

  return <LuLampDesk className="amenity-icon" />; // fallback icon
};

export default function Amenities({ amenities = [] }) {
  return (
    <div className="amenities-container">
      <h2 className="amenities-heading">Amenities</h2>

      <div className="amenities-grid">
        {Array.isArray(amenities) && amenities.length > 0 ? (
          amenities.map((item, idx) => (
            <div className="amenity-item" key={idx}>
              {getAmenityIcon(item)}
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
