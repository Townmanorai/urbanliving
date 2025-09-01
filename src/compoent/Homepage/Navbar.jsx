import React, { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [showMenu, setShowMenu] = useState(false);

  const navItems = [
    'Dashboard',
    'Properties',
    'Leads',
    'Reports',
    'Settings'
  ];

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="navbar">
      <div className="navbar-content">
        <button 
          className={`menu-toggle ${showMenu ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        
        <img src="/ovika.png" alt="Ovika Logo" className="logo" />
        
        <button className="signup-btn">Sign Up</button>
      </div>

      <div className={`dropdown-menu ${showMenu ? 'show' : ''}`}>
        {navItems.map((item, index) => (
          <div key={index} className="menu-item" onClick={() => setShowMenu(false)}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Navbar;
