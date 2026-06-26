
import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import styles from "./Dashboard.module.css";
import { AuthContext } from "../../Login/AuthContext";
import { Home, Plus, Loader, Moon, Calendar, Building } from "lucide-react";
import PGUpdateForm from "../../ovikalistingform/PGUpdateForm";
import ImageClassificationModal from "../SuperAdmin/ImageClassificationModal";

function KeyItem({ text, filetype = "pdf" }) {
  const isXlsx = filetype === "xlsx";
  return (
    <div className={styles.keyItem}>
      <span className={`${styles.keyDot} ${isXlsx ? styles.xlsx : styles.pdf}`} />
      <span className={styles.keyText}>{text}</span>
      <div className={styles.keyActions}>
        <button title="View" className={styles.iconBtn} aria-label="view"><i className="fa-regular fa-eye" /></button>
        <button title="Download" className={styles.iconBtn} aria-label="download"><i className="fa-solid fa-download" /></button>
      </div>
    </div>
  );
}

function MessageItem({ initials, name, note }) {
  return (
    <div className={styles.msgItem}>
      <div className={styles.avatar}>{initials}</div>
      <div>
        <div className={styles.msgName}>{name}</div>
        <div className={styles.msgNote}>{note}</div>
      </div>
    </div>
  );
}

function TicketRow({ title, status }) {
  const statusClass = status.toLowerCase() === "resolved" ? styles.resolved : styles.open;
  return (
    <div className={styles.ticketRow}>
      <span className={styles.ticketTitle}>{title}</span>
      <span className={`${styles.chip} ${statusClass}`}>{status}</span>
    </div>
  );
}

const AMENITIES = {
  Basic: ["Wi-Fi", "Heating", "Air conditioning", "Hot water"],
  Kitchen: ["Refrigerator", "Stovetop/oven", "Microwave", "Cooking utensils", "Electric Kettle", "Hob", "Chimney", "RO", "Toaster", "Rice Cooker", "Coffee Maker", "Induction Cooktop", "Dining Counter"],
  Bathroom: ["Bath Towels", "Soap & Shampoo"],
  Appliances: ["Washing Machine", "Iron & Board"],
  Entertainment: ["TV", "Google TV", "Streaming services"],
  Safety: ["Smoke detector", "Carbon monoxide detector", "Fire extinguisher", "First aid kit", "Electronic Entry Lock", "Electronic Bedroom Lock", "Sprinkler"],
  Outdoor: ["Balcony/terrace", "Garden", "Parking space", "Basement Free Parking", "BBQ grill", "Tennis Court", "Golf Course"],
  Wellness: ["Swimming Pool", "Hot tub", "Sauna", "Gym"],
  Accessibility: ["Wheelchair accessible", "Elevator", "Ramp access"],
  Services: ["Breakfast Included", "Lunch Included", "Dinner Included", "All Meals Included", "Airport pick-up", "Luggage storage", "Cleaning on request"],
};

const PG_AMENITIES = {
  Essentials: ["Wi-Fi", "Power Backup", "Water Supply", "Housekeeping", "Laundry Service"],
  Room_Features: ["Attached Bathroom", "Balcony", "Air Conditioner", "Geyser", "Study Table", "Cupboard", "TV"],
  Food_Kitchen: ["Breakfast", "Lunch", "Dinner", "Tea/Coffee", "Self-cooking Kitchen", "Refrigerator", "Microwave", "RO Water Purifier"],
  Security: ["CCTV", "Biometric Entry", "Security Guard", "Warden"],
  Common_Areas: ["Common Room", "Dining Area", "Gym", "Gaming Zone", "Terrace", "Lift", "Parking"],
};

const DEFAULT_CANCELLATION_POLICIES = ["Flexible", "Moderate", "Strict"];
const DEFAULT_PROPERTY_CATEGORIES = ["Apartment", "House", "Villa", "Cabin", "Bungalow", "Studio", "Suite", "Home Stays", "Hotel", "PG", "Other"];
const PROPERTY_TYPES = ["Entire place", "Private room", "Shared room", "Hotel room", "Homestay"];
const PG_TYPES = ["Boys PG", "Girls PG", "Co-ed PG"];
const SHARING_TYPES = ["Single Room", "Double Sharing", "Triple Sharing", "Four Sharing", "Dormitory"];

// ─── HELPER: Parse meta safely ────────────────────────────────────────────────
const parseMeta = (prop) => {
  if (!prop) return {};
  let meta = prop.meta;
  if (!meta) return {};
  if (typeof meta === "string") {
    try { return JSON.parse(meta); } catch (e) { return {}; }
  }
  if (typeof meta === "object") return meta;
  return {};
};

// ─── CLEAN DESCRIPTION: pehle se appended junk hatao ─────────────────────────
// Ye function description se "--- PG Details ---", "--- Local Guide ---" etc. saaf karta hai
const cleanDescription = (raw) => {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .split('--- PG Details ---')[0]
    .split('--- Local Guide ---')[0]
    .split('Notice Period:')[0]
    .split('Gate Closing Time:')[0]
    .trim();
};

// ─── MONTHLY vs NIGHTLY — FINAL LOGIC ─────────────────────────────────────────
const NIGHTLY_ONLY_CATEGORIES = ["villa", "cabin", "bungalow", "hotel"];
const MONTHLY_ONLY_CATEGORIES = ["flat", "penthouse", "pg"];
const PG_UPDATE_DEFAULT_TIMES = ["12:00", "12:00:00", "11:00", "11:00:00"];
const NIGHTLY_OVERRIDE_IDS = new Set([77, 78, 79, 80, 81]);
const MONTHLY_OVERRIDE_IDS = new Set([314, 315, 316, 317]);

const isMonthlyProperty = (prop) => {
  if (!prop) return false;
  const propId = Number(prop.id || prop._id || 0);
  if (NIGHTLY_OVERRIDE_IDS.has(propId)) return false;
  if (MONTHLY_OVERRIDE_IDS.has(propId)) return true;
  const meta = parseMeta(prop);
  const hasLongTermSignals = [
    'noticePeriod', 'lockInPeriod', 'baseRate', 'bedroomDetails',
    'gateClosingTime', 'preferredTenants', 'tenantPreferences',
    'securityDeposit', 'maintenanceCharge'
  ].some(k => meta[k] !== undefined);
  if (hasLongTermSignals) return true;
  const cat = (prop.property_category || "").toLowerCase().trim();
  const metaCat = (meta.propertyCategory || "").toLowerCase().trim();
  if (MONTHLY_ONLY_CATEGORIES.includes(cat)) return true;
  if (MONTHLY_ONLY_CATEGORIES.includes(metaCat)) return true;
  const cin = (prop.check_in_time || "").toString().trim();
  const cout = (prop.check_out_time || "").toString().trim();
  const hasRealCheckIn = cin !== "" && cin !== "null" && cin !== "undefined" && !PG_UPDATE_DEFAULT_TIMES.includes(cin);
  const hasRealCheckOut = cout !== "" && cout !== "null" && cout !== "undefined" && !PG_UPDATE_DEFAULT_TIMES.includes(cout);
  if (hasRealCheckIn || hasRealCheckOut) return false;
  if (NIGHTLY_ONLY_CATEGORIES.includes(cat)) return false;
  if (NIGHTLY_ONLY_CATEGORIES.includes(metaCat)) return false;
  const metaCin = (meta.checkInTime || "").toString().trim();
  const metaCout = (meta.checkOutTime || "").toString().trim();
  if (metaCin !== "" && metaCin !== "null" && !PG_UPDATE_DEFAULT_TIMES.includes(metaCin)) return false;
  if (metaCout !== "" && metaCout !== "null" && !PG_UPDATE_DEFAULT_TIMES.includes(metaCout)) return false;
  const rentalType = (prop.rental_type || prop.listing_type || meta.rental_type || meta.listing_type || "").toLowerCase();
  if (rentalType === "monthly" || rentalType === "long-term") return true;
  if (rentalType === "nightly" || rentalType === "short-term") return false;
  return true;
};

const isNightlyProperty = (prop) => !isMonthlyProperty(prop);

function EditPropertyModal({ property, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  const isPG = property.property_category === "PG" ||
    (typeof property.meta === 'string' ? JSON.parse(property.meta || '{}') : property.meta)?.propertyCategory === "PG";

  const getMeta = (key, fallback = "") => {
    if (!property) return fallback;
    if (property[key] !== undefined && property[key] !== null) return property[key];
    let m = property.meta;
    if (typeof m === 'string') {
      try { m = JSON.parse(m); } catch (e) { m = {}; }
    }
    if (['familyAllowed', 'unmarriedCoupleAllowed', 'bachelorAllowed'].includes(key)) {
      let gp = property.guest_policy;
      if (typeof gp === 'string') { try { gp = JSON.parse(gp); } catch (e) { } }
      if (key === 'familyAllowed') return gp?.family_allowed ?? m?.familyAllowed ?? fallback;
      if (key === 'unmarriedCoupleAllowed') return gp?.unmarried_couple_allowed ?? m?.unmarriedCoupleAllowed ?? fallback;
      if (key === 'bachelorAllowed') return gp?.bachelors_allowed ?? m?.bachelorAllowed ?? fallback;
    }
    return m?.[key] ?? fallback;
  };

  const parseJson = (val, fallback = []) => {
    if (!val) return fallback;
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try { return JSON.parse(val) || fallback; } catch (e) { return fallback; }
    }
    return fallback;
  };

  const getInitialPhotos = () => {
    let p = property.photos;
    if (typeof p === 'string') {
      p = p.trim();
      if (p.startsWith('[') && p.endsWith(']')) {
        try { return JSON.parse(p); } catch (e) { }
      }
      return p.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (Array.isArray(p)) return p;
    return [];
  };

  const getInitialAmenities = () => {
    let am = getMeta('amenities');
    if (typeof am === 'string') { try { am = JSON.parse(am); } catch (e) { am = []; } }
    if (!Array.isArray(am)) am = [];
    const SIGNATURE_IDS = new Set([77, 78, 79, 80, 81, 314, 315, 316, 317, 323]);
    if (SIGNATURE_IDS.has(Number(property.id || property._id || 0))) {
      ['Bath Towels', 'Soap & Shampoo'].forEach(e => { if (!am.includes(e)) am = [...am, e]; });
    }
    return am;
  };

  const getInitialBedroomDetails = () => {
    const bedrooms = parseJson(property.bedrooms || getMeta('bedrooms'), []);
    if (isPG && bedrooms.length > 0 && bedrooms[0].price !== undefined) {
      return bedrooms.map((bed, idx) => ({
        id: idx, type: bed.type || "Double Sharing",
        count: bed.count || 1, price: bed.price || "", washroomType: bed.washroomType || "Attached"
      }));
    }
    return bedrooms.length > 0 ? bedrooms : [{ type: "King Bed", count: 1 }];
  };

  const [photoList, setPhotoList] = useState(getInitialPhotos());
  const [newFiles, setNewFiles] = useState([]);
  const [coverIndex, setCoverIndex] = useState(() => {
    const idx = Number(property.cover_photo_index);
    return !isNaN(idx) && idx >= 0 ? idx : 0;
  });

  const [formData, setFormData] = useState({
    property_name: property.property_name || property.name || "",
    // ── FIX 1: description load karte waqt pehle se appended junk saaf karo ──
    description: cleanDescription(property.description),
    price: (property.price !== undefined && property.price !== null && property.price !== "")
      ? String(property.price)
      : "",
    propertyType: isPG ? (getMeta('propertyType') || PG_TYPES[0]) : (property.property_type || getMeta('propertyType') || PROPERTY_TYPES[0]),
    propertyCategory: getMeta('propertyCategory') || property.property_category || (isPG ? "PG" : ""),
    address: property.address || "",
    city: property.city || "",
    country: property.country || getMeta('country') || "India",
    postalCode: property.postal_code || property.zip_code || getMeta('postalCode') || "",
    latitude: property.latitude || getMeta('latitude') || "",
    longitude: property.longitude || getMeta('longitude') || "",
    area: property.area || getMeta('area') || "",
    beds: property.beds || getMeta('beds') || "",
    maxGuests: property.max_guests || getMeta('maxGuests', 1),
    bedrooms: getInitialBedroomDetails(),
    bathrooms: parseJson(property.bathrooms || getMeta('bathrooms'), [{ type: "Attached", count: 1 }]),
    weekendRate: property.weekend_rate || getMeta('weekendRate') || "",
    cleaningFee: property.cleaning_fee || getMeta('cleaningFee') || "",
    weeklyDiscountPct: property.weekly_discount_pct || getMeta('weeklyDiscountPct') || "",
    monthlyDiscountPct: property.monthly_discount_pct || getMeta('monthlyDiscountPct') || "",
    checkInTime: property.check_in_time || getMeta('checkInTime') || "",
    checkOutTime: property.check_out_time || getMeta('checkOutTime') || "",
    quietHours: property.quiet_hours || getMeta('quietHours', isPG ? "23:00-06:00" : "22:00-07:00"),
    smokingAllowed: property.smoking_allowed ? true : getMeta('smokingAllowed', false),
    petsAllowed: property.pets_allowed ? true : getMeta('petsAllowed', false),
    eventsAllowed: property.events_allowed ? true : getMeta('eventsAllowed', false),
    drinkingAllowed: property.drinking_alcohol ? true : getMeta('drinkingAllowed', false),
    outsideGuestsAllowed: property.outside_guests_allowed ? true : getMeta('outsideGuestsAllowed', false),
    familyAllowed: getMeta('familyAllowed', false),
    unmarriedCoupleAllowed: getMeta('unmarriedCoupleAllowed', false),
    bachelorAllowed: getMeta('bachelorAllowed', isPG ? true : false),
    selfCheckIn: getMeta('selfCheckIn', ""),
    bookingType: property.booking_type !== undefined ? property.booking_type : getMeta('bookingType', 0),
    cancellationPolicy: property.cancellation_policy || getMeta('cancellationPolicy', DEFAULT_CANCELLATION_POLICIES[0]),
    insurance: property.insurance ? true : getMeta('insurance', false),
    damageProtection: property.damage_protection ? true : getMeta('damageProtection', false),
    gateClosingTime: getMeta('gateClosingTime', ""),
    noticePeriod: getMeta('noticePeriod', 30),
    lockInPeriod: getMeta('lockInPeriod', 1),
    foodAvailable: getMeta('foodAvailable', false),
    electricityCharges: getMeta('electricityCharges', "Included in Rent"),
    perNightPrice: getMeta('perNightPrice', ""),
    securityDeposit: getMeta('securityDeposit', ""),
    localGuide: {
      nearestMetroStation: getMeta('localGuide')?.nearestMetroStation || "",
      nearestBusStop: getMeta('localGuide')?.nearestBusStop || "",
      nearbyMarket: getMeta('localGuide')?.nearbyMarket || "",
      nearbyHospital: getMeta('localGuide')?.nearbyHospital || "",
      nearbyShowroom: getMeta('localGuide')?.nearbyShowroom || "",
      otherNotes: getMeta('localGuide')?.otherNotes || ""
    },
    amenities: getInitialAmenities(),
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => {
      const current = prev.amenities || [];
      return current.includes(amenity)
        ? { ...prev, amenities: current.filter(a => a !== amenity) }
        : { ...prev, amenities: [...current, amenity] };
    });
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const images = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      setNewFiles(prev => [...prev, ...images]);
    }
  };

  const removePhoto = (index) => {
    setPhotoList(prev => prev.filter((_, i) => i !== index));
    setCoverIndex(prev => prev === index ? 0 : prev > index ? prev - 1 : prev);
  };
  const removeNewFile = (index) => {
    const globalIdx = photoList.length + index;
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setCoverIndex(prev => prev === globalIdx ? 0 : prev > globalIdx ? prev - 1 : prev);
  };

  const handleSave = async () => {
    setLoading(true);
    setDebugInfo("");
    const propertyId = property.id || property._id;
    if (!propertyId) {
      alert("Error: Property ID not found! Cannot update.");
      setLoading(false);
      return;
    }
    try {
      let uploadedUrls = [];
      if (newFiles.length > 0) {
        const uploadPromises = newFiles.map(async (file) => {
          const fd = new FormData();
          fd.append('images', file);
          const res = await fetch('https://www.townmanor.ai/api/image/aws-upload-owner-images', {
            method: 'POST', body: fd,
          });
          const data = await res.json();
          return (data.fileUrls && data.fileUrls[0]) ? data.fileUrls[0] : null;
        });
        const results = await Promise.all(uploadPromises);
        uploadedUrls = results.filter(Boolean);
      }

      const finalAllPhotos = [...photoList, ...uploadedUrls];

      // ── FIX 2: description mein KUCH BHI append nahi karna ──────────────────
      // PG Details, Local Guide, [object Object] — sab band
      // description sirf user ka original text rahega
      const finalDescription = formData.description || "";

      const payload = {
        property_name: formData.property_name || "",
        description: finalDescription,
        address: formData.address || "",
        city: formData.city || "",
        country: formData.country || "",
        postal_code: formData.postalCode || "",
        price: formData.price !== "" ? Number(formData.price) : 0,
        ...(formData.weekendRate !== "" && { weekend_rate: Number(formData.weekendRate) }),
        ...(formData.cleaningFee !== "" && { cleaning_fee: Number(formData.cleaningFee) }),
        ...(formData.weeklyDiscountPct !== "" && { weekly_discount_pct: Number(formData.weeklyDiscountPct) }),
        ...(formData.monthlyDiscountPct !== "" && { monthly_discount_pct: Number(formData.monthlyDiscountPct) }),
        ...(formData.area !== "" && { area: formData.area }),
        ...(formData.beds !== "" && { beds: formData.beds }),
        ...(formData.maxGuests && { max_guests: formData.maxGuests }),
        ...(formData.latitude !== "" && { latitude: formData.latitude }),
        ...(formData.longitude !== "" && { longitude: formData.longitude }),
        ...(formData.checkInTime && { check_in_time: formData.checkInTime }),
        ...(formData.checkOutTime && { check_out_time: formData.checkOutTime }),
        ...(formData.quietHours && { quiet_hours: formData.quietHours }),
        property_type: formData.propertyType || "",
        property_category: formData.propertyCategory || "",
        cancellation_policy: formData.cancellationPolicy || "",
        booking_type: formData.bookingType,
        smoking_allowed: !!formData.smokingAllowed,
        pets_allowed: !!formData.petsAllowed,
        events_allowed: !!formData.eventsAllowed,
        drinking_alcohol: !!formData.drinkingAllowed,
        outside_guests_allowed: !!formData.outsideGuestsAllowed,
        insurance: !!formData.insurance,
        damage_protection: !!formData.damageProtection,
        bedrooms: JSON.stringify(formData.bedrooms || []),
        bathrooms: JSON.stringify(formData.bathrooms || []),
        photos: JSON.stringify(finalAllPhotos),
        cover_photo_index: Math.min(coverIndex, finalAllPhotos.length - 1),
        amenities: JSON.stringify(formData.amenities || []),
        guest_policy: JSON.stringify({
          family_allowed: Boolean(formData.familyAllowed),
          unmarried_couple_allowed: Boolean(formData.unmarriedCoupleAllowed),
          bachelors_allowed: Boolean(formData.bachelorAllowed),
        }),
      };

      const apiUrl = `https://www.townmanor.ai/api/ovika/properties/${propertyId}`;
      let response;
      try {
        response = await axios.put(apiUrl, payload, {
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          timeout: 15000
        });
      } catch (putError) {
        if (putError.response?.status === 405 || putError.response?.status === 404) {
          response = await axios.patch(apiUrl, payload, {
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            timeout: 15000
          });
        } else {
          throw putError;
        }
      }
      alert(`✅ Property updated successfully!\nPrice: ₹${payload.price}`);
      onRefresh();
      onClose();
    } catch (e) {
      const status = e.response?.status;
      const serverMsg = e.response?.data?.error || e.response?.data?.message || e.message;
      const errorDetails = `Status: ${status || 'Network Error'}\nMessage: ${serverMsg}`;
      setDebugInfo(`❌ Error ${status}: ${serverMsg}`);
      alert(`Failed to update property!\n\n${errorDetails}`);
    } finally {
      setLoading(false);
    }
  };

  const modalOverlayStyle = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
  };
  const modalContentStyle = {
    background: '#fff', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '800px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto'
  };
  const inputStyle = {
    width: '100%', padding: '10px', margin: '4px 0 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px',
    boxSizing: 'border-box'
  };
  const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#555' };
  const sectionTitleStyle = { fontSize: '16px', fontWeight: '700', color: '#333', marginTop: '20px', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '6px' };
  const btnGroupStyle = { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', position: 'sticky', bottom: '-10px', background: '#fff', padding: '10px 0', borderTop: '1px solid #eee' };
  const btnStyle = { padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500' };
  const dynamicRowStyle = { display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' };
  const toggleRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '8px', background: '#f9f9f9', borderRadius: '6px' };
  const toggleLabelStyle = { fontSize: '14px', color: '#333' };
  const photoGrid = { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px', marginTop: '5px' };
  const photoFrame = { position: 'relative', width: '80px', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #eee' };
  const photoImg = { width: '100%', height: '100%', objectFit: 'cover' };
  const deleteBtn = { position: 'absolute', top: '2px', right: '2px', background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' };

  const handleAddList = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...(prev[field] || []), isPG && field === 'bedrooms' ? { type: "Double Sharing", count: 1, price: "", washroomType: "Attached" } : { type: "", count: 1 }] }));
  };
  const handleRemoveList = (field, idx) => {
    setFormData(prev => ({ ...prev, [field]: (prev[field] || []).filter((_, i) => i !== idx) }));
  };
  const handleListChange = (field, idx, key, val) => {
    setFormData(prev => {
      const list = [...(prev[field] || [])];
      list[idx] = { ...list[idx], [key]: val };
      return { ...prev, [field]: list };
    });
  };

  const Toggle = ({ checked, onChange }) => (
    <div style={{ display: 'flex', gap: '4px' }}>
      <button type="button" onClick={() => onChange(false)} style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd', background: !checked ? '#000' : '#fff', color: !checked ? '#fff' : '#000', cursor: 'pointer' }}>No</button>
      <button type="button" onClick={() => onChange(true)} style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd', background: checked ? '#000' : '#fff', color: checked ? '#fff' : '#000', cursor: 'pointer' }}>Yes</button>
    </div>
  );

  const AMENITIES_TO_USE = isPG ? PG_AMENITIES : AMENITIES;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: '0', fontSize: '20px' }}>Update {isPG ? 'PG' : 'Property'}</h3>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
        </div>
        {debugInfo && (
          <div style={{ background: '#fff3cd', border: '1px solid #ffc107', padding: '8px 12px', borderRadius: '6px', marginTop: '10px', fontSize: '13px', color: '#856404' }}>
            {debugInfo}
          </div>
        )}
        <div style={{ fontSize: '11px', color: '#aaa', marginTop: '6px' }}>
          ID: {property.id || property._id || 'NOT FOUND ⚠️'}
        </div>

        <h4 style={sectionTitleStyle}>Basic Information</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={labelStyle}>{isPG ? 'PG Type' : 'Property Type'}</label>
            <select name="propertyType" value={formData.propertyType} onChange={handleChange} style={inputStyle}>
              {isPG ? PG_TYPES.map(p => <option key={p} value={p}>{p}</option>) : PROPERTY_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select name="propertyCategory" value={formData.propertyCategory} onChange={handleChange} style={inputStyle}>
              {DEFAULT_PROPERTY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label style={labelStyle}>{isPG ? 'PG Name' : 'Property Name'}</label>
          <input name="property_name" value={formData.property_name} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3} style={{ ...inputStyle, fontFamily: 'inherit' }} />
        </div>

        <h4 style={sectionTitleStyle}>Photos</h4>
        <div style={{ marginBottom: '16px' }}>
          <div style={photoGrid}>
            {photoList.map((url, i) => (
              <div key={`exist-${i}`} style={{ ...photoFrame, outline: coverIndex === i ? '2.5px solid #c2772b' : 'none', borderRadius: '7px' }}>
                <img src={url} alt="prop" style={photoImg} onError={e => e.target.src = 'https://via.placeholder.com/70?text=Err'} />
                <button type="button" onClick={() => removePhoto(i)} style={deleteBtn}>&times;</button>
                <div
                  onClick={() => setCoverIndex(i)}
                  style={{ position:'absolute', bottom:0, left:0, right:0, background: coverIndex === i ? '#c2772b' : 'rgba(0,0,0,0.45)', color:'#fff', fontSize:'10px', fontWeight:'600', textAlign:'center', padding:'2px 0', cursor:'pointer', borderRadius:'0 0 6px 6px' }}
                >
                  {coverIndex === i ? '★ Cover' : 'Set Cover'}
                </div>
              </div>
            ))}
            {newFiles.map((file, i) => {
              const globalIdx = photoList.length + i;
              return (
                <div key={`new-${i}`} style={{ ...photoFrame, outline: coverIndex === globalIdx ? '2.5px solid #c2772b' : 'none', borderRadius: '7px' }}>
                  <img src={URL.createObjectURL(file)} alt="new" style={photoImg} />
                  <button type="button" onClick={() => removeNewFile(i)} style={deleteBtn}>&times;</button>
                  <div
                    onClick={() => setCoverIndex(globalIdx)}
                    style={{ position:'absolute', bottom:0, left:0, right:0, background: coverIndex === globalIdx ? '#c2772b' : 'rgba(0,0,0,0.45)', color:'#fff', fontSize:'10px', fontWeight:'600', textAlign:'center', padding:'2px 0', cursor:'pointer', borderRadius:'0 0 6px 6px' }}
                  >
                    {coverIndex === globalIdx ? '★ Cover' : 'Set Cover'}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="modal-file-upload" style={{ ...btnStyle, padding: '8px 16px', background: '#fff8f0', color: '#c2772b', border: '1px solid #f6d4a8', display: 'inline-block', fontSize: '13px', cursor: 'pointer' }}>
              <i className="fa-solid fa-cloud-arrow-up" style={{ marginRight: '6px' }} />Select Photos
            </label>
            <input id="modal-file-upload" type="file" multiple accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
            <span style={{ fontSize: '12px', color: '#666' }}>{newFiles.length} new selected</span>
          </div>
        </div>

        <h4 style={sectionTitleStyle}>Location</h4>
        <div>
          <label style={labelStyle}>Address</label>
          <input name="address" value={formData.address} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={labelStyle}>City</label>
            <input name="city" value={formData.city} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Postal Code</label>
            <input name="postalCode" value={formData.postalCode} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <h4 style={sectionTitleStyle}>{isPG ? 'Room Details' : 'Property Details'}</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={labelStyle}>Area (sq ft)</label>
            <input name="area" type="number" value={formData.area} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>{isPG ? 'Total Capacity' : 'Total Beds'}</label>
            <input name="beds" type="number" min="1" value={formData.beds} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        {isPG ? (
          <>
            <label style={labelStyle}>Room Sharing Options & Prices</label>
            <div style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '8px', background: '#fafafa', marginBottom: '12px' }}>
              {(formData.bedrooms || []).map((bed, idx) => (
                <div key={idx} style={{ ...dynamicRowStyle, flexWrap: 'wrap' }}>
                  <select value={bed.type || ""} onChange={(e) => handleListChange('bedrooms', idx, 'type', e.target.value)} style={{ ...inputStyle, margin: 0, flex: '1 1 140px' }}>
                    {SHARING_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <input type="number" min="0" placeholder="Price (₹/night)" value={bed.price || ''} onChange={(e) => handleListChange('bedrooms', idx, 'price', e.target.value)} style={{ ...inputStyle, margin: 0, flex: '1 1 120px' }} />
                  <select value={bed.washroomType || "Attached"} onChange={(e) => handleListChange('bedrooms', idx, 'washroomType', e.target.value)} style={{ ...inputStyle, margin: 0, flex: '1 1 140px' }}>
                    <option value="Attached">Attached Washroom</option>
                    <option value="Common">Common Washroom</option>
                  </select>
                  <button type="button" onClick={() => handleRemoveList('bedrooms', idx)} style={{ color: '#ef4444', border: '1px solid #ef4444', background: '#fff', borderRadius: '4px', width: '32px', height: '32px', cursor: 'pointer' }}>&times;</button>
                </div>
              ))}
              <button type="button" onClick={() => handleAddList('bedrooms')} style={{ ...btnStyle, background: '#fff', border: '1px dashed #999', color: '#555', fontSize: '13px', padding: '8px 16px', width: '100%' }}>+ Add Sharing Type</button>
            </div>
          </>
        ) : (
          <>
            <label style={labelStyle}>Bedroom Configuration</label>
            <div style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '8px', background: '#fafafa', marginBottom: '12px' }}>
              {(formData.bedrooms || []).map((bed, idx) => (
                <div key={idx} style={dynamicRowStyle}>
                  <select value={bed.type || ""} onChange={(e) => handleListChange('bedrooms', idx, 'type', e.target.value)} style={{ ...inputStyle, margin: 0, flex: 2 }}>
                    <option value="">Select Bed Type</option>
                    {["King Bed", "Queen Bed", "Double Bed", "Single Bed", "Bunk Bed", "Sofa Bed"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <input type="number" min="1" placeholder="Count" value={bed.count || 1} onChange={(e) => handleListChange('bedrooms', idx, 'count', Number(e.target.value))} style={{ ...inputStyle, margin: 0, flex: 1 }} />
                  <button type="button" onClick={() => handleRemoveList('bedrooms', idx)} style={{ color: '#ef4444', border: '1px solid #ef4444', background: '#fff', borderRadius: '4px', width: '32px', height: '32px', cursor: 'pointer' }}>&times;</button>
                </div>
              ))}
              <button type="button" onClick={() => handleAddList('bedrooms')} style={{ ...btnStyle, background: '#fff', border: '1px dashed #999', color: '#555', fontSize: '13px', padding: '8px 16px', width: '100%' }}>+ Add Bedroom Type</button>
            </div>
          </>
        )}

        <label style={labelStyle}>Bathroom Configuration</label>
        <div style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '8px', background: '#fafafa', marginBottom: '12px' }}>
          {(formData.bathrooms || []).map((bath, idx) => (
            <div key={idx} style={dynamicRowStyle}>
              <select value={bath.type || ""} onChange={(e) => handleListChange('bathrooms', idx, 'type', e.target.value)} style={{ ...inputStyle, margin: 0, flex: 2 }}>
                <option value="">Select Bath Type</option>
                <option value="Attached">Attached</option>
                <option value="Common">Common</option>
                <option value="En-suite">En-suite</option>
                <option value="Jack & Jill">Jack & Jill</option>
                <option value="Separate">Separate</option>
                <option value="Other">Other</option>
              </select>
              <input type="number" min="1" placeholder="Count" value={bath.count || 1} onChange={(e) => handleListChange('bathrooms', idx, 'count', Number(e.target.value))} style={{ ...inputStyle, margin: 0, flex: 1 }} />
              <button type="button" onClick={() => handleRemoveList('bathrooms', idx)} style={{ color: '#ef4444', border: '1px solid #ef4444', background: '#fff', borderRadius: '4px', width: '32px', height: '32px', cursor: 'pointer' }}>&times;</button>
            </div>
          ))}
          <button type="button" onClick={() => handleAddList('bathrooms')} style={{ ...btnStyle, background: '#fff', border: '1px dashed #999', color: '#555', fontSize: '13px', padding: '8px 16px', width: '100%' }}>+ Add Bathroom Type</button>
        </div>

        <h4 style={sectionTitleStyle}>Amenities</h4>
        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '8px' }}>
          {Object.entries(AMENITIES_TO_USE).map(([group, list]) => (
            <div key={group} style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#888', marginBottom: '6px' }}>{group.replace(/_/g, ' ')}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {list.map(a => (
                  <label key={a} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={formData.amenities.includes(a)} onChange={() => handleAmenityToggle(a)} />
                    {a}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h4 style={sectionTitleStyle}>Pricing & Costs</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ ...labelStyle, color: '#c98b3e' }}>
              {isPG ? 'Base Rent (₹/month)' : 'Base Price (₹/night)'} <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              name="price"
              type="number"
              min="0"
              value={formData.price}
              onChange={handleChange}
              style={{ ...inputStyle, border: '2px solid #c98b3e', fontWeight: '600', fontSize: '16px' }}
              placeholder="Enter price e.g. 2500"
            />
            <span style={{ fontSize: '11px', color: '#888' }}>Current saved: ₹{property.price || 'Not set'}</span>
          </div>
          {!isPG && (
            <div>
              <label style={labelStyle}>Weekend Rate</label>
              <input name="weekendRate" type="number" value={formData.weekendRate} onChange={handleChange} style={inputStyle} />
            </div>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <div>
            <label style={labelStyle}>{isPG ? 'Maintenance Fee' : 'Cleaning Fee'}</label>
            <input name="cleaningFee" type="number" value={formData.cleaningFee} onChange={handleChange} style={inputStyle} />
          </div>
          {isPG && (
            <div>
              <label style={labelStyle}>Security Deposit</label>
              <input name="securityDeposit" type="number" value={formData.securityDeposit} onChange={(e) => setFormData(f => ({ ...f, securityDeposit: e.target.value }))} style={inputStyle} />
            </div>
          )}
          {!isPG && (
            <>
              <div>
                <label style={labelStyle}>Weekly Disc (%)</label>
                <input name="weeklyDiscountPct" type="number" value={formData.weeklyDiscountPct} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Monthly Disc (%)</label>
                <input name="monthlyDiscountPct" type="number" value={formData.monthlyDiscountPct} onChange={handleChange} style={inputStyle} />
              </div>
            </>
          )}
        </div>

        <h4 style={sectionTitleStyle}>Rules & Policies</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <div style={toggleRowStyle}>
              <span style={toggleLabelStyle}>Max Guests</span>
              <input name="maxGuests" type="number" value={formData.maxGuests} onChange={handleChange} style={{ width: '60px', padding: '4px' }} />
            </div>
            {isPG && (
              <>
                <div style={toggleRowStyle}>
                  <span style={toggleLabelStyle}>Gate Closing Time</span>
                  <input name="gateClosingTime" type="time" value={formData.gateClosingTime} onChange={handleChange} style={{ padding: '4px' }} />
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <label style={labelStyle}>Notice Period (Days)</label>
                  <input name="noticePeriod" type="number" value={formData.noticePeriod} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <label style={labelStyle}>Lock-in Period (Months)</label>
                  <input name="lockInPeriod" type="number" value={formData.lockInPeriod} onChange={handleChange} style={inputStyle} />
                </div>
              </>
            )}
            {!isPG && (
              <>
                <div style={toggleRowStyle}>
                  <span style={toggleLabelStyle}>Check-In Time</span>
                  <input name="checkInTime" type="time" value={formData.checkInTime} onChange={handleChange} style={{ padding: '4px' }} />
                </div>
                <div style={toggleRowStyle}>
                  <span style={toggleLabelStyle}>Check-Out Time</span>
                  <input name="checkOutTime" type="time" value={formData.checkOutTime} onChange={handleChange} style={{ padding: '4px' }} />
                </div>
              </>
            )}
            <div style={{ marginBottom: '8px' }}>
              <label style={labelStyle}>Cancellation Policy</label>
              <select name="cancellationPolicy" value={formData.cancellationPolicy} onChange={handleChange} style={inputStyle}>
                {DEFAULT_CANCELLATION_POLICIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label style={labelStyle}>Booking Type</label>
              <select name="bookingType" value={formData.bookingType} onChange={handleChange} style={inputStyle}>
                <option value={0}>Instant Booking</option>
                <option value={1}>Approval Required</option>
              </select>
            </div>
          </div>
          <div>
            <div style={toggleRowStyle}>
              <span style={toggleLabelStyle}>Smoking Allowed</span>
              <Toggle checked={formData.smokingAllowed} onChange={(v) => setFormData(f => ({ ...f, smokingAllowed: v }))} />
            </div>
            <div style={toggleRowStyle}>
              <span style={toggleLabelStyle}>Pets Allowed</span>
              <Toggle checked={formData.petsAllowed} onChange={(v) => setFormData(f => ({ ...f, petsAllowed: v }))} />
            </div>
            {!isPG && (
              <div style={toggleRowStyle}>
                <span style={toggleLabelStyle}>Events Allowed</span>
                <Toggle checked={formData.eventsAllowed} onChange={(v) => setFormData(f => ({ ...f, eventsAllowed: v }))} />
              </div>
            )}
            <div style={toggleRowStyle}>
              <span style={toggleLabelStyle}>Drinking Allowed</span>
              <Toggle checked={formData.drinkingAllowed} onChange={(v) => setFormData(f => ({ ...f, drinkingAllowed: v }))} />
            </div>
            <div style={toggleRowStyle}>
              <span style={toggleLabelStyle}>Outside Guests</span>
              <Toggle checked={formData.outsideGuestsAllowed} onChange={(v) => setFormData(f => ({ ...f, outsideGuestsAllowed: v }))} />
            </div>
            {isPG && (
              <div style={toggleRowStyle}>
                <span style={toggleLabelStyle}>Food Available</span>
                <Toggle checked={formData.foodAvailable} onChange={(v) => setFormData(f => ({ ...f, foodAvailable: v }))} />
              </div>
            )}
            <div style={toggleRowStyle}>
              <span style={toggleLabelStyle}>Family Allowed</span>
              <Toggle checked={formData.familyAllowed} onChange={(v) => setFormData(f => ({ ...f, familyAllowed: v }))} />
            </div>
            <div style={toggleRowStyle}>
              <span style={toggleLabelStyle}>Unmarried Couples</span>
              <Toggle checked={formData.unmarriedCoupleAllowed} onChange={(v) => setFormData(f => ({ ...f, unmarriedCoupleAllowed: v }))} />
            </div>
            <div style={toggleRowStyle}>
              <span style={toggleLabelStyle}>Bachelors Allowed</span>
              <Toggle checked={formData.bachelorAllowed} onChange={(v) => setFormData(f => ({ ...f, bachelorAllowed: v }))} />
            </div>
          </div>
        </div>

        {isPG && (
          <div style={{ marginTop: '12px' }}>
            <label style={labelStyle}>Electricity Charges</label>
            <select name="electricityCharges" value={formData.electricityCharges} onChange={handleChange} style={inputStyle}>
              <option value="Included in Rent">Included in Rent</option>
              <option value="Separate (As per Meter)">Separate (As per Meter)</option>
              <option value="Fixed Amount">Fixed Amount</option>
            </select>
          </div>
        )}

        {isPG && (
          <>
            <h4 style={sectionTitleStyle}>Local Guide / Neighborhood</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={labelStyle}>Nearest Metro Station</label>
                <input value={formData.localGuide.nearestMetroStation} onChange={(e) => setFormData(f => ({ ...f, localGuide: { ...f.localGuide, nearestMetroStation: e.target.value } }))} style={inputStyle} placeholder="e.g. MG Road Metro" />
              </div>
              <div>
                <label style={labelStyle}>Nearest Bus Stop</label>
                <input value={formData.localGuide.nearestBusStop} onChange={(e) => setFormData(f => ({ ...f, localGuide: { ...f.localGuide, nearestBusStop: e.target.value } }))} style={inputStyle} placeholder="e.g. Sector 18 Bus Stand" />
              </div>
              <div>
                <label style={labelStyle}>Nearby Market / Grocery</label>
                <input value={formData.localGuide.nearbyMarket} onChange={(e) => setFormData(f => ({ ...f, localGuide: { ...f.localGuide, nearbyMarket: e.target.value } }))} style={inputStyle} placeholder="e.g. Super Mart" />
              </div>
              <div>
                <label style={labelStyle}>Nearby Hospital / Pharmacy</label>
                <input value={formData.localGuide.nearbyHospital} onChange={(e) => setFormData(f => ({ ...f, localGuide: { ...f.localGuide, nearbyHospital: e.target.value } }))} style={inputStyle} placeholder="e.g. City Hospital" />
              </div>
              <div>
                <label style={labelStyle}>Other Landmarks / Notes</label>
                <textarea value={formData.localGuide.otherNotes} onChange={(e) => setFormData(f => ({ ...f, localGuide: { ...f.localGuide, otherNotes: e.target.value } }))} style={{ ...inputStyle, fontFamily: 'inherit' }} placeholder="Any other landmarks nearby..." rows={3} />
              </div>
            </div>
          </>
        )}

        <div style={btnGroupStyle}>
          <button type="button" onClick={onClose} style={{ ...btnStyle, background: '#f5f5f5', color: '#333' }}>Cancel</button>
          <button type="button" onClick={handleSave} disabled={loading} style={{ ...btnStyle, background: loading ? '#ccc' : '#c98b3e', color: '#fff', minWidth: '120px' }}>
            {loading ? '⏳ Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PropertyCard({ photoUrl, name, location, priceText, details, propertyId, onEdit, onDelete, onView, onViewImages }) {
  return (
    <div className={styles.propertyCard}>
      <img src={photoUrl} alt={name} className={styles.propertyImage} onClick={onView} style={{ cursor: "pointer" }} />
      <div className={styles.propertyMeta}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
          <div className={styles.propertyTitle} style={{ margin: 0 }}>{name}</div>
          {propertyId && (
            <span style={{ flexShrink: 0, background: '#f0f4ff', color: '#3b5bdb', border: '1px solid #c5d0fa', borderRadius: 6, fontSize: 11, fontWeight: 700, padding: '2px 8px', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
              ID: {propertyId}
            </span>
          )}
        </div>
        <div className={styles.propertySubtitle}>{location}</div>
        {details && <div className={styles.propertyDetails}>{details}</div>}
        {priceText && <div className={styles.propertyPrice}>{priceText}</div>}
        <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
          <button type="button" onClick={onEdit} style={{ border: '1px solid #ddd', background: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="fa-solid fa-pen" /> Update
          </button>
          <button type="button" onClick={onDelete} style={{ border: '1px solid #fdd', background: '#fff5f5', color: '#d32f2f', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="fa-solid fa-trash" /> Delete
          </button>
          <button type="button" onClick={onViewImages} style={{ border: 'none', background: '#0ea5e9', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="fa-regular fa-image" /> View Images
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ type, onAdd }) {
  const isMonthly = type === "monthly";
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '40vh', padding: '40px 20px',
      background: isMonthly ? 'linear-gradient(135deg, #fffbf5 0%, #fef3e2 100%)' : 'linear-gradient(135deg, #fff8f0 0%, #fef3e2 100%)',
      borderRadius: '16px'
    }}>
      <div style={{ background: '#fff', padding: '36px 40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        <div style={{ background: '#c2772b', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Building size={38} style={{ color: '#fff' }} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '10px' }}>
          No Properties Listed Yet
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6', marginBottom: '24px' }}>
          You have not listed any properties yet. Click below to add your first listing.
        </p>
        <button type="button" onClick={onAdd} style={{ background: '#c2772b', color: '#fff', padding: '12px 28px', borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add Listing
        </button>
      </div>
    </div>
  );
}

function RentalTabs({ activeTab, onChange, monthlyCount, nightlyCount }) {
  return (
    <div style={{ display: 'flex', gap: '0', marginBottom: '24px', background: '#f3f4f6', borderRadius: '12px', padding: '4px', width: '100%', maxWidth: '480px' }}>
      {[
        { key: 'monthly', label: 'Monthly Rentals', count: monthlyCount, icon: <Calendar size={15} />, color: '#c2772b' },
        { key: 'nightly', label: 'Nightly Rentals', count: nightlyCount, icon: <Moon size={15} />, color: '#c2772b' },
      ].map(tab => {
        const active = activeTab === tab.key;
        return (
          <button key={tab.key} type="button" onClick={() => onChange(tab.key)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 8px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: active ? '700' : '500', background: active ? '#fff' : 'transparent', color: active ? tab.color : '#6b7280', boxShadow: active ? '0 1px 4px rgba(0,0,0,0.10)' : 'none', transition: 'all 0.2s ease', whiteSpace: 'nowrap' }}>
            {tab.icon}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{tab.label}</span>
            <span style={{ background: active ? tab.color : '#d1d5db', color: active ? '#fff' : '#6b7280', borderRadius: '999px', fontSize: '11px', fontWeight: '700', padding: '1px 7px', minWidth: '20px', textAlign: 'center', flexShrink: 0 }}>{tab.count}</span>
          </button>
        );
      })}
    </div>
  );
}

const extractIdFromObj = (obj) => {
  if (!obj || typeof obj !== "object") return null;
  if (obj.owner_id) return obj.owner_id;
  if (obj.ownerId) return obj.ownerId;
  if (obj.id) return obj.id;
  if (obj._id) return obj._id;
  if (obj.userId) return obj.userId;
  if (obj.uid) return obj.uid;
  if (obj.user && typeof obj.user === "object") return extractIdFromObj(obj.user);
  if (obj.data && typeof obj.data === "object") return extractIdFromObj(obj.data);
  return null;
};

const getPropertyPhoto = (prop) => {
  if (!prop) return "/public/image 68.png";
  if (Array.isArray(prop.photos) && prop.photos.length > 0) {
    if (typeof prop.cover_photo_index === "number" && prop.photos[prop.cover_photo_index]) return prop.photos[prop.cover_photo_index];
    return prop.photos[0];
  }
  if (typeof prop.photos === "string" && prop.photos.trim()) {
    const parts = prop.photos.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length) return parts[0];
  }
  return "/public/image 68.png";
};

const getRoomCount = (val) => {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'number') return val;
  let parsed = val;
  if (typeof val === 'string') {
    if (!isNaN(val) && !val.trim().startsWith('[')) return Number(val);
    try { parsed = JSON.parse(val); } catch (e) { return parseFloat(val) || 0; }
  }
  if (typeof parsed === 'number') return parsed;
  if (Array.isArray(parsed)) return parsed.reduce((acc, item) => { const c = Number(item.count); return acc + (isNaN(c) ? 1 : c); }, 0);
  return 0;
};

export default function DashBoardAdmin() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const STORAGE_KEY = "user";
  const [ownerId, setOwnerId] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [editingMonthlyProperty, setEditingMonthlyProperty] = useState(null);
  const [activeTab, setActiveTab] = useState("monthly");
  const [activeCatTab, setActiveCatTab] = useState("all");
  const [classifyProperty, setClassifyProperty] = useState(null);

  useEffect(() => {
    const anyOpen = !!(editingProperty || editingMonthlyProperty || classifyProperty);
    document.body.style.overflow = anyOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [editingProperty, editingMonthlyProperty, classifyProperty]);

  const resolveOwnerIdFromSources = useCallback(() => {
    const idFromContext = extractIdFromObj(user);
    if (idFromContext) return String(idFromContext);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const id = extractIdFromObj(parsed);
      if (id) return String(id);
    } catch (e) { }
    return null;
  }, [user]);

  const fetchFilteredProperties = useCallback(async (resolvedOwnerId) => {
    if (!resolvedOwnerId) { setProperties([]); setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("https://www.townmanor.ai/api/ovika/properties", { timeout: 10000 });
      let all = [];
      if (!res || !res.data) { all = []; }
      else if (Array.isArray(res.data)) { all = res.data; }
      else if (Array.isArray(res.data.data)) { all = res.data.data; }
      else if (Array.isArray(res.data.results)) { all = res.data.results; }
      else { const arr = Object.values(res.data).find((v) => Array.isArray(v)); if (arr) all = arr; }
      const filtered = all.filter((p) => {
        if (!p || typeof p !== "object") return false;
        const candidates = [p.owner_id, p.ownerId, p.user_id, p.userId, (p.meta && (p.meta.ownerId || p.meta.owner_id)), p.owner].filter(Boolean);
        return candidates.some((c) => String(c) === String(resolvedOwnerId));
      });
      setProperties(filtered);
    } catch (err) {
      console.error("DashBoardAdmin: Failed to load properties:", err);
      setError("Failed to load properties (see console).");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let pollHandle = null;
    let attempts = 0;
    const maxAttempts = 6;
    const tryResolveNow = () => {
      const id = resolveOwnerIdFromSources();
      if (!mounted) return;
      if (id) { setOwnerId(id); fetchFilteredProperties(id); return; }
      pollHandle = setInterval(() => {
        attempts += 1;
        const id2 = resolveOwnerIdFromSources();
        if (id2) { clearInterval(pollHandle); if (!mounted) return; setOwnerId(id2); fetchFilteredProperties(id2); return; }
        if (attempts >= maxAttempts) { clearInterval(pollHandle); if (!mounted) return; setOwnerId(null); setProperties([]); setLoading(false); }
      }, 400);
    };
    tryResolveNow();
    return () => { mounted = false; if (pollHandle) clearInterval(pollHandle); };
  }, [resolveOwnerIdFromSources, fetchFilteredProperties]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY) return;
      if (!e.newValue) { setOwnerId(null); setProperties([]); setLoading(false); return; }
      try {
        const parsed = JSON.parse(e.newValue);
        const id = extractIdFromObj(parsed);
        if (id) { const sid = String(id); setOwnerId(sid); fetchFilteredProperties(sid); }
        else { setOwnerId(null); setProperties([]); }
      } catch (err) { setOwnerId(null); setProperties([]); }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [fetchFilteredProperties]);

  useEffect(() => {
    const onPropertyCreated = (e) => {
      const created = e?.detail;
      if (!created) return;
      const pOwner = created.owner_id || created.ownerId || (created.meta && (created.meta.ownerId || created.meta.owner_id));
      const resolved = resolveOwnerIdFromSources();
      if (!resolved) { const id = resolveOwnerIdFromSources(); if (id) { setOwnerId(id); fetchFilteredProperties(id); } return; }
      if (String(pOwner) === String(resolved)) setProperties((prev) => [created, ...prev]);
    };
    window.addEventListener("propertyCreated", onPropertyCreated);
    return () => window.removeEventListener("propertyCreated", onPropertyCreated);
  }, [fetchFilteredProperties, resolveOwnerIdFromSources]);

  useEffect(() => {
    const id = resolveOwnerIdFromSources();
    if (!id) { setOwnerId(null); setProperties([]); setLoading(false); return; }
    if (id && id !== ownerId) { setOwnerId(id); fetchFilteredProperties(id); }
  }, [user, resolveOwnerIdFromSources, fetchFilteredProperties]);

  const refresh = async () => {
    const id = resolveOwnerIdFromSources();
    setOwnerId(id);
    await fetchFilteredProperties(id);
  };

  const monthlyProperties = properties.filter(isMonthlyProperty);
  const nightlyProperties = properties.filter(isNightlyProperty);
  const displayedProperties = activeTab === "monthly" ? monthlyProperties : nightlyProperties;
  const allProperties = properties; // show all properties without tab separation

  // Detect which display category a property belongs to
  const getPropertyCategory = (p) => {
    const cat  = (p.property_category || '').toLowerCase().trim();
    const type = (p.property_type || '').toLowerCase().trim();
    const name = (p.property_name || p.name || '').toLowerCase();
    const meta = (() => { try { return typeof p.meta === 'object' ? p.meta : JSON.parse(p.meta || '{}'); } catch { return {}; } })();
    const metaCat = (meta.propertyCategory || '').toLowerCase().trim();

    if (name.includes('signature') || name.includes('ovika')) return 'Signature Stays';
    if (cat.includes('hotel') || type.includes('hotel') || name.includes('hotel')) return 'Hotel Stays';
    if (cat === 'pg & co-living' || cat === 'pg' || cat.includes('pg') || cat.includes('co-living') || cat.includes('coliving') || type.includes('pg') || metaCat.includes('pg')) return 'PG & Co-Living';
    if (cat === 'homestays & bnb' || cat.includes('homestay') || cat.includes('bnb') || type.includes('homestay') || type.includes('bnb') || type.includes('bed & breakfast') || type.includes('vacation rental') || type.includes('guesthouse')) return 'Homestays & BnB';
    if (cat === 'apartments & villas' || cat.includes('apartment') || cat.includes('villa') || cat.includes('studio') || cat.includes('flat') || type.includes('apartment') || type.includes('villa') || type.includes('studio')) return 'Apartments & Villas';
    return 'Other';
  };

  const OWNER_CATS = [
    { id: 'all',               label: 'All' },
    { id: 'Signature Stays',   label: 'Signature' },
    { id: 'Hotel Stays',       label: 'Hotels' },
    { id: 'Homestays & BnB',   label: 'Homestays' },
    { id: 'Apartments & Villas', label: 'Apartments' },
    { id: 'PG & Co-Living',    label: 'PG & Co-Living' },
  ];

  const catFilteredProperties = activeCatTab === 'all'
    ? allProperties
    : allProperties.filter(p => getPropertyCategory(p) === activeCatTab);

  const renderPropertyCard = (prop) => {
    const name = prop.property_name || prop.name || "Untitled Property";
    const locationParts = [prop.city, prop.country].filter(Boolean);
    const location = locationParts.join(", ") || "Location not specified";
    const detailsPieces = [];
    if (prop.property_type) detailsPieces.push(prop.property_type);
    const bedroomCount = prop.total_bedrooms || getRoomCount(prop.bedrooms);
    if (bedroomCount > 0) detailsPieces.push(`${bedroomCount} BR`);
    const bathroomCount = prop.total_bathrooms || getRoomCount(prop.bathrooms);
    if (bathroomCount > 0) detailsPieces.push(`${bathroomCount} BA`);
    if (prop.max_guests !== undefined && prop.max_guests !== null) detailsPieces.push(`Up to ${prop.max_guests} guests`);
    const details = detailsPieces.join(" • ");
    const priceText = prop.price
      ? activeTab === "monthly"
        ? `₹${Number(prop.price).toLocaleString("en-IN")} / month`
        : `₹${Number(prop.price).toLocaleString("en-IN")} / night`
      : "";
    const photoUrl = getPropertyPhoto(prop);
    const isMonthly = isMonthlyProperty(prop);
    return (
      <PropertyCard
        key={prop.id || prop._id || Math.random()}
        photoUrl={photoUrl} name={name} location={location} details={details} priceText={priceText}
        propertyId={prop.id || prop._id}
        onView={() => navigate(`/property/${prop.id || prop._id}${isMonthly ? '?rentalType=long' : '?rentalType=short'}`)}
        onEdit={() => { if (isMonthly) { setEditingMonthlyProperty(prop); } else { setEditingProperty(prop); } }}
        onDelete={async () => {
          if (!window.confirm("Are you sure you want to delete this property?")) return;
          try {
            const id = prop.id || prop._id;
            await axios.delete(`https://www.townmanor.ai/api/ovika/properties/${id}`);
            setProperties(prev => prev.filter(p => (p.id || p._id) !== id));
          } catch (e) { alert("Failed to delete property"); console.error(e); }
        }}
        onViewImages={() => setClassifyProperty(prop)}
      />
    );
  };

  if (!ownerId) {
    return (
      <div className={styles.page}>
        <main className={styles.grid}>
          <section>
            <h3 className={styles.sectionTitle}>My Properties</h3>
            <p>We couldn't detect your account yet.</p>
            <div style={{ marginTop: 12 }}>
              <button className={styles.iconBtn} onClick={refresh}>Retry detect account</button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.topbar}></div>
        <section style={{ marginTop: "-3px" }} className={styles.hero}>
          <img className={styles.heroBg} src="/Group 89.png" alt="hero background" />
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}><h1>Owner Dashboard</h1><p>Manage your properties and track your listings</p></div>
        </section>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", flexDirection: "column", gap: "12px" }}>
          <Loader size={40} style={{ animation: "spin 1s linear infinite", color: "#3b82f6" }} />
          <p style={{ fontSize: "16px", color: "#6b7280", fontWeight: 500 }}>Loading properties…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Owner Dashboard | OvikaLiving</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className={styles.topbar}></div>
      <section style={{ marginTop: "-3px" }} className={styles.hero}>
        <img className={styles.heroBg} src="/Group 89.png" alt="hero background" />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1>Owner Dashboard</h1>
          <p>Manage your properties and track your listings</p>
        </div>
      </section>

      <main className={styles.grid}>
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <h3 className={styles.sectionTitle} style={{ margin: 0 }}>My Properties</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => navigate('/admindashboard/calendar')} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: '#fff', color: '#c2772b', padding: '9px 18px', borderRadius: '8px', border: '1.5px solid #c2772b', fontSize: '14px', fontWeight: '600', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s ease' }}>
                <Calendar size={16} /> Calendar Blocking
              </button>
              <button type="button" onClick={() => navigate('/list-category')} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: '#c2772b', color: '#fff', padding: '9px 18px', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s ease' }}>
                <Plus size={16} /> Add Listing
              </button>
            </div>
          </div>

          {error && <p style={{ color: "red", marginBottom: '12px' }}>{error}</p>}

          {/* Category Tabs */}
          {allProperties.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {OWNER_CATS.map(cat => {
                const count = cat.id === 'all' ? allProperties.length : allProperties.filter(p => getPropertyCategory(p) === cat.id).length;
                const active = activeCatTab === cat.id;
                return (
                  <button key={cat.id} type="button" onClick={() => setActiveCatTab(cat.id)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '7px 14px', borderRadius: 20,
                    border: `1.5px solid ${active ? '#c2772b' : '#e5e7eb'}`,
                    background: active ? '#c2772b' : '#fff',
                    color: active ? '#fff' : '#374151',
                    fontSize: 13, fontWeight: active ? 700 : 500,
                    cursor: 'pointer', transition: 'all 0.18s ease',
                  }}>
                    {cat.label}
                    <span style={{ background: active ? 'rgba(255,255,255,0.25)' : '#f3f4f6', color: active ? '#fff' : '#6b7280', borderRadius: 999, fontSize: 11, fontWeight: 700, padding: '1px 7px', minWidth: 20, textAlign: 'center' }}>{count}</span>
                  </button>
                );
              })}
            </div>
          )}

          {allProperties.length === 0 ? (
            <EmptyState type="monthly" onAdd={() => navigate('/list-category')} />
          ) : catFilteredProperties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
              <p style={{ fontSize: 15, marginBottom: 12 }}>No properties in this category yet.</p>
              <button type="button" onClick={() => navigate('/list-category')} style={{ background: '#c2772b', color: '#fff', padding: '10px 24px', borderRadius: 8, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                <Plus size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />Add Listing
              </button>
            </div>
          ) : (
            <div className={styles.properties}>
              {catFilteredProperties.map(renderPropertyCard)}
            </div>
          )}
        </section>

        {editingProperty && (
          <EditPropertyModal property={editingProperty} onClose={() => setEditingProperty(null)} onRefresh={refresh} />
        )}

        {editingMonthlyProperty && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px 0' }}>
            <div style={{ width: '100%', maxWidth: '960px', position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
              <button type="button" onClick={() => setEditingMonthlyProperty(null)} style={{ position: 'absolute', top: '16px', right: '20px', zIndex: 10001, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} title="Close">
                &times;
              </button>
              <PGUpdateForm propId={String(editingMonthlyProperty.id || editingMonthlyProperty._id)} onComplete={() => { setEditingMonthlyProperty(null); refresh(); }} />
            </div>
          </div>
        )}
      </main>

      {classifyProperty && (
        <ImageClassificationModal
          property={classifyProperty}
          onClose={() => setClassifyProperty(null)}
        />
      )}

      <div style={{ display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e5e7eb', padding: '8px 16px 12px', zIndex: 100, gap: '8px' }} className={styles.mobileTabBar}>
        {[
          { key: 'monthly', label: 'Monthly', icon: <Calendar size={18} />, color: '#c2772b' },
          { key: 'nightly', label: 'Nightly', icon: <Moon size={18} />, color: '#c2772b' },
        ].map(tab => {
          const active = activeTab === tab.key;
          return (
            <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', background: active ? '#fff8f0' : 'transparent', border: active ? `1.5px solid ${tab.color}` : '1.5px solid transparent', borderRadius: '10px', padding: '8px 4px', color: active ? tab.color : '#9ca3af', cursor: 'pointer', fontSize: '12px', fontWeight: active ? '700' : '500' }}>
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}