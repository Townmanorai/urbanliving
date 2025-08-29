import React from 'react';
import './banner.css';
import { IoArrowForwardSharp, IoSearch } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

function Banner() {
  const navigate = useNavigate();

  return (
    <div className='banner_container'>
      <div className='banner_left'>

        {/* TM Stay */}
        <div className='category_box'>
          <div className='image-stay'>
            <img src='/1.png' alt='TM Stay' />
          </div>
          <div id='categoryright'>
            <h3>
              <span className="tm">TM</span> <span className="stay">Stay</span>
            </h3>
            <p>For PG</p>
            <span id='left_arrow'>
              <IoArrowForwardSharp size={25} />
            </span>
          </div>
        </div>

        {/* TM Hive */}
        <div className='category_box hive_box' >
          <div className='image-hive'>
            <img src='/2.png' alt='TM Hive' />
          </div>
          <div id='categoryright'>
            <h3>
              <span className="tm">TM</span> <span className="hive">Hive</span>
            </h3>
            <p>For Co-living</p>
            <span id='left_arrow'>
              <IoArrowForwardSharp size={25} />
            </span>
          </div>
        </div>

        {/* TM Luxe */}
        <div className='category_box'>
          <div className='image-luxe'>
            <img src='/4.png' alt='TM Luxe' />
          </div>
          <div id='categoryright'>
            <h3>
              <span className="tm">TM</span> <span className="luxe">Luxe</span>
            </h3>
            <p>For Luxury apartments</p>
            <span id='left_arrow' onClick={() => navigate('/tmluxe')}>
              <IoArrowForwardSharp size={25} />
            </span>
          </div>
        </div>

      </div>

      <div className='banner_right'>
        <div className='banner_content'>
          <h1>
          <span className='heading_design3'>Smart Living Simplified.</span> <br />Your Space!<br></br><span id='heading_design'>Your Comfort!</span>  <br></br><span id='heading_design2'>Your Freedom!</span>
          </h1>
          <div className="search-bar">
            <div className="search-container">
              {/* <span className="search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span> */}
              <span className="search-bar-icon"> <input type="text" placeholder="Search your location" /><IoSearch size={25} id='search-icon'/></span>
             
            </div>
            <button>Search</button>
          </div>
        </div>

        <div className='backpart'>
          <img src='Group 10.png' alt='Background' />
        </div>
      </div>
    </div>
  );
}

export default Banner;
