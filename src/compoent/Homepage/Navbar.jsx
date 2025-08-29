import React, { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [expanded, setExpanded] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: '🏠' },
    { name: 'Properties', icon: '🏢' },
    { name: 'Leads', icon: '📋' },
    { name: 'Reports', icon: '📊' },
    { name: 'Settings', icon: '⚙️' },
  ];

  return (
    <>
      {/* Top Bar with Logo + Sign Up (only once) */}
      <div className="top-bar">
        <img src="/ovika.png" alt="Ovika Logo" className="top-logo" />
        <button className="signup-btn">Sign Up</button>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${expanded ? 'expanded' : ''}`}>
        <div className="toggle-btn" onClick={() => setExpanded(!expanded)}>
          &#8942;
        </div>

        {navItems.map((item, index) => (
          <div className="nav-item" key={index}>
            <span className="nav-icon">{item.icon}</span>
            {expanded && <span className="nav-text">{item.name}</span>}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="content"></div>
    </>
  );
}

export default Navbar;
