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
      {/* Hero Header */}
      <div style={{
        width: '100%',
        background: 'transparent',
        padding: '60px 20px 32px',
        textAlign: 'center',
        fontFamily: "'Poppins', sans-serif"
      }}>
        <div style={{
          display: 'inline-flex',
          background: 'rgba(194,119,43,0.1)',
          border: '1px solid rgba(194,119,43,0.25)',
          borderRadius: '20px',
          padding: '4px 16px',
          fontSize: '0.58rem',
          color: '#c2772b',
          letterSpacing: '1.4px',
          textTransform: 'uppercase',
          fontWeight: 600,
          marginBottom: '14px',
        }}>✦ List Your Property</div>
        <h1 style={{
          fontSize: 'clamp(22px, 4vw, 38px)',
          fontWeight: 600,
          color: '#1a1209',
          fontFamily: "'Poppins', sans-serif",
          marginBottom: '10px',
          display: 'block',
        }}>Subscription Plans</h1>
        <p style={{
          fontSize: '14px',
          color: '#6b5540',
          lineHeight: 1.65,
          maxWidth: '500px',
          margin: '0 auto',
        }}>Choose the right plan to list your property and reach thousands of tenants in Noida & Greater Noida.</p>
      </div>
      <Subs1/>
      <Subs2/>
      <Subs3/>

    </div>
  )
}
