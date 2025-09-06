import React, { useState, useEffect, lazy, Suspense } from 'react';
import './BannerMobile.css';
import { IoArrowForwardSharp, IoSearch } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
// Import images


function BannerMobile() {

  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  
  return (
    <div className='tm-banner-container'>
    <div className='tm-banner-left'>

      {/* TM Stay */}
      <div className='tm-category-box'>
        <div className='tm-image-stay'>
          <img src="/1.png" alt='TM Stay' />
        </div>
        <div className='tm-category-content'>
          <h3>
            <span className="tm-logo">TM</span> <span className="tm-stay">Stay</span>
          </h3>
          <p>For PG</p>
          <span className='tm-arrow-circle'>
            <IoArrowForwardSharp size={25} />
          </span>
        </div>
      </div>

      {/* TM Hive */}
      <div className='tm-category-box tm-hive-box'>
        <div className='tm-image-hive'>
          <img src="/2.png" alt='TM Hive' />
        </div>
        <div className='tm-category-content'>
          <h3>
            <span className="tm-logo">TM</span> <span className="tm-hive">Hive</span>
          </h3>
          <p>For Co-living</p>
          <span className='tm-arrow-circle'>
            <IoArrowForwardSharp size={25} />
          </span>
        </div>
      </div>

      {/* TM Luxe */}
      <div className='tm-category-box tm-luxe-box'>
        <div className='tm-image-luxe'>
          <img src="/4.png" alt='TM Luxe' />
        </div>
        <div className='tm-category-content'>
          <h3>
            <span className="tm-logo">TM</span> <span className="tm-luxe">Luxe</span>
          </h3>
          <p>For Luxury apartments</p>
          <span className='tm-arrow-circle' onClick={() => navigate('/tmluxe')}>
            <IoArrowForwardSharp size={25} />
          </span>
        </div>
      </div>

    </div>

    <div className='tm-banner-right'>
      <div className='tm-banner-content'>
        <h1>
          <span className='tm-heading-alt'>Smart Living Simplified.</span> <br />
          Your Space!<br />
          <span className='tm-heading-main'>Your Comfort!</span> <br />
          <span className='tm-heading-sub'>Your Freedom!</span>
        </h1>
        <p className='tm-banner-text'>From shared to stylish - living spaces for every lifestyle</p>

        <div className="tm-search-bar">
          <div className="tm-search-container">
            <span className="tm-search-input-wrapper">
              <input type="text" placeholder="Search your location" />
              <IoSearch size={25} className='tm-search-icon' />
            </span>
          </div>
          <button className="tm-search-btn">Search</button>
        </div>
      </div>

      <div className='tm-banner-bg'>
        <img src="/Group-10.png" alt='Background' />
      </div>
    </div>
  </div>
  );
}

export default BannerMobile;
