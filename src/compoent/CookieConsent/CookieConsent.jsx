import React, { useState, useEffect } from 'react';
import './CookieConsent.css';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showComponent, setShowComponent] = useState(false);

    useEffect(() => {
        // Check if user has already given consent
        const consent = localStorage.getItem('urbanliving-cookie-consent');
        if (!consent) {
            setShowComponent(true);
            // Slight delay for the animation to feel smoother
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('urbanliving-cookie-consent', 'true');
        setIsVisible(false);
        // Remove from DOM after transition
        setTimeout(() => setShowComponent(false), 600);
    };

    const handleDecline = () => {
        localStorage.setItem('urbanliving-cookie-consent', 'false');
        setIsVisible(false);
        // Remove from DOM after transition
        setTimeout(() => setShowComponent(false), 600);
    };

    if (!showComponent) return null;

    return (
        <div className={`cookie-consent-overlay ${isVisible ? 'show' : ''}`}>
            <div className="cookie-container">
                <div className="cookie-content">
                    <h3 className="cookie-title">Cookies & Privacy</h3>
                    <p className="cookie-description">
                        This website employs cookies and associated technologies, as outlined in our 
                        {" "}<a href="/cookie-policy" target="_blank" rel="noopener noreferrer">cookie policy</a>,
                        to serve various purposes including website functionality, analytics, 
                        improved user experience, and targeted advertising. You have the option to 
                        consent to the use of these technologies, or to customize your preferences 
                        according to your own preferences.
                    </p>
                </div>
                <div className="cookie-actions">
                    <button 
                        className="cookie-btn cookie-btn-decline" 
                        onClick={handleDecline}
                    >
                        Decline
                    </button>
                    <button 
                        className="cookie-btn cookie-btn-accept" 
                        onClick={handleAccept}
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
