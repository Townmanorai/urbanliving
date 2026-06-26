import React from 'react'
import { Helmet } from 'react-helmet'
import Subs1 from "./Subs1"
import Subs2 from './Subs2'
import Subs3 from './Subs3'
import './Subsriptionmain.css'

export const Subsriptionmain = () => {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #fdf7ee 0%, #f5ead6 60%, #ede4cf 100%)',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <Helmet>
        <title>Buy Tenant Leads | Get Verified Enquiries for Your Property | OvikaLiving</title>
        <meta name="description" content="Buy verified tenant leads for your PG, flat, villa or co-living space in Noida & Greater Noida. Get direct enquiries from genuine tenants actively looking for accommodation. Pay per lead — no subscription needed." />
        <meta name="keywords" content="buy tenant leads Noida, property owner leads, OvikaLiving leads, tenant enquiries Noida, rental property leads, PG leads Noida, flat leads Greater Noida, verified tenant leads, lead purchase OvikaLiving" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ovikaliving.com/buy-leads" />
        <meta name="author" content="OvikaLiving" />
        <meta name="language" content="en" />
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Noida" />
        <meta name="geo.position" content="28.5355;77.3910" />
        <meta name="ICBM" content="28.5355, 77.3910" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Buy Tenant Leads | Verified Enquiries for Property Owners | OvikaLiving" />
        <meta property="og:description" content="Get direct, verified tenant leads for your PG or flat in Noida. Pay per lead. Start connecting with genuine tenants today on OvikaLiving." />
        <meta property="og:url" content="https://www.ovikaliving.com/buy-leads" />
        <meta property="og:site_name" content="OvikaLiving" />
        <meta property="og:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@OvikaLiving" />
        <meta name="twitter:title" content="Buy Tenant Leads | OvikaLiving" />
        <meta name="twitter:description" content="Get verified tenant leads for your property in Noida. Pay per lead. No subscription." />
        <meta name="twitter:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
      </Helmet>

      {/* ── Hero ── */}
      <div className="bl-hero">
        <div className="bl-hero-badge">✦ Verified Tenant Leads</div>
        <h1 className="bl-hero-title">Find Tenants Faster.<br className="bl-hero-br" /> Pay Only for Leads.</h1>
        <div className="bl-hero-tags">
          {["✅ Verified Tenants","✅ Full Contact Details","✅ All Property Types","✅ NCR"].map(t => (
            <span key={t} className="bl-hero-tag">{t}</span>
          ))}
        </div>
      </div>

      <Subs2 />
      <Subs1 />
      <Subs3 />
    </div>
  )
}
