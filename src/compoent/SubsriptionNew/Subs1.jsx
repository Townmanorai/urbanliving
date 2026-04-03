

import React, { useState } from "react";
import "./Subs1.css";

const Subs1 = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* ===== Season Offer Section ===== */}
      <section className="season-offer-wrapper">
        <div className="season-offer-container">
          <h2 className="season-offer-title">🎉 Season Offer 🎉</h2>

          <p className="season-offer-text">
            List Unlimited Properties during this season and earn
            <span> ₹100 </span>
            for each property listed! Fill out the form to claim your reward
            today. Offer valid for a limited period only.
          </p>

          <button
            className="season-offer-btn"
            onClick={() => setShowModal(true)}
          >
            Claim Your Reward
          </button>
        </div>
      </section>

      {/* ===== Modal Popup ===== */}
      {showModal && (
        <div className="tm-modal-overlay">
          <div className="tm-modal">
            <button
              className="tm-close-btn"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            <h3 className="tm-modal-title">Claim Your Offer</h3>

            <form className="tm-form">
              <label>Name *</label>
              <input type="text" placeholder="Enter your name" required />

              <label>Phone Number *</label>
              <input type="tel" placeholder="Enter phone number" required />

              <label>Listed Property ID *</label>
              <input type="text" placeholder="Property ID" required />

              <label>UPI ID *</label>
              <input type="text" placeholder="yourname@upi" required />

              <label>Total Listed Properties *</label>
              <input type="number" placeholder="Total properties" required />

              <button type="submit" className="tm-submit-btn">
                SUBMIT
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Subs1;
