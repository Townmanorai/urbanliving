import React from 'react'

import Banner from './Banner'
import TMFeatures from './TMFeatures'
import BookingSteps from './BookingSteps'
import ListYourPropertyTM from './ListYourPropertyTM'
import HoomieFooter from './HoomieFooter'
import Navbar from './Navbar'
import MainBanner from './MainBanner'
import MainTmFeature from './MainTmFeature'
import EliteProperties from './EliteProperties'
import FloatingSearch from './FloatingSearch'
import { Helmet } from 'react-helmet'
import MainHow from './MainHow'

function Home() {
  return (
   <>
   <Helmet>
     <title>OvikaLiving – Premium Living Spaces in Noida & Greater Noida | Luxury Stays & Corporate Accommodation</title>
     <meta name="description" content="OvikaLiving offers premium & luxury living spaces in Noida & Greater Noida. Discover elite serviced apartments, corporate stays, luxury PG & co-living for startup founders, remote workers & corporate professionals. No brokerage. Book now!" />
     <meta name="keywords" content="ovikaliving, ovika living, ovika noida, ovika greater noida, premium living spaces noida, luxury stays noida, corporate stay noida, luxury pg noida, premium serviced apartments noida, premium studio stay noida, elite properties noida, smart urban living noida, luxury rental homes noida, corporate accommodation noida, premium co-living noida, luxury furnished apartment noida, premium pg for corporate noida, serviced apartments noida, executive stay noida, business stay noida, short term stays noida, luxury short stay noida, corporate housing noida, furnished luxury flat noida, premium co-living spaces noida, elite stay noida, startup founder accommodation noida, remote worker luxury stay noida, digital nomad premium stay noida, IT professional stay noida, MBA student luxury pg noida, pg sector 62 noida, pg sector 63 noida, pg sector 18 noida, pg sector 16 noida, pg sector 50 noida, pg sector 51 noida, pg sector 52 noida, pg sector 44 noida, pg sector 45 noida, pg sector 46 noida, pg sector 47 noida, pg sector 48 noida, pg sector 49 noida, pg sector 15 noida, pg sector 22 noida, pg sector 27 noida, pg sector 29 noida, pg sector 30 noida, pg sector 32 noida, pg sector 33 noida, pg sector 34 noida, pg sector 35 noida, pg sector 36 noida, pg sector 37 noida, pg sector 38 noida, pg sector 39 noida, pg sector 40 noida, pg sector 41 noida, pg sector 42 noida, pg sector 43 noida, pg sector 53 noida, pg sector 54 noida, pg sector 55 noida, pg sector 56 noida, pg sector 57 noida, pg sector 58 noida, pg sector 59 noida, pg sector 60 noida, pg sector 61 noida, pg sector 64 noida, pg sector 65 noida, pg sector 66 noida, pg sector 68 noida, pg sector 70 noida, pg sector 71 noida, pg sector 72 noida, pg sector 74 noida, pg sector 75 noida, pg sector 76 noida, pg sector 77 noida, pg sector 78 noida, pg sector 100 noida, pg sector 104 noida, pg sector 105 noida, pg sector 107 noida, pg sector 108 noida, pg sector 110 noida, pg sector 119 noida, pg sector 120 noida, pg sector 121 noida, pg sector 122 noida, pg sector 125 noida, pg sector 126 noida, pg sector 128 noida, pg sector 130 noida, pg sector 131 noida, pg sector 132 noida, pg sector 133 noida, pg sector 134 noida, pg sector 135 noida, pg sector 136 noida, pg sector 137 noida, pg knowledge park greater noida, pg alpha greater noida, pg beta greater noida, pg gamma greater noida, pg delta greater noida, pg omega greater noida, pg pari chowk greater noida, pg sector pi greater noida, pg chi greater noida, pg sigma greater noida, pg mu greater noida, pg xi greater noida, pg tau greater noida, pg phi greater noida, pg eta greater noida, pg zeta greater noida, pg theta greater noida, pg greater noida west, pg noida extension, नोएडा में पीजी, को लिविंग नोएडा, किराये का कमरा, फर्निश्ड फ्लैट, मासिक किराया, शॉर्ट स्टे, रिमोट वर्कर नोएडा, स्टार्टअप फाउंडर नोएडा, इंटर्न के लिए पीजी, नोएडा में किराया, सस्ता पीजी नोएडा, वाईफाई वाला पीजी, खाने वाला पीजी, लड़कों के लिए पीजी, लड़कियों के लिए पीजी, ग्रेटर नोएडा पीजी, नोएडा में कमरा किराये पर, फर्निश्ड अपार्टमेंट नोएडा, को-लिविंग स्पेस नोएडा, मंथली रेंटल नोएडा, pg under 10000 noida, pg under 15000 noida, pg under 20000 noida, furnished flat under 25000 noida, studio apartment noida, 1bhk luxury noida, 2bhk luxury noida, fully furnished apartment noida, semi-furnished apartment noida, serviced apartment noida, paying guest noida, shared accommodation noida, private room noida, single occupancy noida, double occupancy noida, wifi included noida, meals included noida, ac room noida, gym pg noida, housekeeping included noida, laundry service noida, parking facility noida, 24x7 security noida, cctv surveillance noida, power backup noida, best luxury pg noida under 20000, premium furnished apartment noida no brokerage, verified luxury stay noida, best premium co-living noida, no brokerage luxury stay noida" />
     <meta name="robots" content="index, follow" />
     <link rel="canonical" href="https://www.ovikaliving.com/home" />
     <meta name="author" content="OvikaLiving" />
     <meta name="rating" content="general" />
     <meta name="revisit-after" content="7 days" />
     <meta name="language" content="en" />
     <meta name="geo.region" content="IN-UP" />
     <meta name="geo.placename" content="Noida" />
     <meta name="geo.position" content="28.5355;77.3910" />
     <meta name="ICBM" content="28.5355, 77.3910" />
     <meta property="og:title" content="OvikaLiving – Premium Living Spaces in Noida & Greater Noida | Luxury Stays" />
     <meta property="og:description" content="Discover premium & luxury living spaces in Noida & Greater Noida. Elite serviced apartments, corporate stays & luxury PG. No brokerage. Book now!" />
     <meta property="og:url" content="https://www.ovikaliving.com/home" />
     <meta property="og:type" content="website" />
     <meta property="og:site_name" content="OvikaLiving" />
     <meta property="og:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
     <meta property="og:locale" content="en_IN" />
     <meta name="twitter:card" content="summary_large_image" />
     <meta name="twitter:title" content="OvikaLiving – Premium Living Spaces in Noida & Greater Noida" />
     <meta name="twitter:description" content="Premium & luxury living spaces in Noida & Greater Noida. Corporate stays, luxury PG & elite furnished apartments. No brokerage. Book now!" />
     <meta name="twitter:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
   </Helmet>
   {/* <Navbar/> */}
   <MainBanner/>
   {/* <HowItWorks/> */}
 <MainTmFeature/>
   {/* <BookingSteps/> */}
   <MainHow/>
 <EliteProperties/>
  <FloatingSearch/>
   <ListYourPropertyTM/>
   {/* <HoomieFooter/> */}
   </>
  )
}

export default Home