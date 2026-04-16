import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TABS = ['Popular', 'PGs', 'Hotels', 'Premium Stays', 'Economy Stays', 'Signature Stays'];

// All data based on REAL API data — only sectors with 3+ actual properties
const DATA = {
  // Top sectors by total property count (3+ props each)
  Popular: [
    { city: 'Sector 15, Noida',   type: 'PG & Co-Living' },
    { city: 'Sector 62, Noida',   type: 'PG Accommodation' },
    { city: 'Sector 16, Noida',   type: 'PG Accommodation' },
    { city: 'Sector 126, Noida',  type: 'PG & Apartment' },
    { city: 'Sector 27, Noida',   type: 'Co-Living Space' },
    { city: 'Sector 19, Noida',   type: 'PG Accommodation' },
    { city: 'Sector 18, Noida',   type: 'PG Accommodation' },
    { city: 'Sector 63, Noida',   type: 'PG & Co-Living' },
    { city: 'Sector 72, Noida',   type: 'Co-Living Space' },
    { city: 'Sector 132, Noida',  type: 'PG Accommodation' },
    { city: 'Sector 52, Noida',   type: 'PG Accommodation' },
    { city: 'Sector 48, Noida',   type: 'PG Accommodation' },
  ],

  // PG category (3+ props per sector) → navigates to Monthly Rental
  PGs: [
    { city: 'Sector 15, Noida',   type: 'PG Accommodation' },
    { city: 'Sector 62, Noida',   type: 'PG Accommodation' },
    { city: 'Sector 16, Noida',   type: 'PG Accommodation' },
    { city: 'Sector 126, Noida',  type: 'PG Accommodation' },
    { city: 'Sector 27, Noida',   type: 'PG Accommodation' },
    { city: 'Sector 19, Noida',   type: 'PG Accommodation' },
    { city: 'Sector 18, Noida',   type: 'PG Accommodation' },
    { city: 'Sector 63, Noida',   type: 'PG Accommodation' },
    { city: 'Sector 132, Noida',  type: 'PG Accommodation' },
    { city: 'Sector 52, Noida',   type: 'PG Accommodation' },
    { city: 'Sector 48, Noida',   type: 'PG Accommodation' },
    { city: 'Sector 2, Noida',    type: 'PG Accommodation' },
  ],

  // Hotel properties — city level (hotel data is city-level in DB)
  Hotels: [
    { city: 'Noida',          type: 'Hotel Stay' },
    { city: 'Delhi',          type: 'Hotel Stay' },
    { city: 'Greater Noida',  type: 'Service Apartment' },
    { city: 'Gurugram',       type: 'Hotel Stay' },
    { city: 'Vrindavan',      type: 'Hotel Stay' },
  ],

  // Co-living Space type — sectors with 3+ properties
  'Economy Stays': [
    { city: 'Sector 130, Noida',  type: 'Co-Living Space' },
    { city: 'Sector 72, Noida',   type: 'Co-Living Space' },
    { city: 'Sector 116, Noida',  type: 'Co-Living Space' },
    { city: 'Sector 73, Noida',   type: 'Co-Living Space' },
    { city: 'Sector 15, Noida',   type: 'Co-Living Space' },
    { city: 'Sector 137, Noida',  type: 'Co-Living Space' },
    { city: 'Sector 144, Noida',  type: 'Co-Living Space' },
    { city: 'Sector 27, Noida',   type: 'Co-Living Space' },
  ],

  // Apartment / Flat category
  'Premium Stays': [
    { city: 'Sector 168, Noida',  type: 'Furnished Apartment' },
    { city: 'Sector 143, Noida',  type: 'Furnished Apartment' },
    { city: 'Noida',              type: 'Premium Apartment' },
    { city: 'Greater Noida',      type: 'Luxury Flat' },
    { city: 'Delhi',              type: 'Premium Apartment' },
    { city: 'Gurugram',           type: 'Luxury Apartment' },
  ],

  // Signature Stays — ONLY real Ovika Signature properties from DB
  'Signature Stays': [
    { city: 'Knowledge Park 3, Greater Noida', type: 'Ovika Signature 1' },
    { city: 'Sector 137, Noida',               type: 'Ovika Signature 2' },
    { city: 'Godrej Golf Links, Greater Noida', type: 'Ovika Signature 3' },
    { city: 'Sector 143, Noida',               type: 'Ovika Signature 4' },
    { city: 'Sector 143, Noida',               type: 'Ovika Signature 5' },
  ],
};

function getSearchPath(tab, city) {
  const p = new URLSearchParams();

  // Signature Stays — no city filter, show all signature properties
  if (tab === 'Signature Stays') {
    p.set('category', 'Signature Stays');
    return `/properties?${p}`;
  }

  p.set('search', city);
  p.set('city', city);

  if (tab === 'PGs') {
    // PGs always go to Monthly Rental
    p.set('category', 'PG');
    p.set('rentalType', 'long');
  } else if (tab === 'Hotels') {
    p.set('property_type', 'Hotel Room');
  } else if (tab === 'Premium Stays') {
    p.set('category', 'Apartment');
  } else if (tab === 'Economy Stays') {
    p.set('property_type', 'Co-living Space');
  } else if (tab === 'Signature Stays') {
    p.set('category', 'Signature Stays');
  }
  return `/properties?${p}`;
}

const css = `
.insp-tab-bar::-webkit-scrollbar { display: none; }
.insp-tab-bar { -ms-overflow-style: none; scrollbar-width: none; }
.insp-item:hover .insp-city { text-decoration: underline; }
`;

export default function InspirationSection() {
  const [activeTab, setActiveTab] = useState('Popular');
  const [showAll, setShowAll] = useState(false);
  const tabBarRef = useRef(null);
  const navigate = useNavigate();

  const items = DATA[activeTab] || [];
  const displayItems = showAll ? items : items.slice(0, 12);

  const scrollTabs = (dir) => {
    if (tabBarRef.current) {
      tabBarRef.current.scrollBy({ left: dir * 120, behavior: 'smooth' });
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowAll(false);
  };

  return (
    <div style={{ background: '#fff', padding: '48px 40px 56px', fontFamily: "'Poppins', sans-serif" }}>
      <style>{css}</style>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Title */}
        <h2 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.45rem)', fontWeight: 600, color: '#1a1209', margin: '0 0 24px' }}>
          Inspiration for future getaways
        </h2>

        {/* Tab bar */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: 0 }}>

          {/* Left arrow */}
          <button
            onClick={() => scrollTabs(-1)}
            className="insp-arrow-btn"
            style={{ display: 'none', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', width: 28, height: 28, borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', flexShrink: 0, fontSize: 14, color: '#1a1209', alignItems: 'center', justifyContent: 'center' }}
          >‹</button>

          <div
            ref={tabBarRef}
            className="insp-tab-bar"
            style={{ display: 'flex', gap: 0, overflowX: 'auto', flex: 1 }}
          >
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                style={{
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
                  fontWeight: activeTab === tab ? 600 : 400,
                  color: activeTab === tab ? '#1a1209' : '#6b7280',
                  padding: '10px 16px',
                  whiteSpace: 'nowrap',
                  borderBottom: activeTab === tab ? '2px solid #1a1209' : '2px solid transparent',
                  transition: 'all 0.18s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => { if (activeTab !== tab) e.currentTarget.style.color = '#1a1209'; }}
                onMouseLeave={e => { if (activeTab !== tab) e.currentTarget.style.color = '#6b7280'; }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scrollTabs(1)}
            className="insp-arrow-btn"
            style={{ display: 'none', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', width: 28, height: 28, borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', flexShrink: 0, fontSize: 14, color: '#1a1209', alignItems: 'center', justifyContent: 'center' }}
          >›</button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#e5e7eb', marginBottom: 24 }} />

        {/* Grid */}
        <div className="insp-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '20px 16px' }}>
          {displayItems.map((item, i) => (
            <div
              key={i}
              className="insp-item"
              onClick={() => navigate(getSearchPath(activeTab, item.city))}
              style={{ cursor: 'pointer' }}
            >
              <div className="insp-city" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1a1209', lineHeight: 1.3 }}>
                {item.city}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#c2772b', marginTop: 2, fontWeight: 400 }}>
                {item.type}
              </div>
            </div>
          ))}

          {/* Show more / less */}
          {items.length > 12 && (
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <button
                onClick={() => setShowAll(v => !v)}
                style={{
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif", fontSize: '0.875rem',
                  fontWeight: 600, color: '#1a1209', padding: 0,
                  display: 'flex', alignItems: 'center', gap: 4,
                  textDecoration: 'underline',
                }}
              >
                {showAll ? 'Show less ↑' : 'Show more ↓'}
              </button>
            </div>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .insp-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 18px 12px !important;
          }
          .insp-arrow-btn {
            display: flex !important;
          }
        }
        @media (max-width: 1024px) and (min-width: 769px) {
          .insp-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
