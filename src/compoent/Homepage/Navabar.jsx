import React, { useState, useEffect } from 'react';
import { MdTravelExplore, MdMenu, MdClose, MdPerson } from 'react-icons/md';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore', icon: <MdTravelExplore /> },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <header className={`navbar-desktop ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-logo">
            <img 
              src="/logo.png" 
              alt="TownManor Logo" 
              className="navbar-logo-image"
            />
          </div>
          
          <nav className="navbar-links">
            {navLinks.map((link) => (
              <a 
                key={link.id}
                href={`#${link.id}`}
                className={`nav-link ${activeLink === link.id ? 'active' : ''}`}
                onClick={() => setActiveLink(link.id)}
              >
                {link.icon && <span className="nav-icon">{link.icon}</span>}
                {link.label}
                <span className="nav-underline"></span>
              </a>
            ))}
          </nav>
          
          <div className="navbar-actions">
            <button className="search-btn">
              <FaSearch />
            </button>
            <button className="auth-btn">
              <FaUserCircle className="user-icon" />
              <span>Sign In</span>
            </button>
            <button className="list-property-btn">
              List Your Property
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navbar */}
      <header className="navbar-mobile">
        <div className="mobile-navbar-container">
          <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <MdClose /> : <MdMenu />}
          </button>
          <div className="mobile-logo">Townmanor</div>
          <button className="mobile-search">
            <FaSearch />
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            {navLinks.map((link) => (
              <a 
                key={`mobile-${link.id}`}
                href={`#${link.id}`}
                className={`mobile-nav-link ${activeLink === link.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveLink(link.id);
                  setIsMenuOpen(false);
                }}
              >
                {link.icon && <span className="nav-icon">{link.icon}</span>}
                {link.label}
              </a>
            ))}
            <button className="mobile-auth-btn">
              <FaUserCircle className="user-icon" />
              <span>Sign In / Register</span>
            </button>
            <button className="mobile-list-btn">
              List Your Property
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;