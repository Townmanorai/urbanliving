import React from 'react';
import './LuxeBanner.css';
import { FaHotel } from 'react-icons/fa6';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaBellConcierge } from 'react-icons/fa6';

function LuxeBanner() {
    return (
        <>
            {/* Hero Section */}
            <div className="tmxluxe-hero">
                <div className="tmxluxe-container">
                    <div className="tmxluxe-hero-content">
                        <div className="tmxluxe-logo-row">
                            <span className="tmxluxe-logo-mark">TM</span>
                            <span className="tmxluxe-logo-text">Luxe</span>
                        </div>
                        <h1 className="tmxluxe-heading">
                            Where sophistication meets ultimate <span className="tmxluxe-accent">comfort</span>
                        </h1>
                    <div id ='tmxluxe-subtext_1'>
                  
                    </div>
                    
                    </div>
                    <div id='cta_button'>
                    <p class="tmxluxe-subtext">
  TM Luxe offers premium stays designed for travelers seeking elegance, privacy, and personalized service. Every space blends modern luxury with warm hospitality,<br></br>
  ensuring an unforgettable experience from check-in to check-out.</p>
                    <a href="#" className="tmxluxe-cta">Book your Luxury stay</a>
                    </div>
                    <h2 className="tmxluxe-section-title">Why choose TM Luxe?</h2>
                </div>
            </div>

            {/* Why Choose Section */}
            <div className="tmxluxe-why-choose">
                <div className="tmxluxe-container">
                
                    <div className="tmxluxe-features">
                        <div className="tmxluxe-feature">
                            <div className="tmxluxe-feature-icon">
                                <FaHotel />
                            </div>
                            <h3>Sophisticated Interiors</h3>
                            <p>Carefully curated spaces that blend modern design with ultimate comfort.</p>
                        </div>
                        <div className="tmxluxe-feature">
                            <div className="tmxluxe-feature-icon">
                                <FaMapMarkerAlt />
                            </div>
                            <h3>Prime Location</h3>
                            <p>Strategically located in the heart of the city's most vibrant districts.</p>
                        </div>
                        <div className="tmxluxe-feature">
                            <div className="tmxluxe-feature-icon">
                                <FaBellConcierge />
                            </div>
                            <h3>Exceptional Services</h3>
                            <p>24/7 personalized service to anticipate and fulfill your every need.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LuxeBanner