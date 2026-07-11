

import React, { useState, useEffect, useRef, useContext } from 'react';
import { useStepBackNav } from '../../utils/useStepBackNav';
import * as ort from 'onnxruntime-web';
ort.env.wasm.numThreads = 1;
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PropertyReviews from './Reviews/PropertyReviews';
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
  MapPin as MapPinIcon,
  Camera,
  Wifi,
  Snowflake,
  Droplets,
  BatteryCharging,
  Waves,
  BookOpen,
  Flame,
  Bell,
  DoorOpen,
  Fingerprint,
  Tv,
  Lock,
  Sun,
  Trash2,
  Archive,
  Shirt,
  Cpu,
  Shield,
  ArrowUpDown,
  PhoneCall,
  Home,
  Sofa,
  TreePine,
  Zap,
  Wind,
  Bike,
  AirVent,
  Cigarette,
  PawPrint,
  PartyPopper,
  Wine,
  Users,
  Heart,
  Moon,
  User,
  Utensils,
  UserCheck
} from 'lucide-react';
import { MdCurrencyRupee, MdOutlineCurrencyRupee } from 'react-icons/md';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { format } from 'date-fns';
import './PropertyDetailPage.css';
import { AuthContext } from '../Login/AuthContext';

// ─── AMENITY ICONS MAP ────────────────────────────────────────────────────────
const AMENITY_ICONS = {
  // Safety & Security
  'CCTV': Camera,
  'Security Guard': Shield,
  'Fire Extinguisher': Flame,
  'Intercom': PhoneCall,
  'Biometric Entry': Fingerprint,
  'Gated Community': Shield,
  'Fire Alarm': Bell,
  'Sprinklers': Droplets,
  'Sprinkler': Droplets,
  'Smoke Detectors': Bell,
  'Emergency Exit': DoorOpen,
  'Electronic Entry Lock': Lock,
  'Electronic Bedroom Lock': Lock,
  // Modern Living
  'Lift': ArrowUpDown,
  'Power Backup': BatteryCharging,
  'Wi-Fi': Wifi,
  'Swimming Pool': Waves,
  'Gym': Dumbbell,
  'Clubhouse': Building,
  'Modular Kitchen': UtensilsCrossed,
  'Chimney': AirVent,
  'Central AC': Snowflake,
  'Smart Home Tech': Cpu,
  'EV Charging Point': Zap,
  'Vending Machine': ShoppingBag,
  // Basic Utilities
  'Water Supply 24/7': Droplets,
  'Borewell': Droplets,
  'Corporation Water': Droplets,
  'Gas Pipeline': Flame,
  'Solar Water': Sun,
  'Reserved Parking': ParkingCircle,
  'Visitor Parking': ParkingCircle,
  'STP Plant': Trash2,
  'Waste Management': Trash2,
  // Indoor Features
  'Air Conditioner': Snowflake,
  'Geyser': Droplets,
  'RO Water': Droplets,
  'Washing Machine': Wind,
  'Refrigerator': Archive,
  'Inverter': BatteryCharging,
  'Wardrobe': Archive,
  'Study Table': BookOpen,
  'Smart TV': Tv,
  'Google TV': Tv,
  'Gas Stove': Flame,
  'Dishwasher': Droplets,
  'Microwave': Cpu,
  'Iron & Board': Shirt,
  // Bathroom
  'Bath Towels': Shirt,
  'Soap & Shampoo': Droplets,
  // Other
  'Balcony': Home,
  'Garden': TreePine,
  'Terrace': Home,
  'Sofa': Sofa,
  'Bicycle': Bike,
};

const getAmenityIcon = (name) => {
  const Icon = AMENITY_ICONS[name];
  return Icon
    ? <Icon size={16} style={{ color: '#c98b3e', flexShrink: 0 }} />
    : <Lightbulb size={16} style={{ color: '#c98b3e', flexShrink: 0 }} />;
};

const RULE_ICON_MAP = {
  'Smoking':         Cigarette,
  'Pets':            PawPrint,
  'Events':          PartyPopper,
  'Alcohol':         Wine,
  'Family':          Users,
  'Couples':         Heart,
  'Late Entry':      Moon,
  'Visitors/Friends': Users,
  'Food':            Utensils,
  'Preferred Tenants': UserCheck,
  'Bachelor':        User,
  'Unmarried Couples': Heart,
};

const getRuleIcon = (label, isAllowed) => {
  const Icon = RULE_ICON_MAP[label] || Shield;
  return <Icon size={17} style={{ color: isAllowed ? '#16a34a' : '#dc2626', flexShrink: 0 }} />;
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const getValidPropertyId = (frontendId) => String(frontendId);

const API_BASE_URL = 'https://www.townmanor.ai/api/ovika';
const CALENDAR_API_BASE = 'https://www.townmanor.ai/api/booking/calendar';
const BOOKING_REQUEST_API = 'https://www.townmanor.ai/api/booking-request';
const BLOCKED_DATES_API = import.meta.env.DEV
  ? 'http://localhost:3030/api/ovika/blocked-dates'
  : 'https://townmanor.ai/api/ovika/blocked-dates';

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

// Converts "HH:MM" (24-hour) → "H:MM AM/PM"  e.g. "00:00" → "12:00 AM", "13:30" → "1:30 PM"
const formatTime12h = (time) => {
  if (!time) return '';
  const parts = String(time).split(':');
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1] || '0', 10);
  if (isNaN(h)) return time;
  const period = h < 12 ? 'AM' : 'PM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
};


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
    cover_photo_index: data.cover_photo_index ?? parsedMeta.cover_photo_index ?? 0,
  };

  // ── Bedroom resolution ──────────────────────────────────────────────────────
  const rawBedrooms = parseJsonField(data.bedrooms || parsedMeta.bedrooms);
  const detailedBedrooms = parseJsonField(parsedMeta.bedroomDetails);

  let parsedBedrooms;
  if (detailedBedrooms.length > 0) {
    // Merge areaSqFt from rawBedrooms into detailedBedrooms (rawBedrooms has latest data)
    parsedBedrooms = detailedBedrooms.map((room, idx) => {
      const raw = rawBedrooms[idx];
      return {
        ...room,
        areaSqFt: room.areaSqFt || raw?.areaSqFt || '',
      };
    });
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
    amenities: (() => {
      const fromData = parseJsonField(data.amenities);
      const fromMeta = parseJsonField(parsedMeta.amenities);
      // prefer whichever source has actual items — create form stores in meta only
      return fromData.length > 0 ? fromData : fromMeta;
    })(),
    photos: Array.isArray(data.photos) ? data.photos : (data.photos ? [data.photos] : []),
    parsedBedrooms,
    parsedBathrooms: parseJsonField(data.bathrooms || parsedMeta.bathrooms),
    guidebook: (() => {
      const raw = combined.guidebook || parsedMeta.guidebook || null;
      if (!raw) return null;
      if (typeof raw === 'string') { try { return JSON.parse(raw); } catch { return null; } }
      return raw;
    })(),
    guest_policy: (() => {
      const raw = combined.guest_policy || parsedMeta.guest_policy || {};
      if (typeof raw === 'string') { try { return JSON.parse(raw); } catch { return {}; } }
      return raw;
    })()
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
    for (let d = new Date(start); toYMD(d) <= toYMD(end); d = addDays(d, 1)) {
      set.add(toYMD(d));
    }
  });
  return set;
}

async function getCalendar(propertyKey, propertyId) {
  const blocked = [];

  // 1. Manually blocked dates from admin API
  try {
    const res = await fetch(`${BLOCKED_DATES_API}?property_id=${propertyId}`);
    if (res.ok) {
      const data = await res.json();
      const dates = data.dates || data.blocked_dates || data.data || [];
      if (Array.isArray(dates)) {
        localStorage.setItem(`ovika_blocked_${propertyId}`, JSON.stringify(dates));
        dates.forEach(d => blocked.push({ start: d, end: d }));
      }
    }
  } catch {}

  // 2. Confirmed/paid bookings — block their date ranges on the calendar
  try {
    const res = await fetch(`${BOOKING_REQUEST_API}?property_id=${propertyId}`);
    if (res.ok) {
      const data = await res.json();
      const bookings = Array.isArray(data) ? data : (data.data || data.bookings || []);
      bookings.forEach(b => {
        const confirmed =
          b.payment_status === 'paid' ||
          b.booking_status === 'confirmed' ||
          b.status === 'confirmed' ||
          b.status === 'paid';
        if (confirmed && b.start_date && b.end_date &&
            String(b.property_id) === String(propertyId)) {
          blocked.push({ start: b.start_date.split('T')[0], end: b.end_date.split('T')[0] });
        }
      });
    }
  } catch {}

  // 3. Fallback: localStorage cache (only when both APIs are unreachable)
  if (blocked.length === 0) {
    try {
      const raw = localStorage.getItem(`ovika_blocked_${propertyId}`);
      if (raw) {
        const dates = JSON.parse(raw);
        if (Array.isArray(dates)) dates.forEach(d => blocked.push({ start: d, end: d }));
      }
    } catch {}
  }

  return { blocked };
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
const RoomTableSingle = ({ rooms, price, priceUnit, area, availableFrom, onBookNow, showDeposit, depositAmount, showMonthlyDeposit }) => {
  const rowCount = rooms.length;
  return (
    <div className="rm-table-outer">
      <table className="rm-table" style={{ tableLayout:'fixed', width:'100%' }}>
        <colgroup>
          <col style={{ width:'32%' }}/>
          <col style={{ width:'14%' }}/>
          <col style={{ width:'12%' }}/>
          <col style={{ width:'22%' }}/>
          <col style={{ width:'10%' }}/>
          <col style={{ width:'10%' }}/>
        </colgroup>
        <thead>
          <tr>
            <th className="rm-th rm-th--room">Room</th>
            <th className="rm-th rm-col--bath">Bathroom</th>
            <th className="rm-th rm-col--area">Area</th>
            <th className="rm-th rm-th--price">Price / {priceUnit}</th>
            <th className="rm-th rm-col--avail">Available</th>
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
                    <div className="rm-room-icon" style={{ width:32, height:24, flexShrink:0, background:'#f1f5f9', borderRadius:4, border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', marginTop:2 }}>
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
                        {!room.bedType && !room.ac && !room.furnished && <RoomBadge>Standard</RoomBadge>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="rm-td rm-col--bath">
                  <BathBadge attached={room.attachedBathroom} />
                </td>
                <td className="rm-td rm-col--area">
                  <span className="rm-area-val">{room.areaSqFt ? `${room.areaSqFt} sqft` : (area || '—')}</span>
                </td>
                {isFirst && (
                  <td className="rm-td rm-td--price" rowSpan={rowCount} style={{ verticalAlign:'middle' }}>
                    <PriceCell price={price} unit={priceUnit} />
                    {showMonthlyDeposit && (
                      <div style={{ marginTop:'5px', fontSize:'0.69rem', lineHeight:'1.4', color:'#8b0000', fontWeight:'600' }}>
                        +₹{formatCurrency(price)} Deposit
                        <span style={{ display:'block', background:'#dcfce7', color:'#166534', padding:'1px 6px', borderRadius:'20px', fontSize:'0.64rem', fontWeight:'600', marginTop:'2px', width:'fit-content' }}>1 Month · Refundable</span>
                      </div>
                    )}
                    {showDeposit && depositAmount && (
                      <div style={{ marginTop:'5px', fontSize:'0.69rem', lineHeight:'1.4', color:'#8b0000', fontWeight:'600' }}>
                        +₹{formatCurrency(depositAmount)} Deposit
                        <span style={{ display:'block', background:'#dcfce7', color:'#166534', padding:'1px 6px', borderRadius:'20px', fontSize:'0.64rem', fontWeight:'600', marginTop:'2px', width:'fit-content' }}>1 Night · Refundable</span>
                      </div>
                    )}
                  </td>
                )}
                {isFirst && (
                  <td className="rm-td rm-col--avail" rowSpan={rowCount} style={{ verticalAlign:'middle' }}>
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
            const nightlyP = Number(room.price) || Number(propertyPrice) || 0;
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
                        {!room.bedType && !room.ac && !room.furnished && <span className="rm-tag">Standard</span>}
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

const RoomTablePerRoomMobile = ({ rooms, pricingMode, propertyPrice, onBookNow, onEnquire, showEnquire, hideDeposit }) => {
  const priceUnit = pricingMode === 'monthly' ? 'month' : 'night';
  return (
    <div className="rm-mob-wrap">
      {rooms.map((room, i) => {
        const nightlyP = Number(room.price) || Number(propertyPrice) || 0;
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
                {!hideDeposit && room.securityDeposit && (
                  <span className="rm-mob-deposit">Security Deposit: ₹{Number(room.securityDeposit).toLocaleString('en-IN')}</span>
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
    </div>
  );
};

// ─── PHOTO GALLERY SLIDER  (ONNX — mirrors ImageClassificationModal) ──────────
// Display group maps — gaming removed (merged into living)
const GALLERY_COLORS  = { bathroom:'#3b82f6', bedroom:'#8b5cf6', kitchen:'#22c55e', living:'#14b8a6', terrace:'#eab308', yard:'#84cc16' };
const GALLERY_ICONS   = { bathroom:'🚿', bedroom:'🛏️', kitchen:'🍳', living:'🛋️', terrace:'🌇', yard:'🌿' };
const GALLERY_LABELS  = { bathroom:'Bathroom', bedroom:'Bedroom', kitchen:'Kitchen & Dining', living:'Living Room', terrace:'Terrace', yard:'Yard / Garden' };

// Default meta matches the current bestmodel.onnx (MobileNetV3).
// After export_vit_to_onnx.py is run → /public/model_meta.json overrides at runtime.
const GALLERY_DEFAULT_META = {
  classes:    ['bathroom','bedroom','dining','gaming','kitchen','laundry','living','office','terrace','yard'],
  image_mean: [0.485, 0.456, 0.406],
  image_std:  [0.229, 0.224, 0.225],
  input_key:  'input',
};

// Semantic merge groups: probabilities of these classes are pooled into the target key
// before the winner is picked — eliminates confusion between visually similar classes
const GALLERY_POOL = {
  kitchen: ['kitchen', 'dining'],   // dining photos always go to Kitchen & Dining
  living:  ['living',  'gaming'],   // gaming room looks like living room → merge
};

// Display order (gaming excluded — pooled into living)
const GALLERY_DISPLAY_ORDER = ['bedroom','bathroom','living','kitchen','terrace','yard'];

// Thresholds:
//  STRONG  — 2 out of 3 centered crops agree  → only need 33% avg confidence
//  WEAK    — crops disagree                    → need 42% avg confidence
//  ALWAYS  — if any single crop scores ≥ this, that class is locked in regardless
const GALLERY_THRESH_STRONG = 0.33;
const GALLERY_THRESH_WEAK   = 0.42;
const GALLERY_THRESH_LOCK   = 0.65; // single-crop lock-in (very high confidence)

// ── softmax ────────────────────────────────────────────────────────────────────
function gallerySoftmax(arr) {
  const max  = Math.max(...arr);
  const exps = arr.map(v => Math.exp(v - max));
  const sum  = exps.reduce((a, b) => a + b, 0);
  return exps.map(v => v / sum);
}

// ── Load image via fetch→blob to avoid browser-cache CORS taint ───────────────
async function galleryLoadImage(url) {
  try {
    const resp   = await fetch(url, { cache: 'no-store' });
    const blob   = await resp.blob();
    const objUrl = URL.createObjectURL(blob);
    return await new Promise((res, rej) => {
      const img = new Image();
      img.onload  = () => { URL.revokeObjectURL(objUrl); res(img); };
      img.onerror = () => { URL.revokeObjectURL(objUrl); rej(new Error('load')); };
      img.src = objUrl;
    });
  } catch { /* fall through */ }
  try {
    const bust = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
    return await new Promise((res, rej) => {
      const img = new Image(); img.crossOrigin = 'anonymous';
      img.onload = () => res(img); img.onerror = rej; img.src = bust;
    });
  } catch { /* fall through */ }
  return new Promise((res, rej) => {
    const img = new Image(); img.crossOrigin = 'anonymous';
    img.onload = () => res(img); img.onerror = rej; img.src = url;
  });
}

// ── Build tensor from a crop region ───────────────────────────────────────────
function galleryBuildCropTensor(img, cropX, cropY, cropW, cropH, mean, std) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 224;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, 224, 224);
  const { data } = ctx.getImageData(0, 0, 224, 224);
  const tensor = new Float32Array(3 * 224 * 224);
  for (let i = 0; i < 224 * 224; i++) {
    tensor[i]             = (data[i*4]   / 255 - mean[0]) / std[0];
    tensor[224*224 + i]   = (data[i*4+1] / 255 - mean[1]) / std[1];
    tensor[224*224*2 + i] = (data[i*4+2] / 255 - mean[2]) / std[2];
  }
  return tensor;
}

// ── Apply semantic pooling on a probs array (mutates in place) ────────────────
function galleryApplyPooling(avgProbs, classes) {
  for (const [primaryKey, memberKeys] of Object.entries(GALLERY_POOL)) {
    const pi = classes.indexOf(primaryKey);
    if (pi < 0) continue;
    for (const mk of memberKeys) {
      if (mk === primaryKey) continue;
      const mi = classes.indexOf(mk);
      if (mi >= 0) { avgProbs[pi] += avgProbs[mi]; avgProbs[mi] = 0; }
    }
  }
  ['laundry','office'].forEach(cls => { const i = classes.indexOf(cls); if (i >= 0) avgProbs[i] = 0; });
}

// ── Classification engine ──────────────────────────────────────────────────────
//
//  Strategy: 3 centered crops (full → 90% center → 80% center), weighted average,
//  adaptive threshold based on crop agreement.
//
//  WHY centered only (no corners):
//  Property photos are wide-angle. Corner crops show wall/ceiling/floor with zero
//  room-specific features. Running 5 crops including corners drags a 52% bedroom
//  confidence down to ~30% → wrong "Others". All 3 crops here stay focused on the
//  main room content, giving consistent signals.
//
//  WHY adaptive threshold:
//  If 2+ crops independently vote the same top class → strong signal → threshold 0.33.
//  If crops disagree → uncertain image → require 0.42 to avoid wrong hard calls.
//  If any single crop scores ≥ 0.65 → lock it in regardless (very clear image).
//
async function galleryClassifyOne(session, url, meta) {
  const { classes, image_mean, image_std, input_key } = meta;

  // ── Step 1: Load image once ──────────────────────────────────────────────
  const img = await galleryLoadImage(url);
  const W = img.naturalWidth || img.width;
  const H = img.naturalHeight || img.height;

  // ── Step 2: 3 centered crops with decreasing size + weights ─────────────
  //  Crop 0: full image           weight 0.50  (most context)
  //  Crop 1: 90% center square    weight 0.30  (removes thin border noise)
  //  Crop 2: 80% center square    weight 0.20  (focuses on main subject)
  const cropDefs = [
    { r: 1.00, w: 0.50 },
    { r: 0.90, w: 0.30 },
    { r: 0.80, w: 0.20 },
  ];

  // ── Step 3: Run inference on all 3 crops ────────────────────────────────
  const cropResults = []; // { probs, top1 }
  for (const { r, w } of cropDefs) {
    const cw   = Math.floor(W * r), ch = Math.floor(H * r);
    const cx   = Math.floor((W - cw) / 2), cy = Math.floor((H - ch) / 2);
    const td   = galleryBuildCropTensor(img, cx, cy, cw, ch, image_mean, image_std);
    const t    = new ort.Tensor('float32', td, [1, 3, 224, 224]);
    const out  = await session.run({ [input_key]: t });
    const prob = gallerySoftmax(Array.from(Object.values(out)[0].data));
    // Apply pooling per-crop before voting so dining/gaming are merged correctly
    const pooled = [...prob];
    galleryApplyPooling(pooled, classes);
    ['laundry','office'].forEach(cls => { const i = classes.indexOf(cls); if (i >= 0) pooled[i] = 0; });
    const top1 = classes[pooled.indexOf(Math.max(...pooled))];
    cropResults.push({ probs: prob, pooledProbs: pooled, top1, weight: w });
  }

  // ── Step 4: Weighted average of raw probs, then apply pooling once ───────
  const avgProbs = new Array(classes.length).fill(0);
  for (const { probs, weight } of cropResults) {
    for (let i = 0; i < classes.length; i++) avgProbs[i] += probs[i] * weight;
  }
  galleryApplyPooling(avgProbs, classes);

  // ── Step 5: Count votes (how many crops agree on the same top class) ─────
  const voteCounts = {};
  for (const { top1 } of cropResults) voteCounts[top1] = (voteCounts[top1] || 0) + 1;

  // ── Step 6: Pick winner from weighted-averaged pooled probs ──────────────
  const sorted = avgProbs
    .map((p, i) => ({ label: classes[i], confidence: p }))
    .filter(x => x.confidence > 0)
    .sort((a, b) => b.confidence - a.confidence);

  if (!sorted.length) return { label: '_other', confidence: 0, top3: [] };

  const winner = sorted[0];
  const votes  = voteCounts[winner.label] || 0;

  // Lock-in: any single crop gave ≥ 65% for this class → trust it
  const maxSingleCropConf = Math.max(...cropResults.map(c => c.pooledProbs[classes.indexOf(winner.label)] || 0));
  if (maxSingleCropConf >= GALLERY_THRESH_LOCK) {
    return { label: winner.label, confidence: winner.confidence, top3: sorted.slice(0, 3) };
  }

  // Adaptive threshold based on how many crops agree
  const threshold = votes >= 2 ? GALLERY_THRESH_STRONG : GALLERY_THRESH_WEAK;
  if (winner.confidence < threshold) {
    return { label: '_other', confidence: winner.confidence, top3: sorted.slice(0, 3) };
  }

  return { label: winner.label, confidence: winner.confidence, top3: sorted.slice(0, 3) };
}

const PhotoGallerySlider = ({ property, onClose }) => {
  const [results,     setResults]     = useState({});
  const [photos,      setPhotos]      = useState([]);
  const [done,        setDone]        = useState(0);
  const [modelStatus, setModelStatus] = useState('loading');
  const [activeTab,   setActiveTab]   = useState('all');
  const [lightbox,    setLightbox]    = useState({ open: false, urls: [], idx: 0 });
  const [visible,     setVisible]     = useState(false);
  const sessionRef  = useRef(null);
  const metaRef     = useRef(GALLERY_DEFAULT_META);
  const closingRef  = useRef(false);

  // Slide up on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Push history state so browser/Android back button closes slider instead of navigating away
  useEffect(() => {
    window.history.pushState({ photoGallery: true }, '');
    const onPopState = () => {
      if (!closingRef.current) {
        closingRef.current = true;
        setVisible(false);
        setTimeout(onClose, 300);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (lightbox.open) { setLightbox(l => ({ ...l, open: false })); return; }
        handleClose();
      }
      if (lightbox.open) {
        if (e.key === 'ArrowRight') setLightbox(l => ({ ...l, idx: Math.min(l.idx + 1, l.urls.length - 1) }));
        if (e.key === 'ArrowLeft')  setLightbox(l => ({ ...l, idx: Math.max(l.idx - 1, 0) }));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  // ── Load model_meta.json + ONNX model ────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setModelStatus('loading');

        // Load model_meta.json (generated by export_vit_to_onnx.py)
        try {
          const metaRes = await fetch('/model_meta.json');
          if (metaRes.ok) metaRef.current = await metaRes.json();
        } catch {
          console.warn('model_meta.json not found, using default ViT meta');
        }

        sessionRef.current = await ort.InferenceSession.create('/bestmodel.onnx', {
          executionProviders: ['wasm'],
        });
        setModelStatus('ready');
      } catch (e) {
        console.error('ONNX model load failed:', e);
        setModelStatus('error');
      }
    })();
  }, []);

  // ── Start classifying once model is ready ────────────────────────────────
  useEffect(() => {
    if (modelStatus !== 'ready') return;

    let list = [];
    if (Array.isArray(property.photos)) list = property.photos;
    else if (typeof property.photos === 'string') {
      try { list = JSON.parse(property.photos); }
      catch { list = property.photos.split(','); }
    }
    list = list.map(p => (typeof p === 'string' ? p.trim() : '')).filter(Boolean);

    setPhotos(list);
    setDone(0);
    setActiveTab('all');

    const initial = {};
    list.forEach(url => { initial[url] = { loading: true }; });
    setResults(initial);

    let completed = 0;
    list.forEach(async (url) => {
      try {
        const res = await galleryClassifyOne(sessionRef.current, url, metaRef.current);
        setResults(prev => ({ ...prev, [url]: { ...res, loading: false } }));
      } catch (e) {
        console.warn('classify failed for', url, e);
        setResults(prev => ({ ...prev, [url]: { error: true, loading: false } }));
      }
      completed++;
      setDone(completed);
    });
  }, [modelStatus, property]);

  const handleClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setVisible(false);
    window.history.back(); // pop the state we pushed on mount
    setTimeout(onClose, 300);
  };

  // Build groups — classifier already handles pooling; just bucket by label
  const grouped = {};
  photos.forEach(url => {
    const r = results[url];
    if (!r || r.loading) return;
    const lbl = r.error ? '_other' : (r.label || '_other');
    if (!grouped[lbl]) grouped[lbl] = [];
    grouped[lbl].push(url);
  });

  const classifying = done < photos.length;
  const knownGroups = GALLERY_DISPLAY_ORDER.filter(g => grouped[g]?.length > 0);
  const otherPhotos   = grouped['_other'] || [];
  const displayGroups = activeTab === 'all' ? knownGroups : (knownGroups.includes(activeTab) ? [activeTab] : []);

  const openLightbox = (url, urlList) => setLightbox({ open: true, urls: urlList, idx: urlList.indexOf(url) });

  return (
    <div
      className="pgs-overlay"
      style={{ transform: visible ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.3s cubic-bezier(0.32,0.72,0,1)' }}
    >
      {/* ── Close Button (top-right) ── */}
      <button className="pgs-close-btn" onClick={handleClose}>✕</button>

      {/* ── Header ── */}
      <div className="pgs-header">
        <div>
          <div className="pgs-title">All Photos</div>
          <div className="pgs-sub">
            {property.property_name} &nbsp;·&nbsp; {photos.length} photos
            {modelStatus === 'loading' && <span className="pgs-badge pgs-badge--load">⏳ Loading AI model...</span>}
            {modelStatus === 'error'   && <span className="pgs-badge pgs-badge--err">⚠ Model unavailable</span>}
            {modelStatus === 'ready' && classifying  && <span className="pgs-badge pgs-badge--prog">{done}/{photos.length} classified</span>}
            {modelStatus === 'ready' && !classifying && photos.length > 0 && <span className="pgs-badge pgs-badge--done">✓ Done</span>}
          </div>
        </div>
      </div>

      {/* ── Progress bar ── */}
      {modelStatus === 'ready' && classifying && (
        <div className="pgs-progress-track">
          <div className="pgs-progress-fill" style={{ width: `${photos.length ? (done/photos.length)*100 : 0}%` }} />
        </div>
      )}

      {/* ── Category Tabs (after classification done) ── */}
      {modelStatus === 'ready' && !classifying && knownGroups.length > 0 && (
        <div className="pgs-tabs">
          <button className={`pgs-tab${activeTab==='all'?' pgs-tab--active':''}`} onClick={() => setActiveTab('all')}>
            All ({photos.length - otherPhotos.length})
          </button>
          {knownGroups.map(g => (
            <button
              key={g}
              className={`pgs-tab${activeTab===g?' pgs-tab--active':''}`}
              onClick={() => setActiveTab(g)}
            >
              <img src={getPhotoUrl(grouped[g][0])} className="pgs-tab-thumb" alt={`${GALLERY_LABELS[g] || g} photo thumbnail`} />
              {GALLERY_ICONS[g]} {GALLERY_LABELS[g]} ({grouped[g].length})
            </button>
          ))}
        </div>
      )}

      {/* ── Body ── */}
      <div className="pgs-body">

        {/* Connecting */}
        {modelStatus === 'loading' && (
          <div className="pgs-loading-state">
            <div className="pgs-spinner" />
            <p>Loading AI model (first time may take a moment)...</p>
          </div>
        )}

        {modelStatus === 'error' && (
          <div className="pgs-loading-state">
            <div style={{ fontSize: 32 }}>⚠️</div>
            <p style={{ color: '#ef4444', fontWeight: 600 }}>AI model could not be loaded</p>
            <p style={{ color: '#64748b', fontSize: 13 }}>Make sure <code>bestmodel.onnx</code> is in the <code>/public</code> folder.</p>
          </div>
        )}

        {modelStatus === 'ready' && classifying && (
          <div className="pgs-section">
            <div className="pgs-section-hdr">
              <span className="pgs-section-name">All Images</span>
              <span className="pgs-section-cnt">{photos.length}</span>
            </div>
            <div className="pgs-grid">
              {photos.map((url, i) => {
                const r = results[url];
                return (
                  <div key={i} className="pgs-card" onClick={() => openLightbox(url, photos)}>
                    <img src={getPhotoUrl(url)} alt={`Property photo ${i + 1}${r && r.label && r.label !== '_other' ? ` — ${GALLERY_LABELS[r.label] || r.label}` : ''}`} loading="lazy" />
                    <div className="pgs-card-tag pgs-card-tag--classifying">
                      {!r || r.loading ? '⏳ Classifying...'
                        : (r.error || r.label === '_other') ? '📦 Other'
                        : `${GALLERY_ICONS[r.label] || '📷'} ${GALLERY_LABELS[r.label] || r.label}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* After classification — grouped sections */}
        {modelStatus === 'ready' && !classifying && (
          <>
            {displayGroups.map(group => (
              <div key={group} className="pgs-section">
                <div className="pgs-section-hdr">
                  <span className="pgs-section-name">{GALLERY_ICONS[group]} {GALLERY_LABELS[group]}</span>
                  <span className="pgs-section-cnt">{grouped[group].length}</span>
                </div>
                <div className="pgs-grid">
                  {grouped[group].map((url, i) => (
                    <div key={i} className="pgs-card"
                      onClick={() => openLightbox(url, grouped[group])}>
                      <img src={getPhotoUrl(url)} alt={GALLERY_LABELS[group]} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Other / unclassified */}
            {activeTab === 'all' && otherPhotos.length > 0 && (
              <div className="pgs-section">
                <div className="pgs-section-hdr">
                  <span className="pgs-section-name">📦 Others</span>
                  <span className="pgs-section-cnt">{otherPhotos.length}</span>
                </div>
                <div className="pgs-grid">
                  {otherPhotos.map((url, i) => (
                    <div key={i} className="pgs-card pgs-card--other" onClick={() => openLightbox(url, otherPhotos)}>
                      <img src={getPhotoUrl(url)} alt="Other" loading="lazy" />
                      <div className="pgs-card-tag pgs-card-tag--other">Other</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightbox.open && (
        <div className="pgs-lightbox" onClick={() => setLightbox(l => ({ ...l, open: false }))}>
          <button className="pgs-lb-close" onClick={() => setLightbox(l => ({ ...l, open: false }))}>✕</button>
          {lightbox.idx > 0 && (
            <button className="pgs-lb-nav pgs-lb-prev"
              onClick={e => { e.stopPropagation(); setLightbox(l => ({ ...l, idx: l.idx - 1 })); }}>‹</button>
          )}
          <img src={getPhotoUrl(lightbox.urls[lightbox.idx])} alt={`Property photo ${lightbox.idx + 1}`} onClick={e => e.stopPropagation()} />
          {lightbox.idx < lightbox.urls.length - 1 && (
            <button className="pgs-lb-nav pgs-lb-next"
              onClick={e => { e.stopPropagation(); setLightbox(l => ({ ...l, idx: l.idx + 1 })); }}>›</button>
          )}
          <div className="pgs-lb-counter">{lightbox.idx + 1} / {lightbox.urls.length}</div>
        </div>
      )}
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
      for (let d = new Date(start); toYMD(d) <= toYMD(end); d.setDate(d.getDate() + 1)) {
        if (disabledDateSet.has(toYMD(d))) return true;
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
  const [showMapModal, setShowMapModal] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [viewerImageIndex, setViewerImageIndex] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelledNotice, setShowCancelledNotice] = useState(false);
  const [showTaxInfo, setShowTaxInfo] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    checkInDate: '', checkOutDate: '',
    aadhaarVerified: false, passportVerified: false, mobileVerified: false,
    uploadedPhoto: '', termsAgreed: false,
  });
  const [bookingFor, setBookingFor] = useState('me');
  const [guestDetails, setGuestDetails] = useState({ name: '', address: '', phone: '' });
  const [numGuests, setNumGuests] = useState(1);
  const [descExpanded, setDescExpanded] = useState(false);
  const [amenitiesExpanded, setAmenitiesExpanded] = useState(false);
  const [guidebookExpanded, setGuidebookExpanded] = useState(false);
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
  const [pricing, setPricing] = useState({ subtotal: 0, discount: 0, discountPercentage: 0, gst: 0, total: 0, daysNeededForNextTier: 0, nextTierPercentage: 0, couponDiscount: 0 });
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
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const prevBody = document.body.style.backgroundColor;
    const prevHtml = document.documentElement.style.backgroundColor;
    document.body.style.backgroundColor = '#fff';
    document.documentElement.style.backgroundColor = '#fff';
    return () => {
      document.body.style.backgroundColor = prevBody;
      document.documentElement.style.backgroundColor = prevHtml;
    };
  }, []);

  // Scroll lock when any modal is open
  useEffect(() => {
    const anyOpen = !!(showImageViewer || showPaymentModal || showLeadModal || showPhotoGallery);
    document.body.style.overflow = anyOpen ? 'hidden' : '';
    document.documentElement.style.overflow = anyOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; document.documentElement.style.overflow = ''; };
  }, [showImageViewer, showPaymentModal, showLeadModal, showPhotoGallery]);
  const [calendarViewMonth, setCalendarViewMonth] = useState(new Date());
  const [monthlyDuration, setMonthlyDuration] = useState(1);
  const [monthPickerYear, setMonthPickerYear] = useState(new Date().getFullYear());
  const [bookingRequestStatus, setBookingRequestStatus] = useState(null);
  const [userBookingRequests, setUserBookingRequests] = useState([]);
  const [passportFile, setPassportFile] = useState(null);
  const [isPassportLoading, setIsPassportLoading] = useState(false);
  const [passportError, setPassportError] = useState('');
  const [passportInput, setPassportInput] = useState('');
  const [govIdType, setGovIdType] = useState('');
  const [govIdPreview, setGovIdPreview] = useState('');
  const [govIdStatus, setGovIdStatus] = useState('idle'); // idle | scanning | valid | invalid | manual
  const [govIdError, setGovIdError] = useState('');
  const [govIdDetectedType, setGovIdDetectedType] = useState('');
  const govIdInputRef = useRef(null);
  const govIdPendingFileRef = useRef(null);
  const [bookingType, setBookingType] = useState(0);
  const [ownerApprovalStatus, setOwnerApprovalStatus] = useState(null);
  const [acceptedBookingId, setAcceptedBookingId] = useState(null);
  const [pricingMode, setPricingMode] = useState('daily');
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [rentalType, setRentalType] = useState(() => sessionStorage.getItem('ovika_rental_type') || 'short');
  const [couponInput, setCouponInput] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

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
    "Safety & Security": ["CCTV", "Security Guard", "Fire Extinguisher", "Intercom", "Biometric Entry", "Gated Community", "Fire Alarm", "Sprinklers", "Sprinkler", "Smoke Detectors", "Smoke detector", "Emergency Exit", "Carbon monoxide detector", "First aid kit", "Electronic Entry Lock", "Electronic Bedroom Lock"],
    "Modern Living": ["Lift", "Power Backup", "Wi-Fi", "Swimming Pool", "Pool", "Hot tub", "Sauna", "Gym", "Clubhouse", "Club House", "Modular Kitchen", "Chimney", "Central AC", "Air conditioning", "Air Conditioner", "Smart Home Tech", "EV Charging Point", "Heating"],
    "Basic Utilities": ["Water Supply 24/7", "Borewell", "Corporation Water", "Gas Pipeline", "Solar Water", "Reserved Parking", "Visitor Parking", "STP Plant", "Waste Management", "Parking space", "Hot water"],
    "Kitchen": ["Refrigerator", "Gas Stove", "Stovetop/oven", "Microwave", "Cooking utensils", "Electric Kettle", "Hob", "RO", "RO Water", "Toaster", "Rice Cooker", "Coffee Maker", "Induction Cooktop", "Dining Counter", "Dishwasher"],
    "Indoor Features": ["Geyser", "Washing Machine", "Iron & Board", "Inverter", "Wardrobe", "Study Table", "TV", "Smart TV", "Google TV", "Streaming services"],
    "Bathroom": ["Bath Towels", "Soap & Shampoo"],
    "Outer Spaces": ["Balcony", "Balcony/terrace", "Private Terrace", "Garden", "Park Area", "Pet Area", "Kids Play Area", "Jogging Track", "BBQ grill", "Tennis Court", "Golf Course"],
    "Accessibility": ["Wheelchair accessible", "Elevator", "Ramp access"]
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
          const coverIdx = Number(transformed.cover_photo_index);
          if (!isNaN(coverIdx) && coverIdx > 0 && Array.isArray(transformed.photos) && coverIdx < transformed.photos.length) {
            const reordered = [...transformed.photos];
            const [coverPhoto] = reordered.splice(coverIdx, 1);
            reordered.unshift(coverPhoto);
            transformed.photos = reordered;
          }
          setProperty(transformed);
          setActiveImg(0);
          setBookingType(Number(transformed.booking_type || 0));
          // Priority: URL param (shareable) > sessionStorage (list page nav) > property field
          const urlParam = new URLSearchParams(location.search).get('rentalType');
          const storedRentalType = sessionStorage.getItem('ovika_rental_type') || 'short';
          const propertyRentalType = transformed.rental_type;
          const isMonthlyProperty = urlParam === 'long' || storedRentalType === 'long' || propertyRentalType === 'long';
          setPricingMode(isMonthlyProperty ? 'monthly' : 'daily');
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
      const isMonthlyOvika = [315, 316, 317, 323].includes(Number(property?.id));
      const oneMonthRent = isMonthlyBooking && isMonthlyOvika
        ? (selectedPrice || Number(property?.meta?.perMonthPrice) || Number(property?.meta?.monthlyPrice) || Number(property?.monthly_price) || Number(property?.price) || 0)
        : 0;
      const isNightlyOffer = [77, 78, 79, 80, 81].includes(Number(property?.id));
      const couponDiscount = (isNightlyOffer && couponApplied) ? 500 * Math.max(1, currentDays) : 0;
      const afterCoupon = Math.max(0, afterDiscount - couponDiscount);
      const gst = isMonthlyBooking ? 0 : afterCoupon * 0.05;
      const securityDeposit = isMonthlyBooking
        ? (oneMonthRent > 0 ? oneMonthRent : Number(property?.securityDeposit) || 0)
        : (!isMonthlyBooking && isOvikaProperty && !isNightlyOffer ? perNightPrice : 0);
      computedTotal = afterCoupon + gst + securityDeposit;
      setPricing({ subtotal, discount: discountAmount, discountPercentage, gst, securityDeposit, total: computedTotal, daysNeededForNextTier, nextTierPercentage, couponDiscount });
    } else {
      setPricing({ subtotal: 0, discount: 0, discountPercentage: 0, gst: 0, securityDeposit: 0, total: 0, daysNeededForNextTier: 0, nextTierPercentage: 0, couponDiscount: 0 });
    }
  }, [formData.checkInDate, formData.checkOutDate, property, pricingMode, selectedPrice, monthlyDuration, couponApplied]);

  useEffect(() => {
    const isNightlyOffer = [77, 78, 79, 80, 81].includes(Number(property?.id));
    const isSignatureProperty = Number(property?.id) === 77;
    const baseReady = formData.checkInDate && formData.checkOutDate && pricing.total > 0;
    const verificationReady = isNightlyOffer
      ? ((formData.aadhaarVerified || formData.passportVerified) && govIdStatus === 'valid')
      : true;
    setIsPayNowEnabled(!!(baseReady && verificationReady));
  }, [formData, pricing, govIdStatus, property]);

  // If user arrived here after a payment failure (came via Failure.jsx "Try Again"),
  // push a duplicate history entry so pressing Back stays on this page instead of going to PayU gateway.
  useEffect(() => {
    const failedPropId = sessionStorage.getItem('ovika_from_failure');
    if (failedPropId && String(failedPropId) === String(id)) {
      sessionStorage.removeItem('ovika_from_failure');
      // Push 2 buffer entries — Back button stays here instead of going to PayU
      window.history.pushState({ failureBuffer: 1 }, '', window.location.href);
      window.history.pushState({ failureBuffer: 2 }, '', window.location.href);
    }
  }, [id]);

  // If user pressed Back from PayU without paying, cancel the pending booking
  useEffect(() => {
    const raw = sessionStorage.getItem('ovika_pending_booking');
    if (!raw) return;
    try {
      const { bookingId: pendingId, propertyId: pendingPropId } = JSON.parse(raw);
      if (String(pendingPropId) === String(id)) {
        sessionStorage.removeItem('ovika_pending_booking');
        fetch(`${BOOKING_REQUEST_API}/${pendingId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ booking_status: 'cancelled', cancel_reason: 'Payment not completed by customer' }),
        }).catch(() => {});
        // Push 2 buffer entries so Back button stays on this page, not PayU
        window.history.pushState({ cancelBuffer: 1 }, '', window.location.href);
        window.history.pushState({ cancelBuffer: 2 }, '', window.location.href);
        setShowCancelledNotice(true);
        // Reset booking form
        setShowPaymentModal(false);
        setStep(1);
        setFormData({ checkInDate: '', checkOutDate: '', aadhaarVerified: false, passportVerified: false, mobileVerified: false, uploadedPhoto: '', termsAgreed: false });
      }
    } catch {}
  }, [id]);

  useEffect(() => {
    if (showPaymentModal && step === 3) {
      const fetchCalendarBlockedDates = async () => {
        try {
          const propertyIdStr = String(id);
          const propertyKeyMap = { '2': 'tm-luxe-1', '1': 'tm-luxe-2', '287': 'tm-luxe-3' };
          const propertyKey = propertyKeyMap[propertyIdStr] || `prop-${propertyIdStr}`;
          const { blocked } = await getCalendar(propertyKey, propertyIdStr);
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
  const isHotelStaysCategory = property?.property_category === 'Hotel Stays';
  const showSingleBookRow = !showDistinctRoomPrices && property?.property_category !== 'PG'
    && !(isHotelStaysCategory && (property?.parsedBedrooms?.length || 0) > 1);

  const handleRoomBookNow = (room) => {
    if (!user) { navigate('/login', { state: { from: location } }); return; }
    const isOvika = !!(property?.property_name?.includes('TM Luxe') || property?.property_name?.toLowerCase()?.includes('ovika') || [77, 78, 79, 80, 81].includes(Number(property?.id)));
    // Monthly mode: non-Ovika properties → show lead/enquiry form
    if (pricingMode === 'monthly' && !isOvika) {
      setSelectedRoomForLead(room?.type || null);
      setShowLeadModal(true);
      return;
    }
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
    const isOvika = !!(property?.property_name?.includes('TM Luxe') || property?.property_name?.toLowerCase()?.includes('ovika') || [77, 78, 79, 80, 81].includes(Number(property?.id)));
    // Monthly mode: non-Ovika properties → show lead/enquiry form
    if (pricingMode === 'monthly' && !isOvika) {
      setSelectedRoomForLead(null);
      setShowLeadModal(true);
      return;
    }
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
    const isNightlyOffer = [77, 78, 79, 80, 81].includes(Number(property?.id));
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
    if (step === 3 && isNightlyOffer && pricingMode !== 'monthly') {
      const nights = Math.ceil(Math.abs(new Date(formData.checkOutDate) - new Date(formData.checkInDate)) / (1000 * 60 * 60 * 24));
      if (nights < 2) { showAlert('Minimum 2 nights booking required for this property.'); return; }
    }
    if (step === 3 && bookingType === 1 && pricingMode !== 'monthly' && ownerApprovalStatus !== 'accepted') { showAlert('Please wait for owner approval.'); return; }
    if (step === 2 && !formData.termsAgreed) return;
    if (step === 3 && pricing.total <= 0) return;
    const isSignatureProperty = Number(property?.id) === 77;
    if (!isNightlyOffer && step === 3) { setStep(6); return; }
    if (isNightlyOffer && step === 4) {
      if (!(formData.aadhaarVerified || formData.passportVerified)) { showAlert('Please verify your Aadhaar or Passport first.'); return; }
      if (!formData.mobileVerified) { showAlert('Please verify your mobile number with OTP to continue.'); return; }
    }
    if (isNightlyOffer && step === 5 && govIdStatus !== 'valid') { showAlert('Please upload a valid government ID to continue.'); return; }
    if (step < steps.length) setStep(step + 1);
  };

  const handlePrev = () => {
    const isNightlyOffer = [77, 78, 79, 80, 81].includes(Number(property?.id));
    const isSignatureProperty = Number(property?.id) === 77;
    if (!isNightlyOffer && step === 6) { setStep(3); return; }
    if (step > 1) setStep(step - 1);
  };
  useStepBackNav(step, handlePrev);

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

  const GOV_ID_TYPES = [
    { id: 'pan', label: 'PAN Card' },
    { id: 'aadhaar', label: 'Masked Aadhaar' },
    { id: 'license', label: 'Driving License' },
    { id: 'voter', label: 'Voter ID' },
  ];

  const handleGovIdFile = async (file) => {
    setGovIdError('');
    setGovIdStatus('idle');
    setGovIdPreview('');
    setGovIdDetectedType('');
    setFormData(prev => ({ ...prev, uploadedPhoto: '' }));

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setGovIdStatus('invalid');
      setGovIdError('Please upload a JPG or PNG image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setGovIdStatus('invalid');
      setGovIdError('File too large. Maximum size is 5MB.');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setGovIdPreview(e.target.result);
    reader.readAsDataURL(file);

    setGovIdStatus('scanning');

    // Upload directly — no AI verification
    try {
      const fd = new FormData();
      fd.append('images', file);
      const response = await fetch('https://www.townmanor.ai/api/image/aws-upload-owner-images', { method: 'POST', body: fd });
      const data = await response.json();
      if (!data?.fileUrls?.length) throw new Error('Upload failed');
      setFormData(prev => ({ ...prev, uploadedPhoto: data.fileUrls[0] }));
      setGovIdStatus('valid');
    } catch {
      setGovIdStatus('invalid');
      setGovIdError('Upload failed. Please try again.');
      setGovIdPreview('');
    }
  };

  const handleManualTypeSelect = async (docType) => {
    const file = govIdPendingFileRef.current;
    if (!file) return;
    setGovIdDetectedType(docType);
    setGovIdStatus('scanning');
    try {
      const fd = new FormData();
      fd.append('images', file);
      const response = await fetch('https://www.townmanor.ai/api/image/aws-upload-owner-images', { method: 'POST', body: fd });
      const data = await response.json();
      if (!data?.fileUrls?.length) throw new Error('Upload failed');
      setFormData(prev => ({ ...prev, uploadedPhoto: data.fileUrls[0] }));
      setGovIdStatus('valid');
      govIdPendingFileRef.current = null;
    } catch {
      setGovIdStatus('invalid');
      setGovIdError('Upload failed. Please try again.');
      setGovIdPreview('');
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

  const guestPolicy = (() => {
    const raw = property?.guest_policy;
    if (!raw) return {};
    if (typeof raw === 'string') { try { return JSON.parse(raw); } catch { return {}; } }
    return raw;
  })();
  const pgHouseRules = Array.isArray(property?.meta?.houseRules) ? property.meta.houseRules : [];
  const preferredTenants = (() => {
    const parseAny = (raw) => {
      if (!raw) return null;
      if (Array.isArray(raw) && raw.length > 0) return raw;
      if (typeof raw === 'string') { try { const p = JSON.parse(raw); if (Array.isArray(p) && p.length > 0) return p; } catch {} }
      return null;
    };
    const parseObj = (raw) => {
      if (!raw) return {};
      if (typeof raw === 'string') { try { return JSON.parse(raw); } catch { return {}; } }
      return raw;
    };
    // 1. guest_policy.preferredTenants
    const gp = parseObj(property?.guest_policy);
    const fromGP = parseAny(gp.preferredTenants);
    if (fromGP) return fromGP;
    // 2. meta.preferredTenants
    const meta = parseObj(property?.meta);
    const fromMeta = parseAny(meta.preferredTenants);
    if (fromMeta) return fromMeta;
    // 3. property.preferredTenants directly (meta fields get spread onto property)
    const fromProp = parseAny(property?.preferredTenants);
    if (fromProp) return fromProp;
    console.log('[DEBUG preferredTenants] guest_policy:', property?.guest_policy, 'meta:', property?.meta);
    return [];
  })();

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
      let userPhone = mobileNumber || '9999999999';
      let finalUsername = userLocal.username || username || 'guest';
      if (username) {
        try {
          const userRes = await fetch(`https://www.townmanor.ai/api/user/${username}`);
          if (userRes.ok) { const ud = await userRes.json(); userEmail = ud.email || userEmail; userPhone = mobileNumber || ud.phone || userPhone; }
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
          gst_amount: pricing.gst, nights, discount_amount: pricing.discount || 0,
          num_guests: pricingMode === 'monthly' ? numGuests : undefined
        });

        console.log('Booking Creation API Response:', data);
        newBookingId = data?.booking?.id || data?.booking_id || data?.id || data?.bookingId || data?.request_id || data?.requestId || data?.data?.id || data?.data?.booking_id;
      } else {
        // Owner-approval flow: existing booking has no pricing saved yet
        // Update it with the exact Final Amount shown to the customer on step 4
        console.log('Using existing accepted booking ID:', newBookingId);
        try {
          await axios.patch(`${BOOKING_REQUEST_API}/${newBookingId}`, {
            total_price:     pricing.total,
            subtotal:        pricing.subtotal,
            gst_amount:      pricing.gst,
            discount_amount: pricing.discount || 0,
            nights,
          });
          console.log('Booking pricing updated:', pricing.total);
        } catch (e) {
          console.warn('Could not pre-update booking pricing:', e);
        }
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
      localStorage.setItem('paymentType', 'coliving');
      localStorage.setItem('bookingId', String(bookingIdParam));
      localStorage.setItem('paymentAmount', pricing.total.toFixed(2));
      localStorage.setItem('paymentSubtotal', (pricing.subtotal || 0).toFixed(2));
      localStorage.setItem('paymentGst', (pricing.gst || 0).toFixed(2));
      localStorage.setItem('paymentDiscount', (pricing.discount || 0).toFixed(2));
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
      // Save pending booking so if user presses Back from PayU, we can cancel it
      sessionStorage.setItem('ovika_pending_booking', JSON.stringify({
        bookingId: String(bookingIdParam),
        propertyId: String(localStorage.getItem('property_id') || id),
      }));
      // Push 2 buffer history entries BEFORE leaving — so if user presses Back
      // from PayU, they land back here (same URL) instead of going to PayU gateway.
      const currentUrl = window.location.href;
      window.history.pushState({ paymentBuffer: 1 }, '', currentUrl);
      window.history.pushState({ paymentBuffer: 2 }, '', currentUrl);
      document.body.appendChild(form); form.submit(); document.body.removeChild(form);
    } catch (error) {
      showAlert(error.response?.data?.message || error.message || 'Failed to initiate payment.');
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loader-screen"><div className="spinner"></div></div>;
  if (!property) return <div className="error-screen">Property not found</div>;

  const photos = property.photos || [];
  const isPG = property.property_category === 'PG' || property.property_category === 'PG & Co-Living' || (property.property_category || '').toLowerCase().includes('pg');

  const cleanDescription = (desc) => {
    if (!desc) return "";
    return desc
      .split('--- PG Details ---')[0]
      .split('--- Local Guide ---')[0]
      .split('Notice Period:')[0]
      .split('Gate Closing Time:')[0]
      .trim();
  };

  // For hotels, the per-room-type prices from "Room Arrangement" set the starting (lowest) price.
  const hotelRoomLowestPrice = (() => {
    if (property?.property_category !== 'Hotel Stays') return 0;
    const rooms = property.parsedBedrooms?.length
      ? property.parsedBedrooms
      : (property.meta?.hotelRoomTypes || property.hotelRoomTypes);
    if (!Array.isArray(rooms) || rooms.length === 0) return 0;
    const prices = rooms.map(r => Number(r.price ?? r.pricePerNight)).filter(p => !isNaN(p) && p > 0);
    return prices.length ? Math.min(...prices) : 0;
  })();

  const displayBasePrice = pricingMode === 'monthly'
    ? (selectedPrice || Number(property.meta?.perMonthPrice) || Number(property.meta?.monthlyPrice) || Number(property.monthly_price) || Number(property.price) || 0)
    : (selectedPrice || Number(property.meta?.perNightPrice) || hotelRoomLowestPrice || Number(property.price) || 0);

  // ── OvikaLiving own-managed nightly properties (TM Luxe / Signature 1-5) ───
  const isOvikaOwnProperty = !!(
    property.property_name?.includes('TM Luxe') ||
    property.property_name?.toLowerCase().includes('ovika') ||
    [77, 78, 79, 80, 81].includes(Number(property.id))
  );

  // ── Nightly offer properties: show 40% off badge + coupon field ──────────
  const isNightlyOfferProperty = [77, 78, 79, 80, 81].includes(Number(property.id));
  const nightlyOriginalPrice = isNightlyOfferProperty ? Math.round(displayBasePrice / 0.6) : 0;
  const nightlyEffectivePrice = isNightlyOfferProperty
    ? (couponApplied ? displayBasePrice - 500 : displayBasePrice)
    : displayBasePrice;

  // Seeded discount for all other nightly properties (OYO-style strikethrough)
  const pdpDiscountPct = (() => { const n = ((Number(property?.id) || 1) * 2654435761) >>> 0; return 40 + (n % 38); })();
  const pdpOriginalPrice = (pricingMode !== 'monthly' && displayBasePrice > 0)
    ? Math.round(displayBasePrice / (1 - pdpDiscountPct / 100) / 100) * 100
    : 0;
  const pdpActualPct = pdpOriginalPrice > 0 ? Math.round((pdpOriginalPrice - displayBasePrice) / pdpOriginalPrice * 100) : 0;

  // ── OvikaLiving monthly rental properties with 1-month deposit ───────────
  const isOvikaMonthlyProperty = [315, 316, 317, 323].includes(Number(property.id));

  // ── CONSISTENT BED/BATH COUNTS (same helpers as PropertyListPage) ──────────
  const bedCount  = getBedCount(property.bedrooms, property.parsedBedrooms);
  const bathCount = getBathCount(property.bathrooms, property.parsedBathrooms);
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="detail-page-wrapper">
      <Helmet>
        <title>{property.property_name ? `${property.property_name} in ${property.city || 'Noida'} | Book Now | OvikaLiving` : 'Verified PG & Rental | OvikaLiving'}</title>
        <meta name="description" content={`${property.property_name || 'Premium stay'} in ${property.city || 'Noida'}${property.address ? ', ' + property.address : ''}. ${(property.description || 'Fully furnished, verified property').substring(0, 120)}. Book on OvikaLiving — no brokerage.`} />
        <meta name="keywords" content={`${property.property_name || ''}, ${property.city || 'noida'} pg, ${property.city || 'noida'} rental, furnished room ${property.city || 'noida'}, book pg ${property.city || 'noida'}, verified pg ${property.city || 'noida'}, no brokerage pg, ovikaliving, short term stay ${property.city || 'noida'}, monthly rental ${property.city || 'noida'}`} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://www.ovikaliving.com/property/${property.id}`} />
        <meta name="author" content="OvikaLiving" />
        <meta name="rating" content="general" />
        <meta name="language" content="en" />
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content={property.city || 'Noida'} />
        <meta name="geo.position" content="28.5355;77.3910" />
        <meta name="ICBM" content="28.5355, 77.3910" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${property.property_name || 'Verified Stay'} in ${property.city || 'Noida'} | OvikaLiving`} />
        <meta property="og:description" content={`${property.property_name || 'Premium stay'} in ${property.city || 'Noida'}. Verified, furnished${property.price ? ', from ₹' + Number(property.price).toLocaleString('en-IN') : ''}. Book now — no brokerage!`} />
        <meta property="og:url" content={`https://www.ovikaliving.com/property/${property.id}`} />
        <meta property="og:site_name" content="OvikaLiving" />
        {property.photos?.[0] && <meta property="og:image" content={property.photos[0]} />}
        {property.photos?.[0] && <meta property="og:image:width" content="1200" />}
        {property.photos?.[0] && <meta property="og:image:height" content="630" />}
        {property.photos?.[0] && <meta property="og:image:alt" content={`${property.property_name || 'Property'} in ${property.city || 'Noida'} — OvikaLiving`} />}
        {property.photos?.[1] && <meta property="og:image" content={property.photos[1]} />}
        {property.photos?.[2] && <meta property="og:image" content={property.photos[2]} />}
        <meta property="og:locale" content="en_IN" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@OvikaLiving" />
        <meta name="twitter:title" content={`${property.property_name || 'Property'} in ${property.city || 'Noida'} | OvikaLiving`} />
        <meta name="twitter:description" content={`${property.property_name || 'Verified stay'} in ${property.city || 'Noida'}. Furnished, verified. Book now — no brokerage!`} />
        {property.photos?.[0] && <meta name="twitter:image" content={property.photos[0]} />}

        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "LodgingBusiness",
              "@id": `https://www.ovikaliving.com/property/${property.id}`,
              "name": property.property_name || "OvikaLiving Property",
              "description": (property.description || "Verified furnished property on OvikaLiving").substring(0, 300),
              "url": `https://www.ovikaliving.com/property/${property.id}`,
              "image": Array.isArray(property.photos) && property.photos.length > 0
                ? property.photos.slice(0, 6).map((url, i) => ({
                    "@type": "ImageObject",
                    "url": url,
                    "name": `${property.property_name || 'Property'} — Photo ${i + 1}`,
                    "description": `${i === 0 ? 'Main' : 'Interior'} photo of ${property.property_name || 'property'} in ${property.city || 'Noida'} on OvikaLiving`,
                    "width": 1200,
                    "height": 800,
                    "representativeOfPage": i === 0
                  }))
                : [{ "@type": "ImageObject", "url": "https://www.ovikaliving.com/ovikalivinglogonew.png" }],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": property.address || "",
                "addressLocality": property.city || "Noida",
                "addressRegion": "Uttar Pradesh",
                "addressCountry": "IN"
              },
              "priceRange": property.price ? `₹${Number(property.price).toLocaleString('en-IN')}` : "₹₹",
              "amenityFeature": Array.isArray(property.amenities)
                ? property.amenities.slice(0, 10).map(a => ({ "@type": "LocationFeatureSpecification", "name": a, "value": true }))
                : [],
              "starRating": { "@type": "Rating", "ratingValue": "4.5", "bestRating": "5" },
              "brand": { "@type": "Brand", "name": "OvikaLiving" },
              "hasMap": property.latitude && property.longitude
                ? `https://maps.google.com/?q=${property.latitude},${property.longitude}`
                : undefined
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.ovikaliving.com/" },
                { "@type": "ListItem", "position": 2, "name": "Properties", "item": "https://www.ovikaliving.com/properties" },
                { "@type": "ListItem", "position": 3, "name": property.property_name || "Property", "item": `https://www.ovikaliving.com/property/${property.id}` }
              ]
            }
          ]
        })}</script>
      </Helmet>
      {alertMessage && <CustomAlert message={alertMessage} onClose={closeAlert} />}

      {showCancelledNotice && (
        <div style={{
          position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
          zIndex: 10002, background: '#1a1a1a', color: '#fff',
          padding: '12px 20px 12px 16px', borderRadius: 12,
          boxShadow: '0 8px 28px rgba(0,0,0,0.35)',
          display: 'flex', alignItems: 'center', gap: 12,
          fontSize: 14, fontWeight: 500, maxWidth: 'calc(100vw - 32px)',
          animation: 'fadeInDown 0.3s ease',
        }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <span>Previous transaction was cancelled. Please start a new booking.</span>
          <button onClick={() => setShowCancelledNotice(false)}
            style={{ marginLeft: 8, background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>
        </div>
      )}

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
      {showPhotoGallery && <PhotoGallerySlider property={property} onClose={() => setShowPhotoGallery(false)} />}

      {/* ── Share Modal ── */}
      {showShareModal && (() => {
        const shareUrl = window.location.href;
        const shareText = encodeURIComponent(`Check out this property on OvikaLiving: ${property.property_name || ''}`);
        const encodedUrl = encodeURIComponent(shareUrl);
        const handleCopy = () => {
          navigator.clipboard.writeText(shareUrl).then(() => {
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2500);
          });
        };
        const socials = [
          {
            name: 'WhatsApp',
            color: '#25D366',
            href: `https://wa.me/?text=${shareText}%20${encodedUrl}`,
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.528 5.847L0 24l6.335-1.508A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
            ),
          },
          {
            name: 'Twitter / X',
            color: '#000',
            href: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`,
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            ),
          },
          {
            name: 'Facebook',
            color: '#1877F2',
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
            ),
          },
          {
            name: 'Telegram',
            color: '#0088CC',
            href: `https://t.me/share/url?url=${encodedUrl}&text=${shareText}`,
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            ),
          },
          {
            name: 'Email',
            color: '#c2772b',
            href: `mailto:?subject=${encodeURIComponent(property.property_name || 'OvikaLiving Property')}&body=${shareText}%20${encodedUrl}`,
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            ),
          },
        ];
        return (
          <div className="pdp-share-overlay" onClick={() => setShowShareModal(false)}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }} />
            <div className="pdp-share-modal" onClick={e => e.stopPropagation()}>
              {/* drag handle — mobile only */}
              <div className="pdp-share-handle" />
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1209' }}>Share this property</div>
                  <div style={{ fontSize: '0.72rem', color: '#9a8878', marginTop: 2 }}>{property.property_name}</div>
                </div>
                <button onClick={() => setShowShareModal(false)}
                  style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              {/* Link copy box */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f7f8fa', border: '1.5px solid #ddd0c0', borderRadius: 10, padding: '10px 12px', marginBottom: 22 }}>
                <svg width="14" height="14" fill="none" stroke="#9a8878" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"/><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 015.656 0l4-4a4 4 0 01-5.656-5.656l-1.1 1.1"/></svg>
                <span style={{ flex: 1, fontSize: '0.73rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shareUrl}</span>
                <button onClick={handleCopy}
                  style={{ flexShrink: 0, background: linkCopied ? '#c2772b' : '#1a1209', color: '#fff', border: 'none', borderRadius: 7, padding: '5px 12px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}>
                  {linkCopied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>

              {/* Social grid */}
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#b0987c', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 12 }}>Share via</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                {socials.map(s => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, textDecoration: 'none', flex: 1 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 14px ${s.color}44` }}>
                      {s.icon}
                    </div>
                    <span style={{ fontSize: '0.58rem', color: '#6b7280', fontWeight: 600, textAlign: 'center', lineHeight: 1.3, whiteSpace: 'nowrap' }}>{s.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      <LeadGenerationModal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)} propertyName={property.property_name} propertyId={property.id} user={user} roomType={selectedRoomForLead} />

      {/* ── PAYMENT MODAL ─────────────────────────────────────────────────── */}
      {showPaymentModal && (
        <div className="pm-overlay">
          <div className="pm-card">
            <button onClick={() => setShowPaymentModal(false)} className="pm-close"><FiX /></button>

            <div className="pm-steps-bar">
              <div className="pm-steps-row">
                {(() => {
                  const isNightlyOffer = [77, 78, 79, 80, 81].includes(Number(property?.id));
                  const visibleSteps = isNightlyOffer
                    ? steps
                    : ['Property', 'Terms', 'Dates & Pricing', 'Payment'];
                  const visibleStep = isNightlyOffer ? step : (step <= 3 ? step : 4);
                  return visibleSteps.map((stepName, index) => (
                    <div key={index} className="pm-step-item">
                      {index < visibleSteps.length - 1 && (
                        <div className={`pm-step-line ${index < visibleStep ? 'pm-step-line--done' : ''}`}></div>
                      )}
                      <div className="pm-step-inner">
                        <div className={`pm-step-dot ${index + 1 <= visibleStep ? 'pm-step-dot--done' : ''}`}>{index + 1}</div>
                        <span className={`pm-step-label ${index + 1 === visibleStep ? 'pm-step-label--active' : ''}`}>{stepName}</span>
                      </div>
                    </div>
                  ));
                })()}
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

                  {pricingMode === 'monthly' && (
                    <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Number of Guests</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                          type="button"
                          onClick={() => setNumGuests(g => Math.max(1, g - 1))}
                          style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1.5px solid #cbd5e1', background: '#fff', fontSize: '1.3rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: numGuests <= 1 ? '#ccc' : '#333' }}
                          disabled={numGuests <= 1}
                        >−</button>
                        <span style={{ fontSize: '1.4rem', fontWeight: '700', minWidth: '2rem', textAlign: 'center' }}>{numGuests}</span>
                        <button
                          type="button"
                          onClick={() => setNumGuests(g => Math.min(property.max_guests || 20, g + 1))}
                          style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1.5px solid #8b0000', background: '#8b0000', fontSize: '1.3rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#fff' }}
                        >+</button>
                        {property.max_guests > 0 && (
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Max {property.max_guests} guests allowed</span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pm-property-card">
                    <img src={getPhotoUrl(property.photos?.[0]) || 'https://via.placeholder.com/300x200'} alt="Property" className="pm-property-img" />
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{property.property_name}</h3>
                      <p style={{ color: '#666', marginBottom: '0.5rem' }}>{property.city}, {property.address}</p>
                      <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: '1rem' }}>{cleanDescription(property.description)}</p>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                        {pdpOriginalPrice > 0 && pricingMode !== 'monthly' && (
                          <span style={{ fontSize: '1rem', color: '#999', textDecoration: 'line-through' }}>
                            ₹{formatCurrency(pdpOriginalPrice)}
                          </span>
                        )}
                        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#8b0000' }}>
                          <MdCurrencyRupee style={{ display: 'inline', verticalAlign: 'middle' }} />
                          {formatCurrency(isNightlyOfferProperty ? nightlyEffectivePrice : displayBasePrice)}
                          <span style={{ fontSize: '1rem', color: '#666' }}>/{pricingMode === 'monthly' ? 'month' : (property.billing_cycle || 'night')}</span>
                        </p>
                        {pdpOriginalPrice > 0 && pricingMode !== 'monthly' && (
                          <span style={{ fontSize: '0.75rem', background: '#15803d', color: '#fff', padding: '2px 7px', borderRadius: '4px', fontWeight: 600 }}>{pdpActualPct}% OFF</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Terms & Conditions</h2>
                  <div className="pm-terms-box" style={{ maxHeight: '400px', overflow: 'auto', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', marginBottom: '1.5rem' }}>
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
                        /* ── Monthly Booking: Month Grid Picker ── */
                        <div>
                          {/* Month Grid Picker */}
                          <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>Select Move-in Month</label>
                            {/* Year navigation */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                              <button
                                onClick={() => setMonthPickerYear(y => y - 1)}
                                disabled={monthPickerYear <= new Date().getFullYear()}
                                style={{ background: 'none', border: '1.5px solid #ddd', borderRadius: '8px', padding: '6px 14px', cursor: monthPickerYear <= new Date().getFullYear() ? 'not-allowed' : 'pointer', color: monthPickerYear <= new Date().getFullYear() ? '#ccc' : '#333', fontWeight: '600' }}>
                                ‹ Prev
                              </button>
                              <span style={{ fontWeight: '700', fontSize: '1.05rem', color: '#1a1a1a' }}>{monthPickerYear}</span>
                              <button
                                onClick={() => setMonthPickerYear(y => y + 1)}
                                disabled={monthPickerYear >= new Date().getFullYear() + 2}
                                style={{ background: 'none', border: '1.5px solid #ddd', borderRadius: '8px', padding: '6px 14px', cursor: monthPickerYear >= new Date().getFullYear() + 2 ? 'not-allowed' : 'pointer', color: monthPickerYear >= new Date().getFullYear() + 2 ? '#ccc' : '#333', fontWeight: '600' }}>
                                Next ›
                              </button>
                            </div>
                            {/* Month grid */}
                            {(() => {
                              const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                              const today = new Date();
                              const selectedIn = formData.checkInDate ? new Date(formData.checkInDate + 'T00:00:00') : null;
                              const selectedOut = formData.checkOutDate ? new Date(formData.checkOutDate + 'T00:00:00') : null;
                              return (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                  {MONTHS.map((m, idx) => {
                                    const isPast = monthPickerYear < today.getFullYear() || (monthPickerYear === today.getFullYear() && idx < today.getMonth());
                                    const isCheckin = selectedIn && selectedIn.getFullYear() === monthPickerYear && selectedIn.getMonth() === idx;
                                    const isCheckout = selectedOut && selectedOut.getFullYear() === monthPickerYear && selectedOut.getMonth() === idx;
                                    const isInRange = selectedIn && selectedOut && (() => {
                                      const d = new Date(monthPickerYear, idx, 1);
                                      return d > selectedIn && d < selectedOut;
                                    })();
                                    return (
                                      <button
                                        key={m}
                                        disabled={isPast}
                                        onClick={() => {
                                          if (isPast) return;
                                          const checkIn = `${monthPickerYear}-${String(idx + 1).padStart(2, '0')}-01`;
                                          handleMonthlyCheckInChange(checkIn);
                                        }}
                                        style={{
                                          padding: '12px 6px',
                                          borderRadius: '10px',
                                          border: isCheckin ? '2px solid #8b0000' : isCheckout ? '2px solid #16a34a' : isInRange ? '1.5px solid #bbf7d0' : '1.5px solid #e5e5e5',
                                          background: isCheckin ? '#8b0000' : isCheckout ? '#16a34a' : isInRange ? '#f0fdf4' : isPast ? '#f9fafb' : '#fff',
                                          color: isCheckin || isCheckout ? '#fff' : isPast ? '#ccc' : '#222',
                                          fontWeight: isCheckin || isCheckout ? '700' : '500',
                                          fontSize: '0.88rem',
                                          cursor: isPast ? 'not-allowed' : 'pointer',
                                          transition: 'all 0.15s',
                                          position: 'relative',
                                        }}
                                      >
                                        {m}
                                        {isCheckin && <span style={{ display: 'block', fontSize: '0.6rem', marginTop: '2px', opacity: 0.85 }}>Move-in</span>}
                                        {isCheckout && <span style={{ display: 'block', fontSize: '0.6rem', marginTop: '2px', opacity: 0.85 }}>Move-out</span>}
                                      </button>
                                    );
                                  })}
                                </div>
                              );
                            })()}
                          </div>

                          {/* Duration selector */}
                          <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '10px', color: '#1a1a1a' }}>
                              Duration (Months)
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {[1,2,3,4,5,6,7,8,9,10,11].map(n => (
                                <button
                                  key={n}
                                  onClick={() => handleMonthlyDurationChange(n)}
                                  style={{
                                    padding: '8px 14px', borderRadius: '8px',
                                    border: monthlyDuration === n ? '2px solid #8b0000' : '1.5px solid #ddd',
                                    background: monthlyDuration === n ? '#8b0000' : '#fff',
                                    color: monthlyDuration === n ? '#fff' : '#333',
                                    fontWeight: monthlyDuration === n ? '700' : '500',
                                    fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.15s',
                                  }}
                                >
                                  {n}M
                                </button>
                              ))}
                              <button
                                onClick={() => handleMonthlyDurationChange(12)}
                                style={{
                                  padding: '8px 14px', borderRadius: '8px',
                                  border: monthlyDuration >= 12 ? '2px solid #f97316' : '1.5px solid #ddd',
                                  background: monthlyDuration >= 12 ? '#fff7ed' : '#fff',
                                  color: monthlyDuration >= 12 ? '#9a3412' : '#333',
                                  fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.15s',
                                }}
                              >
                                12M+
                              </button>
                            </div>
                          </div>

                          {/* 12+ months agreement warning */}
                          {monthlyDuration >= 12 && (
                            <div style={{ padding: '16px', background: '#fff7ed', border: '1.5px solid #f97316', borderRadius: '10px', marginBottom: '1rem' }}>
                              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>⚠️</span>
                                <div>
                                  <p style={{ fontWeight: '700', color: '#9a3412', marginBottom: '6px', fontSize: '0.95rem' }}>Rental Agreement Required</p>
                                  <p style={{ color: '#7c2d12', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '8px' }}>
                                    As per the <strong>Rent Control Act</strong>, stays exceeding <strong>11 months</strong> require a formal registered rental agreement.
                                  </p>
                                  <p style={{ fontWeight: '700', color: '#9a3412', fontSize: '0.95rem', marginTop: '6px' }}>📞 +91 9310292309</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Summary bar */}
                          {formData.checkInDate && formData.checkOutDate && monthlyDuration <= 11 && (
                            <div style={{ padding: '14px 16px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                              <div>
                                <p style={{ fontSize: '0.72rem', color: '#166534', fontWeight: '700', marginBottom: '2px', letterSpacing: '0.04em' }}>MOVE-IN</p>
                                <p style={{ fontWeight: '700', color: '#14532d', fontSize: '0.95rem' }}>{new Date(formData.checkInDate + 'T00:00:00').toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
                              </div>
                              <div style={{ width: '1px', background: '#86efac' }} />
                              <div>
                                <p style={{ fontSize: '0.72rem', color: '#166534', fontWeight: '700', marginBottom: '2px', letterSpacing: '0.04em' }}>MOVE-OUT</p>
                                <p style={{ fontWeight: '700', color: '#14532d', fontSize: '0.95rem' }}>{new Date(formData.checkOutDate + 'T00:00:00').toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
                              </div>
                              <div style={{ width: '1px', background: '#86efac' }} />
                              <div>
                                <p style={{ fontSize: '0.72rem', color: '#166534', fontWeight: '700', marginBottom: '2px', letterSpacing: '0.04em' }}>DURATION</p>
                                <p style={{ fontWeight: '700', color: '#14532d', fontSize: '0.95rem' }}>{monthlyDuration} {monthlyDuration === 1 ? 'Month' : 'Months'}</p>
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
                      {pricingMode !== 'monthly' && formData.checkInDate && formData.checkOutDate && (() => {
                        const nights = Math.ceil(Math.abs(new Date(formData.checkOutDate) - new Date(formData.checkInDate)) / (1000 * 60 * 60 * 24));
                        const perNight = Number(selectedPrice || property?.meta?.perNightPrice || property?.price || 0);
                        return (
                          <div style={{ marginBottom: '1rem', padding: '10px 12px', background: '#fff7ed', borderRadius: '6px', fontSize: '0.85rem', color: '#92400e' }}>
                            📅 {nights} {nights === 1 ? 'night' : 'nights'} ×{' '}
                            {couponApplied && [77,78,79,80,81].includes(Number(property?.id)) ? (
                              <>
                                <span style={{ textDecoration: 'line-through', color: '#aaa', marginRight: '4px' }}>₹{perNight.toLocaleString('en-IN')}</span>
                                <span style={{ color: '#15803d', fontWeight: 700 }}>₹{perNight.toLocaleString('en-IN')}</span>
                                <span style={{ color: '#15803d', fontSize: '0.78rem' }}> (−₹500/night coupon)</span>
                              </>
                            ) : (
                              <span>₹{perNight.toLocaleString('en-IN')}</span>
                            )}
                            /night
                          </div>
                        );
                      })()}
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e5e5e5' }}>
                          <span>Subtotal</span><span><MdCurrencyRupee style={{ display: 'inline' }} />{pricing.subtotal.toFixed(2)}</span>
                        </div>
                        {pricing.discount > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e5e5e5', color: '#16a34a' }}>
                            <span>Discount ({pricing.discountPercentage}%)</span><span>-<MdCurrencyRupee style={{ display: 'inline' }} />{pricing.discount.toFixed(2)}</span>
                          </div>
                        )}
                        {pricing.couponDiscount > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e5e5e5', color: '#16a34a' }}>
                            <span>Coupon (OVIKA500 · ₹500/night)</span><span>-<MdCurrencyRupee style={{ display: 'inline' }} />{pricing.couponDiscount.toFixed(2)}</span>
                          </div>
                        )}
                        {pricing.securityDeposit > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e5e5e5', color: '#0369a1' }}>
                            <span>Security Deposit {pricingMode !== 'monthly' ? '(1 night · Refundable)' : isOvikaMonthlyProperty ? '(1 Month · Refundable)' : '(Refundable)'}</span>
                            <span><MdCurrencyRupee style={{ display: 'inline' }} />{pricing.securityDeposit.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        {pricingMode !== 'monthly' && (
                          <div style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e5e5e5' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                Taxes &amp; fees
                                <span
                                  onClick={() => setShowTaxInfo(v => !v)}
                                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: '50%', border: '1.5px solid #888', color: '#888', fontSize: 10, fontWeight: 700, cursor: 'pointer', userSelect: 'none', flexShrink: 0 }}
                                >i</span>
                              </span>
                              <span><MdCurrencyRupee style={{ display: 'inline' }} />{pricing.gst.toFixed(2)}</span>
                            </div>
                            {showTaxInfo && (
                              <div style={{ marginTop: 8, background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 12px', fontSize: '0.82rem', color: '#444' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginBottom: 6, color: '#111' }}>
                                  <span>Total taxes &amp; fees</span>
                                  <span>₹{pricing.gst.toFixed(2)}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.78rem', color: '#777', lineHeight: 1.5 }}>
                                  This includes transaction taxes payable as per applicable laws.
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '1.2rem', color: '#8b0000' }}>
                          <span>Total</span><span><MdCurrencyRupee style={{ display: 'inline' }} />{pricing.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {[77,78,79,80,81].includes(Number(property?.id)) && pricingMode !== 'monthly' && (
                        <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '1rem', marginTop: '0.5rem' }}>
                          <p style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Have a coupon code?</p>
                          {!couponApplied ? (
                            <>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <input
                                  type="text"
                                  value={couponInput}
                                  onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                                  placeholder="Enter coupon"
                                  style={{ flex: 1, padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.82rem', outline: 'none' }}
                                />
                                <button
                                  onClick={() => {
                                    if (couponInput === 'OVIKA500') {
                                      setCouponApplied(true);
                                      setCouponError('');
                                    } else {
                                      setCouponApplied(false);
                                      setCouponError('Invalid coupon code');
                                    }
                                  }}
                                  style={{ padding: '7px 12px', background: '#b45309', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                >Apply</button>
                              </div>
                              {couponError && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '5px' }}>{couponError}</p>}
                            </>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '6px', padding: '8px 12px' }}>
                              <span style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 600 }}>✓ OVIKA500 — ₹500/night off!</span>
                              <button
                                onClick={() => { setCouponApplied(false); setCouponInput(''); setCouponError(''); }}
                                style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, padding: '0 4px' }}
                              >✕ Remove</button>
                            </div>
                          )}
                        </div>
                      )}
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

                  {/* Mobile OTP — shown after ID is verified */}
                  {(formData.aadhaarVerified || formData.passportVerified) && (
                    <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
                        Mobile Verification (Mandatory)
                        {formData.mobileVerified && <span style={{ marginLeft: 10, color: '#22c55e', fontSize: '0.9rem' }}>✓ Verified</span>}
                      </h3>
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Mobile Number</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={10}
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="10-digit mobile number"
                          disabled={formData.mobileVerified || otpSent}
                          style={{ width: '100%', padding: '14px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
                        />
                      </div>
                      {!otpSent ? (
                        <button
                          onClick={handleGenerateOTP}
                          disabled={!mobileNumber || mobileNumber.length !== 10 || isOtpLoading || formData.mobileVerified}
                          style={{ width: '100%', padding: '14px', background: formData.mobileVerified ? '#22c55e' : '#8b0000', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer' }}
                        >
                          {formData.mobileVerified ? '✓ Verified' : isOtpLoading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                      ) : (
                        <>
                          <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Enter OTP</label>
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={6}
                              value={otpInput}
                              onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                              placeholder="6-digit OTP"
                              disabled={formData.mobileVerified}
                              style={{ width: '100%', padding: '14px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
                            />
                          </div>
                          <button
                            onClick={handleVerifyOTP}
                            disabled={!otpInput || formData.mobileVerified || isMobileVerifying}
                            style={{ width: '100%', padding: '14px', background: formData.mobileVerified ? '#22c55e' : '#8b0000', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                          >
                            {formData.mobileVerified ? <><CheckCircle size={20} /> Verified</> : isMobileVerifying ? <><Loader size={20} className="animate-spin" /> Verifying...</> : 'Verify OTP'}
                          </button>
                        </>
                      )}
                    </div>
                  )}

                </div>
              )}

              {step === 5 && (
                <div>
                  <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Upload Government ID</h2>
                  <p style={{ color: '#555', fontSize: '0.88rem', marginBottom: '1.4rem', lineHeight: 1.55 }}>
                    Please upload a photo of any government-issued ID — Aadhaar Card, PAN Card, Driving Licence, Voter ID, or Passport.
                  </p>

                  {/* Upload Zone */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer.files[0]) handleGovIdFile(e.dataTransfer.files[0]); }}
                    onClick={() => govIdStatus !== 'scanning' && govIdInputRef.current.click()}
                    style={{
                      padding: '2.5rem 1.5rem',
                      border: `2.5px dashed ${govIdStatus === 'valid' ? '#22c55e' : govIdStatus === 'invalid' ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: 12, textAlign: 'center',
                      cursor: govIdStatus === 'scanning' ? 'not-allowed' : 'pointer',
                      background: govIdStatus === 'valid' ? '#f0fdf4' : govIdStatus === 'invalid' ? '#fef2f2' : '#f8fafc',
                      transition: 'all 0.2s',
                    }}
                  >
                    {govIdStatus === 'scanning' ? (
                      <>
                        <Loader size={40} style={{ margin: '0 auto 0.75rem', display: 'block', color: '#8b0000' }} />
                        <p style={{ fontWeight: 600, color: '#8b0000' }}>Uploading…</p>
                      </>
                    ) : govIdStatus === 'valid' ? (
                      <>
                        <CheckCircle size={48} style={{ color: '#22c55e', margin: '0 auto 0.75rem', display: 'block' }} />
                        <p style={{ fontWeight: 700, color: '#16a34a', fontSize: '1rem' }}>Government ID Uploaded</p>
                        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: 4 }}>Click to re-upload if needed</p>
                      </>
                    ) : govIdStatus === 'invalid' ? (
                      <>
                        <XCircle size={48} style={{ color: '#dc2626', margin: '0 auto 0.75rem', display: 'block' }} />
                        <p style={{ fontWeight: 700, color: '#dc2626' }}>Upload Failed</p>
                        <p style={{ fontSize: '0.82rem', color: '#dc2626', marginTop: 4 }}>{govIdError}</p>
                        <p style={{ fontSize: '0.78rem', color: '#888', marginTop: 6 }}>Click to try again</p>
                      </>
                    ) : (
                      <>
                        <UploadCloud size={48} style={{ margin: '0 auto 0.75rem', display: 'block', color: '#8b0000' }} />
                        <p style={{ fontWeight: 600, color: '#333', fontSize: '0.95rem' }}>Click to upload your Government ID</p>
                        <p style={{ color: '#999', fontSize: '0.8rem', marginTop: 4 }}>Drag & drop or click to browse · JPG or PNG · Max 5MB</p>
                      </>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={govIdInputRef}
                    style={{ display: 'none' }}
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => { if (e.target.files[0]) handleGovIdFile(e.target.files[0]); e.target.value = ''; }}
                  />

                  {/* Preview */}
                  {govIdPreview && (
                    <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                      <img src={govIdPreview} alt="ID Preview" style={{ maxWidth: 280, maxHeight: 180, borderRadius: 10, border: `2px solid ${govIdStatus === 'valid' ? '#22c55e' : '#ddd'}`, objectFit: 'cover' }} />
                    </div>
                  )}

                  <div style={{ marginTop: '1rem', padding: '10px 14px', background: '#fffbeb', borderRadius: 8, border: '1px solid #fde68a', fontSize: '0.8rem', color: '#92400e' }}>
                    🔒 Your ID is stored securely and used only for identity verification.
                  </div>
                </div>
              )}

              {step === 6 && (
                <div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Complete Payment</h2>
                  <div style={{ maxWidth: '500px', margin: '0 auto', padding: '2.5rem', background: '#f8fafc', borderRadius: '12px', textAlign: 'center' }}>
                    <p style={{ fontSize: '1rem', color: '#666', marginBottom: '0.5rem' }}>Final Amount</p>
                    {couponApplied && pricing.couponDiscount > 0 && (
                      <p style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 600, marginBottom: '6px' }}>✓ OVIKA500 applied — ₹500/night saved!</p>
                    )}
                    <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#8b0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MdOutlineCurrencyRupee size={40} />{pricing.total.toFixed(2)}</p>
                    <div style={{ marginBottom: '2rem', padding: '1rem', background: 'white', borderRadius: '8px', textAlign: 'left' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Check-in:</span><strong>{formData.checkInDate ? new Date(formData.checkInDate).toLocaleDateString() : '-'}</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Check-out:</span><strong>{formData.checkOutDate ? new Date(formData.checkOutDate).toLocaleDateString() : '-'}</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #e5e5e5', marginBottom: '0.5rem' }}><span>Property:</span><strong>{property.property_name}</strong></div>
                      {pricing.securityDeposit > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #e5e5e5', color: '#0369a1', fontSize: '0.9rem' }}>
                          <span>Security Deposit {pricingMode !== 'monthly' ? '(1 night · Refundable)' : isOvikaMonthlyProperty ? '(1 Month · Refundable)' : '(Refundable)'}:</span>
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
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft size={16} />
          <span>Back</span>
        </button>
        <div className="header-actions">
          <button className="action-btn action-btn--icon" title="Share" onClick={() => setShowShareModal(true)}><FiShare size={16} /></button>
          <button className="action-btn action-btn--icon" title="Save"><FiHeart size={16} /></button>
        </div>
      </div>

      <section className="image-gallery">
        {/* ── Airbnb-style gallery grid ── */}
        {(() => {
          const realPhotos = photos.filter(Boolean);
          const count = realPhotos.length;
          const imgStyle = { position:'absolute', top:0, left:0, right:0, bottom:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center center', display:'block' };
          const cellBase = { position:'relative', overflow:'hidden' };

          // 1 photo — main full width, no side
          if (count <= 1) return (
            <div className="gallery-airbnb" style={{ display:'block' }}>
              <div style={{ ...cellBase, width:'100%', borderRadius:12, aspectRatio:'16/7' }} onClick={handleMainImageClick}>
                <img src={getPhotoUrl(realPhotos[0]) || 'https://via.placeholder.com/800x500'} alt="Main Property" style={imgStyle} />
              </div>
              <button className="gallery-show-all-btn" onClick={() => setShowPhotoGallery(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                <span className="gallery-show-all-text">Show all photos</span>
              </button>
            </div>
          );

          // 2 photos — left big + right 1 full height
          if (count === 2) return (
            <div className="gallery-airbnb">
              <div className="gallery-main" style={cellBase} onClick={handleMainImageClick}>
                <img src={getPhotoUrl(realPhotos[0])} alt="Main Property" style={imgStyle} />
              </div>
              <div className="gallery-side" style={{ display:'block' }}>
                <div style={{ ...cellBase, height:'100%', borderRadius:'0 12px 12px 0' }} onClick={() => { setViewerImageIndex(1); setShowImageViewer(true); }}>
                  <img src={getPhotoUrl(realPhotos[1])} alt="Property 2" style={imgStyle} />
                </div>
              </div>
              <button className="gallery-show-all-btn" onClick={() => setShowPhotoGallery(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                <span className="gallery-show-all-text">Show all photos</span>
              </button>
            </div>
          );

          // 3 photos — main left + right 2 stacked in grid
          if (count === 3) return (
            <div className="gallery-airbnb">
              <div className="gallery-main" style={cellBase} onClick={handleMainImageClick}>
                <img src={getPhotoUrl(realPhotos[0])} alt="Main Property" style={imgStyle} />
              </div>
              <div className="gallery-side" style={{ display:'grid', gridTemplateColumns:'1fr', gridTemplateRows:'1fr 1fr', gap:4 }}>
                {[1,2].map((i, pos) => (
                  <div key={i} style={{ position:'relative', overflow:'hidden', borderRadius: pos===0 ? '0 12px 0 0' : '0 0 12px 0', cursor:'pointer' }} onClick={() => { setViewerImageIndex(i); setShowImageViewer(true); }}>
                    <img src={getPhotoUrl(realPhotos[i])} alt={`Property ${i+1}`} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 25%', display:'block' }} />
                  </div>
                ))}
              </div>
              <button className="gallery-show-all-btn" onClick={() => setShowPhotoGallery(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                <span className="gallery-show-all-text">Show all photos</span>
              </button>
            </div>
          );

          // 4 photos — left big + right: top full-width, bottom 2 side by side
          if (count === 4) return (
            <div className="gallery-airbnb">
              <div className="gallery-main" style={cellBase} onClick={handleMainImageClick}>
                <img src={getPhotoUrl(realPhotos[0])} alt="Main Property" style={imgStyle} />
              </div>
              <div className="gallery-side" style={{ display:'flex', flexDirection:'column', gap:4 }}>
                <div style={{ ...cellBase, flex:1, borderRadius:'0 12px 0 0' }} onClick={() => { setViewerImageIndex(1); setShowImageViewer(true); }}>
                  <img src={getPhotoUrl(realPhotos[1])} alt="Property 2" style={imgStyle} />
                </div>
                <div style={{ flex:1, display:'flex', gap:4 }}>
                  {[2,3].map((i, pos) => (
                    <div key={i} style={{ ...cellBase, flex:1, borderRadius: pos===1 ? '0 0 12px 0' : undefined }} onClick={() => { setViewerImageIndex(i); setShowImageViewer(true); }}>
                      <img src={getPhotoUrl(realPhotos[i])} alt={`Property ${i+1}`} style={imgStyle} />
                    </div>
                  ))}
                </div>
              </div>
              <button className="gallery-show-all-btn" onClick={() => setShowPhotoGallery(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                <span className="gallery-show-all-text">Show all photos</span>
              </button>
            </div>
          );

          // 5+ photos — original airbnb 2×2 grid
          return (
            <div className="gallery-airbnb">
              <div className="gallery-main" style={{ position:'relative', overflow:'hidden' }} onClick={handleMainImageClick}>
                <img src={getPhotoUrl(realPhotos[0])} alt="Main Property" style={imgStyle} />
              </div>
              <div className="gallery-side gallery-side-grid">
                {[1,2,3,4].map((idx, pos) => (
                  <div key={idx} className={`gallery-side-cell gallery-grid-cell gallery-grid-cell--${pos}`} style={{ position:'relative', overflow:'hidden' }}
                    onClick={() => { if (realPhotos[idx]) { setViewerImageIndex(idx); setShowImageViewer(true); } }}>
                    <img src={getPhotoUrl(realPhotos[idx])} alt={`Property ${idx+1}`} style={imgStyle} />
                  </div>
                ))}
              </div>
              <button className="gallery-show-all-btn" onClick={() => setShowPhotoGallery(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                <span className="gallery-show-all-text">Show all photos</span>
              </button>
            </div>
          );
        })()}

        {/* Mobile-only thumbnail strip */}
        <div className="thumbnail-strip">
          {photos.map((p, idx) => (
            <div
              key={idx}
              className={`thumb-item ${activeImg === idx ? 'active' : ''}`}
              onClick={() => { setActiveImg(idx); handleThumbnailClick(idx); }}
            >
              <img src={getPhotoUrl(p)} alt={`Thumb ${idx}`} />
            </div>
          ))}
        </div>
      </section>

      <section className="title-section">
        {/* title + rating on same row */}
        <div className="pdp-title-row">
          <h1 className="pdp-title-h1" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', margin: 0 }}>
            {property.property_name}
            {(() => {
              const m = property.meta && typeof property.meta === 'object' ? property.meta : (() => { try { return JSON.parse(property.meta || '{}'); } catch { return {}; } })();
              const isGreenVerified = Number(property.verified_badge) === 1 || !!m.verified_badge;
              const isGoldVerified  = Number(property.self_verified_badge) === 1 || !!m.self_verified_badge;
              return (
                <>
                  {isGreenVerified && <img src="/ovikaver.png" alt="Ovika Verified" style={{ height: 44, width: 'auto', pointerEvents: 'none' }} />}
                  {isGoldVerified  && <img src="/SelfVerified.jpeg" alt="Self Verified" style={{ height: 44, width: 'auto', pointerEvents: 'none', borderRadius: 4 }} />}
                </>
              );
            })()}
          </h1>
          <div className="pdp-rating-pill">
            <span className="rp-star">★</span>
            {(() => {
              const FIVE_STAR_IDS = [77, 78, 79, 80, 81, 315, 316, 317, 323];
              if (FIVE_STAR_IDS.includes(Number(id))) return '5.0';
              return (4.1 + ((Number(id) * 13 + 7) % 9) / 10).toFixed(1);
            })()}
            <span className="rp-sep">·</span>
            {4 + (Number(id) % 20)} reviews
          </div>
        </div>
        {/* address below */}
        <div className="location-row">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c2772b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>{[property.city, property.address].filter(Boolean).join(', ')}</span>
        </div>
      </section>

      <div className="content-grid">
        <div className="details-column">

          {/* ── Mobile-only Stay Details card ── */}
          <div className="pdp-stay-details-card">
            <h3 className="pdp-stay-details-title">Stay details</h3>
            <div className="pdp-stay-details-grid">
              <div className="pdp-stay-detail-item">
                <span className="pdp-sd-label">CHECK-IN</span>
                <span className="pdp-sd-value">{formatTime12h(property.check_in_time) || '2:00 PM'}</span>
              </div>
              <div className="pdp-stay-detail-item">
                <span className="pdp-sd-label">CHECK-OUT</span>
                <span className="pdp-sd-value">{formatTime12h(property.check_out_time || property.meta?.check_out_time || '11:00') || '11:00 AM'}</span>
              </div>
              <div className="pdp-stay-detail-item">
                <span className="pdp-sd-label">GUESTS</span>
                <span className="pdp-sd-value">{property.guests || property.max_guests || 2} Adults</span>
              </div>
              <div className="pdp-stay-detail-item">
                <span className="pdp-sd-label">CANCELLATION</span>
                <span className="pdp-sd-value pdp-sd-green">Free</span>
              </div>
            </div>
          </div>

          {!(isPG && pricingMode === 'monthly') && <div className="features-bar">
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
              {property.max_guests > 0 && !isPG && <div className="feature-box"><FiUser className="f-icon"/><div><strong>{property.max_guests}</strong><span>Guests</span></div></div>}
              {property.facing && <div className="feature-box"><FiCompass className="f-icon"/><div><strong>{property.facing}</strong><span>Facing</span></div></div>}
              {isOvikaOwnProperty && !isNightlyOfferProperty && pricingMode !== 'monthly' && (
                <div className="feature-box" style={{ borderLeft: '3px solid #16a34a' }}>
                  <FiLock className="f-icon" style={{ color: '#16a34a' }}/>
                  <div>
                    <strong style={{ color: '#16a34a' }}>1 night</strong>
                    <span style={{ color: '#16a34a' }}>Security Deposit</span>
                    <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>Refundable</span>
                  </div>
                </div>
              )}
            </div>}

          <div className="divider"></div>

          <div className="text-section about-mobile-wrap">
            <h3>About this space</h3>
            <div className="about-mobile-card">
              <p style={{
                display: '-webkit-box',
                WebkitLineClamp: descExpanded ? 'unset' : 4,
                WebkitBoxOrient: 'vertical',
                overflow: descExpanded ? 'visible' : 'hidden',
                margin: 0
              }}>{cleanDescription(property.description) || "No description provided."}</p>
              {(cleanDescription(property.description) || '').length > 200 && (
                <button onClick={() => setDescExpanded(e => !e)} style={{ marginTop: '6px', background: 'none', border: 'none', color: '#c98b3e', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}>
                  {descExpanded ? 'Show less ▲' : 'Read more ▼'}
                </button>
              )}
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
                      showDeposit={!!(isOvikaOwnProperty && !isNightlyOfferProperty && pricingMode !== 'monthly')}
                      depositAmount={displayBasePrice}
                      showMonthlyDeposit={!!(isOvikaMonthlyProperty && pricingMode === 'monthly')}
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
                      hideDeposit={isNightlyOfferProperty}
                    />
                  </>
                )}
              </div>
            </>
          )}

          {/* S3: PG / HOSTEL — monthly only (hide for nightly PG) */}
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
                        {(() => {
                          if (pricingMode === 'monthly') {
                            const minMonthly = Math.min(...property.parsedBedrooms.map(r => Number(r.price) || Infinity).filter(p => p < Infinity));
                            return minMonthly < Infinity ? `₹${minMonthly.toLocaleString('en-IN')}/month` : 'On Request';
                          } else {
                            const propNightly = Number(property.meta?.perNightPrice) || 0;
                            const minNightly = Math.min(...property.parsedBedrooms.map(r => Number(r.perNightPrice) || Number(r.nightlyPrice) || propNightly || Infinity).filter(p => p < Infinity));
                            return minNightly < Infinity ? `₹${minNightly.toLocaleString('en-IN')}/night` : 'On Request';
                          }
                        })()}
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="rm-table-outer">
                  <table className="rm-table">
                    <thead>
                      <tr>
                        <th className="rm-th rm-th--room">Room Type</th>
                        <th className="rm-th">Bathroom</th>
                        <th className="rm-th">Area</th>
                        <th className="rm-th rm-th--price">{pricingMode === 'monthly' ? 'Price / Month' : 'Price / Night'}</th>
                        <th className="rm-th">Available</th>
                        <th className="rm-th rm-th--action"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {property.parsedBedrooms.map((room, i) => {
                        // For nightly: only use nightly-specific prices, NOT monthly price as fallback
                        const propertyNightlyPrice = Number(property.meta?.perNightPrice) || 0;
                        const displayPrice = pricingMode === 'monthly'
                          ? (Number(room.price) || 0)
                          : (Number(room.perNightPrice) || Number(room.nightlyPrice) || propertyNightlyPrice);
                        const priceUnit = pricingMode === 'monthly' ? '/mo' : '/night';
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
                                    {!room.bedType && !room.ac && !room.furnished && <span className="rm-tag">Standard</span>}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="rm-td"><BathBadge attached={room.attachedBathroom} /></td>
                            <td className="rm-td"><span className="rm-area-val">{room.areaSqFt ? `${room.areaSqFt} sqft` : '—'}</span></td>
                            <td className="rm-td rm-td--price">
                              {displayPrice > 0 ? (
                                <div className="rm-price-cell">
                                  <div style={{ display:'flex', alignItems:'baseline', gap:'2px' }}>
                                    <span className="rm-price-main">₹{displayPrice.toLocaleString('en-IN')}</span>
                                    <span className="rm-price-unit">{priceUnit}</span>
                                  </div>
                                  {pricingMode === 'monthly' && room.securityDeposit && (
                                    <div className="rm-deposit">Security Deposit: ₹{Number(room.securityDeposit).toLocaleString('en-IN')}</div>
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
                  pricingMode={pricingMode}
                  propertyPrice={0}
                  onBookNow={handleRoomBookNow}
                  onEnquire={null}
                  showEnquire={false}
                  hideDeposit={isNightlyOfferProperty}
                />
              </div>
            </>
          )}

          {/* NIGHTLY PG — stay details highlights (no room table, it's confusing for nightly PG) */}
          {isPG && pricingMode !== 'monthly' && (
            <>
              <div className="divider"></div>
              <div className="text-section">
                <div className="rm-section-header">
                  <div className="rm-section-left">
                    <span className="rm-pill">Stay Details</span>
                    <h3 className="rm-section-title">Nightly Stay Info</h3>
                    <p style={{ fontSize:'0.82rem', color:'#64748b', margin:'2px 0 0' }}>Key details for your stay</p>
                  </div>
                </div>
                <div className="nightly-stay-grid">
                  {(Number(property.meta?.perNightPrice) > 0 || Number(property.price) > 0) && (
                    <div className="amenity-card rule-card">
                      <div className="rule-icon"><MdCurrencyRupee color="#c98b3e" size={18} /></div>
                      <div className="rule-info"><span className="rule-label">Price / Night</span><span>₹{formatCurrency(Number(property.meta?.perNightPrice) || Number(property.price))}</span></div>
                    </div>
                  )}
                  {(property.check_in_time || property.meta?.check_in_time) && (
                    <div className="amenity-card rule-card">
                      <div className="rule-icon"><Clock size={18} color="#6366f1" /></div>
                      <div className="rule-info"><span className="rule-label">Check-In</span><span>{formatTime12h(property.check_in_time || property.meta?.check_in_time)}</span></div>
                    </div>
                  )}
                  {(property.check_out_time || property.meta?.check_out_time) && (
                    <div className="amenity-card rule-card">
                      <div className="rule-icon"><Clock size={18} color="#16a34a" /></div>
                      <div className="rule-info"><span className="rule-label">Check-Out</span><span>{formatTime12h(property.check_out_time || property.meta?.check_out_time)}</span></div>
                    </div>
                  )}
                  {(property.securityDeposit > 0 || (isOvikaOwnProperty && !isNightlyOfferProperty)) && (
                    <div className="amenity-card rule-card">
                      <div className="rule-icon"><FiLock color="#8b0000" size={18} /></div>
                      <div className="rule-info">
                        <span className="rule-label">Security Deposit</span>
                        <span>{isOvikaOwnProperty ? '1 night\'s rent' : `₹${formatCurrency(property.securityDeposit)}`}</span>
                        <span style={{ fontSize:'0.68rem', color:'#16a34a', display:'block' }}>Refundable</span>
                      </div>
                    </div>
                  )}
                  {property.area && (
                    <div className="amenity-card rule-card">
                      <div className="rule-icon"><BiArea color="#94a3b8" size={18} /></div>
                      <div className="rule-info"><span className="rule-label">Area</span><span>{property.area} sqft</span></div>
                    </div>
                  )}
                  {property.facing && (
                    <div className="amenity-card rule-card">
                      <div className="rule-icon"><FiCompass color="#6366f1" size={18} /></div>
                      <div className="rule-info"><span className="rule-label">Facing</span><span>{property.facing}</span></div>
                    </div>
                  )}
                  {property.carParking && (
                    <div className="amenity-card rule-card">
                      <div className="rule-icon"><Car size={18} color="#334155" /></div>
                      <div className="rule-info"><span className="rule-label">Parking</span><span>{property.carParking}</span></div>
                    </div>
                  )}
                  {(property.availableFrom || property.meta?.availableFrom) && (
                    <div className="amenity-card rule-card">
                      <div className="rule-icon"><FiCalendar color="#0ea5e9" size={18} /></div>
                      <div className="rule-info"><span className="rule-label">Available From</span><span>{new Date(property.availableFrom || property.meta?.availableFrom).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span></div>
                    </div>
                  )}
                  {(property.electricityCharges || property.meta?.electricityCharges) && (
                    <div className="amenity-card rule-card">
                      <div className="rule-icon"><FiZap color="#eab308" size={18} /></div>
                      <div className="rule-info"><span className="rule-label">Electricity</span><span>{property.electricityCharges || property.meta?.electricityCharges}</span></div>
                    </div>
                  )}
                  {(property.gateClosingTime || property.meta?.gateClosingTime) && (
                    <div className="amenity-card rule-card">
                      <div className="rule-icon"><Clock size={18} color="#ef4444" /></div>
                      <div className="rule-info"><span className="rule-label">Gate Closing</span><span>{property.gateClosingTime || property.meta?.gateClosingTime}</span></div>
                    </div>
                  )}
                  {(property.noticePeriod != null || property.meta?.noticePeriod != null) && (
                    <div className="amenity-card rule-card">
                      <div className="rule-icon"><FiInfo style={{ color: '#3b82f6' }} size={18} /></div>
                      <div className="rule-info"><span className="rule-label">Notice Period</span><span>{Number(property.noticePeriod ?? property.meta?.noticePeriod) === 0 ? 'Nil' : `${property.noticePeriod ?? property.meta?.noticePeriod} Days`}</span></div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Building & Infrastructure */}
          {(property.waterSupply || property.electricityStatus || property.floorType || property.propertyAge || property.floorNo) && (
            <>
              <div className="divider"></div>
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
              <div className="divider"></div>
              <div className="text-section">
                <h3>Financials & Availability</h3>
                <div className="amenities-grid">
                  {property.securityDeposit && <div className="amenity-card rule-card"><div className="rule-icon"><FiLock color="#8b0000" /></div><div className="rule-info"><span className="rule-label">Security Deposit</span><strong>₹{formatCurrency(property.securityDeposit)}</strong><span style={{ fontSize:'0.72rem', color:'#16a34a', marginTop:'2px', display:'block' }}>Refundable</span></div></div>}
                  {property.maintenanceCharge && <div className="amenity-card rule-card"><div className="rule-icon"><CreditCard size={18} color="#0ea5e9" /></div><div className="rule-info"><span className="rule-label">Maintenance</span><strong>₹{formatCurrency(property.maintenanceCharge)} ({property.maintenanceCycle || 'Monthly'})</strong></div></div>}
                  {property.availableFrom && <div className="amenity-card rule-card"><div className="rule-icon"><FiCalendar color="#16a34a" /></div><div className="rule-info"><span className="rule-label">Available From</span><strong>{new Date(property.availableFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></div></div>}
                </div>
              </div>
            </>
          )}

          {/* ── Amenities & Features ── */}
          <div className="divider"></div>
          <div className="text-section">
            <h3>Amenities &amp; features</h3>
            {Object.entries(groupedAmenities).length > 0 ? (
              <div className="pdp-amenities-box">
                <div className="pdp-checklist">
                  {Object.values(groupedAmenities).flat().map((am, i) => (
                    <div key={i} className="pdp-checklist-item">
                      {getAmenityIcon(am)}
                      <span>{am}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>No amenities listed.</p>}
          </div>

          {/* ── House Rules + Local Guide — side by side ── */}
          <div className="divider"></div>
          <div className="pdp-rules-guide-row">

            {/* Left: House Rules */}
            <div className="text-section" style={{ marginBottom: 0 }}>
              <h3>House rules &amp; policies</h3>
              <div className="pdp-rules-grid2">
                {(() => { const v = !!(property.smoking_allowed || property.smokingAllowed || property.meta?.smokingAllowed || pgHouseRules.includes('Smoking Allowed')); return <div className="pdp-rule-card2"><div className="pdp-rule-icon2">{getRuleIcon('Smoking', v)}</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Smoking</span><span className="pdp-rule-val2">{v ? 'Allowed' : 'Not allowed'}</span></div></div>; })()}
                {(() => { const v = !!(property.pets_allowed || property.petsAllowed || property.meta?.petsAllowed || pgHouseRules.includes('Pets Allowed')); return <div className="pdp-rule-card2"><div className="pdp-rule-icon2">{getRuleIcon('Pets', v)}</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Pets</span><span className="pdp-rule-val2">{v ? 'Allowed' : 'Not allowed'}</span></div></div>; })()}
                {(() => { const v = !!(property.events_allowed || property.eventsAllowed || property.meta?.eventsAllowed || pgHouseRules.includes('Events Allowed')); return <div className="pdp-rule-card2"><div className="pdp-rule-icon2">{getRuleIcon('Events', v)}</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Events</span><span className="pdp-rule-val2">{v ? 'Allowed' : 'Not allowed'}</span></div></div>; })()}
                {(() => { const v = !!(property.drinking_alcohol || property.drinking_allowed || property.drinkingAllowed || property.meta?.drinkingAllowed || pgHouseRules.includes('Drinking Allowed')); return <div className="pdp-rule-card2"><div className="pdp-rule-icon2">{getRuleIcon('Alcohol', v)}</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Alcohol</span><span className="pdp-rule-val2">{v ? 'Allowed' : 'Not allowed'}</span></div></div>; })()}
                {!isPG && (() => { const v = !!guestPolicy.family_allowed; return <div className="pdp-rule-card2"><div className="pdp-rule-icon2">{getRuleIcon('Family', v)}</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Family</span><span className="pdp-rule-val2">{v ? 'Allowed' : 'Not allowed'}</span></div></div>; })()}
                {(() => { const v = !!(guestPolicy.unmarried_couple_allowed || pgHouseRules.includes('Couple Friendly') || pgHouseRules.includes('Girlfriend/Boyfriend Entry Allowed')); return <div className="pdp-rule-card2"><div className="pdp-rule-icon2">{getRuleIcon('Couples', v)}</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Couples</span><span className="pdp-rule-val2">{v ? 'Allowed' : 'Not allowed'}</span></div></div>; })()}
                {(() => { const v = pgHouseRules.includes('Late Entry Allowed'); return <div className="pdp-rule-card2"><div className="pdp-rule-icon2">{getRuleIcon('Late Entry', v)}</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Late Entry</span><span className="pdp-rule-val2">{v ? 'Allowed' : 'Not allowed'}</span></div></div>; })()}
                {(() => { const v = pgHouseRules.includes('Friends Allowed'); return <div className="pdp-rule-card2"><div className="pdp-rule-icon2">{getRuleIcon('Visitors/Friends', v)}</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Visitors/Friends</span><span className="pdp-rule-val2">{v ? 'Allowed' : 'Not allowed'}</span></div></div>; })()}
                {(pgHouseRules.includes('Veg Only') || pgHouseRules.includes('Non-Veg Allowed')) && (
                  <div className="pdp-rule-card2"><div className="pdp-rule-icon2">{getRuleIcon('Food', true)}</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Food</span><span className="pdp-rule-val2">{pgHouseRules.includes('Veg Only') ? 'Veg Only' : 'Non-Veg Allowed'}</span></div></div>
                )}
                {preferredTenants.filter(t => t !== 'No Preference').map((t, i) => (
                  <div key={i} className="pdp-rule-card2">
                    <div className="pdp-rule-icon2">{getRuleIcon('Preferred Tenants', true)}</div>
                    <div className="pdp-rule-info2">
                      <span className="pdp-rule-lbl2">Preferred Tenants</span>
                      <span className="pdp-rule-val2">{t}</span>
                    </div>
                  </div>
                ))}
              </div>
              {((property.cancellation_policy && property.cancellation_policy !== 'undefined') || guestPolicy.cancellationPolicy) && (
                <div style={{ marginTop: '10px', padding: '8px 12px', background: '#fffbf5', borderRadius: '8px', border: '1px solid #ddd0c0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#374151' }}><strong>Cancellation:</strong> {property.cancellation_policy || guestPolicy.cancellationPolicy}</span>
                  <a href="/refund-cancellation-policy" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#c98b3e', fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 'auto' }}>Read full policy</a>
                </div>
              )}
            </div>

            {/* Local Guide */}
            <div className="divider"></div>
            <div className="text-section" style={{ marginBottom: 0 }}>
              {(() => {
                let gb = property?.guidebook;
                if (typeof gb === 'string') { try { gb = JSON.parse(gb); } catch { gb = null; } }
                if (typeof gb === 'string') { try { gb = JSON.parse(gb); } catch { gb = null; } }
                if (!gb || typeof gb !== 'object' || Array.isArray(gb)) return null;
                const hasValue = (v) => { if (v === null || v === undefined || v === '') return false; if (Array.isArray(v)) return v.length > 0; if (typeof v === 'object') return Object.values(v).some(x => x !== null && x !== undefined && x !== ''); return true; };
                const keys = Object.keys(gb).filter(k => hasValue(gb[k]));
                if (keys.length === 0) return null;
                const renderVal = (val) => { if (val === null || val === undefined) return null; if (typeof val === 'string' || typeof val === 'number') return String(val); if (Array.isArray(val)) return val.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join(', '); if (typeof val === 'object') return Object.entries(val).map(([k,v]) => `${k}: ${v}`).join(' · '); return String(val); };
                const ICON_MAP = { transport_tips: '🚌', cafes_restaurants: '☕', essentials_nearby: '🛒', house_specific_tips: '💡', must_visit: '📍', must_visit_places: '📍' };
                const COUNT_LABEL = { transport_tips: 'routes', cafes_restaurants: 'nearby', essentials_nearby: 'spots', house_specific_tips: 'tips', must_visit: 'highlight', must_visit_places: 'highlight' };
                return (
                  <>
                    <h3>Local guide</h3>
                    <div className="gbGrid">
                      {keys.map(key => {
                        const val = gb[key];
                        const label = key.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
                        const icon = ICON_MAP[key] || '📌';
                        if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object') {
                          const cols = Object.keys(val[0]);
                          return (
                            <div key={key} className="gbCard gbCardWide">
                              <div className="gbCardHeader">
                                <div className="gbIconWrap" style={{ fontSize: '0.9rem' }}>{icon}</div>
                                <div className="gbCardHeaderText"><div className="gbCardTitle">{label}</div><div className="gbCardMeta">{val.length} {COUNT_LABEL[key] || 'items'}</div></div>
                              </div>
                              <div className="gbTableWrap">
                                <table className="gbTable">
                                  <tbody>{val.map((item, idx) => <tr key={idx}>{cols.map((c,ci) => <td key={c} className={ci > 0 ? 'gbTdRight' : 'gbTdName'}>{item[c] ?? '-'}</td>)}</tr>)}</tbody>
                                </table>
                              </div>
                            </div>
                          );
                        }
                        if (Array.isArray(val) && val.length > 0) {
                          return (
                            <div key={key} className="gbCard gbCardWide">
                              <div className="gbCardHeader">
                                <div className="gbIconWrap" style={{ fontSize: '0.9rem' }}>{icon}</div>
                                <div className="gbCardHeaderText"><div className="gbCardTitle">{label}</div><div className="gbCardMeta">{val.length} {COUNT_LABEL[key] || 'items'}</div></div>
                              </div>
                              <ul className="gbTips">{val.map((tip,idx)=><li key={idx} className="gbTip"><span className="gbTipDot"/><span className="gbTipText">{typeof tip==='object'?JSON.stringify(tip):String(tip)}</span></li>)}</ul>
                            </div>
                          );
                        }
                        if (typeof val === 'object' && !Array.isArray(val)) {
                          const entries = Object.entries(val).filter(([,v])=>v);
                          if (entries.length===0) return null;
                          return (
                            <div key={key} className="gbCard gbCardWide">
                              <div className="gbCardHeader">
                                <div className="gbIconWrap" style={{ fontSize: '0.9rem' }}>{icon}</div>
                                <div className="gbCardHeaderText"><div className="gbCardTitle">{label}</div><div className="gbCardMeta">{entries.length} {COUNT_LABEL[key] || 'spots'}</div></div>
                              </div>
                              <div className="gbRows">{entries.map(([k,v])=><div key={k} className="gbRow"><div className="gbRowLeft"><span className="gbRowLabel">{k.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</span></div><div className="gbRowValue">{renderVal(v)}</div></div>)}</div>
                            </div>
                          );
                        }
                        const text = renderVal(val);
                        if (!text) return null;
                        return (
                          <div key={key} className="gbCard gbCardWide">
                            <div className="gbCardHeader">
                              <div className="gbIconWrap" style={{ fontSize: '0.9rem' }}>{icon}</div>
                              <div className="gbCardHeaderText"><div className="gbCardTitle">{label}</div></div>
                            </div>
                            <div className="gbRows"><div className="gbRow"><div className="gbRowValue">{text}</div></div></div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

        </div>

        {/* ── RIGHT SIDEBAR — sticky booking card + host ── */}
        <div className="booking-sidebar">
          {(isPG && pricingMode === 'monthly') && (
            <div className="booking-card">
              <div className="card-header">
                <div className="price-area">
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span className="amount">
                        ₹{formatCurrency(
                          (() => {
                            const prices = property.parsedBedrooms?.map(r => Number(r.price) || Infinity).filter(p => p < Infinity) ?? [];
                            return prices.length > 0 ? Math.min(...prices) : (displayBasePrice || 0);
                          })()
                        )}
                      </span>
                      <span className="unit">/month</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>Starting price</span>
                  </div>
                </div>
              </div>
              <div style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#64748b', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                  <FiInfo size={14} />
                  <span>Select a room from the table to book</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Each room has its own pricing & availability</div>
              </div>
              <div className="card-footer">
                <FiShield className="shield-icon"/>
                <span>Secure Booking Guaranteed</span>
              </div>
            </div>
          )}
          {!(isPG && pricingMode === 'monthly') && (
            <div className="booking-card">
              <div className="card-header">
                <div className="price-area">
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      {couponApplied && isNightlyOfferProperty && (
                        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through' }}>
                          ₹{formatCurrency(displayBasePrice)}
                        </span>
                      )}
                      <span className="amount">₹{formatCurrency(isNightlyOfferProperty ? nightlyEffectivePrice : displayBasePrice)}</span>
                      <span className="unit">/{pricingMode === 'monthly' ? 'month' : (property.billing_cycle || 'night')}</span>
                    </div>
                    {showDistinctRoomPrices && (
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', marginTop: '2px' }}>
                        {selectedPrice ? `Selected room: ₹${formatCurrency(selectedPrice)}` : `Starts at ₹${formatCurrency(displayBasePrice)}/${pricingMode === 'monthly' ? 'month' : 'night'}`}
                      </span>
                    )}
                  </div>
                </div>
                {pdpOriginalPrice > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'line-through' }}>₹{formatCurrency(pdpOriginalPrice)}</span>
                    <div style={{ background: '#15803d', color: '#fff', fontSize: '0.68rem', fontWeight: 600, padding: '2px 7px', borderRadius: '4px' }}>{pdpActualPct}% OFF</div>
                    {couponApplied && isNightlyOfferProperty && (
                      <div style={{ background: '#7c3aed', color: '#fff', fontSize: '0.68rem', fontWeight: 600, padding: '2px 7px', borderRadius: '4px' }}>-₹500 COUPON</div>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="booking-details">
                <div className="date-picker-mock">
                  <div className="date-box">
                    <label>{pricingMode === 'monthly' ? 'CHECK-IN TIME' : 'CHECK-IN'}</label>
                    <span>{formData.checkInDate ? new Date(formData.checkInDate).toLocaleDateString() : (formatTime12h(property.check_in_time) || 'Select Date')}</span>
                  </div>
                  <div className="date-box">
                    <label>{pricingMode === 'monthly' ? 'NOTICE PERIOD' : 'CHECK-OUT TIME'}</label>
                    <span>{pricingMode === 'monthly' ? (() => { const np = property.noticePeriod ?? property.meta?.noticePeriod; return (property.property_name?.toLowerCase().includes('signature') || Number(np) === 0) ? 'Nil' : `${np || 30} Days`; })() : formatTime12h(property.check_out_time || property.meta?.check_out_time || '11:00')}</span>
                  </div>
                </div>

                <div style={{ margin: '1rem 0' }}>
                  <button className="reserve-btn" onClick={handleReserveClick}>
                    {pricingMode === 'monthly' && !isOvikaOwnProperty
                      ? 'Enquire Now'
                      : bookingType === 1 && pricingMode !== 'monthly' && bookingRequestStatus !== 'accepted'
                        ? 'Send Booking Request'
                        : 'Book Now'}
                  </button>
                  <p className="hint" style={{ marginBottom: '8px' }}>
                    {pricingMode === 'monthly' && !isOvikaOwnProperty
                      ? 'Our team will contact you shortly'
                      : bookingType === 1 && pricingMode !== 'monthly' && bookingRequestStatus !== 'accepted'
                        ? 'Request needed first'
                        : "You won't be charged yet"}
                  </p>
                  {(property.securityDeposit > 0 || (isOvikaOwnProperty && !isNightlyOfferProperty) || isOvikaMonthlyProperty) && (
                    <div style={{ display:'flex', alignItems:'center', gap:'5px', padding:'6px 10px', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'6px', fontSize:'0.75rem', color:'#166534' }}>
                      <FiLock size={12} />
                      <span>
                        Security Deposit:{' '}
                        {pricingMode === 'monthly'
                          ? (isOvikaMonthlyProperty ? `1 Month's Rent` : property.securityDeposit > 0 ? `₹${formatCurrency(property.securityDeposit)}` : 'As applicable')
                          : (isOvikaOwnProperty ? `1 night's rent` : `₹${formatCurrency(property.securityDeposit)}`)}
                        {' '}(Refundable)
                      </span>
                    </div>
                  )}
                  {isNightlyOfferProperty && (
                    <div style={{ marginTop: '10px' }}>
                      {!couponApplied ? (
                        <>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <input
                              type="text"
                              value={couponInput}
                              onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                              placeholder="Apply coupon"
                              style={{ flex: 1, padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.8rem', outline: 'none' }}
                            />
                            <button
                              onClick={() => {
                                if (couponInput === 'OVIKA500') {
                                  setCouponApplied(true);
                                  setCouponError('');
                                } else {
                                  setCouponApplied(false);
                                  setCouponError('Invalid coupon code');
                                }
                              }}
                              style={{ padding: '7px 12px', background: '#b45309', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >Apply</button>
                          </div>
                          {couponError && (
                            <div style={{ marginTop: '5px', fontSize: '0.75rem', color: '#dc2626' }}>{couponError}</div>
                          )}
                        </>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '6px', padding: '8px 12px' }}>
                          <span style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 600 }}>✓ OVIKA500 — ₹500/night off!</span>
                          <button
                            onClick={() => { setCouponApplied(false); setCouponInput(''); setCouponError(''); }}
                            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, padding: '0 4px' }}
                          >✕ Remove</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {bookingType === 1 && (
                  <div style={{ padding: '10px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '6px', fontSize: '0.8rem', color: '#92400e' }}>
                    {bookingRequestStatus === 'pending' ? (
                      <span>⏳ Request Pending — Waiting for owner approval.</span>
                    ) : bookingRequestStatus === 'accepted' ? (
                      <span>✅ Request Accepted! — Proceed to book.</span>
                    ) : (
                      <span>⚠️ Owner approval required — Send a request first.</span>
                    )}
                  </div>
                )}
              </div>

              <div className="card-footer">
                <FiShield className="shield-icon"/>
                <span>Secure Booking Guaranteed</span>
              </div>
            </div>
          )}

          {/* Host Card */}
          <div className="host-card" style={{ cursor: 'default' }}>
            <div className="host-avatar">
              {hostImage
                ? <img src={hostImage} alt="Host" className="host-img" />
                : <span className="host-initial">
                    {(hostUser?.name || property.property_name || 'H').charAt(0).toUpperCase()}
                  </span>
              }
            </div>
            <div className="host-info" style={{ flex: 1, minWidth: 0 }}>
              <div className="host-label">Hosted by</div>
              <h4 className="host-name">{hostUser?.name || property.property_name || 'Property Host'}</h4>
              <p className="host-sub">
                Property Owner
                {(property.view || property.property_view) && <> · {property.view || property.property_view}</>}
              </p>
            </div>
            <div className="pdp-host-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          {/* ── Location Card ── */}
          <div className="pdp-location-card">
            <h3 className="pdp-location-title">Location</h3>
            <p className="pdp-location-addr">{[property.city, property.address].filter(Boolean).join(', ')}</p>
            <div className="pdp-map-wrap" style={{ position: 'relative' }}>
              <iframe
                title="Property Location"
                src={
                  property.latitude && property.longitude
                    ? `https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`
                    : `https://maps.google.com/maps?q=${encodeURIComponent([property.address, property.city, 'India'].filter(Boolean).join(', '))}&z=15&output=embed`
                }
                width="100%"
                height="200"
                style={{ border: 0, borderRadius: 10, display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* Block all clicks on the iframe — prevents "Open in Maps" redirect */}
              <div style={{ position: 'absolute', inset: 0, borderRadius: 10, cursor: 'default' }} onClick={() => setShowMapModal(true)} />
            </div>
            <button onClick={() => setShowMapModal(true)} className="pdp-map-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              View on map
            </button>
          </div>

          {/* ── Map Modal (stays on OvikaLiving) ── */}
          {showMapModal && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 999999, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setShowMapModal(false)}>
              <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 640, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #f0e8da' }}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a1209' }}>Location</div>
                    <div style={{ fontSize: '0.78rem', color: '#9a8472', marginTop: 2 }}>{[property.city, property.address].filter(Boolean).join(', ')}</div>
                  </div>
                  <button onClick={() => setShowMapModal(false)} style={{ border: 'none', background: '#f3f0eb', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#555' }}>✕</button>
                </div>
                {/* Map with overlay to block external links */}
                <div style={{ position: 'relative' }}>
                  <iframe
                    title="Property Location Full"
                    src={
                      property.latitude && property.longitude
                        ? `https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=16&output=embed`
                        : `https://maps.google.com/maps?q=${encodeURIComponent([property.address, property.city, 'India'].filter(Boolean).join(', '))}&z=16&output=embed`
                    }
                    width="100%"
                    height="420"
                    style={{ border: 0, display: 'block' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div style={{ position: 'absolute', inset: 0, cursor: 'default' }} />
                </div>
              </div>
            </div>
          )}

          {/* ── Good to Know ── */}
          <div className="pdp-g2k-card">
            <h3 className="pdp-g2k-title">Good to know</h3>
            <div className="pdp-g2k-list">
              <div className="pdp-g2k-row">
                <div className="pdp-g2k-icon-circle">🕐</div>
                <div>
                  <div className="pdp-g2k-label-main">Flexible cancellation</div>
                  <div className="pdp-g2k-label">Free until 24h before check-in</div>
                </div>
              </div>
              <div className="pdp-g2k-row">
                <div className="pdp-g2k-icon-circle">⚡</div>
                <div>
                  <div className="pdp-g2k-label-main">Instant confirmation</div>
                  <div className="pdp-g2k-label">Booking confirmed right away</div>
                </div>
              </div>
              <div className="pdp-g2k-row">
                <div className="pdp-g2k-icon-circle">🪪</div>
                <div>
                  <div className="pdp-g2k-label-main">Valid ID required</div>
                  <div className="pdp-g2k-label">Govt. photo ID at check-in</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Need Help card ── */}
          <div className="pdp-need-help-card">
            <h3 className="pdp-g2k-title" style={{ marginBottom: 14 }}>Need help?</h3>
            <div className="pdp-need-help-row">
              <a href="https://wa.me/919319392227" target="_blank" rel="noopener noreferrer" className="pdp-help-btn">
                <div className="pdp-help-icon-wrap" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.528 5.847L0 24l6.335-1.508A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                </div>
                <div>
                  <div className="pdp-help-title">WhatsApp</div>
                  <div className="pdp-help-sub">Replies in minutes</div>
                </div>
              </a>
              <a href="tel:+919319392227" className="pdp-help-btn">
                <div className="pdp-help-icon-wrap" style={{ background: '#fff8f0', border: '1px solid #f0d9b5' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c2772b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.02 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                </div>
                <div>
                  <div className="pdp-help-title">Call us</div>
                  <div className="pdp-help-sub">+91 99XXX XXXXX</div>
                </div>
              </a>
            </div>
          </div>

          {/* ── Safety card ── */}
          <div className="pdp-safe-card">
            <h3 className="pdp-g2k-title" style={{ marginBottom: 14 }}>Safe &amp; secure</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: '🛡️', text: 'Secure payment gateway' },
                { icon: '✅', text: 'Verified properties only' },
                { icon: '🕐', text: '24x7 support, always' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.82rem', color: '#374151', fontWeight: 500 }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>{/* end content-grid */}

      {/* ── Full-width Customer Reviews ── */}
      <div className="pdp-reviews-fullwidth">
        <PropertyReviews
          propertyId={id}
          propertyRating={(() => {
            const FIVE_STAR_IDS = [77, 78, 79, 80, 81, 315, 316, 317, 323];
            if (FIVE_STAR_IDS.includes(Number(id))) return '5.0';
            return (4.1 + ((Number(id) * 13 + 7) % 9) / 10).toFixed(1);
          })()}
        />
      </div>

      {/* ── Mobile Sticky Bottom Bar ── */}
      <div className="pdp-mobile-sticky-bar">
        <div className="pdp-msb-left">
          <div className="pdp-msb-price-row">
            <span className="pdp-msb-amount">₹{formatCurrency(isNightlyOfferProperty ? nightlyEffectivePrice : displayBasePrice)}</span>
            {pdpOriginalPrice > 0 && pricingMode !== 'monthly' && (
              <span className="pdp-msb-original">₹{formatCurrency(pdpOriginalPrice)}</span>
            )}
            {pdpActualPct > 0 && pricingMode !== 'monthly' && (
              <span className="pdp-msb-badge">{pdpActualPct}% OFF</span>
            )}
          </div>
          <div className="pdp-msb-sub">
            per {pricingMode === 'monthly' ? 'month' : 'night'}
            {pricingMode !== 'monthly' && ' · Free cancellation'}
          </div>
        </div>
        <button className="pdp-msb-btn" onClick={handleReserveClick}>
          {pricingMode === 'monthly' && !isOvikaOwnProperty ? 'Enquire Now' : 'Book Now'}
        </button>
      </div>

      {/* OLD full-width sections removed — now inside details-column */}
      <div className="amenities-rules-row" style={{ display:'none' }}>
        <div className="amenities-rules-col">
          <h3>Amenities & Features</h3>
          {Object.entries(groupedAmenities).length > 0 ? (
            <div className="rules-grid amenities-card-grid">
              {Object.values(groupedAmenities).flat().map((am, i) => (
                <div key={i} className="amenity-card rule-card">
                  <div className="rule-icon"><FiCheck className="text-green" /></div>
                  <div className="rule-info"><strong>{am}</strong></div>
                </div>
              ))}
            </div>
          ) : <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>No amenities listed.</p>}
        </div>

        <div className="amenities-rules-divider"></div>

        <div className="amenities-rules-col">
          <h3>House Rules & Policies</h3>
          <div className="rules-grid">
            <div className="amenity-card rule-card"><div className="rule-icon">{(property.smoking_allowed || property.smokingAllowed || property.meta?.smokingAllowed || pgHouseRules.includes('Smoking Allowed')) ? <FiCheck className="text-green" /> : <FiXCircle className="text-red" />}</div><div className="rule-info"><span className="rule-label">Smoking</span><strong>{(property.smoking_allowed || property.smokingAllowed || property.meta?.smokingAllowed || pgHouseRules.includes('Smoking Allowed')) ? 'Allowed' : 'Not allowed'}</strong></div></div>
            <div className="amenity-card rule-card"><div className="rule-icon">{(property.pets_allowed || property.petsAllowed || property.meta?.petsAllowed || pgHouseRules.includes('Pets Allowed')) ? <FiCheck className="text-green" /> : <FiXCircle className="text-red" />}</div><div className="rule-info"><span className="rule-label">Pets</span><strong>{(property.pets_allowed || property.petsAllowed || property.meta?.petsAllowed || pgHouseRules.includes('Pets Allowed')) ? 'Allowed' : 'Not allowed'}</strong></div></div>
            <div className="amenity-card rule-card"><div className="rule-icon">{(property.events_allowed || property.eventsAllowed || property.meta?.eventsAllowed || pgHouseRules.includes('Events Allowed')) ? <FiCheck className="text-green" /> : <FiXCircle className="text-red" />}</div><div className="rule-info"><span className="rule-label">Events</span><strong>{(property.events_allowed || property.eventsAllowed || property.meta?.eventsAllowed || pgHouseRules.includes('Events Allowed')) ? 'Allowed' : 'Not allowed'}</strong></div></div>
            <div className="amenity-card rule-card"><div className="rule-icon">{(property.drinking_alcohol || property.drinking_allowed || property.drinkingAllowed || property.meta?.drinkingAllowed || pgHouseRules.includes('Drinking Allowed')) ? <FiCheck className="text-green" /> : <FiXCircle className="text-red" />}</div><div className="rule-info"><span className="rule-label">Alcohol</span><strong>{(property.drinking_alcohol || property.drinking_allowed || property.drinkingAllowed || property.meta?.drinkingAllowed || pgHouseRules.includes('Drinking Allowed')) ? 'Allowed' : 'Not allowed'}</strong></div></div>
            {!isPG && <div className="amenity-card rule-card"><div className="rule-icon">{guestPolicy.family_allowed ? <FiCheck className="text-green" /> : <FiXCircle className="text-red" />}</div><div className="rule-info"><span className="rule-label">Family</span><strong>{guestPolicy.family_allowed ? 'Allowed' : 'Not allowed'}</strong></div></div>}
            <div className="amenity-card rule-card"><div className="rule-icon">{(guestPolicy.unmarried_couple_allowed || pgHouseRules.includes('Couple Friendly') || pgHouseRules.includes('Girlfriend/Boyfriend Entry Allowed')) ? <FiCheck className="text-green" /> : <FiXCircle className="text-red" />}</div><div className="rule-info"><span className="rule-label">Couples</span><strong>{(guestPolicy.unmarried_couple_allowed || pgHouseRules.includes('Couple Friendly') || pgHouseRules.includes('Girlfriend/Boyfriend Entry Allowed')) ? 'Allowed' : 'Not allowed'}</strong></div></div>
            <div className="amenity-card rule-card"><div className="rule-icon">{pgHouseRules.includes('Late Entry Allowed') ? <FiCheck className="text-green" /> : <FiXCircle className="text-red" />}</div><div className="rule-info"><span className="rule-label">Late Entry</span><strong>{pgHouseRules.includes('Late Entry Allowed') ? 'Allowed' : 'Not allowed'}</strong></div></div>
            <div className="amenity-card rule-card"><div className="rule-icon">{pgHouseRules.includes('Friends Allowed') ? <FiCheck className="text-green" /> : <FiXCircle className="text-red" />}</div><div className="rule-info"><span className="rule-label">Visitors/Friends</span><strong>{pgHouseRules.includes('Friends Allowed') ? 'Allowed' : 'Not allowed'}</strong></div></div>
            {(pgHouseRules.includes('Veg Only') || pgHouseRules.includes('Non-Veg Allowed')) && (
              <div className="amenity-card rule-card"><div className="rule-icon"><FiCheck className="text-green" /></div><div className="rule-info"><span className="rule-label">Food</span><strong>{pgHouseRules.includes('Veg Only') ? 'Veg Only' : 'Non-Veg Allowed'}</strong></div></div>
            )}
            {isPG && !preferredTenants.some(t => t.includes('Bachelors (Female') || t.includes('Bachelors (Male')) && (guestPolicy.bachelors_allowed != null || guestPolicy.Bechelors != null || property.meta?.bachelorAllowed != null) && (
              <div className="amenity-card rule-card"><div className="rule-icon">{(guestPolicy.bachelors_allowed || guestPolicy.Bechelors || property.meta?.bachelorAllowed) ? <FiCheck className="text-green" /> : <FiXCircle className="text-red" />}</div><div className="rule-info"><span className="rule-label">Bachelor</span><strong>{(guestPolicy.bachelors_allowed || guestPolicy.Bechelors || property.meta?.bachelorAllowed) ? 'Bachelors (Any)' : 'Not allowed'}</strong></div></div>
            )}
            {preferredTenants.filter(t => t !== 'Bachelors (Any)').map((t, i) => (
              <div key={i} className="amenity-card rule-card">
                <div className="rule-icon"><FiCheck className="text-green" /></div>
                <div className="rule-info"><span className="rule-label">Preferred</span><strong>{t}</strong></div>
              </div>
            ))}
            {(property.noticePeriod != null || property.meta?.noticePeriod != null) && <div className="amenity-card rule-card"><div className="rule-icon"><FiInfo style={{ color: '#3b82f6' }} /></div><div className="rule-info"><span className="rule-label">Notice Period</span><strong>{Number(property.noticePeriod ?? property.meta?.noticePeriod) === 0 ? 'Nil' : `${property.noticePeriod ?? property.meta?.noticePeriod} Days`}</strong></div></div>}
            {(property.electricityCharges || property.meta?.electricityCharges) && <div className="amenity-card rule-card"><div className="rule-icon"><FiZap style={{ color: '#eab308' }} /></div><div className="rule-info"><span className="rule-label">Electricity</span><strong>{property.electricityCharges || property.meta?.electricityCharges}</strong></div></div>}
            {(property.gateClosingTime || property.meta?.gateClosingTime) && <div className="amenity-card rule-card"><div className="rule-icon"><Clock size={18} color="#ef4444" /></div><div className="rule-info"><span className="rule-label">Gate Closing</span><strong>{property.gateClosingTime || property.meta?.gateClosingTime}</strong></div></div>}
          </div>
          {((property.cancellation_policy && property.cancellation_policy !== 'undefined') || guestPolicy.cancellationPolicy) && (
            <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.85rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#374151' }}><strong>Cancellation:</strong> {property.cancellation_policy || guestPolicy.cancellationPolicy}</span>
              <a href="/refund-cancellation-policy" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#c98b3e', fontWeight: 700, whiteSpace: 'nowrap' }}>Read policy →</a>
            </div>
          )}
        </div>
      </div>

      {/* ── FULL WIDTH: Local Guide ── moved into details-column ── */}
      {false && (() => {
        // Step 1: get raw value
        let gb = property?.guidebook;
        // Step 2: if still a string (double-encoded), parse it
        if (typeof gb === 'string') { try { gb = JSON.parse(gb); } catch { gb = null; } }
        // Step 3: if string again (triple-encoded edge case), parse once more
        if (typeof gb === 'string') { try { gb = JSON.parse(gb); } catch { gb = null; } }
        // Step 4: must be a non-null, non-array object with at least one key that has real data
        if (!gb || typeof gb !== 'object' || Array.isArray(gb)) return null;
        const hasValue = (v) => {
          if (v === null || v === undefined || v === '') return false;
          if (Array.isArray(v)) return v.length > 0;
          if (typeof v === 'object') return Object.values(v).some(x => x !== null && x !== undefined && x !== '');
          return true;
        };
        const keys = Object.keys(gb).filter(k => hasValue(gb[k]));
        if (keys.length === 0) return null;

        // Helper: render a value as readable text
        const renderVal = (val) => {
          if (val === null || val === undefined) return null;
          if (typeof val === 'string' || typeof val === 'number') return String(val);
          if (Array.isArray(val)) return val.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join(', ');
          if (typeof val === 'object') return Object.entries(val).map(([k,v]) => `${k}: ${v}`).join(' · ');
          return String(val);
        };

        // Known card configs
        const CARD_ICONS = {
          transport_tips: <Car size={16} />,
          cafes_restaurants: <UtensilsCrossed size={16} />,
          essentials_nearby: <ShoppingBasket size={16} />,
          house_specific_tips: <Lightbulb size={16} />,
        };
        const CARD_LABELS = {
          transport_tips: 'Transport Tips',
          cafes_restaurants: 'Cafes & Restaurants',
          essentials_nearby: 'Essentials Nearby',
          house_specific_tips: 'House Tips',
        };

        return (
          <>
            <div className="divider"></div>
            <div className="text-section">
              <h3>Local Guide</h3>
              <div className="gbGrid">
                {keys.map((key) => {
                  const val = gb[key];
                  if (val === null || val === undefined) return null;
                  const label = CARD_LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                  const icon = CARD_ICONS[key] || <FiInfo size={16} />;

                  // Array of objects → table
                  if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object') {
                    const cols = Object.keys(val[0]);
                    return (
                      <div key={key} className="gbCard gbCardWide">
                        <div className="gbCardHeader"><div className="gbIconWrap">{icon}</div><div className="gbCardHeaderText"><div className="gbCardTitle">{label}</div><div className="gbCardMeta">{val.length} items</div></div></div>
                        <div className="gbTableWrap">
                          <table className="gbTable">
                            <thead><tr>{cols.map(c => <th key={c} className={c !== cols[0] ? 'gbThRight' : ''}>{c.replace(/_/g,' ')}</th>)}</tr></thead>
                            <tbody>{val.map((item, idx) => <tr key={idx}>{cols.map((c,ci) => <td key={c} className={ci > 0 ? 'gbTdRight' : 'gbTdName'}>{item[c] ?? '-'}</td>)}</tr>)}</tbody>
                          </table>
                        </div>
                      </div>
                    );
                  }

                  // Array of strings → tips list
                  if (Array.isArray(val) && val.length > 0) {
                    return (
                      <div key={key} className="gbCard gbCardWide">
                        <div className="gbCardHeader"><div className="gbIconWrap">{icon}</div><div className="gbCardHeaderText"><div className="gbCardTitle">{label}</div><div className="gbCardMeta">{val.length} tips</div></div></div>
                        <ul className="gbTips">{val.map((tip, idx) => <li key={idx} className="gbTip"><span className="gbTipDot" /><span className="gbTipText">{typeof tip === 'object' ? JSON.stringify(tip) : String(tip)}</span></li>)}</ul>
                      </div>
                    );
                  }

                  // Object → rows
                  if (typeof val === 'object' && !Array.isArray(val)) {
                    const entries = Object.entries(val).filter(([,v]) => v);
                    if (entries.length === 0) return null;
                    return (
                      <div key={key} className="gbCard">
                        <div className="gbCardHeader"><div className="gbIconWrap">{icon}</div><div className="gbCardHeaderText"><div className="gbCardTitle">{label}</div></div></div>
                        <div className="gbRows">
                          {entries.map(([k, v]) => (
                            <div key={k} className="gbRow">
                              <div className="gbRowLeft"><span className="gbRowLabel">{k.replace(/_/g,' ').replace(/\b\w/g, c=>c.toUpperCase())}</span></div>
                              <div className="gbRowValue">{renderVal(v)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  // Primitive → single row
                  const text = renderVal(val);
                  if (!text) return null;
                  return (
                    <div key={key} className="gbCard">
                      <div className="gbCardHeader"><div className="gbIconWrap">{icon}</div><div className="gbCardHeaderText"><div className="gbCardTitle">{label}</div></div></div>
                      <div className="gbRows"><div className="gbRow"><div className="gbRowValue">{text}</div></div></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        );
      })()}

      {/* old full-width reviews — now inside details-column */}
      {/* placeholder end */}

    </div>
  );
};

export default PropertyDetailPage;