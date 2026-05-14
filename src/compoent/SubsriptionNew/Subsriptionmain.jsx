import React from 'react'
import { Helmet } from 'react-helmet'
import Subs1 from "./Subs1"
import Subs2 from './Subs2'
import Subs3 from './Subs3'

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
      <div style={{
        width: '100%',
        padding: 'clamp(32px, 6vw, 56px) 20px 0px',
        textAlign: 'center',
        fontFamily: "'Poppins', sans-serif"
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(194,119,43,0.1)',
          border: '1px solid rgba(194,119,43,0.25)',
          borderRadius: '20px',
          padding: '5px 18px',
          fontSize: '0.6rem',
          color: '#c2772b',
          letterSpacing: '1.4px',
          textTransform: 'uppercase',
          fontWeight: 700,
          marginBottom: '14px',
        }}>
          ✦ Verified Tenant Leads
        </div>

        <h1 style={{
          fontSize: 'clamp(24px, 5vw, 44px)',
          fontWeight: 800,
          color: '#1a1209',
          fontFamily: "'Poppins', sans-serif",
          marginBottom: '16px',
          lineHeight: 1.18,
          letterSpacing: '-0.5px',
        }}>
          Find Tenants Faster. Pay Only for Leads.
        </h1>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '0px',
        }}>
          {[
            "✅ Verified Tenants",
            "✅ Full Contact Details",
            "✅ All Property Types",
            "✅ NCR",
          ].map((tag) => (
            <span key={tag} style={{
              background: '#fff',
              border: '1px solid #ddd0be',
              borderRadius: '20px',
              padding: '5px 13px',
              fontSize: 'clamp(11px, 1.5vw, 12.5px)',
              color: '#6b5540',
              fontWeight: 600,
            }}>{tag}</span>
          ))}
        </div>
      </div>

      <Subs2 />
      <Subs1 />
      <Subs3 />
    </div>
  )
}
