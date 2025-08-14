import React from "react";
import "./HoomieFooter.css";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa6";

const HoomieFooter = () => {
  return (
    <footer className="hoomie-footer-container">
      <div className="hoomie-footer-main">
        <div className="hoomie-footer-col hoomie-footer-brand">
          <div className="hoomie-footer-logo">
            <img 
              src="/logo.png" 
              alt="TownManor Logo" 
              className="hoomie-logo-image"
            />
          </div>
        </div>
        <div className="hoomie-footer-col">
          <div className="hoomie-footer-heading">COMPANY</div>
          <ul>
            <li>About</li>
            <li>Features</li>
            <li>TMLuxe</li>
            <li>Place</li>
          </ul>
        </div>
        <div className="hoomie-footer-col">
          <div className="hoomie-footer-heading">HELP</div>
          <ul>
            <li>Customer Support</li>
            <li>Delivery Details</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="hoomie-footer-col">
          <div className="hoomie-footer-heading">RESOURCES</div>
          <ul>
            <li>Food</li>
            <li>Travel</li>
            <li>near by</li>
          </ul>
        </div>
        <div className="hoomie-footer-col hoomie-footer-connect">
          <div className="hoomie-footer-heading">CONNECT WITH US</div>
          <form className="hoomie-footer-form">
            <input type="email" placeholder="Enter email address" className="hoomie-footer-input" />
            <button type="submit" className="hoomie-footer-join-btn">Join</button>
          </form>
          <div className="hoomie-footer-contact-row">
            <div>
              <div className="hoomie-footer-contact-label">CALL US</div>
              <div className="hoomie-footer-contact-bold">(+91) 68707 68329</div>
            </div>
            <div>
              <div className="hoomie-footer-contact-label">EMAIL US</div>
              <div className="hoomie-footer-contact-bold">support@TownManor.in</div>
            </div>
          </div>
        </div>
      </div>
      <div className="hoomie-footer-bottom">
        <div className="hoomie-footer-copyright">
          2025 TownManor. All Rights Reserved
        </div>
        <div className="hoomie-footer-socials">
          <a href="#" aria-label="Twitter" className="hoomie-footer-social-icon"><FaLinkedin /></a>
          <a href="#" aria-label="Facebook" className="hoomie-footer-social-icon"><FaFacebook /></a>
          <a href="#" aria-label="Instagram" className="hoomie-footer-social-icon"><FaInstagram /></a>
        </div>
      </div>
    </footer>
  );
};

export default HoomieFooter;
