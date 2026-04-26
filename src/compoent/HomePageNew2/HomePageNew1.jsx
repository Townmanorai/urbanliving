import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import { navClick, auxNavClick } from '../../utils/navClick';

const API_BASE_URL = 'https://www.townmanor.ai/api/ovika';
const SHORT_TERM_TYPES = ['entire place', 'private room', 'shared room', 'hotel room', 'homestay'];
const isLongTermProperty = (p) => !SHORT_TERM_TYPES.includes((p.property_type || '').toLowerCase());



function fmt(n) {
  if (!n || n === 0) return null;
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
  if (n >= 1000) return '₹' + Math.round(n / 1000) + 'K';
  return '₹' + n;
}

function getBreakpoint() {
  const w = window.innerWidth;
  if (w <= 768) return 'mobile';
  if (w <= 1024) return 'tablet';
  return 'desktop';
}

const typeIcon = { City: '🏙', Locality: '📍', Category: '🔍', Near: '📌', Amenity: '✨' };

/* ── Search Bar with Suggestions ── */
function SearchBar({ searchText, setSearchText, showSuggestions, setShowSuggestions, searchRef, filteredSuggestions, handleSearch, handleNearMe, locating, handleSuggestionClick, handleKeyDown, compact, placeholder }) {
  const wrapRef = useRef(null);
  const [dropPos, setDropPos] = useState(null);

  // Recalculate dropdown position whenever it opens or window changes.
  // Uses position:fixed so it escapes any overflow:hidden parent (e.g. the main card).
  useEffect(() => {
    if (!showSuggestions) { setDropPos(null); return; }
    const update = () => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setDropPos({ top: r.bottom + 6, left: r.left, width: r.width });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update, true); window.removeEventListener('resize', update); };
  }, [showSuggestions]);

  return (
    <div ref={el => { wrapRef.current = el; if (searchRef) searchRef.current = el; }} style={{ position: 'relative' }}>
      <div style={{
        background: '#fff',
        borderRadius: 14,
        boxShadow: '0 8px 32px rgba(194,119,43,0.18), 0 2px 8px rgba(0,0,0,0.06)',
        border: '1.5px solid #d4b896',
        display: 'flex',
        alignItems: 'stretch',
        minHeight: compact ? 48 : 62,
        overflow: 'hidden',
      }}>
        <MapPin size={16} style={{ color: '#c2772b', flexShrink: 0, alignSelf: 'center', marginLeft: 14 }} />
        <input
          type="text"
          value={searchText}
          onChange={e => { setSearchText(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Search city, locality, PG, flat..."}
          style={{
            flex: 1, border: 'none', outline: 'none',
            fontSize: compact ? '0.84rem' : '0.92rem',
            fontWeight: 500, color: '#1a1209',
            fontFamily: "'Poppins', sans-serif",
            padding: '0 12px',
            background: 'transparent',
          }}
        />
        <button
          onClick={() => !locating && handleNearMe()}
          title="Near Me"
          disabled={locating}
          style={{
            flexShrink: 0, width: 44, border: 'none', background: 'transparent',
            color: locating ? '#c2772b' : '#c2772b', cursor: locating ? 'wait' : 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', transition: 'all 0.2s',
            position: 'relative'
          }}
          onMouseEnter={e => { if(!locating) { e.currentTarget.style.color = '#a85e1f'; e.currentTarget.style.transform = 'scale(1.1)'; } }}
          onMouseLeave={e => { if(!locating) { e.currentTarget.style.color = '#c2772b'; e.currentTarget.style.transform = 'scale(1)'; } }}
        >
          {locating ? (
            <div style={{ position: 'relative', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <style>{`
                    @keyframes pulsePin { 0% { transform: scale(0.9); opacity: 0.7; } 50% { transform: scale(1.3); opacity: 1; } 100% { transform: scale(0.9); opacity: 0.7; } }
                    @keyframes ripplePin { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(2.5); opacity: 0; } }
                `}</style>
                <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: 'rgba(194,119,43,0.3)', animation: 'ripplePin 1.5s infinite' }} />
                <MapPin size={18} style={{ animation: 'pulsePin 1s infinite', position: 'relative', zIndex: 1 }} />
            </div>
          ) : <MapPin size={18} />}
        </button>
        <button
          onClick={() => handleSearch(null)}
          style={{
            flexShrink: 0, padding: compact ? '0 16px' : '0 22px', border: 'none',
            background: 'linear-gradient(135deg, #c2772b 0%, #a85e1f 100%)',
            color: '#fff', fontSize: compact ? '0.8rem' : '0.86rem',
            fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
            margin: '5px 5px 5px 0', borderRadius: 10,
            boxShadow: '0 4px 14px rgba(194,119,43,0.4)',
            fontFamily: "'Poppins', sans-serif",
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(194,119,43,0.55)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(194,119,43,0.4)'; }}
        >
          <Search size={15} /> Search
        </button>
      </div>

      {/* Suggestions Dropdown — position:fixed escapes overflow:hidden parents */}
      {showSuggestions && filteredSuggestions.length > 0 && dropPos && (
        <div style={{
          position: 'fixed',
          top: dropPos.top,
          left: dropPos.left,
          width: dropPos.width,
          background: '#fff', borderRadius: 12,
          boxShadow: '0 12px 40px rgba(0,0,0,0.16)',
          border: '1.5px solid #f0e8da',
          zIndex: 99999, overflow: 'hidden',
        }}>
          {searchText.trim() === '' && (
            <div style={{ padding: '8px 14px 4px', fontSize: '0.6rem', color: '#b8a080', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
              Popular Searches
            </div>
          )}
          {filteredSuggestions.map((s, i) => (
            <div
              key={i}
              onClick={() => handleSuggestionClick(s)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', cursor: 'pointer',
                borderBottom: i < filteredSuggestions.length - 1 ? '1px solid #f8f0e4' : 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fdf7ee'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'rgba(194,119,43,0.1)', border: '1px solid rgba(194,119,43,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', flexShrink: 0,
              }}>
                {typeIcon[s.type]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1209' }}>
                  {searchText.trim() ? (
                    s.label.split(new RegExp(`(${searchText.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')).map((part, j) =>
                      part.toLowerCase() === searchText.trim().toLowerCase()
                        ? <span key={j} style={{ color: '#c2772b' }}>{part}</span>
                        : part
                    )
                  ) : s.label}
                </div>
              </div>
              {(s.type === 'Near' || s.label === 'Near Me') && <MapPin size={14} color="#c2772b" style={{ marginLeft: 6, flexShrink: 0 }} />}
              <span style={{ fontSize: '0.6rem', color: '#c2772b', background: 'rgba(194,119,43,0.1)', padding: '2px 8px', borderRadius: 10, fontWeight: 600, flexShrink: 0 }}>
                {s.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const SUGGESTIONS = [
  // ── Cities ──
  { label: 'Noida', type: 'City' },
  { label: 'Greater Noida', type: 'City' },
  { label: 'Noida Extension', type: 'City' },
  { label: 'Delhi', type: 'City' },
  { label: 'Ghaziabad', type: 'City' },
  { label: 'Gurugram', type: 'City' },
  { label: 'Faridabad', type: 'City' },

  // ── Noida Localities ──
  { label: 'Sector 1, Noida', type: 'Locality' },
  { label: 'Sector 2, Noida', type: 'Locality' },
  { label: 'Sector 11, Noida', type: 'Locality' },
  { label: 'Sector 15, Noida', type: 'Locality' },
  { label: 'Sector 16, Noida', type: 'Locality' },
  { label: 'Sector 18, Noida', type: 'Locality' },
  { label: 'Sector 19, Noida', type: 'Locality' },
  { label: 'Sector 22, Noida', type: 'Locality' },
  { label: 'Sector 27, Noida', type: 'Locality' },
  { label: 'Sector 29, Noida', type: 'Locality' },
  { label: 'Sector 30, Noida', type: 'Locality' },
  { label: 'Sector 34, Noida', type: 'Locality' },
  { label: 'Sector 37, Noida', type: 'Locality' },
  { label: 'Sector 41, Noida', type: 'Locality' },
  { label: 'Sector 44, Noida', type: 'Locality' },
  { label: 'Sector 45, Noida', type: 'Locality' },
  { label: 'Sector 46, Noida', type: 'Locality' },
  { label: 'Sector 47, Noida', type: 'Locality' },
  { label: 'Sector 50, Noida', type: 'Locality' },
  { label: 'Sector 51, Noida', type: 'Locality' },
  { label: 'Sector 52, Noida', type: 'Locality' },
  { label: 'Sector 55, Noida', type: 'Locality' },
  { label: 'Sector 56, Noida', type: 'Locality' },
  { label: 'Sector 57, Noida', type: 'Locality' },
  { label: 'Sector 58, Noida', type: 'Locality' },
  { label: 'Sector 59, Noida', type: 'Locality' },
  { label: 'Sector 60, Noida', type: 'Locality' },
  { label: 'Sector 61, Noida', type: 'Locality' },
  { label: 'Sector 62, Noida', type: 'Locality' },
  { label: 'Sector 63, Noida', type: 'Locality' },
  { label: 'Sector 64, Noida', type: 'Locality' },
  { label: 'Sector 65, Noida', type: 'Locality' },
  { label: 'Sector 66, Noida', type: 'Locality' },
  { label: 'Sector 67, Noida', type: 'Locality' },
  { label: 'Sector 68, Noida', type: 'Locality' },
  { label: 'Sector 70, Noida', type: 'Locality' },
  { label: 'Sector 71, Noida', type: 'Locality' },
  { label: 'Sector 74, Noida', type: 'Locality' },
  { label: 'Sector 75, Noida', type: 'Locality' },
  { label: 'Sector 76, Noida', type: 'Locality' },
  { label: 'Sector 77, Noida', type: 'Locality' },
  { label: 'Sector 78, Noida', type: 'Locality' },
  { label: 'Sector 79, Noida', type: 'Locality' },
  { label: 'Sector 81, Noida', type: 'Locality' },
  { label: 'Sector 82, Noida', type: 'Locality' },
  { label: 'Sector 100, Noida', type: 'Locality' },
  { label: 'Sector 104, Noida', type: 'Locality' },
  { label: 'Sector 108, Noida', type: 'Locality' },
  { label: 'Sector 119, Noida', type: 'Locality' },
  { label: 'Sector 120, Noida', type: 'Locality' },
  { label: 'Sector 121, Noida', type: 'Locality' },
  { label: 'Sector 125, Noida', type: 'Locality' },
  { label: 'Sector 126, Noida', type: 'Locality' },
  { label: 'Sector 127, Noida', type: 'Locality' },
  { label: 'Sector 128, Noida', type: 'Locality' },
  { label: 'Sector 129, Noida', type: 'Locality' },
  { label: 'Sector 130, Noida', type: 'Locality' },
  { label: 'Sector 132, Noida', type: 'Locality' },
  { label: 'Sector 134, Noida', type: 'Locality' },
  { label: 'Sector 135, Noida', type: 'Locality' },
  { label: 'Sector 136, Noida', type: 'Locality' },
  { label: 'Sector 137, Noida', type: 'Locality' },
  { label: 'Sector 142, Noida', type: 'Locality' },
  { label: 'Sector 143, Noida', type: 'Locality' },
  { label: 'Sector 144, Noida', type: 'Locality' },
  { label: 'Sector 150, Noida', type: 'Locality' },
  { label: 'Sector 151, Noida', type: 'Locality' },
  { label: 'Sector 152, Noida', type: 'Locality' },
  { label: 'Sector 153, Noida', type: 'Locality' },
  { label: 'Sector 155, Noida', type: 'Locality' },
  { label: 'Sector 157, Noida', type: 'Locality' },
  { label: 'Sector 158, Noida', type: 'Locality' },
  { label: 'Sector 159, Noida', type: 'Locality' },
  { label: 'Sector 160, Noida', type: 'Locality' },
  { label: 'Sector 161, Noida', type: 'Locality' },
  { label: 'Sector 162, Noida', type: 'Locality' },
  { label: 'Sector 163, Noida', type: 'Locality' },
  { label: 'Sector 164, Noida', type: 'Locality' },
  { label: 'Sector 165, Noida', type: 'Locality' },
  { label: 'Sector 166, Noida', type: 'Locality' },
  { label: 'Sector 167, Noida', type: 'Locality' },
  { label: 'Sector 168, Noida', type: 'Locality' },
  { label: 'Atta Market, Noida', type: 'Locality' },
  { label: 'Brahmaputra Market, Noida', type: 'Locality' },
  { label: 'Film City, Noida', type: 'Locality' },
  { label: 'DND Flyway, Noida', type: 'Locality' },
  { label: 'Botanical Garden, Noida', type: 'Locality' },
  { label: 'City Centre, Noida', type: 'Locality' },

  // ── Greater Noida Localities ──
  { label: 'Knowledge Park 1, Greater Noida', type: 'Locality' },
  { label: 'Knowledge Park 2, Greater Noida', type: 'Locality' },
  { label: 'Knowledge Park 3, Greater Noida', type: 'Locality' },
  { label: 'Knowledge Park 4, Greater Noida', type: 'Locality' },
  { label: 'Knowledge Park 5, Greater Noida', type: 'Locality' },
  { label: 'Alpha 1, Greater Noida', type: 'Locality' },
  { label: 'Alpha 2, Greater Noida', type: 'Locality' },
  { label: 'Beta 1, Greater Noida', type: 'Locality' },
  { label: 'Beta 2, Greater Noida', type: 'Locality' },
  { label: 'Gamma 1, Greater Noida', type: 'Locality' },
  { label: 'Gamma 2, Greater Noida', type: 'Locality' },
  { label: 'Delta 1, Greater Noida', type: 'Locality' },
  { label: 'Delta 2, Greater Noida', type: 'Locality' },
  { label: 'Omega 1, Greater Noida', type: 'Locality' },
  { label: 'Chi 1, Greater Noida', type: 'Locality' },
  { label: 'Chi 2, Greater Noida', type: 'Locality' },
  { label: 'Phi 1, Greater Noida', type: 'Locality' },
  { label: 'Mu, Greater Noida', type: 'Locality' },
  { label: 'Pari Chowk, Greater Noida', type: 'Locality' },
  { label: 'Yamuna Expressway, Greater Noida', type: 'Locality' },
  { label: 'Tech Zone 4, Greater Noida', type: 'Locality' },
  { label: 'Tech Zone, Greater Noida', type: 'Locality' },
  { label: 'Ecotech 3, Greater Noida', type: 'Locality' },
  { label: 'Sector 1, Greater Noida', type: 'Locality' },
  { label: 'Sector 2, Greater Noida', type: 'Locality' },
  { label: 'Sector 3, Greater Noida', type: 'Locality' },
  { label: 'Sector 4, Greater Noida', type: 'Locality' },
  { label: 'Sector 10, Greater Noida', type: 'Locality' },
  { label: 'Sector 12, Greater Noida', type: 'Locality' },
  { label: 'Sector 27, Greater Noida', type: 'Locality' },
  { label: 'Sector 36, Greater Noida', type: 'Locality' },
  { label: 'Ansal Golf Links, Greater Noida', type: 'Locality' },
  { label: 'Godrej Golf Links, Greater Noida', type: 'Locality' },
  { label: 'Greater Noida West', type: 'Locality' },
  { label: 'Noida Extension (Greater Noida West)', type: 'Locality' },
  { label: 'Gaur City, Greater Noida West', type: 'Locality' },
  { label: 'Ajnara Homes, Greater Noida West', type: 'Locality' },
  { label: 'Surajpur, Greater Noida', type: 'Locality' },
  { label: 'Kasna, Greater Noida', type: 'Locality' },
  { label: 'Rabupura, Greater Noida', type: 'Locality' },
  { label: 'Dadri, Greater Noida', type: 'Locality' },

  // ── Near Landmarks / Metro ──
  { label: 'PG near Noida Sector 62 Metro', type: 'Near' },
  { label: 'PG near Botanical Garden Metro', type: 'Near' },
  { label: 'PG near City Centre Metro', type: 'Near' },
  { label: 'PG near Sector 18 Metro', type: 'Near' },
  { label: 'PG near Aqua Line Metro', type: 'Near' },
  { label: 'PG near Pari Chowk Metro', type: 'Near' },
  { label: 'PG near Sector 137 Metro', type: 'Near' },
  { label: 'Flat near Noida Metro', type: 'Near' },
  { label: 'Flat near Greater Noida Metro', type: 'Near' },
  { label: 'PG near IT Park Noida', type: 'Near' },
  { label: 'PG near Infosys Noida', type: 'Near' },
  { label: 'PG near HCL Noida', type: 'Near' },
  { label: 'PG near Cognizant Noida', type: 'Near' },
  { label: 'PG near Wipro Noida', type: 'Near' },
  { label: 'PG near TCS Noida', type: 'Near' },
  { label: 'PG near AMITY University', type: 'Near' },
  { label: 'PG near GL Bajaj', type: 'Near' },
  { label: 'PG near Sharda University', type: 'Near' },
  { label: 'PG near Galgotias University', type: 'Near' },
  { label: 'PG near Bennett University', type: 'Near' },
  { label: 'PG near NIET College', type: 'Near' },
  { label: 'PG near Delhi Public School Noida', type: 'Near' },
  { label: 'Flat near Fortis Hospital Noida', type: 'Near' },
  { label: 'Stay near Expo Mart Greater Noida', type: 'Near' },

  // ── Property Types / Categories ──
  { label: 'PG in Noida', type: 'Category' },
  { label: 'PG in Greater Noida', type: 'Category' },
  { label: 'PG for Boys in Noida', type: 'Category' },
  { label: 'PG for Girls in Noida', type: 'Category' },
  { label: 'PG for Working Professionals', type: 'Category' },
  { label: 'Co-Living Space Noida', type: 'Category' },
  { label: 'Co-Living Space Greater Noida', type: 'Category' },
  { label: 'Studio Apartment Noida', type: 'Category' },
  { label: 'Studio Apartment Greater Noida', type: 'Category' },
  { label: '1BHK Flat Noida', type: 'Category' },
  { label: '1BHK Flat Greater Noida', type: 'Category' },
  { label: '2BHK Flat Noida', type: 'Category' },
  { label: '2BHK Flat Greater Noida', type: 'Category' },
  { label: '3BHK Flat Noida', type: 'Category' },
  { label: 'Furnished Flat Noida', type: 'Category' },
  { label: 'Furnished Apartment Greater Noida', type: 'Category' },
  { label: 'Short Stay Noida', type: 'Category' },
  { label: 'Short Stay Greater Noida', type: 'Category' },
  { label: 'Monthly Rental Noida', type: 'Category' },
  { label: 'Monthly Rental Greater Noida', type: 'Category' },
  { label: 'Nightly Stay Noida', type: 'Category' },
  { label: 'Nightly Stay Greater Noida', type: 'Category' },
  { label: 'Service Apartment Noida', type: 'Category' },
  { label: 'Service Apartment Greater Noida', type: 'Category' },
  { label: 'Homestay Noida', type: 'Category' },
  { label: 'Homestay Greater Noida', type: 'Category' },
  { label: 'Private Room Noida', type: 'Category' },
  { label: 'Shared Room Noida', type: 'Category' },
  { label: 'Entire Apartment Noida', type: 'Category' },
  { label: 'Hotel Room Noida', type: 'Category' },
  { label: 'Budget PG Noida', type: 'Category' },
  { label: 'Premium PG Noida', type: 'Category' },
  { label: 'Luxury Apartment Noida', type: 'Category' },
  { label: 'Zero Brokerage Flat Noida', type: 'Category' },
  { label: 'Bachelor Accommodation Noida', type: 'Category' },
  { label: 'Family Accommodation Noida', type: 'Category' },
  { label: 'Working Professional PG', type: 'Category' },
  { label: 'Student PG Noida', type: 'Category' },
  { label: 'Couple Friendly Stay Noida', type: 'Category' },

  // ── Amenity-based SEO searches ──
  { label: 'AC Room Noida', type: 'Amenity' },
  { label: 'PG with Food Noida', type: 'Amenity' },
  { label: 'PG with WiFi Noida', type: 'Amenity' },
  { label: 'PG with Gym Noida', type: 'Amenity' },
  { label: 'PG with Laundry Noida', type: 'Amenity' },
  { label: 'PG with Parking Noida', type: 'Amenity' },
  { label: 'PG with Power Backup Noida', type: 'Amenity' },
  { label: 'PG with Swimming Pool Noida', type: 'Amenity' },
  { label: 'Flat with Housekeeping Noida', type: 'Amenity' },
  { label: 'Fully Furnished PG Noida', type: 'Amenity' },
  { label: 'Fully Furnished Flat Noida', type: 'Amenity' },
  { label: 'Semi Furnished Flat Noida', type: 'Amenity' },
];

export default function HomePageNew1() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [bp, setBp] = useState(getBreakpoint());
  const [shortRate, setShortRate] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const onResize = () => setBp(getBreakpoint());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const handler = e => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
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

  const POPULAR_DEFAULT = [
    { label: 'Near Me', type: 'Near' },
    { label: 'Noida', type: 'City' },
    { label: 'Greater Noida', type: 'City' },
    { label: 'PG in Noida', type: 'Category' },
  ];
  const searchKeywords = searchText.toLowerCase().trim().split(/\s+/).filter(w => w.length > 1);
  const filteredSuggestions = searchKeywords.length > 0
    ? SUGGESTIONS.filter(s => {
        const label = s.label.toLowerCase();
        return searchKeywords.every(kw => label.includes(kw));
      }).slice(0, 5)
    : POPULAR_DEFAULT;

  const handleSearch = (rentalType) => {
    const p = new URLSearchParams();
    const text = searchText.trim();
    const lowText = text.toLowerCase();
    
    // Check if we have stored coords from a previous "Detect" click
    const storedLat = sessionStorage.getItem('ovika_user_lat');
    const storedLng = sessionStorage.getItem('ovika_user_lng');
    if (storedLat && storedLng && (lowText.includes('near') || lowText.includes('nearby') || lowText === 'nearby')) {
        p.set('lat', storedLat);
        p.set('lng', storedLng);
        sessionStorage.removeItem('ovika_user_lat');
        sessionStorage.removeItem('ovika_user_lng');
    }

    const isNearbyQuery = lowText.includes('near me') || lowText.includes('nearby') || lowText.includes('near by') || lowText.includes('around me');

    if (isNearbyQuery) {
      // Extract subject keywords (remove 'near me' phrases)
      const cleanSearch = text.replace(/near\s*me|nearby|near\s*by|around\s*me/gi, '').trim();
      handleNearMe(cleanSearch || 'Nearby', true);
      return;
    }

    if (text) {
      p.set('search', text);
      p.set('city', text);

      // detect rental type intent
      if (!rentalType) {
        if (lowText.includes('nightly') || lowText.includes('short') || lowText.includes('day')) {
          rentalType = 'short';
        } else if (lowText.includes('monthly') || lowText.includes('long') || lowText.includes('month') || lowText.includes('rent')) {
          rentalType = 'long';
        }
      }
    }

    if (rentalType) {
      p.set('rentalType', rentalType);
      sessionStorage.setItem('ovika_rental_type', rentalType);
    }
    navigate(`/properties?${p}`);
    setShowSuggestions(false);
  };

  const handleNearMe = (explicitSearch, autoNavigate = false) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      sessionStorage.setItem('ovika_user_lat', latitude);
      sessionStorage.setItem('ovika_user_lng', longitude);
      
      setTimeout(() => {
        setLocating(false);
        if (autoNavigate) {
          const p = new URLSearchParams();
          p.set('lat', latitude);
          p.set('lng', longitude);
          p.set('search', explicitSearch || 'Nearby');
          navigate(`/properties?${p}`);
        }
      }, 600);
    }, (err) => {
      setLocating(false);
      alert("Please enable location access to find properties near you.");
    });
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'Near' || suggestion.label === 'Near Me') {
      handleNearMe('Nearby', true);
      return;
    }
    setSearchText(suggestion.label);
    setShowSuggestions(false);
    const p = new URLSearchParams();
    p.set('search', suggestion.label);
    p.set('city', suggestion.label);
    navigate(`/properties?${p}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch(null);
  };

  // Quick-nav chips: each maps to a specific /properties URL
  const QUICK_CHIPS = [
    { label: 'Signature Stays', rentalType: 'short', path: () => { const p = new URLSearchParams(); p.set('category', 'Signature Stays'); p.set('rentalType', 'short'); return `/properties?${p}`; } },
    { label: 'Premium',         rentalType: 'short', path: () => { const p = new URLSearchParams(); p.set('category', 'Premium Stay');    p.set('rentalType', 'short'); return `/properties?${p}`; } },
    { label: 'Economy',         rentalType: 'short', path: () => { const p = new URLSearchParams(); p.set('category', 'Economy Stay');    p.set('rentalType', 'short'); return `/properties?${p}`; } },
    { label: 'PG',              rentalType: 'long',  path: () => { const p = new URLSearchParams(); p.set('category', 'PG');              p.set('rentalType', 'long');  return `/properties?${p}`; } },
    { label: 'Co-living',       rentalType: 'short', path: () => { const p = new URLSearchParams(); p.set('search', 'co-living');         p.set('rentalType', 'short'); return `/properties?${p}`; } },
  ];

  const shortDisplay = ratesLoading ? '—' : (shortRate ? `${fmt(shortRate)}/night` : '₹2,499/night');
  const longDisplay = '₹4,999/month';

  /* ════════ MOBILE (≤640px) ════════ */
  if (bp === 'mobile') {
    return (
      <div style={{ background: '#fff', fontFamily: "'Poppins',sans-serif", boxSizing: 'border-box' }}>

        {/* ── Top header block — white bg ── */}
        <div style={{ background: '#fff', padding: '22px 16px 0' }}>

          {/* Title */}
          <h1 style={{ color: '#1a1209', fontSize: '1.45rem', fontWeight: 600, lineHeight: 1.2, margin: '0 0 5px' }}>
            Find Smart Stays<br />
            <span style={{ color: '#c2772b' }}>Across NCR Cities</span>
          </h1>
          <p style={{ color: '#8c7560', fontSize: '0.72rem', margin: '0 0 10px', lineHeight: 1.5, fontWeight: 400 }}>
            Verified PGs, Apartments &amp; Premium Homes
          </p>

          {locating && (
            <div style={{
              position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 15, animation: 'fadeIn 0.3s ease-in'
            }}>
                <style>{`
                    @keyframes bounceIcon { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
                    @keyframes shadowPulse { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.5); opacity: 0.1; } }
                `}</style>
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <MapPin size={48} color="#c2772b" style={{ animation: 'bounceIcon 0.8s infinite ease-in-out' }} />
                    <div style={{ width: 30, height: 6, background: '#000', borderRadius: '50%', marginTop: 10, animation: 'shadowPulse 0.8s infinite ease-in-out' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1a1209' }}>Identifying Your Location</div>
                    <div style={{ fontSize: '0.85rem', color: '#c2772b', marginTop: 4 }}>Finding the best properties near you...</div>
                </div>
            </div>
          )}

          {/* City chips */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2, marginBottom: 12, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              { label: 'Noida', city: 'Noida' },
              { label: 'Greater Noida', city: 'Greater Noida' },
              { label: 'Delhi', city: 'Delhi' },
              { label: 'Gurugram', city: 'Gurugram' },
            ].map(c => (
              <button key={c.label} onClick={(e) => { const p = new URLSearchParams(); p.set('city', c.city); navClick(e, `/properties?${p}`, navigate); }} onAuxClick={(e) => { const p = new URLSearchParams(); p.set('city', c.city); auxNavClick(e, `/properties?${p}`); }}
                style={{ flexShrink: 0, background: '#fff', border: '1.5px solid #e8c88a', borderRadius: 20, padding: '4px 13px', fontSize: '0.65rem', fontWeight: 600, color: '#7a5530', cursor: 'pointer', fontFamily: "'Poppins',sans-serif", whiteSpace: 'nowrap', outline: 'none' }}>
                {c.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <SearchBar
            compact={false}
            placeholder="Search locations"
            searchText={searchText}
            setSearchText={setSearchText}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            searchRef={searchRef}
            filteredSuggestions={filteredSuggestions}
            handleSearch={handleSearch}
            handleNearMe={handleNearMe}
            locating={locating}
            handleSuggestionClick={handleSuggestionClick}
            handleKeyDown={handleKeyDown}
          />

          {/* Quick Nav Chips */}
          <div style={{ marginTop: 14, marginBottom: 16 }}>
            <div style={{ fontSize: '0.57rem', color: '#b0987c', fontWeight: 600, letterSpacing: 1.1, textTransform: 'uppercase', marginBottom: 8 }}>
              Popular Searches
            </div>
            <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 2, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              {QUICK_CHIPS.map(chip => (
                <button
                  key={chip.label}
                  onClick={(e) => { sessionStorage.setItem('ovika_rental_type', chip.rentalType); navClick(e, chip.path(), navigate); }}
                  onAuxClick={(e) => { sessionStorage.setItem('ovika_rental_type', chip.rentalType); auxNavClick(e, chip.path()); }}
                  style={{
                    flexShrink: 0, background: '#fdf6ee', border: '1px solid #e8c88a',
                    borderRadius: 20, padding: '5px 13px', fontSize: '0.67rem', fontWeight: 600,
                    color: '#7a5530', cursor: 'pointer', fontFamily: "'Poppins',sans-serif",
                    whiteSpace: 'nowrap', outline: 'none',
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Flip-poster cards + feature boxes ── */}
        <div style={{ background: 'linear-gradient(180deg, #fdf7ee 0%, #f5ead6 60%, #ede4cf 100%)', padding: '0 12px 24px' }}>

          <style>{`
            @keyframes shimLineMob { 0%{transform:translateX(-100%)} 100%{transform:translateX(220%)} }
          `}</style>

          {/* Two poster cards side by side */}
          <div style={{ display: 'flex', gap: 9, marginBottom: 11 }}>

            {/* ── NIGHTLY: image top → content bottom ── */}
            <div onClick={() => handleSearch('short')}
              style={{ flex: '1 1 0', minWidth: 0, background: '#fdf8f2', borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 18px rgba(0,0,0,0.11)', border: '1px solid #f0e8da', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
              {/* Image top */}
              <div style={{ position: 'relative', flex: '0 0 52%', overflow: 'hidden', minHeight: 110 }}>
                <img
                  src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80&auto=format&fit=crop"
                  alt="Nightly Stay"
                  onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 36, background: 'linear-gradient(to bottom, transparent, #fdf8f2)' }} />
                <div style={{ position: 'absolute', top: 7, left: 7, background: 'rgba(194,119,43,0.92)', borderRadius: 20, padding: '2px 7px' }}>
                  <span style={{ fontSize: '0.38rem', color: '#fff', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>🌙 Nightly</span>
                </div>
              </div>
              {/* Content bottom */}
              <div style={{ flex: 1, padding: '8px 9px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#fdf8f2' }}>
                <div>
                  <div style={{ fontSize: '0.6rem', fontWeight: 600, color: '#1a1209', lineHeight: 1.2, marginBottom: 4 }}>
                    Stay the Night,<br /><span style={{ color: '#c2772b' }}>Own the Morning</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 3 }}>
                    <span style={{ fontSize: '0.36rem', color: '#a08060', fontWeight: 500 }}>STARTING</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 300, color: '#1a1209', lineHeight: 1 }}>{shortDisplay}</span>
                  </div>
                  {/* shimmer */}
                  <div style={{ position: 'relative', height: 1.5, width: '70%', background: 'rgba(194,119,43,0.15)', borderRadius: 2, overflow: 'hidden', marginBottom: 5 }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,#c2772b,transparent)', animation: 'shimLineMob 2.2s ease-in-out infinite' }} />
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); handleSearch('short'); }}
                  style={{ width: '100%', padding: '7px 0', borderRadius: 7, border: 'none', background: 'linear-gradient(135deg,#c2772b,#a85e1f)', color: '#fff', fontSize: '0.52rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" }}>
                  Explore Nightly →
                </button>
              </div>
            </div>

            {/* ── MONTHLY: content top → image bottom ── */}
            <div onClick={() => handleSearch('long')}
              style={{ flex: '1 1 0', minWidth: 0, background: '#fdf5e8', borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 18px rgba(0,0,0,0.11)', border: '1px solid #f0e8da', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
              {/* Content top */}
              <div style={{ flex: '0 0 48%', padding: '8px 9px 6px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(160deg,#fdf5e8,#faebd0)', borderBottom: '1px solid #f0e0c0' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(26,18,9,0.07)', border: '1px solid rgba(194,119,43,0.25)', borderRadius: 20, padding: '2px 7px', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.38rem', color: '#7a5025', fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase' }}>🏠 Monthly</span>
                  </div>
                  <div style={{ fontSize: '0.6rem', fontWeight: 600, color: '#1a1209', lineHeight: 1.2, marginBottom: 4 }}>
                    Your City,<br /><span style={{ color: '#c2772b' }}>Your Home</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 3 }}>
                    <span style={{ fontSize: '0.36rem', color: '#a08060', fontWeight: 500 }}>STARTING</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 300, color: '#1a1209', lineHeight: 1 }}>{longDisplay}</span>
                  </div>
                  {/* shimmer */}
                  <div style={{ position: 'relative', height: 1.5, width: '70%', background: 'rgba(194,119,43,0.15)', borderRadius: 2, overflow: 'hidden', marginBottom: 5 }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,#c2772b,transparent)', animation: 'shimLineMob 2.6s ease-in-out infinite' }} />
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); handleSearch('long'); }}
                  style={{ width: '100%', padding: '7px 0', borderRadius: 7, border: '1.5px solid #c2772b', background: 'transparent', color: '#c2772b', fontSize: '0.52rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" }}>
                  Explore Monthly →
                </button>
              </div>
              {/* Image bottom */}
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 90 }}>
                <img
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80&auto=format&fit=crop"
                  alt="Monthly Rental"
                  onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80'; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 32, background: 'linear-gradient(to top, transparent, #faebd0)' }} />
              </div>
            </div>

          </div>

          {/* Feature boxes — 2 per row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {[
              { icon: '🏠', title: 'Fully Furnished', sub: 'Move in with zero hassle' },
              { icon: '⚡', title: 'Instant Move-in', sub: 'Same-day confirmation' },
              { icon: '🛡', title: 'Zero Brokerage', sub: 'No hidden charges ever' },
              { icon: '✔', title: 'Verified', sub: '100% physically verified' },
            ].map(f => (
              <div key={f.title} style={{ flex: '1 1 calc(50% - 4px)', minWidth: 0, background: '#fff', borderRadius: 11, padding: '9px 10px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f0e8da' }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(194,119,43,0.1)', border: '1px solid rgba(194,119,43,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>{f.icon}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.58rem', fontWeight: 600, color: '#1a1209', lineHeight: 1.2 }}>{f.title}</div>
                  <div style={{ fontSize: '0.48rem', color: '#9a8878', fontWeight: 400, marginTop: 1, lineHeight: 1.3 }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }


  /* ════════ TABLET (641–1024px) ════════ */
  if (bp === 'tablet') {
    return (
      <div style={{ background: 'linear-gradient(160deg,#f5efe4,#ede4cf)', fontFamily: "'Poppins',sans-serif", boxSizing: 'border-box', padding: '0 0 32px' }}>

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
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', fontWeight: 600, margin: 0, textShadow: '0 2px 14px rgba(0,0,0,0.7)', lineHeight: 1.2 }}>
              Find Smart Stays<br /><span style={{ color: '#f0c070' }}>Across NCR Cities</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem', margin: '8px 0 0', lineHeight: 1.5 }}>Verified PGs, Apartments &amp; Premium Homes</p>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ padding: '20px 24px 0' }}>
          <SearchBar compact={false} searchText={searchText} setSearchText={setSearchText} showSuggestions={showSuggestions} setShowSuggestions={setShowSuggestions} searchRef={searchRef} filteredSuggestions={filteredSuggestions} handleSearch={handleSearch} handleSuggestionClick={handleSuggestionClick} handleKeyDown={handleKeyDown} />
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
                <span style={{ fontSize: '0.6rem', color: '#fff', fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase' }}>🌙 Nightly Stays</span>
              </div>
            </div>
            <div style={{ padding: '16px 18px 18px' }}>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 300, color: '#1a1209', lineHeight: 1.1, marginTop: 2 }}>{shortDisplay}</div>
              </div>
              <button onClick={() => handleSearch('short')}
                style={{ width: '100%', padding: '10px 0', borderRadius: 10, border: 'none', background: '#c2772b', color: '#fff', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#a8631f'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#c2772b'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                Explore
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
                <span style={{ fontSize: '0.6rem', color: '#f0c070', fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase' }}>🏠 Monthly Rental</span>
              </div>
            </div>
            <div style={{ padding: '16px 18px 18px' }}>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 300, color: '#1a1209', lineHeight: 1.1, marginTop: 2 }}>{longDisplay}</div>
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
      display: 'flex', alignItems: 'stretch',
      padding: '16px 20px', fontFamily: "'Poppins', sans-serif", boxSizing: 'border-box',
    }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* Main Card */}
        <div style={{
          background: '#fff', borderRadius: 22, boxShadow: '0 16px 56px rgba(0,0,0,0.15)',
          overflow: 'hidden', display: 'flex',
          height: 'clamp(480px, 55vh, 620px)',
          border: '1px solid rgba(194,119,43,0.12)',
        }}>

          {/* LEFT panel */}
          <div style={{
            flex: '0 0 38%', background: 'linear-gradient(160deg, #fdf7ee 0%, #f5ead6 100%)',
            padding: '28px 30px', display: 'flex', flexDirection: 'column',
            borderRight: '1px solid #f0e8da', overflow: 'visible',
          }}>
              <div style={{ display: 'inline-flex', alignSelf: 'flex-start', background: 'rgba(194,119,43,0.12)', border: '1px solid rgba(194,119,43,0.3)', borderRadius: 20, padding: '4px 14px', marginBottom: 14 }}>
                <span style={{ fontSize: '0.62rem', color: '#c2772b', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>✦ Smart Stay Platform</span>
              </div>
              <h1 style={{ color: '#1a1209', fontSize: 'clamp(1.3rem, 1.8vw, 1.75rem)', fontWeight: 600, lineHeight: 1.2, margin: '0 0 10px' }}>
                Find Smart Stays<br />
                <span style={{ color: '#c2772b' }}>Across NCR Cities</span>
              </h1>
              <p style={{ color: '#6b5540', fontSize: '0.84rem', fontWeight: 400, margin: '0 0 12px', lineHeight: 1.65 }}>
                Verified PGs, Apartments &amp; Premium Homes
              </p>

              {/* City chips */}
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 16 }}>
                {[
                  { label: 'Noida', city: 'Noida' },
                  { label: 'Greater Noida', city: 'Greater Noida' },
                  { label: 'Delhi', city: 'Delhi' },
                  { label: 'Gurugram', city: 'Gurugram' },
                ].map(c => (
                  <button key={c.label} onClick={(e) => { const p = new URLSearchParams(); p.set('city', c.city); navClick(e, `/properties?${p}`, navigate); }} onAuxClick={(e) => { const p = new URLSearchParams(); p.set('city', c.city); auxNavClick(e, `/properties?${p}`); }}
                    style={{ background: '#fff', border: '1.5px solid #e8c88a', borderRadius: 20, padding: '5px 15px', fontSize: '0.7rem', fontWeight: 600, color: '#7a5530', cursor: 'pointer', fontFamily: "'Poppins',sans-serif", whiteSpace: 'nowrap', outline: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fdf0e0'; e.currentTarget.style.borderColor = '#c2772b'; e.currentTarget.style.color = '#c2772b'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e8c88a'; e.currentTarget.style.color = '#7a5530'; }}>
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Search bar */}
              <SearchBar compact={false} searchText={searchText} setSearchText={setSearchText} showSuggestions={showSuggestions} setShowSuggestions={setShowSuggestions} searchRef={searchRef} filteredSuggestions={filteredSuggestions} handleSearch={handleSearch} handleNearMe={handleNearMe} locating={locating} handleSuggestionClick={handleSuggestionClick} handleKeyDown={handleKeyDown} />

              {/* Quick Nav Chips */}
              <div style={{ marginTop: 18 }}>
                <div style={{ fontSize: '0.58rem', color: '#b8a080', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>🔍 Popular Searches</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {QUICK_CHIPS.map(chip => (
                    <span key={chip.label}
                      onClick={(e) => { sessionStorage.setItem('ovika_rental_type', chip.rentalType); navClick(e, chip.path(), navigate); }}
                  onAuxClick={(e) => { sessionStorage.setItem('ovika_rental_type', chip.rentalType); auxNavClick(e, chip.path()); }}
                      style={{
                        fontSize: '0.68rem', color: '#6b5540', background: '#fff',
                        border: '1px solid #e8d8c0', borderRadius: 20, padding: '5px 12px',
                        fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fdf0e0'; e.currentTarget.style.borderColor = '#c2772b'; e.currentTarget.style.color = '#c2772b'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e8d8c0'; e.currentTarget.style.color = '#6b5540'; }}
                    >{chip.label}</span>
                  ))}
                </div>
              </div>

              {/* Feature strip */}
              <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #e8d8c0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                  {[
                    { icon: '✦', title: 'Fully Furnished', sub: 'Move in with zero hassle' },
                    { icon: '⚡', title: 'Instant Move-in', sub: 'Same day confirmation' },
                    { icon: '🛡', title: 'Zero Brokerage', sub: 'No hidden charges ever' },
                    { icon: '✔', title: 'Verified Properties', sub: '100% physically verified' },
                  ].map((f, i) => (
                    <div key={f.title} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 0',
                      borderRight: i % 2 === 0 ? '1px solid #e8d8c0' : 'none',
                      paddingRight: i % 2 === 0 ? 14 : 0,
                      paddingLeft: i % 2 === 1 ? 14 : 0,
                      borderBottom: i < 2 ? '1px solid #e8d8c0' : 'none',
                    }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(194,119,43,0.1)', border: '1px solid rgba(194,119,43,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.8rem' }}>{f.icon}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.66rem', fontWeight: 600, color: '#1a1209', lineHeight: 1.2 }}>{f.title}</div>
                        <div style={{ fontSize: '0.55rem', color: '#a08060', marginTop: 1 }}>{f.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          </div>

          {/* RIGHT panel — Flip layout: Nightly=image-top/content-bottom, Monthly=content-top/image-bottom */}
          <style>{`
            @keyframes kenBurns {
              0%   { transform: scale(1) translateX(0); }
              100% { transform: scale(1.06) translateX(-8px); }
            }
            @keyframes shimLine {
              0%   { transform: translateX(-100%); }
              100% { transform: translateX(220%); }
            }
            @keyframes fadeUp {
              from { opacity: 0; transform: translateY(10px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            .flip-card { flex: 1; display: flex; flex-direction: column; overflow: hidden; cursor: pointer; background: #fdf8f2; transition: box-shadow 0.3s; }
            .flip-card:hover { box-shadow: inset 0 0 0 2px rgba(194,119,43,0.18); }
            .flip-img { position: relative; flex: 0 0 52%; overflow: hidden; }
            .flip-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.8s ease; }
            .flip-card:hover .flip-img img { animation: kenBurns 5s ease forwards; }
            .flip-body { flex: 1; display: flex; flex-direction: column; justify-content: space-between; padding: 20px 24px 20px; animation: fadeUp 0.5s ease both; }
          `}</style>

          <div style={{ flex: 1, display: 'flex', minWidth: 0 }}>

            {/* ── NIGHTLY: Image TOP → Content BOTTOM ── */}
            <div className="flip-card" onClick={() => handleSearch('short')}
              style={{ borderRight: '1px solid #f0e8da' }}>

              {/* IMAGE — top */}
              <div className="flip-img">
                <img
                  src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=85&auto=format&fit=crop"
                  alt="Nightly Stay"
                  onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&q=80'; }}
                />
                {/* soft bottom fade into content bg */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to bottom, transparent, #fdf8f2)' }} />
                {/* Badge */}
                <div style={{ position: 'absolute', top: 14, left: 14 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(194,119,43,0.92)', borderRadius: 20, padding: '4px 12px', fontSize: '0.52rem', color: '#fff', fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>🌙 Nightly Stays</span>
                </div>
                {/* Top-right: small second image cut */}
                <div style={{ position: 'absolute', top: 12, right: 12, width: 58, height: 44, borderRadius: 10, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.7)', boxShadow: '0 4px 14px rgba(0,0,0,0.22)' }}>
                  <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=150&q=75&auto=format&fit=crop" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => { e.currentTarget.style.display = 'none'; }} />
                </div>
              </div>

              {/* CONTENT — bottom */}
              <div className="flip-body" style={{ background: '#fdf8f2' }}>
                {/* eyebrow */}
                <div>
                  <div style={{ fontSize: '0.5rem', color: '#b8966a', fontWeight: 600, letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 5 }}>Short Trips · Business · Weekend</div>
                  <div style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.2rem)', fontWeight: 600, color: '#1a1209', lineHeight: 1.25, marginBottom: 12 }}>
                    Stay the Night,<br />
                    <span style={{ color: '#c2772b' }}>Own the Morning</span>
                  </div>

                  {/* Price */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 4 }}>
                    <span style={{ fontSize: '0.54rem', color: '#a08060', fontWeight: 500, letterSpacing: 0.4 }}>STARTING</span>
                    <span style={{ fontSize: 'clamp(1.4rem, 1.9vw, 1.75rem)', fontWeight: 300, color: '#1a1209', lineHeight: 1, letterSpacing: -0.5 }}>{shortDisplay}</span>
                  </div>

                  {/* Shimmer bar */}
                  <div style={{ position: 'relative', height: 2, width: '60%', background: 'rgba(194,119,43,0.15)', borderRadius: 2, overflow: 'hidden', marginBottom: 12 }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, #c2772b, transparent)', animation: 'shimLine 2.2s ease-in-out infinite' }} />
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 0 }}>
                    {['AC Rooms', 'Wi-Fi', 'Same-day'].map(t => (
                      <span key={t} style={{ fontSize: '0.48rem', color: '#8a6840', fontWeight: 600, background: 'rgba(194,119,43,0.08)', border: '1px solid rgba(194,119,43,0.2)', borderRadius: 20, padding: '2px 8px' }}>✦ {t}</span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button onClick={e => { e.stopPropagation(); handleSearch('short'); }}
                  style={{ width: '100%', padding: '10px 0', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg, #c2772b, #a85e1f)', color: '#fff', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", boxShadow: '0 4px 16px rgba(194,119,43,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.22s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(194,119,43,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(194,119,43,0.35)'; }}>
                  Explore Nightly Stays →
                </button>
              </div>
            </div>

            {/* ── MONTHLY: Content TOP → Image BOTTOM ── */}
            <div className="flip-card" onClick={() => handleSearch('long')}>

              {/* CONTENT — top */}
              <div className="flip-body" style={{ flex: '0 0 48%', background: 'linear-gradient(160deg, #fdf5e8 0%, #faebd0 100%)', borderBottom: '1px solid #f0e0c0' }}>
                <div>
                  <div style={{ fontSize: '0.5rem', color: '#b8966a', fontWeight: 600, letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 5 }}>Professionals · Students · Long-term</div>
                  {/* Badge */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(26,18,9,0.07)', border: '1px solid rgba(194,119,43,0.25)', borderRadius: 20, padding: '4px 12px', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.52rem', color: '#7a5025', fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase' }}>🏠 Monthly Rental</span>
                  </div>
                  <div style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.2rem)', fontWeight: 600, color: '#1a1209', lineHeight: 1.25, marginBottom: 12 }}>
                    Your City,<br />
                    <span style={{ color: '#c2772b' }}>Your Home</span>
                  </div>

                  {/* Price */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 4 }}>
                    <span style={{ fontSize: '0.54rem', color: '#a08060', fontWeight: 500, letterSpacing: 0.4 }}>STARTING</span>
                    <span style={{ fontSize: 'clamp(1.4rem, 1.9vw, 1.75rem)', fontWeight: 300, color: '#1a1209', lineHeight: 1, letterSpacing: -0.5 }}>{longDisplay}</span>
                  </div>

                  {/* Shimmer bar */}
                  <div style={{ position: 'relative', height: 2, width: '60%', background: 'rgba(194,119,43,0.15)', borderRadius: 2, overflow: 'hidden', marginBottom: 12 }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, #c2772b, transparent)', animation: 'shimLine 2.6s ease-in-out infinite' }} />
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {['Furnished', 'Zero Brokerage', 'Flexible'].map(t => (
                      <span key={t} style={{ fontSize: '0.48rem', color: '#8a6840', fontWeight: 600, background: 'rgba(194,119,43,0.08)', border: '1px solid rgba(194,119,43,0.2)', borderRadius: 20, padding: '2px 8px' }}>✦ {t}</span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button onClick={e => { e.stopPropagation(); handleSearch('long'); }}
                  style={{ width: '100%', padding: '10px 0', borderRadius: 9, border: '1.5px solid #c2772b', background: 'transparent', color: '#c2772b', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.22s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#c2772b'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#c2772b'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  Explore Monthly Stays →
                </button>
              </div>

              {/* IMAGE — bottom */}
              <div className="flip-img" style={{ flex: 1 }}>
                <img
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=700&q=85&auto=format&fit=crop"
                  alt="Monthly Rental"
                  onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&q=80'; }}
                />
                {/* soft top fade into content bg */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to top, transparent, #faebd0)' }} />
                {/* Bottom-right: small second image cut */}
                <div style={{ position: 'absolute', bottom: 12, right: 12, width: 58, height: 44, borderRadius: 10, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.7)', boxShadow: '0 4px 14px rgba(0,0,0,0.22)' }}>
                  <img src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=150&q=75&auto=format&fit=crop" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => { e.currentTarget.style.display = 'none'; }} />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
