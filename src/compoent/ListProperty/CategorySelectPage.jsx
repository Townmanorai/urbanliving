import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Hotel, Building2, Home, Building, Users } from 'lucide-react';
import { navClick, auxNavClick } from '../../utils/navClick';
import './CategorySelectPage.css';

const ALL_CATS = [
  {
    id: 'signature',
    icon: <Hotel size={26} strokeWidth={1.5} />,
    label: 'Signature Stays',
    sub: 'Luxury villas, premium suites & signature homes',
    tag: 'Nightly',
    path: '/signature-listing',
  },
  {
    id: 'hotel',
    icon: <Building2 size={26} strokeWidth={1.5} />,
    label: 'Hotel Stays',
    sub: 'Hotel rooms, boutique & business hotels',
    tag: 'Nightly',
    path: '/list-hotel',
  },
  {
    id: 'homestay',
    icon: <Home size={26} strokeWidth={1.5} />,
    label: 'Homestays & BnB',
    sub: 'Hosted homes, B&B, vacation rentals & farm stays',
    tag: 'Nightly',
    path: '/listed1?category=Homestays+%26+BnB',
  },
  {
    id: 'apartments',
    icon: <Building size={26} strokeWidth={1.5} />,
    label: 'Apartments & Villas',
    sub: 'Apartments, villas, studio, penthouse & duplex',
    tag: 'Monthly',
    path: '/list-pg?category=Apartments+%26+Villas',
  },
  {
    id: 'pg',
    icon: <Users size={26} strokeWidth={1.5} />,
    label: 'PG & Co-Living',
    sub: 'PG, hostels & co-living spaces',
    tag: 'Monthly',
    path: '/list-pg?category=PG+%26+Co-Living',
  },
];

const ROW1 = ALL_CATS.slice(0, 3);
const ROW2 = ALL_CATS.slice(3);

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
    <span className="csp-arrow-blink">&#8594;</span>
  </button>
);

const CategorySelectPage = () => {
  const navigate = useNavigate();

  return (
    <div className="csp-root">
      <Helmet>
        <title>List Your Property — Choose Category | OvikaLiving</title>
        <meta name="description" content="List your property on OvikaLiving. Choose from Signature Stays, Hotel Stays, Homestays, Apartments & Villas, or PG & Co-Living. Start listing in minutes — no brokerage." />
        <meta name="keywords" content="list property OvikaLiving, property type selection, list PG Noida, list hotel Noida, list apartment Noida, list homestay, signature stay listing, co-living listing, property category OvikaLiving" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ovikaliving.com/list-category" />
        <meta name="author" content="OvikaLiving" />
        <meta name="language" content="en" />
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Noida" />
        <meta name="geo.position" content="28.5355;77.3910" />
        <meta name="ICBM" content="28.5355, 77.3910" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="List Your Property — Choose Category | OvikaLiving" />
        <meta property="og:description" content="List your property on OvikaLiving. 5 categories — nightly stays, apartments, PG & co-living. Start listing in minutes." />
        <meta property="og:url" content="https://www.ovikaliving.com/list-category" />
        <meta property="og:site_name" content="OvikaLiving" />
        <meta property="og:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@OvikaLiving" />
        <meta name="twitter:title" content="List Your Property — Choose Category | OvikaLiving" />
        <meta name="twitter:description" content="List your property on OvikaLiving. 5 categories — nightly stays, apartments, PG & co-living." />
        <meta name="twitter:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
      </Helmet>

      <div className="csp-header">
        <div className="csp-eyebrow">List Your Property</div>
        <h1 className="csp-title">
          Select your <span className="csp-accent">property type</span>
        </h1>
        <p className="csp-sub">
          Choose the category that best describes your property to get started
        </p>
      </div>

      {/* Desktop: 2 rows */}
      <div className="csp-desktop-rows">
        <div className="csp-row csp-row--3">
          {ROW1.map(cat => <CatCard key={cat.id} cat={cat} navigate={navigate} />)}
        </div>
        <div className="csp-row csp-row--2">
          {ROW2.map(cat => <CatCard key={cat.id} cat={cat} navigate={navigate} />)}
        </div>
      </div>

      {/* Mobile: all 5 stacked */}
      <div className="csp-mobile-stack">
        {ALL_CATS.map(cat => <CatCard key={cat.id} cat={cat} navigate={navigate} />)}
      </div>

      <p className="csp-note">
        Not sure which category?{' '}
        <a href="/listing-guide" className="csp-link">Learn more</a> about listing types.
      </p>
    </div>
  );
};

export default CategorySelectPage;
