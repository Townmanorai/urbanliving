
import React from "react";
import { Helmet } from "react-helmet";
import "./About.css";

const AboutUs = () => {
  return (
    <div className="about-wrapper">
      <Helmet>
        <title>About OvikaLiving | India's Flexible Stay Platform for PG & Co-Living in Noida</title>
        <meta name="description" content="OvikaLiving is a technology-driven flexible stay platform in Noida & Greater Noida. Verified PG, co-living spaces, furnished apartments & managed rental homes for remote workers, startup founders, interns, working professionals & students." />
        <meta name="keywords" content="about ovikaliving, ovika living noida, ovikaliving platform, flexible stay platform noida, managed rental homes noida, co living platform noida, pg platform noida, smart rental living noida, urban living noida, ovika co living, ovika rental platform, ovikaliving brand, who is ovikaliving, ovika flexible stay, technology driven rental platform noida, verified pg platform noida, co living platform greater noida, furnished apartment platform noida, managed stay platform noida, ovikaliving mission, ovikaliving vision, best pg platform noida, best co living platform noida, best rental platform noida, ovika noida, ovika greater noida, ovikaliving story, ovikaliving team, remote workers platform noida, startup founders platform noida, interns platform noida, digital nomads platform noida, it professionals platform noida, corporate employees platform noida, freelancers platform noida, mba students platform noida, working professionals platform noida, students platform noida, short-term rentals platform noida, furnished apartments platform noida, co-living spaces platform noida, monthly rental platform noida, pg platform sector 62 noida, pg platform sector 63 noida, pg platform sector 18 noida, pg platform sector 16 noida, pg platform sector 50 noida, pg platform sector 62 noida, pg platform greater noida, pg platform knowledge park greater noida, pg platform alpha greater noida, pg platform beta greater noida, pg platform greater noida west, pg platform noida extension, ओविका लिविंग के बारे में, ओविका लिविंग नोएडा, ओविका लिविंग प्लेटफॉर्म, फ्लेक्सिबल स्टे प्लेटफॉर्म नोएडा, पीजी प्लेटफॉर्म नोएडा, को-लिविंग प्लेटफॉर्म नोएडा, मैनेज्ड रेंटल नोएडा, स्मार्ट लिविंग नोएडा, अर्बन लिविंग नोएडा, ओविका के बारे में जानकारी, नोएडा में पीजी, को लिविंग नोएडा, रिमोट वर्कर नोएडा, स्टार्टअप फाउंडर नोएडा, इंटर्न के लिए पीजी, verified pg noida, verified co living noida, no brokerage pg noida, no brokerage co living noida, best flexible stay noida, best short term rental noida, best monthly rental noida" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ovikaliving.com/about" />
        <meta name="author" content="OvikaLiving" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />
        <meta name="language" content="en" />
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Noida" />
        <meta name="geo.position" content="28.5355;77.3910" />
        <meta name="ICBM" content="28.5355, 77.3910" />
        <meta property="og:title" content="About OvikaLiving | India's Flexible Stay Platform for PG & Co-Living in Noida" />
        <meta property="og:description" content="OvikaLiving — India's #1 flexible stay platform. Verified PG, co-living & furnished stays in Noida & Greater Noida for remote workers, startup founders & professionals." />
        <meta property="og:url" content="https://www.ovikaliving.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="OvikaLiving" />
        <meta property="og:image" content="https://www.ovikaliving.com/og-image.jpg" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About OvikaLiving | Flexible Stay Platform Noida" />
        <meta name="twitter:description" content="OvikaLiving — flexible stay platform in Noida & Greater Noida. Verified PG, co-living, furnished apartments for remote workers, startup founders & students." />
        <meta name="twitter:image" content="https://www.ovikaliving.com/og-image.jpg" />
      </Helmet>
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <div className="about-hero-eyebrow">✦ Our Story</div>
          <h1 className="about-main-title">About <span>OvikaLiving</span></h1>
          <p className="about-hero-sub">India's technology-driven flexible stay platform — connecting guests with verified, curated homes.</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="about-content-section">
        <div className="about-content-container">

          {/* Introduction */}
          <div className="about-intro-box">
            <p className="about-intro-text">
              OvikaLiving is a technology-driven marketplace for short-term stays and
              hosting, built to simplify how people book quality accommodations
              and how property owners earn from their homes. We verify every property,
              support every guest, and make every stay seamless.
            </p>
          </div>

          {/* Two Column Features */}
          <div className="about-features-grid">
            <div className="about-feature-box">
              <div className="feature-header">
                <div className="feature-icon-circle">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                </div>
                <h3 className="feature-heading">For Guests</h3>
              </div>
              <ul className="feature-description">
                <li>Curated, verified short-term rental homes</li>
                <li>Business travel, leisure &amp; extended stays</li>
                <li>Instant booking with transparent pricing</li>
                <li>24/7 guest support throughout your stay</li>
                <li>Flexible nightly &amp; monthly options</li>
              </ul>
            </div>

            <div className="about-feature-box">
              <div className="feature-header">
                <div className="feature-icon-circle">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <h3 className="feature-heading">For Property Owners</h3>
              </div>
              <ul className="feature-description">
                <li>Simple, transparent listing platform</li>
                <li>Professional property management support</li>
                <li>End-to-end guest handling &amp; communication</li>
                <li>Maximise returns with dynamic pricing</li>
                <li>Ovika Verified badge for trust &amp; visibility</li>
              </ul>
            </div>
          </div>

          {/* Mission Section */}
          <div className="about-mission-box">
            <h2 className="mission-title">Our Mission</h2>
            <p className="mission-description">
              To create a trusted ecosystem where guests enjoy seamless stays and hosts unlock
              better returns — powered by technology, local expertise, and an unwavering
              focus on quality. Every stay should feel like home.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;