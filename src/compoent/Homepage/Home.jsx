import React from 'react'

import Banner from './Banner'
import TMFeatures from './TMFeatures'
import BookingSteps from './BookingSteps'
import ListYourPropertyTM from './ListYourPropertyTM'
import HoomieFooter from './HoomieFooter'
import Navbar from './Navbar'


function Home() {
  return (
   <>
   {/* <Navbar/> */}
   <Banner/>
   {/* <HowItWorks/> */}
   <TMFeatures/>
   <BookingSteps/>
   <ListYourPropertyTM/>
   {/* <HoomieFooter/> */}
   </>
  )
}

export default Home