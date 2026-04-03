import React, { useState, useEffect, lazy, Suspense } from 'react';
import './BannerMobile.css';
import { IoArrowForwardSharp, IoSearch } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
// Import images


function BannerMobile() {

  const navigate = useNavigate();
  
  return (
    <div className='tm-banner-container'>
    

    <div className='tm-banner-right'>
      <div className='tm-banner-content'>
        <h1>
          <span className='tm-heading-alt'>Smart Living Simplified.</span> <br />
          Your Space!<br />
          <span className='tm-heading-main'>Your Comfort!</span> <br />
          <span className='tm-heading-sub'>Your Freedom!</span>
        </h1>
        <p className='tm-banner-text'>From shared to stylish - living spaces for every lifestyle</p>
{/* 
        <div className="tm-search-bar">
          <div className="tm-search-container">
            <span className="tm-search-input-wrapper">
              <input type="text" placeholder="Search your location" />
              <IoSearch size={25} className='tm-search-icon' />
            </span>
          </div>
          <button className="tm-search-btn">Search</button>
        </div> */}
      </div>

      <div className='tm-banner-bg'>
        <img src="/Group-10.png" alt='Background' />
      </div>
    </div>
  </div>
  );
}

export default BannerMobile;
