

import React, { useState, useEffect } from "react";
import "./GuestReviews.css";
import { FaStar, FaUserCircle } from "react-icons/fa";

const DEFAULT_REVIEWS = [
  {
    id: 1,
    name: "Riya Tanwar",
    time: "2 weeks ago",
    img: "/r1.png",
    review: `We had a really nice time staying at Noida. The location was very nice and in a good locality. Easily accessible for autos and cabs.
It felt like home and the room was kept very neat and clean.
The host was very helpful and communicative and would respond to any of our queries immediately.
Would definitely recommend staying here when you’re in noida!`
  },
  {
    id: 2,
    name: "Parvesh Verma",
    time: "2 days ago",
    img: "/r2.png",
    review: `My stay was exceptionally good.💯 If you are looking for luxury in this price this is the best place to stay at. The patio area was great. And most importantly the place was so clean and well managed. The host was very polite and very respectful throughout our whole stay. Totally recommend this place for your next stay.`
  },
  {
    id: 3,
    name: "Anil Kumar",
    time: "1 month ago",
    img: "/r3.png",
    review: `I had a wonderful stay at this Tanmore! The place was clean, comfortable, and exactly as described. ❤️ It felt like a home away from home. Vijay, the host, is an amazing person – very kind, helpful, and always ready to assist with anything. His warm hospitality made my experience even better. I would highly recommend this place to anyone visiting the area and I would love to stay here again in the future!`
  },
  {
    id: 4,
    name: "Anshula Kapoor",
    time: "2 month ago",
    img: "/r4.png",
    review: `I had an amazing stay at this Tanmore! The place was absolutely beautiful and spotless, making it a very comfortable experience. The host was incredibly sweet, kind, and super responsive, always ensuring everything was perfect. Their calm and polite nature made the stay even more pleasant. The locality was fantastic – safe, convenient, and truly enjoyable.`
  }
];

export default function GuestReviews({ reviews = DEFAULT_REVIEWS }) {
  const [visibleCount, setVisibleCount] = useState(2);
  const [isMobile, setIsMobile] = useState(false);

  // Track window width for responsive logic
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 600);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // On desktop, always show full reviews
  const displayReviews = isMobile ? reviews.slice(0, visibleCount) : reviews;

  function handleReadMore() {
    setVisibleCount((prev) => Math.min(prev + 2, reviews.length));
  }

  return (
    <div className="guestreviews-maincontainer">
      <h2 className="guestreviews-heading">Guest Reviews</h2>
      <div className="guestreviews-container">
        <div className={`guestreviews-grid ${isMobile ? "mobile" : "desktop"}`}>
          {displayReviews.map((item) => (
            <div key={item.id} className="guestreview-card">
              <div className="guestreview-header">
                <FaUserCircle className="guestreview-avatar" aria-hidden="true" />
                <div>
                  <h3 className="guestreview-name">{item.name}</h3>
                  <p className="guestreview-time">{item.time}</p>
                  <div className="guestreview-stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="guestreview-star" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="guestreview-text">{item.review}</p>
            </div>
          ))}
        </div>
        {isMobile && visibleCount < reviews.length && (
          <div className="guestreviews-readmore-row">
            <button className="guestreviews-readmore-btn" onClick={handleReadMore}>
              Read More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
