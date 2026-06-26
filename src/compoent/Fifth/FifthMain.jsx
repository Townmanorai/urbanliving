import React from 'react'
import { Helmet } from 'react-helmet'
import ShareProperty from './ShareProperty'
import WorkFlow from './WorkFlow'
import ShowCase from './ShowCase'
import FAQ from './FAQ'
import Form from './Form'
import Parterns from './Parterns'

 function FifthMain  ()  {
  return (
    <div>
      <Helmet>
        <title>Renovate & Earn | Partner with OvikaLiving – Noida & Greater Noida</title>
        <meta name="description" content="Have an unused or old property in Noida or Greater Noida? Partner with OvikaLiving — we renovate, furnish, manage tenants & share profits. Turn idle property into passive income." />
        <meta name="keywords" content="property renovation noida, renovate and earn noida, unused property partner noida, property management partner noida, old property income noida, ovikaliving renovation, passive income property noida, property partner greater noida, managed rental renovation noida, बेकार प्रॉपर्टी से कमाई नोएडा, पुरानी प्रॉपर्टी रेनोवेशन नोएडा, प्रॉपर्टी पार्टनर नोएडा, किराये से कमाई नोएडा, पैसिव इनकम प्रॉपर्टी नोएडा, खाली मकान से कमाई नोएडा, नोएडा में प्रॉपर्टी मैनेजमेंट" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ovikaliving.com/renovation" />
        <meta name="author" content="OvikaLiving" />
        <meta name="language" content="en" />
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Noida" />
        <meta name="geo.position" content="28.5355;77.3910" />
        <meta name="ICBM" content="28.5355, 77.3910" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Renovate Your Idle Property & Earn | OvikaLiving Noida" />
        <meta property="og:description" content="Partner with OvikaLiving — we renovate your unused property, manage tenants & share profits. Available in Noida & Greater Noida." />
        <meta property="og:url" content="https://www.ovikaliving.com/renovation" />
        <meta property="og:site_name" content="OvikaLiving" />
        <meta property="og:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@OvikaLiving" />
        <meta name="twitter:title" content="Renovate & Earn | OvikaLiving Noida" />
        <meta name="twitter:description" content="Partner with OvikaLiving — we renovate your unused property, manage tenants & share profits in Noida & Greater Noida." />
        <meta name="twitter:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
      </Helmet>
        <ShareProperty/>
        <WorkFlow/>
        <ShowCase/>
        <Parterns/>
        <FAQ/>
        <Form/>
    </div>
  )
}


export default FifthMain