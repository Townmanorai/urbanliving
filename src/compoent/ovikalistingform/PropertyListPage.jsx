
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { navClick, auxNavClick } from '../../utils/navClick';
import { FiSearch, FiMapPin, FiHeart, FiPlus, FiStar, FiX, FiMoon, FiCalendar, FiTag, FiHome, FiTrendingUp, FiAward, FiClock } from 'react-icons/fi';
import { BiBed, BiBath, BiArea } from 'react-icons/bi';

const API_BASE_URL = 'https://www.townmanor.ai/api/ovika';

const CATEGORIES = [
  { id: 'PG', title: 'PG', minPrice: 0, maxPrice: 1499 },
  { id: 'Economy Stay', title: 'Economy Stay', minPrice: 1500, maxPrice: 2499 },
  { id: 'Premium Stay', title: 'Premium Stay', minPrice: 2500, maxPrice: Infinity },
  { id: 'Signature Stays', title: 'Signature Stays', minPrice: 0, maxPrice: Infinity },
];

const CategoryIcon = ({ id, size = 14, color = 'currentColor' }) => {
  if (id === 'PG') return <FiHome style={{ fontSize: size, color }} />;
  if (id === 'Economy Stay') return <FiTrendingUp style={{ fontSize: size, color }} />;
  if (id === 'Premium Stay') return <FiAward style={{ fontSize: size, color }} />;
  if (id === 'Signature Stays') return <span style={{ fontSize: size, color }}>✨</span>;
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

  const categoryLabel = (property.property_name?.toLowerCase().includes('ovika') || property.property_name?.toLowerCase().includes('signature'))
    ? 'Signature Stays'
    : property.property_category || '';

  const categoryColor = categoryLabel === 'Signature Stays'
    ? { bg: '#8B5E2A', text: '#fff' }
    : categoryLabel === 'Premium Stay'
    ? { bg: '#8B5E2A', text: '#fff' }
    : categoryLabel === 'PG'
    ? { bg: '#C98B3E', text: '#fff' }
    : { bg: '#E0A44A', text: '#fff' };

  return (
    <div
      onClick={(e) => { if (!e.target.closest('[data-action]')) navClick(e, `/property/${property.id}`, navigate); }}
      onAuxClick={(e) => { if (!e.target.closest('[data-action]')) auxNavClick(e, `/property/${property.id}`); }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.14)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)';
      }}
      style={{
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #f0f0f0',
      }}
    >
      {/* ── IMAGE ── */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: '#f3f4f6' }}>
        <img
          src={coverPhoto}
          alt={property.property_name}
          onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />

        {/* Gradient fade at bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Category badge — top left */}
        {categoryLabel && (
          <span className="plp-img-badge" style={{
            position: 'absolute', top: 10, left: 10,
            background: categoryColor.bg, color: categoryColor.text,
            padding: '4px 10px', borderRadius: 20,
            fontSize: 11, fontWeight: 400, letterSpacing: '0.01em',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}>
            {categoryLabel}
          </span>
        )}

        {/* Nightly / Monthly badge — top right of image */}
        <span className="plp-img-type-badge" style={{
          position: 'absolute', top: 10, right: 46,
          background: isMonthly ? 'rgba(201,139,62,0.92)' : 'rgba(15,15,15,0.75)',
          color: '#fff',
          padding: '4px 10px', borderRadius: 20, fontSize: 11,
          fontWeight: 400, backdropFilter: 'blur(4px)',
        }}>
          {isMonthly ? 'Monthly' : 'Nightly'}
        </span>

        {/* Favourite button */}
        <button
          data-action="fav"
          onClick={e => { e.stopPropagation(); setFav(!fav); }}
          style={{
            position: 'absolute', top: 10, right: 10,
            width: 32, height: 32,
            background: fav ? '#e84040' : 'rgba(255,255,255,0.9)',
            border: 'none', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(6px)',
            color: fav ? '#fff' : '#555', fontSize: 14,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: 'all 0.2s ease',
            zIndex: 2,
          }}
        >
          <FiHeart style={{ fill: fav ? '#fff' : 'none' }} />
        </button>

        {/* Ovika Verified stamp */}
        {property.property_name?.toLowerCase().includes('signature') && (
          <img
            src="/ovikaver.png"
            alt="Verified"
            style={{
              position: 'absolute', bottom: 10, right: 10,
              width: 52, height: 'auto',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              pointerEvents: 'none', zIndex: 2,
            }}
          />
        )}

        {/* Price overlay — bottom left of image */}
        <div style={{ position: 'absolute', bottom: 12, left: 14, zIndex: 2 }}>
          {forceRequest ? (
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontStyle: 'italic' }}>Price on Request</span>
          ) : (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
              {pricePrefix && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{pricePrefix}</span>}
              <span className="plp-card-price" style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1, textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                {formatPrice(displayPrice)}
              </span>
              {displayPrice > 0 && (
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{priceLabel}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── CARD BODY ── */}
      <div className="plp-card-body" style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>

        {/* Name + Rating row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
          <h3 className="plp-card-title" style={{
            fontSize: 14, fontWeight: 700, color: '#111',
            lineHeight: 1.35, margin: 0, flex: 1,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {property.property_name || 'Untitled Property'}
          </h3>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0,
            background: '#fffbf0', border: '1px solid #f0d8a0',
            borderRadius: 20, padding: '2px 8px',
          }}>
            <FiStar style={{ fontSize: 11, color: '#C98B3E', fill: '#C98B3E' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#C98B3E' }}>{randomRating}</span>
          </div>
        </div>

        {/* Location */}
        <div className="plp-card-loc" style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6b7280', fontSize: 12 }}>
          <FiMapPin style={{ fontSize: 12, color: '#C98B3E', flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {property.city || 'City not specified'}{property.address ? `, ${property.address}` : ''}
          </span>
        </div>

        {/* Specs row */}
        {property.property_category !== 'PG' && (bedCount > 0 || bathCount > 0 || property.area) && (
          <div className="plp-card-spec" style={{
            display: 'flex', alignItems: 'center', gap: 0,
            background: '#f9fafb', borderRadius: 10,
            padding: '7px 10px',
          }}>
            {bedCount > 0 && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center' }}>
                <BiBed style={{ fontSize: 15, color: '#C98B3E' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{bedCount} Bed</span>
              </div>
            )}
            {bedCount > 0 && bathCount > 0 && <div style={{ width: 1, height: 14, background: '#e5e7eb' }} />}
            {bathCount > 0 && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center' }}>
                <BiBath style={{ fontSize: 15, color: '#C98B3E' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{bathCount} Bath</span>
              </div>
            )}
            {(bedCount > 0 || bathCount > 0) && property.area > 0 && <div style={{ width: 1, height: 14, background: '#e5e7eb' }} />}
            {property.area > 0 && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center' }}>
                <BiArea style={{ fontSize: 15, color: '#C98B3E' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{property.area} sqft</span>
              </div>
            )}
          </div>
        )}

        {/* Amenity chips */}
        {Array.isArray(property.amenities) && property.amenities.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {property.amenities.slice(0, 3).map((a, i) => (
              <span key={i} style={{
                padding: '3px 9px', background: '#f3f4f6', color: '#6b7280',
                borderRadius: 20, fontSize: 11, fontWeight: 500,
              }}>{a}</span>
            ))}
            {property.amenities.length > 3 && (
              <span style={{
                padding: '3px 9px', background: '#FFF6EE', color: '#C98B3E',
                border: '1px solid rgba(201,139,62,0.25)',
                borderRadius: 20, fontSize: 11, fontWeight: 600,
              }}>+{property.amenities.length - 3}</span>
            )}
          </div>
        )}

        {/* View Details CTA */}
        <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #f3f4f6' }}>
          <button
            className="plp-card-cta"
            data-action="view"
            onClick={e => { e.stopPropagation(); navClick(e, `/property/${property.id}`, navigate); }}
            onAuxClick={e => { e.stopPropagation(); auxNavClick(e, `/property/${property.id}`); }}
            onMouseEnter={e => { e.currentTarget.style.background = '#AF7834'; e.currentTarget.style.transform = 'scale(1.01)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#C98B3E'; e.currentTarget.style.transform = 'scale(1)'; }}
            style={{
              width: '100%', padding: '9px 0',
              background: '#C98B3E', color: '#fff',
              border: 'none', borderRadius: 10,
              fontWeight: 400, fontSize: 13, cursor: 'pointer',
              fontFamily: 'inherit', letterSpacing: '0.01em',
              transition: 'background 0.2s ease, transform 0.15s ease',
              boxShadow: '0 2px 8px rgba(201,139,62,0.3)',
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Sidebar Content (reused for desktop + mobile drawer) ── */
const SidebarContent = ({
  activeCat, setActiveCat,
  rentalType, setRentalType,
  lockedRental,
  priceMin, setPriceMin, priceMax, setPriceMax,
  roomsFilter, setRoomsFilter,
  propTypeFilter, togglePropType,
  amenitiesFilter, toggleAmenity,
  furnishingFilter, setFurnishingFilter,
  tenantFilter, setTenantFilter,
  foodFilter, setFoodFilter,
  petsFilter, setPetsFilter,
  coupleFilter, setCoupleFilter,
  resetSidebar, onDone,
}) => {
  const sectionTitle = (text) => (
    <p style={{ fontSize: 13, fontWeight: 700, color: '#333', margin: '0 0 10px' }}>{text}</p>
  );
  const divider = <div style={{ height: 1, background: '#f0f0f0', margin: '18px 0' }} />;

  const ToggleRow = ({ label, value, onChange }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
      <span style={{ fontSize: 13, color: '#444' }}>{label}</span>
      <button
        onClick={() => onChange(value === 'yes' ? null : 'yes')}
        style={{
          width: 38, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
          background: value === 'yes' ? '#C98B3E' : '#e5e7eb',
          position: 'relative', transition: 'background 0.2s ease',
          flexShrink: 0,
        }}
      >
        <span style={{
          position: 'absolute', top: 3, width: 16, height: 16, borderRadius: '50%',
          background: '#fff', transition: 'left 0.2s ease',
          left: value === 'yes' ? 19 : 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  );

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#222' }}>Filters</span>
        <button onClick={resetSidebar} style={{ fontSize: 12, color: '#C98B3E', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>Reset All</button>
      </div>

      {/* Stay Type: Nightly / Monthly — hidden on locked routes */}
      {!lockedRental && (
        <div style={{ marginBottom: 18 }}>
          {sectionTitle('Stay Type')}
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ id: 'short', label: 'Nightly', icon: <FiMoon style={{ fontSize: 12 }} /> },
              { id: 'long',  label: 'Monthly', icon: <FiCalendar style={{ fontSize: 12 }} /> }].map(({ id, label, icon }) => {
              const active = rentalType === id;
              return (
                <button key={id} onClick={() => { const val = rentalType === id ? null : id; setRentalType(val); sessionStorage.setItem('ovika_rental_type', val || id); }} style={{
                  flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  padding: '8px 0', borderRadius: 9,
                  border: `1.5px solid ${active ? '#C98B3E' : '#e8e8e8'}`,
                  background: active ? '#FFF6EE' : '#fafafa',
                  color: active ? '#C98B3E' : '#555',
                  fontWeight: active ? 700 : 500, fontSize: 13,
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s ease',
                }}>
                  {icon}{label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Category */}
      <div style={{ marginBottom: 18 }}>
        {sectionTitle('Category')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {CATEGORIES.map(cat => {
            const isActive = activeCat?.id === cat.id;
            return (
              <button key={cat.id} onClick={() => setActiveCat(isActive ? null : cat)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '8px 12px', borderRadius: 9, textAlign: 'left',
                border: `1.5px solid ${isActive ? '#C98B3E' : '#e8e8e8'}`,
                background: isActive ? '#FFF6EE' : '#fafafa',
                color: isActive ? '#C98B3E' : '#444',
                fontWeight: isActive ? 700 : 500, fontSize: 13,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s ease',
              }}>
                <CategoryIcon id={cat.id} size={13} color={isActive ? '#C98B3E' : '#888'} />
                {cat.title}
              </button>
            );
          })}
        </div>
      </div>

      {divider}

      {/* Price Range */}
      <div style={{ marginBottom: 18 }}>
        {sectionTitle('Price Range')}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 11, color: '#999', display: 'block', marginBottom: 4 }}>Min (₹)</label>
            <input type="number" value={priceMin} onChange={e => setPriceMin(Number(e.target.value))} style={{
              width: '100%', padding: '7px 8px', borderRadius: 8,
              border: '1.5px solid #e8e8e8', fontSize: 13, color: '#222',
              fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
            }} />
          </div>
          <span style={{ color: '#ccc', marginTop: 18 }}>—</span>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 11, color: '#999', display: 'block', marginBottom: 4 }}>Max (₹)</label>
            <input type="number" value={priceMax} onChange={e => setPriceMax(Number(e.target.value))} style={{
              width: '100%', padding: '7px 8px', borderRadius: 8,
              border: '1.5px solid #e8e8e8', fontSize: 13, color: '#222',
              fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
            }} />
          </div>
        </div>
      </div>

      {/* Number of Rooms */}
      <div style={{ marginBottom: 18 }}>
        {sectionTitle('Number of Rooms')}
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {['1','2','3','4+'].map(r => (
            <button key={r} onClick={() => setRoomsFilter(roomsFilter === r ? null : r)} style={{
              width: 42, height: 36, borderRadius: 8,
              border: `1.5px solid ${roomsFilter === r ? '#C98B3E' : '#e8e8e8'}`,
              background: roomsFilter === r ? '#FFF6EE' : '#fafafa',
              color: roomsFilter === r ? '#C98B3E' : '#555',
              fontWeight: roomsFilter === r ? 700 : 500,
              fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.18s ease',
            }}>{r}</button>
          ))}
        </div>
      </div>


      {/* Property Type */}
      <div style={{ marginBottom: 18 }}>
        {sectionTitle('Property Type')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {['PG','Hotel','Apartment','Villa'].map(t => (
            <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={propTypeFilter.includes(t)} onChange={() => togglePropType(t)}
                style={{ accentColor: '#C98B3E', width: 15, height: 15, cursor: 'pointer' }} />
              <span style={{ fontSize: 13, color: '#444', fontWeight: propTypeFilter.includes(t) ? 600 : 400 }}>{t}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div style={{ marginBottom: 18 }}>
        {sectionTitle('Amenities')}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {['Wi-Fi','AC','Parking','Gym','Pool','Power Backup','Security Guard','CCTV','Balcony','Meals Included','Geyser','Washing Machine'].map(a => {
            const active = amenitiesFilter.includes(a);
            return (
              <button key={a} onClick={() => toggleAmenity(a)} style={{
                padding: '5px 11px', borderRadius: 20, fontSize: 12, fontWeight: active ? 700 : 400,
                border: `1.5px solid ${active ? '#C98B3E' : '#e8e8e8'}`,
                background: active ? '#FFF6EE' : '#fafafa',
                color: active ? '#C98B3E' : '#555',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s ease',
              }}>{a}</button>
            );
          })}
        </div>
      </div>

      {divider}

      {/* Furnishing */}
      <div style={{ marginBottom: 18 }}>
        {sectionTitle('Furnishing')}
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {['Fully Furnished','Semi-Furnished','Unfurnished'].map(f => {
            const active = furnishingFilter === f;
            return (
              <button key={f} onClick={() => setFurnishingFilter(active ? null : f)} style={{
                padding: '6px 11px', borderRadius: 9, fontSize: 12,
                border: `1.5px solid ${active ? '#C98B3E' : '#e8e8e8'}`,
                background: active ? '#FFF6EE' : '#fafafa',
                color: active ? '#C98B3E' : '#555',
                fontWeight: active ? 700 : 400,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s ease',
              }}>{f}</button>
            );
          })}
        </div>
      </div>

      {/* Tenant Preference */}
      <div style={{ marginBottom: 18 }}>
        {sectionTitle('Tenant Preference')}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {[
            { id: 'male', label: '👨 Male' },
            { id: 'female', label: '👩 Female' },
            { id: 'family', label: '👨‍👩‍👧 Family' },
            { id: 'couple', label: '💑 Couple' },
            { id: 'professionals', label: '💼 Professionals' },
          ].map(({ id, label }) => {
            const active = tenantFilter === id;
            return (
              <button key={id} onClick={() => setTenantFilter(active ? null : id)} style={{
                padding: '5px 11px', borderRadius: 20, fontSize: 12,
                border: `1.5px solid ${active ? '#C98B3E' : '#e8e8e8'}`,
                background: active ? '#FFF6EE' : '#fafafa',
                color: active ? '#C98B3E' : '#555',
                fontWeight: active ? 700 : 400,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s ease',
              }}>{label}</button>
            );
          })}
        </div>
      </div>

      {/* Quick toggles */}
      <div style={{ marginBottom: 22 }}>
        {sectionTitle('More Preferences')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ToggleRow label="🍽️ Food Available" value={foodFilter} onChange={setFoodFilter} />
          <ToggleRow label="🐾 Pets Allowed" value={petsFilter} onChange={setPetsFilter} />
          <ToggleRow label="💑 Couple Friendly" value={coupleFilter} onChange={setCoupleFilter} />
        </div>
      </div>

      {/* Show Results / Done button */}
      <button
        onClick={onDone || (() => {})}
        onMouseEnter={e => e.currentTarget.style.background = '#AF7834'}
        onMouseLeave={e => e.currentTarget.style.background = '#C98B3E'}
        style={{
          width: '100%', padding: '11px 0',
          background: '#C98B3E', color: '#fff',
          border: 'none', borderRadius: 10,
          fontWeight: 700, fontSize: 14,
          cursor: 'pointer', fontFamily: 'inherit',
          boxShadow: '0 2px 8px rgba(201,139,62,0.3)',
          transition: 'background 0.2s ease',
        }}
      >
        {onDone ? 'Apply Filters' : 'Show Results'}
      </button>
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
  // Sidebar filter state
  const [priceMin, setPriceMin] = useState(1000);
  const [priceMax, setPriceMax] = useState(500000);
  const [roomsFilter, setRoomsFilter] = useState(null);
  const [propTypeFilter, setPropTypeFilter] = useState([]);
  const [amenitiesFilter, setAmenitiesFilter] = useState([]);
  const [furnishingFilter, setFurnishingFilter] = useState(null);
  const [tenantFilter, setTenantFilter] = useState(null);
  const [foodFilter, setFoodFilter] = useState(null);       // 'yes' | 'no'
  const [petsFilter, setPetsFilter] = useState(null);       // 'yes' | 'no'
  const [coupleFilter, setCoupleFilter] = useState(null);   // 'yes'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listPopupOpen, setListPopupOpen] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;
  const navigate = useNavigate();
  const location = useLocation();

  // Detect locked route — /nightly-stays locks to short, /monthly-rentals locks to long
  const lockedRental =
    location.pathname === '/nightly-stays' ? 'short' :
    location.pathname === '/monthly-rentals' ? 'long' : null;

  const pageTitle =
    lockedRental === 'short' ? 'Nightly Stays' :
    lockedRental === 'long'  ? 'Monthly Rentals' :
    'All Properties';

  const SHORT_TERM_TYPES = [
    'entire place', 'private room', 'shared room', 'hotel room', 'homestay'
  ];

  const parseMeta = (p) => {
    if (!p.meta) return {};
    if (typeof p.meta === 'object') return p.meta;
    try { return JSON.parse(p.meta); } catch { return {}; }
  };

  const isLongTermProperty = (p) => {
    // 1. Explicit rental_type field (set by forms after fix)
    if (p.rental_type === 'short') return false;
    if (p.rental_type === 'long') return true;

    // 2. Top-level property_type check
    const pt = (p.property_type || '').toLowerCase();
    if (pt && SHORT_TERM_TYPES.includes(pt)) return false;

    // 3. Meta inference for existing properties (before fix)
    const meta = parseMeta(p);
    // Tmx9PropertyForm nightly properties have meta.propertyType = "Entire place" / "Private room"
    if (meta.propertyType && SHORT_TERM_TYPES.includes(meta.propertyType.toLowerCase())) return false;
    // PGListingForm monthly properties have PG-specific fields
    if (meta.usePerRoomPricing !== undefined) return true;
    if (Array.isArray(meta.preferredTenants)) return true;
    if (Array.isArray(meta.sharingTypes)) return true;

    // 4. Property category check
    if (p.property_category === 'PG') return true;
    if (meta.propertyCategory === 'PG') return true;

    // 5. If property_type is still unknown, assume nightly (short-term)
    if (!pt) return false;
    return !SHORT_TERM_TYPES.includes(pt);
  };

  const getPgNightlyPrice = (p) => {
    const meta = (() => {
      if (!p.meta) return {};
      if (typeof p.meta === 'object') return p.meta;
      try { return JSON.parse(p.meta); } catch { return {}; }
    })();
    return Number(p.base_rate) || Number(p.price) || Number(meta?.perNightPrice) || 0;
  };

  const togglePropType = (type) => {
    setPropTypeFilter(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };
  const toggleAmenity = (a) => {
    setAmenitiesFilter(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };
  const resetSidebar = () => {
    setPriceMin(1000); setPriceMax(50000);
    setRoomsFilter(null);
    setPropTypeFilter([]); setAmenitiesFilter([]);
    setFurnishingFilter(null); setTenantFilter(null);
    setFoodFilter(null); setPetsFilter(null); setCoupleFilter(null);
  };

  const getMeta = (p) => {
    if (!p.meta) return {};
    if (typeof p.meta === 'object') return p.meta;
    try { return JSON.parse(p.meta); } catch { return {}; }
  };

  const applyFilter = (list, cat, q, rental) => {
    let result = list;
    const isMonthly = rental === 'long';

    // Signature Stays property IDs (Home7 se liye hain)
    const SIGNATURE_NIGHTLY_IDS = [77, 78, 79, 80, 81];
    const SIGNATURE_MONTHLY_IDS = [323, 315, 316, 317]; // 78 monthly mein available nahi

    const isSignatureProperty = (p) => {
      const id = Number(p.id || p.property_id);
      return SIGNATURE_NIGHTLY_IDS.includes(id) || SIGNATURE_MONTHLY_IDS.includes(id);
    };

    const isSignatureOrOvika = (p) =>
      p.property_name?.toLowerCase().includes('signature') ||
      p.property_name?.toLowerCase().includes('ovika');

    if (isMonthly) {
      result = result.filter(p => {
        if (SIGNATURE_MONTHLY_IDS.includes(Number(p.id || p.property_id))) return true;
        if (p.rental_type === 'short') return false; // explicitly nightly → exclude from monthly
        return p.property_category === 'PG' || isLongTermProperty(p);
      });
    } else {
      result = result.filter(p => {
        if (SIGNATURE_NIGHTLY_IDS.includes(Number(p.id || p.property_id))) return true;
        if (p.rental_type === 'long') return false; // explicitly monthly → exclude from nightly
        return p.property_category === 'PG' || !isLongTermProperty(p);
      });

      result = result.filter(p => {
        if (p.property_category !== 'PG') return true;
        // Monthly PG properties (no nightly price) should NOT appear in nightly
        const nightlyPrice = getPgNightlyPrice(p);
        if (p.rental_type === 'long') return false;
        return nightlyPrice > 0 && nightlyPrice <= 3000;
      });
    }

        if (cat) {
          result = result.filter(p => {
            const id = Number(p.id || p.property_id);
            // Signature Stays category: sahi IDs dikhao based on monthly/nightly
            if (cat.id === 'Signature Stays') {
              if (isMonthly) return SIGNATURE_MONTHLY_IDS.includes(id);
              return SIGNATURE_NIGHTLY_IDS.includes(id);
            }

            // Signature properties sirf Signature Stays category mein dikhni chahiye
            if (isSignatureProperty(p) || isSignatureOrOvika(p)) {
              return false;
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
      // ── Smart multi-keyword search ─────────────────────────────────────────
      // Strategy:
      //   1. Split query into keywords, strip stop-words
      //   2. Keep any property matching AT LEAST 1 keyword
      //   3. Sort by match count DESC — more keyword hits appear first
      //   "girls pg in noida" → ["girls","pg","noida"]
      //   A Girls PG in Noida scores 3 → top; a random Noida flat scores 1 → bottom

      const STOP_WORDS = new Set(['in','at','near','for','the','a','an','and','or','of','to','with','by','on','from']);

      const matchesProp = (p, token) => {
        const t = token.toLowerCase();
        const name    = (p.property_name  || '').toLowerCase();
        const addr    = (p.address        || '').toLowerCase();
        const city    = (p.city           || '').toLowerCase();
        const sector  = (p.sector         || '').toLowerCase();
        const cat     = (p.property_category || '').toLowerCase();
        const type    = (p.property_type  || '').toLowerCase();
        const subcat  = (p.property_subCategory || p.property_subcategory || '').toLowerCase();

        if (name.includes(t) || addr.includes(t) || city.includes(t) || sector.includes(t)) return true;
        if (cat.includes(t) || type.includes(t) || subcat.includes(t)) return true;

        // Semantic shortcuts
        if (t === 'pg' && cat === 'pg') return true;
        if (t === 'girls' && (name.includes('girl') || cat.includes('girl') || subcat.includes('girl') || type.includes('girl'))) return true;
        if (t === 'boys' && (name.includes('boy') || cat.includes('boy') || subcat.includes('boy') || type.includes('boy'))) return true;
        if (t === 'studio' && type.includes('studio')) return true;
        if ((t === 'apartment' || t === 'flat') && (type.includes('apartment') || type.includes('flat') || cat.includes('apartment'))) return true;
        if (t === 'noida' && (addr.includes('noida') || city.includes('noida') || sector.includes('noida'))) return true;
        if (t === 'greater' && (addr.includes('greater') || city.includes('greater'))) return true;
        if (t === 'gurugram' || t === 'gurgaon') {
          if (addr.includes('gurugram') || city.includes('gurugram') || addr.includes('gurgaon') || city.includes('gurgaon')) return true;
        }
        if (t === 'furnished' && (name.includes('furnished') || type.includes('furnished'))) return true;
        if (t === 'premium' && (name.includes('premium') || type.includes('premium') || cat.includes('premium'))) return true;
        if (t === 'economy' && (name.includes('economy') || type.includes('economy') || cat.includes('economy'))) return true;
        if (t === 'signature' && name.includes('signature')) return true;

        return false;
      };

      const qL = q.trim().toLowerCase();
      const keywords = qL.split(/\s+/).filter(w => w.length > 1 && !STOP_WORDS.has(w));
      // If all words were stop-words, treat the whole phrase as one keyword
      const tokens = keywords.length > 0 ? keywords : [qL];

      // Score each property by how many keywords it matches
      const scored = result
        .map(p => {
          const score = tokens.reduce((acc, token) => acc + (matchesProp(p, token) ? 1 : 0), 0);
          return { p, score };
        })
        .filter(({ score }) => score > 0);

      // Sort: more matches first
      scored.sort((a, b) => b.score - a.score);

      result = scored.map(({ p }) => p);
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
    let filteredResults = applyFilter(properties, activeCat, search, rentalType);

    // Sidebar price filter (Signature Stays ke liye bypass — ID se already filtered hain)
    filteredResults = filteredResults.filter(p => {
      if (activeCat?.id === 'Signature Stays') return true;
      const price = Number(p.price) || Number(p.base_rate) || 0;
      if (price === 0) return true;
      return price >= priceMin && price <= priceMax;
    });

    // Rooms filter
    if (roomsFilter) {
      filteredResults = filteredResults.filter(p => {
        const beds = getBedCount(p.bedrooms);
        if (roomsFilter === '4+') return beds >= 4;
        return beds === Number(roomsFilter);
      });
    }

    // Property type filter
    if (propTypeFilter.length > 0) {
      filteredResults = filteredResults.filter(p => {
        const cat = (p.property_category || '').toLowerCase();
        const type = (p.property_type || '').toLowerCase();
        return propTypeFilter.some(f => {
          if (f === 'PG') return cat === 'pg';
          if (f === 'Hotel') return type.includes('hotel');
          if (f === 'Apartment') return type.includes('apartment') || type.includes('flat') || type.includes('studio');
          if (f === 'Villa') return type.includes('villa') || type.includes('entire place');
          return false;
        });
      });
    }

    // Helper: parse guest_policy safely
    const getGuestPolicy = (p) => {
      const raw = p.guest_policy;
      if (!raw) return {};
      if (typeof raw === 'string') { try { return JSON.parse(raw); } catch { return {}; } }
      return raw;
    };

    // Helper: get flat amenities array from property
    const getAmenities = (p) => {
      const m = getMeta(p);
      // p.amenities might be JSON string or array
      let arr = [];
      if (Array.isArray(p.amenities)) arr = p.amenities;
      else if (typeof p.amenities === 'string') {
        try { const parsed = JSON.parse(p.amenities); arr = Array.isArray(parsed) ? parsed : []; } catch { arr = []; }
      }
      // also check meta.amenities
      const metaAms = Array.isArray(m.amenities) ? m.amenities : [];
      return [...new Set([...arr, ...metaAms])].map(a => (a || '').toLowerCase());
    };

    // Amenities filter — check both p.amenities and meta.amenities
    if (amenitiesFilter.length > 0) {
      const AMENITY_MAP = {
        'Wi-Fi':          ['wi-fi', 'wifi', 'wi fi', 'internet'],
        'AC':             ['air conditioning', 'ac', 'air conditioner', 'central ac'],
        'Parking':        ['parking', 'reserved parking', 'visitor parking'],
        'Gym':            ['gym', 'fitness', 'gymnasium'],
        'Pool':           ['pool', 'swimming', 'swimming pool'],
        'Power Backup':   ['power backup', 'generator', 'inverter'],
        'Security Guard': ['security guard', 'security', 'guard'],
        'CCTV':           ['cctv', 'camera', 'surveillance'],
        'Balcony':        ['balcony', 'terrace', 'balcony/terrace'],
        'Meals Included': ['meal', 'breakfast', 'lunch', 'dinner', 'food'],
        'Geyser':         ['geyser', 'hot water', 'water heater'],
        'Washing Machine':['washing machine', 'laundry', 'washer'],
      };
      filteredResults = filteredResults.filter(p => {
        const ams = getAmenities(p);
        return amenitiesFilter.every(f => {
          const keywords = AMENITY_MAP[f] || [f.toLowerCase()];
          return ams.some(a => keywords.some(k => a.includes(k)));
        });
      });
    }

    // Furnishing filter — stored in meta.furnishing (from PGListingForm)
    if (furnishingFilter) {
      filteredResults = filteredResults.filter(p => {
        const m = getMeta(p);
        const f = (m.furnishing || p.furnishing || '').toLowerCase();
        if (!f) return false;
        return f.includes(furnishingFilter.toLowerCase());
      });
    }

    // Tenant preference — from guest_policy (family_allowed, bachelors_allowed, unmarried_couple_allowed, preferredTenants)
    if (tenantFilter) {
      filteredResults = filteredResults.filter(p => {
        const gp = getGuestPolicy(p);
        const m = getMeta(p);
        // preferredTenants can be in guest_policy or meta
        const pts = [
          ...(Array.isArray(gp.preferredTenants) ? gp.preferredTenants : []),
          ...(Array.isArray(m.preferredTenants) ? m.preferredTenants : []),
        ].map(t => (t || '').toLowerCase());

        if (tenantFilter === 'male') {
          return gp.bachelors_allowed === true || gp.Bechelors === true ||
            m.bachelorAllowed === true ||
            pts.some(t => t.includes('male') || t.includes('bachelor'));
        }
        if (tenantFilter === 'female') {
          return pts.some(t => t.includes('female') || t.includes('girls') || t.includes('girl'));
        }
        if (tenantFilter === 'family') {
          return gp.family_allowed === true || m.familyAllowed === true ||
            pts.some(t => t.includes('family'));
        }
        if (tenantFilter === 'couple') {
          return gp.unmarried_couple_allowed === true || m.unmarriedCoupleAllowed === true;
        }
        if (tenantFilter === 'professionals') {
          return pts.some(t => t.includes('professional') || t.includes('working'));
        }
        return true;
      });
    }

    // Food available — meta.foodAvailable (boolean from PGListingForm)
    if (foodFilter === 'yes') {
      filteredResults = filteredResults.filter(p => {
        const m = getMeta(p);
        return m.foodAvailable === true || m.food_available === true ||
          getAmenities(p).some(a => a.includes('meal') || a.includes('breakfast') || a.includes('lunch') || a.includes('dinner'));
      });
    }

    // Pets filter — meta.petsAllowed (from both forms)
    if (petsFilter === 'yes') {
      filteredResults = filteredResults.filter(p => {
        const m = getMeta(p);
        return m.petsAllowed === true || m.pets_allowed === true;
      });
    }

    // Couple friendly — guest_policy.unmarried_couple_allowed
    if (coupleFilter === 'yes') {
      filteredResults = filteredResults.filter(p => {
        const gp = getGuestPolicy(p);
        const m = getMeta(p);
        return gp.unmarried_couple_allowed === true || m.unmarriedCoupleAllowed === true;
      });
    }

    // When search query is active, results are already sorted by keyword match score
    // — don't override with Signature-first pinning in that case
    const isSearchActive = search && search.trim().length > 0;

    const sortedResults = isSearchActive
      ? (sortBy === 'price_asc'
          ? [...filteredResults].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
          : sortBy === 'price_desc'
          ? [...filteredResults].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
          : filteredResults) // recommended + search active → keep keyword score order
      : [...filteredResults].sort((a, b) => {
          const aIsVerified = a.property_name?.toLowerCase().includes('ovika') || a.property_name?.toLowerCase().includes('signature');
          const bIsVerified = b.property_name?.toLowerCase().includes('ovika') || b.property_name?.toLowerCase().includes('signature');
          if (sortBy === 'recommended') {
            if (aIsVerified && !bIsVerified) return -1;
            if (!aIsVerified && bIsVerified) return 1;
          } else if (sortBy === 'price_asc') {
            return (Number(a.price) || 0) - (Number(b.price) || 0);
          } else if (sortBy === 'price_desc') {
            return (Number(b.price) || 0) - (Number(a.price) || 0);
          }
          return 0;
        });
    setFiltered(sortedResults);
    setCurrentPage(1);
  }, [search, activeCat, properties, rentalType, priceMin, priceMax, roomsFilter, propTypeFilter, amenitiesFilter, furnishingFilter, tenantFilter, foodFilter, petsFilter, coupleFilter, sortBy]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cId = params.get('category');
    if (cId && properties.length > 0) {
      const match = CATEGORIES.find(c =>
        c.id.toLowerCase() === cId.toLowerCase() || c.title.toLowerCase() === cId.toLowerCase()
      );
      if (match) setActiveCat(match);
    }

    // Locked route overrides everything
    if (lockedRental) {
      setRentalType(lockedRental);
      sessionStorage.setItem('ovika_rental_type', lockedRental);
    } else {
      const rt = params.get('rentalType');
      if (rt) {
        setRentalType(rt);
        sessionStorage.setItem('ovika_rental_type', rt);
      } else {
        const stored = sessionStorage.getItem('ovika_rental_type');
        if (stored) setRentalType(stored);
      }
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
    <div className="plp-page" style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', background: '#f5f0e8', fontFamily: "'Inter', -apple-system, sans-serif", overflow: 'hidden' }}>
      <style>{`
        /* ── Content row: sidebar + grid ── */
        .plp-body {
          flex: 1;
          display: flex;
          overflow: hidden;
          max-width: 1440px;
          width: 100%;
          margin: 0 auto;
          padding: 0 20px;
          box-sizing: border-box;
        }
        /* ── Sidebar: fixed height, internally scrollable ── */
        .plp-sidebar {
          width: 252px;
          flex-shrink: 0;
          height: 100%;
          overflow-y: auto;
          background: #fdf8f2;
          border-right: 1px solid #e8d9c0;
          padding: 18px 16px 32px;
          scrollbar-width: thin;
          scrollbar-color: #e0c9a6 transparent;
        }
        .plp-sidebar::-webkit-scrollbar { width: 4px; }
        .plp-sidebar::-webkit-scrollbar-thumb { background: #ddc99a; border-radius: 4px; }
        /* ── Right column: ONLY this scrolls ── */
        .plp-right {
          flex: 1;
          min-width: 0;
          height: 100%;
          overflow-y: auto;
          padding: 16px 16px 20px 20px;
          scrollbar-width: thin;
          scrollbar-color: #ddd transparent;
        }
        .plp-right::-webkit-scrollbar { width: 4px; }
        .plp-right::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
        /* ── Top bar ── */
        .plp-topbar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          background: #fff;
          border-radius: 12px;
          padding: 10px 16px;
          border: 1px solid #e8d9c0;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .plp-topbar-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          min-width: 0;
        }
        .plp-topbar-search {
          flex: 0 1 280px;
          min-width: 120px;
        }
        .plp-topbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        /* ── Property grid ── */
        .plp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 18px;
        }
        /* ── Mobile overlay & drawer ── */
        .plp-filter-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 300;
        }
        .plp-mobile-sidebar {
          display: none;
          position: fixed;
          left: 0; top: 0; bottom: 0;
          width: min(300px, 88vw);
          background: #fff;
          z-index: 301;
          overflow-y: auto;
          padding: 0;
          box-shadow: 4px 0 28px rgba(0,0,0,0.18);
          animation: slideInLeft 0.22s ease;
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @keyframes slideUp {
          from { transform: translate(-50%, -50%) scale(0.92); opacity: 0; }
          to   { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes fadeInBg {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .plp-mobile-filter-btn { display: none; }
        /* ── Responsive ── */
        @media (max-width: 860px) {
          .plp-sidebar { display: none; }
          .plp-mobile-filter-btn { display: inline-flex !important; }
          .plp-right { padding-left: 0; }
          .plp-body { padding: 0 10px; }
          .plp-grid { grid-template-columns: 1fr; gap: 12px; }
          .plp-topbar { flex-wrap: wrap; gap: 6px; padding: 8px 10px; }
          .plp-topbar-search { flex: 1 1 100%; order: 4; min-width: 0; }
          .plp-topbar-right .plp-list-btn-text { display: none; }
          .plp-sort-label { display: none; }
          .plp-sort-wrap { padding: 0 6px !important; }
          .plp-sort-wrap select { max-width: 72px; font-size: 12px !important; }
        }
        @media (max-width: 768px) {
          .plp-page { height: auto !important; overflow: visible !important; }
          .plp-body { height: auto !important; overflow: visible !important; }
          .plp-right { height: auto !important; overflow: visible !important; padding: 10px 0 60px; }
        }
        @media (max-width: 480px) {
          .plp-grid { grid-template-columns: 1fr; gap: 10px; }
          .plp-topbar { padding: 7px 8px; gap: 5px; margin-bottom: 8px; }
          .plp-topbar-right { gap: 5px; }
          .plp-body { padding: 0 8px; }
          .plp-right { padding: 8px 0 60px !important; }
          /* Card — single column, comfortable size */
          .plp-card-body { padding: 12px 14px 14px !important; gap: 7px !important; }
          .plp-card-title { font-size: 14px !important; -webkit-line-clamp: 2 !important; }
          .plp-card-loc { font-size: 12px !important; }
          .plp-card-cta { padding: 10px 0 !important; font-size: 13px !important; border-radius: 10px !important; }
          .plp-card-spec { padding: 6px 10px !important; }
          .plp-card-spec span { font-size: 12px !important; }
          .plp-card-price { font-size: 18px !important; }
          /* Image badges */
          .plp-img-badge { font-size: 10px !important; padding: 3px 8px !important; }
          .plp-img-type-badge { font-size: 10px !important; padding: 3px 8px !important; }
          /* Topbar */
          .plp-topbar h2 { font-size: 13px !important; }
        }
      `}</style>
      <Helmet>
        {/* ── Dynamic title/description per route ── */}
        {lockedRental === 'short' ? (
          <title>Nightly Stays in Noida | Book Furnished Short-Term Rentals | OvikaLiving</title>
        ) : lockedRental === 'long' ? (
          <title>Monthly Rentals & PG in Noida | Furnished Rooms from ₹8,000/mo | OvikaLiving</title>
        ) : (
          <title>Browse Verified PG, Co-Living & Short-Term Rentals in Noida | OvikaLiving</title>
        )}

        {lockedRental === 'short' ? (
          <meta name="description" content="Book verified nightly stays, furnished apartments & short-term rentals in Noida, Greater Noida & Delhi on OvikaLiving. Flexible check-in, hotel-quality amenities. No brokerage. Instant booking from ₹999/night." />
        ) : lockedRental === 'long' ? (
          <meta name="description" content="Find verified PG, co-living & monthly rental rooms in Noida & Greater Noida. All sectors covered. Starting ₹8,000/month. Meals, Wi-Fi, AC included. Zero brokerage. Book on OvikaLiving." />
        ) : (
          <meta name="description" content="Browse all verified PG, co-living spaces, furnished apartments & nightly stays in Noida, Greater Noida, Delhi & Gurugram on OvikaLiving. Filter by sector, budget & amenities. No brokerage. Instant booking." />
        )}

        <meta name="keywords" content="ovikaliving properties, browse pg noida, all pg noida, pg listing noida, co living noida, furnished apartment noida, nightly stays noida, short term rental noida, monthly rental noida, pg for working professionals noida, pg for students noida, pg with food noida, pg with wifi noida, pg with ac noida, furnished apartment greater noida, best pg noida, verified pg noida, no brokerage pg noida, pg near metro noida, studio apartment noida, affordable pg noida, premium pg noida, remote workers noida, startup founders noida, interns noida, corporate employees noida, IT professionals noida, pg sector 62 noida, pg sector 63 noida, pg sector 18 noida, pg sector 16 noida, pg sector 50 noida, pg sector 130 noida, pg sector 137 noida, pg sector 144 noida, pg knowledge park greater noida, pg alpha greater noida, pg beta greater noida, pg gamma greater noida, pg greater noida west, pg noida extension, नोएडा में पीजी, को लिविंग नोएडा, किराये का कमरा, फर्निश्ड फ्लैट, मासिक किराया, शॉर्ट स्टे, pg under 10000 noida, pg under 15000 noida, pg under 20000 noida, furnished flat under 25000 noida, 1bhk noida, 2bhk noida, fully furnished apartment noida, serviced apartment noida, paying guest noida, shared accommodation noida, single occupancy pg noida, double occupancy pg noida, wifi included pg noida, meals included pg noida, ac room pg noida, best pg in noida under 20000, fully furnished pg noida no brokerage, verified pg noida, best co-living noida under 20000" />
        <meta name="robots" content="index, follow" />

        {lockedRental === 'short' ? (
          <link rel="canonical" href="https://www.ovikaliving.com/nightly-stays" />
        ) : lockedRental === 'long' ? (
          <link rel="canonical" href="https://www.ovikaliving.com/monthly-rentals" />
        ) : (
          <link rel="canonical" href="https://www.ovikaliving.com/properties" />
        )}

        <meta name="author" content="OvikaLiving" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />
        <meta name="language" content="en" />
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Noida" />
        <meta name="geo.position" content="28.5355;77.3910" />
        <meta name="ICBM" content="28.5355, 77.3910" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={lockedRental === 'short' ? 'Nightly Stays in Noida | Book Short-Term Rentals | OvikaLiving' : lockedRental === 'long' ? 'Monthly Rentals & PG in Noida | OvikaLiving' : 'Browse PG, Co-Living & Furnished Rentals in Noida | OvikaLiving'} />
        <meta property="og:description" content={lockedRental === 'short' ? 'Verified nightly stays & short-term furnished rentals in Noida. Flexible check-in from ₹999/night. No brokerage. Book now!' : lockedRental === 'long' ? 'Best PG & monthly rental rooms in Noida from ₹8,000/mo. Meals, Wi-Fi, AC. Verified. Zero brokerage. Book now!' : 'All verified PG, co-living & furnished stays in Noida & Greater Noida. No brokerage. Book now!'} />
        <meta property="og:url" content={lockedRental === 'short' ? 'https://www.ovikaliving.com/nightly-stays' : lockedRental === 'long' ? 'https://www.ovikaliving.com/monthly-rentals' : 'https://www.ovikaliving.com/properties'} />
        <meta property="og:site_name" content="OvikaLiving" />
        <meta property="og:image" content="https://www.ovikaliving.com/og-properties.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="OvikaLiving — Verified PG and Rentals in Noida" />
        <meta property="og:locale" content="en_IN" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@OvikaLiving" />
        <meta name="twitter:title" content={lockedRental === 'short' ? 'Nightly Stays in Noida | OvikaLiving' : lockedRental === 'long' ? 'Monthly Rentals & PG Noida | OvikaLiving' : 'Browse All PG & Co-Living in Noida | OvikaLiving'} />
        <meta name="twitter:description" content={lockedRental === 'short' ? 'Book verified short-term stays in Noida from ₹999/night. No brokerage.' : lockedRental === 'long' ? 'PG & monthly rooms in Noida from ₹8K/mo. Wi-Fi, meals, AC. Zero brokerage.' : 'Best PG, co-living & furnished rentals in Noida. All sectors. No brokerage!'} />
        <meta name="twitter:image" content="https://www.ovikaliving.com/og-properties.jpg" />

        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": lockedRental === 'short' ? "https://www.ovikaliving.com/nightly-stays" : lockedRental === 'long' ? "https://www.ovikaliving.com/monthly-rentals" : "https://www.ovikaliving.com/properties",
              "url": lockedRental === 'short' ? "https://www.ovikaliving.com/nightly-stays" : lockedRental === 'long' ? "https://www.ovikaliving.com/monthly-rentals" : "https://www.ovikaliving.com/properties",
              "name": lockedRental === 'short' ? "Nightly Stays in Noida | OvikaLiving" : lockedRental === 'long' ? "Monthly Rentals & PG in Noida | OvikaLiving" : "Browse Verified PG, Co-Living & Rentals in Noida | OvikaLiving",
              "description": lockedRental === 'short' ? "Verified nightly stays, furnished apartments & short-term rentals in Noida. Flexible check-in. No brokerage." : lockedRental === 'long' ? "Verified PG, co-living & monthly rental rooms in Noida from ₹8,000/month. All amenities. Zero brokerage." : "All verified PG, co-living spaces, furnished apartments & nightly stays in Noida & Greater Noida.",
              "isPartOf": { "@id": "https://www.ovikaliving.com/#website" },
              "inLanguage": "en-IN",
              "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.ovikaliving.com/" },
                  { "@type": "ListItem", "position": 2, "name": lockedRental === 'short' ? "Nightly Stays" : lockedRental === 'long' ? "Monthly Rentals" : "Properties", "item": lockedRental === 'short' ? "https://www.ovikaliving.com/nightly-stays" : lockedRental === 'long' ? "https://www.ovikaliving.com/monthly-rentals" : "https://www.ovikaliving.com/properties" }
                ]
              }
            },
            {
              "@type": "ItemList",
              "name": lockedRental === 'short' ? "Nightly Stays in Noida — OvikaLiving" : lockedRental === 'long' ? "Monthly PG & Rentals in Noida — OvikaLiving" : "PG & Rentals in Noida — OvikaLiving",
              "description": lockedRental === 'short' ? "Verified short-term furnished apartments and nightly stays in Noida, Greater Noida and Delhi." : lockedRental === 'long' ? "Verified PG rooms, co-living and monthly rental accommodations in Noida and Greater Noida." : "Verified PG, co-living spaces, furnished apartments and nightly stays listed on OvikaLiving.",
              "url": lockedRental === 'short' ? "https://www.ovikaliving.com/nightly-stays" : lockedRental === 'long' ? "https://www.ovikaliving.com/monthly-rentals" : "https://www.ovikaliving.com/properties",
              "numberOfItems": "200+",
              "itemListOrder": "https://schema.org/ItemListOrderDescending"
            },
            {
              "@type": "FAQPage",
              "mainEntity": lockedRental === 'short' ? [
                { "@type": "Question", "name": "How to book a nightly stay in Noida?", "acceptedAnswer": { "@type": "Answer", "text": "Browse nightly stays on OvikaLiving, select your dates on the property page, complete verification and pay online. Instant confirmation with no brokerage." } },
                { "@type": "Question", "name": "What is the cheapest nightly stay in Noida?", "acceptedAnswer": { "@type": "Answer", "text": "Nightly stays on OvikaLiving start from ₹999/night in Noida. Premium Signature Stays with hotel-quality amenities are available from ₹2,000/night." } },
                { "@type": "Question", "name": "Can I stay for just one night in Noida?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. OvikaLiving offers fully furnished properties available for single-night bookings in Noida and Greater Noida. No minimum stay requirement on most listings." } }
              ] : lockedRental === 'long' ? [
                { "@type": "Question", "name": "How to find a PG in Noida without brokerage?", "acceptedAnswer": { "@type": "Answer", "text": "On OvikaLiving, all PG listings are verified and available directly with zero brokerage. Browse by sector, budget and amenities and book instantly." } },
                { "@type": "Question", "name": "What is the best PG in Noida under ₹10,000?", "acceptedAnswer": { "@type": "Answer", "text": "OvikaLiving lists verified PG rooms in Noida under ₹10,000/month with amenities like Wi-Fi, housekeeping and power backup. Filter by budget on the monthly rentals page." } },
                { "@type": "Question", "name": "Can I book a furnished room in Noida for one month?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. OvikaLiving offers fully furnished rooms and PG accommodations in Noida starting from ₹8,000/month. All listings are verified with zero brokerage." } }
              ] : [
                { "@type": "Question", "name": "How to find a PG in Noida without brokerage?", "acceptedAnswer": { "@type": "Answer", "text": "On OvikaLiving, all PG listings are verified and available directly with zero brokerage. Browse by sector, budget and amenities and book instantly." } },
                { "@type": "Question", "name": "What are OvikaLiving Signature Stays?", "acceptedAnswer": { "@type": "Answer", "text": "Ovika Signature Stays are OvikaLiving's curated premium short-term rental properties, offering hotel-quality amenities, professional management and flexible nightly or monthly bookings in Noida and Greater Noida." } },
                { "@type": "Question", "name": "Can I book a furnished apartment in Noida for one month?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. OvikaLiving offers fully furnished apartments in Noida, Greater Noida, Delhi and Gurugram for monthly stays starting from ₹8,000/month." } }
              ]
            }
          ]
        })}</script>
      </Helmet>

      {/* ── MOBILE FILTER OVERLAY ── */}
      {sidebarOpen && (
        <div className="plp-filter-overlay" style={{ display: 'block' }} onClick={() => setSidebarOpen(false)} />
      )}
      {/* ── MOBILE FILTER DRAWER ── */}
      {sidebarOpen && (
        <div className="plp-mobile-sidebar" style={{ display: 'block' }}>
          <div style={{ padding: '16px 18px 24px', background: '#fdf8f2', borderBottom: '1px solid #e8d9c0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Filters</span>
            <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B5E2A', fontSize: 22, padding: 0, display: 'flex', lineHeight: 1 }}><FiX /></button>
          </div>
          <div style={{ padding: '18px 18px 32px' }}>
          <SidebarContent
            activeCat={activeCat} setActiveCat={setActiveCat}
            rentalType={rentalType} setRentalType={setRentalType}
            lockedRental={lockedRental}
            priceMin={priceMin} setPriceMin={setPriceMin}
            priceMax={priceMax} setPriceMax={setPriceMax}
            roomsFilter={roomsFilter} setRoomsFilter={setRoomsFilter}
            propTypeFilter={propTypeFilter} togglePropType={togglePropType}
            amenitiesFilter={amenitiesFilter} toggleAmenity={toggleAmenity}
            furnishingFilter={furnishingFilter} setFurnishingFilter={setFurnishingFilter}
            tenantFilter={tenantFilter} setTenantFilter={setTenantFilter}
            foodFilter={foodFilter} setFoodFilter={setFoodFilter}
            petsFilter={petsFilter} setPetsFilter={setPetsFilter}
            coupleFilter={coupleFilter} setCoupleFilter={setCoupleFilter}
            resetSidebar={resetSidebar}
            onDone={() => setSidebarOpen(false)}
          />
          </div>
        </div>
      )}

      {/* ── LIST PROPERTY POPUP ── */}
      {listPopupOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setListPopupOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.55)',
              zIndex: 400,
              animation: 'fadeInBg 0.2s ease',
            }}
          />
          {/* Centered modal */}
          <div style={{
            position: 'fixed',
            top: '50%', left: '50%',
            background: '#fff',
            zIndex: 401,
            borderRadius: 16,
            width: 'min(420px, 92vw)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
            animation: 'slideUp 0.22s ease-out forwards',
            overflow: 'hidden',
          }}>
            {/* Header bar */}
            <div style={{
              background: 'linear-gradient(135deg, #C98B3E 0%, #a06a28 100%)',
              padding: '16px 20px 14px',
              position: 'relative',
              textAlign: 'center',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '0.01em' }}>
                Listing Category
              </h3>
              <button
                onClick={() => setListPopupOpen(false)}
                style={{
                  position: 'absolute', top: 10, right: 12,
                  background: 'rgba(255,255,255,0.2)', border: 'none',
                  borderRadius: '50%', width: 28, height: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff', fontSize: 13,
                  backdropFilter: 'blur(4px)',
                  transition: 'background 0.18s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              >
                <FiX />
              </button>
            </div>

            {/* Two cards */}
            <div style={{
              padding: '16px 16px 18px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
            }}>
              {[
                {
                  img: '🏠',
                  title: 'Short Term Rental',
                  desc: 'Nightly stays & PG',
                  path: '/listed1',
                },
                {
                  img: '🏢',
                  title: 'Long Term Rental',
                  desc: 'Monthly rentals & PG',
                  path: '/list-pg',
                },
              ].map(opt => (
                <div
                  key={opt.path}
                  style={{
                    background: '#fff',
                    border: '1.5px solid #e8d9c0',
                    borderRadius: 14,
                    padding: '16px 12px 14px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 9, textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Icon circle */}
                  <div style={{
                    width: 54, height: 54, borderRadius: '50%',
                    background: '#FFF6EE',
                    border: '1.5px solid rgba(201,139,62,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26,
                  }}>
                    {opt.img}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 4, lineHeight: 1.3 }}>
                      {opt.title}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#9ca3af', lineHeight: 1.4 }}>
                      {opt.desc}
                    </div>
                  </div>
                  <button
                    onClick={() => { setListPopupOpen(false); navigate(opt.path); }}
                    onMouseEnter={e => e.currentTarget.style.background = '#AF7834'}
                    onMouseLeave={e => e.currentTarget.style.background = '#C98B3E'}
                    style={{
                      width: '100%', padding: '9px 0',
                      background: '#C98B3E', color: '#fff',
                      border: 'none', borderRadius: 9,
                      fontWeight: 600, fontSize: 12.5,
                      cursor: 'pointer', fontFamily: 'inherit',
                      marginTop: 'auto',
                      boxShadow: '0 2px 8px rgba(201,139,62,0.3)',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    List Property
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── BODY: sidebar (fixed) + grid (scrollable) ── */}
      <div className="plp-body">

        {/* ── DESKTOP SIDEBAR ── */}
        <div className="plp-sidebar">
          <SidebarContent
            activeCat={activeCat} setActiveCat={setActiveCat}
            rentalType={rentalType} setRentalType={setRentalType}
            lockedRental={lockedRental}
            priceMin={priceMin} setPriceMin={setPriceMin}
            priceMax={priceMax} setPriceMax={setPriceMax}
            roomsFilter={roomsFilter} setRoomsFilter={setRoomsFilter}
            propTypeFilter={propTypeFilter} togglePropType={togglePropType}
            amenitiesFilter={amenitiesFilter} toggleAmenity={toggleAmenity}
            furnishingFilter={furnishingFilter} setFurnishingFilter={setFurnishingFilter}
            tenantFilter={tenantFilter} setTenantFilter={setTenantFilter}
            foodFilter={foodFilter} setFoodFilter={setFoodFilter}
            petsFilter={petsFilter} setPetsFilter={setPetsFilter}
            coupleFilter={coupleFilter} setCoupleFilter={setCoupleFilter}
            resetSidebar={resetSidebar}
          />
        </div>

        {/* ── RIGHT CONTENT ── */}
        <div className="plp-right">
          {/* ── Top bar with integrated search ── */}
          <div className="plp-topbar">

            {/* Left: Mobile filter btn + title + count */}
            <div className="plp-topbar-left">
              <button
                className="plp-mobile-filter-btn"
                onClick={() => setSidebarOpen(true)}
                style={{
                  display: 'none', alignItems: 'center', gap: 5,
                  padding: '7px 12px', background: '#C98B3E',
                  border: 'none', borderRadius: 9, color: '#fff',
                  fontWeight: 600, fontSize: 13,
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 2px 6px rgba(201,139,62,0.25)',
                  flexShrink: 0,
                }}
              >
                <FiTag style={{ fontSize: 13 }} /> Filters
              </button>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: 0, whiteSpace: 'nowrap' }}>
                {activeCat ? activeCat.title : 'All Properties'}
              </h2>
              <span style={{
                background: '#f5ede0', color: '#8B5E2A',
                borderRadius: 20, padding: '2px 10px',
                fontSize: 13, fontWeight: 600, flexShrink: 0,
              }}>{filtered.length}</span>
              {activeCat && (
                <button onClick={() => setActiveCat(null)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '3px 10px', background: '#FFF6EE',
                  border: '1px solid rgba(201,139,62,0.3)',
                  borderRadius: 20, color: '#C98B3E', fontSize: 12,
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
                }}>
                  <FiX style={{ fontSize: 11 }} /> Clear
                </button>
              )}
            </div>

            {/* Search input */}
            <div className="plp-topbar-search">
              <div
                style={{
                  background: '#faf7f3', border: '1.5px solid #e8d9c0',
                  borderRadius: 10, display: 'flex', alignItems: 'center',
                  padding: '7px 12px', gap: 7, transition: 'border-color 0.2s ease',
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#C98B3E'}
                onBlur={e => e.currentTarget.style.borderColor = '#e8d9c0'}
              >
                <FiSearch style={{ fontSize: 14, color: '#b89a70', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search city, area, property..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    flex: 1, border: 'none', outline: 'none',
                    fontSize: 13, color: '#1a1a1a', background: 'transparent',
                    fontFamily: 'inherit', minWidth: 0,
                  }}
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{
                    width: 18, height: 18, borderRadius: '50%', border: 'none',
                    background: '#e8d9c0', color: '#8B5E2A', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}><FiX style={{ fontSize: 9 }} /></button>
                )}
              </div>
            </div>

            {/* Right: Sort + List Property */}
            <div className="plp-topbar-right">
              <div className="plp-sort-wrap" style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: '#faf7f3', borderRadius: 8,
                border: '1px solid #e8d9c0', padding: '0 10px',
              }}>
                <span className="plp-sort-label" style={{ fontSize: 12, color: '#b89a70', whiteSpace: 'nowrap' }}>Sort:</span>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
                  padding: '7px 4px', border: 'none', fontSize: 13, color: '#374151',
                  background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', outline: 'none',
                }}>
                  <option value="recommended">Best</option>
                  <option value="price_asc">Price ↑</option>
                  <option value="price_desc">Price ↓</option>
                </select>
              </div>
              <button
                className="plp-list-btn"
                onClick={() => setListPopupOpen(true)}
                onMouseEnter={e => e.currentTarget.style.background = '#AF7834'}
                onMouseLeave={e => e.currentTarget.style.background = '#C98B3E'}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '7px 14px', background: '#C98B3E', color: '#fff',
                  border: 'none', borderRadius: 9, fontWeight: 600, fontSize: 13,
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 2px 8px rgba(201,139,62,0.25)',
                  transition: 'background 0.2s ease', whiteSpace: 'nowrap',
                }}
              >
                <FiPlus style={{ fontSize: 13 }} /> <span className="plp-list-btn-text">List Property</span>
              </button>
            </div>
          </div>

        {/* ── Properties Grid (paginated) ── */}
        {(() => {
          const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
          const pageItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

          if (filtered.length === 0) return (
            <div style={{
              textAlign: 'center', padding: '80px 24px',
              background: '#fff', borderRadius: 16,
              border: '2px dashed #e5e7eb',
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: '#f5f5f5', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 18px',
              }}>
                <FiSearch style={{ fontSize: 32, color: '#ccc' }} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#222', margin: '0 0 8px' }}>No Properties Found</h3>
              <p style={{ color: '#9ca3af', fontSize: 15, margin: '0 0 24px' }}>
                {search ? `No matches for "${search}"` : activeCat ? `No properties in ${activeCat.title}` : 'No properties available at the moment.'}
              </p>
              <button onClick={() => { setSearch(''); setActiveCat(null); resetSidebar(); }} style={{
                padding: '10px 28px', background: '#C98B3E', color: '#fff',
                border: 'none', borderRadius: 10, fontWeight: 600,
                fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 2px 8px rgba(201,139,62,0.3)',
              }}>
                Clear All Filters
              </button>
            </div>
          );

          return (
            <>
              <div className="plp-grid">
                {pageItems.map(p => (
                  <PropertyCard key={p.id} property={p} rentalType={rentalType} />
                ))}
              </div>

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 6, marginTop: 32, paddingBottom: 8, flexWrap: 'wrap',
                }}>
                  {/* Prev */}
                  <button
                    onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); document.querySelector('.plp-right')?.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={currentPage === 1}
                    style={{
                      padding: '8px 16px', borderRadius: 9, fontWeight: 600, fontSize: 13,
                      border: '1.5px solid #e5e7eb', background: currentPage === 1 ? '#f9fafb' : '#fff',
                      color: currentPage === 1 ? '#d1d5db' : '#374151',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit', transition: 'all 0.18s ease',
                    }}
                  >← Prev</button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(n => n === 1 || n === totalPages || Math.abs(n - currentPage) <= 2)
                    .reduce((acc, n, idx, arr) => {
                      if (idx > 0 && n - arr[idx - 1] > 1) acc.push('...');
                      acc.push(n);
                      return acc;
                    }, [])
                    .map((item, idx) => item === '...' ? (
                      <span key={`dot-${idx}`} style={{ color: '#9ca3af', fontSize: 14, padding: '0 4px' }}>•••</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => { setCurrentPage(item); document.querySelector('.plp-right')?.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        style={{
                          width: 38, height: 38, borderRadius: 9, fontWeight: 700, fontSize: 14,
                          border: '1.5px solid',
                          borderColor: currentPage === item ? '#C98B3E' : '#e5e7eb',
                          background: currentPage === item ? '#C98B3E' : '#fff',
                          color: currentPage === item ? '#fff' : '#374151',
                          cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s ease',
                          boxShadow: currentPage === item ? '0 2px 8px rgba(201,139,62,0.3)' : 'none',
                        }}
                      >{item}</button>
                    ))
                  }

                  {/* Next */}
                  <button
                    onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); document.querySelector('.plp-right')?.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '8px 16px', borderRadius: 9, fontWeight: 600, fontSize: 13,
                      border: '1.5px solid #e5e7eb', background: currentPage === totalPages ? '#f9fafb' : '#fff',
                      color: currentPage === totalPages ? '#d1d5db' : '#374151',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit', transition: 'all 0.18s ease',
                    }}
                  >Next →</button>

                  {/* Page info */}
                  <span style={{ fontSize: 13, color: '#9ca3af', marginLeft: 8 }}>
                    Page {currentPage} of {totalPages} &nbsp;·&nbsp; {filtered.length} properties
                  </span>
                </div>
              )}
            </>
          );
        })()}
        </div>{/* end right content */}
      </div>{/* end plp-body */}
    </div>
  );
};

export default PropertyListPage;