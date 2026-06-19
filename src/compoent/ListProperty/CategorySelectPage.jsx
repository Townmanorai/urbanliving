import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, Building2, Home, Building, Users } from 'lucide-react';
import { navClick, auxNavClick } from '../../utils/navClick';
import './CategorySelectPage.css';

const ROW1 = [
  {
    id: 'signature',
    icon: <Hotel size={30} strokeWidth={1.5} />,
    label: 'Signature Stays',
    sub: 'Luxury villas, premium suites & signature homes',
    tag: 'Nightly',
    path: '/listed1?category=Signature+Stays',
  },
  {
    id: 'hotel',
    icon: <Building2 size={30} strokeWidth={1.5} />,
    label: 'Hotel Stays',
    sub: 'Hotel rooms, boutique & business hotels',
    tag: 'Nightly',
    path: '/listed1?category=Hotel+Stays',
  },
  {
    id: 'homestay',
    icon: <Home size={30} strokeWidth={1.5} />,
    label: 'Homestays & BnB',
    sub: 'Hosted homes, B&B, vacation rentals & farm stays',
    tag: 'Nightly',
    path: '/listed1?category=Homestays+%26+BnB',
  },
];

const ROW2 = [
  {
    id: 'apartments',
    icon: <Building size={30} strokeWidth={1.5} />,
    label: 'Apartments & Villas',
    sub: 'Apartments, villas, studio, penthouse & duplex',
    tag: 'Monthly',
    path: '/list-pg?category=Apartments+%26+Villas',
  },
  {
    id: 'pg',
    icon: <Users size={30} strokeWidth={1.5} />,
    label: 'PG & Co-Living',
    sub: 'PG, hostels & co-living spaces',
    tag: 'Monthly',
    path: '/list-pg?category=PG+%26+Co-Living',
  },
];

const CatCard = ({ cat, navigate }) => (
  <button
    className="csp-card"
    onClick={(e) => navClick(e, cat.path, navigate)}
    onAuxClick={(e) => auxNavClick(e, cat.path)}
  >
    <span className={`csp-tag csp-tag--${cat.tag.toLowerCase()}`}>{cat.tag}</span>
    <div className="csp-cat-icon">{cat.icon}</div>
    <div className="csp-cat-info">
      <h3>{cat.label}</h3>
      <p>{cat.sub}</p>
    </div>
  </button>
);

const CategorySelectPage = () => {
  const navigate = useNavigate();

  return (
    <div className="csp-root">
      <div className="csp-header">
        <div className="csp-eyebrow">List Your Property</div>
        <h1 className="csp-title">
          Select your <span className="csp-accent">property type</span>
        </h1>
        <p className="csp-sub">
          Choose the category that best describes your property to get started
        </p>
      </div>

      {/* Row 1 — 3 cards */}
      <div className="csp-row csp-row--3">
        {ROW1.map(cat => <CatCard key={cat.id} cat={cat} navigate={navigate} />)}
      </div>

      {/* Row 2 — 2 cards */}
      <div className="csp-row csp-row--2">
        {ROW2.map(cat => <CatCard key={cat.id} cat={cat} navigate={navigate} />)}
      </div>

      <p className="csp-note">
        Not sure which category?{' '}
        <a href="/listing-guide" className="csp-link">Learn more</a> about listing types.
      </p>
    </div>
  );
};

export default CategorySelectPage;
