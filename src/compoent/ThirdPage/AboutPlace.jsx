import React from "react";
import "./AboutPlace.css";
import { useNavigate } from "react-router";

export default function AboutPlace({ description, address, area, keyFeatures = [] }) {
  const navigate = useNavigate();
  return (
    <div className="aboutplace-container">
      <h2 className="aboutplace-heading">About the place</h2>
      <div className="aboutplace-underline"></div>

      <div className="aboutplace-content">
          <h3 className="aboutplace-subtitle">Property overview</h3>
        <p className="aboutplace-text">
          {description || 'Details will be available soon.'}
        </p>
        <div className="content_left">
      
         <div>
        <h3 className="aboutplace-subtitle">Highlights</h3>
        <ul className="aboutplace-list">
          {Array.isArray(keyFeatures) && keyFeatures.length > 0 ? (
            keyFeatures.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))
          ) : (
            <li>No key features listed.</li>
          )}
        </ul>

        <h3 className="aboutplace-subtitle">Location &amp; Area</h3>
        <ul className="aboutplace-list">
          <li>{address || 'Address not available'}</li>
          {area ? <li>Area: {area}</li> : null}
        </ul>
        </div>
        {/* <button className="aboutplace-button" onClick={()=>{
          navigate('/payment')
        }}>Book Now</button> */}
        </div>
      </div>
    </div>
  );
}
