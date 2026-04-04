
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

        {/* Specs — hide for PG only */}
        {property.property_category !== 'PG' && (
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
        )}

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
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const SHORT_TERM_TYPES = [
    'entire place', 'private room', 'shared room', 'hotel room', 'homestay'
  ];
  const isLongTermProperty = (p) => !SHORT_TERM_TYPES.includes((p.property_type || '').toLowerCase());

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
        <title>Browse All PG, Co-Living & Furnished Rentals in Noida & Greater Noida | OvikaLiving Properties</title>
        <meta name="description" content="Browse all verified PG, co-living spaces & furnished apartments in Noida & Greater Noida on OvikaLiving. Filter by sector, budget & amenities. Best PG under ₹10K, ₹15K & ₹20K. No brokerage. Book now!" />
        <meta name="keywords" content="ovikaliving properties, browse pg noida, all pg noida, pg listing noida, co living noida, furnished apartment noida, pg for working professionals noida, pg for students noida, pg with food noida, pg with wifi noida, pg with ac noida, furnished apartment greater noida, best pg noida, verified pg noida, no brokerage pg noida, short term stay noida, monthly rentals noida, pg near metro noida, co living spaces noida, studio apartment noida, affordable pg noida, premium pg noida, short-term rentals noida, co-living spaces noida, monthly rental apartments noida, remote workers noida, startup founders noida, interns noida, corporate employees noida, freelancers noida, digital nomads noida, IT professionals noida, MBA students noida, working professionals noida, pg sector 62 noida, pg sector 63 noida, pg sector 18 noida, pg sector 16 noida, pg sector 50 noida, pg sector 51 noida, pg sector 52 noida, pg sector 44 noida, pg sector 45 noida, pg sector 46 noida, pg sector 47 noida, pg sector 48 noida, pg sector 49 noida, pg sector 15 noida, pg sector 22 noida, pg sector 27 noida, pg sector 29 noida, pg sector 30 noida, pg sector 32 noida, pg sector 33 noida, pg sector 34 noida, pg sector 35 noida, pg sector 36 noida, pg sector 37 noida, pg sector 38 noida, pg sector 39 noida, pg sector 40 noida, pg sector 41 noida, pg sector 42 noida, pg sector 43 noida, pg sector 53 noida, pg sector 54 noida, pg sector 55 noida, pg sector 56 noida, pg sector 57 noida, pg sector 58 noida, pg sector 59 noida, pg sector 60 noida, pg sector 61 noida, pg sector 64 noida, pg sector 65 noida, pg sector 66 noida, pg sector 68 noida, pg sector 70 noida, pg sector 71 noida, pg sector 72 noida, pg sector 74 noida, pg sector 75 noida, pg sector 76 noida, pg sector 77 noida, pg sector 78 noida, pg sector 100 noida, pg sector 104 noida, pg sector 105 noida, pg sector 107 noida, pg sector 108 noida, pg sector 110 noida, pg sector 119 noida, pg sector 120 noida, pg sector 121 noida, pg sector 122 noida, pg sector 125 noida, pg sector 126 noida, pg sector 128 noida, pg sector 130 noida, pg sector 131 noida, pg sector 132 noida, pg sector 133 noida, pg sector 134 noida, pg sector 135 noida, pg sector 136 noida, pg sector 137 noida, pg knowledge park greater noida, pg alpha greater noida, pg beta greater noida, pg gamma greater noida, pg delta greater noida, pg omega greater noida, pg pari chowk greater noida, pg sector pi greater noida, pg chi greater noida, pg sigma greater noida, pg mu greater noida, pg xi greater noida, pg tau greater noida, pg phi greater noida, pg eta greater noida, pg zeta greater noida, pg theta greater noida, pg greater noida west, pg noida extension, नोएडा में पीजी, को लिविंग नोएडा, किराये का कमरा, फर्निश्ड फ्लैट, मासिक किराया, शॉर्ट स्टे, रिमोट वर्कर नोएडा, स्टार्टअप फाउंडर नोएडा, इंटर्न के लिए पीजी, नोएडा में किराया, सस्ता पीजी नोएडा, वाईफाई वाला पीजी, खाने वाला पीजी, लड़कों के लिए पीजी, लड़कियों के लिए पीजी, ग्रेटर नोएडा पीजी, नोएडा में कमरा किराये पर, फर्निश्ड अपार्टमेंट नोएडा, को-लिविंग स्पेस नोएडा, मंथली रेंटल नोएडा, pg under 10000 noida, pg under 15000 noida, pg under 20000 noida, furnished flat under 25000 noida, studio apartment noida, 1bhk noida, 2bhk noida, fully furnished apartment noida, semi-furnished apartment noida, serviced apartment noida, co-living noida, paying guest noida, shared accommodation noida, private room noida, shared room noida, single occupancy pg noida, double occupancy pg noida, wifi included pg noida, meals included pg noida, ac room pg noida, gym pg noida, housekeeping pg noida, laundry pg noida, parking pg noida, security pg noida, cctv pg noida, power backup pg noida, best pg in noida under 20000, fully furnished pg noida no brokerage, verified pg noida, best co-living noida under 20000" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ovikaliving.com/properties" />
        <meta name="author" content="OvikaLiving" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />
        <meta name="language" content="en" />
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Noida" />
        <meta name="geo.position" content="28.5355;77.3910" />
        <meta name="ICBM" content="28.5355, 77.3910" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Browse PG, Co-Living & Furnished Rentals in Noida | OvikaLiving Properties" />
        <meta property="og:description" content="All verified PG, co-living & furnished stays in Noida & Greater Noida. Filter by sector, budget & amenities. No brokerage. Book now!" />
        <meta property="og:url" content="https://www.ovikaliving.com/properties" />
        <meta property="og:site_name" content="OvikaLiving" />
        <meta property="og:image" content="https://www.ovikaliving.com/og-image.jpg" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Browse All PG & Co-Living in Noida | OvikaLiving" />
        <meta name="twitter:description" content="Best PG, co-living & furnished rentals in Noida & Greater Noida. All sectors covered. Verified, no brokerage!" />
        <meta name="twitter:image" content="https://www.ovikaliving.com/og-image.jpg" />
      </Helmet>

      {/* ── HERO HEADER ── */}
      <div style={{
        background: 'linear-gradient(160deg, #8B5E2A 0%, #C98B3E 50%, #E0A44A 100%)',
        padding: 'clamp(36px,6vw,64px) 20px clamp(32px,5vw,56px)',
        display: 'flex', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle dot pattern */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.07,
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }} />
        {/* Decorative glow blobs */}
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 260, height: 260,
          borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, left: -40, width: 200, height: 200,
          borderRadius: '50%', background: 'rgba(0,0,0,0.08)', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 720, width: '100%', position: 'relative', zIndex: 1, textAlign: 'center' }}>


          <h1 style={{
            fontSize: 'clamp(28px, 5.5vw, 48px)', fontWeight: 800, color: '#fff',
            margin: '0 0 12px', letterSpacing: '-0.025em', lineHeight: 1.15,
          }}>
            Book your Stay
          </h1>

          <p style={{
            fontSize: 'clamp(13px, 2vw, 16px)', color: 'rgba(255,255,255,0.85)',
            margin: '0 0 28px', lineHeight: 1.65,
            maxWidth: 520, marginLeft: 'auto', marginRight: 'auto',
          }}>
            Studios, homestays, apartments, Villas & Co-living spaces — curated for short & extended stays in Noida
          </p>

          {/* Search Bar */}
          <div style={{
            background: '#fff', borderRadius: 14,
            display: 'flex', alignItems: 'center',
            padding: '12px 14px', gap: 10,
            boxShadow: '0 12px 40px rgba(0,0,0,0.22)',
          }}>
            <FiSearch style={{ fontSize: 18, color: '#C98B3E', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search by city, locality, or property name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontSize: 14, color: '#222', background: 'transparent',
                fontFamily: 'inherit',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  width: 26, height: 26, borderRadius: '50%', border: 'none',
                  background: '#f0f0f0', color: '#777', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                <FiX style={{ fontSize: 12 }} />
              </button>
            )}
          </div>

          {/* Category pills + Nightly/Monthly toggle */}
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            gap: 8, marginTop: 10, flexWrap: 'wrap', width: '100%',
          }}>
            {CATEGORIES.map(cat => {
              const isActive = activeCat?.id === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(isActive ? null : cat)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '6px 13px',
                    background: isActive ? '#fff' : 'rgba(255,255,255,0.14)',
                    border: `1.5px solid ${isActive ? '#fff' : 'rgba(255,255,255,0.38)'}`,
                    borderRadius: 50,
                    color: isActive ? '#C98B3E' : '#fff',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 4px 14px rgba(0,0,0,0.15)' : 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <CategoryIcon id={cat.id} size={13} color={isActive ? '#C98B3E' : '#fff'} />
                  <span>{cat.title}</span>
                </button>
              );
            })}

            {/* Nightly / Monthly toggle pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              background: 'rgba(0,0,0,0.22)',
              border: '1.5px solid rgba(255,255,255,0.32)',
              borderRadius: 50, padding: 3,
              gap: 2,
              marginTop: window.innerWidth < 768 ? 20 : 0,
            }}>
              <button
                onClick={() => { const val = rentalType === 'short' ? null : 'short'; setRentalType(val); sessionStorage.setItem('ovika_rental_type', val || 'short'); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 50, border: 'none',
                  background: rentalType === 'short' ? '#fff' : 'transparent',
                  color: rentalType === 'short' ? '#C98B3E' : 'rgba(255,255,255,0.88)',
                  fontWeight: rentalType === 'short' ? 700 : 500,
                  fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.2s ease', whiteSpace: 'nowrap',
                  boxShadow: rentalType === 'short' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                }}
              >
                <FiMoon style={{ fontSize: 12 }} />
                <span>Nightly</span>
              </button>
              <button
                onClick={() => { const val = rentalType === 'long' ? null : 'long'; setRentalType(val); sessionStorage.setItem('ovika_rental_type', val || 'short'); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 50, border: 'none',
                  background: rentalType === 'long' ? '#fff' : 'transparent',
                  color: rentalType === 'long' ? '#C98B3E' : 'rgba(255,255,255,0.88)',
                  fontWeight: rentalType === 'long' ? 700 : 500,
                  fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.2s ease', whiteSpace: 'nowrap',
                  boxShadow: rentalType === 'long' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                }}
              >
                <FiCalendar style={{ fontSize: 12 }} />
                <span>Monthly</span>
              </button>
            </div>
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
    </div>
  );
};

export default PropertyListPage;