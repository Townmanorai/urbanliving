
// import React from "react";
// import "./About.css";

// const AboutUs = () => {
//   return (
//     <section className="about-container">
//       <h1 className="about-title">About OVIKA</h1>

//       <p className="about-text">
//         OVIKA is a technology-driven marketplace for short-term stays and
//         hosting, built to simplify how people book quality accommodations and
//         how property owners earn from their homes.
//       </p>

//       <p className="about-text">
//         For guests, OVIKA offers thoughtfully curated short-term rental homes
//         designed for comfort, convenience, and reliability—whether for business
//         travel, leisure, or extended stays.
//       </p>

//       <p className="about-text">
//         For property owners, OVIKA provides a simple and transparent platform to
//         list, manage, and monetize properties through short-term rentals, with
//         professional support and end-to-end assistance.
//       </p>

//       <p className="about-text">
//         Our mission is to create a trusted ecosystem where guests enjoy seamless
//         stays and hosts unlock better returns—powered by technology, local
//         expertise, and a focus on quality.
//       </p>
//     </section>
//   );
// };

// export default AboutUs;
import React from "react";
import { Helmet } from "react-helmet";
import "./About.css";

const AboutUs = () => {
  return (
    <div className="about-wrapper">
      <Helmet>
        <title>About OvikaLiving | Best PG & Co-Living Platform in Noida & Greater Noida</title>
        <meta name="description" content="OvikaLiving is a technology-driven platform for modern rental living in Noida & Greater Noida. We offer verified PG, co-living spaces, furnished apartments & managed rental homes for working professionals and students." />
        <meta name="keywords" content="about ovikaliving, ovika living noida, ovikaliving platform, managed rental homes noida, co living platform noida, pg platform noida, smart rental living, urban living noida, ovika co living, ovika rental platform" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ovikaliving.com/about" />
        <meta property="og:title" content="About OvikaLiving | PG & Co-Living Platform Noida" />
        <meta property="og:description" content="OvikaLiving — verified PG, co-living & furnished stays in Noida & Greater Noida. Modern rental living platform." />
        <meta property="og:url" content="https://www.ovikaliving.com/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About OvikaLiving | Noida" />
      </Helmet>
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-main-title">About OVIKA</h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="about-content-section">
        <div className="about-content-container">
          {/* Introduction */}
          <div className="about-intro-box">
            <p className="about-intro-text">
              OVIKA is a technology-driven marketplace for short-term stays and
              hosting, built to simplify how people book quality accommodations
              and how property owners earn from their homes.
            </p>
          </div>

          {/* Two Column Features */}
          <div className="about-features-grid">
            <div className="about-feature-box">
              <div className="feature-header">
                <div className="feature-icon-circle">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                </div>
                <h3 className="feature-heading">For Guests</h3>
              </div>
              <p className="feature-description">
                OVIKA offers thoughtfully curated short-term rental homes
                designed for comfort, convenience, and reliability—whether for
                business travel, leisure, or extended stays.
              </p>
            </div>

            <div className="about-feature-box">
              <div className="feature-header">
                <div className="feature-icon-circle">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <h3 className="feature-heading">For Property Owners</h3>
              </div>
              <p className="feature-description">
                  For property owners, OVIKA provides a simple and transparent platform to
         list, manage, and monetize properties through short-term rentals, with
         professional support and end-to-end assistance.
              </p>
            </div>
          </div>

          {/* Mission Section */}
          <div className="about-mission-box">
            <h2 className="mission-title">Our Mission</h2>
            <p className="mission-description">
              Our mission is to create a trusted ecosystem where guests enjoy
              seamless stays and hosts unlock better returns—powered by
              technology, local expertise, and a focus on quality.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;