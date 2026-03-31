import React from 'react'
// import LuxeBanner from './LuxeBanner'
import LuxeProperties from './LuxeProperties'
// import LuxeResidentReviews from './LuxeResidentReviews'
import { Helmet } from 'react-helmet'
import LuxeHeroTM from './LuxeHeroTM'
import TMLuxeWhyChoose from './TMLuxeWhyChoose'
import TMXLuxeTestimonialsCard from './TMXLuxeTestimonialsCard'

function LuxeMain() {
  return (
    <>
     <Helmet>
      <title>OvikaLiving Signature Stays | Luxury Nightly Rentals in Noida & Greater Noida</title>
      <meta name="description" content="Experience OvikaLiving Signature — premium luxury nightly stays in Noida & Greater Noida. Fully furnished, verified, self check-in apartments. Perfect for short stays, corporate visits & weekend getaways." />
      <meta name="keywords" content="ovikaliving signature stays, luxury nightly stays noida, premium short stay noida, luxury apartment noida, serviced apartments noida, short stay greater noida, corporate stay noida, studio stay noida, luxury furnished apartment noida, best nightly stay noida, ovika luxe noida, premium rental noida" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://www.ovikaliving.com/tmluxe" />
      <meta property="og:title" content="OvikaLiving Signature Stays | Luxury Nightly Rentals Noida" />
      <meta property="og:description" content="Premium luxury nightly stays in Noida. Fully furnished, verified, self check-in. Book OvikaLiving Signature now!" />
      <meta property="og:url" content="https://www.ovikaliving.com/tmluxe" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="OvikaLiving Signature Stays | Noida" />
      <meta name="twitter:description" content="Luxury nightly stays in Noida. Verified, fully furnished, self check-in. Book now!" />
    </Helmet>
    <LuxeHeroTM/>
    <TMLuxeWhyChoose/>

    {/* <LuxeBanner/> */}

    <LuxeProperties/>
    <TMXLuxeTestimonialsCard/>
    {/* <LuxeResidentReviews/> */}
    </>
  )
}

export default LuxeMain