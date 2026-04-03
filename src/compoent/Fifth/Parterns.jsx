

import React, { useState, useEffect } from "react";

const PartnersSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const reviews = [
    {
      stars: 5,
      heading: "From Unused Property to Steady Income",
      text: "My property was lying unused for months, and I didn’t know what to do with it. The team took complete responsibility — from maintenance to interior improvements. They transformed the space into something guests actually wanted to stay in. After that, they handled everything related to renting and operations. Today, the property is generating regular income, and profit sharing is clear and fair. I’m genuinely happy with this partnership.",
      name: "Om Shankar Tiwari",
    },
    {
      stars: 5,
      heading: "Truly Hands-Free Experience for Owners",
      text: "This was a completely hands-free solution for me. I partnered with them for my unused property, and they managed everything professionally — interiors, upkeep, tenant management, and rentals. I didn’t have to worry about day-to-day operations at all. I just receive regular updates and my share of profits on time. It feels good to work with a team that actually delivers what they promise.",
      name: "Sunakshi Maurya",
    },
    {
      stars: 5,
      heading: "Reliable Partner with Long-Term Vision",
      text: "They don’t just rent your property, they build value around it. From improving the interiors to maintaining the property, their focus is on long-term returns. My property now looks better, stays well-maintained, and attracts quality tenants. The profit-sharing model is transparent, and communication has been smooth throughout. I see this as a long-term partnership and would confidently recommend them to other property owners.",
      name: "Praveen Jadhav",
    },
  ];

  /* ---------- Detect Mobile ---------- */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ---------- Auto Slide on Mobile ---------- */
  useEffect(() => {
    if (!isMobile) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % reviews.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [isMobile, reviews.length]);

  const handleDotClick = (index) => setCurrentSlide(index);

  const handleTouchStart = (e) => {
    e.currentTarget.dataset.touchStartX = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const startX = parseFloat(e.currentTarget.dataset.touchStartX);
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentSlide < reviews.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else if (diff < 0 && currentSlide > 0) {
        setCurrentSlide(currentSlide - 1);
      }
    }
  };

  return (
    <div className="partners-section">
      <h2 className="partners-title">
        What Our <span>Partners</span> Say
      </h2>

      <div
        className="partners-container"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {reviews.map((review, index) => (
          <div
            className={`partner-card ${index === currentSlide ? "active" : ""}`}
            key={index}
          >
            <div className="stars">{"★".repeat(review.stars)}</div>

            {/* Review Heading */}
            <h4 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "10px" }}>
              {review.heading}
            </h4>

            {/* Review Content */}
            <p className="review-text">{review.text}</p>

            <p className="reviewer-name">{review.name}</p>
          </div>
        ))}
      </div>

      <div className="carousel-dots">
        {reviews.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default PartnersSection;
const styles = `
.partners-section {
  background: #f5f5f1;
  border-radius: 15px;
  padding: 50px 40px;
  margin: 40px auto;
  text-align: center;
  max-width: 1200px;
}

.partners-title {
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 40px;
  color: #000;
}

.partners-title span {
  color: #c47b28;
}

.partners-container {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 25px;
  flex-wrap: wrap;
}

.partner-card {
  background: #fff;
  border-radius: 10px;
  padding: 20px 25px;
  width: 320px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.stars {
  color: #c47b28;
  font-size: 18px;
  margin-bottom: 10px;
}

.review-text {
  color: #333;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 15px;
}

.reviewer-name {
  font-weight: 600;
  color: #000;
  font-size: 15px;
}

.carousel-dots {
  display: none;
}

/* Mobile View - Circular Cards with Auto-slide */
@media (max-width: 768px) {
  .partners-section {
    padding: 40px 20px;
    background: #f9f9f9;
  }

  .partners-title {
    font-size: 20px;
    line-height: 1.4;
  }

  .partners-container {
    flex-direction: column;
    align-items: center;
    gap: 0;
    position: relative;
    overflow: hidden;
    touch-action: pan-y;
  }

  .partner-card {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    padding: 40px 30px;
    text-align: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    display: none;
    flex-direction: column;
    align-items: center;
    transition: opacity 0.5s ease;
  }

  .partner-card.active {
    display: flex;
    animation: fadeIn 0.5s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .stars {
    color: #e63946;
    font-size: 22px;
    margin-bottom: 20px;
    letter-spacing: 3px;
  }

  .review-text {
    font-size: 11px;
    line-height: 1.6;
    text-align: center;
    color: #333;
    margin-bottom: 20px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .reviewer-name {
    font-size: 16px;
    font-weight: 700;
    text-align: center;
    margin-top: 0;
    color: #000;
  }

  .carousel-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 25px;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ddd;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .dot.active {
    background: #ffa500;
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}