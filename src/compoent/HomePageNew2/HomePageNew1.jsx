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
        borderRadius: compact ? 14 : 50,
        boxShadow: '0 4px 18px rgba(194,119,43,0.13), 0 1px 6px rgba(0,0,0,0.05)',
        border: '1.5px solid #d4b896',
        display: 'flex',
        alignItems: 'stretch',
        minHeight: compact ? 48 : 50,
        overflow: 'hidden',
      }}>
        <input
          type="text"
          value={searchText}
          onChange={e => { setSearchText(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Search city, locality, PG, flat..."}
          style={{
            flex: 1, border: 'none', outline: 'none',
            boxShadow: 'none', WebkitAppearance: 'none', appearance: 'none',
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
            flexShrink: 0, padding: compact ? '0 16px' : '0 20px', border: 'none',
            background: 'linear-gradient(135deg, #c2772b 0%, #a85e1f 100%)',
            color: '#fff', fontSize: compact ? '0.8rem' : '0.82rem',
            fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            margin: '5px 5px 5px 0', borderRadius: compact ? 10 : 40,
            boxShadow: '0 3px 12px rgba(194,119,43,0.38)',
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

const CITIES = ['Noida', 'Gurugram', 'Delhi', 'Ghaziabad', 'Faridabad', 'Greater Noida'];

const NCR_LOCALITIES = {
  Noida: [
    'Sector 1','Sector 2','Sector 3','Sector 4','Sector 5','Sector 6','Sector 7','Sector 8','Sector 9','Sector 10',
    'Sector 11','Sector 12','Sector 14','Sector 15','Sector 15A','Sector 16','Sector 17','Sector 18','Sector 19','Sector 20',
    'Sector 21','Sector 22','Sector 23','Sector 24','Sector 25','Sector 26','Sector 27','Sector 28','Sector 29','Sector 30',
    'Sector 31','Sector 32','Sector 33','Sector 34','Sector 35','Sector 36','Sector 37','Sector 38','Sector 39','Sector 40',
    'Sector 41','Sector 42','Sector 43','Sector 44','Sector 45','Sector 46','Sector 47','Sector 48','Sector 49','Sector 50',
    'Sector 51','Sector 52','Sector 53','Sector 54','Sector 55','Sector 56','Sector 57','Sector 58','Sector 59','Sector 60',
    'Sector 61','Sector 62','Sector 63','Sector 64','Sector 65','Sector 66','Sector 67','Sector 68','Sector 69','Sector 70',
    'Sector 71','Sector 72','Sector 73','Sector 74','Sector 75','Sector 76','Sector 77','Sector 78','Sector 79','Sector 80',
    'Sector 100','Sector 101','Sector 104','Sector 108','Sector 110','Sector 117','Sector 118','Sector 119','Sector 120',
    'Sector 121','Sector 122','Sector 125','Sector 126','Sector 127','Sector 128','Sector 129','Sector 130','Sector 131',
    'Sector 132','Sector 133','Sector 134','Sector 135','Sector 136','Sector 137','Sector 138','Sector 140','Sector 142',
    'Sector 143','Sector 143B','Sector 144','Sector 145','Sector 146','Sector 147','Sector 148','Sector 149','Sector 150',
    'Sector 151','Sector 152','Sector 153','Sector 154','Sector 155','Sector 156','Sector 157','Sector 158','Sector 159',
    'Golf Course Road','Atta Market','City Centre','Expressway','Noida Extension','Film City',
    'Botanical Garden','Indirapuram','Vaishali','Kaushambi','Mamura','Bhangel','Barola','Nithari',
    'Sector 168','Sector 167','Sector 166','Sector 165','Sector 164','Sector 163','Sector 162',
  ],
  Gurugram: [
    'Sector 1','Sector 2','Sector 4','Sector 5','Sector 7','Sector 9','Sector 10','Sector 11','Sector 12','Sector 13',
    'Sector 14','Sector 15','Sector 17','Sector 18','Sector 21','Sector 22','Sector 23','Sector 27','Sector 28',
    'Sector 29','Sector 31','Sector 37','Sector 39','Sector 40','Sector 42','Sector 43','Sector 44','Sector 45',
    'Sector 46','Sector 47','Sector 48','Sector 49','Sector 50','Sector 51','Sector 52','Sector 53','Sector 54',
    'Sector 55','Sector 56','Sector 57','Sector 58','Sector 59','Sector 62','Sector 63','Sector 65','Sector 66',
    'Sector 67','Sector 67A','Sector 68','Sector 69','Sector 70','Sector 71','Sector 72','Sector 82','Sector 83',
    'Sector 84','Sector 85','Sector 86','Sector 88','Sector 89','Sector 90','Sector 91','Sector 92','Sector 93',
    'DLF Phase 1','DLF Phase 2','DLF Phase 3','DLF Phase 4','DLF Phase 5',
    'Golf Course Road','Golf Course Extension','MG Road','Sohna Road','NH-48','Old Delhi Road',
    'Cyber City','Cyber Hub','Udyog Vihar','Palam Vihar','South City 1','South City 2',
    'Nirvana Country','Malibu Towne','Heritage City','Unitech Cyber Park','Manesar',
    'Vatika City','Ardee City','Emaar Palm Hills','Signature Global','Mahavir Chowk',
  ],
  Delhi: [
    'Connaught Place','Hauz Khas','Saket','Greater Kailash 1','Greater Kailash 2',
    'Defence Colony','Lajpat Nagar','Karol Bagh','Paharganj','Aerocity',
    'Dwarka Sector 1','Dwarka Sector 2','Dwarka Sector 3','Dwarka Sector 4','Dwarka Sector 5',
    'Dwarka Sector 6','Dwarka Sector 7','Dwarka Sector 8','Dwarka Sector 10','Dwarka Sector 11',
    'Dwarka Sector 12','Dwarka Sector 13','Dwarka Sector 14','Dwarka Sector 18','Dwarka Sector 21',
    'Rohini Sector 1','Rohini Sector 2','Rohini Sector 3','Rohini Sector 4','Rohini Sector 5',
    'Rohini Sector 6','Rohini Sector 7','Rohini Sector 8','Rohini Sector 9','Rohini Sector 11',
    'Janakpuri','Vikaspuri','Uttam Nagar','Tilak Nagar','Rajouri Garden',
    'Vasant Kunj','Vasant Vihar','Mehrauli','Malviya Nagar','Munirka',
    'South Extension 1','South Extension 2','Andrews Ganj','Kalkaji','Govindpuri',
    'Laxmi Nagar','Preet Vihar','Mayur Vihar Phase 1','Mayur Vihar Phase 2','Mayur Vihar Phase 3',
    'Shahdara','Patparganj','IP Extension','Geeta Colony','Seelampur',
    'Pitampura','Shalimar Bagh','Ashok Vihar','Model Town','Civil Lines',
    'Kamla Nagar','Vijay Nagar','Hudson Line','GTB Nagar','Mukherjee Nagar',
    'Chandni Chowk','Daryaganj','Sadar Bazar','Katwaria Sarai','Safdarjung',
  ],
  Ghaziabad: [
    'Indirapuram','Vaishali Sector 1','Vaishali Sector 2','Vaishali Sector 3','Vaishali Sector 4',
    'Vaishali Sector 5','Vaishali Sector 6','Kaushambi','Raj Nagar Extension','Crossings Republik',
    'Sector 1 Vaishali','Sector 2 Vaishali','Ahinsa Khand 1','Ahinsa Khand 2',
    'Nyay Khand 1','Nyay Khand 2','Niti Khand 1','Niti Khand 2','Niti Khand 3',
    'Shakti Khand 1','Shakti Khand 2','Shakti Khand 3','Shakti Khand 4',
    'NH-58','Lohia Nagar','Raj Nagar','Vasundhara','Govindpuram','Siddharth Vihar',
    'Shastri Nagar','Gandhi Nagar','Vijay Nagar','Sahibabad','Modi Nagar',
  ],
  Faridabad: [
    'Sector 1','Sector 2','Sector 3','Sector 4','Sector 5','Sector 6','Sector 7','Sector 8','Sector 9','Sector 10',
    'Sector 11','Sector 12','Sector 14','Sector 15','Sector 16','Sector 16A','Sector 17','Sector 19','Sector 20',
    'Sector 21','Sector 21C','Sector 22','Sector 23','Sector 24','Sector 25','Sector 26','Sector 27','Sector 28',
    'Sector 29','Sector 30','Sector 31','Sector 37','Sector 46','Sector 55','Sector 56','Sector 58',
    'Sector 65','Sector 66','Sector 67','Sector 78','Sector 79','Sector 82','Sector 83','Sector 84','Sector 85',
    'Sector 86','Sector 87','Sector 88','Sector 89','Sector 90','Sector 91',
    'NIT','Old Faridabad','Surajkund','Ballabhgarh','NHPC Colony','Pali','Tilpat',
  ],
  'Greater Noida': [
    'Knowledge Park 1','Knowledge Park 2','Knowledge Park 3','Knowledge Park 4','Knowledge Park 5',
    'Techzone 1','Techzone 2','Techzone 3','Techzone 4',
    'Alpha 1','Alpha 2','Beta 1','Beta 2','Gamma 1','Gamma 2',
    'Delta 1','Delta 2','Delta 3','Omega','Pari Chowk',
    'Sector 1','Sector 2','Sector 3','Sector 4','Sector 10','Sector 12',
    'Sector 27','Sector 36','Sector 37','Sector 39','Sector 41',
    'Kasna','Surajpur','Bisrakh','Dadri','Ecotech 1','Ecotech 2','Ecotech 3',
    'Jaypee Greens','Gaur City','Gaur City 2','Supertech Eco Village','Amrapali Dream Valley',
    'Migsun Wynwood','Mahagun Moderne','ACE City','Eldeco Station 1',
  ],
};

const CITY_TRENDING = {
  Noida: {
    signature: ['Sector 150', 'Golf Course Rd', 'Sector 137', 'Sector 18', 'Sector 76'],
    hotels:    ['Sector 18', 'Sector 62', 'City Centre', 'Sector 135'],
    homestay:  ['Sector 50', 'Sector 44', 'Sector 62', 'Sector 137'],
    pg:        ['Sector 62', 'Sector 63', 'Knowledge Park', 'Sector 18'],
    apt:       ['Sector 75', 'Sector 137', 'Noida Extension', 'Sector 150'],
  },
  Gurugram: {
    signature: ['Golf Course Rd', 'DLF Phase 5', 'Sector 54', 'Sohna Rd'],
    hotels:    ['MG Road', 'Cyber City', 'Sector 29', 'DLF Phase 1'],
    homestay:  ['Sector 56', 'DLF Phase 4', 'South City', 'Palam Vihar'],
    pg:        ['Cyber City', 'Sohna Road', 'Sector 14', 'Udyog Vihar'],
    apt:       ['Golf Course Rd', 'DLF Phase 2', 'Sector 67', 'Vatika City'],
  },
  Delhi: {
    signature: ['Hauz Khas', 'Defence Colony', 'Vasant Kunj', 'Connaught Place'],
    hotels:    ['Connaught Place', 'Karol Bagh', 'Paharganj', 'Aerocity'],
    homestay:  ['Saket', 'Greater Kailash', 'Lajpat Nagar', 'Dwarka'],
    pg:        ['Laxmi Nagar', 'Dwarka', 'Uttam Nagar', 'Vikaspuri'],
    apt:       ['Vasant Kunj', 'Dwarka', 'Rohini', 'Janakpuri'],
  },
  Ghaziabad: {
    signature: ['Indirapuram', 'Vaishali', 'Raj Nagar Ext', 'Crossings Republik'],
    hotels:    ['Indirapuram', 'Vaishali', 'Kaushambi', 'NH-58'],
    homestay:  ['Indirapuram', 'Vaishali', 'Raj Nagar', 'Crossings Republik'],
    pg:        ['Indirapuram', 'Vaishali', 'Kaushambi', 'Raj Nagar Ext'],
    apt:       ['Indirapuram', 'Raj Nagar Ext', 'Crossings Republik', 'Vaishali'],
  },
  Faridabad: {
    signature: ['Sector 15', 'NIT', 'Sector 21C', 'Surajkund'],
    hotels:    ['Surajkund', 'NIT', 'Sector 28', 'Old Faridabad'],
    homestay:  ['Sector 16A', 'NIT', 'Sector 15', 'Surajkund'],
    pg:        ['NIT', 'Sector 15', 'Sector 16', 'Ballabhgarh'],
    apt:       ['Sector 15', 'Sector 21', 'Surajkund', 'Sector 88'],
  },
  'Greater Noida': {
    signature: ['Knowledge Park', 'Techzone', 'Omega', 'Pari Chowk'],
    hotels:    ['Pari Chowk', 'Knowledge Park', 'Techzone IV', 'Omega'],
    homestay:  ['Knowledge Park', 'Techzone', 'Alpha 1', 'Pari Chowk'],
    pg:        ['Knowledge Park II', 'Techzone IV', 'Omega', 'Delta 1'],
    apt:       ['Techzone IV', 'Omega', 'Alpha 1', 'Knowledge Park'],
  },
};

/* ── Professional SVG icons for each category ── */
const CAT_ICONS = {
  signature: (active) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={active?'#c98429':'none'} stroke={active?'#c98429':'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  hotels: (active) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active?'#c98429':'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  homestay: (active) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active?'#c98429':'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  ),
  pg: (active) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active?'#c98429':'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  apt: (active) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active?'#c98429':'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="7" x2="9" y2="7.01"/><line x1="15" y1="7" x2="15" y2="7.01"/><line x1="9" y1="12" x2="9" y2="12.01"/><line x1="15" y1="12" x2="15" y2="12.01"/><line x1="9" y1="17" x2="9" y2="17.01"/><line x1="15" y1="17" x2="15" y2="17.01"/>
    </svg>
  ),
};

const CATEGORIES = [
  {
    id: 'signature', label: 'Signature Stays', shortLabel: 'Signature',
    heading: 'Signature stays in', sub: '120+ handpicked premium homes · personally verified',
    placeholder: 'Search by locality or property name...',
    param: 'Signature Stays', rentalType: 'short', searchType: 'text',
    bg: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'hotels', label: 'Hotels', shortLabel: 'Hotels',
    heading: 'Hotels in', sub: 'Best hotels with premium amenities · verified listings',
    placeholder: 'Search hotels by locality or name...',
    param: 'Hotel Stays', rentalType: 'short', searchType: 'hotel',
    bg: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'homestay', label: 'Homestays & BnB', shortLabel: 'Homestays',
    heading: 'Homestays & BnB in', sub: 'Unique stays with warm local hosts · no brokerage',
    placeholder: 'Search homestays by locality or name...',
    param: 'Homestays & BnB', rentalType: 'short', searchType: 'hotel',
    bg: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'pg', label: 'PG & Co-Living', shortLabel: 'PG',
    heading: 'PG & Co-Living in', sub: '500+ verified PGs with no brokerage · meals included',
    placeholder: 'Search PG by locality...',
    param: 'PG & Co-Living', rentalType: 'long', searchType: 'pg',
    bg: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'apt', label: 'Apartments & Villas', shortLabel: 'Apartments',
    heading: 'Apartments & Villas in', sub: 'Premium furnished apartments for every budget · zero brokerage',
    placeholder: 'Search apartments by locality or name...',
    param: 'Apartments & Villas', rentalType: 'short', searchType: 'text',
    bg: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80',
  },
];

export default function HomePageNew1() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [bp, setBp] = useState(getBreakpoint());
  const [shortRate, setShortRate] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedCity, setSelectedCity] = useState('Noida');
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [pgType, setPgType] = useState('');
  const [mobileSuggestPos, setMobileSuggestPos] = useState(null);
  const [showMobCityDrop, setShowMobCityDrop] = useState(false);
  const [showOverlayCityPick, setShowOverlayCityPick] = useState(false);
  const mobCityRef = useRef(null);
  const [showMobSearch, setShowMobSearch] = useState(false);
  const [mobSearchAnim, setMobSearchAnim] = useState(false);
  const mobOverlayInputRef = useRef(null);

  const openMobSearch = () => {
    setShowMobSearch(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setMobSearchAnim(true);
        setTimeout(() => mobOverlayInputRef.current?.focus(), 320);
      });
    });
  };
  const closeMobSearch = () => {
    setMobSearchAnim(false);
    setTimeout(() => { setShowMobSearch(false); setSearchText(''); setShowSuggestions(false); }, 300);
  };
  const [liveResults, setLiveResults] = useState([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [phIndex, setPhIndex] = useState(0);

  const PLACEHOLDERS = {
    signature: ['🏨 Try "Sector 62 Noida"', '✨ "Premium stays near Metro"', '🌙 "Nightly stay in Noida"', '🏠 "Furnished room Sector 18"'],
    hotels:    ['🏩 Try "Hotel near City Center"', '⭐ "Budget hotel Sector 18"', '🛎️ "AC rooms in Gurugram"', '📍 "Hotels near Expo Mart"'],
    homestay:  ['🏡 Try "Homestay in Noida"', '☕ "BnB near Noida Expressway"', '🌿 "Cozy homestay Sector 50"', '🛋️ "Private room Greater Noida"'],
    pg:        ['🏠 Try "PG in Sector 62"', '👦 "Boys PG near Metro"', '👧 "Girls PG with food"', '🤝 "Co-living Noida Extension"'],
    apt:       ['🏢 Try "1BHK in Sector 137"', '🛋️ "Furnished flat Noida"', '🔑 "Studio apartment Gurugram"', '🏙️ "2BHK near Expressway"'],
  };
  const nominatimTimer = useRef(null);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const dropRef = useRef(null);
  const cityDropRef = useRef(null);

  useEffect(() => {
    const onResize = () => setBp(getBreakpoint());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const handler = e => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)) { setShowSuggestions(false); setMobileSuggestPos(null); }
      if (cityDropRef.current && !cityDropRef.current.contains(e.target)) setShowCityDrop(false);
      if (mobCityRef.current && !mobCityRef.current.contains(e.target)) setShowMobCityDrop(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('touchstart', handler); };
  }, []);

  /* ── Placeholder cycling every 2s ── */
  useEffect(() => {
    setPhIndex(0);
    const t = setInterval(() => setPhIndex(p => {
      const cat = CATEGORIES[activeCategory];
      const list = PLACEHOLDERS[cat?.id] || [];
      return (p + 1) % list.length;
    }), 2000);
    return () => clearInterval(t);
  }, [activeCategory]);

  /* ── Local NCR locality search ── */
  useEffect(() => {
    if (nominatimTimer.current) clearTimeout(nominatimTimer.current);
    const q = searchText.trim();
    if (q.length < 2) { setLiveResults([]); return; }
    nominatimTimer.current = setTimeout(() => {
      const cityLocalities = NCR_LOCALITIES[selectedCity] || [];
      const lower = q.toLowerCase();
      const matches = cityLocalities
        .filter(loc => loc.toLowerCase().includes(lower))
        .slice(0, 6)
        .map(loc => ({ label: loc, sublabel: selectedCity }));
      setLiveResults(matches);
    }, 120);
    return () => clearTimeout(nominatimTimer.current);
  }, [searchText, selectedCity]);

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
  const cat = CATEGORIES[activeCategory];
  const cityTrending = (CITY_TRENDING[selectedCity] || {})[cat.id] || [];

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
    { label: 'Hotel Stays',     rentalType: 'short', path: () => { const p = new URLSearchParams(); p.set('category', 'Hotel Stays');     p.set('rentalType', 'short'); return `/properties?${p}`; } },
    { label: 'Homestays & BnB',    rentalType: 'short', path: () => { const p = new URLSearchParams(); p.set('category', 'Homestays & BnB');    p.set('rentalType', 'short'); return `/properties?${p}`; } },
    { label: 'Apartments & Villas', rentalType: 'short', path: () => { const p = new URLSearchParams(); p.set('category', 'Apartments & Villas'); p.set('rentalType', 'short'); return `/properties?${p}`; } },
    { label: 'PG & Co-Living',      rentalType: 'long',  path: () => { const p = new URLSearchParams(); p.set('category', 'PG & Co-Living');      p.set('rentalType', 'long');  return `/properties?${p}`; } },
  ];

  const shortDisplay = ratesLoading ? '—' : (shortRate ? `${fmt(shortRate)}/night` : '₹2,499/night');
  const longDisplay = '₹4,999/month';

  /* ════════ MOBILE (≤768px) ════════ */
  if (bp === 'mobile') {
    const MOB_SHORT = { signature:'Signature', hotels:'Hotels', homestay:'Homestay', pg:'PG', apt:'Apts' };
    const CITIES_MOB = ['Noida', 'Gr. Noida', 'Gurugram', 'Delhi', 'Faridabad', 'Ghaziabad'];
    return (
      <div style={{ fontFamily:"'Poppins',sans-serif", boxSizing:'border-box', display:'flex', flexDirection:'column', position:'relative' }}>

        <style>{`
          @keyframes bouncePin{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
          @keyframes mobFadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
          .mob-tab-btn{transition:color 0.2s,border-color 0.2s}
          .mob-tab-btn:active{opacity:0.75}
          .mob-city-btn:active{transform:scale(0.96)}
          .mob-srch-inp::placeholder{color:#aab0bc}
          *{-webkit-tap-highlight-color:transparent}
        `}</style>

        {/* ── Background crossfade — fixed height ── */}
        {CATEGORIES.map((c, i) => (
          <div key={c.id} style={{ position:'absolute', top:0, left:0, right:0, height:270, backgroundImage:`url(${c.bg})`, backgroundSize:'cover', backgroundPosition:'center top', opacity:i===activeCategory?1:0, transition:'opacity 0.7s ease', zIndex:0 }} />
        ))}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:270, background:'linear-gradient(175deg, rgba(12,16,28,0.5) 0%, rgba(12,16,28,0.7) 55%, rgba(12,16,28,0.98) 100%)', zIndex:1, pointerEvents:'none' }} />

        {/* Locating overlay */}
        {locating && (
          <div style={{ position:'fixed', inset:0, background:'rgba(10,4,0,0.92)', backdropFilter:'blur(8px)', zIndex:10000, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
            <MapPin size={48} color="#f5a623" style={{ animation:'bouncePin 0.85s infinite ease-in-out' }} />
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'1rem', fontWeight:700, color:'#fff' }}>Finding Your Location</div>
              <div style={{ fontSize:'0.75rem', color:'#f5a623', marginTop:4 }}>Searching properties near you…</div>
            </div>
          </div>
        )}

        {/* ── Hero area ── */}
        <div style={{ position:'relative', zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'36px 20px 14px', animation:'mobFadeUp 0.5s ease both' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:'rgba(201,132,41,0.82)', borderRadius:100, padding:'4px 14px', marginBottom:8 }}>
            <span style={{ fontSize:'10px', color:'#fff', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase' }}>✦ Smart Stay Platform</span>
          </div>
          <h1 style={{ color:'#fff', fontSize:'clamp(1.3rem,5.5vw,1.7rem)', fontWeight:800, lineHeight:1.2, margin:'0 0 4px', letterSpacing:-0.3, textShadow:'0 2px 16px rgba(0,0,0,0.5)', whiteSpace:'nowrap' }}>
            Properties in <span style={{ color:'#f5a623' }}>{selectedCity}</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.62)', fontSize:'0.78rem', margin:0, lineHeight:1.6 }}>500+ verified stays · No brokerage</p>
        </div>

        {/* ── Search Card (Housing.com style) ── */}
        <div style={{ position:'relative', zIndex:2, margin:'0 0 0', background:'#fff', borderRadius:'24px 24px 0 0', boxShadow:'0 -8px 40px rgba(0,0,0,0.3)', animation:'mobFadeUp 0.6s 0.1s ease both', animationFillMode:'both' }}>

          {/* Category tabs — ALL 5 equal width, no scroll */}
          <div style={{ display:'flex', borderBottom:'1px solid #f0f0f0' }}>
            {CATEGORIES.map((c, i) => (
              <button key={c.id} className="mob-tab-btn"
                onClick={() => { setActiveCategory(i); setSearchText(''); }}
                style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, padding:'12px 2px 10px', border:'none', background:'#fff', borderBottom:`2.5px solid ${i===activeCategory?'#c98429':'transparent'}`, color:i===activeCategory?'#c98429':'#374151', fontSize:'10px', fontWeight:i===activeCategory?700:600, cursor:'pointer', fontFamily:"'Poppins',sans-serif", outline:'none', lineHeight:1.2 }}>
                <span style={{ fontSize:'16px', lineHeight:1 }}>{CAT_ICONS[c.id]?.(i===activeCategory)}</span>
                {MOB_SHORT[c.id]}
              </button>
            ))}
          </div>

          {/* Search body */}
          <div style={{ padding:'16px 16px 24px' }}>

            {/* Combined city + search input row */}
            <div style={{ position:'relative', display:'flex', alignItems:'center', background:'#f5f7fa', borderRadius:14, marginBottom:12, overflow:'visible' }}>

              {/* City selector — left side */}
              <div ref={mobCityRef} style={{ position:'relative', flexShrink:0 }}>
                <div onClick={() => setShowMobCityDrop(v => !v)}
                  style={{ display:'flex', alignItems:'center', gap:4, padding:'10px 8px 10px 12px', cursor:'pointer', userSelect:'none' }}>
                  <MapPin size={12} color="#c98429" style={{ flexShrink:0 }} />
                  <div>
                    <div style={{ fontSize:'8.5px', fontWeight:600, color:'#6b7280', letterSpacing:'0.05em', lineHeight:1 }}>CITY</div>
                    <div style={{ fontSize:'13px', fontWeight:600, color:'#111827', lineHeight:1.3, whiteSpace:'nowrap' }}>{selectedCity}</div>
                  </div>
                  <span style={{ fontSize:'9px', color:'#6b7280', display:'inline-block', transform:showMobCityDrop?'rotate(180deg)':'rotate(0deg)', transition:'transform 0.2s' }}>▾</span>
                </div>

                {/* City dropdown */}
                {showMobCityDrop && (
                  <div style={{ position:'absolute', top:'calc(100% + 8px)', left:0, minWidth:180, background:'#fff', borderRadius:14, boxShadow:'0 8px 28px rgba(0,0,0,0.18)', border:'1px solid #e5e7eb', zIndex:99999, overflow:'hidden' }}>
                    {CITIES_MOB.map(city => (
                      <div key={city}
                        onClick={() => { setSelectedCity(city); setShowMobCityDrop(false); }}
                        style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', cursor:'pointer', background:city===selectedCity?'#fef9f2':'#fff', borderBottom:'1px solid #f3f4f6' }}
                        onTouchStart={e=>e.currentTarget.style.background='#fef3e0'}
                        onTouchEnd={e=>e.currentTarget.style.background=city===selectedCity?'#fef9f2':'#fff'}>
                        <MapPin size={13} color={city===selectedCity?'#c98429':'#9ca3af'} />
                        <span style={{ fontSize:'13px', fontWeight:city===selectedCity?700:500, color:city===selectedCity?'#c98429':'#374151', flex:1 }}>{city}</span>
                        {city===selectedCity && <span style={{ color:'#c98429', fontSize:'14px', fontWeight:700 }}>✓</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Search trigger — tap opens overlay */}
              <div style={{ flex:1, display:'flex', alignItems:'center', gap:7, padding:'10px 10px', borderLeft:'1px solid #eaecf0' }}
                onClick={openMobSearch}>
                <Search size={13} color="#6b7280" style={{ flexShrink:0 }} />
                <span style={{ fontSize:'12.5px', fontWeight:400, color:'#9ca3af', fontFamily:"'Poppins',sans-serif", userSelect:'none', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {PLACEHOLDERS[cat.id]?.[phIndex] ?? cat.placeholder}
                </span>
              </div>
            </div>{/* close combined row */}

            {/* PG toggle */}
            {cat.searchType === 'pg' && (
              <div style={{ display:'flex', gap:7, marginBottom:12 }}>
                {['Boys','Girls','Co-Living'].map(g => (
                  <button key={g} onClick={() => setPgType(pgType===g?'':g)}
                    style={{ flex:1, padding:'8px 4px', borderRadius:10, border:`1.5px solid ${pgType===g?'#c98429':'#d1d5db'}`, background:pgType===g?'#fef3e0':'#fff', color:pgType===g?'#c98429':'#1f2937', fontSize:'12px', fontWeight:pgType===g?700:600, cursor:'pointer', fontFamily:"'Poppins',sans-serif", outline:'none' }}>
                    {g==='Boys'?'👦 ':g==='Girls'?'👧 ':'🤝 '}{g}
                  </button>
                ))}
              </div>
            )}

            {/* Nightly/Long Stay toggle */}
            {cat.id === 'signature' && (
              <div style={{ display:'flex', gap:7, marginBottom:12 }}>
                {['Nightly','Long Stay'].map(m => (
                  <button key={m} onClick={() => setPgType(pgType===m?'':m)}
                    style={{ flex:1, padding:'8px 4px', borderRadius:10, border:`1.5px solid ${pgType===m?'#c98429':'#d1d5db'}`, background:pgType===m?'#fef3e0':'#fff', color:pgType===m?'#c98429':'#1f2937', fontSize:'12px', fontWeight:pgType===m?700:600, cursor:'pointer', fontFamily:"'Poppins',sans-serif", outline:'none' }}>
                    {m==='Nightly'?'🌙 ':'📅 '}{m}
                  </button>
                ))}
              </div>
            )}

            {/* Search button */}
            <button onClick={() => handleSearch(cat.rentalType)}
              style={{ width:'100%', padding:'14px', borderRadius:12, background:'#22c55e', border:'none', color:'#fff', fontSize:'15px', fontWeight:700, cursor:'pointer', fontFamily:"'Poppins',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 4px 16px rgba(34,197,94,0.35)', letterSpacing:0.2 }}>
              <Search size={17} />
              Search
            </button>

            {/* Trending */}
            <div style={{ display:'flex', alignItems:'center', gap:7, marginTop:14, overflowX:'auto', scrollbarWidth:'none' }}>
              <span style={{ fontSize:'11px', color:'#374151', fontWeight:700, flexShrink:0 }}>🔥 Trending</span>
              {cityTrending.map(t => (
                <button key={t} onClick={() => { setSearchText(t); handleSearch(cat.rentalType); }}
                  style={{ padding:'4px 12px', borderRadius:100, background:'#f5f7fa', border:'1px solid #d1d5db', color:'#111827', fontSize:'11.5px', fontWeight:500, cursor:'pointer', flexShrink:0, fontFamily:"'Poppins',sans-serif", outline:'none', whiteSpace:'nowrap' }}>
                  {t}
                </button>
              ))}
            </div>

            {/* Owner CTA */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:5, marginTop:14, paddingTop:12, borderTop:'1px solid #f3f4f6' }}>
              <span style={{ fontSize:'12px', color:'#9ca3af' }}>✦ Are you an owner?</span>
              <a href="/list-property" style={{ fontSize:'12px', fontWeight:700, color:'#c98429', textDecoration:'none' }}>Post property for free ›</a>
            </div>

          </div>
        </div>

        {/* ── Search Overlay (slide-up) ── */}
        {showMobSearch && (
          <div style={{ position:'fixed', inset:0, zIndex:100000, background:'#fff', transform:mobSearchAnim?'translateY(0)':'translateY(100%)', transition:'transform 0.32s cubic-bezier(0.32,0,0.15,1)', display:'flex', flexDirection:'column', fontFamily:"'Poppins',sans-serif" }}>

            {/* Top bar */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px 10px', borderBottom:'1px solid #f0f0f0' }}>
              <button onClick={closeMobSearch} style={{ display:'flex', alignItems:'center', gap:6, border:'none', background:'none', cursor:'pointer', padding:0, color:'#374151' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </button>
              <span style={{ fontSize:'14px', fontWeight:600, color:'#1e293b' }}>Searching in <span style={{ color:'#c98429' }}>{selectedCity}</span></span>
              <button onClick={() => setShowOverlayCityPick(v => !v)} style={{ border:'none', background:'none', cursor:'pointer', fontSize:'13px', color:'#c98429', fontWeight:600, fontFamily:"'Poppins',sans-serif", padding:0 }}>
                Change city ›
              </button>
            </div>

            {/* City picker — inline dropdown inside overlay */}
            {showOverlayCityPick && (
              <div style={{ background:'#fff', borderBottom:'1px solid #f0f0f0' }}>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8, padding:'12px 16px' }}>
                  {['Noida','Gr. Noida','Gurugram','Delhi','Faridabad','Ghaziabad'].map(city => (
                    <button key={city}
                      onClick={() => { setSelectedCity(city); setShowOverlayCityPick(false); }}
                      style={{ padding:'7px 16px', borderRadius:100, border:`1.5px solid ${city===selectedCity?'#c98429':'#e5e7eb'}`, background:city===selectedCity?'#fef3e0':'#f9fafb', color:city===selectedCity?'#c98429':'#374151', fontSize:'13px', fontWeight:city===selectedCity?700:500, cursor:'pointer', fontFamily:"'Poppins',sans-serif", outline:'none' }}>
                      {city===selectedCity && '📍 '}{city}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Category tabs */}
            <div style={{ display:'flex', borderBottom:'1px solid #f0f0f0', background:'#fff' }}>
              {CATEGORIES.map((c,i) => (
                <button key={c.id} onClick={() => { setActiveCategory(i); setSearchText(''); }}
                  style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2, padding:'10px 2px 8px', border:'none', background:'#fff', borderBottom:`2.5px solid ${i===activeCategory?'#c98429':'transparent'}`, color:i===activeCategory?'#c98429':'#9ca3af', fontSize:'9.5px', fontWeight:i===activeCategory?700:500, cursor:'pointer', fontFamily:"'Poppins',sans-serif", outline:'none' }}>
                  <span style={{ fontSize:'15px' }}>{CAT_ICONS[c.id]?.(i===activeCategory)}</span>
                  {MOB_SHORT[c.id]}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div style={{ display:'flex', alignItems:'center', gap:10, margin:'14px 16px 0', background:'#f5f7fa', borderRadius:14, padding:'12px 14px', border:'1.5px solid #e8eaed' }}>
              <Search size={16} color="#c98429" style={{ flexShrink:0 }} />
              <input ref={mobOverlayInputRef} type="text" value={searchText}
                onChange={e => { setSearchText(e.target.value); setShowSuggestions(true); }}
                onKeyDown={e => { if(e.key==='Enter' && searchText.trim()) { closeMobSearch(); setTimeout(()=>handleSearch(cat.rentalType),320); } }}
                placeholder={cat.placeholder}
                style={{ flex:1, border:'none', outline:'none', fontSize:'14px', color:'#1e293b', background:'transparent', fontFamily:"'Poppins',sans-serif" }} />
              {searchText && <button onClick={() => setSearchText('')} style={{ border:'none', background:'none', color:'#9ca3af', fontSize:20, cursor:'pointer', padding:0, lineHeight:1 }}>×</button>}
            </div>

            {/* Suggestions list */}
            {showSuggestions && filteredSuggestions.length > 0 ? (
              <div style={{ flex:1, overflowY:'auto', marginTop:8 }}>
                {filteredSuggestions.map((s, i) => (
                  <div key={i} onClick={() => { handleSuggestionClick(s); closeMobSearch(); }}
                    style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 20px', borderBottom:'1px solid #f5f5f5', cursor:'pointer' }}
                    onTouchStart={e=>e.currentTarget.style.background='#fdf7ee'}
                    onTouchEnd={e=>e.currentTarget.style.background='#fff'}>
                    <div style={{ width:36, height:36, borderRadius:10, background:'#fef3e0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', flexShrink:0 }}>{typeIcon[s.type]}</div>
                    <div>
                      <div style={{ fontSize:'13px', fontWeight:600, color:'#1a1209' }}>{s.label}</div>
                      <div style={{ fontSize:'11px', color:'#9ca3af', marginTop:1 }}>{s.type} · {selectedCity}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ flex:1, overflowY:'auto' }}>
                {/* Use my location */}
                <div onClick={() => { closeMobSearch(); }} style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 20px', borderBottom:'1px solid #f0f0f0', cursor:'pointer' }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:'rgba(201,132,41,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <MapPin size={16} color="#c98429" />
                  </div>
                  <span style={{ fontSize:'13px', fontWeight:600, color:'#c98429' }}>Use my current location</span>
                  <svg style={{ marginLeft:'auto' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c98429" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>

                {/* Hotspots */}
                <div style={{ padding:'16px 16px 8px' }}>
                  <div style={{ fontSize:'13px', fontWeight:700, color:'#374151', marginBottom:12 }}>🔥 Hotspots in {selectedCity}</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    {cityTrending.map(t => (
                      <div key={t} onClick={() => { setSearchText(t); closeMobSearch(); setTimeout(()=>handleSearch(cat.rentalType),320); }}
                        style={{ background:'#f9fafb', borderRadius:12, padding:'12px 14px', border:'1px solid #f0f0f0', cursor:'pointer' }}
                        onTouchStart={e=>e.currentTarget.style.background='#fef9f2'}
                        onTouchEnd={e=>e.currentTarget.style.background='#f9fafb'}>
                        <div style={{ fontSize:'13px', fontWeight:600, color:'#1e293b' }}>{t}</div>
                        <div style={{ fontSize:'11px', color:'#9ca3af', marginTop:3 }}>{selectedCity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Search button */}
            <div style={{ padding:'12px 16px', borderTop:'1px solid #f0f0f0', background:'#fff' }}>
              <button onClick={() => { closeMobSearch(); setTimeout(()=>handleSearch(cat.rentalType),320); }}
                style={{ width:'100%', padding:'14px', borderRadius:12, background:'#22c55e', border:'none', color:'#fff', fontSize:'15px', fontWeight:700, cursor:'pointer', fontFamily:"'Poppins',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 4px 16px rgba(34,197,94,0.3)' }}>
                <Search size={17} />
                Search
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }


  /* ════════ TABLET (641–1024px) ════════ */
  if (bp === 'tablet') {
    return (
      <div style={{ background: 'linear-gradient(160deg,#f5efe4,#ede4cf)', fontFamily: "'Poppins',sans-serif", boxSizing: 'border-box', padding: '0 0 32px' }}>

        {/* Hero */}
        <div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
          <img src="/newhome1mobile.png" alt="OvikaLiving — Find Smart Stays, Verified PGs & Apartments Across NCR Cities"
            onError={e => { e.currentTarget.src = '/home1desktop.jpeg'; }}
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
              <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=700&q=85" alt="Nightly Stay"
                onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=700&q=80'; }}
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
              <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=700&q=85" alt="Monthly Rental"
                onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=700&q=80'; }}
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


  /* ════════ TABLET ════════ */
  if (bp === 'tablet') {
    return (
      <div style={{ fontFamily:"'Poppins',sans-serif", boxSizing:'border-box', padding:'28px 24px 40px', position:'relative', overflow:'hidden' }}>
        {/* Static background image */}
        <div style={{ position:'absolute', inset:0, backgroundImage:`url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80)`, backgroundSize:'cover', backgroundPosition:'center', zIndex:0 }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.55) 100%)', zIndex:1, pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:-60, right:-60, width:350, height:350, background:'radial-gradient(circle, rgba(194,119,43,0.18) 0%, transparent 70%)', pointerEvents:'none', zIndex:1 }} />
        <div style={{ position:'relative', zIndex:2 }}>
          {/* Tabs */}
          <div style={{ display:'flex', gap:6, overflowX:'auto', scrollbarWidth:'none', marginBottom:24, paddingBottom:2 }}>
            {CATEGORIES.map((c, i) => (
              <button key={c.id} onClick={() => { setActiveCategory(i); setSearchText(''); }}
                style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', borderRadius:100, border:`1.5px solid ${i===activeCategory?'#fff':'rgba(255,255,255,0.22)'}`, background:i===activeCategory?'#fff':'rgba(255,255,255,0.08)', color:i===activeCategory?'#2a0f05':'rgba(255,255,255,0.78)', fontSize:'12px', fontWeight:i===activeCategory?600:500, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, fontFamily:"'Poppins',sans-serif", outline:'none' }}>
                {CAT_ICONS[c.id]?.(i === activeCategory)}<span>{c.label}</span>
              </button>
            ))}
          </div>
          <h1 style={{ color:'#fff', fontSize:'1.9rem', fontWeight:700, margin:'0 0 8px', letterSpacing:-0.3, lineHeight:1.15 }}>
            {cat.heading} <span style={{ color:'#f5a623' }}>Noida</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.84rem', margin:'0 0 20px' }}>{cat.sub}</p>
          <SearchBar compact={false} placeholder={cat.placeholder}
            searchText={searchText} setSearchText={setSearchText}
            showSuggestions={showSuggestions} setShowSuggestions={setShowSuggestions}
            searchRef={searchRef} filteredSuggestions={filteredSuggestions}
            handleSearch={() => handleSearch(cat.rentalType)} handleNearMe={handleNearMe}
            locating={locating} handleSuggestionClick={handleSuggestionClick}
            handleKeyDown={handleKeyDown} />
          <div style={{ display:'flex', alignItems:'center', gap:7, marginTop:14, flexWrap:'wrap' }}>
            <span style={{ fontSize:'12px', fontWeight:700, color:'rgba(255,255,255,0.6)' }}>Trending</span>
            {cityTrending.map(t => (
              <button key={t} onClick={() => { setSearchText(t); handleSearch(cat.rentalType); }}
                style={{ padding:'5px 13px', borderRadius:100, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.22)', color:'rgba(255,255,255,0.88)', fontSize:'12px', cursor:'pointer', fontFamily:"'Poppins',sans-serif", outline:'none' }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ════════ DESKTOP (>1024px) ════════ */
  return (
    <div style={{
      position: 'relative', overflow: 'visible',
      padding: '0 24px 56px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
      minHeight: 560,
      fontFamily: "'Poppins', sans-serif",
      boxSizing: 'border-box',
    }}>
      <style>{`@keyframes hpFadeImg{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:scale(1)}}`}</style>

      {/* Background images — crossfade per category */}
      {CATEGORIES.map((c, i) => (
        <div key={c.id} style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${c.bg})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: i === activeCategory ? 1 : 0,
          transition: 'opacity 0.6s ease',
          animation: i === activeCategory ? 'hpFadeImg 0.7s ease' : 'none',
          zIndex: 0,
        }} />
      ))}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.58) 100%)', zIndex:1, pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:-100, right:-100, width:600, height:600, background:'radial-gradient(circle, rgba(194,119,43,0.15) 0%, transparent 70%)', pointerEvents:'none', zIndex:1 }} />


      {/* ── Main content ── */}
      <div style={{ textAlign:'center', zIndex:2, width:'100%', maxWidth:860, position:'relative' }}>

        <h1 style={{ fontSize:'clamp(1.9rem, 2.8vw, 2.6rem)', fontWeight:700, color:'#fff', margin:'0 0 8px', letterSpacing:-0.5, lineHeight:1.18 }}>
          {cat.heading} <span style={{ color:'#f5a623' }}>{selectedCity}</span>
        </h1>
        <p style={{ color:'rgba(255,255,255,0.68)', fontSize:'0.92rem', margin:'0 0 20px', lineHeight:1.5 }}>
          {cat.sub}
        </p>

        {/* ── UNIFIED CARD: Tabs + Search Bar ── */}
        <div style={{ marginBottom:22, borderRadius:16, overflow:'visible', boxShadow:'0 10px 40px rgba(0,0,0,0.35)' }}>

          {/* Dark Tabs Header */}
          <div style={{ display:'flex', background:'#1a2332', borderRadius:'16px 16px 0 0', overflow:'hidden' }}>
            {CATEGORIES.map((c, i) => (
              <button key={c.id}
                onClick={() => { setActiveCategory(i); setSearchText(''); setShowSuggestions(false); setPgType(''); }}
                style={{
                  flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                  padding:'13px 6px',
                  background:'transparent', border:'none',
                  borderBottom: i===activeCategory ? '3px solid #f5a623' : '3px solid transparent',
                  color: i===activeCategory ? '#fff' : 'rgba(255,255,255,0.52)',
                  fontSize:'clamp(11px,0.85vw,13px)', fontWeight: i===activeCategory ? 700 : 500,
                  cursor:'pointer', whiteSpace:'nowrap', fontFamily:"'Poppins',sans-serif",
                  transition:'color 0.15s, background 0.15s', outline:'none',
                }}
                onMouseEnter={e=>{ if(i!==activeCategory){ e.currentTarget.style.color='rgba(255,255,255,0.88)'; e.currentTarget.style.background='rgba(255,255,255,0.06)'; } }}
                onMouseLeave={e=>{ if(i!==activeCategory){ e.currentTarget.style.color='rgba(255,255,255,0.52)'; e.currentTarget.style.background='transparent'; } }}>
                {CAT_ICONS[c.id]?.(i === activeCategory)}
                <span>{c.label}</span>
              </button>
            ))}
          </div>

          {/* White Search Row */}
          <div ref={searchRef} style={{ display:'flex', alignItems:'center', background:'#fff', borderRadius:'0 0 16px 16px', padding:'10px 10px 10px 20px', position:'relative' }}>

            {/* City Dropdown */}
            <div ref={cityDropRef} style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0, cursor:'pointer', paddingRight:4, position:'relative', userSelect:'none' }}
              onClick={() => setShowCityDrop(v => !v)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c98429" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
                <span style={{ fontSize:10, fontWeight:700, color:'#9ca3af', letterSpacing:'0.06em', lineHeight:1 }}>CITY</span>
                <span style={{ fontSize:14, fontWeight:600, color:'#1e293b', lineHeight:1 }}>{selectedCity}</span>
              </div>
              <span style={{ fontSize:10, color:'#6b7280' }}>▾</span>
              {showCityDrop && cityDropRef.current && (() => {
                const r = cityDropRef.current.getBoundingClientRect();
                return (
                  <div style={{ position:'fixed', top: r.bottom + 8, left: r.left, background:'#fff', borderRadius:12, boxShadow:'0 8px 28px rgba(0,0,0,0.18)', border:'1px solid #e5e7eb', minWidth:180, zIndex:99999 }}
                    onClick={e=>e.stopPropagation()}>
                    {CITIES.map(city => (
                      <div key={city}
                        onClick={() => { setSelectedCity(city); setShowCityDrop(false); }}
                        style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', fontSize:'13px', fontWeight:city===selectedCity?700:500, color:city===selectedCity?'#c98429':'#374151', background:city===selectedCity?'#fef9f2':'transparent', cursor:'pointer' }}
                        onMouseEnter={e=>e.currentTarget.style.background='#fef9f2'}
                        onMouseLeave={e=>e.currentTarget.style.background=city===selectedCity?'#fef9f2':'transparent'}>
                        {city}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Separator */}
            <div style={{ width:1, height:28, background:'#e5e7eb', flexShrink:0, margin:'0 14px' }} />

            {/* Search Input */}
            <input type="text" value={searchText}
              onChange={e=>{ setSearchText(e.target.value); setShowSuggestions(true); }}
              onFocus={()=>setShowSuggestions(true)}
              onKeyDown={e=>{ if(e.key==='Enter') handleSearch(cat.rentalType); }}
              placeholder={PLACEHOLDERS[cat.id]?.[phIndex] ?? cat.placeholder}
              style={{ flex:1, border:'none', outline:'none', fontSize:'14px', color:'#374151', background:'transparent', fontFamily:"'Poppins',sans-serif", minWidth:0 }} />

            {/* PG toggle: Boys / Girls / Co-Living */}
            {cat.searchType === 'pg' && (
              <>
                <div style={{ width:1, height:28, background:'#e5e7eb', flexShrink:0, margin:'0 14px' }} />
                <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                  {['Boys', 'Girls', 'Co-Living'].map(type => (
                    <label key={type} style={{ display:'flex', alignItems:'center', gap:5, cursor:'pointer', userSelect:'none' }}>
                      <span style={{ width:15, height:15, borderRadius:'50%', border:`2px solid ${pgType===type?'#7c3aed':'#d1d5db'}`, background:pgType===type?'#7c3aed':'#fff', display:'inline-block', flexShrink:0, position:'relative', transition:'all 0.15s', boxShadow:pgType===type?'0 0 0 3px rgba(124,58,237,0.15)':'none' }}
                        onClick={()=>setPgType(t=>t===type?'':type)}>
                        {pgType===type && <span style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:5, height:5, borderRadius:'50%', background:'#fff', display:'block' }}/>}
                      </span>
                      <span style={{ fontSize:13, fontWeight:500, color:'#374151', whiteSpace:'nowrap' }}>{type}</span>
                    </label>
                  ))}
                </div>
              </>
            )}

            {/* Signature toggle: Nightly / Long Stay */}
            {cat.id === 'signature' && (
              <>
                <div style={{ width:1, height:28, background:'#e5e7eb', flexShrink:0, margin:'0 14px' }} />
                <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                  {['Nightly', 'Long Stay'].map(opt => (
                    <label key={opt} style={{ display:'flex', alignItems:'center', gap:5, cursor:'pointer', userSelect:'none' }}>
                      <span style={{ width:15, height:15, borderRadius:'50%', border:`2px solid ${checkIn===opt?'#7c3aed':'#d1d5db'}`, background:checkIn===opt?'#7c3aed':'#fff', display:'inline-block', flexShrink:0, position:'relative', transition:'all 0.15s', boxShadow:checkIn===opt?'0 0 0 3px rgba(124,58,237,0.15)':'none' }}
                        onClick={()=>setCheckIn(v=>v===opt?'':opt)}>
                        {checkIn===opt && <span style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:5, height:5, borderRadius:'50%', background:'#fff', display:'block' }}/>}
                      </span>
                      <span style={{ fontSize:13, fontWeight:500, color:'#374151', whiteSpace:'nowrap' }}>{opt}</span>
                    </label>
                  ))}
                </div>
              </>
            )}

            {/* Green Search Button */}
            <button onClick={()=>handleSearch(cat.rentalType)}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'0 22px', height:46, borderRadius:10, background:'#22c55e', border:'none', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', flexShrink:0, marginLeft:12, transition:'background 0.18s, transform 0.12s', fontFamily:"'Poppins',sans-serif" }}
              onMouseEnter={e=>{ e.currentTarget.style.background='#16a34a'; e.currentTarget.style.transform='scale(1.03)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.background='#22c55e'; e.currentTarget.style.transform='scale(1)'; }}>
              <Search size={16}/><span>Search</span>
            </button>

            {/* Suggestions dropdown */}
            {showSuggestions && (liveResults.length > 0 || filteredSuggestions.length > 0) && (
              <div style={{ position:'absolute', top:'calc(100% + 8px)', left:0, right:0, background:'#fff', borderRadius:16, boxShadow:'0 12px 44px rgba(0,0,0,0.18)', border:'1.5px solid #f0e8da', zIndex:99999, overflow:'hidden', textAlign:'left' }}>
                {liveResults.length > 0 && (
                  <>
                    <div style={{ padding:'8px 16px 4px', fontSize:'10px', color:'#c98429', fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>📍 Locations</div>
                    {liveResults.map((r, idx) => (
                      <div key={idx} onClick={() => { setSearchText(r.label); setShowSuggestions(false); handleSearch(cat.rentalType); }}
                        style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 16px', cursor:'pointer', borderBottom:'1px solid #f8f0e4', transition:'background 0.12s' }}
                        onMouseEnter={e=>e.currentTarget.style.background='#fdf7ee'}
                        onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        <div style={{ width:32, height:32, borderRadius:10, background:'#fdf3e3', border:'1px solid #f0ddb8', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c98429" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:'13.5px', fontWeight:600, color:'#1a1209' }}>{r.label}</div>
                          {r.sublabel && <div style={{ fontSize:'11px', color:'#9ca3af', marginTop:1 }}>{r.sublabel}</div>}
                        </div>
                        <span style={{ fontSize:'10px', color:'#c2772b', background:'rgba(194,119,43,0.1)', padding:'2px 8px', borderRadius:10, fontWeight:600, flexShrink:0 }}>Area</span>
                      </div>
                    ))}
                  </>
                )}
                {filteredSuggestions.length > 0 && liveResults.length === 0 && (
                  <>
                    <div style={{ padding:'8px 16px 4px', fontSize:'10px', color:'#b8a080', fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>{searchText.trim()===''?'Popular Searches':'Suggestions'}</div>
                    {filteredSuggestions.map((s, idx) => (
                      <div key={idx} onClick={() => handleSuggestionClick(s)}
                        style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 16px', cursor:'pointer', borderBottom:idx<filteredSuggestions.length-1?'1px solid #f8f0e4':'none', transition:'background 0.12s' }}
                        onMouseEnter={e=>e.currentTarget.style.background='#fdf7ee'}
                        onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        <div style={{ width:32, height:32, borderRadius:10, background:'rgba(194,119,43,0.08)', border:'1px solid rgba(194,119,43,0.18)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', flexShrink:0 }}>
                          {typeIcon[s.type]}
                        </div>
                        <div style={{ flex:1, fontSize:'13.5px', fontWeight:600, color:'#1a1209' }}>{s.label}</div>
                        <span style={{ fontSize:'10px', color:'#c2772b', background:'rgba(194,119,43,0.1)', padding:'2px 8px', borderRadius:10, fontWeight:600, flexShrink:0 }}>{s.type}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>


        {/* ── Trending chips — city specific ── */}
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
          <span style={{ fontSize:'13px', fontWeight:700, color:'rgba(255,255,255,0.65)' }}>Trending</span>
          {cityTrending.map(t => (
            <button key={t}
              onClick={() => { setSearchText(t); handleSearch(cat.rentalType); }}
              style={{ padding:'6px 15px', borderRadius:100, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.22)', color:'rgba(255,255,255,0.88)', fontSize:'13px', cursor:'pointer', fontFamily:"'Poppins',sans-serif", transition:'background 0.15s', outline:'none' }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.2)'}
              onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
              {t}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
