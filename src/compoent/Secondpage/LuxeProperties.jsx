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
        const res = await fetch('https://townmanor.ai/api/properties/all');
        if (!res.ok) throw new Error('Failed to load properties');
        const data = await res.json();
        if (Array.isArray(data)) {
          setProperties(data);
        } else if (data && Array.isArray(data.properties)) {
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
  console.log(properties);
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
              const imageArray = Array.isArray(prop.images) ? prop.images : (Array.isArray(prop.IMAGES) ? prop.IMAGES : []);
              const imageSrc = imageArray.length > 0 ? imageArray[0] : '/p1.png';
              const rawPrice = prop.per_night_price ?? prop.PER_NIGHT_PRICE;
              const priceNumber = typeof rawPrice === 'string' ? parseFloat(rawPrice) : rawPrice;
              const priceText = priceNumber ? `₹ ${priceNumber.toLocaleString('en-IN')} per night` : '';
              const id = prop.id ?? prop.ID;
              const name = prop.name ?? prop.NAME;
              return (
                <article key={id} className="tmxluxe-prop-card" onClick={() => {
                  navigate(`/tmluxespecific/${id}`, { state: { propertyId: id } });
                }}>
                  <div className="tmxluxe-prop-media">
                    <img src={imageSrc} alt={name} />
                    <span className="tmxluxe-prop-badge">Guest Favorite</span>
                    <button className="tmxluxe-prop-like" aria-label="save">
                      ♥
                    </button>
                  </div>
                  <div className="tmxluxe-prop-body">
                    <h3 className="tmxluxe-prop-name">{name}</h3>
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