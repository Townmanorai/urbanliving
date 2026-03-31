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
      <title>Nightly Stays in Noida & Greater Noida | OvikaLiving Signature</title>
      <meta name="description" content="Book premium nightly stays in Noida & Greater Noida with OvikaLiving. Fully furnished, OvikaLiving Verified properties with self check-in. Best short-term stay options for travelers & corporate guests." />
      <meta name="keywords" content="nightly stays noida, short term stay noida, short stay apartments noida, nightly rental noida, studio stay noida, corporate stay noida, serviced stay noida, ovikaliving signature stays, premium nightly stay greater noida, business stay noida, furnished short stay noida" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://www.ovikaliving.com/nightly-stays" />
      <meta property="og:title" content="Nightly Stays in Noida | OvikaLiving Signature" />
      <meta property="og:description" content="Premium nightly stays in Noida & Greater Noida. Verified, fully furnished with self check-in. Book now!" />
      <meta property="og:url" content="https://www.ovikaliving.com/nightly-stays" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Nightly Stays in Noida | OvikaLiving" />
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