import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, ArrowRight } from 'lucide-react';
import { navClick } from '../../utils/navClick';

const API_BASE = 'https://www.townmanor.ai/api/ovika';

const CATEGORIES = ['Signature Stays', 'Hotel Stays', 'Homestays & BnB', 'Apartments & Villas', 'PG & Co-Living'];

const parseJsonField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    const trimmed = field.trim();
    if (/^\d+$/.test(trimmed)) return [];
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const getBedCount = (rawBedrooms) => {
  const parsed = parseJsonField(rawBedrooms);
  if (parsed.length > 0) return parsed.length;
  const n = Number(rawBedrooms);
  return isNaN(n) ? 0 : Math.max(0, n);
};

const getPgMinPrice = (property) => {
  const beds = parseJsonField(property.bedrooms);
  const prices = beds
    .map(b => Number(b.price) || Number(b.monthly_price) || 0)
    .filter(p => p > 0);
  if (prices.length > 0) return Math.min(...prices);
  return 0;
};

function getPhotoUrl(photo) {
  if (!photo) return null;
  if (photo.startsWith('http')) return photo;
  return `${API_BASE}${photo.startsWith('/') ? '' : '/'}${photo}`;
}

function getCoverPhoto(p) {
  const photos = Array.isArray(p.photos) ? p.photos : [];
  const idx = Number(p.cover_photo_index) || 0;
  const cover = photos[idx] || photos[0];
  return cover ? getPhotoUrl(cover) : null;
}

// Deterministic pseudo-rating/review-count so numbers stay stable across renders
function seededStats(id) {
  const n = ((Number(id) || 1) * 2654435761) >>> 0;
  const rating = (4.1 + (n % 9) / 10).toFixed(1);
  const reviews = 40 + (n % 130);
  return { rating, reviews };
}

function getSubtitle(p) {
  const bedCount = getBedCount(p.bedrooms);
  const base = p.property_type || p.property_category || 'Property';
  return bedCount > 0 ? `${base} · ${bedCount}BHK` : base;
}

function getPriceInfo(p) {
  const cat = (p.property_category || '').toLowerCase();
  const isPgLike = cat.includes('pg') || cat.includes('co-living');
  if (isPgLike) {
    const monthly = getPgMinPrice(p) || Number(p.monthly_price) || Number(p.base_rate) || 0;
    return { price: monthly, unit: '/month' };
  }
  const nightly = Number(p.price) || Number(p.base_rate) || 0;
  return { price: nightly, unit: '/night' };
}

function getTitle(p) {
  const name = p.property_name || 'Untitled Property';
  const location = (p.city || p.sector || '').trim();
  return location ? `${name}, ${location}` : name;
}

const cardCSS = `
.fs-section {
  background: #fafaf9;
  padding: 44px 40px 52px;
  font-family: 'Poppins', sans-serif;
}
.fs-inner { max-width: 1400px; margin: 0 auto; }
.fs-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}
.fs-eyebrow {
  font-size: 0.72rem;
  color: #c2772b;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.fs-title {
  margin: 0;
  font-size: 1.9rem;
  font-weight: 800;
  color: #1a1209;
}
.fs-viewall {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 22px;
  border-radius: 50px;
  border: 1.5px solid #c2772b;
  background: transparent;
  color: #c2772b;
  font-size: 0.82rem;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  text-decoration: none;
}
.fs-viewall:hover {
  background: #c2772b;
  color: #fff;
}
.fs-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 18px;
  padding-bottom: 6px;
}
.fs-row::-webkit-scrollbar { display: none; }
.fs-card {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  min-width: 0;
}
@media (max-width: 900px) {
  .fs-row {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .fs-card {
    flex: 0 0 78%;
    scroll-snap-align: start;
  }
  .fs-dots { display: flex; }
}
@media (min-width: 901px) {
  .fs-dots { display: none; }
}
.fs-card-imgwrap {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  height: 220px;
  background: #eee;
}
.fs-card-imgwrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.fs-card:hover .fs-card-imgwrap img { transform: scale(1.05); }
.fs-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 11px;
  border-radius: 20px;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.2px;
}
.fs-badge--filled { background: #c2772b; color: #fff; }
.fs-badge--outline { background: #fff; color: #1a1209; }
.fs-heart {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.fs-card-body { padding: 12px 2px 0; }
.fs-card-name {
  margin: 0 0 3px;
  font-size: 0.92rem;
  font-weight: 700;
  color: #1a1209;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fs-card-sub {
  margin: 0 0 8px;
  font-size: 0.72rem;
  color: #8a8a8a;
}
.fs-card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fs-card-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #1a1209;
}
.fs-card-rating span.count { color: #8a8a8a; font-weight: 400; }
.fs-card-price {
  font-size: 0.92rem;
  font-weight: 800;
  color: #c2772b;
}
.fs-card-price span {
  font-size: 0.68rem;
  font-weight: 400;
  color: #8a8a8a;
}
.fs-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 18px;
}
.fs-dot {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: rgba(194,119,43,0.25);
  transition: all 0.25s ease;
}
.fs-dot--active {
  width: 18px;
  background: #c2772b;
}
.fs-skeleton {
  height: 220px;
  border-radius: 16px;
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  background-size: 200% 100%;
  animation: fs-shimmer 1.4s infinite;
}
@keyframes fs-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@media (max-width: 560px) {
  .fs-section { padding: 32px 18px 40px; }
  .fs-title { font-size: 1.4rem; }
}
`;

export default function FeaturedStays() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState({});
  const [activeDot, setActiveDot] = useState(0);
  const rowRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/properties`)
      .then(r => r.json())
      .then(data => {
        const props = Array.isArray(data) ? data : (data.data || data.properties || []);
        const withPhotos = props.filter(p => getCoverPhoto(p));

        // Pick one representative property per category, so each card shows a different category
        const picked = CATEGORIES.map(cat => {
          const inCat = withPhotos.filter(p => p.property_category === cat);
          if (inCat.length === 0) return null;
          const withPrice = inCat.filter(p => (Number(p.price) || Number(p.base_rate)) > 0);
          return withPrice[0] || inCat[0];
        }).filter(Boolean);

        setProperties(picked);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleScroll = () => {
    const el = rowRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    if (!card) return;
    const cardWidth = card.getBoundingClientRect().width + 20;
    setActiveDot(Math.round(el.scrollLeft / cardWidth));
  };

  const toggleWishlist = (id) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!loading && properties.length === 0) return null;

  return (
    <section className="fs-section">
      <style>{cardCSS}</style>
      <div className="fs-inner">
        <div className="fs-header">
          <div>
            <div className="fs-eyebrow">Handpicked for You</div>
            <h2 className="fs-title">Featured Stays</h2>
          </div>
          <a href="/properties" className="fs-viewall" onClick={(e) => navClick(e, '/properties', navigate)}>
            View all properties <ArrowRight size={14} />
          </a>
        </div>

        {loading ? (
          <div className="fs-row">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="fs-card"><div className="fs-skeleton" /></div>
            ))}
          </div>
        ) : (
          <>
            <div className="fs-row" ref={rowRef} onScroll={handleScroll}>
              {properties.map((p, i) => {
                const id = p.id || p.property_id;
                const { rating, reviews } = seededStats(id);
                const { price, unit } = getPriceInfo(p);
                const badge = p.property_category || CATEGORIES[i];
                return (
                  <a
                    key={id}
                    href={`/property/${id}`}
                    className="fs-card"
                    onClick={(e) => navClick(e, `/property/${id}`, navigate)}
                  >
                    <div className="fs-card-imgwrap">
                      <img src={getCoverPhoto(p)} alt={p.property_name} />
                      <span className="fs-badge fs-badge--filled">
                        {badge}
                      </span>
                      <button
                        className="fs-heart"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(id); }}
                        aria-label="Save"
                      >
                        <Heart size={14} color={wishlist[id] ? '#e84040' : '#555'} fill={wishlist[id] ? '#e84040' : 'none'} />
                      </button>
                    </div>
                    <div className="fs-card-body">
                      <p className="fs-card-name">{getTitle(p)}</p>
                      <p className="fs-card-sub">{getSubtitle(p)}</p>
                      <div className="fs-card-meta">
                        <span className="fs-card-rating">
                          <Star size={13} color="#c2772b" fill="#c2772b" /> {rating} <span className="count">({reviews})</span>
                        </span>
                        {price > 0 ? (
                          <span className="fs-card-price">₹{price.toLocaleString('en-IN')}<span>{unit}</span></span>
                        ) : (
                          <span className="fs-card-price" style={{ color: '#8a8a8a', fontWeight: 500, fontSize: '0.72rem' }}>On Request</span>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            <div className="fs-dots">
              {properties.map((p, i) => (
                <div key={p.id || i} className={`fs-dot ${i === activeDot ? 'fs-dot--active' : ''}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
