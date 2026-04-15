import React from "react";
import "./Subs2.css";

const Subs2 = () => {
  const handlePlanSelect = (plan) => {
    alert(`Selected Plan: ${plan}`);
    // yahan tum payment / login / modal logic laga sakte ho
  };

  return (
    <section className="pricing-wrapper">
      <div className="pricing-header">
        <h2>Find the Perfect Plan for Your Property Needs</h2>
        <p>
          Explore our tailored pricing plans designed to meet your specific real
          estate goals. Whether you're looking to buy, sell, or invest, we offer
          flexible options that fit your budget and requirements.
        </p>
      </div>

      <div className="pricing-cards">
        {/* Free Plan */}
        <div className="pricing-card">
          <h4>Free</h4>
          <div className="pricing-price">
            ₹ 0.00 <span>/30 Days</span>
          </div>

          <button
            className="pricing-btn primary"
            onClick={() => handlePlanSelect("Free")}
          >
            Get Started
          </button>

          <ul>
            <li>30 Days</li>
            <li>10 : Number of Listing</li>
            <li>10 : Featured Listing Limit</li>
          </ul>
        </div>

        {/* Starter Plan */}
        <div className="pricing-card">
          <h4>Starter</h4>
          <div className="pricing-old">₹1000.00</div>
          <div className="pricing-price">
            ₹ 200.00 <span>/One Time</span>
          </div>

          <button
            className="pricing-btn outline"
            onClick={() => handlePlanSelect("Starter")}
          >
            Choose Plan
          </button>

          <ul>
            <li>One Time</li>
            <li>1 : Number of Listing</li>
            <li>1 : Featured Listing Limit</li>
          </ul>
        </div>

        {/* Premium Plan */}
        <div className="pricing-card premium">
          <h4 className="premium-title">Premium</h4>
          <div className="pricing-old">₹2500.00</div>
          <div className="pricing-price">
            ₹ 500.00 <span>/30 Days</span>
          </div>

          <button
            className="pricing-btn outline red"
            onClick={() => handlePlanSelect("Premium")}
          >
            Choose Plan
          </button>

          <ul>
            <li>30 Days</li>
            <li>5 : Number of Listing</li>
            <li>3 : Featured Listing Limit</li>
          </ul>
        </div>

        {/* Business Plan */}
        <div className="pricing-card">
          <h4>Business</h4>
          <div className="pricing-old">₹12500.00</div>
          <div className="pricing-price">
            ₹ 2500.00 <span>/90 Days</span>
          </div>

          <button
            className="pricing-btn outline"
            onClick={() => handlePlanSelect("Business")}
          >
            Choose Plan
          </button>

          <ul>
            <li>90 Days</li>
            <li>25 : Number of Listing</li>
            <li>18 : Featured Listing Limit</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Subs2;
