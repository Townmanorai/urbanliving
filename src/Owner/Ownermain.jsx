import React from 'react'
import { Helmet } from 'react-helmet'
import Owner from './Owner.jsx'
// import ManageListings from './ManageListings.jsx'
import ChooseOvika from './ChooseOvika.jsx'
// import OwnersSection from './OwnersSection.jsx'
import FAQOvika from './FAQOvika.jsx'
// import OwnweForm from './OwnerForm.jsx'
import ManageTestimonials from './ManageTestimonials.jsx'
import OvikaConsultForm from './OvikaConsultForm.jsx'
import PropertyFlowDiagram from './PropertyFlowDiagram.jsx'
// import FAQManage from './FAQManage.jsx'
function Ownermain() {
  return (
    <>
    <Helmet>
      <title>Host Your Property with OvikaLiving | Managed Rental Noida & Greater Noida</title>
      <meta name="description" content="Partner with OvikaLiving to host your homestay, B&B, or property in Noida. We handle bookings, guest verification, marketing, and payouts — you earn passive rental income." />
      <meta name="keywords" content="host property noida, managed property noida, ovikaliving owner, property management noida, earn from property noida, rental income noida, ovika host, property owner noida, managed rental homes noida, ovika partner noida, अपनी प्रॉपर्टी किराये पर दें नोएडा, प्रॉपर्टी मैनेजमेंट नोएडा, किराये से कमाई नोएडा, मकान मालिक नोएडा, ओविका होस्ट नोएडा, नोएडा में किराया आय, प्रॉपर्टी पार्टनर नोएडा, ओविका लिविंग ऑनर" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://www.ovikaliving.com/ownermain" />
      <meta name="author" content="OvikaLiving" />
      <meta name="language" content="en" />
      <meta name="geo.region" content="IN-UP" />
      <meta name="geo.placename" content="Noida" />
      <meta name="geo.position" content="28.5355;77.3910" />
      <meta name="ICBM" content="28.5355, 77.3910" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Host Your Property | OvikaLiving Managed Rentals Noida" />
      <meta property="og:description" content="OvikaLiving handles everything — bookings, guests, marketing, payouts. You earn passive income from your property in Noida & Greater Noida." />
      <meta property="og:url" content="https://www.ovikaliving.com/ownermain" />
      <meta property="og:site_name" content="OvikaLiving" />
      <meta property="og:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_IN" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@OvikaLiving" />
      <meta name="twitter:title" content="Host Your Property | OvikaLiving Noida" />
      <meta name="twitter:description" content="OvikaLiving handles everything — bookings, guests, marketing, payouts. Earn passive rental income from your property in Noida & Greater Noida." />
      <meta name="twitter:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
    </Helmet>
    <Owner/>
    <PropertyFlowDiagram/>

    {/* <ManageListings/> */}
    {/* <ChooseOvika/> */}
    {/* <OwnersSection/> */}
    <ManageTestimonials/>

    <FAQOvika/> 
    {/* <FAQManage/> */}
    {/* <OwnweForm/> */}
    <OvikaConsultForm/>

    </>
  )
}

export default Ownermain