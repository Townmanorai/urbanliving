import React from 'react'
import './tmxluxe-prop.css'
function LuxeProperties() {
  const items = [
    {
      id: 1,
      title: "TM Luxe1",
      price: "₹ 12,456 for Two Nights",
      rating: "4.9",
      img: "/p1.png"
    },
    {
      id: 2,
      title: "TM Luxe2",
      price: "₹ 11,001 for Two Nights",
      rating: "4.9",
      img: "/p2.png"
    },
    {
      id: 3,
      title: "TM Luxe3",
      price: "₹ 10,456 for Two Nights",
      rating: "4.9",
      img: "/p3.png"
    },
    {
      id: 4,
      title: "TM Luxe4",
      price: "₹ 7,789 for Two Nights",
      rating: "4.9",
      img: "/p4.png"
    }
  ];

  return (
    <section className="tmxluxe-prop">
      <div className="tmxluxe-prop-container">
        <div className="tmxluxe-prop-head">
          <h2 className="tmxluxe-prop-title">Available TM Luxe Properties In Noida</h2>
          <span className="tmxluxe-prop-chevron">›</span>
        </div>

        <div className="tmxluxe-prop-grid">
          {items.map((it) => (
            <article key={it.id} className="tmxluxe-prop-card">
              <div className="tmxluxe-prop-media">
                <img src={it.img} alt={it.title} />
                <span className="tmxluxe-prop-badge">Guest Favorite</span>
                <button className="tmxluxe-prop-like" aria-label="save">
                  ♥
                </button>
              </div>

              <div className="tmxluxe-prop-body">
                <h3 className="tmxluxe-prop-name">{it.title}</h3>
                <div className="tmxluxe-prop-meta">
                  <span className="tmxluxe-prop-price">{it.price}</span>
                  <span className="tmxluxe-prop-rating">
                    <span className="tmxluxe-prop-star">★</span> {it.rating}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
       <div className="tmxluxe-prop-more">
          <a href="#" className="tmxluxe-prop-cta">
            <span className="tmxluxe-prop-cta-text">Browse more</span>
            <span className="tmxluxe-prop-cta-arrow">›</span>
          </a>
        </div>
    </section>
  );
}


export default LuxeProperties