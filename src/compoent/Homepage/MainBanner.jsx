import React from 'react'
import Banner from './Banner'
import BannerMobile from './BannerMobile'

function MainBanner() {
  return (
    <div className="main_banner_container">
      <div className="desktop-banner">
        <Banner />
      </div>
      <div className="mobile-banner">
        <BannerMobile />
      </div>
    </div>
  )
}

export default MainBanner
