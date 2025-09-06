import React, { useEffect, useRef, useState } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router';

function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

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
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.username) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
    }
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  const handleLogout = () => {
    // Remove user from localStorage and state
    localStorage.removeItem('user');
    setUser(null);
    setUserMenuOpen(false);
    // Optionally navigate to login or home
    navigate('/login');
  };

  const goToDashboard = () => {
    setUserMenuOpen(false);
    navigate('/dashboard');
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
        {
          user ? (
            <div className="user-menu" ref={userMenuRef}>
              <button
                className="user-button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
              >
                <span className="user-avatar">{user.username?.[0]?.toUpperCase() || 'U'}</span>
                <span className="user-name">{user.username}</span>
                <span className={`chevron ${userMenuOpen ? 'up' : 'downx'}`}>▾</span>
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-item" onClick={goToDashboard}>Dashboard</div>
                  <div className="user-dropdown-item logout" onClick={handleLogout}>Logout</div>
                </div>
              )}
            </div>
          ) : (
            <button className="signup-btn" onClick={() => navigate('/login')}>Sign Up</button>
          )
        }
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
