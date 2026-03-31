import React from 'react'
import { Helmet } from 'react-helmet'
import Subs1 from "./Subs1"
import Subs2 from './Subs2'
import Subs3 from './Subs3'
export const Subsriptionmain = () => {
  return (
    <div>
      <Helmet>
        <title>Subscription Plans | OvikaLiving – List Your Property in Noida</title>
        <meta name="description" content="Choose an OvikaLiving subscription plan to list your PG, co-living space or rental property in Noida & Greater Noida. Get more visibility, leads and bookings." />
        <meta name="keywords" content="ovikaliving subscription, property listing plans noida, pg listing subscription, paid property listing noida, ovika premium plan, property owner plan noida, rental listing subscription, सब्सक्रिप्शन प्लान नोएडा, प्रॉपर्टी लिस्टिंग प्लान नोएडा, पीजी लिस्टिंग प्लान, ओविका प्रीमियम प्लान" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ovikaliving.com/subsription" />
        <meta property="og:title" content="Subscription Plans | OvikaLiving Property Listing" />
        <meta property="og:description" content="List your property with OvikaLiving. Choose a plan to reach thousands of tenants in Noida & Greater Noida." />
        <meta property="og:url" content="https://www.ovikaliving.com/subsription" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Subscription Plans | OvikaLiving" />
      </Helmet>
       <Subs1/>
       <Subs2/>
       <Subs3/>

    </div>
  )
}
