
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiMapPin, FiHeart, FiPlus, FiStar, FiX, FiMoon, FiCalendar, FiTag, FiHome, FiTrendingUp, FiAward, FiClock } from 'react-icons/fi';
import { BiBed, BiBath, BiArea } from 'react-icons/bi';

const API_BASE_URL = 'https://www.townmanor.ai/api/ovika';

const CATEGORIES = [
  { id: 'PG', title: 'PG', minPrice: 0, maxPrice: 1499 },
  { id: 'Economy Stay', title: 'Economy Stay', minPrice: 1500, maxPrice: 2499 },
  { id: 'Premium Stay', title: 'Premium Stay', minPrice: 2500, maxPrice: Infinity },
];

const CategoryIcon = ({ id, size = 14, color = 'currentColor' }) => {
  if (id === 'PG') return <FiHome style={{ fontSize: size, color }} />;
  if (id === 'Economy Stay') return <FiTrendingUp style={{ fontSize: size, color }} />;
  if (id === 'Premium Stay') return <FiAward style={{ fontSize: size, color }} />;
  return null;
};

// ─── SHARED BED/BATH HELPERS (same logic as PropertyDetailPage) ──────────────

/**
 * Parse any field that could be a JSON string, array, or number into an array.
 */
const parseJsonField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    const trimmed = field.trim();
    // Pure integer string → NOT an array, return []
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

/**
 * Get bedroom COUNT — consistent with DetailPage's getDisplayCount():
 *   - If parsedBedrooms array has items → use its length
 *   - Otherwise fall back to Number(raw)
 */
const getBedCount = (rawBedrooms) => {
  const parsed = parseJsonField(rawBedrooms);
  if (parsed.length > 0) return parsed.length;
  const n = Number(rawBedrooms);
  return isNaN(n) ? 0 : Math.max(0, n);
};

/**
 * Get bathroom COUNT — consistent with DetailPage's getDisplayCount():
 *   - If parsedBathrooms array has items → sum all 'count' fields (same as DetailPage does for attached count)
 *   - Otherwise fall back to Number(raw)
 */
const getBathCount = (rawBathrooms) => {
  const parsed = parseJsonField(rawBathrooms);
  if (parsed.length > 0) {
    // Each item may have a { type, count } shape
    const hasCount = parsed.some(item => item && typeof item === 'object' && 'count' in item);
    if (hasCount) {
      return parsed.reduce((sum, item) => sum + (Number(item.count) || 0), 0);
    }
    return parsed.length;
  }
  const n = Number(rawBathrooms);
  return isNaN(n) ? 0 : Math.max(0, n);
};

// ─────────────────────────────────────────────────────────────────────────────

/* ─── Property Card ─────────────────────────────── */
const PropertyCard = ({ property, rentalType }) => {
  const navigate = useNavigate();
  const [fav, setFav] = useState(false);

  const randomRating = useMemo(() => {
    return (Math.random() * (4.9 - 4.1) + 4.1).toFixed(1);
  }, [property.id]);

  const formatPrice = (price) => {
    const n = Number(price);
    if (!price || isNaN(n)) return 'Price on Request';
    return `₹${n.toLocaleString('en-IN')}`;
  };

  const getMeta = () => {
    if (!property.meta) return {};
    if (typeof property.meta === 'object') return property.meta;
    try { return JSON.parse(property.meta); } catch { return {}; }
  };

  const meta = getMeta();
  const isMonthly = rentalType === 'long';

  const getPgMinPrice = () => {
    try {
      const beds = typeof property.bedrooms === 'string'
        ? JSON.parse(property.bedrooms)
        : (property.bedrooms || []);
      const prices = beds
        .map(b => Number(b.price) || Number(b.monthly_price) || 0)
        .filter(p => p > 0);
      if (prices.length > 0) return Math.min(...prices);
    } catch { }
    return 0;
  };

  const getDisplayPrice = () => {
    if (property.property_category === 'PG') {
      if (isMonthly) {
        const minRoomPrice = getPgMinPrice();
        const monthly = minRoomPrice || Number(meta?.perMonthPrice) || Number(meta?.monthlyPrice) || Number(property.monthly_price) || Number(property.base_rate) || 0;
        if (monthly <= 1500) return { price: 0, label: '', prefix: null, forceRequest: true };
        return { price: monthly, label: '/ month', prefix: 'Starts at', forceRequest: false };
      } else {
        const nightly = Number(property.base_rate) || Number(property.price) || Number(meta?.perNightPrice) || 0;
        return { price: nightly, label: '/ night', prefix: 'Starts at', forceRequest: false };
      }
    }
    if (isMonthly) {
      const monthly = Number(meta?.perMonthPrice) || Number(meta?.monthlyPrice) || Number(property.monthly_price) || Number(property.price) || 0;
      if (monthly <= 1500) return { price: 0, label: '', prefix: null, forceRequest: true };
      return { price: monthly, label: '/ month', prefix: null, forceRequest: false };
    }
    return { price: Number(property.price) || 0, label: '/ night', prefix: null, forceRequest: false };
  };

  const { price: displayPrice, label: priceLabel, prefix: pricePrefix, forceRequest } = getDisplayPrice();

  const coverPhoto = (() => {
    const photos = Array.isArray(property.photos) ? property.photos : [];
    const idx = Number(property.cover_photo_index);
    if (!Number.isNaN(idx) && idx >= 0 && idx < photos.length && photos[idx]) {
      return photos[idx];
    }
    if (Array.isArray(photos) && photos.length > 0) return photos[0];
    if (property.cover_photo) return property.cover_photo;
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
  })();

  // ── USE SHARED HELPERS (same as DetailPage) ──────────────────────────────
  const bedCount  = getBedCount(property.bedrooms);
  const bathCount = getBathCount(property.bathrooms);
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      onClick={(e) => { if (!e.target.closest('[data-action]')) navigate(`/property/${property.id}`); }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.13)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)'}
      style={{
        background: '#fff', borderRadius: 14, overflow: 'hidden',
        cursor: 'pointer', border: '1px solid #e8e8e8',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        transition: 'box-shadow 0.25s ease',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: '#f0f0f0' }}>
        <img
          src={coverPhoto}
          alt={property.property_name}
          onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'; }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
        />
        <button
          data-action="fav"
          onClick={e => { e.stopPropagation(); setFav(!fav); }}
          style={{
            position: 'absolute', top: 10, right: 10,
            width: 32, height: 32, background: 'rgba(255,255,255,0.88)',
            border: 'none', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(4px)',
            color: fav ? '#e84040' : '#555', fontSize: 15,
            zIndex: 1,
          }}
        >
          <FiHeart style={{ fill: fav ? '#e84040' : 'none' }} />
        </button>

        {property.property_name?.toLowerCase().includes('signature') && (
          <img 
            src="/ovikaver.png" 
            alt="Verified" 
            style={{
              position: 'absolute',
              top: -12,
              left: -12,
              width: 'clamp(60px, 15vw, 85px)',
              height: 'auto',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              pointerEvents: 'none',
              zIndex: 10
            }}
          />
        )}

        {(property.property_category || property.property_name?.toLowerCase().includes('ovika') || property.property_name?.toLowerCase().includes('signature')) && (
          <span style={{
            position: 'absolute', bottom: 10, left: 10,
            background: 'rgba(255,255,255,0.92)', color: '#222',
            padding: '3px 10px', borderRadius: 6, fontSize: 11,
            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            { (property.property_name?.toLowerCase().includes('ovika') || property.property_name?.toLowerCase().includes('signature')) 
              ? 'Premium Stay' 
              : property.property_category 
            }
          </span>
        )}

        <span style={{
          position: 'absolute', bottom: 10, right: 10,
          background: isMonthly ? 'rgba(201,139,62,0.92)' : 'rgba(30,30,30,0.82)',
          color: '#fff',
          padding: '3px 10px', borderRadius: 6, fontSize: 11,
          fontWeight: 700, letterSpacing: '0.04em',
        }}>
          {isMonthly ? 'Monthly' : 'Nightly'}
        </span>
      </div>

      {/* Card Body */}
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {/* Title + Rating */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <h3 style={{
            fontSize: 15, fontWeight: 600, color: '#222', lineHeight: 1.3,
            flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0,
          }}>
            {property.property_name || 'Untitled Property'}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
            <FiStar style={{ fontSize: 13, color: '#222', fill: '#222' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#222' }}>{randomRating}</span>
          </div>
        </div>

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#717171', fontSize: 13 }}>
          <FiMapPin style={{ fontSize: 13, flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {property.city || 'City not specified'}{property.address ? `, ${property.address}` : ''}
          </span>
        </div>

        {/* Specs — using shared getBedCount / getBathCount helpers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#717171', fontSize: 13 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <BiBed style={{ fontSize: 15 }} />
            <span>{bedCount > 0 ? bedCount : '—'} Bed{bedCount !== 1 ? 's' : ''}</span>
          </div>
          <span style={{ color: '#ddd' }}>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <BiBath style={{ fontSize: 15 }} />
            <span>{bathCount > 0 ? bathCount : '—'} Bath{bathCount !== 1 ? 's' : ''}</span>
          </div>
          <span style={{ color: '#ddd' }}>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <BiArea style={{ fontSize: 15 }} /><span>{property.area || 0} sqft</span>
          </div>
        </div>

        {/* Amenities */}
        {Array.isArray(property.amenities) && property.amenities.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 2 }}>
            {property.amenities.slice(0, 3).map((a, i) => (
              <span key={i} style={{
                padding: '3px 9px', background: '#f5f5f5', color: '#717171',
                borderRadius: 6, fontSize: 12, fontWeight: 500,
              }}>{a}</span>
            ))}
            {property.amenities.length > 3 && (
              <span style={{
                padding: '3px 9px', background: '#C98B3E', color: '#fff',
                borderRadius: 6, fontSize: 12, fontWeight: 500,
              }}>+{property.amenities.length - 3} more</span>
            )}
          </div>
        )}

        {/* ── PRICE SECTION ── */}
        <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #f0f0f0' }}>
          {forceRequest ? (
            <span style={{ fontSize: 13, fontWeight: 600, color: '#999', fontStyle: 'italic' }}>
              Price on Request
            </span>
          ) : (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
              {pricePrefix && (
                <span style={{ fontSize: 12, color: '#999', fontWeight: 500 }}>{pricePrefix}</span>
              )}
              <span style={{ fontSize: 17, fontWeight: 700, color: '#222' }}>
                {formatPrice(displayPrice)}
              </span>
              {displayPrice > 0 && (
                <span style={{ fontSize: 13, color: '#717171' }}>{priceLabel}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Main Page ─────────────────────────────────── */
const PropertyListPage = () => {
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState(null);
  const [rentalType, setRentalType] = useState(null);
  const [showRentalPopup, setShowRentalPopup] = useState(false);
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const SHORT_TERM_TYPES = [
    'Entire place', 'Private room', 'Shared room', 'Hotel room', 'Homestay'
  ];
  const isLongTermProperty = (p) => !SHORT_TERM_TYPES.includes(p.property_type);

  const getPgNightlyPrice = (p) => {
    const meta = (() => {
      if (!p.meta) return {};
      if (typeof p.meta === 'object') return p.meta;
      try { return JSON.parse(p.meta); } catch { return {}; }
    })();
    return Number(p.base_rate) || Number(p.price) || Number(meta?.perNightPrice) || 0;
  };

  const applyFilter = (list, cat, q, rental) => {
    let result = list;
    const isMonthly = rental === 'long';

    if (isMonthly) {
      result = result.filter(p =>
        p.property_category === 'PG' || isLongTermProperty(p)
      );
    } else {
      result = result.filter(p =>
        p.property_category === 'PG' || !isLongTermProperty(p)
      );

      result = result.filter(p => {
        if (p.property_category !== 'PG') return true;
        const nightlyPrice = getPgNightlyPrice(p);
        return nightlyPrice === 0 || nightlyPrice <= 3000;
      });
    }

        if (cat) {
          result = result.filter(p => {
            const isSignature = p.property_name?.toLowerCase().includes('signature');
            const isOvika = p.property_name?.toLowerCase().includes('ovika');
            
            // If it's an Ovika or Signature property, it MUST be in Premium Stay category ONLY
            if (isSignature || isOvika) {
              return cat.id === 'Premium Stay';
            }

            if (cat.id === 'PG') return p.property_category === 'PG';
            if (p.property_category === 'PG') return false;

            if (isMonthly) {
              const price = Number(p.price) || 0;
              if (cat.id === 'Economy Stay') return price >= 8000 && price <= 25000;
              if (cat.id === 'Premium Stay') return price > 25000;
            } else {
              const price = Number(p.price) || 0;
              return price >= cat.minPrice && price <= cat.maxPrice;
            }
            return false;
          });
        }

    if (q.trim()) {
      const qL = q.toLowerCase();
      result = result.filter(p =>
        p.property_name?.toLowerCase().includes(qL) ||
        p.address?.toLowerCase().includes(qL) ||
        p.city?.toLowerCase().includes(qL)
      );
    }

    return result;
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/properties`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const list = data?.data || [];
      setProperties(list);
      setFiltered(list);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProperties(); }, []);
  useEffect(() => { 
    const filteredResults = applyFilter(properties, activeCat, search, rentalType);
    const sortedResults = [...filteredResults].sort((a, b) => {
      const aIsVerified = a.property_name?.toLowerCase().includes('ovika') || a.property_name?.toLowerCase().includes('signature');
      const bIsVerified = b.property_name?.toLowerCase().includes('ovika') || b.property_name?.toLowerCase().includes('signature');
      if (aIsVerified && !bIsVerified) return -1;
      if (!aIsVerified && bIsVerified) return 1;
      return 0;
    });
    setFiltered(sortedResults); 
  }, [search, activeCat, properties, rentalType]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cId = params.get('category');
    if (cId && properties.length > 0) {
      const match = CATEGORIES.find(c =>
        c.id.toLowerCase() === cId.toLowerCase() || c.title.toLowerCase() === cId.toLowerCase()
      );
      if (match) setActiveCat(match);
    }

    const rt = params.get('rentalType');
    if (rt) {
      setRentalType(rt);
    } else {
      const stored = sessionStorage.getItem('ovika_rental_type');
      if (stored) setRentalType(stored);
    }

    const q = params.get('search') || params.get('city');
    if (q) setSearch(q);

    const g = params.get('guests');
    if (g) {
      setGuests(Number(g));
      sessionStorage.setItem('ovika_search_guests', g);
    }

    const cin = params.get('checkIn');
    if (cin) setCheckIn(cin);

    const cout = params.get('checkOut');
    if (cout) setCheckOut(cout);
  }, [location.search, properties]);

  const isMonthly = rentalType === 'long';
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 480;
  const btnFontSize = isMobile ? 10 : 13;
  const btnPadding = isMobile ? '6px 8px' : '7px 14px';
  const btnGap = isMobile ? 3 : 5;
  const btnIconSize = isMobile ? 11 : 14;

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{
        width: 44, height: 44, border: '3px solid #eee',
        borderTopColor: '#C98B3E', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  );

  if (error) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <h2 style={{ margin: 0 }}>Error</h2><p style={{ margin: 0, color: '#999' }}>{error}</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f7', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <Helmet>
        <title>PG, Co-Living & Furnished Rentals in Noida & Greater Noida | OvikaLiving</title>
        <meta name="description" content="Browse verified PG, co-living spaces & furnished apartments in Noida & Greater Noida. Best accommodation for working professionals, students & families. Filter by location, amenities & budget. No brokerage!" />
        <meta name="keywords" content="pg in noida, pg in greater noida, co living in noida, furnished apartment noida, pg for working professionals noida, pg for students noida, pg with food noida, pg with wifi noida, pg with ac noida, furnished apartment greater noida, best pg noida, verified pg noida, no brokerage pg noida, short term stay noida, monthly rentals noida, pg near metro noida, co living spaces noida, studio apartment noida, affordable pg noida, premium pg noida" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ovikaliving.com/properties" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="PG & Co-Living in Noida | OvikaLiving" />
        <meta property="og:description" content="Verified PG, co-living & furnished stays in Noida. No brokerage. Filter by location & amenities. Book now!" />
        <meta property="og:url" content="https://www.ovikaliving.com/properties" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PG & Co-Living Noida | OvikaLiving" />
        <meta name="twitter:description" content="Best PG, co-living & furnished rentals in Noida & Greater Noida. Verified, no brokerage!" />
      </Helmet>

      {/* ── HERO HEADER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #b8762e 0%, #C98B3E 40%, #d4a055 100%)',
        padding: '52px 24px 44px',
        display: 'flex', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.06,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div style={{ maxWidth: 760, width: '100%', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 style={{
            fontSize: 44, fontWeight: 800, color: '#fff',
            margin: '0 0 10px', letterSpacing: '-0.025em', lineHeight: 1.1,
          }}>
            Book your Stay
          </h1>

          {rentalType && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: 50, padding: '4px 14px', marginBottom: 14,
            }}>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  {isMonthly ? <FiCalendar style={{ fontSize: 13 }} /> : <FiMoon style={{ fontSize: 13 }} />}
                  {isMonthly ? 'Monthly Rates' : 'Nightly Rates'}
                </span>
              </span>
            </div>
          )}

          <p style={{
            fontSize: 16, color: 'rgba(255,255,255,0.88)',
            margin: '0 0 30px', lineHeight: 1.65, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto',
          }}>
            Luxury studios, homestays, Hotel Rooms, apartments, Villas & Farmhouses — curated for comfortable short and extended stays
          </p>

          {/* Search Bar */}
          <div style={{
            background: '#fff', borderRadius: 16,
            display: 'flex', alignItems: 'center',
            padding: '14px 16px', gap: 12,
            boxShadow: '0 10px 36px rgba(0,0,0,0.2)',
          }}>
            <FiSearch style={{ fontSize: 20, color: '#aaa', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search by city, locality, or property name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontSize: 15, color: '#222', background: 'transparent',
                fontFamily: 'inherit',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  width: 28, height: 28, borderRadius: '50%', border: 'none',
                  background: '#f0f0f0', color: '#777', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                <FiX style={{ fontSize: 13 }} />
              </button>
            )}
          </div>

          {/* Category Tabs + Rental Type Button */}
          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              gap: 8, marginTop: 14, flexWrap: 'nowrap', width: '100%',
            }}>
              {CATEGORIES.map(cat => {
                const isActive = activeCat?.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCat(isActive ? null : cat)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: btnGap,
                      padding: btnPadding,
                      background: isActive ? '#fff' : 'rgba(255,255,255,0.15)',
                      border: `2px solid ${isActive ? '#fff' : 'rgba(255,255,255,0.4)'}`,
                      borderRadius: 50,
                      color: isActive ? '#C98B3E' : '#fff',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: btnFontSize, cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 4px 14px rgba(0,0,0,0.14)' : 'none',
                      whiteSpace: 'nowrap', flex: '1 1 0', justifyContent: 'center',
                      minWidth: 0,
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.26)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                      }
                    }}
                  >
                    <CategoryIcon id={cat.id} size={btnIconSize} color={isActive ? '#C98B3E' : '#fff'} />
                    <span>{cat.title}</span>
                  </button>
                );
              })}

              {/* Rental Type Button */}
              <button
                onClick={() => setShowRentalPopup(v => !v)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: btnGap,
                  padding: btnPadding,
                  background: rentalType ? '#fff' : 'rgba(255,255,255,0.15)',
                  border: `2px solid ${rentalType ? '#fff' : 'rgba(255,255,255,0.4)'}`,
                  borderRadius: 50,
                  color: rentalType ? '#C98B3E' : '#fff',
                  fontWeight: rentalType ? 700 : 500,
                  fontSize: btnFontSize, cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                  boxShadow: rentalType ? '0 4px 14px rgba(0,0,0,0.14)' : 'none',
                  whiteSpace: 'nowrap', flex: '1 1 0', justifyContent: 'center',
                  minWidth: 0,
                }}
              >
                <FiTag style={{ fontSize: btnIconSize }} />
                <span>Category</span>
              </button>
            </div>

            {/* Rental Type Popup */}

          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '32px 24px 60px' }}>

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#222', margin: 0 }}>
              {activeCat ? activeCat.title : 'All Properties'}
              <span style={{ fontWeight: 400, color: '#aaa', fontSize: 17, marginLeft: 8 }}>
                ({filtered.length})
              </span>
            </h2>
            {activeCat && (
              <button
                onClick={() => setActiveCat(null)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '5px 14px',
                  background: '#FFF6EE', border: '1px solid rgba(201,139,62,0.3)',
                  borderRadius: 50, color: '#C98B3E', fontSize: 13,
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                <FiX style={{ fontSize: 12 }} /> Clear filter
              </button>
            )}
          </div>

          <button
            onClick={() => navigate('/listed1')}
            onMouseEnter={e => e.currentTarget.style.background = '#AF7834'}
            onMouseLeave={e => e.currentTarget.style.background = '#C98B3E'}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', background: '#C98B3E', color: '#fff',
              border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14,
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 2px 8px rgba(201,139,62,0.3)',
              transition: 'background 0.2s ease',
            }}
          >
            <FiPlus /> List Property
          </button>
        </div>

        {/* Properties Grid */}
        {filtered.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(268px, 1fr))',
            gap: 20,
          }}>
            {filtered.map(p => (
              <PropertyCard key={p.id} property={p} rentalType={rentalType} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center', padding: '80px 24px',
            background: '#fff', borderRadius: 16,
            border: '2px dashed #e8e8e8',
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: '#f5f5f5', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 18px',
            }}>
              <FiSearch style={{ fontSize: 32, color: '#ccc' }} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#222', margin: '0 0 8px' }}>No Properties Found</h3>
            <p style={{ color: '#aaa', fontSize: 15, margin: '0 0 24px' }}>
              {search
                ? `No matches for "${search}"`
                : activeCat
                  ? `No properties in ${activeCat.title} category`
                  : 'No properties available at the moment.'}
            </p>
            <button
              onClick={() => { setSearch(''); setActiveCat(null); }}
              style={{
                padding: '10px 28px', background: '#222', color: '#fff',
                border: 'none', borderRadius: 10, fontWeight: 600,
                fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
      {/* ── RENTAL TYPE POPUP (Outside restricted stacking contexts) ── */}
      {showRentalPopup && (
        <>
          <div
            onClick={() => setShowRentalPopup(false)}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              zIndex: 9999, 
              background: 'rgba(0,0,0,0.6)', 
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease'
            }}
          />
          <div style={{
            position: 'fixed', 
            top: '50%', 
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#ffffff', 
            borderRadius: 32,
            boxShadow: '0 30px 90px rgba(0,0,0,0.4)',
            padding: typeof window !== 'undefined' && window.innerWidth < 480 ? '30px 20px' : '44px',
            zIndex: 10000, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 24,
            width: typeof window !== 'undefined' && window.innerWidth < 480 ? 'calc(100vw - 32px)' : '580px',
            maxWidth: '95vw', 
            boxSizing: 'border-box',
            animation: 'modalFadeIn 0.3s ease-out'
          }}>
            <style>{`
              @keyframes modalFadeIn {
                from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
                to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
              }
            `}</style>
            
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: 26, fontWeight: 800, color: '#1a1a1a' }}>
                Select Rental Type
              </h3>
              <p style={{ margin: 0, color: '#666', fontSize: 15 }}>Choose how you'd like to book your stay</p>
            </div>

            <div style={{ display: 'flex', gap: 18, flexDirection: typeof window !== 'undefined' && window.innerWidth < 480 ? 'column' : 'row' }}>
              <button
                onClick={() => {
                  setRentalType('short');
                  sessionStorage.setItem('ovika_rental_type', 'short');
                  setShowRentalPopup(false);
                }}
                style={{
                  flex: 1, 
                  padding: '36px 24px', 
                  borderRadius: 24,
                  border: `2px solid ${rentalType === 'short' ? '#C98B3E' : '#f0f0f0'}`,
                  background: rentalType === 'short' ? '#FFF9F4' : '#ffffff',
                  cursor: 'pointer', 
                  fontFamily: 'inherit',
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: 16,
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: rentalType === 'short' ? '0 12px 24px rgba(201,139,62,0.12)' : '0 4px 12px rgba(0,0,0,0.03)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%',
                  background: rentalType === 'short' ? '#FFE8D1' : '#f4f7ff',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                }}>
                  <FiMoon style={{ fontSize: 36, color: rentalType === 'short' ? '#C98B3E' : '#4a6cf7' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 19, color: '#222', marginBottom: 6 }}>Nightly Rental</div>
                  <div style={{ fontSize: 14, color: '#717171', lineHeight: 1.5 }}>Perfect for short visits and travel</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setRentalType('long');
                  sessionStorage.setItem('ovika_rental_type', 'long');
                  setShowRentalPopup(false);
                }}
                style={{
                  flex: 1, 
                  padding: '36px 24px', 
                  borderRadius: 24,
                  border: `2px solid ${rentalType === 'long' ? '#C98B3E' : '#f0f0f0'}`,
                  background: rentalType === 'long' ? '#FFF9F4' : '#ffffff',
                  cursor: 'pointer', 
                  fontFamily: 'inherit',
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: 16,
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: rentalType === 'long' ? '0 12px 24px rgba(201,139,62,0.12)' : '0 4px 12px rgba(0,0,0,0.03)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%',
                  background: rentalType === 'long' ? '#FFE8D1' : '#f0fff4',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                }}>
                  <FiCalendar style={{ fontSize: 36, color: rentalType === 'long' ? '#C98B3E' : '#10b981' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 19, color: '#222', marginBottom: 6 }}>Monthly Rental</div>
                  <div style={{ fontSize: 14, color: '#717171', lineHeight: 1.5 }}>Ideal for long-term comfortable stays</div>
                </div>
              </button>
            </div>
            
            <button 
              onClick={() => setShowRentalPopup(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#999',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: 8,
                textDecoration: 'underline'
              }}
            >
              Continue with current selection
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyListPage;