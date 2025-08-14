import React from 'react'
import './LuxeBanner.css'
function LuxeBanner() {
    return (
   <>
            <div className="tmxluxe-banner">
                <div className="tmxluxe-container">
                    <div className="tmxluxe-left">
                        <div className="tmxluxe-logo-row">
                            <span className="tmxluxe-logo-mark">TM</span>
                            <span className="tmxluxe-logo-text">Luxe</span>
                        </div>
                        <h1 className="tmxluxe-heading">
                            Where sophistication meets ultimate <span className="tmxluxe-accent">comfort</span>
                        </h1>
                        <p className="tmxluxe-subtext">
                            TM Luxe offers premium hotel services for discerning luxury travelers in major cities and recreational areas. Experience world-class hospitality with unparalleled comfort and exceptional attention to detail.
                        </p>

                        <div className="tmxluxe-cta-row">
                            <a className="tmxluxe-btn tmxluxe-btn-primary" href="#">Explore Properties</a>
                            <a className="tmxluxe-btn tmxluxe-btn-ghost" href="#">Watch Video</a>
                        </div>

                        <div className="tmxluxe-stats">
                            <div className="tmxluxe-stat">
                                <div className="tmxluxe-stat-value">150+</div>
                                <div className="tmxluxe-stat-label">Luxury Properties</div>
                            </div>
                            <div className="tmxluxe-stat">
                                <div className="tmxluxe-stat-value">15k+</div>
                                <div className="tmxluxe-stat-label">Happy Guests</div>
                            </div>
                            <div className="tmxluxe-stat">
                                <div className="tmxluxe-stat-value">4.9</div>
                                <div className="tmxluxe-stat-label">Guest Rating</div>
                            </div>
                        </div>
                    </div>

                    <div className="tmxluxe-right">
                        <div className="tmxluxe-grid">
                            <div className="tmxluxe-grid-large tmxluxe-card">
                                <img src="/l1.png" alt="Lobby" />
                            </div>
                            <div className="tmxluxe-grid-side">
                                <div className="tmxluxe-card"><img src="/l3.png" alt="Pool" /></div>
                                <div className="tmxluxe-card"><img src="/l5.png" alt="Room" /></div>
                            </div>
                            <div className="tmxluxe-grid-wide tmxluxe-card">
                                <img src="/l2.webp" alt="Dining" id='luxe4'/>
                            </div>
                        </div>

                        <div className="tmxluxe-badge">
                            <div className="tmxluxe-badge-icon">⚙</div>
                            <div>
                                <div className="tmxluxe-badge-title">Trusted by</div>
                                <div className="tmxluxe-badge-sub">10,000+ Travelers</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>
            )
}

            export default LuxeBanner