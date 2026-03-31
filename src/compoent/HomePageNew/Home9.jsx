import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import "./Home9.css";

const accommodations = [
  {
    id: 1,
    title: "PGs",
    description: "Budget-friendly rooms, perfect for solo travelers.",
    image: "./pg3.png",
    alt: "PG Room",
    filterPath: "/properties?rentalType=short&category=PG",
  },
  {
    id: 2,
    title: "Apartments & Villas",
    description: "Fully furnished, private spaces for families & groups. (Premium and Economy Stays)",
    image: "./apartment1.jpeg",
    alt: "Apartment Living Room",
    filterPath: "/properties?rentalType=short&category=Economy Stay",
  },
  {
    id: 3,
    title: "Signature Stays",
    description: "Luxury homes with premium amenities. Designed for comfort and convenience.",
    image: "./signature1.png",
    alt: "Luxury Suite",
    filterPath: "/properties?rentalType=short&category=Premium Stay",
  },
];

const Home9 = () => {
  const navigate = useNavigate();

  return (
    <>
    <Helmet>
      <title>Nightly Stays in Noida & Greater Noida | Short-Term Rental | Daily Rate | OvikaLiving</title>
      <meta name="description" content="Book the best nightly & short-term stays in Noida & Greater Noida with OvikaLiving. Fully furnished, verified properties with self check-in. Best daily rate stays for travelers, corporate guests & remote workers. No brokerage!" />
      <meta name="keywords" content="nightly stays noida, short term stay noida, short stay apartments noida, nightly rental noida, studio stay noida, corporate stay noida, serviced stay noida, ovikaliving signature stays, premium nightly stay greater noida, business stay noida, furnished short stay noida, daily rate stay noida, short term rental noida, corporate accommodation noida, travel stay noida, overnight stay noida, weekend stay noida, short term pg noida, short stay furnished flat noida, nightly rental greater noida, best short stay noida under 20000, verified short stay noida, no brokerage short stay noida, short term furnished apartment noida, daily rental apartment noida, business trip stay noida, remote worker short stay noida, startup founder nightly stay noida, corporate employee short stay noida, digital nomad stay noida, IT professional nightly stay noida, pg sector 62 noida, pg sector 63 noida, pg sector 18 noida, pg sector 16 noida, pg sector 50 noida, pg sector 51 noida, pg sector 52 noida, pg sector 44 noida, pg sector 45 noida, pg sector 46 noida, pg sector 47 noida, pg sector 48 noida, pg sector 49 noida, pg sector 15 noida, pg sector 22 noida, pg sector 27 noida, pg sector 29 noida, pg sector 30 noida, pg sector 32 noida, pg sector 33 noida, pg sector 34 noida, pg sector 35 noida, pg sector 36 noida, pg sector 37 noida, pg sector 38 noida, pg sector 39 noida, pg sector 40 noida, pg sector 41 noida, pg sector 42 noida, pg sector 43 noida, pg sector 53 noida, pg sector 54 noida, pg sector 55 noida, pg sector 56 noida, pg sector 57 noida, pg sector 58 noida, pg sector 59 noida, pg sector 60 noida, pg sector 61 noida, pg sector 64 noida, pg sector 65 noida, pg sector 66 noida, pg sector 68 noida, pg sector 70 noida, pg sector 71 noida, pg sector 72 noida, pg sector 74 noida, pg sector 75 noida, pg sector 76 noida, pg sector 77 noida, pg sector 78 noida, pg sector 100 noida, pg sector 104 noida, pg sector 105 noida, pg sector 107 noida, pg sector 108 noida, pg sector 110 noida, pg sector 119 noida, pg sector 120 noida, pg sector 121 noida, pg sector 122 noida, pg sector 125 noida, pg sector 126 noida, pg sector 128 noida, pg sector 130 noida, pg sector 131 noida, pg sector 132 noida, pg sector 133 noida, pg sector 134 noida, pg sector 135 noida, pg sector 136 noida, pg sector 137 noida, short stay knowledge park greater noida, short stay alpha greater noida, short stay beta greater noida, short stay gamma greater noida, short stay omega greater noida, short stay pari chowk greater noida, short stay greater noida west, short stay noida extension, नोएडा में शॉर्ट स्टे, नाइटली स्टे नोएडा, कॉर्पोरेट स्टे नोएडा, डेली रेंटल नोएडा, रिमोट वर्कर शॉर्ट स्टे, शॉर्ट टर्म रेंटल नोएडा, furnished flat under 25000 noida, studio apartment noida, 1bhk short stay noida, 2bhk short stay noida, fully furnished short stay noida, serviced apartment noida, private room short stay noida, wifi included short stay noida, ac room short stay noida, housekeeping short stay noida, 24x7 security short stay noida, cctv short stay noida, power backup short stay noida, best nightly stay noida under 20000, fully furnished nightly stay noida no brokerage, verified nightly stay noida" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://www.ovikaliving.com/nightly-stays" />
      <meta name="author" content="OvikaLiving" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="7 days" />
      <meta name="language" content="en" />
      <meta name="geo.region" content="IN-UP" />
      <meta name="geo.placename" content="Noida" />
      <meta name="geo.position" content="28.5355;77.3910" />
      <meta name="ICBM" content="28.5355, 77.3910" />
      <meta property="og:title" content="Nightly Stays in Noida | Best Short-Term Rental | Daily Rate | OvikaLiving" />
      <meta property="og:description" content="Premium nightly & short-term stays in Noida & Greater Noida. Verified, fully furnished with self check-in. Best daily rate. No brokerage. Book now!" />
      <meta property="og:url" content="https://www.ovikaliving.com/nightly-stays" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="OvikaLiving" />
      <meta property="og:image" content="https://www.ovikaliving.com/og-image.jpg" />
      <meta property="og:locale" content="en_IN" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Nightly Stays Noida | Short-Term Rental | OvikaLiving" />
      <meta name="twitter:description" content="Best nightly & short-term stays in Noida & Greater Noida. Daily rate, verified, fully furnished. No brokerage. Book now!" />
      <meta name="twitter:image" content="https://www.ovikaliving.com/og-image.jpg" />
    </Helmet>
    <section className="nightly-stays">
      <div className="nightly-stays__header">
        <h1 className="nightly-stays__title">
          Nightly <span className="nightly-stays__title--highlight">Stays</span>
        </h1>
        <p className="nightly-stays__subtitle">
          Choose your type of accommodation for short Visits,
          <br />
          business trips, or travel.
        </p>
      </div>

      <div className="nightly-stays__grid">
        {accommodations.map((item) => (
          <div className="nightly-stays__card" key={item.id}>

            {/* Desktop only — title above image */}
            <div className="nightly-stays__card-top">
              <h2 className="nightly-stays__card-title">{item.title}</h2>
            </div>

            <div className="nightly-stays__image-wrapper">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.alt}
                  className="nightly-stays__image"
                />
              ) : (
                <div className="nightly-stays__image-placeholder">
                  <span>{item.alt}</span>
                </div>
              )}
            </div>

            <div className="nightly-stays__card-bottom">
              {/* Mobile pe title yahan dikhega */}
              <h2 className="nightly-stays__card-title nightly-stays__card-title--mobile">
                {item.title}
              </h2>
              <p className="nightly-stays__card-desc">{item.description}</p>
              <button
                className="nightly-stays__btn"
                onClick={() => navigate(item.filterPath)}
              >
                View All Listings <span className="nightly-stays__btn-arrow">→</span>
              </button>
            </div>

          </div>
        ))}
      </div>
    </section>
    </>
  );
};

export default Home9;