import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search, ChevronDown } from 'lucide-react';

const API_BASE_URL = 'https://www.townmanor.ai/api/ovika';
const SHORT_TERM_TYPES = ['entire place', 'private room', 'shared room', 'hotel room', 'homestay'];
const isLongTermProperty = (p) => !SHORT_TERM_TYPES.includes((p.property_type || '').toLowerCase());

const CITIES = [
  'Delhi','Noida','Greater Noida','Ghaziabad','Gurugram','Faridabad',
  'Agra','Lucknow','Kanpur','Prayagraj','Varanasi','Mathura','Vrindavan',
  'Meerut','Bareilly','Aligarh','Moradabad','Hapur','Bulandshahr',
  'Haridwar','Rishikesh','Dehradun','Sonipat','Panipat','Ambala',
  'Karnal','Rohtak','Mumbai','Bengaluru','Hyderabad',
];

const DATE_OPTIONS = ['Today', 'Tomorrow', 'This Weekend', 'Next Week', 'This Month'];

function fmt(n) {
  if (!n || n === 0) return null;
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
  if (n >= 1000) return '₹' + Math.round(n / 1000) + 'K';
  return '₹' + n;
}

function getBreakpoint() {
  const w = window.innerWidth;
  if (w <= 640) return 'mobile';
  if (w <= 1024) return 'tablet';
  return 'desktop';
}

export default function HomePageNew1() {
  const navigate = useNavigate();
  const [city, setCity] = useState('Noida');
  const [dateLabel, setDateLabel] = useState('Today');
  const [showCity, setShowCity] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [bp, setBp] = useState(getBreakpoint());
  const [shortRate, setShortRate] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(true);
  const cityRef = useRef(null);
  const dateRef = useRef(null);

  useEffect(() => {
    const onResize = () => setBp(getBreakpoint());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const handler = e => {
      if (cityRef.current && !cityRef.current.contains(e.target)) setShowCity(false);
      if (dateRef.current && !dateRef.current.contains(e.target)) setShowDate(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/properties`)
      .then(r => r.json())
      .then(data => {
        const list = data?.data || [];
        const shortPrices = list
          .filter(p => p.property_category !== 'PG' && !isLongTermProperty(p))
          .map(p => Number(p.base_rate) || Number(p.price) || 0)
          .filter(v => v >= 500 && v <= 30000);
        const pgNightly = list.filter(p => p.property_category === 'PG').map(p => {
          try { const m = typeof p.meta === 'string' ? JSON.parse(p.meta) : (p.meta || {}); return Number(m.perNightPrice) || 0; } catch { return 0; }
        }).filter(v => v >= 300 && v <= 3000);
        const allShort = [...shortPrices, ...pgNightly].filter(v => v > 0);
        if (allShort.length > 0) setShortRate(Math.min(...allShort));
      })
      .catch(() => {})
      .finally(() => setRatesLoading(false));
  }, []);

  const filteredCities = citySearch.trim()
    ? CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
    : CITIES;

  const handleSearch = (rentalType) => {
    const p = new URLSearchParams();
    if (city) { p.set('city', city); p.set('search', city); }
    if (rentalType) { p.set('rentalType', rentalType); sessionStorage.setItem('ovika_rental_type', rentalType); }
    navigate(`/properties?${p}`);
  };

  const shortDisplay = ratesLoading ? '—' : (shortRate ? `${fmt(shortRate)}/night` : '₹2,499/night');
  const longDisplay = '₹4,999/month';

  const dd = {
    position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 999,
    background: '#fff', borderRadius: 12, boxShadow: '0 10px 36px rgba(0,0,0,0.14)',
    border: '1px solid #f0ece4', minWidth: 180, overflow: 'hidden',
  };

  /* ── Shared search bar ── */
  const SearchBar = ({ compact }) => (
    <div style={{
      background: '#fff', borderRadius: compact ? 12 : 14, display: 'flex', alignItems: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1.5px solid #e8dfd0', overflow: 'hidden',
    }}>
      <div ref={cityRef} style={{ position: 'relative', flex: 1 }}>
        <div onClick={() => { setShowCity(!showCity); setShowDate(false); }}
          style={{ display: 'flex', alignItems: 'center', gap: compact ? 5 : 8, padding: compact ? '10px 10px' : '11px 14px', cursor: 'pointer', borderRight: '1px solid #f0ece4' }}>
          <MapPin size={compact ? 13 : 14} style={{ color: '#c2772b', flexShrink: 0 }} />
          {!compact && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.55rem', color: '#bbb', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>Location</div>
              <div style={{ fontSize: '0.85rem', color: '#1a1209', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{city}</div>
            </div>
          )}
          {compact && <span style={{ fontSize: '0.85rem', color: '#1a1209', fontWeight: 600 }}>{city}</span>}
          <ChevronDown size={12} style={{ color: '#bbb', marginLeft: compact ? 'auto' : undefined, flexShrink: 0 }} />
        </div>
        {showCity && (
          <div onClick={e => e.stopPropagation()} style={{ ...dd, width: compact ? 220 : 240 }}>
            <div style={{ padding: compact ? '8px 10px' : '10px 12px', borderBottom: '1px solid #f0ece4' }}>
              <input autoFocus placeholder="Search city..." value={citySearch} onChange={e => setCitySearch(e.target.value)}
                style={{ width: '100%', border: '1px solid #e0d0b8', borderRadius: compact ? 8 : 10, padding: compact ? '6px 8px' : '8px 12px', fontSize: compact ? '0.82rem' : '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ maxHeight: 220, overflowY: 'auto' }}>
              {filteredCities.map(c => (
                <div key={c} onClick={() => { setCity(c); setShowCity(false); setCitySearch(''); }}
                  style={{ padding: compact ? '9px 14px' : '10px 16px', fontSize: compact ? '0.82rem' : '0.88rem', color: c === city ? '#c2772b' : '#444', fontWeight: c === city ? 600 : 400, cursor: 'pointer', background: c === city ? '#fef9f2' : 'transparent', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={12} style={{ color: '#c2772b', flexShrink: 0 }} />{c}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div ref={dateRef} style={{ position: 'relative', flex: compact ? 1 : 0.9 }}>
        <div onClick={() => { setShowDate(!showDate); setShowCity(false); }}
          style={{ display: 'flex', alignItems: 'center', gap: compact ? 5 : 8, padding: compact ? '10px 10px' : '11px 14px', cursor: 'pointer', borderRight: '1px solid #f0ece4' }}>
          <Calendar size={compact ? 13 : 14} style={{ color: '#888', flexShrink: 0 }} />
          {!compact && (
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.55rem', color: '#bbb', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>Move-in</div>
              <div style={{ fontSize: '0.85rem', color: '#1a1209', fontWeight: 600 }}>{dateLabel}</div>
            </div>
          )}
          {compact && <span style={{ fontSize: '0.85rem', color: '#1a1209', fontWeight: 600 }}>{dateLabel}</span>}
          <ChevronDown size={12} style={{ color: '#bbb', marginLeft: compact ? 'auto' : undefined, flexShrink: 0 }} />
        </div>
        {showDate && (
          <div onClick={e => e.stopPropagation()} style={dd}>
            {DATE_OPTIONS.map(d => (
              <div key={d} onClick={() => { setDateLabel(d); setShowDate(false); }}
                style={{ padding: compact ? '10px 14px' : '11px 18px', fontSize: compact ? '0.82rem' : '0.88rem', color: d === dateLabel ? '#c2772b' : '#444', fontWeight: d === dateLabel ? 600 : 400, cursor: 'pointer', background: d === dateLabel ? '#fef9f2' : 'transparent' }}>
                {d}
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={() => handleSearch(null)} style={{
        flexShrink: 0, padding: compact ? '10px 14px' : '11px 18px', border: 'none',
        background: '#c2772b', color: '#fff', fontSize: compact ? '0.8rem' : '0.82rem',
        fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        transition: 'background 0.2s', whiteSpace: 'nowrap',
        borderRadius: compact ? '0 10px 10px 0' : '0 12px 12px 0',
        margin: compact ? '3px 3px 3px 0' : '4px 4px 4px 0',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = '#a8631f'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#c2772b'; }}>
        <Search size={compact ? 13 : 14} /> {compact ? 'Search' : 'Show Options'}
      </button>
    </div>
  );


  /* ════════ MOBILE (≤640px) ════════ */
  if (bp === 'mobile') {
    return (
      <div style={{ background: 'linear-gradient(160deg,#f5efe4,#ede4cf)', minHeight: '100svh', fontFamily: "'Poppins',sans-serif", boxSizing: 'border-box' }}>

        {/* Hero Image */}
        <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
          <img src="/newhome1mobile.png" alt=""
            onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'; }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 55%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, padding: '16px 18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ display: 'inline-flex', alignSelf: 'flex-start', background: 'rgba(194,119,43,0.88)', borderRadius: 20, padding: '3px 12px', marginBottom: 8 }}>
              <span style={{ fontSize: '0.56rem', color: '#fff', letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 600 }}>✦ Smart Stay Platform</span>
            </div>
            <h1 style={{ color: '#fff', fontSize: '1.35rem', fontWeight: 700, margin: 0, textShadow: '0 2px 12px rgba(0,0,0,0.7)', lineHeight: 1.25 }}>
              Find Smart Stays<br /><span style={{ color: '#f0c070' }}>in Noida</span> &amp; Greater Noida
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.74rem', margin: '6px 0 0', lineHeight: 1.5 }}>Verified PGs, Apartments &amp; Premium Homes</p>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '16px 14px 28px' }}>

          {/* Nightly Card */}
          <div style={{ background: '#fff', borderRadius: 16, marginBottom: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.09)', border: '1px solid #f0e8da' }}>
            <div style={{ display: 'flex', alignItems: 'stretch' }}>
              <div style={{ width: 110, flexShrink: 0, position: 'relative', overflow: 'hidden', minHeight: 140 }}>
                <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&q=80&auto=format&fit=crop" alt=""
                  onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&q=80'; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.12)' }} />
                <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center' }}>
                  <span style={{ fontSize: '0.52rem', color: '#fff', fontWeight: 700, background: 'rgba(194,119,43,0.92)', borderRadius: 8, padding: '2px 7px', textTransform: 'uppercase', letterSpacing: 0.4 }}>🌙 Nightly</span>
                </div>
              </div>
              <div style={{ flex: 1, padding: '14px 14px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.62rem', color: '#8a6a3a', fontWeight: 600, marginBottom: 4 }}>Short trips · Business · Weekends</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 300, color: '#1a1209', lineHeight: 1.1, marginBottom: 8 }}>{shortDisplay}</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {['AC', 'Wi-Fi', 'Housekeeping'].map(f => (
                      <span key={f} style={{ fontSize: '0.58rem', color: '#7a5530', background: '#fdf0e0', border: '1px solid #e8c88a', borderRadius: 20, padding: '2px 8px', fontWeight: 600 }}>{f}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => handleSearch('short')} style={{ width: '100%', padding: '9px 0', borderRadius: 9, border: 'none', background: '#c2772b', color: '#fff', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', marginTop: 10 }}>
                  Check Availability
                </button>
              </div>
            </div>
          </div>

          {/* Monthly Card */}
          <div style={{ background: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.09)', border: '1px solid #f0e8da' }}>
            <div style={{ display: 'flex', alignItems: 'stretch' }}>
              <div style={{ width: 110, flexShrink: 0, position: 'relative', overflow: 'hidden', minHeight: 140 }}>
                <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=300&q=80&auto=format&fit=crop" alt=""
                  onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&q=80'; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.12)' }} />
                <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center' }}>
                  <span style={{ fontSize: '0.52rem', color: '#f0c070', fontWeight: 700, background: 'rgba(26,18,9,0.88)', borderRadius: 8, padding: '2px 7px', textTransform: 'uppercase', letterSpacing: 0.4 }}>🏠 Monthly</span>
                </div>
              </div>
              <div style={{ flex: 1, padding: '14px 14px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.62rem', color: '#8a6a3a', fontWeight: 600, marginBottom: 4 }}>Professionals · Students · Long-term</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 300, color: '#1a1209', lineHeight: 1.1, marginBottom: 8 }}>{longDisplay}</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {['Furnished', 'No Brokerage', 'Flexible'].map(f => (
                      <span key={f} style={{ fontSize: '0.58rem', color: '#7a5530', background: '#fdf0e0', border: '1px solid #e8c88a', borderRadius: 20, padding: '2px 8px', fontWeight: 600 }}>{f}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => handleSearch('long')} style={{ width: '100%', padding: '9px 0', borderRadius: 9, border: '1.5px solid #c2772b', background: 'transparent', color: '#c2772b', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', marginTop: 10 }}>
                  Explore Rooms
                </button>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 14, padding: '0 2px' }}>
            {[['✦', 'Fully Furnished'], ['⚡', 'Instant Move-in'], ['🛡', '100% Verified']].map(([icon, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#c2772b', fontSize: '0.65rem' }}>{icon}</span>
                <span style={{ color: '#5a4a3a', fontSize: '0.66rem', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <SearchBar compact />
        </div>
      </div>
    );
  }


  /* ════════ TABLET (641–1024px) ════════ */
  if (bp === 'tablet') {
    return (
      <div style={{ background: 'linear-gradient(160deg,#f5efe4,#ede4cf)', minHeight: '100svh', fontFamily: "'Poppins',sans-serif", boxSizing: 'border-box', padding: '0 0 32px' }}>

        {/* Hero */}
        <div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
          <img src="/newhome1mobile.png" alt=""
            onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80'; }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 50%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.65) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, padding: '24px 32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ display: 'inline-flex', alignSelf: 'flex-start', background: 'rgba(194,119,43,0.88)', borderRadius: 20, padding: '4px 14px', marginBottom: 10 }}>
              <span style={{ fontSize: '0.6rem', color: '#fff', letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 600 }}>✦ Smart Stay Platform</span>
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, margin: 0, textShadow: '0 2px 14px rgba(0,0,0,0.7)', lineHeight: 1.2 }}>
              Find Smart Stays<br /><span style={{ color: '#f0c070' }}>in Noida</span> &amp; Greater Noida
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem', margin: '8px 0 0', lineHeight: 1.5 }}>Verified PGs, Apartments &amp; Premium Homes across India</p>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ padding: '20px 24px 0' }}>
          <SearchBar compact={false} />
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '20px 24px 0' }}>

          {/* Nightly Card */}
          <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: '1px solid #f0e8da' }}>
            <div style={{ height: 180, position: 'relative', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80&auto=format&fit=crop" alt="Nightly Stay"
                onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80'; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.35) 100%)' }} />
              <div style={{ position: 'absolute', top: 12, left: 14, background: 'rgba(194,119,43,0.92)', borderRadius: 20, padding: '3px 12px' }}>
                <span style={{ fontSize: '0.6rem', color: '#fff', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>🌙 Nightly Stays</span>
              </div>
            </div>
            <div style={{ padding: '16px 18px 18px' }}>
              <div style={{ fontSize: '0.72rem', color: '#6b5540', fontWeight: 500, marginBottom: 8 }}>Short trips · Business visits · Weekend getaways</div>
              <div style={{ marginBottom: 10 }}>
                <span style={{ fontSize: '0.6rem', color: '#c2772b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>Starts at</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 300, color: '#1a1209', lineHeight: 1.1, marginTop: 2 }}>{shortDisplay}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {['AC Rooms', 'Wi-Fi', 'Housekeeping'].map(f => (
                  <span key={f} style={{ fontSize: '0.62rem', color: '#7a5530', background: '#fdf0e0', border: '1px solid #e8c88a', borderRadius: 20, padding: '3px 10px', fontWeight: 600 }}>{f}</span>
                ))}
              </div>
              <button onClick={() => handleSearch('short')}
                style={{ width: '100%', padding: '10px 0', borderRadius: 10, border: 'none', background: '#c2772b', color: '#fff', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#a8631f'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#c2772b'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                Check Availability
              </button>
            </div>
          </div>

          {/* Monthly Card */}
          <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: '1px solid #f0e8da' }}>
            <div style={{ height: 180, position: 'relative', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80&auto=format&fit=crop" alt="Monthly Rental"
                onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80'; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.35) 100%)' }} />
              <div style={{ position: 'absolute', top: 12, left: 14, background: 'rgba(26,18,9,0.85)', borderRadius: 20, padding: '3px 12px' }}>
                <span style={{ fontSize: '0.6rem', color: '#f0c070', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>🏠 Monthly Rental</span>
              </div>
            </div>
            <div style={{ padding: '16px 18px 18px' }}>
              <div style={{ fontSize: '0.72rem', color: '#6b5540', fontWeight: 500, marginBottom: 8 }}>Professionals · Students · Long-term residents</div>
              <div style={{ marginBottom: 10 }}>
                <span style={{ fontSize: '0.6rem', color: '#c2772b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>Starts at</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 300, color: '#1a1209', lineHeight: 1.1, marginTop: 2 }}>{longDisplay}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {['Furnished', 'Zero Brokerage', 'Flexible Lease'].map(f => (
                  <span key={f} style={{ fontSize: '0.62rem', color: '#7a5530', background: '#fdf0e0', border: '1px solid #e8c88a', borderRadius: 20, padding: '3px 10px', fontWeight: 600 }}>{f}</span>
                ))}
              </div>
              <button onClick={() => handleSearch('long')}
                style={{ width: '100%', padding: '10px 0', borderRadius: 10, border: '2px solid #c2772b', background: 'transparent', color: '#c2772b', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#c2772b'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#c2772b'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                Explore Rooms
              </button>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 28, padding: '18px 24px 0' }}>
          {[['✦', 'Fully Furnished'], ['⚡', 'Instant Move-in'], ['🛡', 'Zero Brokerage'], ['✔', '100% Verified']].map(([icon, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ color: '#c2772b', fontSize: '0.7rem' }}>{icon}</span>
              <span style={{ color: '#5a4a3a', fontSize: '0.72rem', fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }


  /* ════════ DESKTOP (>1024px) ════════ */
  return (
    <div style={{
      background: 'linear-gradient(160deg, #f5efe4 0%, #ede4cf 55%, #e2d5be 100%)',
      minHeight: 'calc(100vh - 140px)',
      display: 'flex', alignItems: 'stretch',
      padding: '16px 20px', fontFamily: "'Poppins', sans-serif", boxSizing: 'border-box',
    }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* Main Card */}
        <div style={{
          background: '#fff', borderRadius: 22, boxShadow: '0 16px 56px rgba(0,0,0,0.15)',
          overflow: 'hidden', display: 'flex', flex: 1,
          border: '1px solid rgba(194,119,43,0.12)', minHeight: 0,
        }}>

          {/* LEFT panel */}
          <div style={{
            flex: '0 0 38%', background: 'linear-gradient(160deg, #fdf7ee 0%, #f5ead6 100%)',
            padding: '28px 30px', display: 'flex', flexDirection: 'column',
            borderRight: '1px solid #f0e8da', overflow: 'auto',
          }}>
            <div>
              <div style={{ display: 'inline-flex', background: 'rgba(194,119,43,0.12)', border: '1px solid rgba(194,119,43,0.3)', borderRadius: 20, padding: '4px 14px', marginBottom: 14 }}>
                <span style={{ fontSize: '0.62rem', color: '#c2772b', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>✦ Smart Stay Platform</span>
              </div>
              <h1 style={{ color: '#1a1209', fontSize: 'clamp(1.3rem, 2vw, 1.9rem)', fontWeight: 700, lineHeight: 1.2, margin: '0 0 10px' }}>
                Find Smart Stays<br />
                <span style={{ color: '#c2772b' }}>in Noida</span> &amp; Greater Noida
              </h1>
              <p style={{ color: '#6b5540', fontSize: '0.86rem', margin: '0 0 20px', lineHeight: 1.7 }}>
                Verified PGs, Apartments &amp; Premium Homes across India
              </p>

              {/* Search bar */}
              <SearchBar compact={false} />

              {/* Feature boxes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 70 }}>
                {[
                  { icon: '✦', title: 'Fully Furnished', sub: 'Move in with zero hassle' },
                  { icon: '⚡', title: 'Instant Move-in', sub: 'Same day confirmation' },
                  { icon: '🛡', title: 'Zero Brokerage', sub: 'No hidden charges ever' },
                  { icon: '✔', title: 'Verified Properties', sub: '100% physically verified' },
                ].map(f => (
                  <div key={f.title} style={{ background: '#fff', borderRadius: 11, padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 9, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f0e8da' }}>
                    <span style={{ fontSize: '0.95rem', flexShrink: 0 }}>{f.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.67rem', fontWeight: 700, color: '#1a1209', lineHeight: 1.2 }}>{f.title}</div>
                      <div style={{ fontSize: '0.56rem', color: '#bbb', marginTop: 1 }}>{f.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT panel */}
          <div style={{ flex: 1, display: 'flex', minWidth: 0 }}>

            {/* Nightly Stays */}
            <div style={{ flex: 1, borderRight: '1px solid #f0ece4', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ flex: '0 0 42%', position: 'relative', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80&auto=format&fit=crop"
                  alt="Nightly Stay"
                  onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80'; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', transition: 'transform 0.4s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35) 100%)' }} />
                <div style={{ position: 'absolute', top: 10, left: 12, background: 'rgba(194,119,43,0.92)', borderRadius: 20, padding: '3px 10px' }}>
                  <span style={{ fontSize: '0.58rem', color: '#fff', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>🌙 Nightly Stays</span>
                </div>
              </div>
              <div style={{ flex: 1, padding: '14px 20px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', background: 'linear-gradient(180deg, #fefcf8 0%, #fff 100%)', overflow: 'auto' }}>
                <div style={{ fontSize: '0.72rem', color: '#6b5540', fontWeight: 500, marginBottom: 8, lineHeight: 1.4 }}>Short trips · Business visits · Weekend getaways</div>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: '0.62rem', color: '#c2772b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>Starts at</span>
                  <div style={{ fontSize: 'clamp(1.3rem, 1.8vw, 1.75rem)', fontWeight: 300, color: '#1a1209', lineHeight: 1.1, marginTop: 2 }}>{shortDisplay}</div>
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
                  {['AC Rooms', 'Wi-Fi', 'Housekeeping'].map(f => (
                    <span key={f} style={{ fontSize: '0.62rem', color: '#7a5530', background: '#fdf0e0', border: '1px solid #e8c88a', borderRadius: 20, padding: '3px 10px', fontWeight: 600 }}>{f}</span>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid #f5ede0', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
                  {[['🛏', 'Private rooms & entire apartments'], ['📍', 'Pan-India locations available'], ['⚡', 'Same-day booking confirmed']].map(([icon, text]) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                      <span style={{ fontSize: '0.68rem', lineHeight: 1.4 }}>{icon}</span>
                      <span style={{ fontSize: '0.67rem', color: '#6b5540', lineHeight: 1.4 }}>{text}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => handleSearch('short')}
                  style={{ width: '100%', padding: '10px 0', borderRadius: 10, border: 'none', background: '#c2772b', color: '#fff', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#a8631f'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(194,119,43,0.35)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#c2772b'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  Check Availability
                </button>
              </div>
            </div>

            {/* Monthly Rental */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ flex: '0 0 42%', position: 'relative', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80&auto=format&fit=crop"
                  alt="Monthly Rental"
                  onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80'; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', transition: 'transform 0.4s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35) 100%)' }} />
                <div style={{ position: 'absolute', top: 10, left: 12, background: 'rgba(26,18,9,0.85)', borderRadius: 20, padding: '3px 10px' }}>
                  <span style={{ fontSize: '0.58rem', color: '#f0c070', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>🏠 Monthly Rental</span>
                </div>
              </div>
              <div style={{ flex: 1, padding: '14px 20px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflow: 'auto' }}>
                <div style={{ fontSize: '0.72rem', color: '#6b5540', fontWeight: 500, marginBottom: 8, lineHeight: 1.4 }}>Professionals · Students · Long-term residents</div>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: '0.62rem', color: '#c2772b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>Starts at</span>
                  <div style={{ fontSize: 'clamp(1.3rem, 1.8vw, 1.75rem)', fontWeight: 300, color: '#1a1209', lineHeight: 1.1, marginTop: 2 }}>{longDisplay}</div>
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
                  {['Furnished', 'Zero Brokerage', 'Flexible Lease'].map(f => (
                    <span key={f} style={{ fontSize: '0.62rem', color: '#7a5530', background: '#fdf0e0', border: '1px solid #e8c88a', borderRadius: 20, padding: '3px 10px', fontWeight: 600 }}>{f}</span>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid #f5ede0', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
                  {[['🏠', 'PGs, flats & co-living spaces'], ['📄', 'Simple rent agreements'], ['🔑', 'Move in within 24 hours']].map(([icon, text]) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                      <span style={{ fontSize: '0.68rem', lineHeight: 1.4 }}>{icon}</span>
                      <span style={{ fontSize: '0.67rem', color: '#6b5540', lineHeight: 1.4 }}>{text}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => handleSearch('long')}
                  style={{ width: '100%', padding: '10px 0', borderRadius: 10, border: '2px solid #c2772b', background: 'transparent', color: '#c2772b', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#c2772b'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(194,119,43,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#c2772b'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  Explore Rooms
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
