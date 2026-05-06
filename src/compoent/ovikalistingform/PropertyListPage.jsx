
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { navClick, auxNavClick } from '../../utils/navClick';
import { FiSearch, FiMapPin, FiHeart, FiPlus, FiStar, FiX, FiMoon, FiCalendar, FiTag, FiHome, FiTrendingUp, FiAward, FiClock, FiMap, FiList, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { BiBed, BiBath, BiArea } from 'react-icons/bi';
import { GoogleMap, MarkerF, InfoWindowF } from '@react-google-maps/api';

const MAPTHRUST_API_KEY = 'AlzaSyMPwhjsTA8V3WjSO0SMbMsxq98NZIMXGAK';

function useMapThrustLoader() {
  const [isLoaded, setIsLoaded] = useState(() => !!(window.google && window.google.maps));
  useEffect(() => {
    if (window.google && window.google.maps) { setIsLoaded(true); return; }
    if (document.getElementById('mapthrust-script')) {
      const t = setInterval(() => {
        if (window.google && window.google.maps) { setIsLoaded(true); clearInterval(t); }
      }, 150);
      return () => clearInterval(t);
    }
    const s = document.createElement('script');
    s.id = 'mapthrust-script';
    s.src = `https://maps.mapthrust.io/maps/api/js?key=${MAPTHRUST_API_KEY}`;
    s.async = true;
    s.onload = () => setIsLoaded(true);
    document.head.appendChild(s);
  }, []);
  return { isLoaded };
}

const API_BASE_URL = 'https://www.townmanor.ai/api/ovika';

const CITIES = [
  'Delhi','Noida','Greater Noida','Ghaziabad','Gurugram','Faridabad',
  'Agra','Lucknow','Kanpur','Prayagraj','Varanasi','Mathura','Vrindavan',
  'Meerut','Bareilly','Aligarh','Moradabad','Hapur','Bulandshahr',
  'Haridwar','Rishikesh','Dehradun','Sonipat','Panipat','Ambala',
  'Karnal','Rohtak','Mumbai','Bengaluru','Hyderabad',
];
const PG_KEYWORDS = ['pg', 'paying guest', 'hostel', 'boys pg', 'girls pg', 'co-living', 'coliving'];

function fmtDate(v) {
  if (!v) return null;
  return new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// Module-level geocode cache (survives re-renders, cleared on page refresh)
const _geocodeCache = {};

async function nominatimGeocode(query) {
  if (_geocodeCache[query]) return _geocodeCache[query];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    if (data?.[0]) {
      const result = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      _geocodeCache[query] = result;
      return result;
    }
  } catch {}
  _geocodeCache[query] = null;
  return null;
}

// Noida sector → approx center coordinates
const NOIDA_SECTORS = {
  1:[28.5687,77.3248],2:[28.5699,77.3287],3:[28.5681,77.3327],4:[28.5712,77.3374],
  5:[28.5744,77.3400],6:[28.5760,77.3435],7:[28.5783,77.3468],8:[28.5800,77.3503],
  9:[28.5820,77.3540],10:[28.5839,77.3576],11:[28.5855,77.3610],12:[28.5872,77.3647],
  14:[28.5718,77.3520],15:[28.5731,77.3560],16:[28.5747,77.3596],17:[28.5765,77.3633],
  18:[28.5782,77.3670],19:[28.5800,77.3707],20:[28.5816,77.3745],21:[28.5833,77.3782],
  22:[28.5850,77.3818],23:[28.5866,77.3854],24:[28.5882,77.3890],25:[28.5745,77.3185],
  26:[28.5760,77.3218],27:[28.5776,77.3251],28:[28.5640,77.3180],29:[28.5654,77.3215],
  30:[28.5668,77.3250],31:[28.5682,77.3286],32:[28.5695,77.3322],33:[28.5709,77.3358],
  34:[28.5722,77.3394],35:[28.5736,77.3430],36:[28.5640,77.3450],37:[28.5650,77.3482],
  38:[28.5660,77.3515],39:[28.5670,77.3547],40:[28.5680,77.3580],41:[28.5690,77.3612],
  42:[28.5700,77.3645],43:[28.5710,77.3678],44:[28.5720,77.3710],45:[28.5730,77.3743],
  46:[28.5600,77.3480],47:[28.5610,77.3512],48:[28.5620,77.3545],49:[28.5630,77.3577],
  50:[28.5640,77.3610],51:[28.5550,77.3440],52:[28.5558,77.3472],53:[28.5566,77.3504],
  54:[28.5574,77.3537],55:[28.5582,77.3569],56:[28.5590,77.3601],57:[28.5598,77.3634],
  58:[28.5606,77.3666],59:[28.5614,77.3698],60:[28.5622,77.3731],61:[28.5500,77.3490],
  62:[28.5507,77.3523],63:[28.5514,77.3556],64:[28.5521,77.3588],65:[28.5528,77.3621],
  66:[28.5535,77.3654],67:[28.5542,77.3686],68:[28.5549,77.3719],69:[28.5556,77.3752],
  70:[28.5563,77.3784],71:[28.5450,77.3540],72:[28.5456,77.3573],73:[28.5462,77.3605],
  74:[28.5468,77.3638],75:[28.5474,77.3670],76:[28.5480,77.3703],77:[28.5486,77.3735],
  78:[28.5492,77.3768],79:[28.5498,77.3800],80:[28.5504,77.3833],81:[28.5400,77.3590],
  82:[28.5405,77.3623],83:[28.5410,77.3655],84:[28.5415,77.3688],85:[28.5420,77.3720],
  86:[28.5425,77.3753],87:[28.5430,77.3785],88:[28.5435,77.3818],89:[28.5440,77.3850],
  90:[28.5445,77.3883],91:[28.5350,77.3630],92:[28.5354,77.3663],93:[28.5358,77.3695],
  94:[28.5362,77.3728],95:[28.5366,77.3760],96:[28.5370,77.3793],97:[28.5374,77.3825],
  98:[28.5378,77.3858],99:[28.5382,77.3890],100:[28.5386,77.3923],
  101:[28.5300,77.3660],104:[28.5295,77.4000],105:[28.5230,77.4010],
  110:[28.5180,77.3920],112:[28.5150,77.3870],113:[28.5140,77.3840],
  115:[28.5120,77.3800],116:[28.5100,77.3760],117:[28.5090,77.3740],
  118:[28.5080,77.3720],119:[28.5070,77.3700],120:[28.5060,77.3680],
  121:[28.5050,77.3660],122:[28.5040,77.3640],123:[28.5030,77.3620],
  124:[28.5020,77.3600],125:[28.5010,77.3580],126:[28.5000,77.3560],
  127:[28.4990,77.3540],128:[28.4980,77.3520],129:[28.4970,77.3500],
  130:[28.4960,77.3480],131:[28.4950,77.3460],132:[28.4940,77.3440],
  133:[28.4930,77.3420],134:[28.4920,77.3400],135:[28.4910,77.3380],
  136:[28.4900,77.3360],137:[28.4890,77.3340],
};

const CITY_COORDS = {
  'noida': [28.5355, 77.3910],
  'greater noida': [28.4744, 77.5040],
  'delhi': [28.6139, 77.2090],
  'gurugram': [28.4595, 77.0266],
  'gurgaon': [28.4595, 77.0266],
  'faridabad': [28.4089, 77.3178],
  'ghaziabad': [28.6692, 77.4538],
  'noida extension': [28.6100, 77.4300],
};

function getApproxCoords(p) {
  const addr = (p.address || '').toLowerCase();
  const city = (p.city || '').toLowerCase();

  // Try to extract sector number from address
  const sectorMatch = addr.match(/sector[\s-]*(\d+)/i) || (p.address || '').match(/sector[\s-]*(\d+)/i);
  if (sectorMatch) {
    const num = parseInt(sectorMatch[1]);
    if (NOIDA_SECTORS[num]) {
      // Add tiny random offset so overlapping pins don't stack exactly
      return [NOIDA_SECTORS[num][0] + (Math.random() - 0.5) * 0.002, NOIDA_SECTORS[num][1] + (Math.random() - 0.5) * 0.002];
    }
  }

  // Fall back to city center
  for (const [key, coords] of Object.entries(CITY_COORDS)) {
    if (city.includes(key) || addr.includes(key)) {
      return [coords[0] + (Math.random() - 0.5) * 0.008, coords[1] + (Math.random() - 0.5) * 0.008];
    }
  }
  return null;
}

function formatMapPrice(price) {
  if (!price) return '';
  if (price >= 100000) return `${(price / 100000).toFixed(1)}L`;
  if (price >= 1000) return `${Math.round(price / 1000)}k`;
  return String(price);
}


function MiniCalPLP({ value, onChange, onClose, title, minDate }) {
  const today = new Date();
  const initDate = value ? new Date(value) : today;
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());
  const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const sel = value ? new Date(value) : null;
  const isSelected = d => sel && d === sel.getDate() && viewMonth === sel.getMonth() && viewYear === sel.getFullYear();
  const isPast = d => {
    if (!d || !minDate) return false;
    const cell = new Date(viewYear, viewMonth, d);
    const min = new Date(minDate); min.setHours(0,0,0,0);
    return cell < min;
  };
  const handleDay = d => {
    if (!d || isPast(d)) return;
    onChange(`${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`);
  };
  return (
    <div onMouseDown={e => e.stopPropagation()} style={{ background:'#fff', border:'1.5px solid #e8d9c0', borderRadius:12, padding:14, boxShadow:'0 8px 28px rgba(0,0,0,0.14)', minWidth:240, zIndex:1000 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
        <span style={{ fontSize:13, fontWeight:700, color:'#1a1a1a' }}>{title}</span>
        <button onMouseDown={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#999', fontSize:16, lineHeight:1 }}>×</button>
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
        <button onMouseDown={() => viewMonth === 0 ? (setViewMonth(11), setViewYear(y=>y-1)) : setViewMonth(m=>m-1)} style={{ background:'none', border:'1px solid #e8d9c0', borderRadius:6, padding:'2px 8px', cursor:'pointer', fontSize:14 }}>‹</button>
        <span style={{ fontSize:13, fontWeight:600, color:'#1a1a1a' }}>{MONTHS[viewMonth]} {viewYear}</span>
        <button onMouseDown={() => viewMonth === 11 ? (setViewMonth(0), setViewYear(y=>y+1)) : setViewMonth(m=>m+1)} style={{ background:'none', border:'1px solid #e8d9c0', borderRadius:6, padding:'2px 8px', cursor:'pointer', fontSize:14 }}>›</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2 }}>
        {DAYS.map(d => <div key={d} style={{ textAlign:'center', fontSize:10, fontWeight:600, color:'#b89a70', padding:'2px 0' }}>{d}</div>)}
        {cells.map((d,i) => (
          <div key={i} onMouseDown={() => handleDay(d)} style={{
            textAlign:'center', fontSize:12, padding:'5px 2px', borderRadius:6, cursor: d && !isPast(d) ? 'pointer' : 'default',
            background: isSelected(d) ? '#C98B3E' : 'transparent',
            color: isSelected(d) ? '#fff' : isPast(d) ? '#ddd' : d ? '#1a1a1a' : 'transparent',
            fontWeight: isSelected(d) ? 700 : 400,
          }}>{d||''}</div>
        ))}
      </div>
    </div>
  );
}

const GM_MAP_OPTIONS = {
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  zoomControl: true,
  styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }],
};

function PropertyMapView({ properties, isMonthly, onCardClick }) {
  const { isLoaded } = useMapThrustLoader();
  const [activePin, setActivePin] = useState(null);
  const mapRef = useRef(null);

  const validProps = properties.filter(p => p._mapLat && p._mapLng);
  const center = validProps.length > 0
    ? { lat: validProps[0]._mapLat, lng: validProps[0]._mapLng }
    : { lat: 28.5355, lng: 77.3910 };

  const fitBounds = useCallback((map, props) => {
    if (!map || !window.google) return;
    if (props.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      props.forEach(p => bounds.extend({ lat: p._mapLat, lng: p._mapLng }));
      map.fitBounds(bounds, { top: 60, right: 40, bottom: 40, left: 40 });
    } else if (props.length === 1) {
      map.setCenter({ lat: props[0]._mapLat, lng: props[0]._mapLng });
      map.setZoom(14);
    }
  }, []);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    fitBounds(map, validProps);
  }, []);

  // Re-fit bounds whenever filtered properties change
  useEffect(() => {
    if (mapRef.current && isLoaded) {
      setActivePin(null);
      fitBounds(mapRef.current, validProps);
    }
  }, [properties, isLoaded]);

  if (!isLoaded) return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f0e8', borderRadius: 12 }}>
      <div style={{ width: 36, height: 36, border: '3px solid #e8d9c0', borderTopColor: '#C98B3E', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ height: '100%', width: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid #e8d9c0' }}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={13}
        options={GM_MAP_OPTIONS}
        onLoad={onMapLoad}
      >
        {validProps.map(p => {
          const isPG = p.property_category === 'PG';
          const price = p._mapPrice || 0;
          const accent = isPG ? '#7C3AED' : isMonthly ? '#C98B3E' : '#0f172a';
          const label = price ? `₹${formatMapPrice(price)}` : '•';
          const svgIcon = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="90" height="36">` +
            `<rect x="2" y="2" width="86" height="26" rx="13" fill="white" stroke="${accent}" stroke-width="2.5"/>` +
            `<text x="45" y="19" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="bold" fill="${accent}">${label}</text>` +
            `<polygon points="45,32 39,27 51,27" fill="${accent}"/>` +
            `</svg>`
          )}`;

          const photos = Array.isArray(p.photos) ? p.photos : [];
          const coverPhoto = photos[Number(p.cover_photo_index) || 0] || photos[0];
          const imgSrc = coverPhoto
            ? (coverPhoto.startsWith('http') ? coverPhoto : `https://www.townmanor.ai${coverPhoto}`)
            : null;

          return (
            <React.Fragment key={p.id}>
              <MarkerF
                position={{ lat: p._mapLat, lng: p._mapLng }}
                icon={{ url: svgIcon, scaledSize: new window.google.maps.Size(90, 36), anchor: new window.google.maps.Point(45, 36) }}
                onClick={() => setActivePin(activePin === p.id ? null : p.id)}
              />
              {activePin === p.id && (
                <InfoWindowF
                  position={{ lat: p._mapLat, lng: p._mapLng }}
                  onCloseClick={() => setActivePin(null)}
                  options={{ pixelOffset: new window.google.maps.Size(0, -38) }}
                >
                  <div style={{ fontFamily: "'Inter', sans-serif", width: 230, padding: 0 }}>
                    {imgSrc && (
                      <img src={imgSrc} alt={p.property_name} onError={e => { e.target.style.display = 'none'; }}
                        style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: '6px 6px 0 0', display: 'block' }} />
                    )}
                    <div style={{ padding: '10px 12px 12px' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 3, lineHeight: 1.3 }}>{p.property_name}</div>
                      <div style={{ fontSize: 11, color: '#888', marginBottom: 7, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <FiMapPin style={{ fontSize: 10, flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {[p.address, p.city].filter(Boolean).join(', ')}
                        </span>
                      </div>
                      {price > 0 && (
                        <div style={{ fontSize: 14, fontWeight: 700, color: accent, marginBottom: 8 }}>
                          ₹{price.toLocaleString('en-IN')}<span style={{ fontSize: 11, fontWeight: 400, color: '#888' }}>/{isMonthly ? 'month' : 'night'}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                        {isPG && <span style={{ background: '#7C3AED22', color: '#7C3AED', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>PG</span>}
                        {isMonthly && !isPG && <span style={{ background: '#C98B3E22', color: '#C98B3E', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>Monthly</span>}
                        {!isMonthly && <span style={{ background: '#11182722', color: '#374151', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>Nightly</span>}
                      </div>
                      <button onClick={() => onCardClick(p)} style={{ width: '100%', padding: '7px 0', background: '#C98B3E', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        View Details
                      </button>
                    </div>
                  </div>
                </InfoWindowF>
              )}
            </React.Fragment>
          );
        })}
      </GoogleMap>
    </div>
  );
}

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
  const [imgHovered, setImgHovered] = useState(false);

  const randomRating = useMemo(() => {
    const FIVE_STAR_IDS = [77, 78, 79, 80, 81, 315, 316, 317, 323];
    if (FIVE_STAR_IDS.includes(Number(property.id))) return '5.0';
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

  const allPhotos = Array.isArray(property.photos) ? property.photos : [];

  const getPhotoUrl = (photo) => {
    if (!photo) return null;
    if (photo.startsWith('http')) return photo;
    return `${API_BASE_URL}/uploads/${photo.startsWith('/') ? photo.substring(1) : photo}`;
  };

  const fallbackImg = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  const slidePhotos = allPhotos.length > 0 ? allPhotos : [coverPhoto];
  const [slideIdx, setSlideIdx] = useState(Number(property.cover_photo_index) || 0);


  return (
    <div
      className="plp-hcard"
      onClick={(e) => { if (!e.target.closest('[data-action]')) { const rt = isMonthly ? 'long' : 'short'; sessionStorage.setItem('ovika_rental_type', rt); navClick(e, `/property/${property.id}?rentalType=${rt}`, navigate); } }}
      onAuxClick={(e) => { if (!e.target.closest('[data-action]')) { const rt = isMonthly ? 'long' : 'short'; sessionStorage.setItem('ovika_rental_type', rt); auxNavClick(e, `/property/${property.id}?rentalType=${rt}`); } }}
    >
      {/* ── LEFT: Image block ── */}
      <div className="plp-hcard-imgblock">
        <div className="plp-hcard-mainimg" style={{ position: 'relative', overflow: 'hidden' }} onMouseEnter={() => setImgHovered(true)} onMouseLeave={() => setImgHovered(false)}>
          <img
            src={getPhotoUrl(slidePhotos[slideIdx]) || fallbackImg}
            alt={property.property_name}
            onError={e => { e.target.onerror = null; e.target.src = fallbackImg; }}
            style={{ transition: 'opacity 0.5s ease', width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Fav button */}
          <button
            className="plp-hcard-fav"
            data-action="fav"
            onClick={e => { e.stopPropagation(); setFav(!fav); }}
            style={{ background: fav ? '#e84040' : 'rgba(255,255,255,0.92)', color: fav ? '#fff' : '#555' }}
          >
            <FiHeart style={{ fill: fav ? '#fff' : 'none', fontSize: 13 }} />
          </button>
          {/* Prev / Next buttons */}
          {slidePhotos.length > 1 && (
            <>
              <button
                data-action="prev"
                onClick={e => { e.stopPropagation(); setSlideIdx(i => (i - 1 + slidePhotos.length) % slidePhotos.length); }}
                style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', zIndex: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.18)', opacity: imgHovered ? 1 : 0, transition: 'opacity 0.2s ease, background 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
              ><FiChevronLeft size={16} /></button>
              <button
                data-action="next"
                onClick={e => { e.stopPropagation(); setSlideIdx(i => (i + 1) % slidePhotos.length); }}
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', zIndex: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.18)', opacity: imgHovered ? 1 : 0, transition: 'opacity 0.2s ease, background 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
              ><FiChevronRight size={16} /></button>
            </>
          )}
        </div>
      </div>

      {/* ── RIGHT: Details block ── */}
      <div className="plp-hcard-details">

        {/* Top row: name + rating */}
        <div className="plp-hcard-toprow">
          <h3 className="plp-hcard-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {property.property_name || 'Untitled Property'}
            {(property.property_name?.toLowerCase().includes('signature') || (() => { try { const m = typeof property.meta === 'object' ? property.meta : JSON.parse(property.meta || '{}'); return !!m.verified_badge; } catch { return false; } })()) && (
              <img
                src="/ovikaver.png"
                alt="Ovika Verified"
                style={{ height: 22, width: 'auto', flexShrink: 0, filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.25))', pointerEvents: 'none' }}
              />
            )}
          </h3>
          <div className="plp-hcard-rating">
            <FiStar style={{ fontSize: 11, fill: '#fff', color: '#fff' }} />
            <span>{randomRating}</span>
          </div>
        </div>

        {/* Location */}
        <div className="plp-hcard-loc">
          <FiMapPin style={{ fontSize: 11, color: '#C98B3E', flexShrink: 0 }} />
          <span>{property.city || ''}{property.address ? `, ${property.address}` : ''}</span>
        </div>

        {/* Specs — bed/bath/area */}
        {property.property_category !== 'PG' && (bedCount > 0 || bathCount > 0 || property.area > 0) && (
          <div className="plp-hcard-specs">
            {bedCount > 0 && <span className="plp-hcard-spec-pill"><BiBed style={{ fontSize: 13 }} />{bedCount} Bed</span>}
            {bathCount > 0 && <span className="plp-hcard-spec-pill"><BiBath style={{ fontSize: 13 }} />{bathCount} Bath</span>}
            {property.area > 0 && <span className="plp-hcard-spec-pill"><BiArea style={{ fontSize: 13 }} />{property.area} sqft</span>}
          </div>
        )}

        {/* Amenity chips */}
        {Array.isArray(property.amenities) && property.amenities.length > 0 && (
          <div className="plp-hcard-amenities">
            {property.amenities.slice(0, 5).map((a, i) => (
              <span key={i} className="plp-hcard-chip">{a}</span>
            ))}
            {property.amenities.length > 5 && (
              <span className="plp-hcard-chip plp-hcard-chip--more">+{property.amenities.length - 5} more</span>
            )}
          </div>
        )}


        {/* Bottom: price + buttons */}
        <div className="plp-hcard-bottom">
          <div className="plp-hcard-price-block">
            {forceRequest ? (
              <span style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>Price on Request</span>
            ) : (
              <>
                {pricePrefix && <span className="plp-hcard-price-prefix">{pricePrefix}</span>}
                <span className="plp-hcard-price">{formatPrice(displayPrice)}</span>
                {displayPrice > 0 && <span className="plp-hcard-price-unit">{priceLabel}</span>}
              </>
            )}
          </div>
          <div className="plp-hcard-btns">
            <button
              className="plp-hcard-btn plp-hcard-btn--outline"
              data-action="view"
              onClick={e => { e.stopPropagation(); const rt = isMonthly ? 'long' : 'short'; sessionStorage.setItem('ovika_rental_type', rt); navClick(e, `/property/${property.id}?rentalType=${rt}`, navigate); }}
              onAuxClick={e => { e.stopPropagation(); const rt = isMonthly ? 'long' : 'short'; auxNavClick(e, `/property/${property.id}?rentalType=${rt}`); }}
            >View Details</button>
            <button
              className="plp-hcard-btn plp-hcard-btn--fill"
              data-action="book"
              onClick={e => { e.stopPropagation(); const rt = isMonthly ? 'long' : 'short'; sessionStorage.setItem('ovika_rental_type', rt); navClick(e, `/property/${property.id}?rentalType=${rt}`, navigate); }}
              onAuxClick={e => { e.stopPropagation(); const rt = isMonthly ? 'long' : 'short'; auxNavClick(e, `/property/${property.id}?rentalType=${rt}`); }}
            >Book Now</button>
          </div>
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
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listPopupOpen, setListPopupOpen] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const [mapView, setMapView] = useState(false);
  const [geocodedCoords, setGeocodedCoords] = useState({});
  const geocodeQueueRef = useRef(null);
  const [showCitySug, setShowCitySug] = useState(false);
  const [showCheckInCal, setShowCheckInCal] = useState(false);
  const [showCheckOutCal, setShowCheckOutCal] = useState(false);
  const [showGuestsBox, setShowGuestsBox] = useState(false);
  const searchBoxRef = useRef(null);
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
    setPriceMin(1000); setPriceMax(500000);
    setRoomsFilter(null);
    setPropTypeFilter([]); setAmenitiesFilter([]);
    setFurnishingFilter(null); setTenantFilter(null);
    setFoodFilter(null); setPetsFilter(null); setCoupleFilter(null);
    setUserLat(null); setUserLng(null);
    setSearch('');
    setActiveCat(null);
    setSortBy('recommended');
    if (!lockedRental) {
      setRentalType(null);
      sessionStorage.removeItem('ovika_rental_type');
    }
  };

  // Close search dropdowns on outside click
  useEffect(() => {
    const onOutside = e => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowCitySug(false); setShowCheckInCal(false); setShowCheckOutCal(false); setShowGuestsBox(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const handleSearchSubmit = () => {
    const term = search.trim().toLowerCase();
    const isPg = PG_KEYWORDS.some(kw => term.includes(kw));
    if (isPg && !lockedRental) {
      setRentalType('long');
      setActiveCat(CATEGORIES.find(c => c.id === 'PG') || null);
      sessionStorage.setItem('ovika_rental_type', 'long');
    }
    setShowCitySug(false);
    setCurrentPage(1);
  };

  const getMeta = (p) => {
    if (!p.meta) return {};
    if (typeof p.meta === 'object') return p.meta;
    try { return JSON.parse(p.meta); } catch { return {}; }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getGuestPolicy = (p) => {
    const raw = p.guest_policy;
    if (!raw) return {};
    if (typeof raw === 'string') { try { return JSON.parse(raw); } catch { return {}; } }
    return raw;
  };

  const getAmenities = (p) => {
    const m = getMeta(p);
    let arr = [];
    if (Array.isArray(p.amenities)) arr = p.amenities;
    else if (typeof p.amenities === 'string') {
      try { const parsed = JSON.parse(p.amenities); arr = Array.isArray(parsed) ? parsed : []; } catch { arr = []; }
    }
    const metaAms = Array.isArray(m.amenities) ? m.amenities : [];
    return [...new Set([...arr, ...metaAms])].map(a => (a || '').toLowerCase());
  };

  const applyFilter = (list, cat, q, rental, uLat, uLng) => {
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

      const matchesProp = (p, token, fullQuery = '') => {
        const t = token.toLowerCase();
        const name    = (p.property_name  || '').toLowerCase();
        const addr    = (p.address        || '').toLowerCase();
        const city    = (p.city           || '').toLowerCase();
        const sector  = (p.sector         || '').toLowerCase();
        const cat     = (p.property_category || '').toLowerCase();
        const type    = (p.property_type  || '').toLowerCase();
        const subcat  = (p.property_subCategory || p.property_subcategory || '').toLowerCase();
        const amenities = getAmenities(p);

        // Raw inclusion
        if (name.includes(t) || addr.includes(t) || city.includes(t) || sector.includes(t)) return true;
        if (cat.includes(t) || type.includes(t) || subcat.includes(t)) return true;

        // Semantic shortcuts & Synonyms
        const isPg = cat === 'pg' || type.includes('pg') || name.includes('pg');
        const isFlat = type.includes('apartment') || type.includes('flat') || type.includes('studio') || cat.includes('apartment');

        if ((t === 'pg' || t === 'room' || t === 'stay' || t === 'pgs') && isPg) return true;
        if ((t === 'flat' || t === 'apartment' || t === 'house' || t === 'living' || t === 'accommodation') && isFlat) return true;
        
        if (t === 'girls' || t === 'female' || t === 'girl') {
          if (name.includes('girl') || cat.includes('girl') || subcat.includes('girl') || type.includes('girl')) return true;
          const pts = [
            ...(Array.isArray(getMeta(p).preferredTenants) ? getMeta(p).preferredTenants : []),
            ...(Array.isArray(getGuestPolicy(p).preferredTenants) ? getGuestPolicy(p).preferredTenants : [])
          ].map(x => (x || '').toLowerCase());
          if (pts.some(x => x.includes('female') || x.includes('girl'))) return true;
        }

        if (t === 'boys' || t === 'male' || t === 'boy') {
          if (name.includes('boy') || cat.includes('boy') || subcat.includes('boy') || type.includes('boy')) return true;
          const pts = [
            ...(Array.isArray(getMeta(p).preferredTenants) ? getMeta(p).preferredTenants : []),
            ...(Array.isArray(getGuestPolicy(p).preferredTenants) ? getGuestPolicy(p).preferredTenants : [])
          ].map(x => (x || '').toLowerCase());
          if (pts.some(x => x.includes('male') || x.includes('boy'))) return true;
        }

        if (t === 'studio' && (type.includes('studio') || name.includes('studio'))) return true;
        
        // Extended City/Location
        if ((t === 'noida' || t === 'ncr') && (city.includes('noida') || addr.includes('noida'))) return true;
        if (t === 'greater' && (city.includes('greater') || addr.includes('greater'))) return true;
        if (t === 'gurugram' || t === 'gurgaon' || t === 'ggn') {
           if (city.includes('gurugram') || addr.includes('gurugram') || city.includes('gurgaon') || addr.includes('gurgaon')) return true;
        }
        if (t === 'delhi' && (city.includes('delhi') || addr.includes('delhi'))) return true;

        // Amenities & Features
        if (t === 'furnished' && (name.includes('furnished') || type.includes('furnished') || addr.includes('furnished'))) return true;
        if (t === 'ac' && amenities.some(a => a.includes('ac') || a.includes('air conditioning'))) return true;
        if (t === 'wifi' && amenities.some(a => a.includes('wi-fi') || a.includes('wifi') || a.includes('internet'))) return true;
        if (t === 'food' && (amenities.some(a => a.includes('food') || a.includes('meal')) || getMeta(p).foodAvailable)) return true;

        // Categories
        if (t === 'signature' && (name.includes('signature') || cat.includes('signature'))) return true;
        if (t === 'luxury' || t === 'luxe' || t === 'premium') {
            if (name.includes('luxe') || name.includes('premium') || cat.includes('luxe') || cat.includes('premium')) return true;
        }
        if (t === 'economy' || t === 'budget') {
            if (name.includes('economy') || name.includes('budget') || cat.includes('economy')) return true;
        }

        // Handle "Sector XX" queries
        if (t.startsWith('sector')) {
            const num = t.replace('sector', '').trim();
            if (num && (sector.includes(num) || addr.includes(num))) return true;
        }
        if (/^\d+$/.test(t)) { // If token is just a number (e.g. "62")
            if (sector.includes(t) || addr.includes(t) || name.includes(t)) return true;
        }

        // Price detection in query (e.g., "pg under 10000")
        const fullQ = fullQuery.toLowerCase();
        if (fullQ.includes('under') || fullQ.includes('below') || fullQ.includes('less than')) {
            const match = fullQ.match(/(?:under|below|less than)\s*(?:rs\.?\s*)?(\d+)/i);
            if (match) {
                const maxPrice = parseInt(match[1]);
                const pPrice = Number(p.price) || Number(p.base_rate) || 0;
                if (pPrice > 0 && pPrice <= maxPrice) return true;
            }
        }

        return false;
      };

      const qL = q.trim().toLowerCase();
      const keywords = qL.split(/\s+/).filter(w => w.length > 1 && !STOP_WORDS.has(w));
      // If all words were stop-words, treat the whole phrase as one keyword
      const tokens = keywords.length > 0 ? keywords : [qL];

      // Score each property by how many keywords it matches
      const scored = result
        .map(p => {
          const score = tokens.reduce((acc, token) => {
            const m = matchesProp(p, token, qL);
            if (m) return acc + 1;
            // Fuzzy-ish fallback: if token is long and mostly contained in name/addr
            if (token.length > 3) {
                const name = (p.property_name || '').toLowerCase();
                const addr = (p.address || '').toLowerCase();
                if (name.includes(token) || addr.includes(token)) return acc + 0.5;
            }
            return acc;
          }, 0);
          return { p, score };
        })
        .filter(({ score }) => score > 0);

      // Sort: more matches first
      scored.sort((a, b) => {
        if (uLat && uLng) {
          const latA = Number(a.p.latitude) || Number(getMeta(a.p).latitude) || 0;
          const lngA = Number(a.p.longitude) || Number(getMeta(a.p).longitude) || 0;
          const latB = Number(b.p.latitude) || Number(getMeta(b.p).latitude) || 0;
          const lngB = Number(b.p.longitude) || Number(getMeta(b.p).longitude) || 0;
          
          if (latA && lngA && latB && lngB) {
            const distA = calculateDistance(uLat, uLng, latA, lngA);
            const distB = calculateDistance(uLat, uLng, latB, lngB);
            // Combined score: keyword match weight + proximity weight
            // Each unit of distance (km) reduces score slightly
            return (b.score - (distB * 0.1)) - (a.score - (distA * 0.1));
          }
        }
        return b.score - a.score;
      });

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
    let filteredResults = applyFilter(properties, activeCat, search, rentalType, userLat, userLng);

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
          
          if (sortBy === 'distance' && userLat && userLng) {
            const distA = calculateDistance(userLat, userLng, Number(a.latitude) || 0, Number(a.longitude) || 0);
            const distB = calculateDistance(userLat, userLng, Number(b.latitude) || 0, Number(b.longitude) || 0);
            return distA - distB;
          }

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
  }, [search, activeCat, properties, rentalType, priceMin, priceMax, roomsFilter, propTypeFilter, amenitiesFilter, furnishingFilter, tenantFilter, foodFilter, petsFilter, coupleFilter, sortBy, userLat, userLng]);

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
      const rType = params.get('rentalType');
      if (rType) { setRentalType(rType); sessionStorage.setItem('ovika_rental_type', rType); }
      else {
        const stored = sessionStorage.getItem('ovika_rental_type');
        if (stored) setRentalType(stored);
      }
    }

    const lat = params.get('lat');
    const lng = params.get('lng');
    if (lat) setUserLat(Number(lat));
    if (lng) setUserLng(Number(lng));

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

  // Geocode filtered properties that lack lat/lng when map view is active
  useEffect(() => {
    if (!mapView || filtered.length === 0) return;

    // Cancel any in-progress queue
    if (geocodeQueueRef.current) clearTimeout(geocodeQueueRef.current);

    const needsGeocode = filtered.filter(p => {
      const meta = (() => { try { return typeof p.meta === 'object' ? p.meta : JSON.parse(p.meta || '{}'); } catch { return {}; } })();
      const hasCoords = (Number(p.latitude) || Number(meta.latitude)) &&
                        (Number(p.longitude) || Number(meta.longitude));
      if (hasCoords) return false;
      const key = [p.address, p.city, p.state || 'India'].filter(Boolean).join(', ').trim();
      return key.length > 3 && !(_geocodeCache[key] !== undefined);
    });

    let i = 0;
    const runNext = () => {
      if (i >= needsGeocode.length) return;
      const p = needsGeocode[i++];
      const key = [p.address, p.city, p.state || 'India'].filter(Boolean).join(', ').trim();
      nominatimGeocode(key).then(result => {
        if (result) {
          setGeocodedCoords(prev => ({ ...prev, [p.id]: result }));
        }
        geocodeQueueRef.current = setTimeout(runNext, 1200);
      });
    };
    geocodeQueueRef.current = setTimeout(runNext, 100);

    return () => { if (geocodeQueueRef.current) clearTimeout(geocodeQueueRef.current); };
  }, [mapView, filtered]);

  const isMonthly = rentalType === 'long';

  // Enrich filtered properties with map coords (exact → geocoded → approx sector/city) + resolved price
  const filteredWithCoords = useMemo(() => filtered.map(p => {
    const meta = (() => { try { return typeof p.meta === 'object' ? p.meta : JSON.parse(p.meta || '{}'); } catch { return {}; } })();

    // Resolve display price — same logic as PropertyCard.getDisplayPrice()
    let mapPrice = 0;
    const isPGp = p.property_category === 'PG';
    if (isPGp) {
      if (isMonthly) {
        const beds = (() => { try { return typeof p.bedrooms === 'string' ? JSON.parse(p.bedrooms) : (p.bedrooms || []); } catch { return []; } })();
        const prices = beds.map(b => Number(b.price) || Number(b.monthly_price) || 0).filter(v => v > 0);
        const minRoom = prices.length > 0 ? Math.min(...prices) : 0;
        const monthly = minRoom || Number(meta.perMonthPrice) || Number(meta.monthlyPrice) || Number(p.monthly_price) || Number(p.base_rate) || 0;
        mapPrice = monthly > 1500 ? monthly : 0;
      } else {
        mapPrice = Number(p.base_rate) || Number(p.price) || Number(meta.perNightPrice) || 0;
      }
    } else if (isMonthly) {
      const monthly = Number(meta.perMonthPrice) || Number(meta.monthlyPrice) || Number(p.monthly_price) || Number(p.price) || 0;
      mapPrice = monthly > 1500 ? monthly : 0;
    } else {
      mapPrice = Number(p.price) || 0;
    }

    // Resolve coordinates
    let lat = Number(p.latitude) || Number(meta.latitude) || geocodedCoords[p.id]?.lat || null;
    let lng = Number(p.longitude) || Number(meta.longitude) || geocodedCoords[p.id]?.lng || null;
    let coordsApprox = false;
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      const approx = getApproxCoords(p);
      if (approx) { lat = approx[0]; lng = approx[1]; coordsApprox = true; }
    }
    return {
      ...p,
      _mapPrice: mapPrice,
      _mapLat: lat && !isNaN(lat) ? lat : null,
      _mapLng: lng && !isNaN(lng) ? lng : null,
      _coordsApprox: coordsApprox,
    };
  }), [filtered, geocodedCoords, isMonthly]); // eslint-disable-line

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
          flex: 1 1 380px;
          min-width: 200px;
          max-width: 620px;
        }
        .plp-topbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        /* ── Property list (desktop: single column horizontal cards) ── */
        .plp-grid {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* ── Horizontal card shell ── */
        .plp-hcard {
          display: flex;
          flex-direction: row;
          background: #fff;
          border-radius: 14px;
          border: 1px solid #ede8df;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          overflow: hidden;
          cursor: pointer;
          transition: box-shadow 0.22s ease, transform 0.22s ease;
          height: 210px;
        }
        .plp-hcard:hover {
          box-shadow: 0 8px 28px rgba(0,0,0,0.12);
          transform: translateY(-2px);
        }

        /* ── Image block (left) ── */
        .plp-hcard-imgblock {
          display: flex;
          flex-direction: row;
          width: 340px;
          flex-shrink: 0;
          gap: 3px;
          overflow: hidden;
          border-radius: 14px 0 0 14px;
        }
        .plp-hcard-mainimg {
          flex: 1;
          position: relative;
          min-width: 0;
          overflow: hidden;
          background: #f3f4f6;
        }
        .plp-hcard-mainimg img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.45s ease;
          display: block;
        }
        .plp-hcard:hover .plp-hcard-mainimg img { transform: scale(1.05); }

        .plp-hcard-catbadge {
          position: absolute; top: 10px; left: 10px;
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 10px; font-weight: 700; padding: 3px 8px;
          border-radius: 20px; letter-spacing: 0.3px;
          text-transform: uppercase;
        }
        .plp-hcard-fav {
          position: absolute; top: 10px; right: 10px;
          width: 28px; height: 28px; border-radius: 50%;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          transition: all 0.2s ease;
        }

        /* Thumbnail strip (right of main img) */
        .plp-hcard-thumbs {
          display: flex;
          flex-direction: column;
          gap: 3px;
          width: 90px;
          flex-shrink: 0;
          overflow: hidden;
        }
        .plp-hcard-thumb {
          flex: 1;
          position: relative;
          overflow: hidden;
          background: #e5e7eb;
        }
        .plp-hcard-thumb img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
        }
        .plp-hcard-thumb-more {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.45);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 12px; font-weight: 700;
        }

        /* ── Details block (right) ── */
        .plp-hcard-details {
          flex: 1;
          min-width: 0;
          padding: 14px 18px 14px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          overflow: hidden;
        }
        .plp-hcard-toprow {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }
        .plp-hcard-name {
          font-size: 15px; font-weight: 700; color: #111;
          margin: 0; line-height: 1.3;
          overflow: hidden; display: -webkit-box;
          -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          flex: 1;
        }
        .plp-hcard-rating {
          display: inline-flex; align-items: center; gap: 3px;
          background: #2e7d32; color: #fff;
          font-size: 12px; font-weight: 700;
          padding: 3px 8px; border-radius: 6px; flex-shrink: 0;
        }
        .plp-hcard-loc {
          display: flex; align-items: center; gap: 4px;
          font-size: 12px; color: #6b7280;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .plp-hcard-specs {
          display: flex; flex-wrap: wrap; gap: 6px;
        }
        .plp-hcard-spec-pill {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 12px; color: #374151; font-weight: 500;
          background: #f3f4f6; border-radius: 20px; padding: 3px 10px;
        }
        .plp-hcard-amenities {
          display: flex; flex-wrap: wrap; gap: 5px;
        }
        .plp-hcard-chip {
          font-size: 11px; color: #555; font-weight: 500;
          background: #f8f9fa; border: 1px solid #e5e7eb;
          border-radius: 20px; padding: 2px 9px;
        }
        .plp-hcard-chip--more {
          color: #C98B3E; border-color: rgba(201,139,62,0.3);
          background: #FFF6EE; font-weight: 600;
        }

        /* Bottom: price + buttons */
        .plp-hcard-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid #f3f4f6;
        }
        .plp-hcard-price-block {
          display: flex; align-items: baseline; gap: 4px;
        }
        .plp-hcard-price-prefix {
          font-size: 11px; color: #94a3b8;
        }
        .plp-hcard-price {
          font-size: 20px; font-weight: 700; color: #111; line-height: 1;
        }
        .plp-hcard-price-unit {
          font-size: 12px; color: #6b7280;
        }
        .plp-hcard-btns {
          display: flex; gap: 8px; flex-shrink: 0;
        }
        .plp-hcard-btn {
          padding: 8px 18px; border-radius: 8px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          font-family: inherit; transition: all 0.18s ease;
          white-space: nowrap;
        }
        .plp-hcard-btn--outline {
          background: #fff; color: #1e293b;
          border: 1.5px solid #cbd5e1;
        }
        .plp-hcard-btn--outline:hover { background: #f8fafc; border-color: #94a3b8; }
        .plp-hcard-btn--fill {
          background: #C98B3E; color: #fff; border: none;
          box-shadow: 0 2px 8px rgba(201,139,62,0.3);
        }
        .plp-hcard-btn--fill:hover { background: #AF7834; }

        /* ── Mobile: revert to vertical card ── */
        @media (max-width: 768px) {
          .plp-grid { gap: 12px; }
          .plp-hcard { flex-direction: column; height: auto; }
          .plp-hcard-imgblock {
            width: 100%; height: 200px;
            border-radius: 14px 14px 0 0;
            flex-direction: row;
          }
          .plp-hcard-thumbs { display: none; }
          .plp-hcard-details { padding: 12px 14px 14px; gap: 5px; }
          .plp-hcard-name { font-size: 13px; }
          .plp-hcard-price { font-size: 17px; }
          .plp-hcard-bottom { flex-wrap: wrap; gap: 8px; }
          .plp-hcard-btns { width: 100%; }
          .plp-hcard-btn { flex: 1; text-align: center; padding: 9px 0; }
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
        /* Map popup styling */
        .plp-map-popup .leaflet-popup-content-wrapper { padding: 0; border-radius: 10px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .plp-map-popup .leaflet-popup-content { margin: 0; width: 240px !important; }
        .plp-map-popup .leaflet-popup-tip-container { display: none; }
        /* ── Responsive ── */
        @media (max-width: 860px) {
          .plp-sidebar { display: none; }
          .plp-mobile-filter-btn { display: inline-flex !important; }
          .plp-mapview-btn { display: none !important; }
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
        <div className="plp-right" style={mapView ? { overflow: 'hidden', display: 'flex', flexDirection: 'column' } : {}}>
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

            {/* ── Enhanced Search Bar ── */}
            <div className="plp-topbar-search" ref={searchBoxRef} style={{ position: 'relative' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 0,
                background: '#fff', border: '1.5px solid #e8d9c0',
                borderRadius: 11, overflow: 'visible',
                boxShadow: '0 1px 4px rgba(201,139,62,0.08)',
              }}>
                {/* City / keyword search */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', flex: 1, minWidth: 0, borderRight: '1px solid #e8d9c0', position: 'relative' }}>
                  <FiSearch style={{ fontSize: 13, color: '#b89a70', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="City, area, property..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setShowCitySug(true); setCurrentPage(1); }}
                    onFocus={() => setShowCitySug(true)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSearchSubmit(); }}
                    style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, color: '#1a1a1a', background: 'transparent', fontFamily: 'inherit', minWidth: 0 }}
                  />
                  {search && <button onClick={() => { setSearch(''); setShowCitySug(false); }} style={{ width: 16, height: 16, borderRadius: '50%', border: 'none', background: '#e8d9c0', color: '#8B5E2A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><FiX style={{ fontSize: 8 }} /></button>}
                  {/* City suggestions dropdown */}
                  {showCitySug && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6, background: '#fff', border: '1.5px solid #e8d9c0', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 999, maxHeight: 220, overflowY: 'auto' }}>
                      {(search.trim()
                        ? CITIES.filter(c => c.toLowerCase().includes(search.toLowerCase()))
                        : CITIES
                      ).map(city => (
                        <div key={city} onMouseDown={() => { setSearch(city); setShowCitySug(false); setCurrentPage(1); }}
                          style={{ padding: '8px 14px', fontSize: 13, color: '#1a1a1a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fdf5ec'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <FiMapPin style={{ fontSize: 12, color: '#C98B3E' }} /> {city}
                        </div>
                      ))}
                      {search.trim() && CITIES.filter(c => c.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                        <div style={{ padding: '10px 14px', fontSize: 12, color: '#999' }}>No matching city — searching "{search}"</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Check-in (nightly only) */}
                {!isMonthly && (
                  <div
                    onMouseDown={() => { setShowCheckInCal(v => !v); setShowCheckOutCal(false); setShowCitySug(false); setShowGuestsBox(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', cursor: 'pointer', borderRight: '1px solid #e8d9c0', flexShrink: 0, position: 'relative' }}
                  >
                    <FiCalendar style={{ fontSize: 12, color: '#b89a70' }} />
                    <span style={{ fontSize: 12, color: checkIn ? '#1a1a1a' : '#b89a70', whiteSpace: 'nowrap' }}>{checkIn ? fmtDate(checkIn) : 'Check-in'}</span>
                    {showCheckInCal && (
                      <div style={{ position: 'absolute', top: '110%', left: 0, zIndex: 999 }}>
                        <MiniCalPLP value={checkIn} onChange={v => { setCheckIn(v); setShowCheckInCal(false); if (!checkOut) setShowCheckOutCal(true); }} onClose={() => setShowCheckInCal(false)} title="Check-in" minDate={new Date().toISOString().split('T')[0]} />
                      </div>
                    )}
                  </div>
                )}

                {/* Check-out (nightly only) */}
                {!isMonthly && (
                  <div
                    onMouseDown={() => { setShowCheckOutCal(v => !v); setShowCheckInCal(false); setShowCitySug(false); setShowGuestsBox(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', cursor: 'pointer', borderRight: '1px solid #e8d9c0', flexShrink: 0, position: 'relative' }}
                  >
                    <FiCalendar style={{ fontSize: 12, color: '#b89a70' }} />
                    <span style={{ fontSize: 12, color: checkOut ? '#1a1a1a' : '#b89a70', whiteSpace: 'nowrap' }}>{checkOut ? fmtDate(checkOut) : 'Check-out'}</span>
                    {showCheckOutCal && (
                      <div style={{ position: 'absolute', top: '110%', left: 0, zIndex: 999 }}>
                        <MiniCalPLP value={checkOut} onChange={v => { setCheckOut(v); setShowCheckOutCal(false); }} onClose={() => setShowCheckOutCal(false)} title="Check-out" minDate={checkIn || new Date().toISOString().split('T')[0]} />
                      </div>
                    )}
                  </div>
                )}

                {/* Guests */}
                <div
                  onMouseDown={() => { setShowGuestsBox(v => !v); setShowCitySug(false); setShowCheckInCal(false); setShowCheckOutCal(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', cursor: 'pointer', flexShrink: 0, position: 'relative', borderRight: '1px solid #e8d9c0' }}
                >
                  <FiHeart style={{ fontSize: 12, color: '#b89a70' }} />
                  <span style={{ fontSize: 12, color: '#1a1a1a', whiteSpace: 'nowrap' }}>{guests} Guest{guests !== 1 ? 's' : ''}</span>
                  {showGuestsBox && (
                    <div onMouseDown={e => e.stopPropagation()} style={{ position: 'absolute', top: '110%', right: 0, background: '#fff', border: '1.5px solid #e8d9c0', borderRadius: 10, padding: '12px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 999, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button onMouseDown={() => setGuests(g => Math.max(1, g - 1))} style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #e8d9c0', background: '#faf7f3', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5E2A' }}>−</button>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', minWidth: 20, textAlign: 'center' }}>{guests}</span>
                      <button onMouseDown={() => setGuests(g => g + 1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #e8d9c0', background: '#faf7f3', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5E2A' }}>+</button>
                    </div>
                  )}
                </div>

                {/* Search button */}
                <button
                  onMouseDown={handleSearchSubmit}
                  style={{ padding: '6px 14px', background: '#C98B3E', color: '#fff', border: 'none', borderRadius: '0 9px 9px 0', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5 }}
                >
                  <FiSearch style={{ fontSize: 13 }} />
                </button>
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
                  {userLat && userLng && <option value="distance">Nearby</option>}
                  <option value="price_asc">Price ↑</option>
                  <option value="price_desc">Price ↓</option>
                </select>
              </div>
              {/* Map / List toggle — desktop only, theme-matched */}
              <div
                className="plp-mapview-btn"
                style={{
                  display: 'flex', alignItems: 'center',
                  background: '#fdf8f2',
                  borderRadius: 10, padding: 3, gap: 0,
                  border: '1.5px solid #e0c9a6',
                  boxShadow: '0 1px 4px rgba(201,139,62,0.12)',
                }}
              >
                {[{ label: 'List', icon: <FiList style={{ fontSize: 13 }} />, val: false },
                  { label: 'Map',  icon: <FiMap  style={{ fontSize: 13 }} />, val: true  }]
                  .map(({ label, icon, val }) => {
                    const active = mapView === val;
                    return (
                      <button
                        key={label}
                        onClick={() => setMapView(val)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          padding: '6px 14px',
                          background: active ? '#C98B3E' : 'transparent',
                          color: active ? '#fff' : '#8B6A3A',
                          border: 'none', borderRadius: 7,
                          fontWeight: active ? 700 : 500,
                          fontSize: 12.5,
                          cursor: 'pointer', fontFamily: 'inherit',
                          boxShadow: active ? '0 2px 8px rgba(201,139,62,0.35)' : 'none',
                          transition: 'all 0.2s ease', whiteSpace: 'nowrap',
                        }}
                      >
                        {icon} {label}
                      </button>
                    );
                  })
                }
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

        {/* ── Properties Grid + optional Map split ── */}
        {mapView ? (
          /* ── MAP VIEW: compact list left + map right ── */
          <div style={{ display: 'flex', gap: 12, height: 'calc(100% - 70px)', overflow: 'hidden' }}>
            {/* Compact mini-card list */}
            <div style={{ flex: '0 0 300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 4, scrollbarWidth: 'thin' }}>
              {filteredWithCoords.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 16px', background: '#fff', borderRadius: 14, border: '2px dashed #e5e7eb' }}>
                  <FiSearch style={{ fontSize: 28, color: '#ccc', display: 'block', margin: '0 auto 10px' }} />
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#222', margin: '0 0 10px' }}>No Properties Found</h3>
                  <button onClick={() => { setSearch(''); setActiveCat(null); resetSidebar(); }} style={{ padding: '8px 20px', background: '#C98B3E', color: '#fff', border: 'none', borderRadius: 9, fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Clear Filters</button>
                </div>
              ) : filteredWithCoords.map(p => {
                const price = p._mapPrice || 0;
                const photos = Array.isArray(p.photos) ? p.photos : [];
                const cover = photos[Number(p.cover_photo_index) || 0] || photos[0];
                const imgSrc = cover ? (cover.startsWith('http') ? cover : `https://www.townmanor.ai${cover}`) : null;
                const rt = isMonthly ? 'long' : 'short';
                return (
                  <div
                    key={p.id}
                    onClick={() => { sessionStorage.setItem('ovika_rental_type', rt); navigate(`/property/${p.id}?rentalType=${rt}`); }}
                    style={{ display: 'flex', gap: 10, background: '#fff', borderRadius: 10, border: '1px solid #ede8df', padding: 10, cursor: 'pointer', transition: 'box-shadow 0.18s', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'}
                  >
                    <div style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#f3f4f6' }}>
                      {imgSrc && <img src={imgSrc} alt={p.property_name} onError={e => { e.target.style.display = 'none'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1a1a1a', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
                        {p.property_name}
                      </div>
                      <div style={{ fontSize: 11, color: '#888', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <FiMapPin style={{ fontSize: 10, marginRight: 2 }} />{[p.address, p.city].filter(Boolean).join(', ')}
                      </div>
                      {price > 0 && (
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#C98B3E' }}>
                          ₹{price.toLocaleString('en-IN')}<span style={{ fontSize: 10, fontWeight: 400, color: '#999' }}>/{isMonthly ? 'mo' : 'night'}</span>
                        </div>
                      )}
                      {p._mapLat && p._mapLng && (
                        <div style={{ fontSize: 10, color: p._coordsApprox ? '#f59e0b' : '#22c55e', marginTop: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: p._coordsApprox ? '#f59e0b' : '#22c55e', display: 'inline-block' }} />
                          {p._coordsApprox ? 'Area pin' : 'Exact pin'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Map panel — fills remaining space */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <PropertyMapView
                properties={filteredWithCoords}
                isMonthly={isMonthly}
                onCardClick={p => {
                  const rt = isMonthly ? 'long' : 'short';
                  sessionStorage.setItem('ovika_rental_type', rt);
                  navigate(`/property/${p.id}?rentalType=${rt}`);
                }}
              />
            </div>
          </div>
        ) : (
          /* ── LIST VIEW (original) ── */
          (() => {
            const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
            const pageItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

            if (filtered.length === 0) return (
              <div style={{ textAlign: 'center', padding: '80px 24px', background: '#fff', borderRadius: 16, border: '2px dashed #e5e7eb' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                  <FiSearch style={{ fontSize: 32, color: '#ccc' }} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#222', margin: '0 0 8px' }}>No Properties Found</h3>
                <p style={{ color: '#9ca3af', fontSize: 15, margin: '0 0 24px' }}>
                  {search ? `No matches for "${search}"` : activeCat ? `No properties in ${activeCat.title}` : 'No properties available at the moment.'}
                </p>
                <button onClick={() => { setSearch(''); setActiveCat(null); resetSidebar(); }} style={{ padding: '10px 28px', background: '#C98B3E', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(201,139,62,0.3)' }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 32, paddingBottom: 8, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); document.querySelector('.plp-right')?.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={currentPage === 1}
                      style={{ padding: '8px 16px', borderRadius: 9, fontWeight: 600, fontSize: 13, border: '1.5px solid #e5e7eb', background: currentPage === 1 ? '#f9fafb' : '#fff', color: currentPage === 1 ? '#d1d5db' : '#374151', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
                    >← Prev</button>

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
                          style={{ width: 38, height: 38, borderRadius: 9, fontWeight: 700, fontSize: 14, border: '1.5px solid', borderColor: currentPage === item ? '#C98B3E' : '#e5e7eb', background: currentPage === item ? '#C98B3E' : '#fff', color: currentPage === item ? '#fff' : '#374151', cursor: 'pointer', fontFamily: 'inherit', boxShadow: currentPage === item ? '0 2px 8px rgba(201,139,62,0.3)' : 'none' }}
                        >{item}</button>
                      ))
                    }

                    <button
                      onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); document.querySelector('.plp-right')?.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={currentPage === totalPages}
                      style={{ padding: '8px 16px', borderRadius: 9, fontWeight: 600, fontSize: 13, border: '1.5px solid #e5e7eb', background: currentPage === totalPages ? '#f9fafb' : '#fff', color: currentPage === totalPages ? '#d1d5db' : '#374151', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
                    >Next →</button>

                    <span style={{ fontSize: 13, color: '#9ca3af', marginLeft: 8 }}>
                      Page {currentPage} of {totalPages} &nbsp;·&nbsp; {filtered.length} properties
                    </span>
                  </div>
                )}
              </>
            );
          })()
        )}
        </div>{/* end right content */}
      </div>{/* end plp-body */}
    </div>
  );
};

export default PropertyListPage;