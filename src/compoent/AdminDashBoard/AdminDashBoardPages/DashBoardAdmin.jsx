
import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import styles from "./Dashboard.module.css";
import { AuthContext } from "../../Login/AuthContext";
import { Home, Plus, Loader, Moon, Calendar, Building } from "lucide-react";
import PGUpdateForm from "../../ovikalistingform/PGUpdateForm";
import Tmx9PropertyForm from "../../ovikalistingform/Tmx9PropertyForm";
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

// ─── HELPER: Parse meta safely ─────────────────────────────────────────────
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

// ─── CLEAN DESCRIPTION: pehle se appended junk hatao ───────────────────────
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

// ─── MONTHLY vs NIGHTLY — FINAL LOGIC ───────────────────────────────────────
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
    const isMonthly = isMonthlyProperty(prop);
    const priceText = prop.price
      ? isMonthly
        ? `₹${Number(prop.price).toLocaleString("en-IN")} / month`
        : `₹${Number(prop.price).toLocaleString("en-IN")} / night`
      : "";
    const photoUrl = getPropertyPhoto(prop);
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
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px 0' }}>
            <div style={{ width: '100%', maxWidth: '960px', position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
              <button type="button" onClick={() => setEditingProperty(null)} style={{ position: 'absolute', top: '16px', right: '20px', zIndex: 10001, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} title="Close">
                &times;
              </button>
              <Tmx9PropertyForm propId={String(editingProperty.id || editingProperty._id)} onComplete={() => { setEditingProperty(null); refresh(); }} />
            </div>
          </div>
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
