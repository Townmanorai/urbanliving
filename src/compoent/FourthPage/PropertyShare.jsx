
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PropertyShare.css';

function FourthMain() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/list-pg');
  };

  return (
    <div className="property-share-container">
      <div className="property-share-overlay">
        <div className="property-share-content">
          <p className="property-share-title">
            Your property, Your control - rent,<br /> 
            manage and earn effortlessly
          </p>

          <p className="property-share-text">
            Take full control of your rental listing. With Ovika, you can easily find qualified tenants, 
            manage inquiries, and publish your property in minutes.
          </p>

          <div className="property-share-btn-group">
            <button 
              className="property-share-btn property-share-btn-white"
              onClick={handleNavigate}
            >
              Get Started
              <span className="property-share-arrow">→</span>
            </button>
            
            <button 
              className="property-share-btn property-share-btn-orange"
              onClick={handleNavigate}
            >
              Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FourthMain;