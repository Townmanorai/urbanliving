

import React, { useEffect, useState } from 'react';
import './ManageTestimonials.css';

const ManageTestimonials = () => {
  const testimonialsData = [
    {
      name: "Shivam Shukla",
      rating: 5,
      heading: "Smooth Onboarding Experience",
      text: "Listing my property on this platform was surprisingly easy. The registration and KYC process was very clear and well guided. Uploading documents and property details took hardly any time. What I liked the most was the dashboard — everything from bookings to earnings is visible in one place. Overall, a very smooth and professional experience for any property owner."
    },
    {
      name: "Rohit Gupta",
      rating: 5,
      heading: "Hassle-Free Management & Support",
      text: "Managing bookings has become completely stress-free. Accepting or declining bookings is simple, and the guest chat feature helps in clear communication. The platform takes care of the entire booking flow, saving a lot of time. The support team is responsive and professional whenever needed."
    },
    {
      name: "Arsalaan Ahmed",
      rating: 5,
      heading: "Timely Payments & Trustworthy Platform",
      text: "Payments are transparent and always on time. After guest checkout, payouts were processed smoothly and credited within the promised timeline. The earnings dashboard clearly shows all income details, which builds trust. The platform feels safe and genuinely designed for property owners."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="manage-testimonials-section">
      <div className="manage-testimonials-header">
        <h2 className="manage-testimonials-title">
          Loved by Property <span className="manage-orange-text">Owners & Hosts</span>
        </h2>
        <p className="manage-testimonials-subtitle">
          Real experiences from people who trust our platform
        </p>
      </div>

      {/* ================= DESKTOP GRID ================= */}
      <div className="manage-desktop-grid">
        {testimonialsData.map((item, index) => (
          <div key={index} className="manage-testimonial-card-desktop">
            <div className="manage-stars">
              {[...Array(item.rating)].map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>

            {/* Review Heading */}
            <h4 style={{ fontSize: "17px", fontWeight: "600", marginBottom: "15px" }}>
              {item.heading}
            </h4>

            {/* Review Content */}
            <p className="manage-testimonial-content">{item.text}</p>

            <h3 className="manage-testimonial-author">{item.name}</h3>
          </div>
        ))}
      </div>

      {/* ================= MOBILE SLIDER ================= */}
      <div className="manage-mobile-slider">
        <div className="manage-testimonial-card-mobile">
          <div className="manage-stars">
            {[...Array(testimonialsData[currentIndex].rating)].map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>

          {/* Mobile Heading */}
          <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>
            {testimonialsData[currentIndex].heading}
          </h4>

          <p className="manage-testimonial-content">
            {testimonialsData[currentIndex].text}
          </p>

          <h3 className="manage-testimonial-author">
            {testimonialsData[currentIndex].name}
          </h3>
        </div>

        <div className="manage-dots">
          {testimonialsData.map((_, index) => (
            <span
              key={index}
              className={`manage-dot ${index === currentIndex ? 'manage-dot-active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageTestimonials;
