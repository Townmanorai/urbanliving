// BookingSteps.jsx
import React from "react";
import "./BookingSteps.css";
import Divider from "./DIvider";

// Import icons from react-icons (example: Font Awesome & Material icons)
import { FaHome, FaCalendarAlt, FaUpload, FaCreditCard } from "react-icons/fa";
import { BsCameraFill } from "react-icons/bs";

const steps = [
  {
    title: "Select Property",
    desc: "Browse and select your preferred property from our listings.",
    icon: <FaHome size={54} color="#a52b2b" />
  
  },
  {
    title: "Choose Date and Enter Data",
    desc: "Pick your dates and provide your booking details securely.",
    icon: <FaCalendarAlt size={54} color="#a52b2b"/>,
    down: "down",
  },
  {
    title: "Upload Your Photo",
    desc: "Upload a photo for verification and a personalized experience.",
    icon:<BsCameraFill size={54} color="#a52b2b"  />
  },
  {
    title: "Make Payment",
    desc: "Pay securely and receive instant booking confirmation.",
    icon: <FaCreditCard size={54} color="#a52b2b" />,
    down: "down",
  },
];

const BookingSteps = () => (
  <div className="booking-steps-container">
    <Divider text="How We Work" />
    <p className="booking-steps-subtitle">
      Book your stay in 4 easy steps using our seamless online process.
    </p>
    <div className="booking-steps-flow">
      {steps.map((step, idx) => (
        <div className={`booking-step ${step.down}`} key={step.title}>
          <div className="booking-step-icon">{step.icon}</div>
          <div className="booking-step-content">
            <h3 className="booking-step-title">{step.title}</h3>
            <p className="booking-step-desc">{step.desc}</p>
          </div>
          {idx < steps.length - 1 && (
            <div className="booking-step-dotted-line" />
          )}
        </div>
      ))}
    </div>
  </div>
);

export default BookingSteps;
