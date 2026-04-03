
import React, { useState } from "react";
import "./ShowCase.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ShowCase = () => {
  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((prev) => (prev + 1) % 3);
  const prevSlide = () => setIndex((prev) => (prev - 1 + 3) % 3);

  const slides = [
    { before: "/before3.jpeg", after: "/after_new.png" },
    { before: "/before2.jpeg", after: "/washroom_after.png" },
    { before: "/before1.jpeg", after: "/after_bedroom.png" },
  ];

  return (
    <section className="showcase-section">
      <h2 className="showcase-title">
          Before and After <span>ShowCase</span>
      </h2>
      <p className="showcase-subtitle">
        see the incredible transformations we’ve delivered for our partners.
      </p>

      <div className="showcase-carousel">
        <button className="nav-btn left" onClick={prevSlide}>
          <FaArrowLeft />
        </button>

        <div className="showcase-wrapper">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`showcase-card ${
                index === i
                  ? "activeSlide"
                  : i === (index - 1 + slides.length) % slides.length
                  ? "lastSlide"
                  : "nextSlide"
              }`}
            >
              <div className="image-pair">
                <div className="image-box">
                  <img src={slide.before} alt="Before" />
                  <span className="badge">Before</span>
                </div>
                <div className="image-box">
                  <img src={slide.after} alt="After" />
                  <span className="badge after">After</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="nav-btn right" onClick={nextSlide}>
          <FaArrowRight />
        </button>
      </div>
    </section>
  );
};

export default ShowCase;
