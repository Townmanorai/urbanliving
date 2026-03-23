import React from 'react'
import { Helmet } from 'react-helmet';
import Home1 from './Home1'
import Home2 from './Home2'
import Home3 from './Home3'
import Home4 from './Home4'
import Home5 from './Home5'
import Home6 from './Home6'
import Home7 from "./Home7"
import WelcomePopUp from './WelcomePopUp';

export const HomeMain = () => {
  return (
    <div>
      <Helmet>
        <title>OvikaLiving – Smart Rental Living in Noida & Greater Noida</title>
        <meta name="description" content="Discover smart living apartments and managed rental homes in Noida & Greater Noida. OvikaLiving offers modern, furnished rental solutions for working professionals and families." />
        <meta name="keywords" content="near India Expo Mart, smart living apartments, managed rental homes, furnished rental homes, rental apartments in Noida, rentals in Greater Noida, urban smart living" />
      </Helmet>
      <WelcomePopUp/>
      <Home1 />
      <Home2 />
      <Home3 />
      <Home4 />
      <Home5 />
      <Home7/>

      <Home6 />
    </div>
  )
} 