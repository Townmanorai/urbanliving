import React from 'react';
import './BannerMobile.css';
import { IoArrowForwardSharp, IoSearch } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import img1 from '/1.png';
import img2 from '/2.png';
import img4 from '/4.png';
import group10 from '/Group 10.png';
// Import images


function BannerMobile() {

  const navigate = useNavigate();

  return (
    <div className="sf-container">
      {/* Hero Section */}
      <div className="sf-hero">
        <h2 className="sf-title">
          Where Comfort Meets <br /> Non-Judgmental Hospitality.
        </h2>
        <p className="sf-subtitle">
          Co-ed. Girls-only. Boys-only. All types of residences available.
        </p>
        <div className="sf-search-bar">
          <input type="text" placeholder="Search your location" />
          <button>Search</button>
        </div>
        <img
          src={group10}
          alt="Student"
          className="sf-hero-img"
        />
      </div>

      {/* Options */}
      <div className="sf-card">
        <img
          src={img1}
          alt="PG"
          className="sf-card-img"
        />
        <div>
          <h3 className="sf-card-title">TM Stay</h3>
          <p className="sf-card-sub">For PG</p>
          <p className="sf-card-num">450+ Residence</p>
        </div>
      </div>

      <div className="sf-card">
        <div>
          <h3 className="sf-card-title">TM Hive</h3>
          <p className="sf-card-sub">For Co-living</p>
          <p className="sf-card-num">40000+ Rooms</p>
        </div>
        <img
          src={img2}
          alt="Co-living"
          className="sf-card-img"
        />
      </div>

      <div className="sf-card">
        <img
          src={img4}
          alt="Luxury"
          className="sf-card-img"
        />
        <div>
          <h3 className="sf-card-title">TM Hive</h3>
          <p className="sf-card-sub">For Luxury apartments</p>
          <p className="sf-card-num">15+ Cities</p>
        </div>
      </div>
    </div>
  );
}

export default BannerMobile;
