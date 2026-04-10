import React, { useState, useRef, useEffect } from 'react';
import './FloatingSearch.css';
import { useNavigate } from 'react-router';

function FloatingSearch({ onSelect }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSelect = (type) => {
    if (onSelect) onSelect(type);
    setOpen(false);
  };
  const navigate = useNavigate();
  
  return (
    <div className="tm-fab-container">
      <button
        ref={btnRef}
        className={`tm-fab ${open ? 'tm-fab-open' : ''}`}
        aria-label="Search types"
        onClick={() => setOpen((v) => !v)}
      >
        {/* Simple search icon (SVG) */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <div ref={menuRef} className={`tm-fab-menu ${open ? 'show' : ''}`}>
        <button className="tm-fab-item" onClick={() => handleSelect('PG')}>PG</button>
        <button className="tm-fab-item" onClick={() => handleSelect('Coliving')}>Coliving</button>
        <button className="tm-fab-item" onClick={() => {handleSelect('Luxury Apartment')
            navigate('/tmluxe')
        }}>Luxury Apartment</button>
      </div>
    </div>
  );
}

export default FloatingSearch;
