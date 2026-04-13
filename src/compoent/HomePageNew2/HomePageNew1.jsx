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

export default function HomePageNew1() {
  const navigate = useNavigate();
  const [city, setCity] = useState('Noida');
  const [dateLabel, setDateLabel] = useState('Today');
  const [showCity, setShowCity] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [shortRate, setShortRate] = useState(null);
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
  const longDisplay  = '₹4,999/month';

  const dd = { position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 999, background: '#fff', borderRadius: 12, boxShadow: '0 10px 36px rgba(0,0,0,0.14)', border: '1px solid #f0ece4', minWidth: 180, overflow: 'hidden' };


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
      height: 'calc(100vh - 160px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '14px 20px', fontFamily: "'Poppins', sans-serif", boxSizing: 'border-box',
      overflow: 'hidden',
    }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>

        {/* ── Main Card ── */}
        <div style={{ background: '#fff', borderRadius: 22, boxShadow: '0 16px 56px rgba(0,0,0,0.15)', overflow: 'hidden', display: 'flex', flex: '1 1 0', minHeight: 0, border: '1px solid rgba(194,119,43,0.12)' }}>

          {/* LEFT — clean text panel */}
          <div style={{ flex: '0 0 38%', background: 'linear-gradient(160deg, #fdf7ee 0%, #f5ead6 100%)', padding: '32px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid #f0e8da' }}>
            <div>
              <div style={{ display: 'inline-flex', background: 'rgba(194,119,43,0.12)', border: '1px solid rgba(194,119,43,0.3)', borderRadius: 20, padding: '4px 14px', marginBottom: 18 }}>
                <span style={{ fontSize: '0.62rem', color: '#c2772b', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>✦ Smart Stay Platform</span>
              </div>
              <h1 style={{ color: '#1a1209', fontSize: 'clamp(1.4rem, 2.2vw, 2rem)', fontWeight: 700, lineHeight: 1.2, margin: '0 0 14px' }}>
                Find Smart Stays<br />
                <span style={{ color: '#c2772b' }}>in Noida</span> &amp; Greater Noida
              </h1>
              <p style={{ color: '#6b5540', fontSize: '0.88rem', margin: '0 0 28px', lineHeight: 1.7 }}>
                Verified PGs, Apartments &amp; Premium Homes across India
              </p>
              {/* Search bar — horizontal */}
              <div style={{ background: '#fff', borderRadius: 14, display: 'flex', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1.5px solid #e8dfd0', overflow: 'hidden' }}>
                <div ref={cityRef} style={{ position: 'relative', flex: 1 }}>
                  <div onClick={() => { setShowCity(!showCity); setShowDate(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', cursor: 'pointer', borderRight: '1px solid #f0ece4' }}>
                    <MapPin size={14} style={{ color: '#c2772b', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.55rem', color: '#bbb', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>Location</div>
                      <div style={{ fontSize: '0.85rem', color: '#1a1209', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{city}</div>
                    </div>
                    <ChevronDown size={12} style={{ color: '#bbb', flexShrink: 0 }} />
                  </div>
                  {showCity && (
                    <div onClick={e => e.stopPropagation()} style={{ ...dd, width: 240 }}>
                      <div style={{ padding: '10px 12px', borderBottom: '1px solid #f0ece4' }}>
                        <input autoFocus placeholder="Search city..." value={citySearch} onChange={e => setCitySearch(e.target.value)}
                          style={{ width: '100%', border: '1px solid #e0d0b8', borderRadius: 10, padding: '8px 12px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div style={{ maxHeight: 220, overflowY: 'auto' }}>
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
                <div ref={dateRef} style={{ position: 'relative', flex: 0.9 }}>
                  <div onClick={() => { setShowDate(!showDate); setShowCity(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', cursor: 'pointer', borderRight: '1px solid #f0ece4' }}>
                    <Calendar size={14} style={{ color: '#888', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.55rem', color: '#bbb', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>Move-in</div>
                      <div style={{ fontSize: '0.85rem', color: '#1a1209', fontWeight: 600 }}>{dateLabel}</div>
                    </div>
                    <ChevronDown size={12} style={{ color: '#bbb', flexShrink: 0 }} />
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
                  flexShrink: 0, padding: '11px 18px', border: 'none', background: '#c2772b',
                  color: '#fff', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.2s', whiteSpace: 'nowrap',
                  borderRadius: '0 12px 12px 0', margin: '4px 4px 4px 0',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#a8631f'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#c2772b'; }}>
                  <Search size={14} /> Show Options
                </button>
              </div>

              {/* Feature boxes below search bar */}
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
                <div style={{ flex: 1, padding: '16px 22px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', background: 'linear-gradient(180deg, #fefcf8 0%, #fff 100%)' }}>
                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#6b5540', fontWeight: 500, marginBottom: 10, lineHeight: 1.5 }}>Short trips · Business visits · Weekend getaways</div>
                    <div style={{ marginBottom: 10 }}>
                      <span style={{ fontSize: '0.63rem', color: '#c2772b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>Starts at</span>
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
                    style={{ width: '100%', padding: '10px 0', borderRadius: 10, border: 'none', background: '#c2772b', color: '#fff', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', marginTop: 10 }}
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
                <div style={{ flex: 1, padding: '16px 22px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#6b5540', fontWeight: 500, marginBottom: 10, lineHeight: 1.5 }}>Professionals · Students · Long-term residents</div>
                    <div style={{ marginBottom: 10 }}>
                      <span style={{ fontSize: '0.63rem', color: '#c2772b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>Starts at</span>
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
                    style={{ width: '100%', padding: '10px 0', borderRadius: 10, border: '2px solid #c2772b', background: 'transparent', color: '#c2772b', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', marginTop: 10 }}
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
    </div>
  );
}
