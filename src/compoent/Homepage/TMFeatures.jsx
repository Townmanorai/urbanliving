import React from "react";
import "./TMFeatures.css";

const TMFeatures = () => (
  <div className="tm-features-root">
    <h1 className="tm-features-title">TM features</h1>
    <p className="tm-features-subtitle">
      Our doors are open to every kind of traveler. No judgments. Just cozy rooms and kind service
    </p>

    {/* TM Stay → Text Left | Image Right */}
    <div className="tm-features-section">
      <div className="tm-features-section-header">
        <h2 className="tm-features-section-title">
          TM <span className="script-accent">Stay</span>
        </h2>
        <div className="tm-features-section-image">
          <img src="/image 86.png" alt="TM Stay" className="tm-features-img" />
        </div>
      </div>
      <div className="tm-features-section-text">
        <div className="tm-features-section-subtitle">
          A Space That <span className="tm-features-highlight-holds">Holds</span><br />
          You <span className="tm-features-highlight-gently">Gently</span>
        </div>
        <p className="tm-features-section-desc">
          TM Stay offers fully managed and affordable PG rentals tailored for students and working professionals. 
          With clean, secure, precious and comfortable living spaces, we ensure a hassle-free stay that feels just like home – only better.
        </p>
      </div>
    </div>

    {/* TM Hive → Image Left | Text Right */}
    <div className="tm-features-section tm-features-section--hive">
      <div className="tm-features-section-header">
        <h2 className="tm-features-section-title">
          TM <span className="script-accent">Hive</span>
        </h2>
        <div className="tm-features-section-image">
          <img src="/image 91.png" alt="TM Hive" className="tm-features-img" />
        </div>
      </div>
      <div className="tm-features-section-text">
        <div className="tm-features-section-subtitle">
          Live together, <span className="tm-features-highlight-grow">grow</span><br />
          together.
        </div>
        <p className="tm-features-section-desc">
          TM Hive brings together vibrant communities in thoughtfully designed shared spaces. 
          Whether you're a young professional, a remote worker, or a creative soul, our co-living 
          homes offer the perfect blend of privacy, social, and flexibility – so you can live, work, and grow together.
        </p>
      </div>
    </div>

    {/* TM Luxe → Text Left | Image Right */}
    <div className="tm-features-section tm-features-section--luxe">
      <div className="tm-features-section-header">
        <h2 className="tm-features-section-title">
          TM <span className="script-accent">Luxe</span>
        </h2>
        <div className="tm-features-section-image">
          <img src="/image 87.png" alt="TM Luxe" className="tm-features-img" />
        </div>
      </div>
      <div className="tm-features-section-text">
        <div className="tm-features-section-subtitle">
          More Than <span className="tm-features-highlight-service">Service</span> —<br />
          We Offer Care
        </div>
        <p className="tm-features-section-desc">
          TM Luxe offers high-end, fully serviced apartments for those who value elegance, comfort, and privacy. 
          With sophisticated interiors, modern amenities, and prime locations, TM Luxe is crafted for families, 
          business travelers, and individuals seeking a luxurious living experience.
        </p>
      </div>
    </div>
  </div>
);

export default TMFeatures;