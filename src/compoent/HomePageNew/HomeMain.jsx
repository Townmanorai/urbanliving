import React from 'react'
import { Helmet } from 'react-helmet';
import Home1 from './Home1'
import Home2 from './Home2'
import Home3 from './Home3'
import Home4 from './Home4'
import Home5 from './Home5'
import Home6 from './Home6'
import Home7 from "./Home7"
import Home8 from "./Home8"
// import WelcomePopUp from './WelcomePopUp';

export const HomeMain = () => {
  return (
    <div>
      <Helmet>
        <title>OvikaLiving | Best PG, Co-Living & Furnished Stays in Noida & Greater Noida</title>
        <meta name="description" content="OvikaLiving offers verified PG, co-living spaces, furnished apartments & short-term stays in Noida and Greater Noida. Best accommodation for students, working professionals & families. No brokerage. Book now!" />
        <meta name="keywords" content="pg in noida, pg in greater noida, co living in noida, furnished apartment in noida, best pg in noida, co living spaces noida, short term stay noida, monthly rentals noida, pg for working professionals in noida, pg for students in noida, ovikaliving, verified pg noida, managed rental homes noida, smart rental living noida" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ovikaliving.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="OvikaLiving | Best PG & Co-Living in Noida & Greater Noida" />
        <meta property="og:description" content="Find verified PG, co-living & furnished stays in Noida. Best accommodation for working professionals & students. No brokerage. Book now!" />
        <meta property="og:url" content="https://www.ovikaliving.com/" />
        <meta property="og:site_name" content="OvikaLiving" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="OvikaLiving | Best PG & Co-Living in Noida" />
        <meta name="twitter:description" content="Verified PG, co-living & furnished stays in Noida & Greater Noida. No brokerage. Book now!" />
      </Helmet>
      {/* <WelcomePopUp/> */}
      <Home1 />
      <Home8/>
      <Home3 />
      <Home4 />
      <Home5 />
      <Home7/>
<Home2 />
      <Home6 />
    </div>
  )
} 