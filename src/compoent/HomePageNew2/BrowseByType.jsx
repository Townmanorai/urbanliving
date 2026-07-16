import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, Home, Hotel, LayoutGrid, TreePine, ArrowRight } from 'lucide-react';
import { navClick } from '../../utils/navClick';

const API_BASE = 'https://www.townmanor.ai/api/ovika';

function low(s) { return (s || '').toLowerCase(); }

const TYPES = [
  {
    key: 'pg', label: 'PG & Co-Living', unit: '/month', icon: Users, floor: 1500,
    match: p => low(p.property_category).includes('pg') || low(p.property_category).includes('co-living'),
    categoryParam: 'PG & Co-Living',
  },
  {
    key: 'apartments', label: 'Apartments', unit: '/month', icon: Building2, floor: 1500,
    match: p => low(p.property_category) === 'apartment' || low(p.property_category) === 'flat' || low(p.property_type).includes('apartment'),
    categoryParam: 'Apartments & Villas',
  },
  {
    key: 'villas', label: 'Villas', unit: '/night', icon: Home, floor: 1000,
    match: p => low(p.property_category) === 'villa' || low(p.property_type).includes('villa'),
    categoryParam: 'Apartments & Villas',
  },
  {
    key: 'hotels', label: 'Hotels', unit: '/night', icon: Hotel, floor: 500,
    match: p => low(p.property_category).includes('hotel'),
    categoryParam: 'Hotel Stays',
  },
  {
    key: 'studio', label: 'Studio Apartments', unit: '/month', icon: LayoutGrid, floor: 1500,
    match: p => low(p.property_category) === 'studio' || low(p.property_type).includes('studio'),
    categoryParam: 'Apartments & Villas',
  },
  {
    key: 'homestays', label: 'Homestays', unit: '/night', icon: TreePine, floor: 500,
    match: p => low(p.property_category).includes('homestay') || low(p.property_category).includes('bnb'),
    categoryParam: 'Homestays & BnB',
  },
];

const css = `
.bbt-section {
  background: #fff;
  padding: 44px 40px 52px;
  font-family: 'Poppins', sans-serif;
}
.bbt-inner { max-width: 1400px; margin: 0 auto; }
.bbt-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}
.bbt-eyebrow {
  font-size: 0.72rem;
  color: #c2772b;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.bbt-title {
  margin: 0;
  font-size: 1.9rem;
  font-weight: 800;
  color: #1a1209;
}
.bbt-viewall {
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
.bbt-viewall:hover { background: #c2772b; color: #fff; }
.bbt-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}
.bbt-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding: 26px 16px 22px;
  border-radius: 16px;
  border: 1px solid #f0e8da;
  background: #fff;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
}
.bbt-card:hover {
  box-shadow: 0 10px 28px rgba(194,119,43,0.14);
  transform: translateY(-3px);
  border-color: #e8d5b7;
}
.bbt-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: #fdf2e4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c2772b;
}
.bbt-label {
  font-size: 0.92rem;
  font-weight: 700;
  color: #1a1209;
}
.bbt-price {
  font-size: 0.76rem;
  color: #8a8a8a;
}
.bbt-price strong {
  color: #c2772b;
  font-weight: 700;
}
.bbt-skeleton {
  height: 15px;
  width: 70%;
  margin: 0 auto;
  border-radius: 6px;
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  background-size: 200% 100%;
  animation: bbt-shimmer 1.4s infinite;
}
@keyframes bbt-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@media (max-width: 1024px) {
  .bbt-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 600px) {
  .bbt-section { padding: 32px 18px 40px; }
  .bbt-title { font-size: 1.4rem; }
  .bbt-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .bbt-card { padding: 20px 10px 16px; gap: 8px; }
  .bbt-icon { width: 46px; height: 46px; border-radius: 12px; }
  .bbt-label { font-size: 0.82rem; }
  .bbt-price { font-size: 0.68rem; }
}
`;

export default function BrowseByType() {
  const navigate = useNavigate();
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/properties`)
      .then(r => r.json())
      .then(data => {
        const props = Array.isArray(data) ? data : (data.data || data.properties || []);
        const result = {};
        TYPES.forEach(t => {
          const inType = props.filter(t.match);
          const vals = inType
            .map(p => Number(p.price) || Number(p.base_rate) || 0)
            .filter(v => v >= t.floor);
          result[t.key] = vals.length ? Math.min(...vals) : 0;
        });
        setPrices(result);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bbt-section">
      <style>{css}</style>
      <div className="bbt-inner">
        <div className="bbt-header">
          <div>
            <div className="bbt-eyebrow">Choose Your Space</div>
            <h2 className="bbt-title">Browse by Property Type</h2>
          </div>
          <a href="/properties" className="bbt-viewall" onClick={(e) => navClick(e, '/properties', navigate)}>
            View all <ArrowRight size={14} />
          </a>
        </div>

        <div className="bbt-grid">
          {TYPES.map(t => {
            const Icon = t.icon;
            const price = prices[t.key];
            const href = `/properties?category=${encodeURIComponent(t.categoryParam)}`;
            return (
              <a
                key={t.key}
                href={href}
                className="bbt-card"
                onClick={(e) => navClick(e, href, navigate)}
              >
                <div className="bbt-icon"><Icon size={26} /></div>
                <div className="bbt-label">{t.label}</div>
                {loading ? (
                  <div className="bbt-skeleton" />
                ) : price > 0 ? (
                  <div className="bbt-price">Starting <strong>₹{price.toLocaleString('en-IN')}</strong>{t.unit}</div>
                ) : (
                  <div className="bbt-price">Explore listings</div>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
