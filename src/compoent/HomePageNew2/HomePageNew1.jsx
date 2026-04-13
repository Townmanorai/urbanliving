import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search, ChevronDown, Home, TrendingUp, Award, Star } from 'lucide-react';

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

export default function HomePageNew1() {
  const navigate = useNavigate();
  const [city, setCity] = useState('Noida');
  const [dateLabel, setDateLabel] = useState('Today');
  const [showCity, setShowCity] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [shortRate, setShortRate] = useState(null);
  const [stats, setStats] = useState({ total: 0, cities: 0, pg: 0, short: 0, long: 0 });
  const [ratesLoading, setRatesLoading] = useState(true);
  const cityRef = useRef(null);
  const dateRef = useRef(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
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

        // Nightly rates — short term properties only (min 500, max 30000/night)
        const shortPrices = list
          .filter(p => p.property_category !== 'PG' && !isLongTermProperty(p))
          .map(p => Number(p.base_rate) || Number(p.price) || 0)
          .filter(v => v >= 500 && v <= 30000);
        const pgNightly = list.filter(p => p.property_category === 'PG').map(p => {
          try { const m = typeof p.meta === 'string' ? JSON.parse(p.meta) : (p.meta || {}); return Number(m.perNightPrice) || 0; } catch { return 0; }
        }).filter(v => v >= 300 && v <= 3000);
        const allShort = [...shortPrices, ...pgNightly].filter(v => v > 0);

        // Monthly rates — long term only, minimum ₹3000/month
        const longPrices = list
          .filter(p => p.property_category !== 'PG' && isLongTermProperty(p))
          .map(p => {
            try {
              const m = typeof p.meta === 'string' ? JSON.parse(p.meta) : (p.meta || {});
              return Number(m.perMonthPrice) || Number(m.monthlyPrice) || Number(p.monthly_price) || Number(p.price) || 0;
            } catch { return Number(p.price) || 0; }
          }).filter(v => v >= 3000);
        const pgMonthly = list.filter(p => p.property_category === 'PG').map(p => {
          try {
            const m = typeof p.meta === 'string' ? JSON.parse(p.meta) : (p.meta || {});
            const rooms = m.rooms || [];
            if (Array.isArray(rooms) && rooms.length > 0) {
              const ps = rooms.map(r => Number(r.price) || 0).filter(v => v >= 3000);
              return ps.length > 0 ? Math.min(...ps) : 0;
            }
            return Number(p.price) >= 3000 ? Number(p.price) : 0;
          } catch { return 0; }
        }).filter(v => v >= 3000);
        const allLong = [...longPrices, ...pgMonthly].filter(v => v > 0);

        if (allShort.length > 0) setShortRate(Math.min(...allShort));

        // Stats
        const uniqueCities = new Set(list.map(p => (p.city || '').trim()).filter(Boolean));
        setStats({
          total: list.length,
          cities: uniqueCities.size,
          pg: list.filter(p => p.property_category === 'PG').length,
          short: allShort.length,
          long: allLong.length,
        });
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
  const longDisplay  = '₹4,999/month';

  const dd = { position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 999, background: '#fff', borderRadius: 12, boxShadow: '0 10px 36px rgba(0,0,0,0.14)', border: '1px solid #f0ece4', minWidth: 180, overflow: 'hidden' };

  const CATS = [
    { icon: <Home size={18} color="#c2772b" />, label: 'PG', sub: `${stats.pg || '—'} listings`, cat: 'PG', rental: 'long' },
    { icon: <TrendingUp size={18} color="#c2772b" />, label: 'Economy Stay', sub: 'Budget friendly', cat: 'Economy Stay', rental: null },
    { icon: <Award size={18} color="#c2772b" />, label: 'Premium Stay', sub: 'Luxury comfort', cat: 'Premium Stay', rental: null },
    { icon: <Star size={18} color="#c2772b" />, label: 'Signature Stays', sub: 'Curated picks', cat: 'Signature Stays', rental: null },
  ];

  /* ════════ MOBILE ════════ */
  if (isMobile) {
    return (
      <div style={{ background: 'linear-gradient(160deg,#f5efe4,#ede4cf)', minHeight: '100svh',  fontFamily: "'Poppins',sans-serif", boxSizing: 'border-box' }}>

        {/* ── Hero Image ── */}
        <div style={{ position: 'relative', height: 230, overflow: 'hidden' }}>
          <img src="/newhome1mobile.png" alt=""
            onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'; }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 55%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, padding: '18px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 22 }}>
            <div style={{ display: 'inline-flex', alignSelf: 'flex-start', background: 'rgba(194,119,43,0.88)', borderRadius: 20, padding: '4px 12px', marginBottom: 10 }}>
              <span style={{ fontSize: '0.58rem', color: '#fff', letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 600 }}>✦ Smart Stay Platform</span>
            </div>
            <h1 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: 0, textShadow: '0 2px 12px rgba(0,0,0,0.7)', lineHeight: 1.25 }}>
              Find Smart Stays<br /><span style={{ color: '#f0c070' }}>in Noida</span> &amp; Greater Noida
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.76rem', margin: '8px 0 0', lineHeight: 1.5 }}>Verified PGs, Apartments &amp; Premium Homes</p>
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ padding: '18px 16px 24px' }}>

          {/* Nightly Card */}
          <div style={{ background: '#fff', borderRadius: 18, marginBottom: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.09)', border: '1px solid #f0e8da' }}>
            <div style={{ display: 'flex', alignItems: 'stretch' }}>
              <div style={{ width: 120, flexShrink: 0, position: 'relative', overflow: 'hidden', minHeight: 145 }}>
                <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&q=80&auto=format&fit=crop" alt=""
                  onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&q=80'; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.12)' }} />
                <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center' }}>
                  <span style={{ fontSize: '0.54rem', color: '#fff', fontWeight: 700, background: 'rgba(194,119,43,0.92)', borderRadius: 8, padding: '3px 8px', textTransform: 'uppercase', letterSpacing: 0.4 }}>🌙 Nightly</span>
                </div>
              </div>
              <div style={{ flex: 1, padding: '18px 18px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.65rem', color: '#8a6a3a', fontWeight: 600, marginBottom: 5 }}>Short trips · Business · Weekends</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 300, color: '#1a1209', lineHeight: 1.1, marginBottom: 10 }}>{shortDisplay}</div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {['AC', 'Wi-Fi', 'Housekeeping'].map(f => (
                      <span key={f} style={{ fontSize: '0.6rem', color: '#7a5530', background: '#fdf0e0', border: '1px solid #e8c88a', borderRadius: 20, padding: '3px 10px', fontWeight: 600 }}>{f}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => handleSearch('short')} style={{ width: '100%', padding: '11px 0', borderRadius: 10, border: 'none', background: '#c2772b', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', marginTop: 14 }}>Check Availability</button>
              </div>
            </div>
          </div>

          {/* Monthly Card */}
          <div style={{ background: '#fff', borderRadius: 18, marginBottom: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.09)', border: '1px solid #f0e8da' }}>
            <div style={{ display: 'flex', alignItems: 'stretch' }}>
              <div style={{ width: 120, flexShrink: 0, position: 'relative', overflow: 'hidden', minHeight: 145 }}>
                <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=300&q=80&auto=format&fit=crop" alt=""
                  onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&q=80'; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.12)' }} />
                <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center' }}>
                  <span style={{ fontSize: '0.54rem', color: '#f0c070', fontWeight: 700, background: 'rgba(26,18,9,0.88)', borderRadius: 8, padding: '3px 8px', textTransform: 'uppercase', letterSpacing: 0.4 }}>🏠 Monthly</span>
                </div>
              </div>
              <div style={{ flex: 1, padding: '18px 18px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.65rem', color: '#8a6a3a', fontWeight: 600, marginBottom: 5 }}>Professionals · Students · Long-term</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 300, color: '#1a1209', lineHeight: 1.1, marginBottom: 10 }}>{longDisplay}</div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {['Furnished', 'No Brokerage', 'Flexible'].map(f => (
                      <span key={f} style={{ fontSize: '0.6rem', color: '#7a5530', background: '#fdf0e0', border: '1px solid #e8c88a', borderRadius: 20, padding: '3px 10px', fontWeight: 600 }}>{f}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => handleSearch('long')} style={{ width: '100%', padding: '11px 0', borderRadius: 10, border: '1.5px solid #c2772b', background: 'transparent', color: '#c2772b', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', marginTop: 14 }}>Explore Rooms</button>
              </div>
            </div>
          </div>

          {/* ── Badges ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, padding: '0 4px' }}>
            {[['✦', 'Fully Furnished'], ['⚡', 'Instant Move-in'], ['🛡', '100% Verified']].map(([icon, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#c2772b', fontSize: '0.65rem' }}>{icon}</span>
                <span style={{ color: '#5a4a3a', fontSize: '0.68rem', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>

          {/* ── Search Bar ── */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '6px 8px', boxShadow: '0 4px 18px rgba(0,0,0,0.09)', border: '1.5px solid #e8dfd0', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div ref={cityRef} style={{ position: 'relative', flex: 1 }}>
                <div onClick={() => { setShowCity(!showCity); setShowDate(false); }} style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', padding: '10px 10px', borderRight: '1px solid #f0ece4' }}>
                  <MapPin size={14} style={{ color: '#c2772b', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.85rem', color: '#1a1209', fontWeight: 600 }}>{city}</span>
                  <ChevronDown size={12} style={{ color: '#bbb', marginLeft: 'auto' }} />
                </div>
                {showCity && <div onClick={e => e.stopPropagation()} style={{ ...dd, width: 220 }}>
                  <div style={{ padding: '8px 10px', borderBottom: '1px solid #f0ece4' }}><input autoFocus placeholder="Search city..." value={citySearch} onChange={e => setCitySearch(e.target.value)} style={{ width: '100%', border: '1px solid #e0d0b8', borderRadius: 8, padding: '6px 8px', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }} /></div>
                  <div style={{ maxHeight: 220, overflowY: 'auto' }}>{filteredCities.map(c => <div key={c} onClick={() => { setCity(c); setShowCity(false); setCitySearch(''); }} style={{ padding: '9px 14px', fontSize: '0.82rem', color: c === city ? '#c2772b' : '#444', fontWeight: c === city ? 600 : 400, cursor: 'pointer', background: c === city ? '#fef9f2' : 'transparent' }}>{c}</div>)}</div>
                </div>}
              </div>
              <div ref={dateRef} style={{ position: 'relative', flex: 1 }}>
                <div onClick={() => { setShowDate(!showDate); setShowCity(false); }} style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', padding: '10px 10px', borderRight: '1px solid #f0ece4' }}>
                  <Calendar size={14} style={{ color: '#888', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.85rem', color: '#1a1209', fontWeight: 600 }}>{dateLabel}</span>
                  <ChevronDown size={12} style={{ color: '#bbb', marginLeft: 'auto' }} />
                </div>
                {showDate && <div onClick={e => e.stopPropagation()} style={dd}>{DATE_OPTIONS.map(d => <div key={d} onClick={() => { setDateLabel(d); setShowDate(false); }} style={{ padding: '10px 14px', fontSize: '0.82rem', color: d === dateLabel ? '#c2772b' : '#444', fontWeight: d === dateLabel ? 600 : 400, cursor: 'pointer', background: d === dateLabel ? '#fef9f2' : 'transparent' }}>{d}</div>)}</div>}
              </div>
              <button onClick={() => handleSearch(null)} style={{ flexShrink: 0, padding: '10px 16px', borderRadius: 10, border: 'none', background: '#c2772b', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Search</button>
            </div>
          </div>


        </div>
      </div>
    );
  }

  /* ════════ DESKTOP ════════ */
  return (
    <div style={{
      background: 'linear-gradient(160deg, #f5efe4 0%, #ede4cf 55%, #e2d5be 100%)',
      height: 'calc(100vh - 60px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '14px 48px', fontFamily: "'Poppins', sans-serif", boxSizing: 'border-box',
      overflow: 'hidden',
    }}>
      <div style={{ width: '100%', maxWidth: 1200, display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>

        {/* ── Main Card ── */}
        <div style={{ background: '#fff', borderRadius: 22, boxShadow: '0 16px 56px rgba(0,0,0,0.15)', overflow: 'hidden', display: 'flex', flex: '1 1 0', minHeight: 0, border: '1px solid rgba(194,119,43,0.12)' }}>

          {/* LEFT — image */}
          <div style={{ flex: '0 0 42%', position: 'relative' }}>
            <img src="/newhome1desktop.png" alt="Smart Stays"
              onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80&auto=format&fit=crop'; }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 55%', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg, rgba(10,5,2,0.72) 0%, rgba(10,5,2,0.35) 60%, transparent 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, padding: '20px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'inline-flex', background: 'rgba(194,119,43,0.28)', border: '1px solid rgba(194,119,43,0.5)', borderRadius: 20, padding: '4px 12px', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.62rem', color: '#f0c070', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500 }}>✦ Smart Stay Platform</span>
                </div>
                <h1 style={{ color: '#fff', fontSize: 'clamp(1.3rem, 2vw, 1.8rem)', fontWeight: 700, lineHeight: 1.2, margin: '0 0 10px', textShadow: '0 2px 20px rgba(0,0,0,0.85)' }}>
                  Find Smart Stays<br />
                  <span style={{ color: '#f0c070' }}>in Noida</span> &amp; Greater Noida
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', margin: 0, lineHeight: 1.6 }}>
                  Verified PGs, Apartments &amp; Premium Homes across India
                </p>
              </div>
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.35)', borderRadius: 14, backdropFilter: 'blur(8px)', overflow: 'hidden' }}>
                {[{ icon: '✦', label: 'Fully Furnished' }, { icon: '⚡', label: 'Instant Move-in' }, { icon: '🛡', label: '100% Verified' }].map((s, i, arr) => (
                  <div key={s.label} style={{ flex: 1, padding: '10px 0', textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
                    <div style={{ fontSize: '0.85rem', color: '#f0c070', lineHeight: 1 }}>{s.icon}</div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.85)', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — stay info */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
              {/* Nightly Stays */}
              <div style={{ flex: 1, borderRight: '1px solid #f0ece4', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Image */}
                <div style={{ flex: '0 0 42%', position: 'relative', overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80&auto=format&fit=crop"
                    alt="Nightly Stay"
                    onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80'; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35) 100%)' }} />
                  <div style={{ position: 'absolute', top: 10, left: 12, background: 'rgba(194,119,43,0.92)', borderRadius: 20, padding: '3px 10px' }}>
                    <span style={{ fontSize: '0.58rem', color: '#fff', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>🌙 Nightly Stays</span>
                  </div>
                </div>
                {/* Content */}
                <div style={{ flex: 1, padding: '16px 22px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(180deg, #fefcf8 0%, #fff 100%)' }}>
                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#6b5540', fontWeight: 500, marginBottom: 10, lineHeight: 1.5 }}>Short trips · Business visits · Weekend getaways</div>
                    <div style={{ marginBottom: 10 }}>
                      <span style={{ fontSize: '0.63rem', color: '#c2772b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>Starting from</span>
                      <div style={{ fontSize: '1.75rem', fontWeight: 300, color: '#1a1209', lineHeight: 1.1, marginTop: 2 }}>{shortDisplay}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                      {['AC Rooms', 'Wi-Fi', 'Housekeeping'].map(f => (
                        <span key={f} style={{ fontSize: '0.62rem', color: '#7a5530', background: '#fdf0e0', border: '1px solid #e8c88a', borderRadius: 20, padding: '3px 10px', fontWeight: 600 }}>{f}</span>
                      ))}
                    </div>
                    <div style={{ borderTop: '1px solid #f5ede0', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {[['🛏', 'Private rooms & entire apartments'], ['📍', 'Pan-India locations available'], ['⚡', 'Same-day booking confirmed']].map(([icon, text]) => (
                        <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                          <span style={{ fontSize: '0.7rem', lineHeight: 1.4 }}>{icon}</span>
                          <span style={{ fontSize: '0.68rem', color: '#6b5540', lineHeight: 1.4 }}>{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => handleSearch('short')}
                    style={{ width: '100%', padding: '10px 0', borderRadius: 10, border: 'none', background: '#c2772b', color: '#fff', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', marginTop: 14 }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#a8631f'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(194,119,43,0.35)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#c2772b'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    Check Availability
                  </button>
                </div>
              </div>

              {/* Monthly Rental */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Image */}
                <div style={{ flex: '0 0 42%', position: 'relative', overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80&auto=format&fit=crop"
                    alt="Monthly Rental"
                    onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80'; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35) 100%)' }} />
                  <div style={{ position: 'absolute', top: 10, left: 12, background: 'rgba(26,18,9,0.85)', borderRadius: 20, padding: '3px 10px' }}>
                    <span style={{ fontSize: '0.58rem', color: '#f0c070', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>🏠 Monthly Rental</span>
                  </div>
                </div>
                {/* Content */}
                <div style={{ flex: 1, padding: '16px 22px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#6b5540', fontWeight: 500, marginBottom: 10, lineHeight: 1.5 }}>Professionals · Students · Long-term residents</div>
                    <div style={{ marginBottom: 10 }}>
                      <span style={{ fontSize: '0.63rem', color: '#c2772b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>Starting from</span>
                      <div style={{ fontSize: '1.75rem', fontWeight: 300, color: '#1a1209', lineHeight: 1.1, marginTop: 2 }}>{longDisplay}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                      {['Furnished', 'Zero Brokerage', 'Flexible Lease'].map(f => (
                        <span key={f} style={{ fontSize: '0.62rem', color: '#7a5530', background: '#fdf0e0', border: '1px solid #e8c88a', borderRadius: 20, padding: '3px 10px', fontWeight: 600 }}>{f}</span>
                      ))}
                    </div>
                    <div style={{ borderTop: '1px solid #f5ede0', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {[['🏠', 'PGs, flats & co-living spaces'], ['📄', 'Simple rent agreements'], ['🔑', 'Move in within 24 hours']].map(([icon, text]) => (
                        <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                          <span style={{ fontSize: '0.7rem', lineHeight: 1.4 }}>{icon}</span>
                          <span style={{ fontSize: '0.68rem', color: '#6b5540', lineHeight: 1.4 }}>{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => handleSearch('long')}
                    style={{ width: '100%', padding: '10px 0', borderRadius: 10, border: '2px solid #c2772b', background: 'transparent', color: '#c2772b', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', marginTop: 14 }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#c2772b'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(194,119,43,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#c2772b'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    Explore Rooms
                  </button>
                </div>
              </div>
            </div>

            {/* Category quick links */}
            <div style={{ borderTop: '1px solid #f0ece4', display: 'flex' }}>
              {CATS.map((cat, i) => (
                <div key={cat.label} onClick={() => { const p = new URLSearchParams(); p.set('category', cat.cat); if (cat.rental) { p.set('rentalType', cat.rental); sessionStorage.setItem('ovika_rental_type', cat.rental); } navigate(`/properties?${p}`); }}
                  style={{ flex: 1, padding: '9px 12px', cursor: 'pointer', borderRight: i < CATS.length - 1 ? '1px solid #f0ece4' : 'none', transition: 'background 0.2s', display: 'flex', flexDirection: 'column', gap: 2 }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#fef9f2'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  <div>{cat.icon}</div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#1a1209' }}>{cat.label}</div>
                  <div style={{ fontSize: '0.62rem', color: '#aaa' }}>{cat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Badges + stats row ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px' }}>
          <div style={{ display: 'flex', gap: 20 }}>
            {[['✦', 'Fully Furnished'], ['✦', 'Instant Move-in'], ['✦', 'Zero Brokerage'], ['✦', 'Verified Properties']].map(([icon, f]) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ color: '#c2772b', fontSize: '0.7rem', fontWeight: 700 }}>{icon}</span>
                <span style={{ color: '#5a4a3a', fontSize: '0.78rem', fontWeight: 500 }}>{f}</span>
              </div>
            ))}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#999', fontStyle: 'italic' }}>Trusted by thousands across India</span>
        </div>

        {/* ── Search Bar ── */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '6px 8px', boxShadow: '0 6px 32px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', border: '1.5px solid #e8dfd0' }}>
          <span style={{ fontSize: '0.78rem', color: '#aaa', fontWeight: 500, padding: '0 14px 0 8px', flexShrink: 0, borderRight: '1px solid #f0ece4', letterSpacing: 0.5, textTransform: 'uppercase' }}>Location</span>

          {/* City */}
          <div ref={cityRef} style={{ position: 'relative', flex: 1 }}>
            <div onClick={() => { setShowCity(!showCity); setShowDate(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 14px', cursor: 'pointer', borderRight: '1px solid #f0ece4' }}>
              <MapPin size={15} style={{ color: '#c2772b', flexShrink: 0 }} />
              <span style={{ fontSize: '0.95rem', color: '#1a1209', fontWeight: 600 }}>{city}</span>
              <ChevronDown size={14} style={{ color: '#bbb', marginLeft: 'auto' }} />
            </div>
            {showCity && (
              <div onClick={e => e.stopPropagation()} style={{ ...dd, width: 260 }}>
                <div style={{ padding: '10px 12px', borderBottom: '1px solid #f0ece4' }}>
                  <input autoFocus placeholder="Search city..." value={citySearch} onChange={e => setCitySearch(e.target.value)}
                    style={{ width: '100%', border: '1px solid #e0d0b8', borderRadius: 10, padding: '8px 12px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                  {filteredCities.map(c => (
                    <div key={c} onClick={() => { setCity(c); setShowCity(false); setCitySearch(''); }}
                      style={{ padding: '10px 16px', fontSize: '0.88rem', color: c === city ? '#c2772b' : '#444', fontWeight: c === city ? 600 : 400, cursor: 'pointer', background: c === city ? '#fef9f2' : 'transparent', display: 'flex', alignItems: 'center', gap: 8 }}
                      onMouseEnter={e => { if (c !== city) e.currentTarget.style.background = '#fef9f2'; }}
                      onMouseLeave={e => { if (c !== city) e.currentTarget.style.background = 'transparent'; }}>
                      <MapPin size={12} style={{ color: '#c2772b', flexShrink: 0 }} />{c}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Date */}
          <div ref={dateRef} style={{ position: 'relative', flex: 0.65 }}>
            <div onClick={() => { setShowDate(!showDate); setShowCity(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 14px', cursor: 'pointer', borderRight: '1px solid #f0ece4' }}>
              <Calendar size={15} style={{ color: '#888', flexShrink: 0 }} />
              <span style={{ fontSize: '0.95rem', color: '#1a1209', fontWeight: 600 }}>{dateLabel}</span>
              <ChevronDown size={14} style={{ color: '#bbb', marginLeft: 'auto' }} />
            </div>
            {showDate && (
              <div onClick={e => e.stopPropagation()} style={dd}>
                {DATE_OPTIONS.map(d => (
                  <div key={d} onClick={() => { setDateLabel(d); setShowDate(false); }}
                    style={{ padding: '11px 18px', fontSize: '0.88rem', color: d === dateLabel ? '#c2772b' : '#444', fontWeight: d === dateLabel ? 600 : 400, cursor: 'pointer', background: d === dateLabel ? '#fef9f2' : 'transparent' }}
                    onMouseEnter={e => { if (d !== dateLabel) e.currentTarget.style.background = '#fef9f2'; }}
                    onMouseLeave={e => { if (d !== dateLabel) e.currentTarget.style.background = 'transparent'; }}>
                    {d}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => handleSearch(null)} style={{
            flexShrink: 0, padding: '10px 26px', borderRadius: 12, border: 'none',
            background: '#c2772b', color: '#fff', fontSize: '0.88rem', fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
            transition: 'all 0.2s', marginLeft: 4,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#a8631f'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(194,119,43,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#c2772b'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <Search size={16} /><span>Show Available Options</span>
          </button>
        </div>

      </div>
    </div>
  );
}
