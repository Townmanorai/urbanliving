import React, { useState, useEffect, lazy, Suspense } from 'react';
import './Banner.css';
import { IoArrowForwardSharp, IoSearch } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

// Import images
import img1 from '/1.png';
import img2 from '/2.png';
import img4 from '/4.png';
import group10 from '/Group 10.png';

// Lazy load the mobile component
const BannerMobile = lazy(() => import('./BannerMobile'));

function Banner() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <BannerMobile />
      </Suspense>
    );
  }

  return (
    <div className='banner_container'>
      <div className='banner_left'>

        {/* TM Stay */}
        <div className='category_box'>
          <div className='image-stay'>
            <img src={img1} alt='TM Stay' />
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
            <img src={img2} alt='TM Hive' />
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
        <div className='category_box luxe_box'>
          <div className='image-luxe'>
            <img src={img4} alt='TM Luxe' />
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
          <p className='banner_content_p'>From shared to stylish - living spaces for every lifestyle</p>
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
          <img src={group10} alt='Background' />
        </div>
      </div>
    </div>
  );
}

export default Banner;
