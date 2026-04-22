import React from "react";
import { FaSearch } from "react-icons/fa";
import { IoArrowForwardSharp } from "react-icons/io5";
import { PiBuildingLight } from "react-icons/pi";
import { TbBuildingEstate } from "react-icons/tb";
import { BsFillDoorOpenFill } from "react-icons/bs";
import { GoHome } from "react-icons/go";   // ✅ watermark
import { useNavigate } from "react-router";
import { navClick, auxNavClick } from '../../utils/navClick';

import "./SmartLiving.css";

const SmartLiving = () => {
  const navigate = useNavigate();
  const comingsoon = () => {
    alert("this part is Coming Soon Stay updated with us");
  };

  return (
    <div className="smart-container">
      {/* Header Section */}
      <div className="header-text">
        <h2>✨ Smart Living. Simplified Life</h2>
        <h2>Your Space , Your Style</h2>
        <h2>Your Freedom</h2>
        <p>From Shared To Stylish - Living Spaces For Every Lifestyle</p>
      </div>

      {/* Hero Section */}
      <div className="hero">
        <img src="/mobile-banner.png" alt="student" className="hero-img" />
      </div>

      {/* ✅ Watermark Background + Features */}
      <div className="features-section">
        {/* Watermark Behind */}
        <div className="watermark">
          <GoHome className="watermark-icon" />
        </div>

        {/* Feature Card 1 - Luxe */}
        <div className="feature-card">
          <div className="smart-living-category-box">
            <div className="smart-living-image-stay">
              <img src="/4.png" alt="TM Luxe" />
            </div>
            <div className="smart-living-category-right smart-luxe">
              <h3>
                <span className="smart-living-tm">TM</span>{" "}
                <span className="smart-living-stay">Luxe</span>
              </h3>
              <p className="luxury-p">For Luxury Stay</p>
            </div>
          </div>

          <div className="building_icon">
            <TbBuildingEstate className="iconx" size={35} />
          </div>
          <div className="card-text">
            <p>Cities</p>
            <h3>2+</h3>
          </div>
          <span
            className="smart-living-left-arrow"
            onClick={(e) => navClick(e, "/tmluxe", navigate)}
            onAuxClick={(e) => auxNavClick(e, "/tmluxe")}
          >
            <IoArrowForwardSharp size={15} />
          </span>
        </div>

        {/* Feature Card 2 - Hive */}
        <div className="feature-card mid-card">
          <div className="smart-living-category-box mid-box">
            <div className="smart-living-image-stay">
              <img src="/2.png" alt="TM Hive" />
            </div>
            <div className="smart-living-category-right">
              <h3>
                <span className="smart-living-tm">TM</span>{" "}
                <span className="smart-living-stay">Hive</span>
              </h3>
              <p id="coliving-text">For Coliving</p>
            </div>
          </div>

          <span className="smart-living-left-arrow" onClick={comingsoon}>
            <IoArrowForwardSharp size={15} />
          </span>

          <div className="card-text">
            <p>Rooms</p>
            <h3>5+</h3>
          </div>
          <div className="building_icon">
            <BsFillDoorOpenFill className="iconx" size={35} />
          </div>
        </div>

        {/* Feature Card 3 - Stay */}
        <div className="feature-card">
          <div className="smart-living-category-box">
            <div className="smart-living-image-stay">
              <img src="/1.png" alt="TM Stay" />
            </div>
            <div className="smart-living-category-right">
              <h3>
                <span className="smart-living-tm">TM</span>{" "}
                <span className="smart-living-stay">Stay</span>
              </h3>
              <p>For PG</p>
            </div>
          </div>

          <div className="building_icon">
            <PiBuildingLight className="iconx" size={35} />
          </div>
          <div className="card-text">
            <p>Residence</p>
            <h3>3+</h3>
          </div>
          <span className="smart-living-left-arrow" onClick={comingsoon}>
            <IoArrowForwardSharp size={15} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default SmartLiving;