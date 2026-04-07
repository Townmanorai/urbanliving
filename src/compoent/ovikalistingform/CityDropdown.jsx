import React, { useState, useRef, useEffect } from 'react';
import './CityDropdown.css';

const INDIAN_CITIES = [
  "Agra", "Ahmedabad", "Aizawl", "Ajmer", "Aligarh", "Allahabad", "Ambala",
  "Amravati", "Amritsar", "Asansol", "Aurangabad", "Bareilly", "Belgaum",
  "Bengaluru", "Bhopal", "Bhubaneswar", "Bikaner", "Borivali", "Chandigarh",
  "Chennai", "Coimbatore", "Cuttack", "Dehradun", "Delhi", "Dhanbad",
  "Durgapur", "Erode", "Faridabad", "Gandhinagar", "Ghaziabad", "Gorakhpur",
  "Greater Noida", "Guntur", "Gurugram", "Guwahati", "Gwalior", "Howrah", "Hubli", "Hyderabad",
  "Imphal", "Indore", "Itanagar", "Jabalpur", "Jaipur", "Jalandhar", "Jammu",
  "Jamnagar", "Jamshedpur", "Jodhpur", "Kalyan", "Kanpur", "Kochi",
  "Kohima", "Kolhapur", "Kolkata", "Kozhikode", "Lucknow", "Ludhiana",
  "Madurai", "Mangaluru", "Meerut", "Mumbai", "Mysuru", "Nagpur", "Nashik",
  "Navi Mumbai", "Nellore", "Noida", "Panaji", "Patna", "Pimpri-Chinchwad",
  "Puducherry", "Pune", "Raipur", "Rajkot", "Ranchi", "Rourkela",
  "Salem", "Shillong", "Shimla", "Siliguri", "Solapur", "Srinagar",
  "Surat", "Thane", "Thiruvananthapuram", "Tiruchirappalli", "Tiruppur",
  "Udaipur", "Vadodara", "Varanasi", "Vijayawada", "Visakhapatnam",
  "Warangal", "Yamunanagar"
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli",
  "Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export function addressContainsCityOrState(address) {
  const lower = address.toLowerCase().trim();
  const allTerms = [...INDIAN_CITIES, ...INDIAN_STATES];
  return allTerms.find(term => {
    const t = term.toLowerCase();
    const regex = new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
    return regex.test(lower);
  }) || null;
}

export { INDIAN_CITIES };

export default function CityDropdown({ value, onChange, className, hasError, placeholder }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  const searchRef = useRef(null);

  const filtered = INDIAN_CITIES.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  const select = (city) => {
    onChange({ target: { name: 'city', value: city } });
    setOpen(false);
    setSearch('');
  };

  return (
    <div className={`city-dd-wrap${hasError ? ' city-dd-wrap--error' : ''}`} ref={ref}>
      <div
        className={`city-dd-trigger ${className || ''}`}
        onClick={() => setOpen(o => !o)}
      >
        <span className={value ? 'city-dd-value' : 'city-dd-placeholder'}>
          {value || placeholder || 'Select City'}
        </span>
        <svg className={`city-dd-arrow${open ? ' city-dd-arrow--open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      {open && (
        <div className="city-dd-menu">
          <div className="city-dd-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" style={{flexShrink:0}}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              ref={searchRef}
              className="city-dd-search"
              placeholder="Search city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
            />
          </div>
          <ul className="city-dd-list">
            {filtered.length === 0 && (
              <li className="city-dd-empty">No city found</li>
            )}
            {filtered.map(city => (
              <li
                key={city}
                className={`city-dd-item${value === city ? ' city-dd-item--active' : ''}`}
                onMouseDown={() => select(city)}
              >
                {city}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
