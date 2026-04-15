import { useEffect, useRef } from "react";

const REVIEWS = [
  {
    id: 1,
    name: "Harsh",
    location: "Ahmedabad, India",
    date: "November 2025",
    rating: 5,
    text: "Great place to live in for business and personal residence. Do visit for great hospitality by Mr. Mohanty — will surely recommend anyone who is visiting IEML or Greater Noida.",
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
    text: "Stayed here for a month during my project and it felt like a real home. Well-furnished, kitchen was stocked, and the neighbourhood is safe and quiet. Mr. Mohanty was incredibly helpful throughout. 10/10 experience.",
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
];

const allReviews = [...REVIEWS, ...REVIEWS];

export default function HomeReviews() {
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
        <div style={{
          display: "inline-flex",
          background: "rgba(194,119,43,0.1)",
          border: "1px solid rgba(194,119,43,0.25)",
          borderRadius: 20,
          padding: "4px 16px",
          fontSize: "0.6rem",
          color: "#c2772b",
          letterSpacing: "1.4px",
          textTransform: "uppercase",
          fontWeight: 600,
          fontFamily: "'Poppins', sans-serif",
          marginBottom: 10,
        }}>✦ Guest Reviews</div>
        <h2 style={{
          fontSize: "clamp(1.1rem, 1.8vw, 1.55rem)",
          fontWeight: 600,
          color: "#1a1209",
          fontFamily: "'Poppins', sans-serif",
          margin: 0,
        }}>What Our Guests Say</h2>
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
              {/* Top row */}
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

              {/* Review text */}
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
