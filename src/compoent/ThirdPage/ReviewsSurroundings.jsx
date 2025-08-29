import React from "react";
import { FaStar, FaChild } from "react-icons/fa";
import "./ReviewsSurroundings.css";

const ReviewsSurroundings = () => {
  const reviews = [
    { label: "Staff", rating: 4.8 },
    { label: "Comfort", rating: 4.6 },
    { label: "Cleanliness", rating: 4.9 },
    { label: "Facilities", rating: 4.5 },
  ];

  const surroundings = [
    "DLF Mall of India & The Great India Place",
    "Worlds of Wonder Amusement & Water Park",
    "Okhla Bird Sanctuary & Botanical Garden",
    "Film City & Cultural Centers",
  ];

  return (
    <div className="reviews-container">
      {/* Left Section - Reviews */}
      <div className="reviews-section">
        <h2 className="reviews-title">Reviews</h2>
        {reviews.map((item, index) => (
          <div className="review-row" key={index}>
            <span className="review-label">{item.label}</span>
            <div className="review-bar">
              <div
                className="review-fill"
                style={{ width: `${(item.rating / 5) * 100}%` }}
              ></div>
            </div>
            <FaStar className="review-star" />
            <span className="review-rating">{item.rating}</span>
          </div>
        ))}
      </div>

      {/* Right Section - Surroundings */}
      <div className="surroundings-section">
        <h2 className="surroundings-title">Our surroundings</h2>
        <FaChild className="surroundings-icon" />
        <ul className="surroundings-list">
          {surroundings.map((place, index) => (
            <li key={index}>{place}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReviewsSurroundings;
