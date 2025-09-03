import React, { useState, useEffect } from "react";
import "./TMFeatures.css";
import { IoArrowForward } from "react-icons/io5";
import TMFeaturesMobile from "./TMFeaturesMobile";

const TMFeatures = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return <TMFeaturesMobile />;
  }

  return (
    <div className="tm-features-root">
      <div className="tm-features-header">
        <h1 className="tm-features-title">TM features</h1>
        <p className="tm-features-subtitle" title="Our doors are open to every kind of traveler. No judgments. Just cozy rooms and kind service">
          Our doors are open to every kind of traveler. No judgments. Just cozy rooms and kind service
        </p>
      </div>

      <div className="tm-features-container">
        {/* TM Stay */}
        <div className="tm-feature-row">
          <div className="tm-feature-text">
            <h2 className="tm-feature-title">
              TM <span className="tm-feature-accent">Stay</span>
            </h2>
            <div className="tm-feature-subtitle">
              A Space That <span className="highlight">Holds</span><br />You <span className="highlight">Gently</span>
            </div>
            <p className="tm-feature-desc">
              TM Stay offers fully managed and affordable PG rentals tailored for students and working professionals. 
              With clean, secure, and comfortable living spaces, we ensure a hassle-free stay that feels just like home – only better.
            </p>
            <button className="tm-feature-button">
              Know more <IoArrowForward className="arrow-icon" />
            </button>
          </div>
          <div className="tm-feature-image">
            <img src="image 86.png" alt="TM Stay" />
          </div>
        </div>

        {/* TM Hive */}
        <div className="tm-feature-row">
          <div className="tm-feature-image">
            <img src="image 91.png" alt="TM Hive" />
          </div>
          <div className="tm-feature-text">
            <h2 className="tm-feature-title">
              TM <span className="tm-feature-accent">Hive</span>
            </h2>
            <div className="tm-feature-subtitle">
              Live together, <span className="highlight">grow</span><br /> together.
            </div>
            <p className="tm-feature-desc">
              TM Hive brings together vibrant communities in thoughtfully designed shared spaces. 
              Whether you're a young professional, a remote worker, or a creative soul, our co-living 
              homes offer the perfect blend of privacy, social, and flexibility.
            </p>
            <button className="tm-feature-button">
              Know more <IoArrowForward className="arrow-icon" />
            </button>
          </div>
        </div>

        {/* TM Luxe */}
        <div className="tm-feature-row">
          <div className="tm-feature-text">
            <h2 className="tm-feature-title">
              TM <span className="tm-feature-accent">Luxe</span>
            </h2>
            <div className="tm-feature-subtitle">
              More Than <span className="highlight">Service</span> — <br />We Offer Care
            </div>
            <p className="tm-feature-desc">
              TM Luxe offers high-end, fully serviced apartments for those who value elegance, comfort, and privacy. 
              With sophisticated interiors, modern amenities, and prime locations, TM Luxe is crafted for those 
              seeking a luxurious living experience.
            </p>
            <button className="tm-feature-button">
              Know more <IoArrowForward className="arrow-icon" />
            </button>
          </div>
          <div className="tm-feature-image">
            <img src="image 87.png" alt="TM Luxe" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TMFeatures;