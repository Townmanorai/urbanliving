import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Hotel, Building2, Home, Building, Users, ArrowRight } from 'lucide-react';
import { navClick, auxNavClick } from '../../utils/navClick';
import './ListingGuidePage.css';

const CATEGORIES = [
  {
    id: 'signature',
    icon: <Hotel size={32} strokeWidth={1.4} />,
    label: 'Signature Stays',
    tag: 'Nightly',
    tagClass: 'nightly',
    path: '/listed1?category=Signature+Stays',
    subtitle: 'Premium, luxury & high-end properties',
    about:
      'Signature Stays are OvikaLiving\'s top-tier nightly listings — think luxury villas, premium suites, serviced apartments, and signature homes. These properties offer a 5-star experience with premium amenities, professional photography, and priority placement on the platform.',
    idealFor: ['Luxury villa owners', 'Premium suite hosts', 'High-end serviced apartment owners', 'Signature bungalow & penthouse owners'],
    features: ['Priority listing placement', 'OvikaLiving Signature badge', 'Premium guest pool', 'Nightly & weekly pricing'],
  },
  {
    id: 'hotel',
    icon: <Building2 size={32} strokeWidth={1.4} />,
    label: 'Hotel Stays',
    tag: 'Nightly',
    tagClass: 'nightly',
    path: '/listed1?category=Hotel+Stays',
    subtitle: 'Hotels, boutique stays & premium rooms',
    about:
      'List your hotel, boutique property, or business accommodation on OvikaLiving and reach thousands of travelers. From budget hotels to luxury boutique properties, we help you fill rooms faster with real-time booking management.',
    idealFor: ['Hotel owners & managers', 'Boutique guesthouse owners', 'Business hotels', 'Resort operators'],
    features: ['Real-time room availability', 'Multi-room management', 'Instant booking support', 'Business traveler reach'],
  },
  {
    id: 'homestay',
    icon: <Home size={32} strokeWidth={1.4} />,
    label: 'Homestays & BnB',
    tag: 'Nightly',
    tagClass: 'nightly',
    path: '/listed1?category=Homestays+%26+BnB',
    subtitle: 'Hosted homes, B&Bs, vacation rentals & farm stays',
    about:
      'Have a spare room or an entire home? List it as a Homestay or Bed & Breakfast. This is the most personal category — guests love the local experience, home-cooked breakfasts, and authentic stay. Vacation homes, farm stays, and cottages also fall here.',
    idealFor: ['Home owners with spare rooms', 'B&B hosts', 'Vacation home owners', 'Farm & cottage stay owners'],
    features: ['Flexible availability calendar', 'Host profile & reviews', 'Guests who love local stays', 'Nightly & weekend pricing'],
  },
  {
    id: 'apartments',
    icon: <Building size={32} strokeWidth={1.4} />,
    label: 'Apartments & Villas',
    tag: 'Monthly',
    tagClass: 'monthly',
    path: '/list-pg?category=Apartments+%26+Villas',
    subtitle: 'Apartments, villas, studio, penthouse & duplex',
    about:
      'List your apartment, villa, studio, or independent house for long-term monthly rental. This category covers all residential properties rented on a monthly basis — perfect for working professionals, families, and students looking for furnished or semi-furnished accommodation.',
    idealFor: ['Apartment owners', 'Villa & bungalow owners', 'Studio & 1-2-3 BHK flat owners', 'Penthouse & duplex owners'],
    features: ['Monthly rental pricing', 'Tenant verification support', 'Long-term lease management', 'Wide tenant reach'],
  },
  {
    id: 'pg',
    icon: <Users size={32} strokeWidth={1.4} />,
    label: 'PG & Co-Living',
    tag: 'Monthly',
    tagClass: 'monthly',
    path: '/list-pg?category=PG+%26+Co-Living',
    subtitle: 'PG, hostels & co-living spaces',
    about:
      'PG & Co-Living is for property owners who offer shared accommodation on a monthly basis. Whether you run a paying guest house, a hostel, or a modern co-living space, OvikaLiving helps you manage rooms, sharing types, tenant preferences, and monthly billing — all in one place.',
    idealFor: ['PG house owners', 'Boys / Girls hostel owners', 'Co-living space operators', 'Student accommodation providers'],
    features: ['Room & sharing type management', 'Tenant preference filters', 'PG-specific pricing per bed', 'High demand from students & professionals'],
  },
];

const ListingGuidePage = () => {
  const navigate = useNavigate();

  return (
    <div className="lg-root">
      <Helmet>
        <title>Property Listing Guide — Which Type Suits You? | OvikaLiving</title>
        <meta name="description" content="Complete guide to listing your property on OvikaLiving. Compare Signature Stays, Hotel Stays, Homestays & BnB, Apartments & Villas, and PG & Co-Living. Find the right category and start listing today." />
        <link rel="canonical" href="https://www.ovikaliving.com/listing-guide" />
        <meta property="og:title" content="Property Listing Guide | OvikaLiving" />
        <meta property="og:description" content="Compare all 5 property listing categories on OvikaLiving — Signature Stays, Hotels, Homestays, Apartments & PG Co-Living. Pick the right one and start earning." />
        <meta property="og:url" content="https://www.ovikaliving.com/listing-guide" />
        <meta property="og:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
        <meta name="twitter:title" content="Property Listing Guide | OvikaLiving" />
        <meta name="twitter:description" content="Compare all 5 property categories. Find the right listing type for your property on OvikaLiving." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Header */}
      <div className="lg-header">
        <div className="lg-eyebrow">Listing Guide</div>
        <h1 className="lg-title">Which property type <span className="lg-accent">suits you?</span></h1>
        <p className="lg-sub">
          A quick guide to all 5 listing categories on OvikaLiving — understand what each one means and pick the right one for your property.
        </p>
      </div>

      {/* Category cards */}
      <div className="lg-list">
        {CATEGORIES.map((cat, idx) => (
          <div key={cat.id} className="lg-card">
            {/* Left: icon + tag */}
            <div className="lg-card-left">
              <div className="lg-icon-box">{cat.icon}</div>
              <span className={`lg-tag lg-tag--${cat.tagClass}`}>{cat.tag}</span>
            </div>

            {/* Right: content */}
            <div className="lg-card-right">
              <h2 className="lg-cat-title">{cat.label}</h2>
              <p className="lg-cat-sub">{cat.subtitle}</p>
              <p className="lg-cat-about">{cat.about}</p>

              <div className="lg-two-col">
                <div>
                  <div className="lg-col-head">Ideal for</div>
                  <ul className="lg-list-ul">
                    {cat.idealFor.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <div className="lg-col-head">Key features</div>
                  <ul className="lg-list-ul">
                    {cat.features.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>

              <button
                className="lg-cta"
                onClick={(e) => navClick(e, cat.path, navigate)}
                onAuxClick={(e) => auxNavClick(e, cat.path)}
              >
                List as {cat.label} <ArrowRight size={15} style={{ marginLeft: 6 }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Back */}
      <button
        className="lg-back"
        onClick={(e) => navClick(e, '/list-category', navigate)}
        onAuxClick={(e) => auxNavClick(e, '/list-category')}
      >
        ← Back to category selection
      </button>
    </div>
  );
};

export default ListingGuidePage;
