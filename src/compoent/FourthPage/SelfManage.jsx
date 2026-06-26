import React from "react"
import { Helmet } from 'react-helmet'
import PropertyShare from "./PropertyShare"
import ListProperty from "./ListProperty"
// import PropertyControl from "./PropertyControl"
// import Testimonials from "./Testimonials"
import FAQ from "./FAQ"
// import PropertyShareForm from "./PropertyShareForm"
import OvikaTestimonials from "./OvikaTestimonials"
import PropertyConsultForm from "./PropertyConsultForm"
import PropertyControlSection from "./PropertyControlSection"
function SelfManage(){
    return(
        <>
        <Helmet>
          <title>List Your Property for Long-Term Rent | OvikaLiving – Noida & Greater Noida</title>
          <meta name="description" content="Self-manage your rental listing on OvikaLiving. List your PG, apartment or co-living space in Noida & Greater Noida. Free basic plan available. Reach verified tenants directly." />
          <meta name="keywords" content="self manage property noida, list property long term noida, rental listing noida, pg listing noida, ovikaliving self listing, free property listing noida, paid property listing noida, property owner noida, tenant connect noida, खुद प्रॉपर्टी लिस्ट करें नोएडा, लॉन्ग टर्म किराया नोएडा, फ्री प्रॉपर्टी लिस्टिंग नोएडा, पीजी लिस्टिंग नोएडा, किरायेदार ढूंढें नोएडा, ओविका सेल्फ लिस्टिंग, मकान लिस्ट करें नोएडा" />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://www.ovikaliving.com/selfmanage" />
          <meta name="author" content="OvikaLiving" />
          <meta name="language" content="en" />
          <meta name="geo.region" content="IN-UP" />
          <meta name="geo.placename" content="Noida" />
          <meta name="geo.position" content="28.5355;77.3910" />
          <meta name="ICBM" content="28.5355, 77.3910" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="List Your Property for Rent | OvikaLiving Noida" />
          <meta property="og:description" content="List your PG or rental property in Noida with OvikaLiving. Free & paid plans available. Connect with verified tenants." />
          <meta property="og:url" content="https://www.ovikaliving.com/selfmanage" />
          <meta property="og:site_name" content="OvikaLiving" />
          <meta property="og:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:locale" content="en_IN" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@OvikaLiving" />
          <meta name="twitter:title" content="Self-Manage Property Listing | OvikaLiving Noida" />
          <meta name="twitter:description" content="List your PG or rental property in Noida with OvikaLiving. Free & paid plans available. Connect with verified tenants directly." />
          <meta name="twitter:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
        </Helmet>
        <PropertyShare/>
        <ListProperty/>
         {/* <PropertyControl/> */}
         <PropertyControlSection/>
        <OvikaTestimonials/>
        {/* <Testimonials/>   */}
        <FAQ/>   
        {/* <PropertyShareForm/> */}
        <PropertyConsultForm/>

        </>
    )
}
export default SelfManage