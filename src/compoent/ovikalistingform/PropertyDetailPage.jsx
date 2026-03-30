

import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { UserCircle } from "lucide-react";

import { 
  FiArrowLeft, FiMapPin, FiShare, FiHeart, FiCheck, FiXCircle,
  FiUser, FiCalendar, FiShield, FiStar, FiX, FiZoomIn, FiZoomOut,
  FiInfo, FiLock, FiZap, FiWind, FiCompass
} from 'react-icons/fi';
import { BiBed, BiBath, BiArea } from 'react-icons/bi';
import { 
  CheckCircle, 
  XCircle, 
  UploadCloud, 
  Loader, 
  ChevronLeft, 
  ChevronRight,
  Car, 
  Building,
  CreditCard,
  ParkingCircle,
  Bus,
  UtensilsCrossed,
  Landmark,
  ShoppingBasket,
  HeartPulse,
  Lightbulb, 
  Clock, 
  Train, 
  ShoppingBag,
  Dumbbell,
  Pill,
  MapPin as MapPinIcon
} from 'lucide-react';
import { MdCurrencyRupee, MdOutlineCurrencyRupee } from 'react-icons/md';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { format } from 'date-fns';
import './PropertyDetailPage.css';
import { AuthContext } from '../Login/AuthContext';

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const getValidPropertyId = (frontendId) => String(frontendId);

const API_BASE_URL = 'https://www.townmanor.ai/api/ovika';
const CALENDAR_API_BASE = 'https://www.townmanor.ai/api/booking/calendar';
const BOOKING_REQUEST_API = 'https://www.townmanor.ai/api/booking-request';

const getPhotoUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith('http')) return photo;
  if (photo.includes('/uploads/')) {
    return `${API_BASE_URL}${photo.startsWith('/') ? '' : '/'}${photo}`;
  }
  return `${API_BASE_URL}/uploads/${photo.startsWith('/') ? photo.substring(1) : photo}`;
};

const formatCurrency = (num) => {
  if (!num && num !== 0) return 'N/A';
  return Number(num).toLocaleString('en-IN');
};

// ─── SHARED BED/BATH HELPERS (same logic as PropertyListPage) ─────────────────

/**
 * Parse any field that could be a JSON string, array, or number into an array.
 */
const parseJsonFieldForCount = (field) => {
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
 * Get bedroom COUNT — consistent with ListPage's getBedCount():
 *   - If parsed array has items → use its length
 *   - Otherwise fall back to Number(raw)
 *
 * Also accepts a pre-parsed array as second argument (parsedBedrooms from transformPropertyData).
 * When parsedBedrooms is provided and non-empty, it takes priority.
 */
const getBedCount = (rawBedrooms, parsedBedrooms) => {
  // Priority 1: already-parsed array from transformPropertyData
  if (Array.isArray(parsedBedrooms) && parsedBedrooms.length > 0) return parsedBedrooms.length;
  // Priority 2: parse the raw field
  const parsed = parseJsonFieldForCount(rawBedrooms);
  if (parsed.length > 0) return parsed.length;
  // Priority 3: plain number
  const n = Number(rawBedrooms);
  return isNaN(n) ? 0 : Math.max(0, n);
};

/**
 * Get bathroom COUNT — consistent with ListPage's getBathCount():
 *   - If parsed array has { type, count } items → sum all count values
 *   - If parsed array has plain items → use length
 *   - Otherwise fall back to Number(raw)
 *
 * Also accepts a pre-parsed array as second argument (parsedBathrooms from transformPropertyData).
 */
const getBathCount = (rawBathrooms, parsedBathrooms) => {
  // Priority 1: already-parsed array from transformPropertyData
  const arr = Array.isArray(parsedBathrooms) && parsedBathrooms.length > 0
    ? parsedBathrooms
    : parseJsonFieldForCount(rawBathrooms);

  if (arr.length > 0) {
    const hasCount = arr.some(item => item && typeof item === 'object' && 'count' in item);
    if (hasCount) {
      return arr.reduce((sum, item) => sum + (Number(item.count) || 0), 0);
    }
    return arr.length;
  }

  // Fallback: plain number
  const n = Number(rawBathrooms);
  return isNaN(n) ? 0 : Math.max(0, n);
};

// ─────────────────────────────────────────────────────────────────────────────

const transformPropertyData = (data) => {
  if (!data) return null;
  
  const parseJsonField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try { 
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) { return []; }
    }
    return [];
  };

  const parseMeta = (meta) => {
    if (!meta) return {};
    if (typeof meta === 'object') return meta;
    try { return JSON.parse(meta); } catch (e) { return {}; }
  };

  const parsedMeta = parseMeta(data.meta);

  const combined = {
    ...data,
    ...parsedMeta,
    meta: parsedMeta,
  };

  // ── Bedroom resolution ──────────────────────────────────────────────────────
  const rawBedrooms = parseJsonField(data.bedrooms || parsedMeta.bedrooms);
  const detailedBedrooms = parseJsonField(parsedMeta.bedroomDetails);

  let parsedBedrooms;
  if (detailedBedrooms.length > 0) {
    parsedBedrooms = detailedBedrooms;
  } else if (rawBedrooms.length > 0) {
    const parsedBathsArr = parseJsonField(data.bathrooms || parsedMeta.bathrooms);

    const attachedCount = parsedBathsArr
      .filter(b => b.type === 'Attached')
      .reduce((sum, b) => sum + (Number(b.count) || 0), 0);

    parsedBedrooms = rawBedrooms.map((room, idx) => ({
      ...room,
      attachedBathroom: room.attachedBathroom !== undefined
        ? Boolean(room.attachedBathroom)
        : idx < attachedCount
          ? true
          : false,
    }));
  } else {
    parsedBedrooms = [];
  }

  return {
    ...combined,
    amenities: parseJsonField(data.amenities || parsedMeta.amenities),
    photos: Array.isArray(data.photos) ? data.photos : (data.photos ? [data.photos] : []),
    parsedBedrooms,
    parsedBathrooms: parseJsonField(data.bathrooms || parsedMeta.bathrooms),
    guidebook: combined.guidebook || parsedMeta.guidebook || {},
    guest_policy: combined.guest_policy || parsedMeta.guest_policy || {}
  };
};

const toYMD = (date) => {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d;
};

function buildDisabledDates(blockedRanges = []) {
  const set = new Set();
  blockedRanges.forEach((r) => {
    const start = new Date(r.start);
    const end = new Date(r.end);
    for (let d = new Date(start); toYMD(d) < toYMD(end); d = addDays(d, 1)) {
      set.add(toYMD(d));
    }
  });
  return set;
}

async function getCalendar(propertyKey) {
  return { blocked: [] };
}

// ─── KEY HELPER: Determine if rooms have distinct prices ─────────────────────
const hasDistinctRoomPrices = (bedrooms, meta) => {
  if (!Array.isArray(bedrooms) || bedrooms.length === 0) return false;
  if (meta?.usePerRoomPricing === true) return true;
  const prices = bedrooms.map(r => Number(r.price) || 0).filter(p => p > 0);
  if (prices.length < 2) return false;
  return new Set(prices).size > 1;
};

// ─── ROOM TABLE COMPONENTS ────────────────────────────────────────────────────

const RoomBadge = ({ children, color = 'default' }) => {
  const styles = {
    default: { background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' },
    ac:      { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' },
    green:   { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' },
  };
  const s = styles[color] || styles.default;
  return (
    <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '20px', whiteSpace: 'nowrap', ...s }}>
      {children}
    </span>
  );
};

const AvailBadge = ({ date }) => {
  const dotStyle = { width: 7, height: 7, borderRadius: '50%', display: 'inline-block', marginRight: 5, flexShrink: 0 };
  if (date) {
    const label = new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    return <div style={{ display:'flex', alignItems:'center', fontSize:'0.78rem', color:'#64748b' }}><span style={{ ...dotStyle, background:'#64748b' }}/>{label}</div>;
  }
  return <div style={{ display:'flex', alignItems:'center', fontSize:'0.78rem', color:'#16a34a' }}><span style={{ ...dotStyle, background:'#22c55e' }}/>Now</div>;
};

const BathBadge = ({ attached }) => {
  if (attached === null || attached === undefined) {
    return <span style={{ fontSize:'0.78rem', color:'#94a3b8' }}>—</span>;
  }
  return (
    <div style={{ display:'flex', alignItems:'center', fontSize:'0.78rem', fontWeight:600, color: attached ? '#16a34a' : '#64748b' }}>
      <span style={{ width:7, height:7, borderRadius:'50%', background: attached ? '#22c55e' : '#94a3b8', display:'inline-block', marginRight:5, flexShrink:0 }}/>
      {attached ? 'Attached' : 'Shared'}
    </div>
  );
};

const PriceCell = ({ price, unit }) => {
  if (!price || price <= 0) return <span style={{ fontSize:'0.78rem', color:'#94a3b8' }}>On Request</span>;
  return (
    <div>
      <span style={{ fontWeight:600, fontSize:'0.92rem', color:'#1e293b' }}>₹{price.toLocaleString('en-IN')}</span>
      <span style={{ fontSize:'0.72rem', color:'#64748b' }}>/{unit}</span>
    </div>
  );
};

// ─── SCENARIO 1 / 4: Whole property, single Book Now ─────────────────────────
const RoomTableSingle = ({ rooms, price, priceUnit, area, availableFrom, onBookNow, showDeposit, depositAmount }) => {
  const rowCount = rooms.length;
  return (
    <div className="rm-table-outer">
      <table className="rm-table" style={{ tableLayout:'fixed', width:'100%' }}>
        <colgroup>
          <col style={{ width: showDeposit ? '30%' : '34%' }}/>
          <col style={{ width: showDeposit ? '13%' : '16%' }}/>
          <col style={{ width: showDeposit ? '10%' : '13%' }}/>
          <col style={{ width: showDeposit ? '13%' : '15%' }}/>
          {showDeposit && <col style={{ width:'18%' }}/>}
          <col style={{ width: showDeposit ? '10%' : '12%' }}/>
          <col style={{ width:'10%' }}/>
        </colgroup>
        <thead>
          <tr>
            <th className="rm-th rm-th--room">Room</th>
            <th className="rm-th">Bathroom</th>
            <th className="rm-th">Area</th>
            <th className="rm-th rm-th--price">Price / {priceUnit}</th>
            {showDeposit && <th className="rm-th">Deposit</th>}
            <th className="rm-th">Available</th>
            <th className="rm-th rm-th--action"></th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, i) => {
            const isFirst = i === 0;
            const isLast  = i === rowCount - 1;
            return (
              <tr key={i} className={`rm-row${isLast ? ' rm-row--last' : ''}`}>
                <td className="rm-td rm-td--room">
                  <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                    <div style={{ width:32, height:24, flexShrink:0, background:'#f1f5f9', borderRadius:4, border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', marginTop:2 }}>
                      <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
                        <rect x="1" y="5" width="16" height="7" rx="1.5" fill="#94a3b8"/>
                        <rect x="1" y="1" width="4" height="5" rx="1" fill="#cbd5e1"/>
                        <rect x="13" y="1" width="4" height="5" rx="1" fill="#cbd5e1"/>
                        <rect x="0.5" y="11" width="3" height="1.5" rx="0.5" fill="#94a3b8"/>
                        <rect x="14.5" y="11" width="3" height="1.5" rx="0.5" fill="#94a3b8"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:'0.88rem', color:'#0f172a', lineHeight:1.3 }}>
                        {room.type || `Bedroom ${i+1}`}
                      </div>
                      <div style={{ display:'flex', gap:4, marginTop:4, flexWrap:'wrap' }}>
                        {room.bedType   && <RoomBadge>{room.bedType}</RoomBadge>}
                        {room.ac        && <RoomBadge color="ac">❄ AC</RoomBadge>}
                        {room.furnished && <RoomBadge color="green">Furnished</RoomBadge>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="rm-td">
                  <BathBadge attached={room.attachedBathroom} />
                </td>
                {isFirst && (
                  <td className="rm-td" rowSpan={rowCount} style={{ verticalAlign:'middle' }}>
                    <span className="rm-area-val">{area || '—'}</span>
                  </td>
                )}
                {isFirst && (
                  <td className="rm-td rm-td--price" rowSpan={rowCount} style={{ verticalAlign:'middle' }}>
                    <PriceCell price={price} unit={priceUnit} />
                  </td>
                )}
                {isFirst && showDeposit && (
                  <td className="rm-td" rowSpan={rowCount} style={{ verticalAlign:'middle' }}>
                    <div style={{ fontSize:'0.8rem', fontWeight:'600', color:'#8b0000' }}>₹{formatCurrency(depositAmount)}</div>
                    <div style={{ fontSize:'0.7rem', color:'#64748b' }}>1 night</div>
                    <span style={{ display:'inline-block', marginTop:'3px', background:'#dcfce7', color:'#166534', padding:'1px 7px', borderRadius:'20px', fontSize:'0.68rem', fontWeight:'600' }}>Refundable</span>
                  </td>
                )}
                {isFirst && (
                  <td className="rm-td" rowSpan={rowCount} style={{ verticalAlign:'middle' }}>
                    <AvailBadge date={availableFrom} />
                  </td>
                )}
                {isFirst && (
                  <td className="rm-td rm-td--cta" rowSpan={rowCount} style={{ verticalAlign:'middle' }}>
                    <button className="rm-book-btn" onClick={() => onBookNow(rooms[0])}>Book Now</button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const RoomTableSingleMobile = ({ rooms, price, priceUnit, availableFrom, onBookNow }) => {
  const isAvailNow = !availableFrom;
  const availLabel = availableFrom
    ? new Date(availableFrom).toLocaleDateString('en-IN', { day:'numeric', month:'short' })
    : 'Now';

  return (
    <div className="rm-mob-wrap">
      <div className="rm-mob-card">
        <div className="rm-mob-card-head">
          <div style={{ flex:1 }}>
            <div style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', color:'#94a3b8', marginBottom:8 }}>
              Entire property · {rooms.length} bedroom{rooms.length !== 1 ? 's' : ''}
            </div>
            {rooms.map((room, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, marginBottom: i < rooms.length - 1 ? 10 : 0, paddingBottom: i < rooms.length - 1 ? 10 : 0, borderBottom: i < rooms.length - 1 ? '1px dashed #f1f5f9' : 'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, flex:1, minWidth:0 }}>
                  <div style={{ width:24, height:18, flexShrink:0, background:'#f1f5f9', borderRadius:3, border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                      <rect x="0.5" y="3.5" width="13" height="6" rx="1.5" fill="#94a3b8"/>
                      <rect x="0.5" y="0.5" width="3" height="4" rx="1" fill="#cbd5e1"/>
                      <rect x="10.5" y="0.5" width="3" height="4" rx="1" fill="#cbd5e1"/>
                    </svg>
                  </div>
                  <div style={{ minWidth:0 }}>
                    <div className="rm-mob-card-title" style={{ marginBottom:3 }}>
                      {room.type || `Bedroom ${i+1}`}
                    </div>
                    <div className="rm-mob-card-tags">
                      {room.bedType   && <span className="rm-mob-tag">{room.bedType}</span>}
                      {room.ac        && <span className="rm-mob-tag rm-mob-tag--ac">❄ AC</span>}
                      {room.furnished && <span className="rm-mob-tag">Furnished</span>}
                    </div>
                  </div>
                </div>
                <div style={{ flexShrink:0 }}>
                  {room.attachedBathroom === null || room.attachedBathroom === undefined ? (
                    <span style={{ fontSize:'0.72rem', color:'#94a3b8' }}>—</span>
                  ) : (
                    <span style={{
                      display:'inline-flex', alignItems:'center', gap:4,
                      fontSize:'0.72rem', fontWeight:600, padding:'3px 8px',
                      borderRadius:99, whiteSpace:'nowrap',
                      background: room.attachedBathroom ? '#f0fdf4' : '#f8fafc',
                      color:      room.attachedBathroom ? '#16a34a' : '#64748b',
                      border:     room.attachedBathroom ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                    }}>
                      <span style={{ width:5, height:5, borderRadius:'50%', background: room.attachedBathroom ? '#22c55e' : '#94a3b8', display:'inline-block', flexShrink:0 }}/>
                      {room.attachedBathroom ? 'Attached' : 'Shared'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rm-mob-card-stats">
          <div className="rm-mob-stat">
            <span className="rm-mob-stat-label">Price</span>
            <span className="rm-mob-stat-value">
              {price > 0
                ? <><span className="rm-mob-stat-value--price">₹{price.toLocaleString('en-IN')}</span><span className="rm-mob-stat-unit">/{priceUnit}</span></>
                : <span style={{ color:'#94a3b8', fontStyle:'italic' }}>On Request</span>
              }
            </span>
          </div>
          <div className="rm-mob-stat" style={{ borderRight:'none' }}>
            <span className="rm-mob-stat-label">Available</span>
            <span className={`rm-mob-stat-value ${isAvailNow ? 'rm-mob-stat-value--green' : 'rm-mob-stat-value--amber'}`}>
              <span className={`rm-mob-avail-dot rm-mob-avail-dot--${isAvailNow ? 'now' : 'date'}`}></span>
              {availLabel}
            </span>
          </div>
        </div>

        <div className="rm-mob-card-foot">
          <button className="rm-mob-btn rm-mob-btn--book" onClick={() => onBookNow(rooms[0])}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── SCENARIO 2: Per-room pricing ────────────────────────────────────────────
const RoomTablePerRoom = ({ rooms, pricingMode, propertyPrice, propertyArea, onBookNow }) => {
  const priceUnit = pricingMode === 'monthly' ? 'month' : 'night';
  return (
    <div className="rm-table-outer">
      <table className="rm-table">
        <thead>
          <tr>
            <th className="rm-th rm-th--room">Room</th>
            <th className="rm-th">Bathroom</th>
            <th className="rm-th">Area</th>
            <th className="rm-th rm-th--price">Price / {priceUnit}</th>
            <th className="rm-th">Available</th>
            <th className="rm-th rm-th--action"></th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, i) => {
            const isLast = i === rooms.length - 1;
            const nightlyP = Number(propertyPrice) || 0;
            const monthlyP = Number(room.price) || Number(propertyPrice) || 0;
            const displayP = pricingMode === 'monthly' ? monthlyP : nightlyP;
            const area = room.areaSqFt ? `${room.areaSqFt} sqft` : (propertyArea ? `${propertyArea} sqft` : '—');
            return (
              <tr key={i} className={`rm-row ${isLast ? 'rm-row--last' : ''}`}>
                <td className="rm-td rm-td--room">
                  <div className="rm-room-cell">
                    <div className="rm-bed-icon-wrap">
                      <div className="rm-bed-icon">
                        <div className="rm-bed-headboard"></div>
                        <div className="rm-bed-body"><div className="rm-bed-pillow"></div><div className="rm-bed-pillow"></div></div>
                      </div>
                    </div>
                    <div className="rm-room-info">
                      <span className="rm-room-name">{room.type || 'Bedroom'}</span>
                      <div className="rm-room-tags">
                        {room.bedType   && <span className="rm-tag">{room.bedType}</span>}
                        {room.ac        && <span className="rm-tag rm-tag--ac">❄ AC</span>}
                        {room.furnished && <span className="rm-tag">Furnished</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="rm-td"><BathBadge attached={room.attachedBathroom} /></td>
                <td className="rm-td"><span className="rm-area-val">{area}</span></td>
                <td className="rm-td rm-td--price">
                  <PriceCell price={displayP} unit={priceUnit} />
                </td>
                <td className="rm-td"><AvailBadge date={room.availabilityDate} /></td>
                <td className="rm-td rm-td--cta">
                  <button className="rm-book-btn" onClick={() => onBookNow(room)}>Book Now</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const RoomTablePerRoomMobile = ({ rooms, pricingMode, propertyPrice, onBookNow, onEnquire, showEnquire }) => {
  const priceUnit = pricingMode === 'monthly' ? 'month' : 'night';
  return (
    <div className="rm-mob-wrap">
      {rooms.map((room, i) => {
        const nightlyP = Number(propertyPrice) || 0;
        const monthlyP = Number(room.price) || Number(propertyPrice) || 0;
        const displayP = pricingMode === 'monthly' ? monthlyP : nightlyP;
        const isAvailNow = !room.availabilityDate;
        const availLabel = room.availabilityDate
          ? new Date(room.availabilityDate).toLocaleDateString('en-IN', { day:'numeric', month:'short' })
          : 'Now';

        return (
          <div key={i} className="rm-mob-card">
            <div className="rm-mob-card-head">
              <div style={{ flex:1 }}>
                <div className="rm-mob-card-title">{room.type || 'Standard Room'}</div>
                <div className="rm-mob-card-tags">
                  {room.bedType   && <span className="rm-mob-tag">{room.bedType}</span>}
                  {room.ac        && <span className="rm-mob-tag rm-mob-tag--ac">❄ AC</span>}
                  {room.furnished && <span className="rm-mob-tag">Furnished</span>}
                </div>
              </div>
            </div>

            <div className="rm-mob-card-stats">
              <div className="rm-mob-stat">
                <span className="rm-mob-stat-label">Bathroom</span>
                <span className={`rm-mob-stat-value ${room.attachedBathroom ? 'rm-mob-stat-value--green' : ''}`}>
                  {room.attachedBathroom ? 'Attached' : 'Shared'}
                </span>
              </div>
              <div className="rm-mob-stat">
                <span className="rm-mob-stat-label">Price</span>
                <span className="rm-mob-stat-value">
                  {displayP > 0
                    ? <><span className="rm-mob-stat-value--price">₹{displayP.toLocaleString('en-IN')}</span><span className="rm-mob-stat-unit">/{priceUnit}</span></>
                    : <span style={{ color:'#94a3b8', fontStyle:'italic' }}>On Request</span>
                  }
                </span>
                {room.securityDeposit && (
                  <span className="rm-mob-deposit">Dep: ₹{Number(room.securityDeposit).toLocaleString('en-IN')}</span>
                )}
              </div>
              <div className="rm-mob-stat" style={{ borderRight:'none' }}>
                <span className="rm-mob-stat-label">Available</span>
                <span className={`rm-mob-stat-value ${isAvailNow ? 'rm-mob-stat-value--green' : 'rm-mob-stat-value--amber'}`}>
                  <span className={`rm-mob-avail-dot rm-mob-avail-dot--${isAvailNow ? 'now' : 'date'}`}></span>
                  {availLabel}
                </span>
              </div>
            </div>

            <div className="rm-mob-card-foot">
              {showEnquire && (
                <button className="rm-mob-btn rm-mob-btn--enq" onClick={() => onEnquire?.(room)}>
                  Enquire
                </button>
              )}
              <button className="rm-mob-btn rm-mob-btn--book" onClick={() => onBookNow(room)}>
                Book Now
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── IMAGE VIEWER ─────────────────────────────────────────────────────────────
const ImageViewer = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  useEffect(() => { setScale(1); setPosition({ x: 0, y: 0 }); }, [currentIndex]);

  const handleNextImage = () => { if (currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1); };
  const handlePrevImage = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); };
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => { setScale((prev) => { const n = Math.max(prev - 0.5, 1); if (n === 1) setPosition({ x: 0, y: 0 }); return n; }); };
  const handleMouseDown = (e) => { if (scale > 1) { setIsDragging(true); setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y }); } };
  const handleMouseMove = (e) => { if (isDragging && scale > 1) setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const handleMouseUp = () => setIsDragging(false);
  const handleTouchStart = (e) => { if (scale > 1 && e.touches.length === 1) { setIsDragging(true); setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y }); } };
  const handleTouchMove = (e) => { if (isDragging && scale > 1 && e.touches.length === 1) setPosition({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y }); };
  const handleTouchEnd = () => setIsDragging(false);

  return (
    <div className="ivOverlay" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <div className="ivTopbar">
        <span className="ivCounter">{currentIndex + 1} / {images.length}</span>
        <button className="ivCloseBtn" onClick={onClose} aria-label="Close viewer"><FiX /></button>
      </div>
      <div className="ivMain" onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}>
        <img className="ivImg" src={getPhotoUrl(images[currentIndex])} alt={`Property ${currentIndex + 1}`} draggable={false} style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, transition: isDragging ? 'none' : 'transform 0.2s ease' }} />
      </div>
      <div className="ivControls">
        <button className="ivCtrlBtn" onClick={handleZoomOut} disabled={scale <= 1}><FiZoomOut /></button>
        <span className="ivZoomText">{Math.round(scale * 100)}%</span>
        <button className="ivCtrlBtn" onClick={handleZoomIn} disabled={scale >= 4}><FiZoomIn /></button>
      </div>
      {currentIndex > 0 && <button className="ivNavBtn ivPrev" onClick={handlePrevImage}><ChevronLeft size={24} /></button>}
      {currentIndex < images.length - 1 && <button className="ivNavBtn ivNext" onClick={handleNextImage}><ChevronRight size={24} /></button>}
      <div className="ivThumbs">
        {images.map((img, idx) => (
          <img key={idx} src={getPhotoUrl(img)} alt={`Thumbnail ${idx + 1}`} onClick={() => setCurrentIndex(idx)} className={`ivThumb ${currentIndex === idx ? 'ivThumbActive' : ''}`} />
        ))}
      </div>
    </div>
  );
};

// ─── CALENDAR ────────────────────────────────────────────────────────────────
const Calendar = ({ selectedDates, onDateSelect, minDate = new Date(), disabledDateSet = new Set(), onInvalidRange, currentMonth, setCurrentMonth }) => {
  const [checkInDate, setCheckInDate] = useState(selectedDates.checkInDate ? new Date(selectedDates.checkInDate) : null);
  const [checkOutDate, setCheckOutDate] = useState(selectedDates.checkOutDate ? new Date(selectedDates.checkOutDate) : null);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  };

  const isDateDisabled = (date) => {
    if (!date) return true;
    return toYMD(date) < toYMD(minDate) || disabledDateSet.has(toYMD(date));
  };
  const isDateSelected = (date) => {
    if (!date) return false;
    const s = toYMD(date);
    return (checkInDate && s === toYMD(checkInDate)) || (checkOutDate && s === toYMD(checkOutDate));
  };
  const isDateInRange = (date) => {
    if (!date || !checkInDate || !checkOutDate) return false;
    const s = toYMD(date);
    return s > toYMD(checkInDate) && s < toYMD(checkOutDate);
  };

  const handleDateClick = (date) => {
    if (!date || isDateDisabled(date)) return;
    const hasBlockedDateInRange = (start, end) => {
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        if (disabledDateSet.has(d.toISOString().split('T')[0])) return true;
      }
      return false;
    };
    if (!checkInDate || (checkInDate && checkOutDate)) {
      setCheckInDate(date); setCheckOutDate(null);
    } else {
      if (date > checkInDate) {
        if (hasBlockedDateInRange(checkInDate, date)) { onInvalidRange?.('Selected range includes unavailable dates.'); return; }
        setCheckOutDate(date);
        onDateSelect({ checkInDate: toYMD(checkInDate), checkOutDate: toYMD(date) });
      } else {
        if (hasBlockedDateInRange(date, checkInDate)) { onInvalidRange?.('Selected range includes unavailable dates.'); return; }
        setCheckInDate(date); setCheckOutDate(checkInDate);
        onDateSelect({ checkInDate: toYMD(date), checkOutDate: toYMD(checkInDate) });
      }
    }
  };

  const days = getDaysInMonth(currentMonth);
  return (
    <div className="cal-wrap">
      <div className="cal-header">
        <button className="cal-nav-btn" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}><ChevronLeft size={20} /></button>
        <h3 className="cal-title">{months[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
        <button className="cal-nav-btn" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}><ChevronRight size={20} /></button>
      </div>
      <div className="cal-grid">
        {daysOfWeek.map(day => <div key={day} className="cal-dow">{day}</div>)}
        {days.map((date, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(date)}
            disabled={!date || isDateDisabled(date)}
            className={[
              'cal-day',
              !date ? 'cal-day--empty' : '',
              date && isDateDisabled(date) ? 'cal-day--disabled' : '',
              date && isDateSelected(date) ? 'cal-day--selected' : '',
              date && isDateInRange(date) ? 'cal-day--range' : '',
            ].join(' ')}
          >
            {date ? date.getDate() : ''}
          </button>
        ))}
      </div>
      <div className="cal-footer">
        <div className="cal-footer-item"><span className="cal-footer-label">Check-in</span><strong>{checkInDate ? checkInDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}</strong></div>
        <div className="cal-footer-sep" />
        <div className="cal-footer-item"><span className="cal-footer-label">Check-out</span><strong>{checkOutDate ? checkOutDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}</strong></div>
      </div>
    </div>
  );
};

// ─── LEAD MODAL ───────────────────────────────────────────────────────────────
const LeadGenerationModal = ({ isOpen, onClose, propertyName, propertyId, user, roomType }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', message: '' });

  useEffect(() => {
    if (isOpen) {
      setForm(prev => ({
        ...prev,
        name: user?.name || prev.name,
        email: user?.email || prev.email,
        phone: user?.phone || prev.phone,
        message: roomType ? `I am interested in the ${roomType} option.` : ''
      }));
    }
  }, [isOpen, user, roomType]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const finalPropertyName = roomType ? `${propertyName} - ${roomType}` : propertyName;
      await axios.post('https://www.townmanor.ai/api/formlead/leads', {
        name: form.name, email: form.email, phone_number: form.phone,
        property_name: finalPropertyName, property_id: propertyId,
        purpose: form.message, city: 'N/A', source: 'Property Detail Page'
      });
      alert('Interest registered! We will contact you soon.');
      onClose();
    } catch (error) {
      alert('Failed to submit request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10002, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', width: '90%', maxWidth: '450px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: '#f1f1f1', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><FiX color="#333" /></button>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#1a1a1a', fontSize: '1.5rem', fontWeight: '700' }}>
            {roomType ? `Enquire for ${roomType}` : 'Interested in staying?'}
          </h3>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Fill in your details and our team will contact you for <strong style={{ color: '#8b0000' }}>{propertyName}</strong>.</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {['name', 'email', 'phone'].map(field => (
            <div key={field}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'} required value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '1rem' }} />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ marginTop: '1rem', width: '100%', padding: '14px', background: 'linear-gradient(135deg, #8b0000, #a50000)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Sending...' : 'Request Callback'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const PropertyDetailPage = () => {
  const [hostUser, setHostUser] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [viewerImageIndex, setViewerImageIndex] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    checkInDate: '', checkOutDate: '',
    aadhaarVerified: false, passportVerified: false, mobileVerified: false,
    uploadedPhoto: '', termsAgreed: false,
  });
  const [bookingFor, setBookingFor] = useState('me');
  const [guestDetails, setGuestDetails] = useState({ name: '', address: '', phone: '' });
  const [availabilityRequested, setAvailabilityRequested] = useState(false);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [isAadhaarLoading, setIsAadhaarLoading] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState('aadhaar');
  const [mobileNumber, setMobileNumber] = useState('');
  const [clientId, setClientId] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isMobileVerifying, setIsMobileVerifying] = useState(false);
  const [pricing, setPricing] = useState({ subtotal: 0, discount: 0, discountPercentage: 0, gst: 0, total: 0, daysNeededForNextTier: 0, nextTierPercentage: 0 });
  const [isPayNowEnabled, setIsPayNowEnabled] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const [disabledDateSet, setDisabledDateSet] = useState(new Set());
  const [alertMessage, setAlertMessage] = useState(null);
  const [showRequestSentPopup, setShowRequestSentPopup] = useState(false);
  const [hostImage, setHostImage] = useState(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedRoomForLead, setSelectedRoomForLead] = useState(null);
  const [calendarViewMonth, setCalendarViewMonth] = useState(new Date());
  const [monthlyDuration, setMonthlyDuration] = useState(1);
  const [bookingRequestStatus, setBookingRequestStatus] = useState(null);
  const [userBookingRequests, setUserBookingRequests] = useState([]);
  const [passportFile, setPassportFile] = useState(null);
  const [isPassportLoading, setIsPassportLoading] = useState(false);
  const [passportError, setPassportError] = useState('');
  const [passportInput, setPassportInput] = useState('');
  const [bookingType, setBookingType] = useState(0);
  const [ownerApprovalStatus, setOwnerApprovalStatus] = useState(null);
  const [acceptedBookingId, setAcceptedBookingId] = useState(null);
  const [pricingMode, setPricingMode] = useState('daily');
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [rentalType, setRentalType] = useState(() => sessionStorage.getItem('ovika_rental_type') || 'short');

  const token = Cookies.get('jwttoken');
  let username = '';
  if (token) {
    try { username = jwtDecode(token).username; } catch {}
  }

  const steps = ['Property', 'Terms', 'Dates & Pricing', 'Verification', 'Photo Upload', 'Payment'];

  // ── USE SHARED BED/BATH HELPERS — same as PropertyListPage ──────────────────
  // These replace the old getDisplayCount() to ensure consistent counts everywhere.
  // Called below in the features-bar section with property.bedrooms / property.bathrooms
  // plus the already-parsed arrays from transformPropertyData.
  // ────────────────────────────────────────────────────────────────────────────

  const AMENITIES_GROUPS = {
    "Safety & Security": ["CCTV", "Security Guard", "Fire Extinguisher", "Intercom", "Biometric Entry", "Gated Community", "Fire Alarm", "Sprinklers", "Smoke Detectors", "Emergency Exit"],
    "Modern Living": ["Lift", "Power Backup", "Wi-Fi", "Swimming Pool", "Gym", "Clubhouse", "Modular Kitchen", "Chimney", "Central AC", "Smart Home Tech", "EV Charging Point"],
    "Basic Utilities": ["Water Supply 24/7", "Borewell", "Corporation Water", "Gas Pipeline", "Solar Water", "Reserved Parking", "Visitor Parking", "STP Plant", "Waste Management"],
    "Indoor Features": ["Air Conditioner", "Geyser", "RO Water", "Washing Machine", "Refrigerator", "Inverter", "Wardrobe", "Study Table", "Smart TV", "Gas Stove", "Dishwasher", "Microwave"],
    "Outer Spaces": ["Balcony", "Private Terrace", "Garden", "Park Area", "Pet Area", "Kids Play Area", "Club House", "Jogging Track"]
  };

  const getGroupedAmenities = (amenitiesArr) => {
    if (!Array.isArray(amenitiesArr)) return {};
    const grouped = {};
    Object.entries(AMENITIES_GROUPS).forEach(([group, list]) => {
      const found = amenitiesArr.filter(a => list.includes(a));
      if (found.length > 0) grouped[group] = found;
    });
    const allCategorized = Object.values(AMENITIES_GROUPS).flat();
    const rest = amenitiesArr.filter(a => !allCategorized.includes(a));
    if (rest.length > 0) grouped["Others"] = rest;
    return grouped;
  };

  const groupedAmenities = getGroupedAmenities(property?.amenities);
  const showAlert = (msg) => setAlertMessage(msg);
  const closeAlert = () => setAlertMessage(null);

  const CustomAlert = ({ message, onClose }) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '400px', width: '90%' }}>
        <p style={{ marginBottom: '1.5rem' }}>{message}</p>
        <button onClick={onClose} style={{ width: '100%', padding: '12px', background: '#8b0000', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>OK</button>
      </div>
    </div>
  );

  const handleMainImageClick = () => { setViewerImageIndex(activeImg); setShowImageViewer(true); };
  const handleThumbnailClick = (index) => { setViewerImageIndex(index); setShowImageViewer(true); };

  useEffect(() => {
    if (id) {
      const fetchProperty = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/properties/${id}`);
          const data = response.data;
          const transformed = transformPropertyData(data?.data || data);
          setProperty(transformed);
          setBookingType(Number(transformed.booking_type || 0));
          const storedRentalType = sessionStorage.getItem('ovika_rental_type') || 'short';
          setPricingMode(storedRentalType === 'long' ? 'monthly' : 'daily');
        } catch (err) {
          console.error("Failed to fetch property", err);
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id]);

  useEffect(() => {
    if (property && pricingMode === 'monthly' && !selectedPrice) {
      setSelectedPrice(Number(property.price));
    }
  }, [pricingMode, property, selectedPrice]);

  useEffect(() => {
    let subtotal = 0, discountAmount = 0, discountPercentage = 0, computedTotal = 0;
    let currentDays = 0, nextTierDays = 0, nextTierPercentage = 0, daysNeededForNextTier = 0;
    const isMonthlyMode = pricingMode === 'monthly';
    const datesSelected = formData.checkInDate && formData.checkOutDate;

    if (property) {
      const isTMLuxe = property.property_name?.includes('TM Luxe');
      if (isMonthlyMode) {
        let monthly = 0;
        if (property.property_category === 'PG') {
          const isFromRoom = property.parsedBedrooms?.some(r => Number(r.price) === selectedPrice);
          monthly = (selectedPrice && isFromRoom) ? selectedPrice : (selectedPrice || Number(property.meta?.perMonthPrice) || Number(property.meta?.monthlyPrice) || Number(property.monthly_price) || Number(property.price) || 0);
        } else {
          monthly = selectedPrice || Number(property.meta?.perMonthPrice) || Number(property.meta?.monthlyPrice) || Number(property.monthly_price) || Number(property.price) || 0;
        }
        const effectiveMonths = (pricingMode === 'monthly' && monthlyDuration >= 1) ? monthlyDuration : 1;
        subtotal = monthly * effectiveMonths;
        currentDays = effectiveMonths * 30;
        if (datesSelected) {
          const checkIn = new Date(formData.checkInDate);
          const checkOut = new Date(formData.checkOutDate);
          currentDays = Math.ceil(Math.abs(checkOut - checkIn) / (1000 * 60 * 60 * 24));
        }
        if (isTMLuxe) {
          if (currentDays > 30) discountPercentage = 30;
          else if (currentDays > 15) discountPercentage = 15;
        }
      } else if (datesSelected) {
        const checkIn = new Date(formData.checkInDate);
        const checkOut = new Date(formData.checkOutDate);
        currentDays = Math.ceil(Math.abs(checkOut - checkIn) / (1000 * 60 * 60 * 24));
        if (property.property_category === 'PG') {
          subtotal = (Number(property.meta?.perNightPrice) || Number(property.price) || 0) * currentDays;
        } else {
          subtotal = (selectedPrice || Number(property.meta?.perNightPrice) || Number(property.price) || 0) * currentDays;
        }
        if (isTMLuxe) {
          if (currentDays > 30) discountPercentage = 30;
          else if (currentDays > 15) discountPercentage = 15;
        }
      }
      if (isTMLuxe && currentDays > 0) {
        if (currentDays <= 15) { nextTierDays = 16; nextTierPercentage = 15; daysNeededForNextTier = 16 - currentDays; }
        else if (currentDays <= 30) { nextTierDays = 31; nextTierPercentage = 30; daysNeededForNextTier = 31 - currentDays; }
      }
    }
    if (subtotal > 0) {
      discountAmount = (subtotal * discountPercentage) / 100;
      const afterDiscount = subtotal - discountAmount;
      const isMonthlyBooking = pricingMode === 'monthly';
      const isOvikaProperty = isOvikaOwnProperty;
      const perNightPrice = selectedPrice || Number(property?.meta?.perNightPrice) || Number(property?.price) || 0;
      const gst = isMonthlyBooking ? 0 : afterDiscount * 0.05;
      const securityDeposit = isMonthlyBooking
        ? (Number(property?.securityDeposit) || 0)
        : (!isMonthlyBooking && isOvikaProperty ? perNightPrice : 0);
      computedTotal = afterDiscount + gst + securityDeposit;
      setPricing({ subtotal, discount: discountAmount, discountPercentage, gst, securityDeposit, total: computedTotal, daysNeededForNextTier, nextTierPercentage });
    } else {
      setPricing({ subtotal: 0, discount: 0, discountPercentage: 0, gst: 0, securityDeposit: 0, total: 0, daysNeededForNextTier: 0, nextTierPercentage: 0 });
    }
  }, [formData.checkInDate, formData.checkOutDate, property, pricingMode, selectedPrice, monthlyDuration]);

  useEffect(() => {
    const allStepsComplete =
      (formData.checkInDate && formData.checkOutDate && pricing.total > 0) &&
      (formData.aadhaarVerified || formData.passportVerified) &&
      formData.uploadedPhoto;
    setIsPayNowEnabled(allStepsComplete);
  }, [formData, pricing]);

  useEffect(() => {
    if (showPaymentModal && step === 3) {
      const fetchCalendarBlockedDates = async () => {
        try {
          const propertyIdStr = String(id);
          const propertyKeyMap = { '2': 'tm-luxe-1', '1': 'tm-luxe-2', '287': 'tm-luxe-3' };
          const propertyKey = propertyKeyMap[propertyIdStr] || `prop-${propertyIdStr}`;
          const { blocked } = await getCalendar(propertyKey);
          setDisabledDateSet(buildDisabledDates(blocked || []));
        } catch {}
      };
      fetchCalendarBlockedDates();
    }
  }, [showPaymentModal, step, id]);

  useEffect(() => {
    const fetchHostUser = async () => {
      if (!property?.owner_id) return;
      try {
        const res = await axios.get("https://www.townmanor.ai/api/users-list");
        const users = Array.isArray(res.data) ? res.data : [];
        const matchedUser = users.find((u) => String(u.id) === String(property.owner_id));
        if (matchedUser) setHostUser({ name: matchedUser.username });
      } catch {}
    };
    fetchHostUser();
  }, [property]);

  useEffect(() => {
    const fetchHostImage = async () => {
      if (!property?.owner_id) return;
      try {
        const res = await axios.get(`https://www.townmanor.ai/api/user-details?user_id=${property.owner_id}`);
        if (res.data?.profile_photo) setHostImage(res.data.profile_photo);
      } catch {}
    };
    fetchHostImage();
  }, [property?.owner_id]);

  useEffect(() => {
    if (user?.username && property?.id) {
      axios.get(`https://www.townmanor.ai/api/booking-request?username=${user.username}`)
        .then(res => {
          if (res.data.success && Array.isArray(res.data.data)) {
            setUserBookingRequests(res.data.data);
            const req = res.data.data.find(r => String(r.property_id) === String(property.id));
            if (req) {
              setBookingRequestStatus(req.status);
              setAcceptedBookingId(req.id);
              if (req.status === 'accepted') setOwnerApprovalStatus('accepted');
            }
          }
        })
        .catch(() => {});
    }
  }, [user?.username, property?.id]);

  // ── ROOM TABLE LOGIC ─────────────────────────────────────────────────────
  const showDistinctRoomPrices = property ? hasDistinctRoomPrices(property.parsedBedrooms, property.meta) : false;
  const showSingleBookRow = !showDistinctRoomPrices && property?.property_category !== 'PG';

  const handleRoomBookNow = (room) => {
    if (!user) { navigate('/login', { state: { from: location } }); return; }
    let roomPrice;
    if (pricingMode === 'monthly') {
      if (showDistinctRoomPrices && room?.price) {
        roomPrice = Number(room.price);
      } else {
        roomPrice = Number(property.meta?.perMonthPrice) || Number(property.meta?.monthlyPrice) || Number(property.monthly_price) || Number(property.price) || 0;
      }
    } else {
      roomPrice = Number(property.meta?.perNightPrice) || Number(property.price) || 0;
    }
    setSelectedPrice(roomPrice);
    setAvailabilityRequested(false);
    setShowPaymentModal(true);
    setStep(1);
  };

  // ── Monthly booking helpers ──────────────────────────────────────────────
  const addMonths = (dateStr, months) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().split('T')[0];
  };

  const handleMonthlyCheckInChange = (checkIn) => {
    if (!checkIn) { setFormData({ ...formData, checkInDate: '', checkOutDate: '' }); return; }
    const checkOut = monthlyDuration <= 11 ? addMonths(checkIn, monthlyDuration) : '';
    setFormData({ ...formData, checkInDate: checkIn, checkOutDate: checkOut });
  };

  const handleMonthlyDurationChange = (months) => {
    setMonthlyDuration(months);
    if (months <= 11 && formData.checkInDate) {
      setFormData({ ...formData, checkOutDate: addMonths(formData.checkInDate, months) });
    } else {
      setFormData({ ...formData, checkOutDate: '' });
    }
  };

  const handleReserveClick = () => {
    if (!user) { navigate('/login', { state: { from: location } }); return; }
    setAvailabilityRequested(false);
    setOwnerApprovalStatus(bookingRequestStatus === 'accepted' ? 'accepted' : null);
    setShowPaymentModal(true);
    setStep(1);
  };

  const sendAvailabilityRequest = async ({ checkInDate, checkOutDate }) => {
    try {
      setOwnerApprovalStatus('pending');
      const { data } = await axios.post('https://www.townmanor.ai/api/booking-request', {
        property_id: property.id, property_name: property.property_name || property.name,
        city: property.city, username: user?.username || username,
        start_date: checkInDate, end_date: checkOutDate
      });
      if (data?.id || data?.booking_id) {
        setAcceptedBookingId(data.id || data.booking_id);
      }
      showAlert('Request sent to owner for date confirmation.');
      setShowRequestSentPopup(true);
    } catch (err) {
      showAlert('Failed to send availability request');
      setOwnerApprovalStatus(null);
    }
  };

  const handleNext = () => {
    if (step === 1 && bookingFor === 'someone_else') {
      if (!guestDetails.name || !guestDetails.address || !guestDetails.phone) {
        showAlert('Please fill all details for the guest (Name, Address, Mobile).');
        return;
      }
      if (guestDetails.phone.length !== 10) {
        showAlert('Please enter a valid 10-digit mobile number.');
        return;
      }
    }
    if (step === 3 && pricingMode === 'monthly' && monthlyDuration >= 12) { showAlert('Stays longer than 11 months require a rental agreement. Please contact us at +91 9310292309 to proceed.'); return; }
    if (step === 3 && (!formData.checkInDate || !formData.checkOutDate)) return;
    if (step === 3 && bookingType === 1 && pricingMode !== 'monthly' && ownerApprovalStatus !== 'accepted') { showAlert('Please wait for owner approval.'); return; }
    if (step === 2 && !formData.termsAgreed) return;
    if (step === 3 && pricing.total <= 0) return;
    if (step === 4) {
      if (!(formData.aadhaarVerified || formData.passportVerified)) { showAlert('Please verify your ID first.'); return; }
      if (!formData.mobileVerified) { showAlert('Please verify your mobile number.'); return; }
    }
    if (step === 5 && !formData.uploadedPhoto) return;
    if (step < steps.length) setStep(step + 1);
  };

  const handlePrev = () => { if (step > 1) setStep(step - 1); };

  const handleFileDrop = (e) => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]); };
  const handleFileChange = (e) => { if (e.target.files.length > 0) handleFile(e.target.files[0]); };

  const handleFile = async (file) => {
    if (!file.type.startsWith('image/')) { showAlert('Please upload a valid image file.'); return; }
    setIsPhotoUploading(true);
    const fd = new FormData();
    fd.append('images', file);
    try {
      const response = await fetch('https://www.townmanor.ai/api/image/aws-upload-owner-images', { method: 'POST', body: fd });
      const data = await response.json();
      if (!data?.fileUrls?.length) throw new Error('Image URL not found');
      setFormData(prev => ({ ...prev, uploadedPhoto: data.fileUrls[0] }));
      showAlert('Photo uploaded successfully!');
    } catch (error) {
      showAlert('Failed to upload photo. ' + (error.message || 'Unknown error'));
    } finally {
      setIsPhotoUploading(false);
    }
  };

  const handleVerifyAadhaar = async () => {
    setFormData(prev => ({ ...prev, aadhaarVerified: false }));
    if (!aadhaarNumber || !/^\d{12}$/.test(aadhaarNumber)) { showAlert('Please enter a valid 12-digit Aadhaar number.'); return; }
    setIsAadhaarLoading(true);
    showAlert('Verifying Aadhaar...');
    try {
      const response = await axios.post('https://kyc-api.surepass.app/api/v1/aadhaar-validation/aadhaar-validation', { id_number: aadhaarNumber }, { headers: { 'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMDE0NjA5NiwianRpIjoiNmM0YWMxNTMtNDE2MS00YzliLWI4N2EtZWIxYjhmNDRiOTU5IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnVzZXJuYW1lXzJ5MTV1OWk0MW10bjR3eWpsaTh6b2p6eXZiZEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxMDE0NjA5NiwiZXhwIjoyMzQwODY2MDk2LCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.DfipEQt4RqFBQbOK29jbQju3slpn0wF9aoccdmtIsPg' } });
      if (response.data?.success) { setFormData(prev => ({ ...prev, aadhaarVerified: true })); showAlert('Aadhaar verified!'); }
      else showAlert(`Verification failed: ${response.data?.message || 'Try again'}`);
    } catch (error) {
      showAlert(`Verification failed: ${error.response?.data?.message || error.message}`);
    } finally { setIsAadhaarLoading(false); }
  };

  const guestPolicy = property?.guest_policy || {};

  const handlePassportFileSelect = (e) => { const f = e.target.files?.[0]; if (f) { setPassportFile(f); setPassportError(''); } };

  const handleVerifyPassport = async () => {
    if (!passportFile) { showAlert('Please upload a passport image.'); return; }
    setIsPassportLoading(true);
    showAlert('Verifying passport...');
    try {
      const fd = new FormData();
      fd.append('file', passportFile);
      const response = await axios.post('https://kyc-api.surepass.app/api/v1/ocr/international-passport-v2', fd, { headers: { 'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMDE0NjA5NiwianRpIjoiNmM0YWMxNTMtNDE2MS00YzliLWI4N2EtZWIxYjhmNDRiOTU5IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnVzZXJuYW1lXzJ5MTV1OWk0MW10bjR3eWpsaTh6b2p6eXZiZEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxMDE0NjA5NiwiZXhwIjoyMzQwODY2MDk2LCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.DfipEQt4RqFBQbOK29jbQju3slpn0wF9aoccdmtIsPg' }, timeout: 60000 });
      if (response.data?.success || response.status === 200) {
        setFormData(prev => ({ ...prev, passportVerified: true }));
        showAlert('Passport verified!');
      } else {
        const msg = response.data?.message || 'Verification failed';
        setPassportError(msg); showAlert(`Passport verification failed: ${msg}`);
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to verify';
      setPassportError(msg); showAlert(`Verification failed: ${msg}`);
    } finally { setIsPassportLoading(false); }
  };

  const handleGenerateOTP = async () => {
    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) { showAlert('Please enter a valid 10-digit mobile number.'); return; }
    setIsOtpLoading(true);
    showAlert('Sending OTP...');
    try {
      const response = await axios.post('https://kyc-api.surepass.app/api/v1/telecom/generate-otp', { id_number: mobileNumber }, { headers: { 'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMDE0NjA5NiwianRpIjoiNmM0YWMxNTMtNDE2MS00YzliLWI4N2EtZWIxYjhmNDRiOTU5IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnVzZXJuYW1lXzJ5MTV1OWk0MW10bjR3eWpsaTh6b2p6eXZiZEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxMDE0NjA5NiwiZXhwIjoyMzQwODY2MDk2LCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.DfipEQt4RqFBQbOK29jbQju3slpn0wF9aoccdmtIsPg' } });
      if (response.data?.success && response.data?.data?.client_id) {
        setClientId(response.data.data.client_id); setOtpSent(true); showAlert('OTP sent!');
      } else throw new Error(response.data?.message || 'Failed to send OTP');
    } catch (error) {
      if (error.response?.status === 429) {
        showAlert("API busy. Allowing bypass for testing.");
        setFormData(prev => ({ ...prev, mobileVerified: true }));
      } else {
        showAlert(`Error: ${error.response?.data?.message || "Phone OTP error"}`);
      }
    } finally { setIsOtpLoading(false); }
  };

  const handleVerifyOTP = async () => {
    if (!otpInput || otpInput.length < 4) { showAlert('Please enter a valid OTP.'); return; }
    if (!clientId) { showAlert('Client ID missing. Request OTP again.'); return; }
    setIsMobileVerifying(true);
    try {
      const response = await axios.post('https://kyc-api.surepass.app/api/v1/telecom/submit-otp', { client_id: clientId, otp: otpInput }, { headers: { 'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMDE0NjA5NiwianRpIjoiNmM0YWMxNTMtNDE2MS00YzliLWI4N2EtZWIxYjhmNDRiOTU5IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnVzZXJuYW1lXzJ5MTV1OWk0MW10bjR3eWpsaTh6b2p6eXZiZEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxMDE0NjA5NiwiZXhwIjoyMzQwODY2MDk2LCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.DfipEQt4RqFBQbOK29jbQju3slpn0wF9aoccdmtIsPg' } });
      if (response.data?.success) { setFormData(prev => ({ ...prev, mobileVerified: true })); showAlert('Mobile verified!'); }
      else throw new Error(response.data?.message || 'OTP verification failed');
    } catch (error) {
      showAlert(`Error: ${error.response?.data?.message || error.message}`);
    } finally { setIsMobileVerifying(false); }
  };

  const handlePayNow = async () => {
    if (!isPayNowEnabled || isSubmitting) return;
    setIsSubmitting(true);
    try {
      let userLocal = {};
      try { userLocal = JSON.parse(localStorage.getItem('user')) || {}; } catch {}
      let userEmail = userLocal.email || 'guest@townmanor.ai';
      let userPhone = '9999999999';
      let finalUsername = userLocal.username || username || 'guest';
      if (username) {
        try {
          const userRes = await fetch(`https://www.townmanor.ai/api/user/${username}`);
          if (userRes.ok) { const ud = await userRes.json(); userEmail = ud.email || userEmail; userPhone = ud.phone || userPhone; }
        } catch {}
      }

      if (bookingFor === 'someone_else') {
        finalUsername = guestDetails.name;
        userPhone = guestDetails.phone;
      }

      const validPropertyId = getValidPropertyId(id);
      const isInstantBooking = Number(property.booking_type) === 0;
      let newBookingId = (bookingType === 1 || !isInstantBooking) ? acceptedBookingId : null;
      
      const nights = Math.ceil(Math.abs(new Date(formData.checkOutDate) - new Date(formData.checkInDate)) / (1000 * 60 * 60 * 24));
      
      // If we don't have an ID yet (Instant Booking or missing ID), create the booking record
      if (!newBookingId) {
        console.log('Creating new booking record (Instant Flow)...');
        const { data } = await axios.post(BOOKING_REQUEST_API, {
          property_id: validPropertyId, user_id: userLocal.id || user?.id || 0,
          property_name: property.property_name || property.name, property_address: property.address,
          city: property.city, start_date: format(new Date(formData.checkInDate), 'yyyy-MM-dd'),
          end_date: format(new Date(formData.checkOutDate), 'yyyy-MM-dd'),
          username: finalUsername, phone_number: userPhone,
          aadhar_number: aadhaarNumber || passportInput || 'NOT_PROVIDED',
          user_photo: formData.uploadedPhoto || '', terms_verified: true,
          email: userEmail, total_price: pricing.total, subtotal: pricing.subtotal,
          gst_amount: pricing.gst, nights, discount_amount: pricing.discount || 0
        });

        console.log('Booking Creation API Response:', data);
        newBookingId = data?.booking?.id || data?.booking_id || data?.id || data?.bookingId || data?.request_id || data?.requestId || data?.data?.id || data?.data?.booking_id;
      } else {
        console.log('Using existing accepted booking ID:', newBookingId);
      }
      
      if (!newBookingId) {
        console.error('CRITICAL: Booking ID could not be determined.', { isInstantBooking, acceptedBookingId });
        throw new Error('Booking ID missing. Please refresh and try again.');
      }

      localStorage.setItem('bookingId', String(newBookingId)); 
      localStorage.setItem('property_id', String(validPropertyId));
      await handleProceedToPayment(newBookingId);
    } catch (error) {
      console.error('Booking submission error:', error);
      showAlert(`Booking failed: ${error.response?.data?.message || error.message}`);
      setIsSubmitting(false);
    }
  };

  const handleProceedToPayment = async (bookingIdParam) => {
    if (!bookingIdParam) { showAlert('Booking ID missing.'); setIsSubmitting(false); return; }
    try {
      localStorage.setItem('paymentType', 'coliving'); localStorage.setItem('bookingId', String(bookingIdParam));
      const userResponse = await fetch(`https://www.townmanor.ai/api/user/${username}`);
      if (!userResponse.ok) throw new Error('Failed to fetch user data');
      const userData = await userResponse.json();
      const txnid = 'OID' + Date.now();
      const response = await axios.post('https://www.townmanor.ai/api/payu/payment', {
        key: 'UvTrjC', txnid, amount: pricing.total.toFixed(2), productinfo: 'Room Booking',
        firstname: userData.name || username || 'Guest', email: userData.email || 'guest@townmanor.ai',
        phone: userData.phone || mobileNumber || '',
        surl: `https://www.townmanor.ai/api/boster/payu/success?redirectUrl=https://ovikaliving.com/success`,
        furl: `https://www.townmanor.ai/api/boster/payu/failure?redirectUrl=https://ovikaliving.com/failure`,
        udf1: String(bookingIdParam), service_provider: 'payu_paisa'
      });
      if (!response.data?.paymentUrl || !response.data?.params) throw new Error('Invalid payment response');
      const form = document.createElement('form');
      form.method = 'POST'; form.action = response.data.paymentUrl;
      Object.entries(response.data.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const input = document.createElement('input');
          input.type = 'hidden'; input.name = key; input.value = String(value);
          form.appendChild(input);
        }
      });
      document.body.appendChild(form); form.submit(); document.body.removeChild(form);
    } catch (error) {
      showAlert(error.response?.data?.message || error.message || 'Failed to initiate payment.');
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loader-screen"><div className="spinner"></div></div>;
  if (!property) return <div className="error-screen">Property not found</div>;

  const photos = property.photos || [];
  const isPG = property.property_category === 'PG';

  const cleanDescription = (desc) => {
    if (!desc) return "";
    return desc
      .split('--- PG Details ---')[0]
      .split('--- Local Guide ---')[0]
      .split('Notice Period:')[0]
      .split('Gate Closing Time:')[0]
      .trim();
  };

  const displayBasePrice = pricingMode === 'monthly'
    ? (selectedPrice || Number(property.meta?.perMonthPrice) || Number(property.meta?.monthlyPrice) || Number(property.monthly_price) || Number(property.price) || 0)
    : (selectedPrice || Number(property.meta?.perNightPrice) || Number(property.price) || 0);

  // ── OvikaLiving own-managed nightly properties (TM Luxe / Signature 1-5) ───
  const isOvikaOwnProperty = !!(
    property.property_name?.includes('TM Luxe') ||
    property.property_name?.toLowerCase().includes('ovika') ||
    [77, 78, 79, 80, 81].includes(Number(property.id))
  );

  // ── CONSISTENT BED/BATH COUNTS (same helpers as PropertyListPage) ──────────
  const bedCount  = getBedCount(property.bedrooms, property.parsedBedrooms);
  const bathCount = getBathCount(property.bathrooms, property.parsedBathrooms);
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="detail-page-wrapper">
      {alertMessage && <CustomAlert message={alertMessage} onClose={closeAlert} />}
      
      {showRequestSentPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10001 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem', color: '#8b0000' }}>Request Sent</h3>
            <p style={{ marginBottom: '1.5rem', color: '#555' }}>Your request has been sent to the owner for date confirmation.</p>
            <button onClick={() => navigate('/')} style={{ width: '100%', padding: '12px', background: '#8b0000', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Go to Home</button>
          </div>
        </div>
      )}

      {showImageViewer && <ImageViewer images={photos} initialIndex={viewerImageIndex} onClose={() => setShowImageViewer(false)} />}

      <LeadGenerationModal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)} propertyName={property.property_name} propertyId={property.id} user={user} roomType={selectedRoomForLead} />

      {/* ── PAYMENT MODAL ─────────────────────────────────────────────────── */}
      {showPaymentModal && (
        <div className="pm-overlay">
          <div className="pm-card">
            <button onClick={() => setShowPaymentModal(false)} className="pm-close"><FiX /></button>

            <div className="pm-steps-bar">
              <div className="pm-steps-row">
                {steps.map((stepName, index) => (
                  <div key={index} className="pm-step-item">
                    {index < steps.length - 1 && (
                      <div className={`pm-step-line ${index < step ? 'pm-step-line--done' : ''}`}></div>
                    )}
                    <div className="pm-step-inner">
                      <div className={`pm-step-dot ${index + 1 <= step ? 'pm-step-dot--done' : ''}`}>{index + 1}</div>
                      <span className={`pm-step-label ${index + 1 === step ? 'pm-step-label--active' : ''}`}>{stepName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pm-body">
              {step === 1 && (
                <div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Property Details</h2>

                  <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Who are you booking for?</h3>
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: bookingFor === 'someone_else' ? '1.5rem' : '0' }}>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: '500' }}>
                        <input type="radio" value="me" checked={bookingFor === 'me'} onChange={() => { setBookingFor('me'); if(navigator.geolocation) navigator.geolocation.getCurrentPosition(()=>{},()=>{}); }} style={{ marginRight: '8px', width: '18px', height: '18px' }} />
                        Booking for Myself
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: '500' }}>
                        <input type="radio" value="someone_else" checked={bookingFor === 'someone_else'} onChange={() => setBookingFor('someone_else')} style={{ marginRight: '8px', width: '18px', height: '18px' }} />
                        Booking for Someone Else
                      </label>
                    </div>
                    
                    {bookingFor === 'someone_else' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>Guest Name <span style={{color:'red'}}>*</span></label>
                          <input type="text" value={guestDetails.name} onChange={e => setGuestDetails({...guestDetails, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }} placeholder="Enter guest full name" />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>Guest Mobile Number <span style={{color:'red'}}>*</span></label>
                          <input type="tel" maxLength={10} value={guestDetails.phone} onChange={e => setGuestDetails({...guestDetails, phone: e.target.value.replace(/\D/g,'')})} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }} placeholder="Enter 10-digit mobile number" />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>Guest Address <span style={{color:'red'}}>*</span></label>
                          <textarea value={guestDetails.address} onChange={e => setGuestDetails({...guestDetails, address: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'vertical', minHeight: '80px', fontSize: '1rem', fontFamily: 'inherit' }} placeholder="Enter guest complete address"></textarea>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pm-property-card">
                    <img src={getPhotoUrl(property.photos?.[0]) || 'https://via.placeholder.com/300x200'} alt="Property" className="pm-property-img" />
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{property.property_name}</h3>
                      <p style={{ color: '#666', marginBottom: '0.5rem' }}>{property.address}, {property.city}</p>
                      <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: '1rem' }}>{cleanDescription(property.description)}</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#8b0000' }}>
                        <MdCurrencyRupee style={{ display: 'inline', verticalAlign: 'middle' }} />
                        {formatCurrency(displayBasePrice)}
                        <span style={{ fontSize: '1rem', color: '#666' }}>/{pricingMode === 'monthly' ? 'month' : (property.billing_cycle || 'night')}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Terms & Conditions</h2>
                  <div style={{ maxHeight: '400px', overflow: 'auto', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>1. Booking Agreement</p>
                    <p style={{ marginBottom: '1rem' }}>By confirming this booking, you agree to abide by all house rules, including check-in/check-out times, noise restrictions, and guest limits.</p>
                    <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>2. Cancellation Policy</p>
                    <p style={{ marginBottom: '1rem' }}>A full refund will be provided for cancellations made within 48 hours of booking, if the check-in date is at least 14 days away.</p>
                    <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>3. Damage & Liability</p>
                    <p style={{ marginBottom: '1rem' }}>Guests are responsible for any damage caused during their stay.</p>
                    <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>4. Payment & Pricing</p>
                    <p style={{ marginBottom: '1rem' }}>All prices are final. Payment must be completed in full before confirmation.</p>
                    <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>5. Privacy</p>
                    <p>Your personal information will be used solely for this booking.</p>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <input type="checkbox" checked={formData.termsAgreed} onChange={(e) => setFormData({ ...formData, termsAgreed: e.target.checked })} style={{ marginRight: '0.75rem', width: '20px', height: '20px' }} />
                    <span>I have read and agree to the Terms & Conditions.</span>
                  </label>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Dates & Pricing</h2>
                  <div className="pm-dates-grid">
                    <div>
                      {pricingMode === 'monthly' ? (
                        /* ── Monthly Booking Date UI ── */
                        <div>
                          {/* Check-in Date */}
                          <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>Check-in Date</label>
                            <input
                              type="date"
                              min={new Date().toISOString().split('T')[0]}
                              value={formData.checkInDate}
                              onChange={(e) => handleMonthlyCheckInChange(e.target.value)}
                              style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
                            />
                          </div>

                          {/* Duration selector */}
                          <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '10px', color: '#1a1a1a' }}>
                              Duration (Months)
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                                <button
                                  key={n}
                                  onClick={() => handleMonthlyDurationChange(n)}
                                  style={{
                                    padding: '8px 14px',
                                    borderRadius: '8px',
                                    border: monthlyDuration === n ? '2px solid #8b0000' : '1.5px solid #ddd',
                                    background: monthlyDuration === n ? '#8b0000' : '#fff',
                                    color: monthlyDuration === n ? '#fff' : '#333',
                                    fontWeight: monthlyDuration === n ? '700' : '500',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                  }}
                                >
                                  {n} {n === 1 ? 'Mo' : 'Mo'}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 12+ months agreement warning */}
                          {monthlyDuration >= 12 && (
                            <div style={{ padding: '16px', background: '#fff7ed', border: '1.5px solid #f97316', borderRadius: '10px', marginBottom: '1rem' }}>
                              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>⚠️</span>
                                <div>
                                  <p style={{ fontWeight: '700', color: '#9a3412', marginBottom: '6px', fontSize: '0.95rem' }}>
                                    Rental Agreement Required
                                  </p>
                                  <p style={{ color: '#7c2d12', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '8px' }}>
                                    As per the <strong>Rent Control Act</strong>, stays exceeding <strong>11 months</strong> require a formal registered rental agreement. Booking cannot proceed without completing this process.
                                  </p>
                                  <p style={{ color: '#7c2d12', fontSize: '0.875rem', lineHeight: '1.5' }}>
                                    📞 Please contact us to initiate the agreement process before booking:
                                  </p>
                                  <p style={{ fontWeight: '700', color: '#9a3412', fontSize: '0.95rem', marginTop: '6px' }}>
                                    +91 9310292309
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Check-in / Check-out summary */}
                          {formData.checkInDate && formData.checkOutDate && monthlyDuration <= 11 && (
                            <div style={{ padding: '14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', display: 'flex', gap: '2rem' }}>
                              <div>
                                <p style={{ fontSize: '0.78rem', color: '#166534', fontWeight: '600', marginBottom: '2px' }}>CHECK-IN</p>
                                <p style={{ fontWeight: '700', color: '#14532d' }}>{new Date(formData.checkInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                              </div>
                              <div style={{ width: '1px', background: '#86efac' }} />
                              <div>
                                <p style={{ fontSize: '0.78rem', color: '#166534', fontWeight: '600', marginBottom: '2px' }}>CHECK-OUT</p>
                                <p style={{ fontWeight: '700', color: '#14532d' }}>{new Date(formData.checkOutDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                              </div>
                              <div style={{ width: '1px', background: '#86efac' }} />
                              <div>
                                <p style={{ fontSize: '0.78rem', color: '#166534', fontWeight: '600', marginBottom: '2px' }}>DURATION</p>
                                <p style={{ fontWeight: '700', color: '#14532d' }}>{monthlyDuration} {monthlyDuration === 1 ? 'Month' : 'Months'}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* ── Daily Calendar ── */
                        <>
                          {bookingType === 1 && ownerApprovalStatus === 'pending' && (
                            <div style={{ marginBottom: '1rem', padding: '12px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '6px', color: '#92400e', fontSize: '0.9rem' }}>
                              ⏳ Request sent. Waiting for owner approval.
                            </div>
                          )}
                          <Calendar selectedDates={{ checkInDate: formData.checkInDate, checkOutDate: formData.checkOutDate }} currentMonth={calendarViewMonth} setCurrentMonth={setCalendarViewMonth} onDateSelect={(dates) => setFormData({ ...formData, ...dates })} minDate={new Date()} disabledDateSet={disabledDateSet} onInvalidRange={showAlert} />
                        </>
                      )}
                    </div>
                    <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', height: 'fit-content' }}>
                      <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Pricing Summary</h3>
                      {pricingMode === 'monthly' && (
                        <div style={{ marginBottom: '1rem', padding: '10px 12px', background: '#fff7ed', borderRadius: '6px', fontSize: '0.85rem', color: '#92400e' }}>
                          📅 {monthlyDuration} {monthlyDuration === 1 ? 'Month' : 'Months'} × ₹{Number(selectedPrice || property?.price || 0).toLocaleString('en-IN')}/mo
                        </div>
                      )}
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e5e5e5' }}>
                          <span>Subtotal</span><span><MdCurrencyRupee style={{ display: 'inline' }} />{pricing.subtotal.toFixed(2)}</span>
                        </div>
                        {pricing.discount > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e5e5e5', color: '#16a34a' }}>
                            <span>Discount ({pricing.discountPercentage}%)</span><span>-<MdCurrencyRupee style={{ display: 'inline' }} />{pricing.discount.toFixed(2)}</span>
                          </div>
                        )}
                        {pricing.securityDeposit > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e5e5e5', color: '#0369a1' }}>
                            <span>Security Deposit {pricingMode !== 'monthly' ? '(1 night · Refundable)' : '(Refundable)'}</span>
                            <span><MdCurrencyRupee style={{ display: 'inline' }} />{pricing.securityDeposit.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        {pricingMode !== 'monthly' && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e5e5e5' }}>
                            <span>GST (5%)</span><span><MdCurrencyRupee style={{ display: 'inline' }} />{pricing.gst.toFixed(2)}</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '1.2rem', color: '#8b0000' }}>
                          <span>Total</span><span><MdCurrencyRupee style={{ display: 'inline' }} />{pricing.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Verification</h2>
                  <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <label style={{ marginRight: '1.5rem', cursor: 'pointer' }}>
                      <input type="radio" name="verif-method" value="aadhaar" checked={verificationMethod === 'aadhaar'} onChange={() => setVerificationMethod('aadhaar')} style={{ marginRight: '0.5rem' }} />
                      <strong>Aadhaar</strong>
                    </label>
                    <label style={{ cursor: 'pointer' }}>
                      <input type="radio" name="verif-method" value="passport" checked={verificationMethod === 'passport'} onChange={() => setVerificationMethod('passport')} style={{ marginRight: '0.5rem' }} />
                      <strong>International Passport</strong>
                    </label>
                  </div>

                  {verificationMethod === 'aadhaar' ? (
                    <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '8px' }}>
                      <h3 style={{ marginBottom: '1rem' }}>Aadhaar Verification</h3>
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Enter Aadhaar Number</label>
                        <input type="text" inputMode="numeric" maxLength={12} value={aadhaarNumber} onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))} placeholder="12-digit Aadhaar number" disabled={formData.aadhaarVerified} style={{ width: '100%', padding: '14px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }} />
                      </div>
                      <button onClick={handleVerifyAadhaar} disabled={formData.aadhaarVerified || !aadhaarNumber || isAadhaarLoading} style={{ width: '100%', padding: '14px', background: formData.aadhaarVerified ? '#22c55e' : '#8b0000', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {formData.aadhaarVerified ? <><CheckCircle size={20} /> Verified</> : isAadhaarLoading ? <><Loader size={20} className="animate-spin" /> Verifying...</> : 'Verify Aadhaar'}
                      </button>
                    </div>
                  ) : (
                    <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '8px' }}>
                      <h3 style={{ marginBottom: '1rem' }}>Passport Verification</h3>
                      <input type="file" accept="image/*,application/pdf" onChange={handlePassportFileSelect} disabled={formData.passportVerified || isPassportLoading} style={{ width: '100%', padding: '14px', borderRadius: '6px', border: '1px solid #ddd' }} />
                      {passportFile && <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>Selected: {passportFile.name}</p>}
                      <button onClick={handleVerifyPassport} disabled={formData.passportVerified || !passportFile || isPassportLoading} style={{ width: '100%', marginTop: '1rem', padding: '14px', background: formData.passportVerified ? '#22c55e' : '#8b0000', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '1rem' }}>
                        {formData.passportVerified ? 'Verified ✓' : isPassportLoading ? 'Verifying...' : 'Verify Passport'}
                      </button>
                      {passportError && <p style={{ color: 'red', marginTop: '1rem' }}>{passportError}</p>}
                    </div>
                  )}

                  <div style={{ margin: '2rem 0', height: '1px', background: '#eee' }}></div>

                  <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Mobile Verification</h3>
                    {!otpSent ? (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" inputMode="numeric" maxLength={10} value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))} placeholder="10-digit mobile" disabled={formData.mobileVerified || isOtpLoading} style={{ flex: 1, padding: '14px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }} />
                        <button onClick={handleGenerateOTP} disabled={formData.mobileVerified || !mobileNumber || mobileNumber.length !== 10 || isOtpLoading} style={{ padding: '0 20px', background: '#8b0000', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600' }}>
                          {isOtpLoading ? 'Sending...' : 'Send OTP'}
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" inputMode="numeric" maxLength={6} value={otpInput} onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))} placeholder="Enter OTP" disabled={formData.mobileVerified || isMobileVerifying} style={{ flex: 1, padding: '14px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }} />
                        <button onClick={handleVerifyOTP} disabled={formData.mobileVerified || !otpInput || isMobileVerifying} style={{ padding: '0 20px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600' }}>
                          {isMobileVerifying ? 'Verifying...' : 'Verify OTP'}
                        </button>
                      </div>
                    )}
                    {formData.mobileVerified && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontWeight: '600', marginTop: '10px' }}><CheckCircle size={20} /> Mobile Verified</div>}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Photo Upload</h2>
                  <div onDragOver={(e) => e.preventDefault()} onDrop={handleFileDrop} onClick={() => !isPhotoUploading && fileInputRef.current.click()} style={{ padding: '4rem 2rem', border: '3px dashed #ddd', borderRadius: '12px', textAlign: 'center', cursor: isPhotoUploading ? 'not-allowed' : 'pointer', background: '#f8fafc' }}>
                    {isPhotoUploading ? <><Loader size={56} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#8b0000' }} /><p>Uploading...</p></> : <><UploadCloud size={56} style={{ margin: '0 auto 1rem', color: '#8b0000' }} /><p>Drag and drop your photo here</p><p style={{ color: '#666' }}>or click to browse</p></>}
                  </div>
                  <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept="image/*" />
                  {formData.uploadedPhoto && (
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                      <img src={formData.uploadedPhoto} alt="Preview" style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: '12px', border: '2px solid #22c55e' }} />
                    </div>
                  )}
                </div>
              )}

              {step === 6 && (
                <div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Complete Payment</h2>
                  <div style={{ maxWidth: '500px', margin: '0 auto', padding: '2.5rem', background: '#f8fafc', borderRadius: '12px', textAlign: 'center' }}>
                    <p style={{ fontSize: '1rem', color: '#666', marginBottom: '0.5rem' }}>Final Amount</p>
                    <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#8b0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MdOutlineCurrencyRupee size={40} />{pricing.total.toFixed(2)}</p>
                    <div style={{ marginBottom: '2rem', padding: '1rem', background: 'white', borderRadius: '8px', textAlign: 'left' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Check-in:</span><strong>{formData.checkInDate ? new Date(formData.checkInDate).toLocaleDateString() : '-'}</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Check-out:</span><strong>{formData.checkOutDate ? new Date(formData.checkOutDate).toLocaleDateString() : '-'}</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #e5e5e5', marginBottom: '0.5rem' }}><span>Property:</span><strong>{property.property_name}</strong></div>
                      {pricing.securityDeposit > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #e5e5e5', color: '#0369a1', fontSize: '0.9rem' }}>
                          <span>Security Deposit {pricingMode !== 'monthly' ? '(1 night · Refundable)' : '(Refundable)'}:</span>
                          <strong>₹{pricing.securityDeposit.toLocaleString('en-IN')}</strong>
                        </div>
                      )}
                    </div>
                    <button onClick={handlePayNow} disabled={!isPayNowEnabled || isSubmitting} style={{ width: '100%', padding: '18px', background: isPayNowEnabled && !isSubmitting ? '#8b0000' : '#ccc', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: '700', cursor: isPayNowEnabled && !isSubmitting ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                      {isSubmitting ? <><Loader size={24} className="animate-spin" /> Processing...</> : <>Pay Now <FiShield size={24} /></>}
                    </button>
                    <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#666' }}><FiShield style={{ display: 'inline', verticalAlign: 'middle' }} /> Secure payment by PayU</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pm-footer">
              <button onClick={handlePrev} disabled={step === 1} className={`pm-btn-prev ${step === 1 ? 'pm-btn-prev--disabled' : ''}`}>← Previous</button>
              {step === 3 && bookingType === 1 && pricingMode !== 'monthly' && bookingRequestStatus !== 'accepted' ? (
                <button onClick={() => sendAvailabilityRequest({ checkInDate: formData.checkInDate, checkOutDate: formData.checkOutDate })} disabled={!formData.checkInDate || !formData.checkOutDate || ownerApprovalStatus === 'pending'} className="pm-btn-next">
                  {ownerApprovalStatus === 'pending' ? 'Request Sent' : 'Send Booking Request'}
                </button>
              ) : (
                <button onClick={handleNext} className="pm-btn-next">Next →</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── PAGE CONTENT ────────────────────────────────────────────────────── */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /> Back</button>
        <div className="header-actions">
          <button className="action-btn"><FiShare /> Share</button>
          <button className="action-btn"><FiHeart /> Save</button>
        </div>
      </div>

      <section className="title-section">
        <h1>{property.property_name}</h1>
        <div className="location-row">
          <span>{property.address}, {property.city}</span>
          <span className="dot">•</span>
          <span className="rating"><FiStar className="star" /> New Listing</span>
        </div>
      </section>

      <section className="image-gallery">
        <div className="main-frame" onClick={handleMainImageClick} style={{ cursor: 'pointer', position: 'relative' }}>
          <img src={getPhotoUrl(photos[activeImg]) || 'https://via.placeholder.com/800x500'} alt="Main Property" />
          {property.property_name?.toLowerCase().includes('signature') && (
            <img 
              src="/ovikaver.png" 
              alt="Verified" 
              style={{
                position: 'absolute',
                top: -25,
                left: -25,
                width: 180,
                height: 'auto',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                pointerEvents: 'none',
                zIndex: 20
              }}
            />
          )}
        </div>
        <div className="thumbnail-strip">
          {photos.map((p, idx) => (
            <div key={idx} className={`thumb-item ${activeImg === idx ? 'active' : ''}`} onClick={() => { setActiveImg(idx); handleThumbnailClick(idx); }} style={{ cursor: 'pointer' }}>
              <img src={getPhotoUrl(p)} alt={`Thumb ${idx}`} />
            </div>
          ))}
        </div>
      </section>

      <div className="content-grid">
        <div className="details-column">
          {/* features-bar — uses shared getBedCount/getBathCount helpers */}
          <div className="features-bar">
            <div className="feature-box">
              <BiBed className="f-icon"/>
              <div>
                <strong>{bedCount}</strong>
                <span>{isPG ? 'Room Type' : 'Bedroom'}</span>
              </div>
            </div>
            <div className="feature-box">
              <BiBath className="f-icon"/>
              <div>
                <strong>{bathCount}</strong>
                <span>Bathroom</span>
              </div>
            </div>
            {property.balconies > 0 && <div className="feature-box"><FiWind className="f-icon"/><div><strong>{property.balconies}</strong><span>Balcony</span></div></div>}
            <div className="feature-box"><BiArea className="f-icon"/><div><strong>{property.area || 'N/A'}</strong><span>Sq Ft</span></div></div>
            {property.max_guests > 0 && <div className="feature-box"><FiUser className="f-icon"/><div><strong>{property.max_guests}</strong><span>Guests</span></div></div>}
            {property.facing && <div className="feature-box"><FiCompass className="f-icon"/><div><strong>{property.facing}</strong><span>Facing</span></div></div>}
            {isOvikaOwnProperty && pricingMode !== 'monthly' && (
              <div className="feature-box" style={{ borderLeft: '3px solid #16a34a' }}>
                <FiLock className="f-icon" style={{ color: '#16a34a' }}/>
                <div>
                  <strong style={{ color: '#16a34a' }}>1 night</strong>
                  <span style={{ color: '#16a34a' }}>Deposit</span>
                  <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>Refundable</span>
                </div>
              </div>
            )}
          </div>

          <div className="divider"></div>

          <div className="text-section about-mobile-wrap">
            <h3>About this space</h3>
            <div className="about-mobile-card">
              <p>{cleanDescription(property.description) || "No description provided."}</p>
            </div>
          </div>

          {/* NON-PG ROOM ARRANGEMENTS */}
          {property.parsedBedrooms?.length > 0 && !isPG && (
            <>
              <div className="divider"></div>
              <div className="text-section">
                <div className="rm-section-header">
                  <div className="rm-section-left">
                    <span className="rm-pill">Layout</span>
                    <h3 className="rm-section-title">Room Arrangements</h3>
                    <p style={{ fontSize:'0.82rem', color:'#64748b', margin:'2px 0 0' }}>
                      {showSingleBookRow
                        ? `${property.parsedBedrooms.length} bedroom${property.parsedBedrooms.length > 1 ? 's' : ''} — entire property rented together`
                        : `${property.parsedBedrooms.length} rooms — individually priced, each room bookable separately`}
                    </p>
                  </div>
                  <div className="rm-section-stats">
                    <div className="rm-stat-box">
                      {/* bedroom count — from parsedBedrooms (same source as features-bar) */}
                      <span className="rm-stat-num">{bedCount}</span>
                      <span className="rm-stat-lbl">Bedroom{bedCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="rm-stat-box rm-stat-box--gold">
                      {/* bathroom count — from parsedBathrooms (same source as features-bar) */}
                      <span className="rm-stat-num">{bathCount}</span>
                      <span className="rm-stat-lbl">Bathrooms</span>
                    </div>
                  </div>
                </div>

                {showSingleBookRow && (
                  <>
                    <RoomTableSingle
                      rooms={property.parsedBedrooms}
                      price={displayBasePrice}
                      priceUnit={pricingMode === 'monthly' ? 'month' : 'night'}
                      area={property.area ? `${property.area} sqft` : '—'}
                      availableFrom={property.availableFrom || property.meta?.availableFrom}
                      onBookNow={handleRoomBookNow}
                      showDeposit={!!(isOvikaOwnProperty && pricingMode !== 'monthly')}
                      depositAmount={displayBasePrice}
                    />
                    <RoomTableSingleMobile
                      rooms={property.parsedBedrooms}
                      price={displayBasePrice}
                      priceUnit={pricingMode === 'monthly' ? 'month' : 'night'}
                      availableFrom={property.availableFrom || property.meta?.availableFrom}
                      onBookNow={handleRoomBookNow}
                    />
                  </>
                )}

                {!showSingleBookRow && (
                  <>
                    <RoomTablePerRoom
                      rooms={property.parsedBedrooms}
                      pricingMode={pricingMode}
                      propertyPrice={pricingMode === 'monthly'
                        ? (Number(property.meta?.perMonthPrice) || Number(property.monthly_price) || Number(property.price) || 0)
                        : (Number(property.meta?.perNightPrice) || Number(property.price) || 0)}
                      propertyArea={property.area}
                      onBookNow={handleRoomBookNow}
                    />
                    <RoomTablePerRoomMobile
                      rooms={property.parsedBedrooms}
                      pricingMode={pricingMode}
                      propertyPrice={pricingMode === 'monthly'
                        ? (Number(property.meta?.perMonthPrice) || Number(property.monthly_price) || Number(property.price) || 0)
                        : (Number(property.meta?.perNightPrice) || Number(property.price) || 0)}
                      onBookNow={handleRoomBookNow}
                      showEnquire={false}
                    />
                  </>
                )}
              </div>
            </>
          )}

          {/* S3: PG / HOSTEL — monthly */}
          {property.parsedBedrooms?.length > 0 && isPG && pricingMode === 'monthly' && (
            <>
              <div className="divider"></div>
              <div className="text-section">
                <div className="rm-section-header">
                  <div className="rm-section-left">
                    <span className="rm-pill">Room Inventory</span>
                    <h3 className="rm-section-title">Available Rooms & Rates</h3>
                    <p style={{ fontSize:'0.82rem', color:'#64748b', margin:'2px 0 0' }}>
                      {property.parsedBedrooms.length} room type{property.parsedBedrooms.length > 1 ? 's' : ''} · Starting{' '}
                      <strong>
                        ₹{Math.min(...property.parsedBedrooms.map(r => Number(r.price) || Infinity).filter(p => p < Infinity)).toLocaleString('en-IN')}/month
                      </strong>
                    </p>
                  </div>
                  <div className="rm-section-stats">
                    <div className="rm-stat-box">
                      {/* bedroom count — consistent source */}
                      <span className="rm-stat-num">{bedCount}</span>
                      <span className="rm-stat-lbl">Types</span>
                    </div>
                    <div className="rm-stat-box rm-stat-box--gold">
                      <span className="rm-stat-num" style={{ fontSize:'0.78rem' }}>
                        ₹{Math.min(...property.parsedBedrooms.map(r => Number(r.price) || Infinity).filter(p => p < Infinity)).toLocaleString('en-IN')}
                      </span>
                      <span className="rm-stat-lbl">From</span>
                    </div>
                  </div>
                </div>

                <div className="rm-table-outer">
                  <table className="rm-table">
                    <thead>
                      <tr>
                        <th className="rm-th rm-th--room">Room Type</th>
                        <th className="rm-th">Bathroom</th>
                        <th className="rm-th">Area</th>
                        <th className="rm-th rm-th--price">Price / Month</th>
                        <th className="rm-th">Available</th>
                        <th className="rm-th rm-th--action"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {property.parsedBedrooms.map((room, i) => {
                        const monthlyPrice = Number(room.price) || 0;
                        const isLast = i === property.parsedBedrooms.length - 1;
                        return (
                          <tr key={i} className={`rm-row ${isLast ? 'rm-row--last' : ''}`}>
                            <td className="rm-td rm-td--room">
                              <div className="rm-room-cell">
                                <span className="rm-row-index">{String(i + 1).padStart(2, '0')}</span>
                                <div className="rm-room-info">
                                  <span className="rm-room-name">{room.type || 'Standard Room'}</span>
                                  <div className="rm-room-tags">
                                    {room.bedType   && <span className="rm-tag">{room.bedType}</span>}
                                    {room.ac        && <span className="rm-tag rm-tag--ac">❄ AC</span>}
                                    {room.furnished && <span className="rm-tag">Furnished</span>}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="rm-td"><BathBadge attached={room.attachedBathroom} /></td>
                            <td className="rm-td"><span className="rm-area-val">{room.areaSqFt ? `${room.areaSqFt} sqft` : '—'}</span></td>
                            <td className="rm-td rm-td--price">
                              {monthlyPrice > 0 ? (
                                <div className="rm-price-cell">
                                  <div style={{ display:'flex', alignItems:'baseline', gap:'2px' }}>
                                    <span className="rm-price-main">₹{monthlyPrice.toLocaleString('en-IN')}</span>
                                    <span className="rm-price-unit">/mo</span>
                                  </div>
                                  {room.securityDeposit && (
                                    <div className="rm-deposit">Dep: ₹{Number(room.securityDeposit).toLocaleString('en-IN')}</div>
                                  )}
                                </div>
                              ) : <span className="rm-on-request">On Request</span>}
                            </td>
                            <td className="rm-td"><AvailBadge date={room.availabilityDate} /></td>
                            <td className="rm-td rm-td--cta">
                              <button className="rm-book-btn" onClick={() => handleRoomBookNow(room)}>Book Now</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <RoomTablePerRoomMobile
                  rooms={property.parsedBedrooms}
                  pricingMode="monthly"
                  propertyPrice={0}
                  onBookNow={handleRoomBookNow}
                  onEnquire={null}
                  showEnquire={false}
                />
              </div>
            </>
          )}

          <div className="divider"></div>

          {/* Building & Infrastructure */}
          {(property.waterSupply || property.electricityStatus || property.floorType || property.propertyAge || property.floorNo) && (
            <>
              <div className="text-section">
                <h3>Building & Infrastructure</h3>
                <div className="amenities-grid">
                  {property.floorNo && <div className="amenity-card rule-card"><div className="rule-icon"><Building size={18} color="#64748b" /></div><div className="rule-info"><span className="rule-label">Floor</span><strong>{property.floorNo} {property.totalFloors ? `of ${property.totalFloors}` : ''}</strong></div></div>}
                  {property.waterSupply && <div className="amenity-card rule-card"><div className="rule-icon"><Bus size={18} color="#0ea5e9" /></div><div className="rule-info"><span className="rule-label">Water Supply</span><strong>{property.waterSupply}</strong></div></div>}
                  {property.electricityStatus && <div className="amenity-card rule-card"><div className="rule-icon"><FiZap color="#eab308" /></div><div className="rule-info"><span className="rule-label">Power Status</span><strong>{property.electricityStatus}</strong></div></div>}
                  {property.floorType && <div className="amenity-card rule-card"><div className="rule-icon"><BiArea color="#94a3b8" /></div><div className="rule-info"><span className="rule-label">Flooring</span><strong>{property.floorType}</strong></div></div>}
                  {property.propertyAge && <div className="amenity-card rule-card"><div className="rule-icon"><FiCalendar color="#6366f1" /></div><div className="rule-info"><span className="rule-label">Property Age</span><strong>{property.propertyAge}</strong></div></div>}
                  {property.carParking && <div className="amenity-card rule-card"><div className="rule-icon"><Car size={18} color="#334155" /></div><div className="rule-info"><span className="rule-label">Parking</span><strong>{property.carParking}</strong></div></div>}
                </div>
              </div>
              <div className="divider"></div>
            </>
          )}

          {/* Financials */}
          {(property.securityDeposit || property.maintenanceCharge || property.availableFrom) && (
            <>
              <div className="text-section">
                <h3>Financials & Availability</h3>
                <div className="amenities-grid">
                  {property.securityDeposit && <div className="amenity-card rule-card"><div className="rule-icon"><FiLock color="#8b0000" /></div><div className="rule-info"><span className="rule-label">Security Deposit</span><strong>₹{formatCurrency(property.securityDeposit)}</strong><span style={{ fontSize:'0.72rem', color:'#16a34a', marginTop:'2px', display:'block' }}>Refundable</span></div></div>}
                  {property.maintenanceCharge && <div className="amenity-card rule-card"><div className="rule-icon"><CreditCard size={18} color="#0ea5e9" /></div><div className="rule-info"><span className="rule-label">Maintenance</span><strong>₹{formatCurrency(property.maintenanceCharge)} ({property.maintenanceCycle || 'Monthly'})</strong></div></div>}
                  {property.availableFrom && <div className="amenity-card rule-card"><div className="rule-icon"><FiCalendar color="#16a34a" /></div><div className="rule-info"><span className="rule-label">Available From</span><strong>{new Date(property.availableFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></div></div>}
                </div>
              </div>
              <div className="divider"></div>
            </>
          )}

          {/* Amenities */}
          <div className="text-section">
            <h3>Amenities & Features</h3>
            <div className="amenities-container-premium">
              {Object.entries(groupedAmenities).length > 0 ? (
                Object.entries(groupedAmenities).map(([group, list]) => (
                  <div key={group} className="amenity-group-detail">
                    <h4 className="amenity-group-title">{group}</h4>
                    <div className="amenities-grid">
                      {list.map((am, i) => <div key={i} className="amenity-item"><FiCheck className="check-icon" /> {am}</div>)}
                    </div>
                  </div>
                ))
              ) : <p>No specific amenities listed.</p>}
            </div>
          </div>

          <div className="divider"></div>

          {/* House Rules */}
          <div className="text-section">
            <h3>House Rules & Policies</h3>
            <div className="amenities-grid">
              <div className="amenity-card rule-card"><div className="rule-icon">{(property.smoking_allowed || property.smokingAllowed || property.meta?.smokingAllowed) ? <FiCheck className="text-green" /> : <FiXCircle className="text-red" />}</div><div className="rule-info"><span className="rule-label">Smoking</span><strong>{(property.smoking_allowed || property.smokingAllowed || property.meta?.smokingAllowed) ? 'Allowed' : 'Not allowed'}</strong></div></div>
              <div className="amenity-card rule-card"><div className="rule-icon">{(property.pets_allowed || property.petsAllowed || property.meta?.petsAllowed) ? <FiCheck className="text-green" /> : <FiXCircle className="text-red" />}</div><div className="rule-info"><span className="rule-label">Pets</span><strong>{(property.pets_allowed || property.petsAllowed || property.meta?.petsAllowed) ? 'Allowed' : 'Not allowed'}</strong></div></div>
              <div className="amenity-card rule-card"><div className="rule-icon">{(property.events_allowed || property.eventsAllowed || property.meta?.eventsAllowed) ? <FiCheck className="text-green" /> : <FiXCircle className="text-red" />}</div><div className="rule-info"><span className="rule-label">Events</span><strong>{(property.events_allowed || property.eventsAllowed || property.meta?.eventsAllowed) ? 'Allowed' : 'Not allowed'}</strong></div></div>
              <div className="amenity-card rule-card"><div className="rule-icon">{(property.drinking_allowed || property.drinkingAllowed || property.meta?.drinkingAllowed) ? <FiCheck className="text-green" /> : <FiXCircle className="text-red" />}</div><div className="rule-info"><span className="rule-label">Alcohol</span><strong>{(property.drinking_allowed || property.drinkingAllowed || property.meta?.drinkingAllowed) ? 'Allowed' : 'Not allowed'}</strong></div></div>
              <div className="amenity-card rule-card"><div className="rule-icon">{guestPolicy.family_allowed ? <FiCheck className="text-green" /> : <FiXCircle className="text-red" />}</div><div className="rule-info"><span className="rule-label">Family</span><strong>{guestPolicy.family_allowed ? 'Allowed' : 'Not allowed'}</strong></div></div>
              <div className="amenity-card rule-card"><div className="rule-icon">{guestPolicy.unmarried_couple_allowed ? <FiCheck className="text-green" /> : <FiXCircle className="text-red" />}</div><div className="rule-info"><span className="rule-label">Unmarried Couples</span><strong>{guestPolicy.unmarried_couple_allowed ? 'Allowed' : 'Not allowed'}</strong></div></div>
              <div className="amenity-card rule-card"><div className="rule-icon">{(guestPolicy.bachelors_allowed || guestPolicy.Bechelors) ? <FiCheck className="text-green" /> : <FiXCircle className="text-red" />}</div><div className="rule-info"><span className="rule-label">Bachelor</span><strong>{(guestPolicy.bachelors_allowed || guestPolicy.Bechelors) ? 'Allowed' : 'Not allowed'}</strong></div></div>
              {(property.noticePeriod || property.meta?.noticePeriod) && <div className="amenity-card rule-card"><div className="rule-icon"><FiInfo style={{ color: '#3b82f6' }} /></div><div className="rule-info"><span className="rule-label">Notice Period</span><strong>{property.noticePeriod || property.meta?.noticePeriod} Days</strong></div></div>}
              {(property.electricityCharges || property.meta?.electricityCharges) && <div className="amenity-card rule-card"><div className="rule-icon"><FiZap style={{ color: '#eab308' }} /></div><div className="rule-info"><span className="rule-label">Electricity</span><strong>{property.electricityCharges || property.meta?.electricityCharges}</strong></div></div>}
              {(property.gateClosingTime || property.meta?.gateClosingTime) && <div className="amenity-card rule-card"><div className="rule-icon"><Clock size={18} color="#ef4444" /></div><div className="rule-info"><span className="rule-label">Gate Closing</span><strong>{property.gateClosingTime || property.meta?.gateClosingTime}</strong></div></div>}
            </div>
            {(property.cancellation_policy && property.cancellation_policy !== 'undefined') && (
              <div style={{ marginTop: '1rem', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Cancellation Policy</strong>
                <span style={{ color: '#475569' }}>{property.cancellation_policy} <a href="/refund-cancellation-policy" target="_blank" rel="noopener noreferrer" style={{ marginLeft: '6px', color: '#8b0000', fontWeight: '600' }}>Read full policy</a></span>
              </div>
            )}
          </div>

          {/* Guidebook */}
          {property?.guidebook && (
            <>
              <div className="divider"></div>
              <section className="gbWrap">
                {/* <div className="gbHeader">
                  <div><h3 className="gbTitle">Local Guide</h3><p className="gbSubTitle">Helpful local information for your stay.</p></div>
                </div> */}
                <div className="gbGrid">
                  {property.guidebook?.transport_tips && (
                    <div className="gbCard">
                      <div className="gbCardHeader"><div className="gbIconWrap"><Car size={18} /></div><div className="gbCardHeaderText"><div className="gbCardTitle">Transport</div><div className="gbCardMeta">Getting around nearby</div></div></div>
                      <div className="gbRows">
                        {property.guidebook.transport_tips.metro && <div className="gbRow"><div className="gbRowLeft"><Train size={16} className="gbRowIcon" /><span className="gbRowLabel">Metro</span></div><div className="gbRowValue">{property.guidebook.transport_tips.metro}</div></div>}
                        {property.guidebook.transport_tips.bus && <div className="gbRow"><div className="gbRowLeft"><Bus size={16} className="gbRowIcon" /><span className="gbRowLabel">Bus Stop</span></div><div className="gbRowValue">{property.guidebook.transport_tips.bus}</div></div>}
                      </div>
                    </div>
                  )}
                  {Array.isArray(property.guidebook?.cafes_restaurants) && property.guidebook.cafes_restaurants.length > 0 && (
                    <div className="gbCard gbCardWide">
                      <div className="gbCardHeader"><div className="gbIconWrap"><UtensilsCrossed size={18} /></div><div className="gbCardHeaderText"><div className="gbCardTitle">Cafes & Restaurants</div><div className="gbCardMeta">{property.guidebook.cafes_restaurants.length} nearby</div></div></div>
                      <div className="gbTableWrap">
                        <table className="gbTable">
                          <thead><tr><th>Name</th><th className="gbThRight">Distance</th></tr></thead>
                          <tbody>{property.guidebook.cafes_restaurants.map((item, idx) => <tr key={idx}><td className="gbTdName">{item?.name || '-'}</td><td className="gbTdRight">{item?.distance || item?.distance_m || '-'}</td></tr>)}</tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {property.guidebook?.essentials_nearby && (
                    <div className="gbCard">
                      <div className="gbCardHeader"><div className="gbIconWrap"><ShoppingBasket size={18} /></div><div className="gbCardHeaderText"><div className="gbCardTitle">Essentials Nearby</div><div className="gbCardMeta">Daily needs</div></div></div>
                      <div className="gbRows">
                        {property.guidebook.essentials_nearby.grocery && <div className="gbRow"><div className="gbRowLeft"><ShoppingBasket size={16} className="gbRowIcon" /><span className="gbRowLabel">Grocery</span></div><div className="gbRowValue">{property.guidebook.essentials_nearby.grocery}</div></div>}
                        {property.guidebook.essentials_nearby.medical && <div className="gbRow"><div className="gbRowLeft"><HeartPulse size={16} className="gbRowIcon" /><span className="gbRowLabel">Medical</span></div><div className="gbRowValue">{property.guidebook.essentials_nearby.medical}</div></div>}
                        {property.guidebook.essentials_nearby.shopping && <div className="gbRow"><div className="gbRowLeft"><ShoppingBag size={16} className="gbRowIcon" /><span className="gbRowLabel">Shopping</span></div><div className="gbRowValue">{property.guidebook.essentials_nearby.shopping}</div></div>}
                      </div>
                    </div>
                  )}
                  {Array.isArray(property.guidebook?.house_specific_tips) && property.guidebook.house_specific_tips.length > 0 && (
                    <div className="gbCard gbCardWide">
                      <div className="gbCardHeader"><div className="gbIconWrap"><Lightbulb size={18} /></div><div className="gbCardHeaderText"><div className="gbCardTitle">House Tips</div><div className="gbCardMeta">{property.guidebook.house_specific_tips.length} tips from host</div></div></div>
                      <ul className="gbTips">{property.guidebook.house_specific_tips.map((tip, idx) => <li key={idx} className="gbTip"><span className="gbTipDot" /><span className="gbTipText">{tip}</span></li>)}</ul>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          <div className="divider"></div>

          {/* Booking card */}
          {!(isPG && pricingMode === 'monthly') && (
            <div style={{ margin: '2rem 0' }}>
              <div className="booking-card" style={{ position: 'static', maxWidth: 'none', boxShadow: 'none', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div className="card-header">
                  <div className="price-area">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span className="amount">₹{formatCurrency(displayBasePrice)}</span>
                        <span className="unit">/{pricingMode === 'monthly' ? 'month' : (property.billing_cycle || 'night')}</span>
                      </div>
                      {showDistinctRoomPrices && (
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', marginTop: '2px' }}>
                          {selectedPrice ? `Selected room: ₹${formatCurrency(selectedPrice)}` : 'Select a room above'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="review-badge"><FiStar /> <span>New</span></div>
                </div>

                <div className="booking-details">
                  <div className="date-picker-mock">
                    <div className="date-box">
                      <label>{pricingMode === 'monthly' ? 'CHECK-IN TIME' : 'CHECK-IN'}</label>
                      <span>{formData.checkInDate ? new Date(formData.checkInDate).toLocaleDateString() : (property.check_in_time || 'Select Date')}</span>
                    </div>
                    <div className="date-box">
                      <label>{pricingMode === 'monthly' ? 'NOTICE PERIOD' : 'CHECK-OUT TIME'}</label>
                      <span>{pricingMode === 'monthly' ? (property.property_name?.toLowerCase().includes('signature') ? '0 Days' : `${property.noticePeriod || property.meta?.noticePeriod || 30} Days`) : (property.check_out_time || property.meta?.check_out_time || '11:00')}</span>
                    </div>
                  </div>

                  <div style={{ margin: '1.5rem 0' }}>
                    <button className="reserve-btn" onClick={handleReserveClick}>
                      {bookingType === 1 && pricingMode !== 'monthly' && bookingRequestStatus !== 'accepted' ? 'Send Booking Request' : 'Book Now'}
                    </button>
                    <p className="hint" style={{ marginBottom: '8px' }}>
                      {bookingType === 1 && pricingMode !== 'monthly' && bookingRequestStatus !== 'accepted' ? 'Request needed first' : "You won't be charged yet"}
                    </p>
                    {(property.securityDeposit > 0 || isOvikaOwnProperty) && (
                      <div style={{ display:'flex', alignItems:'center', gap:'5px', padding:'6px 10px', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'6px', fontSize:'0.75rem', color:'#166534' }}>
                        <FiLock size={12} />
                        <span>
                          <strong>Deposit: </strong>
                          {pricingMode === 'monthly'
                            ? (property.securityDeposit > 0 ? `₹${formatCurrency(property.securityDeposit)}` : 'As applicable')
                            : (isOvikaOwnProperty ? `1 night's rent` : `₹${formatCurrency(property.securityDeposit)}`)}
                          {' '}(Refundable)
                        </span>
                      </div>
                    )}
                  </div>

                  {bookingType === 1 && (
                    <div style={{ padding: '10px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '6px', fontSize: '0.8rem', color: '#92400e' }}>
                      {bookingRequestStatus === 'pending' ? (
                        <span>⏳ <strong>Request Pending</strong> — Waiting for owner approval.</span>
                      ) : bookingRequestStatus === 'accepted' ? (
                        <span>✅ <strong>Request Accepted!</strong> — Proceed to book.</span>
                      ) : (
                        <span>⚠️ <strong>Owner approval required</strong> — Send a request first.</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <FiShield className="shield-icon"/>
                  <span>Secure Booking Guaranteed</span>
                </div>
              </div>
            </div>
          )}

          <div className="divider"></div>

          {/* Host Card */}
          <div className="host-card">
            <div className="host-avatar">
              {hostImage ? <img src={hostImage} alt="Host" className="host-img" /> : <UserCircle size={48} className="host-icon-fallback" />}
            </div>
            <div className="host-info">
              <h4>Hosted by {hostUser?.name || 'Loading...'}</h4>
              <p style={{ fontSize: '0.85rem', color: '#777' }}>Property Owner</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;