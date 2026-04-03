

import React from "react";
import "./ShareProperty.css";

const ShareProperty = () => {
  return (
    <section className="share-section">
      <div className="share-overlay">
        <div className="share-content">
          <h1>
            Share your property - <br /> we renovate & share profit
          </h1>
          <p>
            Turn your unused property into a profitable rental. We handle
            renovation and management so you can earn hassle-free.
          </p>
          <div className="share-btn-group">
            <button className="share-btn share-btn-white">
              Start Earning <span className="share-arrow">→</span>
            </button>
            <a
              href="https://www.townmanor.ai/"
              target="_blank"
              rel="noreferrer"
              className="share-link"
            >
              <button className="share-btn share-btn-orange">Now</button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShareProperty;
