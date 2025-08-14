import React from "react";
import "./TMFeatures.css";

const TMFeatures = () => (
  <div className="tm-features-root">
    <div className="tm-features-header">
      <h1 className="tm-features-title">TM features</h1>
      <div className="welcome-message">
        <p className="welcome-text">
          Our doors are open to every kind of traveler. No judgments. Just cozy rooms and kind service.
        </p>
      </div>
    </div>

    {/* TM Stay */}
    <div className="tm-features-section tm-features-section--stay">
      <div className="tm-features-section-text">
        <h2 className="tm-features-section-title">TM Stay</h2>
        <div className="tm-features-section-subtitle">
          A Space That <span className="tm-features-highlight-holds">Holds</span> You <span className="tm-features-highlight-gently"><br></br>Gently</span>
        </div>
        <p className="tm-features-section-desc">
          TM Stay offers fully managed and affordable PG rentals tailored for students and working professionals. With clean, secure, precious and comfortable living spaces, we ensure a hassle-free stay that feels just like home – only better.
        </p>
      </div>
      <div className="tm-features-section-image">
        <img
          src="/image 89.png"
          alt="TM Stay Illustration"
          className="tm-features-img"
        />
      </div>
    </div>

    {/* TM Hive */}
    <div className="tm-features-section tm-features-section--hive">
      <div className="tm-features-section-image">
        <img
          src="/image 91.png"
          alt="TM Hive Illustration"
          className="tm-features-img"
        />
      </div>
      <div className="tm-features-section-text">
        <h2 className="tm-features-section-title">TM Hive</h2>
        <div className="tm-features-section-subtitle">
          Live together, <span className="tm-features-highlight-grow">grow</span> together.
        </div>
        <p className="tm-features-section-desc">
          TM Hive brings together vibrant communities in thoughtfully designed shared spaces. Whether you’re a young professional, a remote worker, or a creative soul, our co-living homes offer the perfect blend of privacy, social, and flexibility – so you can live, work, and grow together.
        </p>
      </div>
    </div>

    {/* TM Luxe */}
    <div className="tm-features-section tm-features-section--luxe">
      <div className="tm-features-section-text">
        <h2 className="tm-features-section-title">TM Luxe</h2>
        <div className="tm-features-section-subtitle">
          More Than <span className="tm-features-highlight-service">Service—</span> We Offer Care
        </div>
        <p className="tm-features-section-desc">
          TM Luxe offers high-end, fully serviced apartments for those who value elegance, comfort, and privacy. With sophisticated interiors, modern amenities, and prime locations, TM Luxe is crafted for families, celeb business travelers, and individuals seeking a luxurious living experience.
        </p>
      </div>
      <div className="tm-features-section-image">
        <img
          src="/image 87.png"
          alt="TM Luxe Room"
          className="tm-features-img tm-features-img--luxe"
        />
      </div>
    </div>
  </div>
);

export default TMFeatures;