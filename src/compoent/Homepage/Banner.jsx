import React from 'react'
import './banner.css'
import { IoArrowForwardSharp, IoChevronForwardCircleOutline } from 'react-icons/io5'
function Banner() {
  return (
    <>
      <div className='banner_container'>
        <div className='banner_left'>
          <div className='category_box'>
            <div id='categoryleft'>  <img src='/1.png'></img></div>
            <div id='categoryright'>
              <h3>Tm Stay</h3>
              <p>For PG</p>
              <span id='left_arrow'><IoArrowForwardSharp size={20} /></span>
            </div>
          </div>
          <div className='category_box'>
            <div id='categoryleft'>  <img src='/2.png'></img></div>
            <div id='categoryright'>
              <h3>Tm Hive</h3>
              <p>For Coliving</p>
              <span id='left_arrow'><IoArrowForwardSharp size={20} /></span>
            </div>
          </div>
          <div className='category_box'>
            <div id='categoryleft'>  <img src='/4.png'></img></div>
            <div id='categoryright'>
              <h3>Tm Luxe</h3>
              <p>For luxury</p>
              <span id='left_arrow'><IoArrowForwardSharp size={20} /></span>
            </div>
          </div>
        </div>
        <div className='banner_right'>
          <div className='backpart'>
            <img src='/5.png' alt="Banner background" />
            <div className='banner_overlay'>
              <div className='banner_content'>
                <h1>Where Comfort meets <br /> Non Judgemental Hospitality</h1>
              </div>
              <div className='search-container'>
                <div className="search-bar">
                  <input type="text" placeholder="Find your stay" />
                  <button>Search</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Banner