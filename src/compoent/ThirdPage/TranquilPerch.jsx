
import React, { useEffect, useState } from "react";
import "./TranquilPerch.css";
import { MdOutlineContentCopy } from "react-icons/md";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router";

export default function TranquilPerch({
  title,
  pricePerNight,
  mainImage,
  sideImages = [],
  id,
}) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const images = [mainImage, ...(sideImages || [])];

  // Detect window resize to switch layout dynamically
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScroll = (event) => {
    const scrollLeft = event.target.scrollLeft;
    const width = event.target.clientWidth;
    const index = Math.round(scrollLeft / width);
    setCurrentIndex(index);
  };

  const handleBookNow = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login", { state: { from: `/tmluxespecific/${id}` } });
      return;
    }
    localStorage.setItem("property_id", id);
    navigate("/payment");
  };

  const handleShowMore = () => {
    if (id === 1 || id === "1") {
      window.open("https://www.ovikaliving.com/property/39", "_blank");
    } else if (id === 2 || id === "2") {
      window.open("https://www.ovikaliving.com/property/41", "_blank");
    } else if (id === 287 || id === "287") {
      window.open("https://www.ovikaliving.com/property/287", "_blank"); // TM Luxe 3 ka link — sahi link se replace karo agar alag ho
    }
  };

  const getPropertyLocation = () => {
    if (id === 2 || id === "2") return "Greater Noida Knowledge Park 3";
    if (id === 1 || id === "1") return "Noida Sector 137";
    if (id === 287 || id === "287") return "Greater Noida Sector 27, Jaypee Greens";
    return "Taxes included • Free cancellation available";
  };

  // ===========================
  // 📱 MOBILE LAYOUT (PDF style)
  // ===========================
  if (isMobile) {
    return (
      <div className="tranquil-mobile-container">
        {/* Image Slider */}
        <div className="mobile-image-slider" onScroll={handleScroll}>
          {images.map((img, index) => (
            <div className="mobile-slide" key={index}>
              <img src={img || "/image 71.png"} alt={`slide-${index}`} />
              {index === images.length - 1 && (
                <div
                  className="tranquil-mobile-showmore"
                  onClick={handleShowMore}
                >
                  <MdOutlineContentCopy size={18} /> Show more
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="mobile-dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
            ></span>
          ))}
        </div>

        {/* Details Section */}
        <div className="mobile-details">
          <h2 className="mobile-title">{title || "Property"}</h2>
          <p className="mobile-location">{getPropertyLocation()}</p>

          {/* Price Section */}
          <div className="mobile-price">
            <h3>
              ₹{pricePerNight || "2399"} <span>For 1 night</span>
            </h3>
          </div>

          {/* Reserve Button */}
          <button className="mobile-reserve-btn" onClick={handleBookNow}>
            Reserve
          </button>
        </div>

        {/* About Section */}
        <div className="mobile-about">
          <h3>About the Place</h3>
          <p>
            Experience the Epitome of Luxury — Step into a world where elegance
            meets comfort. TM Luxe apartment is crafted for travelers seeking
            sophistication, style, and unforgettable moments.
          </p>
          <button className="readmore-btn" onClick={handleShowMore}>
            Read more
          </button>
        </div>
      </div>
    );
  }

  // ===========================
  // 💻 DESKTOP LAYOUT (Original)
  // ===========================
  return (
    <>
      <div className="tranquil-perch-container">
        <div className="tranquil-perch-header">
          <h2 className="tranquil-perch-title">{title || "Property"}</h2>
          <div className="tranquil-perch-actions">
            <button className="tranquil-perch-action">
              <FaRegShareFromSquare size={20} className="luxeicon" /> Share
            </button>
            <button className="tranquil-perch-action">
              <FaRegHeart size={20} className="luxeicon" /> Save
            </button>
          </div>
        </div>

        <div className="tranquil-perch-images desktop-view">
          <div className="tranquil-perch-main-img">
            <img src={mainImage || "/image 71.png"} alt="Main room" />
          </div>

          <div className="tranquil-perch-side-imgs">
            <img src={sideImages[0] || "/image 120.png"} alt="Living space" />
            <div className="tranquil-perch-last-img">
              <img src={sideImages[1] || "/image 121.png"} alt="Workspace" />
              <div className="tranquil-perch-showmore" onClick={handleShowMore}>
                <MdOutlineContentCopy size={20} /> Show more
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="property-price-section">
        <div className="price-details">
          <h2>
            ₹{pricePerNight || "4,999"} <span>/ per night</span>
          </h2>
          <p>{getPropertyLocation()}</p>
        </div>
        <div className="book-button">
          <button className="book-now-btn" onClick={handleBookNow}>
            Book Now
          </button>
        </div>
      </div>
    </>
  );
}