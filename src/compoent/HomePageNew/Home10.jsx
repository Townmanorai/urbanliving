import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import "./Home10.css";

const accommodations = [
  {
    id: 1,
    title: "PGs",
    description: "Budget-friendly rooms, perfect for solo travelers & students.",
    image: "./pg2.jpeg",
    alt: "PG Room",
    filterPath: "/properties?rentalType=long&category=PG",
  },
  {
    id: 2,
    title: "Apartments & Villas",
    description: "Fully furnished, private homes for families & groups.(Premium and Economy Stays)",
    image: "./apartmnet2.png",
    alt: "Apartment Living Room",
    filterPath: "/properties?rentalType=long&category=Economy Stay",
  },
  {
    id: 3,
    title: "Signature Stays",
    description: "Luxury homes with premium amenities. Designed for comfort and convenience.",
    image: "./signature2.jpeg",
    alt: "Luxury Suite",
    filterPath: "/properties?rentalType=long&category=Premium Stay",
  },
];

const Home10 = () => {
  const navigate = useNavigate();

  return (
    <>
    <Helmet>
      <title>Monthly Rentals in Noida & Greater Noida | Furnished PG & Co-Living | OvikaLiving</title>
      <meta name="description" content="Find the best monthly rental PG and co-living spaces in Noida & Greater Noida. Fully furnished, managed properties with flexible lease. Best monthly accommodation for working professionals & students." />
      <meta name="keywords" content="monthly rentals noida, monthly stay rooms noida, monthly pg in noida, co living monthly noida, furnished apartment monthly rent noida, monthly rental homes greater noida, pg with monthly rent noida, flexible stay noida, managed monthly rentals noida, affordable monthly pg noida, monthly co living spaces noida" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://www.ovikaliving.com/monthly-rentals" />
      <meta property="og:title" content="Monthly Rentals in Noida | PG & Co-Living | OvikaLiving" />
      <meta property="og:description" content="Best monthly PG & co-living in Noida. Fully furnished, verified, flexible lease. No brokerage. Book now!" />
      <meta property="og:url" content="https://www.ovikaliving.com/monthly-rentals" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Monthly Rentals Noida | OvikaLiving" />
    </Helmet>
    <section className="monthly-rentals">
      <div className="monthly-rentals__header">
        <h1 className="monthly-rentals__title">
          Monthly <span className="monthly-rentals__title--highlight">Rentals</span>
        </h1>
        <p className="monthly-rentals__subtitle">
          Choose your type of accommodation for long-term stays,
          <br />
          ideal for students, professionals, and families.
        </p>
      </div>

      <div className="monthly-rentals__grid">
        {accommodations.map((item) => (
          <div className="monthly-rentals__card" key={item.id}>

            {/* Desktop only — title above image */}
            <div className="monthly-rentals__card-top">
              <h2 className="monthly-rentals__card-title">{item.title}</h2>
            </div>

            <div className="monthly-rentals__image-wrapper">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.alt}
                  className="monthly-rentals__image"
                />
              ) : (
                <div className="monthly-rentals__image-placeholder">
                  <span>{item.alt}</span>
                </div>
              )}
            </div>

            {/* Desktop + Mobile bottom — title shown here on mobile */}
            <div className="monthly-rentals__card-bottom">
              <h2 className="monthly-rentals__card-title monthly-rentals__card-title--mobile">
                {item.title}
              </h2>
              <p className="monthly-rentals__card-desc">{item.description}</p>
              <button
                className="monthly-rentals__btn"
                onClick={() => navigate(item.filterPath)}
              >
                View All Listings{" "}
                <span className="monthly-rentals__btn-arrow">→</span>
              </button>
            </div>

          </div>
        ))}
      </div>
    </section>
    </>
  );
};

export default Home10;