import React, { useState, useEffect } from 'react';
import './Navbar.css';

function Navbar() {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setExpanded(true);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { name: 'Dashboard', icon: '🏠' },
    { name: 'Properties', icon: '🏢' },
    { name: 'Leads', icon: '📋' },
    { name: 'Reports', icon: '📊' },
    { name: 'Settings', icon: '⚙️' },
  ];

  return (
    <>
      <div className="top-bar">
        {isMobile && (
          <div 
            className="mobile-menu-toggle"
            onClick={() => setExpanded(!expanded)}
          >
            ☰
          </div>
        )}
        <img src="/ovika.png" alt="Ovika Logo" className="top-logo" />
        <button className="signup-btn">Sign Up</button>
      </div>

      <div className={`sidebar ${expanded ? 'expanded' : ''}`}>
        {!isMobile && (
          <div className="toggle-btn" onClick={() => setExpanded(!expanded)}>
            &#8942;
          </div>
        )}

        <div className="nav-items">
          {navItems.map((item, index) => (
            <div className="nav-item" key={index}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="content"></div>
    </>
  );
}

export default Navbar;
