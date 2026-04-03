
import React from "react";
import "./WorkFlow.css";

const HowItWorks = () => {
  const steps = [
    {
      icon: "/bxs_home.png", // placeholder — replace with your logo
      title: "Share your property details",
      text: "Submit your property details and let us evaluate its potential. After the evaluation, our team presents a detailed proposal outlining renovation plans and profit-sharing terms. Once the agreement is mutually signed, we move ahead to transform your property.",
    },
    {
      icon: "/ion_hammer.png",
      title: "We renovate and manage",
      text: "Our experts redesign, renovate, and fully manage your property to enhance its appeal and earning potential. From interiors to operations, everything is handled end-to-end by OVIKA to ensure quality, consistency, and superior guest experience.",
    },
    {
      icon: "/tabler_coin-rupee-filled.png",
      title: "Earn and share profit",
      text: "Once the property goes live, you start earning a share of the generated profits. Enjoy regular updates, transparent reporting, and steady returns — while we take care of everything else.",
    },
  ];

  return (
    <section className="how-it-works">
      <h2 className="how-title-renovation">
        How It <span>Works</span>
      </h2>
      <p className="how-subtitle">
      A seamless, transparent process — share your property, we renovate and
manage it, and you earn from shared profits.
      </p>

      <div className="how-cards">
        {steps.map((step, index) => (
          <div className="how-card-renovation" key={index}>
            <div className="icon-circle">
              <img src={step.icon} alt={step.title} />
            </div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
