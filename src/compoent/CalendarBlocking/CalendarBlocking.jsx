import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { AuthContext } from "../Login/AuthContext";
import "./CalendarBlocking.css";

const API_BASE = "https://www.townmanor.ai/api/ovika";
const BLOCKED_DATES_API = import.meta.env.DEV
  ? "http://localhost:3030/api/ovika/blocked-dates"
  : "https://townmanor.ai/api/ovika/blocked-dates";
const STORAGE_PREFIX = "ovika_blocked_";

// ─── helpers ────────────────────────────────────────────────────────────────

const toYMD = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const today = toYMD(new Date());

function getBlockedDatesLocal(propertyId) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + propertyId);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function fetchBlockedDatesFromAPI(propertyId) {
  try {
    const res = await axios.get(BLOCKED_DATES_API, {
      params: { property_id: propertyId },
      timeout: 6000,
    });
    const data = res.data;
    console.log(`📅 GET blocked-dates for property ${propertyId}:`, data);
    const arr = Array.isArray(data) ? data
      : Array.isArray(data?.dates) ? data.dates
      : Array.isArray(data?.blocked_dates) ? data.blocked_dates
      : null;
    if (arr !== null) {
      localStorage.setItem(STORAGE_PREFIX + propertyId, JSON.stringify(arr));
      return arr;
    }
  } catch (err) {
    console.error(`❌ GET blocked-dates failed for property ${propertyId}:`, err?.response?.status, err.message);
  }
  return getBlockedDatesLocal(propertyId);
}

function getUserIdFromStorage() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Try all possible id fields
    const id = parsed?.id || parsed?.owner_id || parsed?.ownerId || parsed?.user_id || parsed?._id || null;
    console.log("👤 user from localStorage:", parsed, "→ id:", id);
    return id ? Number(id) : null;
  } catch {
    return null;
  }
}

async function saveBlockedDates(propertyId, dates, ownerId) {
  localStorage.setItem(STORAGE_PREFIX + propertyId, JSON.stringify(dates));

  // Get user_id from every possible source
  const userId = Number(ownerId) || getUserIdFromStorage();

  const payload = {
    property_id: Number(propertyId),
    dates,
    user_id: userId,
  };

  console.log("📤 POST payload being sent:", JSON.stringify(payload));

  try {
    const res = await axios.post(BLOCKED_DATES_API, payload, { withCredentials: true });
    console.log("✅ Blocked dates saved to server:", res.data);
    return true;
  } catch (err) {
    console.error("❌ Failed to save:", err?.response?.status, err?.response?.data || err.message);
    return false;
  }
}

function extractOwnerId(obj) {
  if (!obj || typeof obj !== "object") return null;
  if (obj.owner_id) return String(obj.owner_id);
  if (obj.ownerId) return String(obj.ownerId);
  if (obj.id) return String(obj.id);
  if (obj._id) return String(obj._id);
  if (obj.data && typeof obj.data === "object") return extractOwnerId(obj.data);
  return null;
}

function getPropertyPhoto(prop) {
  if (!prop) return null;
  if (Array.isArray(prop.photos) && prop.photos.length > 0) {
    const idx = Number(prop.cover_photo_index);
    return prop.photos[!isNaN(idx) && prop.photos[idx] ? idx : 0];
  }
  if (typeof prop.photos === "string" && prop.photos.trim()) {
    return prop.photos.split(",")[0].trim();
  }
  return null;
}

// ─── Month Calendar ──────────────────────────────────────────────────────────

function MonthCalendar({ year, month, blocked, rangeStart, onDateClick }) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay(); // 0=Sun
  const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const cells = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(d);

  const monthLabel = firstDay.toLocaleString("en-IN", { month: "long", year: "numeric" });

  return (
    <div className="cb-month">
      <div className="cb-month-label">{monthLabel}</div>
      <div className="cb-day-headers">
        {DAYS.map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="cb-day-grid">
        {cells.map((day, i) => {
          if (!day) return <span key={`pad-${i}`} />;
          const ymd = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isPast = ymd < today;
          const isBlocked = blocked.includes(ymd);
          const isRangeStart = rangeStart === ymd;
          return (
            <button
              key={ymd}
              className={[
                "cb-day",
                isPast ? "cb-day--past" : "",
                isBlocked ? "cb-day--blocked" : "",
                isRangeStart ? "cb-day--range-start" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => !isPast && onDateClick(ymd)}
              title={isBlocked ? "Blocked — click to unblock" : "Click to block"}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Property Calendar Block ─────────────────────────────────────────────────

function PropertyCalendarBlock({ prop, ownerId }) {
  const id = prop.id || prop._id;
  // Start from localStorage cache, then sync from API
  const [blocked, setBlocked] = useState(() => getBlockedDatesLocal(id));
  const [rangeStart, setRangeStart] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [loadingDates, setLoadingDates] = useState(true);

  // Fetch from API on mount — ensures cross-device sync
  useEffect(() => {
    let cancelled = false;
    fetchBlockedDatesFromAPI(id).then((dates) => {
      if (!cancelled) { setBlocked(dates); setLoadingDates(false); }
    });
    return () => { cancelled = true; };
  }, [id]);

  const now = new Date();
  const [viewOffset, setViewOffset] = useState(0); // 0 = current month, 1 = next, etc.

  const name = prop.property_name || prop.name || "Untitled";
  const address = [prop.address, prop.city, prop.country].filter(Boolean).join(", ");
  const photo = getPropertyPhoto(prop);

  const showNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2500);
  };

  const persist = useCallback(
    async (newDates) => {
      setSaving(true);
      setBlocked(newDates);
      const ok = await saveBlockedDates(id, newDates, ownerId);
      setSaving(false);
      if (!ok) showNotice("⚠️ Saved locally but server sync failed — check console");
    },
    [id, ownerId]
  );

  const handleDateClick = (ymd) => {
    if (!rangeStart) {
      // First click: start range OR toggle single date
      setRangeStart(ymd);
    } else {
      // Second click: block range
      const start = rangeStart < ymd ? rangeStart : ymd;
      const end = rangeStart < ymd ? ymd : rangeStart;

      if (start === end) {
        // Same date — toggle
        const next = blocked.includes(start)
          ? blocked.filter((d) => d !== start)
          : [...new Set([...blocked, start])].sort();
        persist(next);
        showNotice(blocked.includes(start) ? "Date unblocked" : "Date blocked");
      } else {
        // Range — collect all dates
        const range = [];
        const cur = new Date(start);
        const endDate = new Date(end);
        while (cur <= endDate) {
          range.push(toYMD(cur));
          cur.setDate(cur.getDate() + 1);
        }
        // If all in range already blocked → unblock; otherwise block all
        const allBlocked = range.every((d) => blocked.includes(d));
        const next = allBlocked
          ? blocked.filter((d) => !range.includes(d))
          : [...new Set([...blocked, ...range])].sort();
        persist(next);
        showNotice(allBlocked ? `${range.length} dates unblocked` : `${range.length} dates blocked`);
      }
      setRangeStart(null);
    }
  };

  const unblockAll = () => {
    if (!window.confirm("Unblock all dates for this property?")) return;
    persist([]);
    showNotice("All dates unblocked");
  };

  // Compute which months to show (current + next 2)
  const months = [0, 1, 2].map((off) => {
    const d = new Date(now.getFullYear(), now.getMonth() + viewOffset + off, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  return (
    <div className="cb-prop-block">
      {/* Property header */}
      <div className="cb-prop-header">
        {photo ? (
          <img src={photo} alt={name} className="cb-prop-photo" />
        ) : (
          <div className="cb-prop-photo-placeholder">🏠</div>
        )}
        <div className="cb-prop-info">
          <h3 className="cb-prop-name">{name}</h3>
          <p className="cb-prop-address">{address}</p>
          <div className="cb-prop-stats">
            {loadingDates
              ? <span className="cb-stat-chip cb-stat-saving">Loading blocked dates…</span>
              : <span className="cb-stat-chip cb-stat-blocked">{blocked.length} dates blocked</span>
            }
            {rangeStart && (
              <span className="cb-stat-chip cb-stat-range">
                📍 Start: {rangeStart} — click another date to block range
              </span>
            )}
            {saving && <span className="cb-stat-chip cb-stat-saving">Saving…</span>}
          </div>
          {notice && <div className="cb-notice">{notice}</div>}
        </div>
        <div className="cb-prop-actions">
          {blocked.length > 0 && (
            <button className="cb-btn-unblock-all" onClick={unblockAll}>
              Unblock All
            </button>
          )}
          {rangeStart && (
            <button className="cb-btn-cancel-range" onClick={() => setRangeStart(null)}>
              Cancel Range
            </button>
          )}
        </div>
      </div>

      {/* Month navigation */}
      <div className="cb-month-nav">
        <button
          className="cb-nav-btn"
          onClick={() => setViewOffset((v) => Math.max(0, v - 1))}
          disabled={viewOffset === 0}
        >
          ← Prev
        </button>
        <button className="cb-nav-btn" onClick={() => setViewOffset((v) => v + 1)}>
          Next →
        </button>
      </div>

      {/* Calendars */}
      <div className="cb-calendars-row">
        {months.map(({ year, month }) => (
          <MonthCalendar
            key={`${year}-${month}`}
            year={year}
            month={month}
            blocked={blocked}
            rangeStart={rangeStart}
            onDateClick={handleDateClick}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="cb-legend">
        <span className="cb-legend-item"><span className="cb-legend-dot cb-legend-dot--free" /> Available</span>
        <span className="cb-legend-item"><span className="cb-legend-dot cb-legend-dot--blocked" /> Blocked</span>
        <span className="cb-legend-item"><span className="cb-legend-dot cb-legend-dot--past" /> Past</span>
      </div>
    </div>
  );
}

// ─── Rental type helper (same logic as DashBoardAdmin) ───────────────────────

const NIGHTLY_ONLY_CATEGORIES = ["villa", "cabin", "bungalow", "hotel"];
const MONTHLY_ONLY_CATEGORIES = ["flat", "penthouse", "pg"];
const PG_UPDATE_DEFAULT_TIMES = ["12:00", "12:00:00", "11:00", "11:00:00"];
const NIGHTLY_OVERRIDE_IDS = new Set([77, 78, 79, 80, 81]);
const MONTHLY_OVERRIDE_IDS = new Set([314, 315, 316, 317]);

function parseMeta(prop) {
  if (!prop) return {};
  let meta = prop.meta;
  if (!meta) return {};
  if (typeof meta === "string") { try { return JSON.parse(meta); } catch { return {}; } }
  if (typeof meta === "object") return meta;
  return {};
}

function isMonthlyProperty(prop) {
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
}

// ─── Main CalendarBlocking page ──────────────────────────────────────────────

export default function CalendarBlocking() {
  const { user } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ownerId, setOwnerId] = useState(null);
  const [activeCatTab, setActiveCatTab] = useState('all');

  const resolveOwnerId = useCallback(() => {
    const fromCtx = extractOwnerId(user);
    if (fromCtx) return fromCtx;
    try {
      const raw = localStorage.getItem("user");
      if (raw) return extractOwnerId(JSON.parse(raw));
    } catch {}
    return null;
  }, [user]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const id = resolveOwnerId();
      if (!id) {
        // Poll a bit for user context to load
        const poll = setInterval(() => {
          const rid = resolveOwnerId();
          if (rid) {
            clearInterval(poll);
            setOwnerId(rid);
          }
        }, 500);
        setTimeout(() => clearInterval(poll), 5000);
        setLoading(false);
        return;
      }
      if (mounted) setOwnerId(id);
      try {
        const res = await axios.get(`${API_BASE}/properties`, { timeout: 10000 });
        let all = [];
        if (Array.isArray(res.data)) all = res.data;
        else if (Array.isArray(res.data?.data)) all = res.data.data;
        else if (Array.isArray(res.data?.results)) all = res.data.results;
        const mine = all.filter((p) => {
          const candidates = [
            p.owner_id, p.ownerId, p.user_id, p.userId,
            p.meta?.ownerId, p.meta?.owner_id, p.owner,
          ].filter(Boolean);
          return candidates.some((c) => String(c) === String(id));
        });
        if (mounted) setProperties(mine);
      } catch (e) {
        console.error("CalendarBlocking: failed to load properties", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [resolveOwnerId]);

  return (
    <div className="cb-page">
      <Helmet>
        <title>Calendar Blocking | OvikaLiving Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {/* Hero */}
      <section className="cb-hero">
        <img className="cb-hero-bg" src="/Group 89.png" alt="" />
        <div className="cb-hero-overlay" />
        <div className="cb-hero-content">
          <h1>Calendar & Date Blocking</h1>
          <p>Block specific dates to prevent bookings on your properties</p>
        </div>
      </section>

      <div className="cb-body">
        {/* Category Tabs */}
        {properties.length > 0 && (() => {
          const getPropertyCategory = (p) => {
            const cat  = (p.property_category || '').toLowerCase().trim();
            const type = (p.property_type || '').toLowerCase().trim();
            const name = (p.property_name || p.name || '').toLowerCase();
            const meta = (() => { try { return typeof p.meta === 'object' ? p.meta : JSON.parse(p.meta || '{}'); } catch { return {}; } })();
            const metaCat = (meta.propertyCategory || '').toLowerCase().trim();
            if (name.includes('signature') || name.includes('ovika')) return 'Signature Stays';
            if (cat.includes('hotel') || type.includes('hotel') || name.includes('hotel')) return 'Hotel Stays';
            if (cat === 'pg & co-living' || cat === 'pg' || cat.includes('pg') || cat.includes('co-living') || cat.includes('coliving') || type.includes('pg') || metaCat.includes('pg')) return 'PG & Co-Living';
            if (cat === 'homestays & bnb' || cat.includes('homestay') || cat.includes('bnb') || type.includes('homestay') || type.includes('bnb')) return 'Homestays & BnB';
            if (cat === 'apartments & villas' || cat.includes('apartment') || cat.includes('villa') || cat.includes('studio') || cat.includes('flat') || type.includes('apartment') || type.includes('villa')) return 'Apartments & Villas';
            return 'Other';
          };
          const CATS = [
            { id: 'all',                 label: 'All' },
            { id: 'Signature Stays',     label: 'Signature' },
            { id: 'Hotel Stays',         label: 'Hotels' },
            { id: 'Homestays & BnB',     label: 'Homestays' },
            { id: 'Apartments & Villas', label: 'Apartments' },
            { id: 'PG & Co-Living',      label: 'PG & Co-Living' },
          ];
          return (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {CATS.map(cat => {
                const count = cat.id === 'all' ? properties.length : properties.filter(p => getPropertyCategory(p) === cat.id).length;
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
          );
        })()}

        {/* Instructions */}
        <div className="cb-instructions">
          <div className="cb-instr-item">
            <span className="cb-instr-icon">1️⃣</span>
            <span>Click a date to block it (click again to unblock)</span>
          </div>
          <div className="cb-instr-item">
            <span className="cb-instr-icon">2️⃣</span>
            <span>Click two different dates to block a full range</span>
          </div>
          <div className="cb-instr-item">
            <span className="cb-instr-icon">3️⃣</span>
            <span>Blocked dates will be unavailable for guests to book</span>
          </div>
        </div>

        {loading ? (
          <div className="cb-loading">
            <div className="cb-spinner" />
            <p>Loading your properties…</p>
          </div>
        ) : !ownerId ? (
          <div className="cb-empty">
            <p>Please log in to manage your calendar.</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="cb-empty">
            <p>No properties found under your account.</p>
          </div>
        ) : (() => {
          const getPropertyCategory = (p) => {
            const cat  = (p.property_category || '').toLowerCase().trim();
            const type = (p.property_type || '').toLowerCase().trim();
            const name = (p.property_name || p.name || '').toLowerCase();
            const meta = (() => { try { return typeof p.meta === 'object' ? p.meta : JSON.parse(p.meta || '{}'); } catch { return {}; } })();
            const metaCat = (meta.propertyCategory || '').toLowerCase().trim();
            if (name.includes('signature') || name.includes('ovika')) return 'Signature Stays';
            if (cat.includes('hotel') || type.includes('hotel') || name.includes('hotel')) return 'Hotel Stays';
            if (cat === 'pg & co-living' || cat === 'pg' || cat.includes('pg') || cat.includes('co-living') || cat.includes('coliving') || type.includes('pg') || metaCat.includes('pg')) return 'PG & Co-Living';
            if (cat === 'homestays & bnb' || cat.includes('homestay') || cat.includes('bnb') || type.includes('homestay') || type.includes('bnb')) return 'Homestays & BnB';
            if (cat === 'apartments & villas' || cat.includes('apartment') || cat.includes('villa') || cat.includes('studio') || cat.includes('flat') || type.includes('apartment') || type.includes('villa')) return 'Apartments & Villas';
            return 'Other';
          };
          const filtered = activeCatTab === 'all' ? properties : properties.filter(p => getPropertyCategory(p) === activeCatTab);
          return filtered.length === 0 ? (
            <div className="cb-empty">
              <p>No properties found in this category.</p>
            </div>
          ) : (
            <div className="cb-props-list">
              {filtered.map((prop) => (
                <PropertyCalendarBlock key={prop.id || prop._id} prop={prop} ownerId={ownerId} />
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
