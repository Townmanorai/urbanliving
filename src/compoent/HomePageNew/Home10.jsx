import React from "react";
import "./Home10.css";

const accommodations = [
  {
    id: 1,
    title: "PGs",
    description: "Budget-friendly rooms, perfect for solo travelers & students.",
    image: "./pg2.jpeg", // src yahan daalo
    alt: "PG Room",
  },
  {
    id: 2,
    title: "Apartments & Villas",
    description: "Fully furnished, private homes for families & groups.",
    image: "./apartmnet2.png", // src yahan daalo
    alt: "Apartment Living Room",
  },
  {
    id: 3,
    title: "Signature Stays",
    description: "Luxury homes with premium amenities. Designed for comfort and convenience.",
    image: "./signature2.jpeg", // src yahan daalo
    alt: "Luxury Suite",
  },
];

const Home10 = () => {
  return (
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
            <div className="monthly-rentals__card-top">
              <h2 className="monthly-rentals__card-title">{item.title}</h2>
              <p className="monthly-rentals__card-desc">{item.description}</p>
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

            <div className="monthly-rentals__card-bottom">
              <h2 className="monthly-rentals__card-title">{item.title}</h2>
              <p className="monthly-rentals__card-desc">{item.description}</p>
              <button className="monthly-rentals__btn">
                View All Listings{" "}
                <span className="monthly-rentals__btn-arrow">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Home10;