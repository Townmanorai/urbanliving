import { useRef, useState } from "react";
import { Quote, Star } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    name: "Harsh",
    location: "Ahmedabad, India",
    date: "November 2025",
    rating: 5,
    text: "Great place to live in for business and personal residence. Do visit for great hospitality by the TownManor Team — will surely recommend anyone who is visiting IEML or Greater Noida.",
    initials: "H",
    color: "#c2772b",
  },
  {
    id: 2,
    name: "Sankalp",
    location: "Nagpur, India",
    date: "November 2025",
    rating: 5,
    text: "It was amazing, it's nearby Metro so it's well connected and I was happy with the room and host. Lovely place if you are looking for a place in Sector 137.",
    initials: "S",
    color: "#6b5540",
  },
  {
    id: 3,
    name: "Akshay",
    location: "Nagpur, India",
    date: "August 2025",
    rating: 5,
    text: "We had an amazing experience at Townmanor — a big thank you to the owner for making it feel like our second home. The place is beautifully designed, peaceful, and thoughtfully maintained. Truly a hidden gem and a perfect getaway spot!",
    initials: "A",
    color: "#8a6a3a",
  },
  {
    id: 4,
    name: "Pardeep",
    location: "Mumbai, India",
    date: "August 2025",
    rating: 5,
    text: "I had an amazing two-night stay at this beautiful property! Spotless, very comfortable, and exactly as described. The host was incredibly welcoming. Location is ideal — near the metro with easy access to Ola, Uber, restaurants and malls.",
    initials: "P",
    color: "#a05c2a",
  },
  {
    id: 5,
    name: "Priya Sharma",
    location: "Delhi, India",
    date: "October 2025",
    rating: 5,
    text: "Absolutely loved the stay! The property is exactly as shown in photos — clean, modern, and well-maintained. The host was very responsive and helpful. Perfect location near the metro. Will definitely book again!",
    initials: "PS",
    color: "#7a5c3a",
  },
  {
    id: 6,
    name: "Rahul Verma",
    location: "Pune, India",
    date: "September 2025",
    rating: 5,
    text: "Had a wonderful experience here. The apartment was spacious and cozy at the same time. Great amenities, fast WiFi, and a very comfortable bed. Felt like home away from home. Highly recommend for anyone visiting Greater Noida.",
    initials: "RV",
    color: "#c2772b",
  },
  {
    id: 7,
    name: "Ananya Gupta",
    location: "Hyderabad, India",
    date: "September 2025",
    rating: 5,
    text: "This was my first time using Signature Stays and I was blown away. The interiors are beautiful, the host was so welcoming, and the location is super convenient. Everything from check-in to check-out was seamless. A perfect stay!",
    initials: "AG",
    color: "#6b5540",
  },
  {
    id: 8,
    name: "Vikram Nair",
    location: "Bangalore, India",
    date: "October 2025",
    rating: 5,
    text: "Stayed here for a month during my project and it felt like a real home. Well-furnished, kitchen was stocked, and the neighbourhood is safe and quiet. The TownManor Team was incredibly helpful throughout. 10/10 experience.",
    initials: "VN",
    color: "#8a6a3a",
  },
  {
    id: 9,
    name: "Neha Joshi",
    location: "Jaipur, India",
    date: "November 2025",
    rating: 5,
    text: "One of the best stays I've had! The apartment had all the amenities I needed and more. Close to the metro, malls, and restaurants. The host responded quickly to any queries. Would absolutely recommend to anyone visiting the NCR region.",
    initials: "NJ",
    color: "#a05c2a",
  },
  {
    id: 10,
    name: "Vikram",
    location: "Canada",
    date: "June 2026",
    rating: 5,
    text: "The host is very professional in his approach and has maintained the property well. The host is patient in hearing about issues and is very responsive. Overall a pleasure to use the property.",
    initials: "V",
    color: "#9b2063",
  },
  {
    id: 11,
    name: "Prashant Raghu",
    location: "New Delhi, India",
    date: "July 2026",
    rating: 5,
    text: "I had a great three-week stay at OvikaLiving Signature Stay 1, Knowledge Park, Greater Noida. The apartment was clean, comfortable, and well-maintained throughout my stay. Everything was smooth, and I didn't face any issues. The host was helpful and responsive, making the overall experience hassle-free. I would definitely recommend OvikaLiving to anyone looking for a comfortable stay in Greater Noida.",
    initials: "PR",
    color: "#5a7a3a",
  },
  {
    id: 12,
    name: "Ms. Siddhi Kapoor",
    location: "Ayodhya, India",
    date: "July 2026",
    rating: 5,
    text: "I stayed at OvikaLiving Signature Stay 3 with my parents and younger brother during my BBA admission at IILM, Greater Noida. The apartment was clean, comfortable, and very convenient. The stay was smooth and hassle-free. Highly recommended!",
    initials: "SK",
    color: "#3a6a8a",
  },
  {
    id: 13,
    name: "Mr. Sachin",
    location: "Jammu, India",
    date: "July 2026",
    rating: 5,
    text: "We stayed for three nights at OvikaLiving Signature Stay 2 during our road trip from Jammu to Vadodara. It was the perfect break on our journey. The private room was clean, comfortable, and peaceful, and the hosts were very welcoming. A great place for families to relax before continuing their trip.",
    initials: "S",
    color: "#7a3a6a",
  },
];

/* =====================================================================
   OLD REVIEWS CAROUSEL (auto-scrolling marquee) — commented out for now
   restore this whenever needed
   =====================================================================

const allReviews = [...REVIEWS, ...REVIEWS];

export function OldHomeReviews() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let pos = 0;
    let raf;
    const speed = 0.5;

    const tick = () => {
      pos += speed;
      const half = track.scrollWidth / 2;
      if (pos >= half) pos = 0;
      track.style.transform = `translateX(-${pos}px)`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    const pause = () => cancelAnimationFrame(raf);
    const resume = () => { raf = requestAnimationFrame(tick); };
    track.addEventListener("mouseenter", pause);
    track.addEventListener("mouseleave", resume);

    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener("mouseenter", pause);
      track.removeEventListener("mouseleave", resume);
    };
  }, []);

  return (
    <div style={{
      background: "linear-gradient(160deg, #fdf7ee 0%, #f5ead6 60%, #ede4cf 100%)",
      padding: "32px 0 36px",
      overflow: "hidden",
    }}>
      <div style={{
        textAlign: "center",
        marginBottom: 20,
      }}>
      </div>

      <div style={{ overflow: "hidden", width: "100%" }}>
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: 16,
            width: "max-content",
            willChange: "transform",
          }}
        >
          {allReviews.map((r, idx) => (
            <div
              key={idx}
              style={{
                background: "#fff",
                border: "1.5px solid #f0e8da",
                borderRadius: 14,
                padding: "16px 20px",
                width: 300,
                flexShrink: 0,
                boxShadow: "0 4px 18px rgba(194,119,43,0.07)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: r.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.72rem",
                  fontFamily: "'Poppins', sans-serif",
                  flexShrink: 0,
                }}>
                  {r.initials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    color: "#1a1209",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>{r.name}</div>
                  <div style={{
                    fontSize: "0.68rem",
                    color: "#6b5540",
                    fontFamily: "'Poppins', sans-serif",
                  }}>{r.location}</div>
                </div>
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                  <div style={{ fontSize: "0.75rem", color: "#f5a623", letterSpacing: 1 }}>★★★★★</div>
                  <div style={{ fontSize: "0.6rem", color: "#8a6a3a", fontFamily: "'Poppins', sans-serif" }}>{r.date}</div>
                </div>
              </div>

              <p style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.74rem",
                fontWeight: 400,
                color: "#4a3828",
                lineHeight: 1.6,
                margin: 0,
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                "{r.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

===================== END OLD REVIEWS CAROUSEL ===================== */

const CARDS_PER_PAGE = 4;

const css = `
.hr-section {
  background: #fff;
  padding: 44px 40px 52px;
  font-family: 'Poppins', sans-serif;
}
.hr-inner { max-width: 1400px; margin: 0 auto; }
.hr-eyebrow {
  font-size: 0.72rem;
  color: #c2772b;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.hr-title {
  margin: 0 0 24px;
  font-size: 1.9rem;
  font-weight: 800;
  color: #1a1209;
}
.hr-row {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 6px;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hr-row::-webkit-scrollbar { display: none; }
.hr-card {
  flex: 0 0 calc(25% - 15px);
  scroll-snap-align: start;
  background: #fff;
  border: 1.5px solid #f0e8da;
  border-radius: 16px;
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 4px 18px rgba(194,119,43,0.06);
}
.hr-quote { color: #f3d3ac; }
.hr-text {
  font-size: 0.82rem;
  color: #4a3828;
  line-height: 1.6;
  margin: 0;
  min-height: 4.8em;
}
.hr-footer {
  display: flex;
  align-items: center;
  gap: 10px;
}
.hr-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 0.76rem;
  flex-shrink: 0;
}
.hr-name {
  font-weight: 700;
  font-size: 0.84rem;
  color: #1a1209;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.hr-location {
  font-size: 0.7rem;
  color: #8a8a8a;
}
.hr-rating {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #1a1209;
  flex-shrink: 0;
}
.hr-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 22px;
}
.hr-dot {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: rgba(194,119,43,0.25);
  transition: all 0.25s ease;
}
.hr-dot--active {
  width: 18px;
  background: #c2772b;
}
@media (max-width: 1024px) {
  .hr-card { flex: 0 0 calc(50% - 10px); }
}
@media (max-width: 600px) {
  .hr-section { padding: 32px 18px 40px; }
  .hr-title { font-size: 1.4rem; }
  .hr-card { flex: 0 0 82%; }
}
`;

export default function HomeReviews() {
  const rowRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);

  const totalPages = Math.ceil(REVIEWS.length / CARDS_PER_PAGE);

  const handleScroll = () => {
    const el = rowRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) { setActiveDot(0); return; }
    const ratio = el.scrollLeft / maxScroll;
    setActiveDot(Math.min(totalPages - 1, Math.round(ratio * (totalPages - 1))));
  };

  return (
    <section className="hr-section">
      <style>{css}</style>
      <div className="hr-inner">
        <div className="hr-eyebrow">What Our Guests Say</div>
        <h2 className="hr-title">Loved by Thousands of Happy Guests</h2>

        <div className="hr-row" ref={rowRef} onScroll={handleScroll}>
          {REVIEWS.map(r => (
            <div key={r.id} className="hr-card">
              <Quote className="hr-quote" size={26} fill="currentColor" />
              <p className="hr-text">{r.text}</p>
              <div className="hr-footer">
                <div className="hr-avatar" style={{ background: r.color }}>{r.initials}</div>
                <div style={{ minWidth: 0 }}>
                  <div className="hr-name">{r.name}</div>
                  <div className="hr-location">{r.location.split(',')[0]}</div>
                </div>
                <div className="hr-rating">
                  <Star size={14} color="#f5a623" fill="#f5a623" /> {r.rating.toFixed(1)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="hr-dots">
            {Array.from({ length: totalPages }).map((_, i) => (
              <div key={i} className={`hr-dot ${i === activeDot ? 'hr-dot--active' : ''}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
