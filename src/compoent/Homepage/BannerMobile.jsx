import React from 'react';
import './BannerMobile.css';
import { IoArrowForwardSharp, IoSearch } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

function BannerMobile() {
  const navigate = useNavigate();

  return (
    <div className='banner-mobile-container'>
      <div className='banner-mobile-content'>
        <h1>
          <span className='heading_design3'>Smart Living Simplified.</span>
          <br />
          Your Space!
          <br />
          <span className='heading_design'>Your Comfort!</span>
          <br />
          <span className='heading_design2'>Your Freedom!</span>
        </h1>
        <p className='banner-mobile-content_p'>
          From shared to stylish - living spaces for every lifestyle
        </p>

        <div className='search-bar-mobile'>
          <div className='search-container-mobile'>
            <span className='search-bar-icon'>
              <input type='text' placeholder='Search your location' />
              <IoSearch size={20} className='search-icon' />
            </span>
          </div>
          <button>Search</button>
        </div>
      </div>

      <div className='category-container-mobile'>
        <div className='category-box-mobile' onClick={() => navigate('/tmstay')}>
          <div className='category-image-mobile'>
            <img src='/1.png' alt='TM Stay' />
          </div>
          <div className='category-details-mobile'>
            <h3>
              <span className='tm'>TM</span> <span className='stay'>Stay</span>
            </h3>
            <p>For PG</p>
            <span className='arrow-mobile'>
              <IoArrowForwardSharp size={20} />
            </span>
          </div>
        </div>

        <div className='category-box-mobile' onClick={() => navigate('/tmhive')}>
          <div className='category-image-mobile'>
            <img src='/2.png' alt='TM Hive' />
          </div>
          <div className='category-details-mobile'>
            <h3>
              <span className='tm'>TM</span> <span className='hive'>Hive</span>
            </h3>
            <p>For Co-living</p>
            <span className='arrow-mobile'>
              <IoArrowForwardSharp size={20} />
            </span>
          </div>
        </div>

        <div className='category-box-mobile' onClick={() => navigate('/tmluxe')}>
          <div className='category-image-mobile'>
            <img src='/4.png' alt='TM Luxe' />
          </div>
          <div className='category-details-mobile'>
            <h3>
              <span className='tm'>TM</span> <span className='luxe'>Luxe</span>
            </h3>
            <p>For Luxury apartments</p>
            <span className='arrow-mobile'>
              <IoArrowForwardSharp size={20} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BannerMobile;
