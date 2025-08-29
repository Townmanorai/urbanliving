import React, { useEffect, useState } from 'react'
import './tmxluxe-prop.css'
import { useNavigate } from 'react-router';
function LuxeProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('http://localhost:3000/properties/all');
        if (!res.ok) throw new Error('Failed to load properties');
        const data = await res.json();
        if (data && data.success && Array.isArray(data.properties)) {
          setProperties(data.properties);
        } else {
          setError('Invalid response format');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);
  const navigate = useNavigate();
  return (
    <section className="tmxluxe-prop">
      <div className="tmxluxe-prop-container">
        <div className="tmxluxe-prop-head">
          <h2 className="tmxluxe-prop-title">Available TM Luxe Properties In Noida</h2>
          <span className="tmxluxe-prop-chevron">›</span>
        </div>

        {loading && (
          <div className="tmxluxe-prop-grid">
            <div className="tmxluxe-prop-card">Loading...</div>
          </div>
        )}
        {error && !loading && (
          <div className="tmxluxe-prop-grid">
            <div className="tmxluxe-prop-card">{error}</div>
          </div>
        )}
        {!loading && !error && (
          <div className="tmxluxe-prop-grid">
            {properties.map((prop) => {
              const imageSrc = Array.isArray(prop.IMAGES) && prop.IMAGES.length > 0 ? prop.IMAGES[0] : '/p1.png';
              const priceNumber = typeof prop.PER_NIGHT_PRICE === 'string' ? parseFloat(prop.PER_NIGHT_PRICE) : prop.PER_NIGHT_PRICE;
              const priceText = priceNumber ? `₹ ${priceNumber.toLocaleString('en-IN')} per night` : '';
              return (
                <article key={prop.ID} className="tmxluxe-prop-card" onClick={() => {
                  navigate(`/tmluxespecific/${prop.ID}`, { state: { propertyId: prop.ID } });
                }}>
                  <div className="tmxluxe-prop-media">
                    <img src={imageSrc} alt={prop.NAME} />
                    <span className="tmxluxe-prop-badge">Guest Favorite</span>
                    <button className="tmxluxe-prop-like" aria-label="save">
                      ♥
                    </button>
                  </div>
                  <div className="tmxluxe-prop-body">
                    <h3 className="tmxluxe-prop-name">{prop.NAME}</h3>
                    <div className="tmxluxe-prop-meta">
                      <span className="tmxluxe-prop-price">{priceText}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
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