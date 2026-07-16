import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { navClick } from '../../utils/navClick';

const API_BASE = 'https://www.townmanor.ai/api/ovika';

function low(s) { return (s || '').toLowerCase(); }

const CITIES = [
  { label: 'Noida', cityParam: 'Noida', match: p => low(p.city) === 'noida' },
  { label: 'Greater Noida', cityParam: 'Greater Noida', match: p => low(p.city) === 'greater noida' },
  { label: 'Delhi', cityParam: 'Delhi', match: p => low(p.city).includes('delhi') },
  { label: 'Gurgaon', cityParam: 'Gurugram', match: p => low(p.city).includes('gurugram') || low(p.city).includes('gurgaon') },
  { label: 'Ghaziabad', cityParam: 'Ghaziabad', match: p => low(p.city).includes('ghaziabad') },
  { label: 'Faridabad', cityParam: 'Faridabad', match: p => low(p.city).includes('faridabad') },
];

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

const css = `
.tl-section {
  background: #fff;
  padding: 20px 40px 52px;
  font-family: 'Poppins', sans-serif;
}
.tl-inner { max-width: 1400px; margin: 0 auto; }
.tl-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}
.tl-eyebrow {
  font-size: 0.72rem;
  color: #c2772b;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.tl-title {
  margin: 0;
  font-size: 1.9rem;
  font-weight: 800;
  color: #1a1209;
}
.tl-viewall {
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
.tl-viewall:hover { background: #c2772b; color: #fff; }
.tl-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}
.tl-card {
  position: relative;
  height: 180px;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  background: #eee;
}
.tl-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.tl-card:hover img { transform: scale(1.06); }
.tl-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 55%, transparent 100%);
}
.tl-card-text {
  position: absolute;
  bottom: 12px;
  left: 14px;
  right: 14px;
}
.tl-card-name {
  font-size: 0.98rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 2px;
}
.tl-card-count {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.85);
  margin: 0;
}
.tl-skeleton {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  background-size: 200% 100%;
  animation: tl-shimmer 1.4s infinite;
}
@keyframes tl-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@media (max-width: 1024px) {
  .tl-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 600px) {
  .tl-section { padding: 12px 18px 40px; }
  .tl-title { font-size: 1.4rem; }
  .tl-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .tl-card { height: 130px; }
}
`;

export default function TopLocations() {
  const navigate = useNavigate();
  const [cityData, setCityData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/properties`)
      .then(r => r.json())
      .then(data => {
        const props = Array.isArray(data) ? data : (data.data || data.properties || []);
        const result = {};
        CITIES.forEach(c => {
          const inCity = props.filter(c.match);
          const withPhoto = inCity.find(p => getCoverPhoto(p));
          result[c.label] = { count: inCity.length, img: withPhoto ? getCoverPhoto(withPhoto) : null };
        });
        setCityData(result);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="tl-section">
      <style>{css}</style>
      <div className="tl-inner">
        <div className="tl-header">
          <div>
            <div className="tl-eyebrow">Popular Locations</div>
            <h2 className="tl-title">Explore Top Locations</h2>
          </div>
          <a href="/properties" className="tl-viewall" onClick={(e) => navClick(e, '/properties', navigate)}>
            View all locations <ArrowRight size={14} />
          </a>
        </div>

        <div className="tl-grid">
          {CITIES.map(c => {
            const info = cityData[c.label];
            const href = `/properties?city=${encodeURIComponent(c.cityParam)}`;
            return (
              <a
                key={c.label}
                href={href}
                className="tl-card"
                onClick={(e) => navClick(e, href, navigate)}
              >
                {loading || !info?.img ? (
                  <div className="tl-skeleton" />
                ) : (
                  <img src={info.img} alt={c.label} />
                )}
                <div className="tl-card-overlay" />
                <div className="tl-card-text">
                  <p className="tl-card-name">{c.label}</p>
                  <p className="tl-card-count">{info ? `${info.count}+ Properties` : ''}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
