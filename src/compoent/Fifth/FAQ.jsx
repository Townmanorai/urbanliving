

import React, { useState } from "react";
import "./FAQ.css";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";

const FaqSection = () => {
  const data = [
    {
      q: "Who handles renovations ?",
      a: "OVIKA’s experienced design and project team manages every aspect of the renovation — from evaluation and planning to final execution. We ensure quality upgrades that enhance your property’s value and earning potential.",
    },
    {
      q: "How is profit calculated ?",
      a: "Profits are calculated based on the net income generated from your property after deducting operational and management costs. The agreed-upon share is then distributed transparently as per the signed agreement.",
    },
    {
      q: "Do I retain property Ownership ?",
      a: "Yes, you retain full ownership of your property. OVIKA only partners with you to renovate, manage, and share the profits generated from its use — ownership always remains with you.",
    },
    {
      q: "What types of properties are eligible ?",
      a: "Residential apartments, villas, and standalone houses located in prime or high-demand areas are generally eligible. Each property is first evaluated for its renovation and income potential.",
    },
    {
      q: "How long does the renovation process take ?",
      a: "The timeline depends on the scope of work and property condition, typically ranging from 30 to 90 days. You’ll receive a detailed schedule before signing the agreement.",
    },
    {
      q: "When do I start earning profit ?",
      a: "Earnings begin once your renovated property goes live under OVIKA’s management and starts generating revenue. Profit distribution follows the agreed schedule outlined in your partnership contract.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="faq-container">
      <h2>Frequently asked questions</h2>
      <div className="faq-list">
        {data.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleAnswer(index)}
          >
            <div className="faq-question-newmanage">
              <span>{item.q}</span>
              <span className="arrow">
                {activeIndex === index ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
              </span>
            </div>
            {activeIndex === index && (
              <div className="faq-answer">
                <p>{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqSection;
