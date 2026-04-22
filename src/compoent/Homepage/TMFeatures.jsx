import React, { useState, useEffect } from "react";
import "./TMFeatures.css";
import { IoArrowForward } from "react-icons/io5";

import { useNavigate } from "react-router";
import { navClick, auxNavClick } from '../../utils/navClick';

const TMFeatures = () => {

  const navigate  = useNavigate();
  return (
    <div className="tm-features-root">
      <div className="tm-features-header">
        <h1 className="tm-features-title">TM features</h1>
        <p className="tm-features-subtitle" title="Our doors are open to every kind of traveler. No judgments. Just cozy rooms and kind service">
        Where luxury, comfort, and community come together.
        </p>
      </div>

      <div className="tm-features-container">
      <div className="tm-feature-row">
          <div className="tm-feature-text">
            <h2 className="tm-feature-title">
              TM <span className="tm-feature-accent">Luxe</span>
            </h2>
            <div className="tm-feature-subtitle">
            Luxury <span className="highlight">crafted </span> — <br /> for modern living
            </div>
            <p className="tm-feature-desc">
              TM Luxe offers high-end, fully serviced apartments for those who value elegance, comfort, and privacy. 
              With sophisticated interiors, modern amenities, and prime locations, TM Luxe is crafted for those 
              seeking a luxurious living experience.
            </p>
            <button className="tm-feature-button" onClick={(e)=>navClick(e,'/tmluxe',navigate)} onAuxClick={(e)=>auxNavClick(e,'/tmluxe')}>
              Know more <IoArrowForward className="arrow-icon" />
            </button>
          </div>
          <div className="tm-feature-image">
            <img src="image 87.png" alt="TM Luxe" />
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
           {/* TM Stay */}
           <div className="tm-feature-row">
          <div className="tm-feature-text">
            <h2 className="tm-feature-title">
              TM <span className="tm-feature-accent">Stay</span>
            </h2>
            <div className="tm-feature-subtitle">
            Flexible <span className="highlight">stays,</span><br />
            seamless <span className="highlight">comfort</span>
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
            <img src="image 89.png" alt="TM Stay" />
          </div>
        </div>
        {/* TM Luxe */}
       
      </div>
    </div>
  );
};

export default TMFeatures;