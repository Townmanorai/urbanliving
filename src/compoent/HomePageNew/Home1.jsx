import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import './Home1.css';

/* ─── Curated 30 Cities ─── */
const CITIES = [
  'Delhi','Noida','Greater Noida','Ghaziabad','Gurugram','Faridabad',
  'Agra','Lucknow','Kanpur','Prayagraj','Varanasi','Mathura','Vrindavan',
  'Meerut','Bareilly','Aligarh','Moradabad','Hapur','Bulandshahr',
  'Haridwar','Rishikesh','Dehradun','Sonipat','Panipat','Ambala',
  'Karnal','Rohtak','Mumbai','Bengaluru','Hyderabad',
];


/* ─── Mini Calendar ─── */
function MiniCalendar({ value, onChange, minDate, onClose, title }) {
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
    onClose();
  };
  const prevMonth = () => viewMonth === 0 ? (setViewMonth(11), setViewYear(y=>y-1)) : setViewMonth(m=>m-1);
  const nextMonth = () => viewMonth === 11 ? (setViewMonth(0), setViewYear(y=>y+1)) : setViewMonth(m=>m+1);

  return (
    <div className="ovika-cal-popup" onClick={e => e.stopPropagation()}>
      <div className="ovika-cal-header">
        <span className="ovika-cal-title">{title}</span>
        <button className="ovika-cal-close" onClick={onClose}><X size={13}/></button>
      </div>
      <div className="ovika-cal-nav">
        <button className="ovika-cal-nav-btn" onClick={prevMonth}><ChevronLeft size={15}/></button>
        <span className="ovika-cal-month-label">{MONTHS[viewMonth]} {viewYear}</span>
        <button className="ovika-cal-nav-btn" onClick={nextMonth}><ChevronRight size={15}/></button>
      </div>
      <div className="ovika-cal-grid">
        {DAYS.map(d => <div key={d} className="ovika-cal-day-name">{d}</div>)}
        {cells.map((d,i) => (
          <div key={i}
            className={['ovika-cal-cell', d?'ovika-cal-cell--active':'', isSelected(d)?'ovika-cal-cell--selected':'', isPast(d)?'ovika-cal-cell--past':''].join(' ')}
            onClick={() => handleDay(d)}>{d||''}</div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function Home1() {
  const navigate = useNavigate();
  const [rentalType, setRentalType] = useState(null);
  const [city, setCity] = useState('Noida');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [showCity, setShowCity] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [showCheckInCal, setShowCheckInCal] = useState(false);
  const [showCheckOutCal, setShowCheckOutCal] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSugs, setIsLoadingSugs] = useState(false);
  const [nearMeLoading, setNearMeLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const guestRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onOutside = e => {
      if (guestRef.current && !guestRef.current.contains(e.target)) setShowGuests(false);
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('touchstart', onOutside);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('touchstart', onOutside);
    };
  }, []);

  useEffect(() => {
    setRentalType(sessionStorage.getItem('ovika_rental_type'));
    const iv = setInterval(() => setRentalType(sessionStorage.getItem('ovika_rental_type')), 300);
    return () => clearInterval(iv);
  }, []);

  const filteredCities = citySearch.trim()
    ? CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
    : CITIES;

  const pricingLabel = rentalType === 'short' ? ' — Per Night' : rentalType === 'long' ? ' — Per Month' : '';
  const cards = [
    { icon: '🏠', title: 'PG', subtitle: `Affordable stays${pricingLabel}`, desc: 'Ideal for students & professionals.', category: 'PG' },
    { icon: '🏢', title: 'Economy Stay', subtitle: `Comfort at great value${pricingLabel}`, desc: 'Well-furnished homes with modern amenities.', category: 'Economy Stay' },
    { icon: '✨', title: 'Premium Stay', subtitle: `Refined living experience${pricingLabel}`, desc: 'Enhanced comfort with premium facilities.', category: 'Premium Stay' },
  ];

  const buildHref = cat => {
    const p = new URLSearchParams();
    p.set('category', cat);
    if (rentalType) p.set('rentalType', rentalType);
    return `/properties?${p}`;
  };

  const PG_KEYWORDS = ['pg', 'paying guest', 'hostel', 'boys pg', 'girls pg', 'co-living', 'coliving'];

  const handleSearch = () => {
    const p = new URLSearchParams();
    const searchTerm = (city || citySearch || '').toLowerCase().trim();
    const isPgSearch = PG_KEYWORDS.some(kw => searchTerm.includes(kw));

    if (isPgSearch) {
      p.set('rentalType', 'long');
      p.set('category', 'PG');
      if (city) { p.set('city', city); p.set('search', city); }
      else if (citySearch) p.set('search', citySearch);
    } else {
      if (city) { p.set('city', city); p.set('search', city); }
      if (rentalType) p.set('rentalType', rentalType);
      if (checkIn) p.set('checkIn', checkIn);
      if (checkOut) p.set('checkOut', checkOut);
      if (guests) p.set('guests', String(guests));
    }

    sessionStorage.setItem('ovika_rental_type', isPgSearch ? 'long' : (rentalType || ''));
    navigate(`/properties?${p}`);
  };

  const fetchSuggestions = (query) => {
    if (!query.trim()) { setSuggestions([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsLoadingSugs(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ' India')}&format=json&countrycodes=in&limit=6&addressdetails=1`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();
        const mapped = data.map(item => ({
          city: item.address?.city || item.address?.town || item.address?.suburb || item.address?.village || item.address?.county || item.name,
          short: [item.address?.city || item.address?.town || item.address?.village || item.address?.suburb, item.address?.state].filter(Boolean).join(', '),
        })).filter(s => s.city);
        setSuggestions(mapped);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoadingSugs(false);
      }
    }, 350);
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported by your browser'); return; }
    setNearMeLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        // Navigate immediately with GPS coordinates — properties page will sort by distance
        const p = new URLSearchParams();
        p.set('lat', coords.latitude.toFixed(6));
        p.set('lng', coords.longitude.toFixed(6));
        p.set('nearme', '1');
        if (rentalType) p.set('rentalType', rentalType);
        setShowCity(false);
        setSuggestions([]);
        setCitySearch('');
        setNearMeLoading(false);
        navigate(`/properties?${p}`);
      },
      () => { setNearMeLoading(false); alert('Location access denied. Please enable location permissions and try again.'); }
    );
  };

  const renderCityDropdown = (posStyle) => (
    <div style={{ position: 'absolute', background: 'white', borderRadius: '16px', boxShadow: '0 12px 36px rgba(0,0,0,0.18)', zIndex: 500, overflow: 'hidden', ...posStyle }}
      onClick={e => e.stopPropagation()}>
      <div style={{ padding: '10px 12px', borderBottom: '1px solid #f0e8d8' }}>
        <button onClick={handleNearMe} disabled={nearMeLoading}
          style={{ width: '100%', padding: '8px 10px', background: '#fffbf5', border: '1.5px solid #f0d890', borderRadius: 10, color: '#c2772b', fontWeight: 600, fontSize: '0.82rem', cursor: nearMeLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, opacity: nearMeLoading ? 0.7 : 1, transition: 'background 0.15s' }}>
          <span style={{ fontSize: '1rem' }}>{nearMeLoading ? '⏳' : '📍'}</span>
          {nearMeLoading ? 'Detecting location...' : 'Near me'}
        </button>
      </div>
      <div style={{ padding: '8px 12px', borderBottom: '1px solid #f0e8d8' }}>
        <input autoFocus placeholder="Search city or area..." value={citySearch}
          onChange={e => { setCitySearch(e.target.value); fetchSuggestions(e.target.value); }}
          style={{ width: '100%', border: '1px solid #e0d0b8', borderRadius: 10, padding: '7px 10px', fontSize: '0.82rem', outline: 'none', color: '#333', boxSizing: 'border-box', fontFamily: 'inherit' }}/>
      </div>
      <div style={{ maxHeight: '230px', overflowY: 'auto' }}>
        {isLoadingSugs ? (
          <div style={{ padding: '16px', textAlign: 'center', color: '#aaa', fontSize: '0.8rem' }}>Searching...</div>
        ) : suggestions.length > 0 ? suggestions.map((s, i) => (
          <div key={i}
            style={{ padding: '10px 14px', fontSize: '0.82rem', color: '#333', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 8, borderBottom: '1px solid #faf5ee' }}
            onMouseEnter={e => e.currentTarget.style.background='#fef9f2'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
            onClick={() => { setCity(s.city); setShowCity(false); setCitySearch(''); setSuggestions([]); }}>
            <MapPin size={13} style={{ color: '#c2772b', flexShrink: 0, marginTop: 3 }}/>
            <div>
              <div style={{ fontWeight: 500, color: '#222' }}>{s.city}</div>
              {s.short && s.short !== s.city && <div style={{ fontSize: '0.72rem', color: '#888', marginTop: 2 }}>{s.short}</div>}
            </div>
          </div>
        )) : filteredCities.map(c => (
          <div key={c}
            style={{ padding: '9px 14px', fontSize: '0.82rem', color: c===city?'#c2772b':'#444', fontWeight: c===city?600:400, cursor: 'pointer', background: c===city?'#fef9f2':'transparent', display: 'flex', alignItems: 'center', gap: 6 }}
            onMouseEnter={e => { if(c!==city) e.currentTarget.style.background='#fef9f2'; }}
            onMouseLeave={e => { if(c!==city) e.currentTarget.style.background='transparent'; }}
            onClick={() => { setCity(c); setShowCity(false); setCitySearch(''); setSuggestions([]); }}>
            <MapPin size={11} style={{ color: '#c2772b', flexShrink: 0 }}/>{c}
          </div>
        ))}
      </div>
    </div>
  );

  const fmtDate = v => v ? new Date(v).toLocaleDateString('en-IN', { day:'numeric', month:'short' }) : null;
  const todayStr = new Date().toISOString().split('T')[0];
  const closeAll = () => { setShowCity(false); setShowCheckInCal(false); setShowCheckOutCal(false); setShowGuests(false); setCitySearch(''); setSuggestions([]); };

  return (
    <div className="home1-root" style={{ marginTop: isMobile ? '-2px' : '-80px' }}>

      {/* ── Background ── */}
      <div className={isMobile ? 'home1-bg home1-bg--mobile' : 'home1-bg home1-bg--desktop'}>
        <img
          src={isMobile ? '/home1mobile.png' : '/home2desktop.png'}
          alt=""
          className={isMobile ? 'home1-bg-img' : 'home1-bg-img home1-bg-img--desktop'}
          style={{ objectPosition: isMobile ? 'center 15%' : 'center 30%' }}
        />
        {isMobile && <div className="home1-mobile-gradient"/>}
      </div>

      {/* ── Content Wrapper ── */}
      <div className={isMobile ? 'home1-content home1-content--mobile' : 'home1-content home1-content--desktop'}>

        {isMobile ? (
          <>
            {/* HEADING BLOCK */}
            <div style={{
              position: 'absolute', top: '88px', left: '1rem',
              width: 'calc(70% - 1rem)', zIndex: 25,
              display: 'flex', flexDirection: 'column', gap: '0.25rem',
            }}>
              <h1 style={{ color: '#fff', fontSize: '16px', fontWeight: 500, lineHeight: 1.3, margin: 0, textAlign: 'left', textShadow: '0 2px 12px rgba(0,0,0,0.95)' }}>
                <span style={{ color: '#f5a623' }}>OvikaLiving.com</span>{' '}– India's Smart Stay Marketplace For Flexible Urban Living
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.56rem', margin: 0, textAlign: 'left', lineHeight: 1.4, textShadow: '0 1px 6px rgba(0,0,0,0.75)' }}>
                Book Verified PG's, Apartments and Premium Homes across India — Nightly or Monthly
              </p>
            </div>

            {/* CARDS */}
            <div style={{ position: 'absolute', right: 0, top: '32%', transform: 'translateY(-50%)', zIndex: 20, display: 'flex', flexDirection: 'column', gap: '0.3rem', width: '44%', maxWidth: '148px' }}>
              {cards.map((card, i) => (
                <a key={i} href={buildHref(card.category)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.28rem', padding: '0.28rem 0.35rem', borderRadius: '0.4rem 0 0 0.4rem', borderLeft: '2px solid #d97706', borderTop: '1px solid rgba(217,119,6,0.3)', borderBottom: '1px solid rgba(217,119,6,0.15)', borderRight: 'none', background: 'rgba(10,5,0,0.82)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', textDecoration: 'none', color: 'inherit' }}>
                  <span style={{ fontSize: '0.7rem', flexShrink: 0 }}>{card.icon}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{ color: '#fff', fontSize: '0.56rem', fontWeight: 400, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.title}</span>
                    <span style={{ color: '#f5c97a', fontSize: '0.48rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.subtitle}</span>
                    <span style={{ color: 'rgba(220,210,195,0.9)', fontSize: '0.46rem', lineHeight: 1.3, margin: 0 }}>{card.desc}</span>
                  </div>
                </a>
              ))}
            </div>

            {/* SEARCH BAR */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '165px', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'white', fontSize: '0.76rem', paddingLeft: '4px', textShadow: '0 1px 4px rgba(0,0,0,0.6)', marginBottom: '0.15rem' }}>
                <MapPin size={14} style={{ color: '#f5a623' }}/><span>Where are you going?</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '48px', borderRadius: '14px', padding: '4px', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 8px 32px rgba(0,0,0,0.22)', width: '100%', boxSizing: 'border-box' }}>
                {/* City */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px', padding: '0 6px', height: '100%', borderRight: '1px solid rgba(0,0,0,0.08)', position: 'relative', cursor: 'pointer', minWidth: 0 }}
                  onClick={() => { const v = !showCity; closeAll(); setShowCity(v); }}>
                  <MapPin size={13} style={{ color: '#f5a623', flexShrink: 0 }}/>
                  <span style={{ fontSize: '0.76rem', color: '#333', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{city}</span>
                  {showCity && renderCityDropdown({ top: 'calc(100% + 6px)', left: 0, width: '260px' })}
                </div>
                {/* Check-in */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px', padding: '0 6px', height: '100%', borderRight: '1px solid rgba(0,0,0,0.08)', position: 'relative', cursor: 'pointer', minWidth: 0 }}
                  onClick={() => { const v = !showCheckInCal; closeAll(); setShowCheckInCal(v); }}>
                  <Calendar size={13} style={{ color: '#888', flexShrink: 0 }}/>
                  <span style={{ fontSize: '0.7rem', color: checkIn?'#333':'#aaa', fontWeight: 500 }}>{fmtDate(checkIn)||'Check-in'}</span>
                  {showCheckInCal && <MiniCalendar title="Check-in" value={checkIn} onChange={setCheckIn} minDate={todayStr} onClose={() => setShowCheckInCal(false)}/>}
                </div>
                {/* Check-out */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px', padding: '0 6px', height: '100%', borderRight: '1px solid rgba(0,0,0,0.08)', position: 'relative', cursor: 'pointer', minWidth: 0 }}
                  onClick={() => { const v = !showCheckOutCal; closeAll(); setShowCheckOutCal(v); }}>
                  <Calendar size={13} style={{ color: '#888', flexShrink: 0 }}/>
                  <span style={{ fontSize: '0.7rem', color: checkOut?'#333':'#aaa', fontWeight: 500 }}>{fmtDate(checkOut)||'Check-out'}</span>
                  {showCheckOutCal && <MiniCalendar title="Check-out" value={checkOut} onChange={setCheckOut} minDate={checkIn||todayStr} onClose={() => setShowCheckOutCal(false)}/>}
                </div>
                {/* Guests */}
                <div ref={guestRef} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px', padding: '0 6px', height: '100%', position: 'relative', cursor: 'pointer', minWidth: 0 }}
                  onClick={() => { const v = !showGuests; closeAll(); setShowGuests(v); }}>
                  <Users size={13} style={{ color: '#888', flexShrink: 0 }}/>
                  <span style={{ fontSize: '0.7rem', color: '#333', fontWeight: 500 }}>{guests} Gu.</span>
                  {showGuests && (
                    <div style={{ position: 'absolute', bottom: 'calc(100% + 8px)', right: 0, background: 'white', borderRadius: '14px', boxShadow: '0 8px 28px rgba(0,0,0,0.18)', padding: '12px 16px', zIndex: 300, minWidth: '150px' }}
                      onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#333' }}>Guests</span>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }} onClick={() => setShowGuests(false)}><X size={14}/></button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                        <button style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid #e0c07a', background: 'white', color: '#c8851a', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onClick={e => { e.stopPropagation(); setGuests(Math.max(1,guests-1)); }}>−</button>
                        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a1a1a', minWidth: 24, textAlign: 'center' }}>{guests}</span>
                        <button style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid #e0c07a', background: 'white', color: '#c8851a', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onClick={e => { e.stopPropagation(); setGuests(guests+1); }}>+</button>
                      </div>
                    </div>
                  )}
                </div>
                <button style={{ flexShrink: 0, height: '40px', borderRadius: '10px', padding: '0 12px', background: 'linear-gradient(135deg, #f5a623 0%, #e08c10 100%)', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 4px 16px rgba(245,166,35,0.45)' }}
                  onClick={handleSearch}>
                  <Search size={14}/><span>Search</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* ═══════════════ DESKTOP ═══════════════ */
          <>
            <div className="home1-right-block">
              <div className="home1-heading-block">
                <h1 className="home1-heading">
                  <span style={{ color: '#f5a623' }}>OvikaLiving.com</span> – India's Smart Stay Marketplace For Flexible Urban Living
                </h1>
                <p className="home1-subheading">
                  Book Verified PG's, Apartments and Premium Homes across India — Nightly or Monthly
                </p>
              </div>
              <div className="home1-cards">
                {cards.map((card, i) => (
                  <a key={i} href={buildHref(card.category)} className="home1-card">
                    <span className="home1-card-icon">{card.icon}</span>
                    <div className="home1-card-text">
                      <span className="home1-card-title">{card.title}</span>
                      <span className="home1-card-subtitle">{card.subtitle}</span>
                      <span className="home1-card-desc">{card.desc}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Search bar */}
            <div className="ovika-search-section">
              <div className="ovika-search-title">
                <MapPin className="pin-icon" size={16}/>
                <span style={{ color: '#fff' }}>Where are you going?</span>
              </div>
              <div className="ovika-search-bar-container">
                <div className="ovika-search-field city-field" style={{ position: 'relative' }}
                  onClick={() => { setShowCity(!showCity); setShowCheckInCal(false); setShowCheckOutCal(false); setShowGuests(false); }}>
                  <div className="field-icon-box"><MapPin size={15} style={{ color: '#f5a623' }}/></div>
                  <div className="field-text">
                    <span className="field-label">Location</span>
                    <span className="field-value">{city}</span>
                  </div>
                  {showCity && renderCityDropdown({ top: 'calc(100% + 8px)', left: 0, width: '260px' })}
                </div>
                <div className="field-divider"/>
                <div className="ovika-search-field">
                  <div className="field-icon-box"><Calendar size={15}/></div>
                  <div className="field-text">
                    <span className="field-label">Check-in</span>
                    <input type="date" className="date-input" value={checkIn} onChange={e => setCheckIn(e.target.value)}/>
                  </div>
                </div>
                <div className="field-divider"/>
                <div className="ovika-search-field">
                  <div className="field-icon-box"><Calendar size={15}/></div>
                  <div className="field-text">
                    <span className="field-label">Check-out</span>
                    <input type="date" className="date-input" value={checkOut} onChange={e => setCheckOut(e.target.value)}/>
                  </div>
                </div>
                <div className="field-divider"/>
                <div className="ovika-search-field guests-field">
                  <div className="field-icon-box"><Users size={15}/></div>
                  <div className="field-text">
                    <span className="field-label">Guests</span>
                    <span className="field-value">{guests} Guest{guests > 1 ? 's' : ''}</span>
                  </div>
                  <div className="guest-controls">
                    <button onClick={e => { e.stopPropagation(); setGuests(Math.max(1,guests-1)); }}>−</button>
                    <button onClick={e => { e.stopPropagation(); setGuests(guests+1); }}>+</button>
                  </div>
                </div>
                <button className="ovika-search-btn" onClick={handleSearch}>
                  <Search size={15}/><span>Search</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}