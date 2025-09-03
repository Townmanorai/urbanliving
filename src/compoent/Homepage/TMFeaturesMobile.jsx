import React from "react";
import "./TMFeaturesMobile.css";
import { IoArrowForward } from "react-icons/io5";

const TMFeaturesMobile = () => (
  <div className="tm-features-mobile">
    <h1 className="tm-features-mobile__title">TM features</h1>
    <p className="tm-features-mobile__subtitle">
      Our doors are open to every kind of traveler. No judgments. Just cozy rooms and kind service
    </p>

    {/* TM Stay Card */}
    <div className="tm-feature-card">
      <div className="tm-feature-card__header">
        <h2 className="tm-feature-card__title">
          TM <span className="tm-feature-card__accent">Stay</span>
        </h2>
      </div>
      <div className="tm-feature-card__image">
        <img src="image 86.png" alt="TM Stay" />
      </div>
      <div className="tm-feature-card__content">
        <h3 className="tm-feature-card__subtitle">
          A Space That <span className="highlight">Holds</span> You <span className="highlight">Gently</span>
        </h3>
        <p className="tm-feature-card__desc">
          TM Stay offers fully managed and affordable PG rentals tailored for students and working professionals. 
          With clean, secure, and comfortable living spaces, we ensure a hassle-free stay that feels just like home – only better.
        </p>
        <button className="tm-feature-button">
          Know more <IoArrowForward className="arrow-icon" />
        </button>
      </div>
    </div>

    {/* TM Hive Card */}
    <div className="tm-feature-card">
      <div className="tm-feature-card__header">
        <h2 className="tm-feature-card__title">
          TM <span className="tm-feature-card__accent">Hive</span>
        </h2>
      </div>
      <div className="tm-feature-card__image">
        <img src="image 91.png" alt="TM Hive" />
      </div>
      <div className="tm-feature-card__content">
        <h3 className="tm-feature-card__subtitle">
          Live together, <span className="highlight">grow</span> together.
        </h3>
        <p className="tm-feature-card__desc">
          TM Hive brings together vibrant communities in thoughtfully designed shared spaces. 
          Whether you're a young professional, a remote worker, or a creative soul, our co-living 
          homes offer the perfect blend of privacy, social, and flexibility.
        </p>
        <button className="tm-feature-button">
          Know more <IoArrowForward className="arrow-icon" />
        </button>
      </div>
    </div>

    {/* TM Luxe Card */}
    <div className="tm-feature-card">
      <div className="tm-feature-card__header">
        <h2 className="tm-feature-card__title">
          TM <span className="tm-feature-card__accent">Luxe</span>
        </h2>
      </div>
      <div className="tm-feature-card__image">
        <img src="image 87.png" alt="TM Luxe" />
      </div>
      <div className="tm-feature-card__content">
        <h3 className="tm-feature-card__subtitle">
          More Than <span className="highlight">Service</span> — We Offer Care
        </h3>
        <p className="tm-feature-card__desc">
          TM Luxe redefines premium living with our exclusive collection of luxury apartments. 
          With sophisticated interiors, modern amenities, and prime locations, TM Luxe is crafted for those 
          seeking a luxurious living experience.
        </p>
        <button className="tm-feature-button">
          Know more <IoArrowForward className="arrow-icon" />
        </button>
      </div>
    </div>
  </div>
);

export default TMFeaturesMobile;
