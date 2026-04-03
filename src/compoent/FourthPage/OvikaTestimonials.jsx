

import React, { useEffect, useState } from 'react';
import './OvikaTestimonials.css';

const OvikaTestimonials = () => {
  const testimonialsData = [
    {
      name: "Deepali Sonker",
      rating: 5,
      heading: "Simple & Well-Structured Listing Process",
      text: "Creating my listing was very straightforward. Uploading photos, adding property details, and selecting amenities was easy and well organized. The platform guides you step by step, so nothing feels confusing or overwhelming. I was able to complete my listing quickly without any technical issues. A very smooth experience overall."
    },
    {
      name: "Ritik Singh",
      rating: 5,
      heading: "Instant Publishing & Great Visibility",
      text: "I loved how fast my property went live. Setting the rent and terms was simple, and the listing was published instantly. Within a short time, my property started getting visibility and enquiries. There was no long waiting or complicated approval process, which makes this platform very owner-friendly."
    },
    {
      name: "Shashwat Pandey",
      rating: 5,
      heading: "Easy Enquiry Management from Dashboard",
      text: "Managing enquiries from one dashboard saves a lot of time. All tenant enquiries come directly to the dashboard, making it easy to track, respond, and communicate. Scheduling viewings on my own terms gives full control as an owner. The entire system feels professional, efficient, and designed for convenience."
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
    <div className="ovika-testimonials-section-unique">
      <div className="ovika-testimonials-header-unique">
        <h2 className="ovika-testimonials-title-unique">
          Loved by Property <span className="ovika-orange-text-unique">Owners</span>
        </h2>
        <p className="ovika-testimonials-subtitle-unique">
          Real stories from partners who trust Ovika
        </p>
      </div>

      {/* ================= DESKTOP GRID ================= */}
      <div className="ovika-desktop-grid-unique">
        {testimonialsData.map((item, index) => (
          <div key={index} className="ovika-testimonial-card-desktop-unique">
            <div className="ovika-stars-unique">
              {[...Array(item.rating)].map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>

            {/* Review Heading */}
            <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>
              {item.heading}
            </h4>

            {/* Review Content */}
            <p className="ovika-testimonial-content-unique">{item.text}</p>

            <h3 className="ovika-testimonial-author-unique">{item.name}</h3>
          </div>
        ))}
      </div>

      {/* ================= MOBILE SLIDER ================= */}
      <div className="ovika-mobile-slider-unique">
        <div className="ovika-testimonial-card-mobile-unique">
          <div className="ovika-stars-unique">
            {[...Array(testimonialsData[currentIndex].rating)].map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>

          {/* Mobile Heading */}
          <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "10px" }}>
            {testimonialsData[currentIndex].heading}
          </h4>

          <p className="ovika-testimonial-content-unique">
            {testimonialsData[currentIndex].text}
          </p>

          <h3 className="ovika-testimonial-author-unique">
            {testimonialsData[currentIndex].name}
          </h3>
        </div>

        <div className="ovika-dots-unique">
          {testimonialsData.map((_, index) => (
            <span
              key={index}
              className={`ovika-dot-unique ${
                index === currentIndex ? 'ovika-dot-active-unique' : ''
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OvikaTestimonials;
