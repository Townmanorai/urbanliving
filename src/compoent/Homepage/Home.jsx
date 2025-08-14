import React from 'react'
import Navabar from './Navabar'
import Banner from './Banner'
import TMFeatures from './TMFeatures'
import BookingSteps from './BookingSteps'
import ListYourPropertyTM from './ListYourPropertyTM'
import HoomieFooter from './HoomieFooter'

function Home() {
  return (
   <>
   <Navabar/>
   <Banner/>
   <TMFeatures/>
   <BookingSteps/>
   <ListYourPropertyTM/>
   {/* <HoomieFooter/> */}
   </>
  )
}

export default Home