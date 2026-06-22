import React, { useState } from 'react';
import './Banner.css';
import { IoSearch } from 'react-icons/io5';
import { MdLocationOn } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  {
    id: 'signature',
    icon: '☆',
    label: 'Signature Stays',
    shortLabel: 'Signature',
    heading: 'Signature stays in',
    sub: '120+ handpicked premium homes · personally verified',
    placeholder: 'Search signature stays by locality or property...',
    mobilePlaceholder: 'Search signature stays...',
    trending: ['Sector 150', 'Golf Course Rd', 'Sector 137', 'Sector 18', 'Sector 76'],
    param: 'Signature Stays',
  },
  {
    id: 'hotels',
    icon: '🛏️',
    label: 'Hotels',
    shortLabel: 'Hotels',
    heading: 'Hotels in',
    sub: 'Best hotels with premium amenities · verified listings',
    placeholder: 'Search hotels by locality or name...',
    mobilePlaceholder: 'Search hotels...',
    trending: ['Sector 18', 'Sector 62', 'City Centre', 'Sector 135'],
    param: 'Hotel Stays',
  },
  {
    id: 'homestay',
    icon: '🏠',
    label: 'Homestays & BnB',
    shortLabel: 'Homestays',
    heading: 'Homestays & BnB in',
    sub: 'Unique stays with warm local hosts · no brokerage',
    placeholder: 'Search homestays by locality or name...',
    mobilePlaceholder: 'Search homestays...',
    trending: ['Sector 50', 'Sector 44', 'Sector 62', 'Sector 137'],
    param: 'Homestays & BnB',
  },
  {
    id: 'pg',
    icon: '👤',
    label: 'PG & Co-Living',
    shortLabel: 'PG & Co-Living',
    heading: 'PG & Co-Living in',
    sub: '500+ verified PGs with no brokerage · meals included',
    placeholder: 'Search PG by locality or budget...',
    mobilePlaceholder: 'Search PGs...',
    trending: ['Sector 62', 'Sector 63', 'Knowledge Park', 'Sector 18'],
    param: 'PG & Co-Living',
  },
  {
    id: 'apartment',
    icon: '🏢',
    label: 'Apartments & Villas',
    shortLabel: 'Apartments',
    heading: 'Apartments & Villas in',
    sub: 'Premium furnished apartments for every budget · zero brokerage',
    placeholder: 'Search apartments by locality or name...',
    mobilePlaceholder: 'Search apartments...',
    trending: ['Sector 75', 'Sector 137', 'Noida Extension', 'Sector 150'],
    param: 'Apartments & Villas',
  },
];

const CITY = 'Noida';

function Banner() {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const [query, setQuery] = useState('');

  const cat = CATEGORIES[activeIdx];

  const handleSearch = () => {
    const params = new URLSearchParams({ category: cat.param });
    if (query.trim()) params.set('q', query.trim());
    navigate(`/properties?${params.toString()}`);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleTrend = (t) => {
    const params = new URLSearchParams({ category: cat.param, q: t });
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="nb-root">
      {/* subtle radial glow */}
      <div className="nb-glow" />

      {/* ── Category Tabs ── */}
      <div className="nb-tabs-wrap">
        <div className="nb-tabs">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.id}
              className={`nb-tab${i === activeIdx ? ' nb-tab--active' : ''}`}
              onClick={() => { setActiveIdx(i); setQuery(''); }}
            >
              <span className="nb-tab-icon">{c.icon}</span>
              <span className="nb-tab-full">{c.label}</span>
              <span className="nb-tab-short">{c.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Heading ── */}
      <div className="nb-content">
        <h1 className="nb-heading">
          {cat.heading} <span className="nb-city">{CITY}</span>
        </h1>
        <p className="nb-sub">{cat.sub}</p>

        {/* ── Search Bar ── */}
        <div className="nb-search">
          <div className="nb-city-pill">
            <MdLocationOn size={16} className="nb-city-icon" />
            <div>
              <div className="nb-city-label">CITY</div>
              <div className="nb-city-name">{CITY} ·</div>
            </div>
          </div>
          <div className="nb-sep" />
          <input
            className="nb-input"
            placeholder={cat.placeholder}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
          />
          <button className="nb-search-btn" onClick={handleSearch}>
            <IoSearch size={20} />
          </button>
        </div>

        {/* Mobile search (no city pill) */}
        <div className="nb-search nb-search--mobile">
          <IoSearch size={17} className="nb-mobile-search-icon" />
          <input
            className="nb-input"
            placeholder={cat.mobilePlaceholder}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
          />
          <button className="nb-search-btn" onClick={handleSearch}>
            <IoSearch size={18} />
          </button>
        </div>

        {/* ── Trending ── */}
        <div className="nb-trending">
          <span className="nb-trending-label">Trending</span>
          {cat.trending.map(t => (
            <button key={t} className="nb-chip" onClick={() => handleTrend(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Banner;
