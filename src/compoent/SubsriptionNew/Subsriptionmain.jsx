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
        <title>Buy Leads | OvikaLiving – Get Tenant Enquiries for Your Property</title>
        <meta name="description" content="Buy verified tenant leads for your property in Noida & Greater Noida. Get direct enquiries from genuine tenants looking for PG, flats, villas and more." />
        <meta name="keywords" content="buy tenant leads noida, property owner leads, ovikaliving leads, tenant enquiries noida, rental property leads, pg flat villa leads noida" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ovikaliving.com/buy-leads" />
        <meta property="og:title" content="Buy Leads | OvikaLiving – Tenant Enquiries for Property Owners" />
        <meta property="og:description" content="Get direct tenant leads for your property. Choose a plan and start receiving verified enquiries today." />
        <meta property="og:url" content="https://www.ovikaliving.com/buy-leads" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Buy Leads | OvikaLiving" />
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
