import React, { useState } from 'react';
import './Banner.css';
import { IoSearch } from 'react-icons/io5';
import { MdLocationOn, MdKeyboardArrowDown } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  {
    id: 'signature',
    icon: '☆',
    label: 'Signature Stays',
    shortLabel: 'Signature',
    heading: 'Signature Stays in',
    sub: '120+ handpicked premium homes · personally verified',
    placeholder: 'Search by locality or property name...',
    mobilePlaceholder: 'Search signature stays...',
    trending: ['Sector 150', 'Golf Course Rd', 'Sector 137', 'Sector 18', 'Sector 76'],
    param: 'Signature Stays',
    showToggle: false,
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
    showToggle: false,
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
    showToggle: true,
    toggleOptions: ['Book Now', 'Long Stay'],
  },
  {
    id: 'pg',
    icon: '👤',
    label: 'PG & Co-Living',
    shortLabel: 'PG',
    heading: 'PG & Co-Living in',
    sub: '500+ verified PGs with no brokerage · meals included',
    placeholder: 'Search PG by locality or budget...',
    mobilePlaceholder: 'Search PGs...',
    trending: ['Sector 62', 'Sector 63', 'Knowledge Park', 'Sector 18'],
    param: 'PG & Co-Living',
    showToggle: true,
    toggleOptions: ['Boys', 'Girls', 'Co-Ed'],
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
    showToggle: true,
    toggleOptions: ['Rent', 'Buy'],
  },
];

const CITIES = ['Noida', 'Greater Noida', 'Gurgaon', 'Delhi', 'Faridabad', 'Ghaziabad'];

function Banner() {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('Noida');
  const [cityOpen, setCityOpen] = useState(false);
  const [toggleIdx, setToggleIdx] = useState(0);

  const cat = CATEGORIES[activeIdx];

  const handleSearch = () => {
    const params = new URLSearchParams({ category: cat.param });
    if (query.trim()) params.set('q', query.trim());
    params.set('city', city);
    if (cat.showToggle && cat.toggleOptions) {
      params.set('type', cat.toggleOptions[toggleIdx]);
    }
    navigate(`/properties?${params.toString()}`);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleTrend = (t) => {
    const params = new URLSearchParams({ category: cat.param, q: t, city });
    navigate(`/properties?${params.toString()}`);
  };

  const handleTabChange = (i) => {
    setActiveIdx(i);
    setQuery('');
    setToggleIdx(0);
  };

  return (
    <div className="nb-root">
      <div className="nb-glow" />

      {/* ── Heading ── */}
      <div className="nb-content">
        <h1 className="nb-heading">
          {cat.heading} <span className="nb-city">{city}</span>
        </h1>
        <p className="nb-sub">{cat.sub}</p>

        {/* ── Unified Search Card (Tabs + Search Bar) ── */}
        <div className="nb-card">

          {/* Tabs row — top of the card */}
          <div className="nb-card-tabs">
            {CATEGORIES.map((c, i) => (
              <button
                key={c.id}
                className={`nb-card-tab${i === activeIdx ? ' nb-card-tab--active' : ''}`}
                onClick={() => handleTabChange(i)}
              >
                <span className="nb-card-tab-icon">{c.icon}</span>
                <span className="nb-tab-full">{c.label}</span>
                <span className="nb-tab-short">{c.shortLabel}</span>
              </button>
            ))}
          </div>

          {/* Search row — bottom of the card */}
          <div className="nb-card-body">

            {/* City Dropdown */}
            <div className="nb-city-wrap" onClick={() => setCityOpen(o => !o)}>
              <MdLocationOn size={16} className="nb-city-icon" />
              <div className="nb-city-texts">
                <span className="nb-city-label">CITY</span>
                <span className="nb-city-name">{city}</span>
              </div>
              <MdKeyboardArrowDown size={16} className={`nb-city-arrow${cityOpen ? ' nb-city-arrow--open' : ''}`} />
              {cityOpen && (
                <div className="nb-city-dropdown">
                  {CITIES.map(c => (
                    <button
                      key={c}
                      className={`nb-city-option${c === city ? ' nb-city-option--active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setCity(c); setCityOpen(false); }}
                    >
                      <MdLocationOn size={13} />
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="nb-sep" />

            {/* Search Input */}
            <input
              className="nb-input"
              placeholder={cat.placeholder}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKey}
            />

            {/* Toggle options (Buy/Rent, Boys/Girls etc) */}
            {cat.showToggle && cat.toggleOptions && (
              <>
                <div className="nb-sep" />
                <div className="nb-toggle-wrap">
                  {cat.toggleOptions.map((opt, i) => (
                    <label key={opt} className="nb-radio-label">
                      <input
                        type="radio"
                        name="cat-toggle"
                        checked={toggleIdx === i}
                        onChange={() => setToggleIdx(i)}
                        className="nb-radio-input"
                      />
                      <span className={`nb-radio-custom${toggleIdx === i ? ' nb-radio-custom--active' : ''}`} />
                      <span className="nb-radio-text">{opt}</span>
                    </label>
                  ))}
                </div>
              </>
            )}

            {/* Search Button */}
            <button className="nb-search-btn" onClick={handleSearch}>
              <IoSearch size={20} />
              <span className="nb-search-btn-text">Search</span>
            </button>
          </div>
        </div>

        {/* Mobile: tabs + search (separate from desktop card) */}
        <div className="nb-mobile-card">
          <div className="nb-mobile-tabs">
            {CATEGORIES.map((c, i) => (
              <button
                key={c.id}
                className={`nb-mobile-tab${i === activeIdx ? ' nb-mobile-tab--active' : ''}`}
                onClick={() => handleTabChange(i)}
              >
                <span>{c.icon}</span>
                <span>{c.shortLabel}</span>
              </button>
            ))}
          </div>
          <div className="nb-search--mobile">
            <IoSearch size={17} className="nb-mobile-search-icon" />
            <input
              className="nb-input"
              placeholder={cat.mobilePlaceholder}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKey}
            />
            <button className="nb-search-btn nb-search-btn--mobile" onClick={handleSearch}>
              <IoSearch size={18} />
            </button>
          </div>
        </div>

        {/* ── Trending ── */}
        <div className="nb-trending">
          <span className="nb-trending-label">Trending:</span>
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
