// BookingSteps.jsx
import React from "react";
import "./BookingSteps.css";

const steps = [
  {
    title: "Select Property",
    desc: "Browse and select your preferred property from our extensive listings.",
    img: '/icon1.png',
  },
  {
    title: "Choose Date & Enter Data",
    desc: "Pick your ideal dates and provide your booking details securely.",
    img: '/icon2.png',
    down: 'down'
  },
  {
    title: "Upload Your Photo",
    desc: "Share a photo for verification and a personalized experience.",
    img: '/icon3.png',
  },
  {
    title: "Make Payment",
    desc: "Complete your booking with our secure payment gateway.",
    img: '/icon4.png',
    down: 'down'
  },
];

const BookingSteps = () => (
  <section className="booking-steps-container" id="how-it-works">
    <div className="booking-steps-header">
      <h2 className="booking-steps-title">How It Works</h2>
      <div className="booking-steps-subtitle-container">
        <p className="booking-steps-subtitle">
          Book your stay in 4 easy steps using our seamless online process.
        </p>
      </div>
    </div>
    
    <div className="booking-steps-flow">
      {steps.map((step, idx) => (
        <div className={`booking-step ${step.down || ''}`} key={step.title}>
          <div className="booking-step-icon">
            <img 
              src={step.img} 
              alt={step.title} 
              className="step-icon"
              loading="lazy"
            />
            {idx < steps.length - 1 && (
              <div className="booking-step-connector" />
            )}
          </div>
          <div className="booking-step-content">
            <h3 className="booking-step-title">{step.title}</h3>
            <p className="booking-step-desc">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default BookingSteps;